"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Monitor,
  Target,
  Users,
  TrendingUp,
  Clock
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalInteractions: 1240,
    activeScreens: 12,
    brandPartners: 5,
    avgEngagement: "3.2m"
  });

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) router.push("/admin");
  }, [router]);

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-100 p-8 flex flex-col gap-12">
        <h2 className="text-2xl font-black tracking-tighter">HOLI ADMIN</h2>

        <nav className="flex flex-col gap-4">
          <button className="flex items-center gap-3 font-bold text-zinc-900 bg-zinc-50 p-4 rounded-xl">
            <BarChart3 size={20} /> Dashboard
          </button>
          <button className="flex items-center gap-3 font-medium text-zinc-500 p-4 rounded-xl hover:bg-zinc-50 transition-colors">
            <Monitor size={20} /> Screens
          </button>
          <button className="flex items-center gap-3 font-medium text-zinc-500 p-4 rounded-xl hover:bg-zinc-50 transition-colors">
            <Target size={20} /> Campaigns
          </button>
          <button className="flex items-center gap-3 font-medium text-zinc-500 p-4 rounded-xl hover:bg-zinc-50 transition-colors">
            <Users size={20} /> Publishers
          </button>
        </nav>

        <button
          onClick={() => {
            localStorage.removeItem("admin_token");
            router.push("/admin");
          }}
          className="mt-auto text-zinc-400 font-bold text-xs uppercase tracking-widest hover:text-red-500 transition-colors"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 bg-zinc-50/50 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight">Analytics Overview</h1>
            <p className="text-zinc-500 font-medium">Monitoring real-time engagement across Mumbai</p>
          </div>
          <div className="bg-white border border-zinc-200 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="font-bold text-sm tracking-tight text-zinc-600">LIVE: 124 ACTIVE USERS</span>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          {[
            { label: "Interactions", val: stats.totalInteractions, icon: TrendingUp, color: "text-blue-500" },
            { label: "Active Screens", val: stats.activeScreens, icon: Monitor, color: "text-purple-500" },
            { label: "Brand Slots", val: stats.brandPartners, icon: Target, color: "text-orange-500" },
            { label: "Avg Session", val: stats.avgEngagement, icon: Clock, color: "text-green-500" },
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm">
              <div className={`mb-4 w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center ${item.color}`}>
                <item.icon size={24} />
              </div>
              <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-1">{item.label}</p>
              <h3 className="text-4xl font-black tracking-tighter">{item.val}</h3>
            </div>
          ))}
        </div>

        {/* Placeholder for real charts */}
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-3xl border border-zinc-100 shadow-sm h-96 flex items-center justify-center text-zinc-300 font-bold uppercase tracking-widest border-dashed">
            Engagement Heatmap
          </div>
          <div className="bg-white p-10 rounded-3xl border border-zinc-100 shadow-sm h-96 flex items-center justify-center text-zinc-300 font-bold uppercase tracking-widest border-dashed">
            Color Preference
          </div>
        </div>
      </main>
    </div>
  );
}
