"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

interface Stats {
  totalInteractions: number;
  totalScreens: number;
  totalBrands: number;
  activeCampaigns: number;
  recentInteractions: Interaction[];
  screenStats: { name: string, count: number }[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [liveInteractions, setLiveInteractions] = useState<Interaction[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin");
      return;
    }

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
  }, [router]);

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
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
          <p className="text-zinc-500 font-medium animate-pulse">Initializing Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex font-[family-name:var(--font-outfit)] selection:bg-white/20">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 flex flex-col p-8 bg-zinc-950/50 backdrop-blur-xl sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-gradient-to-br from-white to-zinc-500 rounded-xl flex items-center justify-center">
            <Sparkles className="text-black" size={20} />
          </div>
          <h2 className="text-xl font-bold tracking-tighter uppercase italic">OOH-Matic</h2>
        </div>

        <nav className="flex flex-col gap-2">
          <NavItem icon={LayoutDashboard} label="Overview" active />
          <NavItem icon={Monitor} label="Screens" />
          <NavItem icon={Target} label="Campaigns" />
          <NavItem icon={Users} label="Brands" />
          <NavItem icon={Layers} label="Inventory" />
          <NavItem icon={Activity} label="Logs" />
        </nav>

        <div className="mt-auto space-y-4">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">System Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <span className="text-xs font-medium text-zinc-300">All Systems Online</span>
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("admin_token");
              router.push("/admin");
            }}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-white/5 hover:bg-white/5 transition-all group"
          >
            <span className="text-sm font-bold text-zinc-500 group-hover:text-white transition-colors">Sign Out</span>
            <LogOut size={16} className="text-zinc-500 group-hover:text-white transition-colors" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 max-w-[1600px] mx-auto w-full">
        {/* Header */}
        <header className="flex justify-between items-end mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2 text-zinc-500">
              <TrendingUp size={14} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Real-time analytics</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter">Command Center</h1>
          </div>

          <div className="flex gap-4">
            <button className="h-14 w-14 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
              <Search size={22} className="text-zinc-400" />
            </button>
            <button className="h-14 w-14 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors relative">
              <Bell size={22} className="text-zinc-400" />
              <span className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full border-2 border-zinc-950" />
            </button>
            <button className="h-14 px-6 bg-white text-black rounded-2xl flex items-center gap-3 font-bold hover:bg-zinc-200 transition-colors">
              <Plus size={20} />
              New Campaign
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          <StatCard
            label="Total Throws"
            value={stats.totalInteractions.toLocaleString()}
            icon={Activity}
            trend="+12%"
            color="from-blue-600 to-indigo-600"
          />
          <StatCard
            label="Connected Screens"
            value={stats.totalScreens}
            icon={Monitor}
            trend="Active"
            color="from-emerald-600 to-teal-600"
          />
          <StatCard
            label="Live Campaigns"
            value={stats.activeCampaigns}
            icon={Target}
            trend="Ongoing"
            color="from-orange-600 to-red-600"
          />
          <StatCard
            label="Brand Partners"
            value={stats.totalBrands}
            icon={Users}
            trend="Trusted"
            color="from-purple-600 to-pink-600"
          />
        </div>

        <div className="grid grid-cols-3 gap-12">
          {/* Live Activity Feed */}
          <div className="col-span-1 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold tracking-tight">Live Splashes</h3>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Live</span>
              </div>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {liveInteractions.length > 0 ? (
                  liveInteractions.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                      className="bg-zinc-900/50 border border-white/5 p-5 rounded-3xl group hover:border-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-xl shadow-lg border border-white/10 group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: item.color }}
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className="font-bold text-white text-sm">{item.userName || "Guest User"}</p>
                            <span className="text-[10px] text-zinc-500 font-medium">Just now</span>
                          </div>
                          <p className="text-xs text-zinc-500 mt-0.5"> Threw {item.color} at {item.screen?.name || "Premium Billboard"}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="h-64 flex items-center justify-center border border-dashed border-white/5 rounded-3xl">
                    <p className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest">No recent activity</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Performance Chart & Recent Data */}
          <div className="col-span-2 space-y-12">
            {/* Real Screen Stats */}
            <div className="bg-zinc-900/40 border border-white/5 p-10 rounded-[40px] backdrop-blur-3xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8">
                <ArrowUpRight className="text-zinc-700 group-hover:text-zinc-500" size={32} />
              </div>

              <h3 className="text-2xl font-black mb-1">Top Performing Screens</h3>
              <p className="text-zinc-500 mb-8 font-medium">Daily interaction volume by location</p>

              <div className="space-y-8 mt-12">
                {stats.screenStats.map((screen, i) => {
                  const maxCount = Math.max(...stats.screenStats.map(s => s.count)) || 1;
                  const percentage = (screen.count / maxCount) * 100;

                  return (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-bold text-zinc-400">{screen.name}</span>
                        <span className="text-xl font-black text-white">{screen.count.toLocaleString()}</span>
                      </div>
                      <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1.5, delay: i * 0.1, ease: "circOut" }}
                          className={`h-full bg-gradient-to-r ${i % 2 === 0 ? 'from-indigo-600 to-violet-400' : 'from-emerald-500 to-cyan-300'} rounded-full`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Campaign Summary Table */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Recent Campaigns</h3>
                <button className="text-xs font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest">View All</button>
              </div>

              <div className="bg-zinc-900/20 border border-white/5 rounded-3xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-white/5 border-b border-white/5 text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
                    <tr>
                      <th className="px-8 py-4">Brand</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4">Engagement</th>
                      <th className="px-8 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[1, 2, 3].map((_, i) => (
                      <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-zinc-800" />
                            <span className="font-bold text-sm">Brand {i + 1}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                            Active
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <span className="font-mono text-zinc-400 text-sm">{(1200 + i * 450).toLocaleString()}</span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button className="text-zinc-500 hover:text-white p-2">
                            <BarChart3 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <button className={`
      flex items-center justify-between p-4 rounded-2xl w-full transition-all group
      ${active ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:bg-white/5'}
    `}>
      <div className="flex items-center gap-4">
        <Icon size={20} className={active ? 'text-black' : 'text-zinc-500 group-hover:text-zinc-300'} />
        <span className="font-bold text-sm">{label}</span>
      </div>
      {active && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
    </button>
  );
}

function StatCard({ label, value, icon: Icon, trend, color }: any) {
  return (
    <div className="bg-zinc-900 border border-white/5 rounded-[32px] p-8 overflow-hidden relative group hover:border-white/10 transition-all">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity`} />

      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
          <Icon className="text-zinc-300" size={20} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 bg-white/5 px-2 py-1 rounded-md">
          {trend}
        </span>
      </div>

      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-4xl font-black tracking-tighter">{value}</h3>
    </div>
  );
}

