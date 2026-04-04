"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import moment from 'moment';
import { Trash2, Search, Lock, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Templates from '@/app/(data)/Templates';
import CopyButton from '../_components/CopyButton'; 

function HistoryList({ initialHistory, plan }: any) {
    const [historyList, setHistoryList] = useState(initialHistory);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const filteredHistory = historyList.filter((item: any) => {
        const query = searchTerm.toLowerCase();
        const templateName = Templates.find(t => t.slug === item.templateSlug)?.name.toLowerCase() || '';
        const aiResp = item.aiResponse?.toLowerCase() || '';
        const formData = item.formData?.toLowerCase() || '';
        return aiResp.includes(query) || templateName.includes(query) || formData.includes(query);
    });

    const deleteHistory = async (id: number) => {
        try {
            await axios.delete(`/api/history?id=${id}`);
            setHistoryList(historyList.filter((item: any) => item.id !== id));
            toast.success("History item deleted successfully");
        } catch (err) {
            toast.error("Failed to delete record");
        }
    };

    const handleUpgradeClick = () => {
        toast.info("Redirecting to billing plans...", {
            description: "Choose a plan to unlock your full history."
        });
        router.push('/dashboard/billing');
    };

    const getGroupLabel = (dateStr: string) => {
        const date = moment(dateStr, "DD/MM/YYYY");
        if (date.isSame(moment(), 'day')) return 'Today';
        if (date.isSame(moment().subtract(1, 'day'), 'day')) return 'Yesterday';
        if (date.isAfter(moment().subtract(7, 'days'))) return 'This Week';
        return 'Older Records';
    };

    const displayLimit = plan === 'paid' ? filteredHistory.length : 15;
    const hiddenCount = filteredHistory.length - 15;

    return (
        <div className='mt-5 dark:bg-slate-900'>
            
            {/* Search */}
            <div className='flex gap-2 p-3 border rounded-xl mb-10 items-center bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 focus-within:border-primary transition-all shadow-sm'>
                <Search className='text-primary h-5 w-5 dark:text-gray-300' />
                <input 
                    type="text" 
                    placeholder='Search keyword, template, or your input...' 
                    className='outline-none w-full bg-transparent text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className='space-y-4'>
                {filteredHistory.length === 0 ? (
                    
                    /* Empty State */
                    <div className='flex flex-col items-center justify-center p-20 border-2 border-dashed rounded-2xl bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-center'>
                        <SearchX className='h-12 w-12 text-gray-300 dark:text-gray-600 mb-4' />
                        <h2 className='text-xl font-semibold text-gray-700 dark:text-white'>No matching records</h2>
                        <p className='text-gray-500 dark:text-gray-400 mt-2 max-w-xs'>
                            We couldn't find anything matching <span className='font-bold text-primary'>"{searchTerm}"</span>.
                        </p>
                        <Button variant="outline" className='mt-5 dark:border-slate-600 dark:text-white' onClick={() => setSearchTerm('')}>
                            Clear Search
                        </Button>
                    </div>

                ) : (
                    filteredHistory.slice(0, displayLimit).map((item: any, index: number) => (
                        <div key={item.id}>
                            
                            {/* Group Label */}
                            {(index === 0 || getGroupLabel(item.createdAt) !== getGroupLabel(filteredHistory[index - 1].createdAt)) && (
                                <h3 className='font-bold text-lg text-primary mb-4 mt-8 pb-1 border-b border-gray-200 dark:border-slate-700'>
                                    {getGroupLabel(item.createdAt)}
                                </h3>
                            )}

                            {/* Row */}
                            <div className='grid grid-cols-7 my-5 py-3 px-3 items-center hover:bg-gray-50 dark:hover:bg-slate-800 transition-all rounded-lg'>
                                
                                <div className='col-span-2 flex gap-2 items-center'>
                                    <Image 
                                        src={Templates.find(t => t.slug === item.templateSlug)?.icon || '/icon.png'} 
                                        width={25} 
                                        height={25} 
                                        alt='icon' 
                                    />
                                    <span className='font-medium text-[16px] text-black dark:text-white'>
                                        {Templates.find(t => t.slug === item.templateSlug)?.name}
                                    </span>
                                </div>

                                <div className='col-span-2 line-clamp-3 mr-3 text-[16px] text-gray-700 dark:text-gray-300 leading-relaxed'>
                                    {item.aiResponse}
                                </div>

                                <div className='text-[16px] text-gray-600 dark:text-gray-400'>
                                    {item.createdAt}
                                </div>

                                <div className='text-[16px] font-medium text-gray-600 dark:text-gray-400'>
                                    {item.aiResponse?.split(/\s+/).filter(Boolean).length} words
                                </div>

                                <div className='flex gap-4 justify-end pr-2'>
                                    <CopyButton aiResponse={item.aiResponse} />
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="hover:text-red-600 dark:hover:text-red-500" 
                                        onClick={() => deleteHistory(item.id)}
                                    >
                                        <Trash2 className='h-5 w-5' />
                                    </Button>
                                </div>
                            </div>

                            <hr className='border-gray-100 dark:border-slate-700'/>
                        </div>
                    ))
                )}
            </div>

            {/* Upgrade Banner */}
            {plan !== 'paid' && hiddenCount > 0 && (
                <div className='mt-12 p-10 border-2 border-dashed border-primary/20 rounded-2xl bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 flex flex-col items-center text-center'>
                    <div className='bg-primary/10 p-3 rounded-xl mb-4'>
                        <Lock className='h-6 w-6 text-primary' />
                    </div>
                    <h2 className='text-lg font-bold text-gray-800 dark:text-white'>+ {hiddenCount} Hidden Records</h2>
                    <p className='text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm'>
                        Unlock your complete generation history and access all previous chats with our Pro Plan.
                    </p>
                    <Button 
                        className='bg-primary hover:bg-primary/90 px-8 shadow-lg'
                        onClick={handleUpgradeClick}
                    >
                        Upgrade to Pro Plan
                    </Button>
                </div>
            )}
        </div>
    );
}

export default HistoryList;