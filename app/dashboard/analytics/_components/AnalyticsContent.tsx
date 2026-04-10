"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import {
  TrendingUp, Zap, FileText, Lock, Sparkles, Clock, BarChart3, Loader2Icon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "sonner";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

export default function AnalyticsContent() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [stripeLoading, setStripeLoading] = useState(false);
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

  const handleStripeCheckout = async () => {
    setStripeLoading(true);
    try {
      const resp = await axios.post("/api/create-stripe-session", {});
      if (resp.data?.url) {
        window.location.href = resp.data.url;
      }
    } catch (err) {
      toast.error("Failed to initiate payment.");
    } finally {
      setStripeLoading(false);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 bg-gray-50 dark:bg-slate-950 min-h-screen transition-all duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
            <div className="p-2 bg-primary/10 rounded-xl">
               <BarChart3 className="h-7 w-7 text-primary shrink-0" />
            </div>
            <span className="truncate">
               {user?.firstName ? `${user.firstName}'s Insights` : "Insights Dashboard"}
            </span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm md:text-base ml-12">
            Real-time performance of your GenFlow AI content.
          </p>
        </div>

        {!isPremium && (
          <Button 
            onClick={handleStripeCheckout}
            disabled={stripeLoading}
            className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white gap-2 shadow-xl hover:scale-105 transition-all py-6 px-8 rounded-2xl"
          >
            {stripeLoading ? <Loader2Icon className="animate-spin h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
            Unlock Pro Analytics
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Total Words" value={stats?.totalWords?.toLocaleString() || 0} icon={<FileText className="text-blue-500" />} trend="Lifetime" />
        <StatCard title="Generations" value={stats?.totalGenerations || 0} icon={<Zap className="text-yellow-500" />} trend="Active" />
        <StatCard title="Efficiency" value={`${stats?.totalGenerations > 0 ? Math.round(stats?.totalWords / stats?.totalGenerations) : 0} w/g`} icon={<TrendingUp className="text-green-500" />} trend="Avg" />
        <StatCard title="Time Saved" value={`${Math.round((stats?.totalWords || 0) / 200)}h`} icon={<Clock className="text-purple-500" />} trend="Estimated" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-slate-800 relative shadow-sm overflow-hidden group">
          <h3 className="font-bold text-lg mb-6 dark:text-white flex items-center gap-2">
             Weekly Content Flow
          </h3>
          {!isPremium && <LockOverlay message="Unlock Usage Trends" onUpgrade={handleStripeCheckout} loading={stripeLoading} />}

          <div className={`h-[300px] w-full transition-all duration-700 ${!isPremium ? "blur-xl grayscale opacity-30 scale-95" : ""}`}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.weeklyData}>
                <defs>
                  <linearGradient id="colorWords" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#33415510" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)", backgroundColor: "#1e293b", color: "#fff" }}
                />
                <Area type="monotone" dataKey="words" stroke="#6366f1" strokeWidth={4} fill="url(#colorWords)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <h3 className="font-bold text-lg mb-6 dark:text-white">Top Categories</h3>
          {!isPremium && <LockOverlay message="Unlock Breakdown" onUpgrade={handleStripeCheckout} loading={stripeLoading} />}
          <div className={`h-[300px] flex flex-col justify-between transition-all duration-700 ${!isPremium ? "blur-xl opacity-30" : ""}`}>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={stats?.templateStats} innerRadius={60} outerRadius={80}
                  paddingAngle={8} dataKey="value"
                  stroke="none"
                >
                  {stats?.templateStats?.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 mt-4 overflow-y-auto max-h-[100px] pr-2 custom-scrollbar">
              {stats?.templateStats?.map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className="flex items-center gap-2 dark:text-gray-300">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                    {item.name}
                  </span>
                  <span className="font-bold dark:text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Optimized Helper Components
function StatCard({ title, value, icon, trend }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-slate-800 hover:border-primary/40 transition-all group shadow-sm">
      <div className="flex justify-between items-center">
        <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl group-hover:scale-110 transition-transform duration-300">{icon}</div>
        <span className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-tighter">{trend}</span>
      </div>
      <div className="mt-5">
        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">{title}</p>
        <h2 className="text-3xl font-bold mt-1 tracking-tight dark:text-white">{value}</h2>
      </div>
    </div>
  );
}

function LockOverlay({ message, onUpgrade, loading }: { message: string, onUpgrade: () => void, loading: boolean }) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/10 dark:bg-slate-900/10 backdrop-blur-[2px] p-6">
      <div className="bg-white/80 dark:bg-slate-800/90 p-8 rounded-3xl shadow-2xl border border-white/20 text-center animate-in fade-in zoom-in duration-500 max-w-[240px]">
        <div className="bg-indigo-500/10 p-3 rounded-full w-fit mx-auto mb-4">
          <Lock className="h-6 w-6 text-indigo-500" />
        </div>
        <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2">{message}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">Premium insights are reserved for PRO members.</p>
        <Button 
          size="sm" 
          onClick={onUpgrade}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-5 shadow-lg shadow-indigo-500/30"
        >
          {loading ? <Loader2Icon className="animate-spin h-4 w-4" /> : "Upgrade Now"}
        </Button>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-950">
       <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-primary animate-spin"></div>
          <BarChart3 className="h-8 w-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
       </div>
       <p className="mt-6 text-gray-500 dark:text-gray-400 font-medium animate-pulse">Calculating GenFlow Analytics...</p>
    </div>
  );
}