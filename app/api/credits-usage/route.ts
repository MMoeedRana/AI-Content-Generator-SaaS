import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { AIOutput } from "@/utils/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  if (!email) return NextResponse.json({ totalWords: 0 });

  // Get all AIOutput for this user
  const outputs = await db
    .select()
    .from(AIOutput)
    .where(eq(AIOutput.createdBy, email));
  // Calculate total words
  const totalWords = outputs.reduce(
    (sum, item) => sum + (item.aiResponse?.split(" ").length || 0),
    0,
  );
  return NextResponse.json({ totalWords });
}
