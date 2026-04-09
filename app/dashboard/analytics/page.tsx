"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Zap,
  FileText,
  Lock,
  Sparkles,
  Clock,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F"];

function AnalyticsDashboard() {
  const { user } = useUser(); 
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const email = user?.primaryEmailAddress?.emailAddress;

      const planRes = await axios.get("/api/credits-usage?email=" + email);
      setIsPremium(planRes.data.plan === "paid");

      const analyticsRes = await axios.get("/api/analytics?email=" + email);
      setStats(analyticsRes.data);
    } catch (err) {
      console.error("Error fetching analytics", err);
    } finally {
      setLoading(false);
    }
  };

  // Corrected Loading State with full screen height
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-950 px-4 text-center">
        <div className="animate-pulse flex flex-col items-center">
           <BarChart3 className="h-16 w-16 text-gray-300 mb-4" />
           <p className="text-gray-500 font-medium text-xl">
             Gathering your insights...
           </p>
           <p className="text-gray-400 text-sm mt-2">Please wait while we calculate your performance.</p>
        </div>
      </div>
    );

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 bg-gray-50 dark:bg-slate-950 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="w-full md:w-auto">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
            <BarChart3 className="h-7 w-7 md:h-8 md:w-8 text-primary shrink-0" />
            <span className="truncate">
              {user?.firstName
                ? `${user.firstName}'s Analytics`
                : "Your Analytics"}
            </span>
          </h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">
            Hi {user?.firstName || "there"}! Here is your AI performance.
          </p>
        </div>

        {!isPremium && (
          <Button className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white gap-2 shadow-lg hover:scale-105 transition-all text-sm">
            <Sparkles className="h-4 w-4" /> Upgrade for Details
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Words"
          value={stats?.totalWords?.toLocaleString() || 0}
          icon={<FileText className="text-blue-500" />}
          trend="Lifetime"
        />
        <StatCard
          title="Generations"
          value={stats?.totalGenerations || 0}
          icon={<Zap className="text-yellow-500" />}
          trend="Active"
        />
        <StatCard
          title="Avg Words/Gen"
          value={
            stats?.totalGenerations > 0
              ? Math.round(stats?.totalWords / stats?.totalGenerations)
              : 0
          }
          icon={<TrendingUp className="text-green-500" />}
          trend="Efficiency"
        />
        <StatCard
          title="Work Hours Saved"
          value={`${Math.round((stats?.totalWords || 0) / 200)}h`}
          icon={<Clock className="text-purple-500" />}
          trend="Est."
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-4 md:p-6 rounded-2xl border border-gray-200 dark:border-slate-800 relative shadow-sm transition-all hover:shadow-md overflow-hidden">
          <h3 className="font-bold text-base md:text-lg mb-6 dark:text-white">
            Weekly Content Velocity
          </h3>
          {!isPremium && <LockOverlay message="Unlock Usage Trends" />}

          <div
            className={`h-[250px] md:h-[300px] w-full ${!isPremium ? "blur-md grayscale opacity-50" : ""}`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stats?.weeklyData}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorWords" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#33415510"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    backgroundColor: "#1e293b",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  itemStyle={{ color: "#fff" }}
                />
                <Area
                  type="monotone"
                  dataKey="words"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fill="url(#colorWords)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Template Pie Chart */}
        <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm relative transition-all hover:shadow-md overflow-hidden">
          <h3 className="font-bold text-base md:text-lg mb-6 dark:text-white">
            Top Templates
          </h3>
          {!isPremium && <LockOverlay message="Unlock Category Stats" />}

          <div
            className={`h-[250px] md:h-[300px] ${!isPremium ? "blur-md grayscale opacity-50" : ""}`}
          >
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={stats?.templateStats}
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats?.templateStats?.map((_: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2 max-h-[100px] overflow-y-auto pr-2 custom-scrollbar">
              {stats?.templateStats?.map((item: any, i: number) => (
                <div
                  key={i}
                  className="flex justify-between text-[11px] md:text-xs"
                >
                  <span className="flex items-center gap-2 dark:text-gray-300 truncate mr-2">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[i] }}
                    ></div>
                    <span className="truncate">{item.name}</span>
                  </span>
                  <span className="font-bold dark:text-white shrink-0">
                    {item.value} Gen
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stats Card Component
function StatCard({ title, value, icon, trend }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl border border-gray-200 dark:border-slate-800 hover:border-primary/50 transition-all group shadow-sm">
      <div className="flex justify-between items-center">
        <div className="p-2 bg-gray-50 dark:bg-slate-800 rounded-lg group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className="text-[9px] md:text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 md:py-1 rounded-full uppercase tracking-wider">
          {trend}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
          {title}
        </p>
        <h2 className="text-2xl md:text-3xl font-bold mt-1 tracking-tight dark:text-white truncate">
          {value}
        </h2>
      </div>
    </div>
  );
}

// Lock Overlay Component
function LockOverlay({ message }: { message: string }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-[4px] rounded-2xl transition-all p-4">
      <div className="bg-white dark:bg-slate-800 p-5 md:p-6 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 text-center animate-in zoom-in duration-300 max-w-[240px] md:max-w-none">
        <div className="bg-primary/10 p-2 md:p-3 rounded-full w-fit mx-auto mb-3">
          <Lock className="h-5 w-5 md:h-6 md:w-6 text-primary" />
        </div>
        <h4 className="text-sm md:text-base font-bold text-gray-900 dark:text-white">
          {message}
        </h4>
        <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-1 mb-4">
          Upgrade to Premium to visualize your detailed AI performance.
        </p>
        <Button
          size="sm"
          className="w-full bg-primary hover:bg-primary/90 text-white shadow-md text-xs"
        >
          Upgrade Now
        </Button>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;