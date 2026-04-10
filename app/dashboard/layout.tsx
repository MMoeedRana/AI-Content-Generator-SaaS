"use client";

import React, { useState, useEffect } from 'react'
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
  const [updateCreditUsage, setUpdateCreditUsage] = useState<any>();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Listen for sidebar collapse changes
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    if (savedState !== null) {
      setIsSidebarCollapsed(savedState === "true");
    }

    const handleSidebarToggle = (event: CustomEvent) => {
      setIsSidebarCollapsed(event.detail.collapsed);
    };

    window.addEventListener('sidebarToggle', handleSidebarToggle as EventListener);
    
    return () => {
      window.removeEventListener('sidebarToggle', handleSidebarToggle as EventListener);
    };
  }, []);

  const handleSidebarCollapse = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  return (
    <TotalUsageContext.Provider value={{ totalUsage, setTotalUsage }}>
      <UpdateCreditUsageContext.Provider value={{ updateCreditUsage, setUpdateCreditUsage }}>
        <div className='bg-slate-100 dark:bg-gray-950 h-screen overflow-x-hidden'>
          {/* Sidebar - fixed width with transition */}
          <div 
            className={`fixed transition-all duration-300 z-50 ${
              isSidebarCollapsed ? 'w-20' : 'w-64'
            }`}
          >
            <SideNav onCollapseChange={handleSidebarCollapse} />
          </div>
          
          {/* Main Content - dynamic margin that changes with collapse */}
          <div 
            className={`flex flex-col min-h-screen transition-all duration-300 ${
              isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
            }`}
          >
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

export default layout