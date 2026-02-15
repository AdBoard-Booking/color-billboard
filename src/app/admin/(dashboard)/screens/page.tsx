"use client";

import { Monitor, Plus, Search, Filter } from "lucide-react";

export default function ScreensPage() {
  return (
    <div className="p-12 max-w-[1600px] mx-auto w-full">
      <header className="flex justify-between items-end mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2 text-zinc-400">
            <Monitor size={14} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Inventory Management</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-zinc-900">
            Digital <span className="holi-gradient-text">Screens</span>
          </h1>
        </div>

        <div className="flex gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search screens..."
              className="h-14 pl-12 pr-6 bg-white border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all w-64 text-zinc-900 shadow-sm"
            />
          </div>
          <button className="h-14 px-6 bg-white border border-zinc-100 text-zinc-900 rounded-2xl flex items-center gap-3 font-bold hover:bg-zinc-50 transition-colors shadow-sm">
            <Filter size={20} />
            Filter
          </button>
          <button className="h-14 px-8 bg-zinc-900 text-white rounded-2xl flex items-center gap-3 font-bold hover:bg-zinc-800 transition-colors shadow-xl shadow-zinc-900/10">
            <Plus size={20} />
            Add Screen
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white border border-zinc-100 p-20 rounded-[48px] flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-24 h-24 bg-zinc-50 rounded-[32px] flex items-center justify-center mb-8 border border-zinc-100">
            <Monitor size={48} className="text-zinc-900" />
          </div>
          <h3 className="text-3xl font-black mb-3 tracking-tight text-zinc-900">Manage your Digital Inventory</h3>
          <p className="text-zinc-400 max-w-md mx-auto mb-10 font-medium leading-relaxed">
            Register new physical billboards, monitor their health in real-time, and assign them to premium locations.
          </p>
          <button className="px-10 py-5 bg-zinc-900 text-white rounded-[24px] font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-xl shadow-zinc-900/20">
            Connect First Screen
          </button>
        </div>
      </div>
    </div>
  );
}
