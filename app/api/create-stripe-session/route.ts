// /app/api/create-stripe-session/route.ts
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST() {
  const { userId } = await auth();
  const user = await currentUser(); // Clerk se user details nikalne ke liye

  if (!userId || !user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const userEmail = user.primaryEmailAddress?.emailAddress;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    customer_email: userEmail, // Pehle se email fill karne ke liye
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
    metadata: {
      userId: userId,
      userEmail: userEmail || "",
      userName: user.fullName || ""
    },
  });

  return NextResponse.json({ url: session.url });
}