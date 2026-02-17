"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Monitor, MapPin, Building2, Sparkles, Check } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function AddScreenPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [publishers, setPublishers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    location: "",
    publisherId: "",
  });

  useEffect(() => {
    fetch("/api/admin/publishers")
      .then((res) => res.json())
      .then((data) => {
        setPublishers(data);
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, publisherId: data[0].id }));
        }
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/screens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/screens");
        }, 2000);
      } else {
        const data = await res.json();
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Error creating screen:", error);
      alert("Failed to create screen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-12 max-w-[1000px] mx-auto w-full">
      <Link
        href="/admin/screens"
        className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors mb-8 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-[0.2em]">Back to Inventory</span>
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center">
            <Monitor className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-zinc-900 uppercase italic">
              Register <span className="holi-gradient-text">Screen</span>
            </h1>
            <p className="text-zinc-500 font-medium tracking-tight">Expand your digital canvas across the city.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8 bg-white border border-zinc-100 p-10 rounded-[40px] shadow-sm">
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-zinc-400 text-[10px] font-bold uppercase mb-3 tracking-[0.2em] ml-1">
                  <Monitor size={12} /> Unique identifier
                </label>
                <input
                  type="text"
                  required
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                  placeholder="e.g. screen_1"
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-5 px-8 text-zinc-900 focus:ring-4 focus:ring-zinc-900/5 transition-all outline-none font-bold placeholder:text-zinc-300"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-zinc-400 text-[10px] font-bold uppercase mb-3 tracking-[0.2em] ml-1">
                  <Monitor size={12} /> Screen Identity
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Times Square Mega-LED"
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-5 px-8 text-zinc-900 focus:ring-4 focus:ring-zinc-900/5 transition-all outline-none font-bold placeholder:text-zinc-300"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-zinc-400 text-[10px] font-bold uppercase mb-3 tracking-[0.2em] ml-1">
                  <MapPin size={12} /> Real-world Location
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. 42nd St & 7th Ave, NYC"
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-5 px-8 text-zinc-900 focus:ring-4 focus:ring-zinc-900/5 transition-all outline-none font-bold placeholder:text-zinc-300"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-zinc-400 text-[10px] font-bold uppercase mb-3 tracking-[0.2em] ml-1">
                  <Building2 size={12} /> Media Partner
                </label>
                <select
                  required
                  value={formData.publisherId}
                  onChange={(e) => setFormData({ ...formData, publisherId: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-5 px-8 text-zinc-900 focus:ring-4 focus:ring-zinc-900/5 transition-all outline-none font-bold appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select a publisher</option>
                  {publishers.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className={`
                w-full py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3
                ${success ? 'bg-green-500 text-white shadow-green-200' : 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-zinc-900/20'}
                ${loading ? 'opacity-70 cursor-wait' : ''}
              `}
            >
              {success ? (
                <>
                  <Check size={20} /> Registered Successfully
                </>
              ) : loading ? (
                "Processing..."
              ) : (
                <>
                  <Sparkles size={18} /> Deploy Screen
                </>
              )}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900 text-white p-8 rounded-[40px] shadow-2xl shadow-zinc-900/10">
            <h3 className="text-lg font-black tracking-tight mb-4 uppercase italic">Live Preview</h3>
            <div className="aspect-[9/16] bg-zinc-800 rounded-3xl overflow-hidden relative border border-white/10">
              {/* Mock Screen Content */}
              <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900 to-zinc-800" />
              <div className="absolute top-4 left-4 right-4 h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-[#0060FF]" />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <Monitor className="text-zinc-600 mb-4" size={40} />
                <p className="text-[10px] font-black uppercase tracking-widest text-[#0060FF] mb-1">
                  ID: {formData.id || "awaiting_id"}
                </p>
                <p className="text-sm font-black uppercase tracking-tight mb-1">
                  {formData.name || "UNNAMED SCREEN"}
                </p>
                <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
                  {formData.location || "Awaiting Location..."}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-zinc-400 mt-6 font-medium leading-relaxed italic">
              Once deployed, this screen will be available for color-throws.
            </p>
          </div>

          <div className="p-8 bg-zinc-50 border border-zinc-100 rounded-[32px]">
            <h4 className="text-xs font-black uppercase tracking-widest text-zinc-900 mb-3">System Note</h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Screens automatically generate a unique QR code upon creation. This code can be downloaded from the inventory details page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
