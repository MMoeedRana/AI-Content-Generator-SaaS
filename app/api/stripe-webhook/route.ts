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
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle successful checkout
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    // Stripe session metadata should have userId (set in create-stripe-session)
    const userId = session.metadata?.userId || null;
    const customer_email = session.customer_email ?? "";
    const paymentId = session.payment_intent as string | null;
    const userName = session.metadata?.userName || "";

    try {
      // Find existing subscription
      // Only check if email is present
      let existing = [];
      if (customer_email) {
        existing = await db
          .select()
          .from(UserSubscription)
          .where(eq(UserSubscription.email, customer_email));
      }

      // Insert or update
      if (!existing.length && customer_email) {
        await db.insert(UserSubscription).values({
          email: customer_email,
          userName,
          active: true,
          paymentId,
          joinDate: moment().format("DD/MM/YYYY"),
        });
      } else if (customer_email) {
        await db
          .update(UserSubscription)
          .set({
            active: true,
            paymentId,
            joinDate: moment().format("DD/MM/YYYY"),
          })
          .where(eq(UserSubscription.email, customer_email));
      }
    } catch (e) {
      console.log("DB Insert/Update error:", e);
    }
  }

  return new NextResponse("Webhook received", { status: 200 });
}
