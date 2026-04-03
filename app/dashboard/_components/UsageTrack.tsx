"use client";

import { db } from '@/utils/db';
import { eq } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';
import { AIOutput } from '@/utils/schema';
import { HISTORY } from '../history/page';
import { Button } from '@/components/ui/button'
import React, { useContext, useEffect, useState } from 'react'
import { TotalUsageContext } from '@/app/(context)/TotalUsageContext';
import { UpdateCreditUsageContext } from '@/app/(context)/UpdateCreditUsageContext';

function UsageTrack() {

  const {user}=useUser();
  const {totalUsage,setTotalUsage}=useContext(TotalUsageContext);
  const [maxWords,setMaxWords]=useState(10000);
  const {updateCreditUsage,setUpdateCreditUsage}=useContext(UpdateCreditUsageContext);

  return (
    <div className='m-5'>
      <div className='bg-primary text-white p-3 rounded-lg'>
        <h2 className='font-medium'>Credits</h2>
        <div className='h-2 bg-[#9981f9] w-full rounded-full mt-3'>
          <div className='h-2 bg-white rounded-full'
          style={{
            width:(totalUsage/maxWords)*100+"%"
          }}
          ></div>
        </div>
        <h2 className='text-sm my-2'>{totalUsage}/{maxWords} credit used</h2>
      </div>
      <Button variant={'secondary'} className='w-full my-3 text-primary'>Upgrade</Button>
    </div>
  )
}

export default UsageTrack