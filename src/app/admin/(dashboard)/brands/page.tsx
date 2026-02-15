"use client";

import { Users, Plus, Star } from "lucide-react";

export default function BrandsPage() {
  return (
    <div className="p-12 max-w-[1600px] mx-auto w-full">
      <header className="flex justify-between items-end mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2 text-zinc-400">
            <Users size={14} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Partner Network</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-zinc-900">
            Brand <span className="holi-gradient-text">Partners</span>
          </h1>
        </div>

        <button className="h-14 px-8 bg-zinc-900 text-white rounded-2xl flex items-center gap-3 font-bold hover:bg-zinc-800 transition-colors shadow-xl shadow-zinc-900/10">
          <Plus size={20} />
          Onboard Partner
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="bg-white border border-zinc-100 p-10 rounded-[48px] shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 transition-all group">
            <div className="w-20 h-20 bg-zinc-50 rounded-3xl mb-8 flex items-center justify-center border border-zinc-100 group-hover:scale-110 transition-transform duration-500">
              <Star className="text-zinc-900" size={32} />
            </div>
            <h3 className="text-2xl font-black mb-1 tracking-tight text-zinc-900">Premium Partner {i + 1}</h3>
            <p className="text-zinc-400 text-sm mb-8 font-medium">Active since Feb 2026</p>
            <div className="flex items-center justify-between pt-8 border-t border-zinc-50">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">12 Campaigns</span>
              <button className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest border-b border-zinc-900">Profile</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
