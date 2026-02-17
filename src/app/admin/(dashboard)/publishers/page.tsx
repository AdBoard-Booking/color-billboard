"use client";

import { useState, useEffect } from "react";
import { Building2, Plus, Search, MapPin, Monitor, MoreHorizontal, ExternalLink, Activity, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PublishersPage() {
  const [publishers, setPublishers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/admin/publishers")
      .then((res) => res.json())
      .then((data) => {
        setPublishers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch publishers:", err);
        setLoading(false);
      });
  }, []);

  const filteredPublishers = publishers.filter(publisher =>
    publisher.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-12 max-w-[1600px] mx-auto w-full">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2 text-zinc-400">
            <Building2 size={14} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Partner Network</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-zinc-900 uppercase italic">
            Media <span className="holi-gradient-text">Publishers</span>
          </h1>
        </div>

        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="relative group w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search publishers by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 pl-12 pr-6 bg-white border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all w-full text-zinc-900 shadow-sm font-bold placeholder:text-zinc-300"
            />
          </div>
          <Link
            href="/admin/publishers/add"
            className="h-14 px-8 bg-zinc-900 text-white rounded-2xl flex items-center gap-3 font-bold hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/10 hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            <Plus size={20} />
            Add Publisher
          </Link>
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[200px] bg-white border border-zinc-100 rounded-[40px] animate-pulse" />
          ))}
        </div>
      ) : filteredPublishers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPublishers.map((publisher, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={publisher.id}
            >
              <Link
                href={`/admin/publishers/${publisher.id}`}
                className="group block bg-white border border-zinc-100 p-8 rounded-[40px] shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 transition-all border-b-4 border-b-transparent hover:border-b-[#FF00FF]"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center group-hover:bg-[#FF00FF]/5 transition-colors">
                    <Building2 className="text-zinc-900 group-hover:text-[#FF00FF] transition-colors" size={28} />
                  </div>
                  <div className="w-10 h-10 border border-zinc-50 rounded-xl flex items-center justify-center text-zinc-300 group-hover:text-zinc-900 transition-colors">
                    <ArrowRight size={20} />
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-black text-zinc-900 mb-2 truncate uppercase italic">{publisher.name}</h3>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">ID: {publisher.id.substring(0, 8)}...</p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-zinc-50">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-zinc-100 rounded-lg flex items-center justify-center">
                      <Monitor size={12} className="text-zinc-400" />
                    </div>
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{publisher._count?.screens || 0} Screens</span>
                  </div>
                  <div className="text-[10px] font-black text-[#FF00FF] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    View Network →
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-zinc-100 p-20 rounded-[48px] flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-24 h-24 bg-zinc-50 rounded-[32px] flex items-center justify-center mb-8 border border-zinc-100">
            <Building2 size={48} className="text-zinc-900" />
          </div>
          <h3 className="text-3xl font-black mb-3 tracking-tight text-zinc-900">Build your Partner Network</h3>
          <p className="text-zinc-400 max-w-md mx-auto mb-10 font-medium leading-relaxed">
            {searchQuery ? "No publishers found matching your search." : "Register and manage media owners, outdoor advertising agencies, and local venue partners."}
          </p>
          <Link
            href="/admin/publishers/add"
            className="px-10 py-5 bg-zinc-900 text-white rounded-[24px] font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-xl shadow-zinc-900/20"
          >
            {searchQuery ? "Add New Publisher" : "Register First Publisher"}
          </Link>
        </div>
      )}
    </div>
  );
}
