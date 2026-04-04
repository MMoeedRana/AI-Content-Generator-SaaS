import { db } from "@/utils/db";
import { AIOutput, UserSubscription } from "@/utils/schema";
import { and, eq } from "drizzle-orm";
import moment from "moment";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  
  if (!email)
    return NextResponse.json({ totalWords: 0, maxWords: 10000, plan: "free" });

  // 1. Check subscription (Same as yours)
  const sub = await db
    .select()
    .from(UserSubscription)
    .where(
      and(eq(UserSubscription.email, email), eq(UserSubscription.active, true))
    );

  let maxWords = 10000;
  let plan = "free";
  if (sub.length > 0) {
    maxWords = 100000; // 100k for paid
    plan = "paid";
  }

  // 2. Optimized Word Calculation
  const outputs = await db
    .select()
    .from(AIOutput)
    .where(eq(AIOutput.createdBy, email));

  const now = moment();
  
  const totalWords = outputs.reduce((sum, item) => {
    // Safety check: Make sure createdAt exists
    if (!item.createdAt) return sum;

    // Parse logic: Match the format you saved in SaveInDb ('DD/MM/yyyy')
    const itemDate = moment(item.createdAt, "DD/MM/YYYY");
    
    if (itemDate.isSame(now, "month") && itemDate.isSame(now, "year")) {
      const words = item.aiResponse ? item.aiResponse.split(/\s+/).filter(Boolean).length : 0;
      return sum + words;
    }
    return sum;
  }, 0);

  return NextResponse.json({ totalWords, maxWords, plan });
}