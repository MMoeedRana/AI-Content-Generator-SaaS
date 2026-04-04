import { db } from '@/utils/db';
import { AIOutput, UserSubscription } from '@/utils/schema';
import { currentUser } from '@clerk/nextjs/server';
import { desc, eq, and } from 'drizzle-orm';
import React from 'react';
import HistoryList from './_components/HistoryList';

async function HistoryPage() {
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress || '';

    // Check Plan
    const sub = await db.select().from(UserSubscription)
        .where(and(eq(UserSubscription.email, email), eq(UserSubscription.active, true)));
    
    const plan = sub.length > 0 ? 'paid' : 'free';

    // Fetch All History
    const historyData = await db.select().from(AIOutput)
        .where(eq(AIOutput.createdBy, email))
        .orderBy(desc(AIOutput.id));

    return (
        <div className='m-5 p-10 border rounded-lg bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 min-h-screen transition-colors duration-300'>
            
            <div className='flex justify-between items-center dark:bg-slate-900'>
                
                {/* Title Section */}
                <div className='dark:bg-slate-900'>
                    <h2 className='font-bold text-3xl text-black dark:text-white'>
                        Content History
                    </h2>
                    <p className='text-gray-500 dark:text-gray-400'>
                        Manage and reuse your previous AI generations
                    </p>
                </div>

                {/* Plan Badge */}
                <div className='text-right'>
                   <span 
                     className={`px-4 py-1 rounded-full text-sm font-bold 
                     ${plan === 'paid' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                     }`}
                   >
                        {plan.toUpperCase()} PLAN
                   </span>
                </div>

            </div>
            
            <HistoryList initialHistory={historyData} plan={plan} />
        </div>
    );
}

export default HistoryPage;