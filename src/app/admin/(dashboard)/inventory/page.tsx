"use client";

import { Layers, Search, Filter, Download } from "lucide-react";

export default function InventoryPage() {
  return (
    <div className="p-12 max-w-[1600px] mx-auto w-full">
      <header className="flex justify-between items-end mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2 text-zinc-500">
            <Layers size={14} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Asset Control</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter">Inventory</h1>
        </div>

        <div className="flex gap-4">
          <button className="h-14 px-6 bg-white/5 border border-white/10 text-white rounded-2xl flex items-center gap-3 font-bold hover:bg-white/10 transition-colors">
            <Download size={20} />
            Export CSV
          </button>
        </div>
      </header>

      <div className="bg-zinc-900/20 border border-white/5 rounded-3xl overflow-hidden">
        <div className="p-20 text-center">
          <p className="text-zinc-600 font-medium italic">Detailed inventory breakdown coming soon.</p>
        </div>
      </div>
    </div>
  );
}
