"use client";

import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import React, { useContext, useEffect, useState } from "react";
import { TotalUsageContext } from "@/app/(context)/TotalUsageContext";
import { UpdateCreditUsageContext } from "@/app/(context)/UpdateCreditUsageContext";
import { toast } from "sonner";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCelebration } from "@/hook/useCelebration";

let isToastShown = false;

function UsageTrack() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true); 
  const { totalUsage, setTotalUsage } = useContext(TotalUsageContext);
  const [maxWords, setMaxWords] = useState(10000);
  const [plan, setPlan] = useState("free");
  const { updateCreditUsage } = useContext(UpdateCreditUsageContext);

  const searchParams = useSearchParams();
  const { fireSubscription } = useCelebration(); // Confetti trigger

  // --- Success / Cancelled Toast & Confetti ---
  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");

    if (success && !isToastShown) {
      fireSubscription(); // Celebration start
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

      if (resp.data?.totalWords !== undefined) {
        setTotalUsage(resp.data.totalWords);
      }
      if (resp.data?.maxWords !== undefined) {
        setMaxWords(resp.data.maxWords);
      }
      if (resp.data?.plan) {
        setPlan(resp.data.plan);
      }
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

  // --- SKELETON UI (Refresh par show hoga) ---
  if (isFetching && totalUsage === 0) {
    return (
      <div className="m-5 animate-pulse">
        <div className="bg-gray-200 dark:bg-slate-800 h-32 rounded-lg p-4">
          <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
          <div className="h-2.5 bg-gray-300 dark:bg-slate-700 rounded-full w-full mb-4"></div>
          <div className="h-3 bg-gray-300 dark:bg-slate-700 rounded w-3/4"></div>
        </div>
        <div className="h-10 bg-gray-200 dark:bg-slate-800 rounded-lg mt-3 w-full"></div>
      </div>
    );
  }

  return (
    <div className="m-5">
      {/* Old UI Background and Colors */}
      <div className="bg-primary text-white p-4 rounded-lg shadow-md transition-all">
        <h2 className="font-medium text-lg">Credits</h2>

        <div className="h-2.5 bg-[#9981f9] w-full rounded-full mt-3 overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-700 ease-in-out"
            style={{
              width: Math.min((totalUsage / maxWords) * 100, 100) + "%",
            }}
          />
        </div>

        <h2 className="text-sm my-3 font-light">
          <span className="font-bold">{totalUsage.toLocaleString()}</span> / {maxWords.toLocaleString()} credits used
          <span className="block text-[11px] mt-1 opacity-80 italic">
            Current Plan: {plan === "paid" ? "Premium Plan Active" : "Free Tier"}
          </span>
        </h2>
      </div>

      {plan !== "paid" ? (
        <Button
          variant={"secondary"}
          disabled={loading}
          className="w-full my-3 text-primary font-bold shadow-sm hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
          onClick={handleUpgrade}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Redirecting...
            </>
          ) : (
            "Upgrade to Pro"
          )}
        </Button>
      ) : (
        /* UI as per your request (Old button style) */
        <Button
          variant={"secondary"}
          className="w-full my-3 text-primary cursor-default opacity-90 font-semibold"
          disabled
        >
          Premium Membership
        </Button>
      )}
    </div>
  );
}

export default UsageTrack;