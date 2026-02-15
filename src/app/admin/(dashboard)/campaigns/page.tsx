"use client";

import { Target, Plus, Search, Calendar } from "lucide-react";

export default function CampaignsPage() {
  return (
    <div className="p-12 max-w-[1600px] mx-auto w-full">
      <header className="flex justify-between items-end mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2 text-zinc-400">
            <Target size={14} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Ad Operations</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-zinc-900">
            Brand <span className="holi-gradient-text">Campaigns</span>
          </h1>
        </div>

        <div className="flex gap-4">
          <button className="h-14 px-6 bg-white border border-zinc-100 text-zinc-900 rounded-2xl flex items-center gap-3 font-bold hover:bg-zinc-50 transition-colors shadow-sm">
            <Calendar size={20} />
            Schedule
          </button>
          <button className="h-14 px-8 bg-zinc-900 text-white rounded-2xl flex items-center gap-3 font-bold hover:bg-zinc-800 transition-colors shadow-xl shadow-zinc-900/10">
            <Plus size={20} />
            Launch Campaign
          </button>
        </div>
      </header>

      <div className="bg-white border border-zinc-100 rounded-[48px] p-24 text-center shadow-sm">
        <h2 className="text-zinc-500 font-black uppercase tracking-[0.3em] text-xs mb-4">No Active Campaigns</h2>
        <p className="text-zinc-400 font-medium max-w-sm mx-auto leading-relaxed">
          Start by launching a campaign to book slots for your brand partners.
        </p>
      </div>
    </div>
  );
}
