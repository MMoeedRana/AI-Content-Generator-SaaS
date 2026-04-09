import { db } from "@/utils/db";
import { AIOutput, UserSubscription } from "@/utils/schema";
import { and, eq, asc } from "drizzle-orm";
import moment from "moment";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email)
    return NextResponse.json({ totalWords: 0, maxWords: 10000, plan: "free" });

  try {
    // 1. Check Subscription Status
    const sub = await db
      .select()
      .from(UserSubscription)
      .where(
        and(eq(UserSubscription.email, email), eq(UserSubscription.active, true))
      );

    const isPaid = sub.length > 0;
    const maxWords = isPaid ? 100000 : 10000;
    const plan = isPaid ? "paid" : "free";

    // 2. Fetch User's Content History (To find first generation & calculate usage)
    const outputs = await db
      .select()
      .from(AIOutput)
      .where(eq(AIOutput.createdBy, email))
      .orderBy(asc(AIOutput.id)); // Purane records pehle ayenge

    // 3. Determine "Cycle Start Date"
    let cycleStartDate;

    if (isPaid && sub[0].joinDate) {
      // Paid User: Cycle start hoti hai subscription date se
      cycleStartDate = moment(sub[0].joinDate, "DD/MM/YYYY");
    } else if (outputs.length > 0) {
      // Free User: Cycle start hoti hai uski pehli generation ki date se
      cycleStartDate = moment(outputs[0].createdAt, "DD/MM/YYYY");
    } else {
      // New User (No generation yet): Aaj se count shuru karein
      cycleStartDate = moment();
    }

    // 4. Check if 30 days have passed (To Reset Cycle)
    const daysSinceStart = moment().diff(cycleStartDate, 'days');
    
    // Agar 30 din guzar chuke hain, to cycle reset ho chuki hai (Latest 30 days usage)
    if (daysSinceStart > 30) {
        // Professional approach: Last 30 days ki window set kar dein
        cycleStartDate = moment().subtract(30, 'days');
    }

    // 5. Calculate Total Words within this cycle
    const totalWords = outputs.reduce((sum, item) => {
      if (!item.createdAt) return sum;

      const itemDate = moment(item.createdAt, "DD/MM/YYYY");

      // Sirf wo words count karein jo cycle start hone ke baad generate huye hain
      if (itemDate.isSameOrAfter(cycleStartDate, 'day')) {
        return sum + (Number(item.wordCount) || 0);
      }
      return sum;
    }, 0);

    return NextResponse.json({ 
        totalWords, 
        maxWords, 
        plan, 
        cycleStarted: cycleStartDate.format("DD/MM/YYYY"),
        daysRemaining: Math.max(0, 30 - daysSinceStart)
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ totalWords: 0, maxWords: 10000, plan: "free" });
  }
}