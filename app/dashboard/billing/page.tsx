"use client";

import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { Loader2Icon, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect, Suspense } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useCelebration } from "@/hook/useCelebration";

function Billing() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Billing...</div>}>
      <BillingContent />
    </Suspense>
  );
}

function BillingContent() {
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [plan, setPlan] = useState("free");
  const [creditsUsed, setCreditsUsed] = useState(0);
  const [maxWords, setMaxWords] = useState(10000);
  const { user } = useUser();
  
  const searchParams = useSearchParams();
  const { fireSubscription } = useCelebration();

  useEffect(() => {
    if (searchParams.get("success")) {
      fireSubscription();
      toast.success("Welcome to the PRO family! 🎉", {
        description: "Your account has been upgraded successfully.",
        duration: 5000,
      });
    }
  }, [searchParams]);

  const handleStripeCheckout = async () => {
    setLoading(true);
    try {
      const resp = await axios.post("/api/create-stripe-session", {});
      if (resp.data?.url) {
        window.location.href = resp.data.url;
      } else {
        toast.error("Stripe session URL not found.");
      }
    } catch (err) {
      toast.error("Stripe payment initialization failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPlan = async () => {
      if (!user?.primaryEmailAddress?.emailAddress) return;
      setIsInitialLoading(true);
      try {
        const resp = await axios.get("/api/credits-usage", {
          params: { email: user.primaryEmailAddress.emailAddress },
        });
        if (resp.data?.plan) setPlan(resp.data.plan);
        if (resp.data?.totalWords !== undefined) setCreditsUsed(resp.data.totalWords);
        if (resp.data?.maxWords !== undefined) setMaxWords(resp.data.maxWords);
      } catch (error) {
        console.error("Fetch plan error:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };
    fetchPlan();
  }, [user?.primaryEmailAddress?.emailAddress]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 dark:bg-gray-900 transition-all duration-300 min-h-screen">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="font-bold text-3xl md:text-4xl lg:text-5xl text-black dark:text-white tracking-tight">
          Upgrade Your Content Limit
        </h2>
        <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm md:text-base">
          Choose the plan that fits your creative needs and unlock more powerful AI features.
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:max-w-4xl lg:mx-auto">
        {/* Free Plan */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 md:p-8 h-full flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl text-gray-900 dark:text-white font-bold">Free</h3>
            </div>
            <div className="flex justify-center items-baseline py-4">
              <span className="font-extrabold text-5xl text-black dark:text-white">$0</span>
              <span className="text-gray-500 dark:text-gray-400 text-lg ml-1">/month</span>
            </div>
            <ul className="space-y-4 mb-8 mt-6">
              {["10,000 Words/Month", "50+ Content Templates", "Unlimited Download & Copy", "1 Month of History"].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300 text-sm md:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          {isInitialLoading ? (
            <div className="w-full h-14 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl" />
          ) : (
            <Button className="w-full rounded-xl border-none py-6 font-semibold text-white bg-gray-400 dark:bg-gray-700 cursor-default" disabled={true}>
              {plan !== "free" ? "Not Available" : creditsUsed >= maxWords ? "Limit Reached" : "Currently Active Plan"}
            </Button>
          )}
        </div>

        {/* Monthly Plan */}
        <div className={`rounded-2xl bg-white dark:bg-gray-800 border-2 ${plan === 'paid' ? 'border-green-500 shadow-green-100/50' : 'border-indigo-500'} p-6 md:p-8 h-full flex flex-col justify-between shadow-lg relative transition-all duration-500`}>
          {plan === 'paid' && (
             <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md animate-bounce">
                <Sparkles className="w-3 h-3"/> ACTIVE PLAN
             </div>
          )}

          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl text-gray-900 dark:text-white font-bold">Monthly</h3>
            </div>
            <div className="flex justify-center items-baseline py-4">
              <span className="font-extrabold text-5xl text-black dark:text-white">$9.99</span>
              <span className="text-gray-500 dark:text-gray-400 text-lg ml-1">/month</span>
            </div>
            <ul className="space-y-4 mb-8 mt-6">
              {["100,000 Words/Month", "50+ Content Templates", "Unlimited Download & Copy", "1 Year of History"].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300 text-sm md:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {isInitialLoading ? (
            <div className="w-full h-14 bg-indigo-100 dark:bg-indigo-900/30 animate-pulse rounded-xl" />
          ) : (
            <Button
              disabled={loading || plan === "paid"}
              onClick={handleStripeCheckout}
              className={`w-full rounded-xl py-6 text-sm md:text-base font-bold transition-all flex gap-2 items-center justify-center shadow-md active:scale-95
                ${plan === "paid" ? "bg-green-500 hover:bg-green-600 text-white cursor-default" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
            >
              {loading && <Loader2Icon className="animate-spin w-5 h-5" />}
              {plan === "paid" ? "Subscribed (Monthly Plan)" : "Get Started Now"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Billing