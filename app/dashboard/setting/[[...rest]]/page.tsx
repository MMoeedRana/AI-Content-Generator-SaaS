"use client"

import React from 'react'
import { UserProfile } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { useTheme } from 'next-themes' 

function Settings() {
  const { theme } = useTheme();

  return (
    <div className='flex items-center justify-center min-h-[85vh] p-2 md:p-5 transition-all duration-300 overflow-x-hidden'>
      <UserProfile 
        appearance={{
          baseTheme: theme === 'dark' ? dark : undefined,
          variables: {
            colorPrimary: '#7c3aed', 
          },
          elements: {
            rootBox: "w-full flex justify-center",
            card: "shadow-none border dark:border-slate-800 bg-white dark:bg-slate-900 w-full max-w-full md:max-w-[1000px]",
            navbar: "bg-gray-50 dark:bg-slate-950/50 hidden md:flex",
            headerTitle: "dark:text-white text-xl md:text-2xl",
            headerSubtitle: "dark:text-gray-400 text-sm",
            profileSectionTitleText: "dark:text-white font-bold",
            breadcrumbsItem: "dark:text-gray-300",
            accordionTriggerButton: "dark:text-white dark:hover:bg-slate-800",
            userPreviewMainIdentifier: "dark:text-white font-semibold",
            userPreviewSecondaryIdentifier: "dark:text-gray-400",
            formButtonPrimary: "bg-primary hover:bg-primary/90 transition-all w-full md:w-auto",
            formFieldLabel: "dark:text-gray-300 text-xs md:text-sm",
            formFieldInput: "dark:bg-slate-950 dark:border-slate-800 dark:text-white text-sm",
            navbarMobileMenuButton: "dark:text-white", 
            scrollBox: "rounded-none md:rounded-lg",
            pageScrollBox: "p-4 md:p-8"
          }
        }}
      /> 
    </div>
  )
}

export default Settings