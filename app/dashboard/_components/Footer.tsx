"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Github, Twitter, Linkedin, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="p-6 bg-white dark:bg-slate-900 border-t-2 border-gray-100 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Left: Branding & Copyright */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="logo" width={30} height={30} />
            <span className="font-bold text-lg text-primary dark:text-purple-400">
              PromptForge
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {currentYear} All rights reserved.
          </p>
        </div>

        {/* Center: Quick Links */}
        <div className="flex gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
          <Link href="/dashboard" className="hover:text-primary transition-colors">Home</Link>
          <Link href="/dashboard/history" className="hover:text-primary transition-colors">History</Link>
          <Link href="/dashboard/billing" className="hover:text-primary transition-colors">Billing</Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
        </div>

        {/* Right: Social Icons & Made With */}
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

export default Footer;