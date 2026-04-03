import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { UserSubscription } from "@/utils/schema";
import moment from "moment";

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
    const customer_email = session.customer_email!;
    const paymentId = session.payment_intent as string;

    try {
      await db.insert(UserSubscription).values({
        email: customer_email,
        userName: "", // optional — fill via Clerk if needed
        active: true,
        paymentId,
        joinDate: moment().format("DD/MM/YYYY"),
      });
    } catch (e) {
      console.log("DB Insert error:", e);
    }
  }

  return new NextResponse("Webhook received", { status: 200 });
}
