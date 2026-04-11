"use client";

import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useCelebration } from "@/hook/useCelebration";
import { TotalUsageContext } from "@/app/(context)/TotalUsageContext";
import React, { useContext, useEffect, useState, Suspense } from "react";
import { UpdateCreditUsageContext } from "@/app/(context)/UpdateCreditUsageContext";

let isToastShown = false;

interface UsageTrackProps {
  isCollapsed?: boolean;
}

function UsageTrack({ isCollapsed = false }: UsageTrackProps) {
  return (
    <Suspense fallback={
      <div className={`animate-pulse bg-gray-200 dark:bg-slate-800 rounded-lg ${isCollapsed ? "h-24" : "h-32"}`}>
        {!isCollapsed && (
          <div className="p-3">
            <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-1/2 mb-3"></div>
            <div className="h-2 bg-gray-300 dark:bg-slate-700 rounded-full w-full mb-3"></div>
            <div className="h-3 bg-gray-300 dark:bg-slate-700 rounded w-3/4"></div>
          </div>
        )}
      </div>
    }>
      <UsageTrackContent isCollapsed={isCollapsed} />
    </Suspense>
  );
}

function UsageTrackContent({ isCollapsed }: { isCollapsed: boolean }) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true); 
  const { totalUsage, setTotalUsage } = useContext(TotalUsageContext);
  const [maxWords, setMaxWords] = useState(10000);
  const [plan, setPlan] = useState("free");
  const { updateCreditUsage } = useContext(UpdateCreditUsageContext);

  const searchParams = useSearchParams();
  const { fireSubscription } = useCelebration();

  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");

    if (success && !isToastShown) {
      fireSubscription();
      toast.success("Payment successful! Your plan is active.");
      isToastShown = true;
    }
    if (canceled) toast.error("Payment cancelled.");
  }, [searchParams, fireSubscription]);

  const fetchCredits = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;
    setIsFetching(true); 
    try {
      const resp = await axios.get("/api/credits-usage", {
        params: { email: user.primaryEmailAddress.emailAddress },
      });
      if (resp.data?.totalWords !== undefined) setTotalUsage(resp.data.totalWords);
      if (resp.data?.maxWords !== undefined) setMaxWords(resp.data.maxWords);
      if (resp.data?.plan) setPlan(resp.data.plan);
    } catch (err) {
      console.error("Error fetching credits:", err);
    } finally {
      setIsFetching(false); 
    }
  };

  useEffect(() => {
    fetchCredits();
  }, [user?.primaryEmailAddress?.emailAddress, updateCreditUsage]);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const resp = await axios.post("/api/create-stripe-session");
      if (resp.data?.url) {
        window.location.href = resp.data.url;
      } else {
        toast.error("Stripe session URL not found.");
        setLoading(false);
      }
    } catch (err) {
      toast.error("Stripe payment initialization failed.");
      setLoading(false);
    }
  };

  const percentage = Math.min((totalUsage / maxWords) * 100, 100);

  // Collapsed View
  if (isCollapsed) {
    if (isFetching && totalUsage === 0) {
      return (
        <div className="animate-pulse">
          <div className="bg-gray-200 dark:bg-slate-800 h-20 rounded-lg"></div>
        </div>
      );
    }

    return (
      <div className="relative group">
        <div className="bg-primary text-white p-3 rounded-lg shadow-md transition-all">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="relative w-12 h-12">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="text-white/30"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - percentage / 100)}`}
                  className="text-white transition-all duration-700 ease-in-out"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {Math.round(percentage)}%
                </span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs font-bold">{totalUsage.toLocaleString()}</div>
              <div className="text-[10px] opacity-80">/ {maxWords.toLocaleString()}</div>
            </div>
          </div>
          
          {/* Tooltip */}
          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none shadow-xl whitespace-nowrap">
            <div className="font-semibold mb-1">Credits Usage</div>
            <div>{totalUsage.toLocaleString()} / {maxWords.toLocaleString()} used</div>
            <div className="text-[10px] text-gray-300 mt-1">
              {plan === "paid" ? "Premium Plan Active" : "Free Tier"}
            </div>
          </div>
        </div>
        
        {plan !== "paid" && (
          <Button
            variant={"secondary"}
            disabled={loading}
            className="w-full mt-2 text-primary font-bold shadow-sm hover:scale-[1.02] transition-transform flex items-center justify-center gap-1 text-xs py-2 h-auto"
            onClick={handleUpgrade}
          >
            {loading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              "Upgrade"
            )}
          </Button>
        )}
      </div>
    );
  }

  // Original Expanded View
  if (isFetching && totalUsage === 0) {
    return (
      <div className="animate-pulse">
        <div className="bg-gray-200 dark:bg-slate-800 rounded-lg p-3">
          <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-1/2 mb-3"></div>
          <div className="h-2 bg-gray-300 dark:bg-slate-700 rounded-full w-full mb-3"></div>
          <div className="h-3 bg-gray-300 dark:bg-slate-700 rounded w-3/4"></div>
        </div>
        <div className="h-9 bg-gray-200 dark:bg-slate-800 rounded-lg mt-2 w-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="bg-primary text-white p-3 rounded-lg shadow-md transition-all">
        <h2 className="font-medium text-sm">Credits</h2>
        <div className="h-2 bg-[#9981f9] w-full rounded-full mt-2 overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-700 ease-in-out"
            style={{ width: percentage + "%" }}
          />
        </div>
        <div className="text-xs my-2 font-light">
          <span className="font-bold">{totalUsage.toLocaleString()}</span> / {maxWords.toLocaleString()} credits used
          <span className="block text-[10px] mt-1 opacity-80 italic">
            Current Plan: {plan === "paid" ? "Premium Plan Active" : "Free Tier"}
          </span>
        </div>
      </div>

      {plan !== "paid" ? (
        <Button
          variant={"secondary"}
          disabled={loading}
          className="w-full text-primary font-bold shadow-sm hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 text-sm py-2 h-auto"
          onClick={handleUpgrade}
        >
          {loading ? (
            <><Loader2 className="h-3 w-3 animate-spin" /> Redirecting...</>
          ) : ("Upgrade to Pro")}
        </Button>
      ) : (
        <Button variant={"secondary"} className="w-full text-primary cursor-default opacity-90 font-semibold text-sm py-2 h-auto" disabled>
          Premium Membership
        </Button>
      )}
    </div>
  );
}

export default UsageTrack