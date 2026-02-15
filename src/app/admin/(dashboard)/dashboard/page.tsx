"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Monitor,
  Target,
  Users,
  TrendingUp,
  Clock,
  Activity,
  Plus,
  ArrowUpRight,
  LogOut,
  Bell,
  Search,
  LayoutDashboard,
  Layers,
  Sparkles
} from "lucide-react";
import { io, Socket } from "socket.io-client";

interface Interaction {
  id: string;
  color: string;
  userName?: string;
  timestamp: string;
  screen?: { name: string };
  campaign?: { brand: { name: string } };
}

interface Campaign {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  brand: { name: string; logoUrl?: string };
}

interface Stats {
  totalInteractions: number;
  totalScreens: number;
  totalBrands: number;
  activeCampaigns: number;
  recentInteractions: Interaction[];
  recentCampaigns: Campaign[];
  screenStats: { name: string, count: number }[];
}

function StatCard({ label, value, icon: Icon, trend, color }: {
  label: string;
  value: string | number;
  icon: any;
  trend: string;
  color: string;
}) {
  return (
    <div className="bg-white border border-zinc-100 p-8 rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 transition-all duration-500 group">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl bg-zinc-50 group-hover:scale-110 transition-transform duration-500`}>
          <Icon size={24} className="text-zinc-900" />
        </div>
        <span className={`text-[10px] font-bold px-3 py-1 bg-zinc-50 border border-zinc-100 rounded-full text-zinc-500`}>
          {trend}
        </span>
      </div>
      <div>
        <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{label}</p>
        <h3 className="text-3xl font-black text-zinc-900 tracking-tighter">{value}</h3>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [liveInteractions, setLiveInteractions] = useState<Interaction[]>([]);

  useEffect(() => {
    fetchStats();

    // Setup Socket for live updates
    const socket: Socket = io();

    socket.on("connect", () => {
      console.log("Connected to live billboard feed");
      socket.emit("join-admin");
    });

    socket.on("color_splash", (data: any) => {
      const newInteraction: Interaction = {
        id: Math.random().toString(),
        color: data.color,
        userName: data.userName,
        timestamp: new Date().toISOString(),
        screen: { name: data.screenName },
        campaign: { brand: { name: data.brandName } }
      };

      setLiveInteractions(prev => [newInteraction, ...prev].slice(0, 5));

      // Update stats incrementally
      setStats(prev => prev ? {
        ...prev,
        totalInteractions: prev.totalInteractions + 1
      } : null);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats(data);
      setLiveInteractions(data.recentInteractions.slice(0, 5));
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-zinc-100 border-t-zinc-900 rounded-full animate-spin" />
          <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest animate-pulse">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-12 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <header className="flex justify-between items-end mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2 text-zinc-400">
            <TrendingUp size={14} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Real-time analytics</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-zinc-900">
            Command <span className="holi-gradient-text">Center</span>
          </h1>
        </div>

        <div className="flex gap-4">
          <button className="h-14 w-14 bg-white rounded-2xl border border-zinc-100 flex items-center justify-center hover:bg-zinc-50 transition-colors shadow-sm">
            <Search size={22} className="text-zinc-400" />
          </button>
          <button className="h-14 w-14 bg-white rounded-2xl border border-zinc-100 flex items-center justify-center hover:bg-zinc-50 transition-colors shadow-sm relative">
            <Bell size={22} className="text-zinc-400" />
            <span className="absolute top-4 right-4 w-2 h-2 bg-[#0060FF] rounded-full border-2 border-white" />
          </button>
          <Link href="/admin/campaigns">
            <button className="h-14 px-8 bg-zinc-900 text-white rounded-2xl flex items-center gap-3 font-bold hover:bg-zinc-800 transition-colors shadow-xl shadow-zinc-900/10">
              <Plus size={20} />
              New Campaign
            </button>
          </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          label="Total Throws"
          value={stats.totalInteractions.toLocaleString()}
          icon={Activity}
          trend="+12%"
          color="bg-blue-50"
        />
        <StatCard
          label="Connected Screens"
          value={stats.totalScreens}
          icon={Monitor}
          trend="Active"
          color="bg-emerald-50"
        />
        <StatCard
          label="Live Campaigns"
          value={stats.activeCampaigns}
          icon={Target}
          trend="Ongoing"
          color="bg-orange-50"
        />
        <StatCard
          label="Brand Partners"
          value={stats.totalBrands}
          icon={Users}
          trend="Trusted"
          color="bg-purple-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Live Activity Feed */}
        <div className="col-span-1 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black tracking-tight text-zinc-900">Live Feed</h3>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-50 border border-zinc-100 rounded-full">
              <div className="w-1.5 h-1.5 bg-[#FF00FF] rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Now</span>
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {liveInteractions.length > 0 ? (
                liveInteractions.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    layout
                    className="bg-white border border-zinc-100 p-6 rounded-[32px] group hover:border-zinc-200 transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-2xl shadow-inner border border-zinc-100 group-hover:scale-110 transition-transform duration-500"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="font-extrabold text-zinc-900 text-base tracking-tight">{item.userName || "Guest User"}</p>
                          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Just now</span>
                        </div>
                        <p className="text-xs text-zinc-500 font-medium mt-1 leading-relaxed">
                          Splashed <span className="font-bold" style={{ color: item.color }}>{item.color}</span> at <span className="text-zinc-900 font-bold">{item.screen?.name || "Main Screen"}</span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 rounded-[40px] bg-zinc-50/50">
                  <Sparkles size={32} className="text-zinc-200 mb-4" />
                  <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Waiting for splashes...</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Performance Chart & Recent Data */}
        <div className="col-span-1 lg:col-span-2 space-y-12">
          {/* Real Screen Stats */}
          <div className="bg-white border border-zinc-100 p-10 rounded-[48px] shadow-sm relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-10">
              <ArrowUpRight className="text-zinc-200 group-hover:text-zinc-400 transition-colors" size={32} />
            </div>

            <h3 className="text-3xl font-black text-zinc-900 mb-2 tracking-tighter">Hotspots</h3>
            <p className="text-zinc-400 mb-12 font-medium">Screen interaction volume by location</p>

            <div className="space-y-10">
              {stats.screenStats.length > 0 ? stats.screenStats.map((screen, i) => {
                const maxCount = Math.max(...stats.screenStats.map(s => s.count)) || 1;
                const percentage = (screen.count / maxCount) * 100;

                return (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-extrabold text-zinc-900 tracking-tight">{screen.name}</span>
                      <span className="text-2xl font-black text-zinc-900 tracking-tighter">{screen.count.toLocaleString()}</span>
                    </div>
                    <div className="h-4 bg-zinc-50 rounded-full overflow-hidden border border-zinc-100">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1.5, delay: i * 0.1, ease: "circOut" }}
                        className={`h-full bg-gradient-to-r ${i % 2 === 0 ? 'from-[#FF00FF] to-[#0060FF]' : 'from-[#0060FF] to-[#FF9933]'} rounded-full`}
                      />
                    </div>
                  </div>
                );
              }) : (
                <div className="h-48 flex items-center justify-center bg-zinc-50 rounded-3xl">
                  <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">No screen data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Campaign Summary Table */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black tracking-tight text-zinc-900">Recent Campaigns</h3>
              <Link href="/admin/campaigns">
                <button className="text-[10px] font-bold text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-widest border-b border-transparent hover:border-zinc-900">View All</button>
              </Link>
            </div>

            <div className="bg-white border border-zinc-100 rounded-[40px] overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-zinc-50/50 border-b border-zinc-100 text-zinc-400 text-[10px] uppercase font-bold tracking-widest">
                  <tr>
                    <th className="px-10 py-5">Brand & Campaign</th>
                    <th className="px-10 py-5">Status</th>
                    <th className="px-10 py-5 text-right">Settings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {stats.recentCampaigns.length > 0 ? (
                    stats.recentCampaigns.map((campaign) => (
                      <tr key={campaign.id} className="group hover:bg-zinc-50/50 transition-colors">
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center font-black text-zinc-300 text-xl">
                              {campaign.brand.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-extrabold text-zinc-900 text-base tracking-tight">{campaign.name}</p>
                              <p className="text-xs text-zinc-400 font-medium">{campaign.brand.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-widest">
                            Live
                          </span>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <Link href="/admin/campaigns">
                            <button className="text-zinc-300 hover:text-zinc-900 transition-colors p-2">
                              <BarChart3 size={20} />
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-10 py-20 text-center">
                        <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">No recent campaigns found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



