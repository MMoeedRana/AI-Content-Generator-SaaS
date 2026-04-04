"use client";

import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import React, { useContext, useEffect, useState } from "react";
import { TotalUsageContext } from "@/app/(context)/TotalUsageContext";
import { UpdateCreditUsageContext } from "@/app/(context)/UpdateCreditUsageContext";
import { toast } from "sonner";
import axios from "axios";
import { Loader2 } from "lucide-react";

function UsageTrack() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const { totalUsage, setTotalUsage } = useContext(TotalUsageContext);
  const [maxWords, setMaxWords] = useState(10000);
  const [plan, setPlan] = useState("free");
  const { updateCreditUsage, setUpdateCreditUsage } = useContext(
    UpdateCreditUsageContext,
  );

  // Fetch total credits used from backend
  React.useEffect(() => {
    const fetchCredits = async () => {
      if (!user?.primaryEmailAddress?.emailAddress) return;
      try {
        // API route to get total words used by user
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
        // ignore
      }
    };
    fetchCredits();
  }, [user?.primaryEmailAddress?.emailAddress]);
  const handleUpgrade = async () => {
    setLoading(true);
    setUpdateCreditUsage(true);
    try {
      const resp = await axios.post("/api/create-stripe-session", {});
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
    setUpdateCreditUsage(false);
  };

  // Show toast when plan changes to paid
  useEffect(() => {
    if (plan === "paid") {
      toast.success(
        "Congratulations! Your subscription is now active. Enjoy premium features.",
      );
    }
  }, [plan]);

  // Helper for credits wording
  const creditsLabel = plan === "paid" ? "credits" : "credits";

  return (
    <div className="m-5">
      <div className="bg-primary text-white p-3 rounded-lg">
        <h2 className="font-medium">Credits</h2>
        <div className="h-2 bg-[#9981f9] w-full rounded-full mt-3">
          <div
            className="h-2 bg-white rounded-full"
            // style={{
            //   width: (totalUsage / maxWords) * 100 + "%",
            // }}
            style={{
              width: Math.min((totalUsage / maxWords) * 100, 100) + "%",
            }}
          ></div>
        </div>
        <h2 className="text-sm my-2">
          {totalUsage}/{maxWords} {creditsLabel} used (
          {plan === "paid" ? "Monthly Plan" : "Free Plan"})
        </h2>
      </div>
      {/* <Button
        variant={"secondary"}
        className="w-full my-3 text-primary"
        onClick={handleUpgrade}
      >
        Upgrade
      </Button> */}
      {plan !== "paid" && (
        <Button
          variant={"secondary"}
          disabled={loading}
          className="w-full my-3 text-primary font-bold transition-all duration-300 
                     hover:bg-white hover:scale-105 active:scale-95 shadow-sm 
                     flex items-center justify-center gap-2"
          onClick={handleUpgrade}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Upgrade Plan"
          )}
        </Button>
      )}
      {plan === "paid" && (
        <Button
          variant={"secondary"}
          className="w-full my-3 text-primary"
          onClick={handleUpgrade}
          disabled={plan === "paid"}
        >
          {loading && <Loader2 className="animate-spin mr-2" />}
          {plan === "paid" ? "Subscribed (Monthly Plan)" : "Upgrade"}
        </Button>
      )}
    </div>
  );
}

export default UsageTrack;
