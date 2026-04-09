"use client";

import React, { useState } from 'react'
import SideNav from './_components/SideNav';
import Header from './_components/Header';
import { TotalUsageContext } from '../(context)/TotalUsageContext';
import { UpdateCreditUsageContext } from '../(context)/UpdateCreditUsageContext';
import Footer from './_components/Footer';
import WelcomeBanner from './_components/WelcomeBanner';
import { ToastContainer } from 'react-toastify';
// @ts-ignore
import 'react-toastify/dist/ReactToastify.css';

function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [totalUsage, setTotalUsage] = useState<Number>(0);
  const [userSubscription, setUserSubscription] = useState<boolean>(false);
  const [updateCreditUsage, setUpdateCreditUsage] = useState<any>()

  return (
    <TotalUsageContext.Provider value={{ totalUsage, setTotalUsage }}>
      <UpdateCreditUsageContext.Provider value={{ updateCreditUsage, setUpdateCreditUsage }}>
        <div className='bg-slate-100 dark:bg-gray-950 h-screen overflow-x-hidden'>
          <div className='md:w-64 hidden md:block fixed'>
            <SideNav />
          </div>
          <div className='md:ml-64 flex flex-col min-h-screen'>
            <Header />
            
            <main className="flex-grow">
              {children}
            </main>

            {/* Welcome Banner yahan render hoga */}
            <WelcomeBanner />

            <ToastContainer position="top-right" autoClose={1500} hideProgressBar />
            <Footer />
          </div>
        </div>
      </UpdateCreditUsageContext.Provider>
    </TotalUsageContext.Provider>
  )
}

export default layout;