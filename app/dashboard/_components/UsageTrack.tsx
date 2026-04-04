"use client";

import { eq } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { AIOutput } from "@/utils/schema";
import { HISTORY } from "../history/page";
import { Button } from "@/components/ui/button";
import React, { useContext, useEffect, useState } from "react";
import { TotalUsageContext } from "@/app/(context)/TotalUsageContext";
import { UpdateCreditUsageContext } from "@/app/(context)/UpdateCreditUsageContext";
import { toast } from "sonner";
import axios from "axios";

function UsageTrack() {
  const { user } = useUser();
  const { totalUsage, setTotalUsage } = useContext(TotalUsageContext);
  const [maxWords, setMaxWords] = useState(10000);
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
      } catch (err) {
        // ignore
      }
    };
    fetchCredits();
  }, [user?.primaryEmailAddress?.emailAddress]);
  const handleUpgrade = async () => {
    setUpdateCreditUsage(true);
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
    setUpdateCreditUsage(false);
  };

  return (
    <div className="m-5">
      <div className="bg-primary text-white p-3 rounded-lg">
        <h2 className="font-medium">Credits</h2>
        <div className="h-2 bg-[#9981f9] w-full rounded-full mt-3">
          <div
            className="h-2 bg-white rounded-full"
            style={{
              width: (totalUsage / maxWords) * 100 + "%",
            }}
          ></div>
        </div>
        <h2 className="text-sm my-2">
          {totalUsage}/{maxWords} credit used
        </h2>
      </div>
      <Button
        variant={"secondary"}
        className="w-full my-3 text-primary"
        onClick={handleUpgrade}
      >
        Upgrade
      </Button>
    </div>
  );
}

export default UsageTrack;
