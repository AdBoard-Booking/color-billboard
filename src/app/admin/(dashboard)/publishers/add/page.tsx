"use client";

import { useState } from "react";
import { Building2, ArrowLeft, Save, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AddPublisherPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/publishers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push("/admin/publishers");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create publisher");
      }
    } catch (err) {
      console.error("Error creating publisher:", err);
      alert("Failed to create publisher. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-12 max-w-[800px] mx-auto w-full">
      <Link
        href="/admin/publishers"
        className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors mb-12 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-[0.2em]">Partner Network</span>
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center">
            <Building2 className="text-white" size={24} />
          </div>
          <span className="text-zinc-300 text-xs font-black uppercase tracking-widest italic">New Partnership</span>
        </div>
        <h1 className="text-6xl font-black tracking-tighter text-zinc-900 uppercase italic">
          Register <span className="holi-gradient-text">Publisher</span>
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white border border-zinc-100 p-12 rounded-[48px] shadow-sm">
        <div className="space-y-6">
          <div>
            <label className="block text-zinc-400 text-[10px] font-bold uppercase mb-3 tracking-[0.2em] ml-1">Company Name</label>
            <div className="relative group">
              <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-zinc-900 transition-colors" size={20} />
              <input
                required
                type="text"
                placeholder="e.g. City Media Group"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full h-20 pl-16 pr-8 bg-zinc-50 border border-zinc-100 rounded-3xl outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all text-xl font-bold placeholder:text-zinc-200"
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full h-20 bg-zinc-900 text-white rounded-3xl flex items-center justify-center gap-3 font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/20 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save size={20} />
                Confirm Registration
              </>
            )}
          </button>

          <p className="text-center text-zinc-300 text-[10px] font-bold uppercase tracking-widest mt-6 flex items-center justify-center gap-2">
            <Sparkles size={12} /> Secure Partner Onboarding
          </p>
        </div>
      </form>
    </div>
  );
}
