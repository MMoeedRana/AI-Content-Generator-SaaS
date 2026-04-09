"use client";
import TemplateCard from './TemplateCard';
import Templates from '@/app/(data)/Templates';
import React, { useEffect, useState } from 'react';

export interface TEMPLATE {
  name: string;
  desc: string;
  icon: string;
  category: string;
  slug: string;
  aiPrompt: string;
  form?: FORM[];
}

export interface FORM {
  label: string;
  field: string;
  name: string;
  required?: boolean;
}

function TemplateListSection({ userSearchInput }: any) {
  const [templateList, setTemplateList] = useState(Templates);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial loading effect
    setLoading(true);
    const timer = setTimeout(() => {
      if (userSearchInput) {
        const filterData = Templates.filter(item =>
          item.name.toLowerCase().includes(userSearchInput.toLowerCase())
        );
        setTemplateList(filterData);
      } else {
        setTemplateList(Templates);
      }
      setLoading(false);
    }, 500); // Chota sa delay loading feel karwane ke liye

    return () => clearTimeout(timer);
  }, [userSearchInput]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-5 md:p-10 bg-white dark:bg-slate-950 transition-colors duration-300 min-h-screen">
      {loading ? (
        // Skeleton Cards - Loop 8 times
        [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div key={item} className="p-5 shadow-sm rounded-md border bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 animate-pulse h-[160px]">
            <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-lg mb-3"></div>
            <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-gray-100 dark:bg-slate-800 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-100 dark:bg-slate-800 rounded w-5/6"></div>
          </div>
        ))
      ) : (
        templateList.map((item: TEMPLATE) => (
          <TemplateCard key={item.slug} {...item} />
        ))
      )}
    </div>
  );
}

export default TemplateListSection