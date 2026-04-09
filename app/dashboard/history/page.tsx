import { db } from '@/utils/db';
import { AIOutput, UserSubscription } from '@/utils/schema';
import { currentUser } from '@clerk/nextjs/server';
import { desc, eq, and, sql, ilike, or } from 'drizzle-orm';
import React from 'react';
import HistoryList from './_components/HistoryList';

async function HistoryPage({ searchParams }: any) {
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress || '';

    // Search aur Pagination Params
    const page = Number(searchParams?.page) || 0;
    const searchTerm = searchParams?.search || ''; // URL se search term uthayen
    const limit = 10;
    const offset = page * limit;

    // Fetch Plan
    const sub = await db.select().from(UserSubscription)
        .where(and(eq(UserSubscription.email, email), eq(UserSubscription.active, true)));
    const plan = sub.length > 0 ? 'paid' : 'free';

    // Search Condition: CreatedBy + (AI Response mein text ho YA Template Slug mein text ho)
    const searchFilter = searchTerm 
        ? and(
            eq(AIOutput.createdBy, email),
            or(
                ilike(AIOutput.aiResponse, `%${searchTerm}%`),
                ilike(AIOutput.templateSlug, `%${searchTerm}%`)
            )
          )
        : eq(AIOutput.createdBy, email);

    // Fetch Total Count based on Search
    const totalCountRes = await db.select({ count: sql<number>`count(*)` })
        .from(AIOutput)
        .where(searchFilter);
    const totalRecords = totalCountRes[0]?.count || 0;

    // Fetch Data based on Search + Pagination
    const historyData = await db.select().from(AIOutput)
        .where(searchFilter)
        .limit(limit)
        .offset(offset)
        .orderBy(desc(AIOutput.id));

    return (
        <div className='m-5 p-5 md:p-10 border rounded-lg bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 min-h-screen transition-all duration-300'>
            <div className='flex flex-wrap justify-between items-start gap-4 mb-5'>
                <div>
                    <h2 className='font-bold text-3xl text-black dark:text-white tracking-tight'>Content History</h2>
                    <p className='text-gray-500 dark:text-gray-400 mt-1'>
                        {searchTerm ? `Found ${totalRecords} results for "${searchTerm}"` : `Total ${totalRecords} generations found`}
                    </p>
                </div>
                <div className='pt-2'>
                   <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest shadow-sm ${plan === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30'}`}>
                        {plan.toUpperCase()} PLAN
                   </span>
                </div>
            </div>
            
            <HistoryList 
                initialHistory={historyData} 
                currentPage={page} 
                totalRecords={totalRecords}
                limit={limit}
                dbSearchTerm={searchTerm} 
            />
        </div>
    );
}

export default HistoryPage