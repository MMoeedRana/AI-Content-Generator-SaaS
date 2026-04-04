import { db } from "@/utils/db";
import { AIOutput } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    await db.delete(AIOutput).where(eq(AIOutput.id, Number(id)));
    return NextResponse.json({ success: true });
}