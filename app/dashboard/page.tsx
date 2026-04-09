"use client";

import React, { useState, useEffect } from 'react'
import SearchSection from './_components/SearchSection'
import TemplateListSection from './_components/TemplateListSection'
import { useCelebration } from '@/hook/useCelebration'; // Import hook
import { useUser } from '@clerk/nextjs'

function Dashboard() {
  const [userSearchInput, setUserSearchInput] = useState<string>()
  const { fireWelcome } = useCelebration();
  const { user } = useUser();

  useEffect(() => {
    // Check if it's the first time user is arriving after signup
    const isNewUser = localStorage.getItem('welcome_shown');
    if (user && !isNewUser) {
      fireWelcome();
      localStorage.setItem('welcome_shown', 'true'); // Taake har refresh par na ho
    }
  }, [user]);
  
  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen transition-colors duration-300">
      <SearchSection onSearchInput={(value: string) => setUserSearchInput(value)} />
      <TemplateListSection userSearchInput={userSearchInput} />
    </div>
  )
}

export default Dashboard