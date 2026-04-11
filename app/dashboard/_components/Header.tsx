"use client";

import axios from "axios";
import Link from "next/link"; 
import SideNav from "./SideNav";
import { ModeToggle } from "./ModeToggle";
import React, { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { Menu, Search, MessageSquareHeart } from "lucide-react"; 
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [planLoading, setPlanLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkPlan = async () => {
      if (user?.primaryEmailAddress?.emailAddress) {
        setPlanLoading(true);
        try {
          const resp = await axios.get("/api/credits-usage", {
            params: { email: user.primaryEmailAddress.emailAddress },
          });
          if (resp.data?.plan === "paid") {
            setIsPremium(true);
          }
        } catch (error) {
          console.error("Error checking plan in header:", error);
        } finally {
          setPlanLoading(false);
        }
      }
    };
    checkPlan();
  }, [user]);

  return (
    <div
      className={`sticky top-0 p-5 flex justify-between items-center transition-all duration-300 z-50
      ${
        isScrolled
          ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-md border-b dark:border-slate-700"
          : "bg-white dark:bg-slate-900 border-b-2 border-gray-200 dark:border-slate-700 shadow-sm"
      }`}
    >
      {/* Mobile Menu */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Menu className="cursor-pointer text-gray-600 dark:text-gray-300" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SideNav />
          </SheetContent>
        </Sheet>
      </div>

      {/* Search Input */}
      <div className="hidden sm:flex gap-2 items-center p-2 border rounded-md max-w-lg bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 transition-colors">
        <Search className="text-gray-500 dark:text-gray-300" />
        <input
          type="text"
          placeholder="Search..."
          className="outline-none bg-transparent text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 w-full"
        />
      </div>

      {/* Right Section */}
      <div className="flex gap-3 md:gap-5 items-center">
        <div className="hidden lg:block">
          {planLoading ? (
            <div className="h-6 w-56 bg-gray-200 dark:bg-slate-700 animate-pulse rounded-full"></div>
          ) : (
            <h2
              className={`p-1 rounded-full text-xs text-white px-3 transition-all duration-500 ${
                isPremium
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 shadow-sm"
                  : "bg-primary dark:bg-purple-600"
              }`}
            >
              {isPremium
                ? "✨ Pro Member: Unlimited Access Enabled"
                : "🔥 Join Membership just for $9.99/Month"}
            </h2>
          )}
        </div>
        <Link href="/dashboard/feedback" title="Give Feedback">
          <div className="p-2 bg-gray-100 dark:bg-slate-800 rounded-full cursor-pointer hover:bg-primary/10 transition-all group border dark:border-slate-700">
            <MessageSquareHeart className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors" />
          </div>
        </Link>
        <ModeToggle />
        <UserButton />
      </div>
    </div>
  );
}

export default Header