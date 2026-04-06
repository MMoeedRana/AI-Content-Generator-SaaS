"use client";

import Image from "next/image";
import UsageTrack from "./UsageTrack";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FileClock, Home, Settings, WalletCards } from "lucide-react";

interface MenuItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const SideNav: React.FC = () => {
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
      name: "Setting",
      icon: Settings,
      path: "/dashboard/setting",
    },
  ];

  const path = usePathname();

  useEffect(() => {
    console.log(path);
  }, [path]);

  return (
    <div className="h-screen relative p-5 shadow-sm border bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 transition-colors duration-300">
      
      {/* Logo */}
      <div className="flex justify-center">
        <Image src="/logo.svg" alt="logo" width={100} height={100} />
      </div>

      {/* Divider */}
      <hr className="my-6 border-gray-300 dark:border-slate-600" />

      {/* Menu */}
      <div className="mt-3">
        {MenuList.map((menu) => (
          <Link href={menu.path} key={menu.path}>
            <div
              className={`flex gap-2 mb-2 p-3 rounded-lg cursor-pointer items-center transition-colors duration-200
              
              text-gray-700 dark:text-gray-300
              hover:bg-primary hover:text-white
              dark:hover:bg-primary dark:hover:text-white
              
              ${path.startsWith(menu.path) && "bg-primary text-white"}
              `}
            >
              <menu.icon className="h-6 w-6" />
              <h2 className="text-lg">{menu.name}</h2>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom Usage */}
      <div className="absolute bottom-10 left-0 w-full">
        <UsageTrack />
      </div>
    </div>
  );
};

export default SideNav;