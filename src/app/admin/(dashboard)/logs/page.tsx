"use client";

import { Activity, Trash2, RefreshCcw } from "lucide-react";

export default function LogsPage() {
  return (
    <div className="p-12 max-w-[1600px] mx-auto w-full">
      <header className="flex justify-between items-end mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2 text-zinc-500">
            <Activity size={14} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Security & Audit</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter">System Logs</h1>
        </div>

        <div className="flex gap-4">
          <button className="h-14 w-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors">
            <RefreshCcw size={20} className="text-zinc-500" />
          </button>
          <button className="h-14 px-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center gap-3 font-bold hover:bg-red-500/20 transition-colors">
            <Trash2 size={20} />
            Clear Logs
          </button>
        </div>
      </header>

      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((_, i) => (
          <div key={i} className="bg-zinc-900/40 border border-white/5 p-6 rounded-2xl flex items-center justify-between group hover:border-white/10 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <div>
                <p className="text-sm font-bold text-zinc-200">Admin Login Success</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">12:3{i} PM • IP: 192.168.1.{i + 10}</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-zinc-600 bg-white/5 px-3 py-1 rounded-full group-hover:text-zinc-400 transition-colors">Audit OK</span>
          </div>
        ))}
      </div>
    </div>
  );
}
