import { db } from "@/utils/db";
import { AIOutput, UserSubscription } from "@/utils/schema";
import { and, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import moment from "moment";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    try {
        // 1. Fetch all user data
        const allData = await db.select().from(AIOutput)
            .where(eq(AIOutput.createdBy, email));

        // 2. Weekly Usage Data (Last 7 Days)
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = moment().subtract(i, 'days').format("DD/MM/YYYY");
            const dayName = moment().subtract(i, 'days').format("ddd");
            
            const dayWords = allData
                .filter(item => item.createdAt === date)
                .reduce((sum, item) => sum + (Number(item.wordCount) || 0), 0);
            
            last7Days.push({ name: dayName, words: dayWords });
        }

        // 3. Template Distribution (Pie Chart)
        const templateMap: any = {};
        allData.forEach(item => {
            const template = item.templateSlug || 'Other';
            templateMap[template] = (templateMap[template] || 0) + 1;
        });

        const templateStats = Object.keys(templateMap).map(key => ({
            name: key.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            value: templateMap[key]
        })).slice(0, 5); // Top 5 templates

        // 4. Summary Stats
        const totalWords = allData.reduce((sum, item) => sum + (Number(item.wordCount) || 0), 0);
        const totalGenerations = allData.length;

        return NextResponse.json({
            weeklyData: last7Days,
            templateStats: templateStats,
            totalWords,
            totalGenerations,
        });

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
    }
}