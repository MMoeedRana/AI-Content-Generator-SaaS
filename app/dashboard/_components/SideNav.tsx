"use client";

import Image from "next/image";
import UsageTrack from "./UsageTrack";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BarChart3Icon, FileClock, Home, MessageSquareHeart, Settings, WalletCards } from "lucide-react";

interface MenuItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const SideNav: React.FC = ({ closeMenu }: { closeMenu?: () => void }) => {
  const MenuList: MenuItem[] = [
    {
      name: "Home",
      icon: Home,
      path: "/dashboard",
    },
    {
      name: "History",
      icon: FileClock,
      path: "/dashboard/history",
    },
    {
      name: "Billing",
      icon: WalletCards,
      path: "/dashboard/billing",
    },
    {
      name: "Analytics",
      icon: BarChart3Icon,
      path: "/dashboard/analytics",
    },
    {
      name: "Feedback",
      icon: MessageSquareHeart,
      path: "/dashboard/feedback",
    },
    {
      name: "Setting",
      icon: Settings,
      path: "/dashboard/setting",
    },
  ];

  const path = usePathname();

  const isActive = (menuPath: string) => {
    if (menuPath === "/dashboard") {
      return (
        path === "/dashboard" ||
        path.startsWith("/dashboard/content")
      );
    }

    return path.startsWith(menuPath);
  };

  return (
    <div className="h-screen relative p-5 shadow-sm border bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 transition-colors duration-300">
      
      {/* Logo */}
      <div className="flex justify-center mb-4">
        {/* Light Mode Logo */}
        <Image
          src="/logo.png"
          alt="GenFlow AI Logo"
          width={140}
          height={60}
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

      {/* Divider */}
      <hr className="my-6 border-gray-300 dark:border-slate-600" />

      {/* Menu */}
      <div className="mt-3">
        {MenuList.map((menu) => (
          <Link href={menu.path} key={menu.path} onClick={closeMenu}>
            <div
              className={`flex gap-2 mb-2 p-3 rounded-lg cursor-pointer items-center transition-colors duration-200
              
              text-gray-700 dark:text-gray-300
              hover:bg-primary hover:text-white
              dark:hover:bg-primary dark:hover:text-white
              
              ${isActive(menu.path) ? "bg-primary text-white" : ""}
              `}
            >
              <menu.icon className="h-6 w-6" />
              <h2 className="text-lg">{menu.name}</h2>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom Usage */}
      <div className="absolute bottom-15 left-0 w-full">
        <UsageTrack />
      </div>
    </div>
  );
};

export default SideNav