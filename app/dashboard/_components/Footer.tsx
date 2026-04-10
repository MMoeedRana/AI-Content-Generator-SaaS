"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Github, Twitter, Linkedin, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full p-6 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 md:gap-6">
        
        {/* Left: Branding & Copyright */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            {/* Light Mode Logo */}
            <Image 
              src="/logo.png" 
              alt="GenFlow AI Logo" 
              width={1000}
              height={1000}
              className="block dark:hidden w-auto h-12" 
              priority
            />
            {/* Dark Mode Logo */}
            <Image 
              src="/logo-dark.png" 
              alt="GenFlow AI Logo Dark" 
              width={140} 
              height={60}
              className="hidden dark:block w-auto h-12" 
              priority
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {currentYear} All rights reserved.
          </p>
        </div>

        {/* Center: Links */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
          <Link href="/dashboard" className="hover:text-primary transition-colors">Home</Link>
          <Link href="/dashboard/history" className="hover:text-primary transition-colors">History</Link>
          <Link href="/dashboard/billing" className="hover:text-primary transition-colors">Billing</Link>
          <Link href="/dashboard/analytics" className="hover:text-primary transition-colors">Analytics</Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
        </div>

        {/* Right: Social Icons & Credits */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <div className="flex gap-4">
            <Link href="#" className="p-2 rounded-full bg-gray-50 dark:bg-slate-800 hover:bg-primary/10 transition-all">
              <Twitter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </Link>
            <Link href="#" className="p-2 rounded-full bg-gray-50 dark:bg-slate-800 hover:bg-primary/10 transition-all">
              <Github className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </Link>
            <Link href="#" className="p-2 rounded-full bg-gray-50 dark:bg-slate-800 hover:bg-primary/10 transition-all">
              <Linkedin className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </Link>
          </div>
          <p className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
            Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> by M Moeed
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer