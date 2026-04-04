import React from 'react'
import { Search } from 'lucide-react'

function SearchSection({onSearchInput}:any) {
  return (
    <div className='p-10 bg-gradient-to-br from-purple-500 via-purple-700 to-blue-600 flex flex-col justify-center items-center text-white transition-colors duration-300'>
      
      <h2 className='text-3xl font-bold'>Browse All templates</h2>
      <p className='text-gray-100 dark:text-gray-300'>What would you like to create today?</p>

      <div className='w-full flex justify-center'>
        <div className='flex gap-2 items-center p-2 border rounded-md bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 my-5 w-[50%] transition-colors'>
          
          <Search className='text-primary dark:text-gray-300' />
          
          <input 
            type="text" 
            placeholder='Search'
            onChange={(event)=>onSearchInput(event.target.value)} 
            className='bg-transparent w-full outline-none text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500'
          />
        </div>
      </div>
    </div>
  )
}

export default SearchSection