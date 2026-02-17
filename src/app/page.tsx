"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Paintbrush, Zap, Share2, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-[#0060FF] selection:text-white">
      {/* Premium Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0060FF] to-[#FF00FF]" />
          <span className="text-xl font-black tracking-tighter italic uppercase">Holi Billboard</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-zinc-500">
          <a href="#how-it-works" className="hover:text-[#0060FF] transition-colors">How it works</a>
          <a href="#locations" className="hover:text-[#0060FF] transition-colors">Locations</a>
          <a href="#impact" className="hover:text-[#0060FF] transition-colors">Impact</a>
        </div>
        <Link
          href="/admin"
          className="bg-zinc-900 text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-lg shadow-zinc-200"
        >
          Partner Login
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/holi_billboard_hero_1771306470035.png"
            fill
            alt="Holi Billboard Hero"
            className="object-cover brightness-[0.85]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-[#0060FF] text-sm md:text-base font-black uppercase tracking-[0.4em] mb-4 drop-shadow-sm">World's First Interactive OOH</p>
            <h1 className="text-6xl md:text-9xl font-[900] tracking-tighter leading-[0.85] mb-8 italic">
              <span className="holi-gradient-text">PAINT</span> THE <br />
              <span className="text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">CITY</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl font-medium text-zinc-800 mb-10 leading-relaxed bg-white/30 backdrop-blur-md p-4 rounded-2xl border border-white/40">
              The celebration is no longer just on the streets. Take over giant digital billboards across the city and splash your vibe in real-time.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/throw/screen_1"
                className="w-full sm:w-auto bg-[#0060FF] text-white px-10 py-5 rounded-full text-lg font-black uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-2xl shadow-[#0060FF]/40 flex items-center justify-center gap-3 group"
              >
                Launch App <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto bg-white/80 backdrop-blur-md text-zinc-900 border border-white px-10 py-5 rounded-full text-lg font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl"
              >
                See it in Action
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="w-1 h-12 rounded-full bg-gradient-to-b from-white to-[#0060FF]/50" />
        </motion.div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-32 px-6 bg-zinc-50">
        <div className="container mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-[900] tracking-tighter mb-4 italic">HOW IT WORKS</h2>
            <div className="w-24 h-2 bg-[#0060FF] mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <MapPin className="w-8 h-8 text-[#0060FF]" />,
                title: "Find a Screen",
                desc: "Spot one of our interactive billboards across major city squares and high-traffic points."
              },
              {
                icon: <Zap className="w-8 h-8 text-[#FF00FF]" />,
                title: "Connect Instantly",
                desc: "Scan the QR code on the screen or use this site to instantly link your device to the billboard."
              },
              {
                icon: <Paintbrush className="w-8 h-8 text-orange-500" />,
                title: "Splash Your Color",
                desc: "Choose your favorite Holi shade and tap to splash it. Watch it explode on the big screen in milliseconds."
              }
            ].map((step, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-[40px] shadow-sm border border-zinc-100 flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 bg-zinc-50 rounded-3xl flex items-center justify-center mb-8 shadow-inner">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight uppercase italic">{step.title}</h3>
                <p className="text-zinc-500 font-medium leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section id="impact" className="py-32 px-6 bg-zinc-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0060FF]/20 rounded-full blur-[120px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF00FF]/10 rounded-full blur-[120px] -ml-48 -mb-48" />

        <div className="container mx-auto relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Real-time Splashes", value: "2.4M+" },
              { label: "Active Screens", value: "84" },
              { label: "Cities Covered", value: "12" },
              { label: "User Engagement", value: "98%" }
            ].map((stat, i) => (
              <div key={i} className="text-center p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <p className="text-5xl font-black italic tracking-tighter text-[#0060FF] mb-2">{stat.value}</p>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-24 bg-gradient-to-r from-[#0060FF] to-[#FF00FF] p-1 rounded-[40px]">
            <div className="bg-zinc-900 rounded-[38px] p-12 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-xl">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic mb-6 leading-tight">
                  JOIN THE WORLD'S <br /><span className="text-[#0060FF]">COLORFUL REVOLUTION.</span>
                </h2>
                <p className="text-zinc-400 text-lg">
                  We're scaling interactive experiences globally. Partner with us to bring the Holi Billboard to your city or brand.
                </p>
              </div>
              <button
                onClick={() => window.open("https://wa.me/919310854859?text=Hi, I'm interested in partnering with Holi Billboard.", "_blank")}
                className="whitespace-nowrap bg-white text-zinc-900 px-10 py-5 rounded-full text-lg font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl"
              >
                Partner with us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-zinc-100">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-zinc-900" />
            <span className="text-lg font-black tracking-tighter italic uppercase">Holi Billboard</span>
          </div>
          <p className="text-zinc-400 text-sm font-medium">© 2026 Holi Billboard. All rights reserved. Made for the vibe.</p>
          <div className="flex items-center gap-6">
            <Share2 className="w-5 h-5 text-zinc-400 cursor-pointer hover:text-zinc-900 transition-colors" />
            <div className="w-5 h-5 rounded-full bg-zinc-100" />
            <div className="w-5 h-5 rounded-full bg-zinc-100" />
          </div>
        </div>
      </footer>
    </div>
  );
}
