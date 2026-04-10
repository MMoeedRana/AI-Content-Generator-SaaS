"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { BarChart3 } from "lucide-react";

const AnalyticsContent = dynamic(() => import("./_components/AnalyticsContent"), {
  ssr: false,
  
  loading: () => <LoadingFallback />
});

export default function AnalyticsDashboard() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AnalyticsContent />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-950 px-4 text-center">
      <div className="animate-pulse flex flex-col items-center">
        <BarChart3 className="h-16 w-16 text-gray-300 mb-4" />
        <p className="text-gray-500 font-medium text-xl text-slate-900 dark:text-white">
          Gathering your insights...
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Please wait while we calculate your performance.
        </p>
      </div>
    </div>
  );
}