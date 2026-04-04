"use client"

import React from 'react'
import { Search } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { ModeToggle } from './ModeToggle'

function Header() {
  return (
    <div className='p-5 shadow-sm border-b-2 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 flex justify-between items-center transition-colors duration-300'>
      
      {/* Search Box */}
      <div className='flex gap-2 items-center p-2 border rounded-md max-w-lg bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 transition-colors'>
        <Search className='text-gray-500 dark:text-gray-300'/>
        <input 
          type="text" 
          placeholder='Search...' 
          className='outline-none bg-transparent text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500'
        />
      </div>

      {/* Right Section */}
      <div className='flex gap-5 items-center'>
        
        {/* Membership Badge */}
        <h2 className='bg-primary p-1 rounded-full text-xs text-white px-2 dark:bg-purple-600 transition-colors'>
          🔥Join Membership just for $9.99/Month
        </h2>

        {/* 🌙 Mode Toggle Added Here */}
        <ModeToggle />

        {/* User */}
        <UserButton/>
      </div>
    </div>
  )
}

export default Header