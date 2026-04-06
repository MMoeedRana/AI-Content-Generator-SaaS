"use client";

import axios from "axios";
import moment from "moment";
import { db } from "@/utils/db";
import { useUser } from "@clerk/nextjs";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useContext, useState, useEffect } from "react";
import { toast } from "sonner";

function Billing() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState("free");
  const [creditsUsed, setCreditsUsed] = useState(0);
  const [maxWords, setMaxWords] = useState(10000);
  const { user } = useUser();

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
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchPlan = async () => {
      if (!user?.primaryEmailAddress?.emailAddress) return;
      try {
        const resp = await axios.get("/api/credits-usage", {
          params: { email: user.primaryEmailAddress.emailAddress },
        });
        if (resp.data?.plan) setPlan(resp.data.plan);
        if (resp.data?.totalWords !== undefined)
          setCreditsUsed(resp.data.totalWords);
        if (resp.data?.maxWords !== undefined) setMaxWords(resp.data.maxWords);
      } catch {}
    };
    fetchPlan();
  }, [user?.primaryEmailAddress?.emailAddress]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 dark:bg-gray-900">
      <h2 className="text-center font-bold text-4xl my-5 text-black dark:text-white">
        Upgrade With Monthly Plan
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Free Plan */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 h-full flex flex-col justify-between">
          <div>
            <div className="text-center mb-4">
              <h3 className="text-lg text-gray-900 dark:text-white font-semibold">
                Free
              </h3>
            </div>

            <div className="flex justify-center items-center py-3">
              <span className="font-bold text-4xl text-black dark:text-white text-center">
                0$
              </span>
              <span className="text-gray-900 dark:text-gray-300 text-md">
                /month
              </span>
            </div>

            <ul className="space-y-3 mb-6">
              {["10,000 Words/Month","50+ Content Templates","Unlimited Download & Copy","1 Month of History"].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M12 10c-3 0-6 1.79-6 3s3 3 6 3s6-1.79 6-3s-3-3-6-3z" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button
            className="mt-8 w-[80%] mx-auto rounded-full border px-8 py-3 text-sm font-medium text-white bg-gray-500 border-indigo-600 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 flex items-center justify-center"
            disabled={plan !== "free" || creditsUsed >= maxWords}
          >
            {plan !== "free"
              ? "Not Available"
              : creditsUsed >= maxWords
              ? "Limit Reached"
              : "Currently Active Plan"}
          </Button>
        </div>

        {/* Monthly Plan */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 h-full flex flex-col justify-between">
          <div>
            <div className="text-center mb-4">
              <h3 className="text-lg text-gray-900 dark:text-white font-semibold">
                Monthly
              </h3>
            </div>

            <div className="flex justify-center items-center py-3">
              <span className="font-bold text-4xl text-black dark:text-white">
                9.99$
              </span>
              <span className="text-gray-900 dark:text-gray-300 text-md">
                /month
              </span>
            </div>

            <ul className="space-y-3 mb-6">
              {["100,000 Words/Month","50+ Content Templates","Unlimited Download & Copy","1 Year of History"].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M12 10c-3 0-6 1.79-6 3s3 3 6 3s6-1.79 6-3s-3-3-6-3z" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button
            disabled={loading || plan === "paid"}
            onClick={handleStripeCheckout}
            className="mt-8 w-[80%] mx-auto rounded-full border px-8 py-3 text-sm font-medium text-indigo-600 dark:text-white bg-white hover:text-white dark:bg-indigo-600 border-indigo-600 hover:border-indigo-700 dark:hover:bg-indigo-700 flex gap-2 items-center justify-center"
          >
            {loading && <Loader2Icon className="animate-spin" />}
            {plan === "paid" ? "Subscribed (Monthly Plan)" : "Get Started"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Billing;