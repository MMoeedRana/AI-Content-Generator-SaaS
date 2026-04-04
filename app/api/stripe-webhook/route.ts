// app/api/stripe-webhook/route.ts
import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { UserSubscription } from "@/utils/schema";
import moment from "moment";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get("stripe-signature")!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Signature Verification Failed: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle successful checkout
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Sab se safe email source: customer_details
    const userEmail = session.customer_details?.email || session.metadata?.userEmail;
    const userName = session.metadata?.userName || "";
    const paymentId = session.subscription as string; // Subscriptions mein subscription ID hoti hai

    if (!userEmail) {
      return new NextResponse("User Email not found", { status: 400 });
    }

    try {
      // Find existing subscription
      const existing = await db
        .select()
        .from(UserSubscription)
        .where(eq(UserSubscription.email, userEmail));

      if (existing.length === 0) {
        // Naya record insert karein
        await db.insert(UserSubscription).values({
          email: userEmail,
          userName: userName,
          active: true,
          paymentId: paymentId,
          joinDate: moment().format("DD/MM/YYYY"),
        });
        console.log(`New subscription created for ${userEmail}`);
      } else {
        // Purana record update karein
        await db
          .update(UserSubscription)
          .set({
            active: true,
            paymentId: paymentId,
            joinDate: moment().format("DD/MM/YYYY"),
          })
          .where(eq(UserSubscription.email, userEmail));
        console.log(`Subscription updated for ${userEmail}`);
      }
    } catch (e) {
      console.error("Database Update Error:", e);
      return new NextResponse("Database Error", { status: 500 });
    }
  }

  return new NextResponse("Webhook handled successfully", { status: 200 });
}