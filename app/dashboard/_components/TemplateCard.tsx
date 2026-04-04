import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { TEMPLATE } from './TemplateListSection'

function TemplateCard(item:TEMPLATE) {
  return (
    <Link href={'/dashboard/content/'+item?.slug}>
      <div className='p-5 shadow-md rounded-md border bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 flex flex-col gap-3 cursor-pointer hover:scale-105 transition-all duration-300'>
        
        <Image src={item.icon} alt='icon' width={50} height={50} />
        
        <h2 className='font-medium text-lg text-black dark:text-white'>
          {item.name}
        </h2>
        
        <p className='text-gray-500 dark:text-gray-400 line-clamp-3'>
          {item.desc}
        </p>
      </div>
    </Link>
  )
}

export default TemplateCard