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
      <section className="relative min-h-[95vh] pt-32 pb-20 flex items-center justify-center overflow-hidden bg-white">
        {/* Professional Subtle Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#0060FF]/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#FF00FF]/5 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-[#0060FF] text-sm md:text-base font-black uppercase tracking-[0.4em] mb-4 drop-shadow-sm">For Billboard Owners</p>
            <h1 className="text-6xl md:text-9xl font-[900] tracking-tighter leading-[0.85] mb-8 italic">
              <span className="holi-gradient-text">ENGAGE</span> THE <br />
              <span className="text-zinc-900 drop-shadow-sm">CROWD</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl font-medium text-zinc-600 mb-10 leading-relaxed">
              Transform your static screens into real-time interactive experiences. Let your audience throw colors and messages directly onto your digital billboards.
            </p>

            {/* How to setup */}
            <div className="max-w-3xl mx-auto mb-10 bg-white border border-zinc-200 text-left shadow-2xl shadow-zinc-200/50 p-8 rounded-[32px] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#0060FF]/10 to-[#FF00FF]/10 blur-2xl -mr-10 -mt-10" />
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-zinc-900 relative z-10">
                <Zap className="w-5 h-5 text-[#0060FF]" /> Getting Started is Easy:
              </h3>
              <ol className="list-decimal list-inside space-y-3 text-zinc-600 font-medium relative z-10">
                <li><strong className="text-zinc-900">Register</strong> by providing your company name, screen name, and city location.</li>
                <li><strong className="text-[#0060FF]">Get a unique URL</strong> from us. Add this URL to your CMS or use it as a creative on your billboard. <span className="text-xs ml-2 bg-zinc-100 px-2 py-1 rounded inline-block mt-1 sm:mt-0">(Every modern digital billboard supports webpages!)</span></li>
                <li><strong className="text-zinc-900">Test the creative</strong> by scanning the QR code that appears on your billboard.</li>
                <li><strong className="text-[#FF00FF]">Enjoy</strong> real-time interactive engagement from the crowd!</li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => window.open("https://wa.me/919310854859?text=Hi, I would like to register my billboard for the interactive campaign.", "_blank")}
                className="w-full sm:w-auto bg-white text-zinc-900 px-8 py-4 rounded-full text-lg font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-3 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
              >
                Register Screen <ArrowRight className="w-5 h-5 text-zinc-400" />
              </button>
              <Link
                href="/billboard/screen_1"
                target="_blank"
                className="w-full sm:w-auto bg-[#0060FF] text-white px-8 py-4 rounded-full text-lg font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-[#0060FF]/40 flex items-center justify-center gap-3 group"
              >
                Test Demo View <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 hidden md:block"
        >
          <div className="w-1 h-12 rounded-full bg-gradient-to-b from-zinc-200 to-transparent" />
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
                title: "Register Details",
                desc: "Provide us with your company name, screen name, and location to register your screens."
              },
              {
                icon: <Zap className="w-8 h-8 text-[#FF00FF]" />,
                title: "Use Webpage URL",
                desc: "Receive a unique URL from us. Set this webpage URL as the creative asset on your screen's CMS."
              },
              {
                icon: <Paintbrush className="w-8 h-8 text-orange-500" />,
                title: "Scan & Enjoy",
                desc: "Your screen is now interactive! Test the creative by scanning the QR on your billboard, and watch the magic happen."
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
                  We're scaling interactive experiences globally. Partner with us to bring the Holi Billboard to your city.
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
