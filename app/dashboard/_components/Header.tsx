"use client";
import React, { useState, useEffect } from "react";
import { Menu, Search } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./ModeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SideNav from "./SideNav";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll detect karne ke liye effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      className={`sticky top-0 p-5 flex justify-between items-center transition-all duration-300 z-50
      ${isScrolled 
        ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-md border-b dark:border-slate-700" 
        : "bg-white dark:bg-slate-900 border-b-2 border-gray-200 dark:border-slate-700 shadow-sm"
      }`}
    >
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
        <h2 className="hidden lg:block bg-primary p-1 rounded-full text-xs text-white px-2 dark:bg-purple-600 transition-colors">
          🔥Join Membership just for $9.99/Month
        </h2>

        <ModeToggle />
        <UserButton />
      </div>
    </div>
  );
}

export default Header