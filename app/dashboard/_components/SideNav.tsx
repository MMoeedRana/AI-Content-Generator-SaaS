"use client";

import Link from "next/link";
import Image from "next/image";
import UsageTrack from "./UsageTrack";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { BarChart3Icon, FileClock, Home, Settings, WalletCards, ChevronLeft, ChevronRight } from "lucide-react";

interface MenuItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

interface SideNavProps {
  onCollapseChange?: (collapsed: boolean) => void;
  closeMenu?: () => void;
}

const SideNav: React.FC<SideNavProps> = ({ onCollapseChange, closeMenu }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load saved state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    if (savedState !== null) {
      const collapsed = savedState === "true";
      setIsCollapsed(collapsed);
      if (onCollapseChange) onCollapseChange(collapsed);
    }
  }, []);

  const handleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", String(newState));
    if (onCollapseChange) onCollapseChange(newState);
    
    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent("sidebarToggle", { detail: { collapsed: newState } }));
  };

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
        path.startsWith("/dashboard/content") ||
        path === "/dashboard/feedback"
      );
    }
    return path.startsWith(menuPath);
  };

  return (
    <div 
      className={`h-screen relative shadow-sm border bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 transition-all duration-300 flex flex-col ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={handleCollapse}
        className="absolute -right-3 top-20 z-50 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-full p-1.5 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {/* Logo Section */}
      <div className={`flex justify-center ${isCollapsed ? "pt-6 pb-3" : "pt-6 pb-3"}`}>
        {!isCollapsed ? (
          <>
            <Image
              src="/logo.png"
              alt="GenFlow AI Logo"
              width={140}
              height={60}
              className="block dark:hidden w-auto h-12"
              priority
            />
            <Image
              src="/logo-dark.png"
              alt="GenFlow AI Logo Dark"
              width={140}
              height={60}
              className="hidden dark:block w-auto h-12"
              priority
            />
          </>
        ) : (
          <>
            <Image
              src="/icon.png"
              alt="GenFlow AI Icon"
              width={40}
              height={40}
              className="block dark:hidden w-auto h-10"
              priority
            />
            <Image
              src="/icon-dark.png"
              alt="GenFlow AI Icon Dark"
              width={40}
              height={40}
              className="hidden dark:block w-auto h-10"
              priority
            />
          </>
        )}
      </div>

      {/* Divider */}
      <hr className={`border-gray-300 dark:border-slate-600 ${isCollapsed ? "mx-3 my-2" : "mx-5 my-2"}`} />

      {/* Menu Items */}
      <div className={`flex-1 ${isCollapsed ? "px-2 mt-4" : "px-5 mt-4"}`}>
        {MenuList.map((menu) => (
          <Link href={menu.path} key={menu.path} onClick={closeMenu}>
            <div className="relative group">
              <div
                className={`flex gap-2 mb-2 p-3 rounded-lg cursor-pointer items-center transition-colors duration-200
                  text-gray-700 dark:text-gray-300
                  hover:bg-primary hover:text-white
                  dark:hover:bg-primary dark:hover:text-white
                  ${isActive(menu.path) ? "bg-primary text-white" : ""}
                  ${isCollapsed ? "justify-center" : ""}
                `}
              >
                <menu.icon className="h-5 w-5" />
                {!isCollapsed && <h2 className="text-base">{menu.name}</h2>}
              </div>
              
              {/* Tooltip for collapsed mode */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none shadow-lg">
                  {menu.name}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Usage Track */}
      <div className={`${isCollapsed ? "px-2 pb-4" : "px-4 pb-4"} mt-auto`}>
        <UsageTrack isCollapsed={isCollapsed} />
      </div>
    </div>
  );
};

export default SideNav