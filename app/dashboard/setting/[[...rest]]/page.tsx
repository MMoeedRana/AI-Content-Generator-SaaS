"use client"
import React from 'react'
import { UserProfile } from '@clerk/nextjs'
import { dark } from '@clerk/themes' // Clerk ki dark theme import karein
import { useTheme } from 'next-themes' // Theme check karne ke liye

function Settings() {
  const { theme } = useTheme();

  return (
    <div className='flex items-center justify-center min-h-[80vh] p-5 transition-all duration-300'>
      <UserProfile 
        appearance={{
          baseTheme: theme === 'dark' ? dark : undefined,
          variables: {
            colorPrimary: '#7c3aed', // Aapke brand ka primary purple color
          },
          elements: {
            card: "shadow-none border dark:border-slate-800 bg-white dark:bg-slate-900",
            navbar: "bg-gray-50 dark:bg-slate-950/50",
            headerTitle: "dark:text-white",
            headerSubtitle: "dark:text-gray-400",
            profileSectionTitleText: "dark:text-white font-bold",
            breadcrumbsItem: "dark:text-gray-300",
            accordionTriggerButton: "dark:text-white dark:hover:bg-slate-800",
            userPreviewMainIdentifier: "dark:text-white",
            userPreviewSecondaryIdentifier: "dark:text-gray-400",
            formButtonPrimary: "bg-primary hover:bg-primary/90 transition-all",
            formFieldLabel: "dark:text-gray-300",
            formFieldInput: "dark:bg-slate-950 dark:border-slate-800 dark:text-white",
          }
        }}
      /> 
    </div>
  )
}

export default Settings