"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import posthog from "posthog-js";

const COLORS = [
  { name: "Gulal Red", hex: "#E63946" },
  { name: "Saffron Orange", hex: "#F4A261" },
  { name: "Krishna Blue", hex: "#457B9D" },
  { name: "Spring Green", hex: "#2A9D8F" },
  { name: "Magenta Pink", hex: "#FF00FF" },
];

export default function MobileThrowPage() {
  const { id: screenId } = useParams();
  const [selectedColor, setSelectedColor] = useState(COLORS[0].hex);
  const [userName, setUserName] = useState("");
  const [showNameModal, setShowNameModal] = useState(false);
  const [status, setStatus] = useState<"idle" | "throwing" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [reward, setReward] = useState<{ message: string; coupon: string | null } | null>(null);

  useEffect(() => {
    const savedName = localStorage.getItem("user_name");
    if (!savedName) {
      setShowNameModal(true);
    } else {
      setUserName(savedName);
    }
  }, []);

  useEffect(() => {
    if (showNameModal) {
      posthog.capture('name_prompt_viewed');
    }
  }, [showNameModal]);

  const saveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      localStorage.setItem("user_name", userName);
      posthog.identify(userName);
      posthog.capture('name_submitted', { name: userName });
      setShowNameModal(false);
    }
  };

  const handleThrow = async () => {
    if (!userName) {
      setShowNameModal(true);
      return;
    }

    setStatus("throwing");

    const fingerprint = localStorage.getItem("device_hash") || Math.random().toString(36).substring(7);
    if (!localStorage.getItem("device_hash")) {
      localStorage.setItem("device_hash", fingerprint);
    }

    try {
      const res = await fetch("/api/interaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          screen_id: screenId,
          color: selectedColor,
          fingerprint,
          userName: userName,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setReward(data.reward);
        posthog.capture('color_splashed', {
          screen_id: screenId,
          color: selectedColor,
          user_name: userName,
          reward_type: data.reward?.message
        });
      } else {
        setStatus("error");
        const errorMsg = data.error || "Failed to throw color";
        setMessage(errorMsg);
        posthog.capture('splash_error', {
          error: errorMsg,
          screen_id: screenId,
          color: selectedColor
        });
      }
    } catch (err) {
      setStatus("error");
      setMessage("Connection error. Try again.");
      posthog.capture('splash_error', {
        error: 'connection_error',
        screen_id: screenId
      });
    }
  };


  return (
    <div className="min-h-screen bg-[#FDFDFD] text-zinc-900 flex flex-col">
      {/* Premium Header */}
      <header className="px-6 pt-6 pb-4 flex justify-between items-center">
        <div>
          <p className="text-[#0060FF] text-[10px] font-black uppercase tracking-[0.2em] mb-1">Interactive OOH</p>
          <h1 className="text-3xl font-black tracking-tight leading-none italic">HOLI FEST</h1>
        </div>
        <button
          onClick={() => setShowNameModal(true)}
          className="bg-white border border-zinc-100 shadow-sm px-4 py-2 rounded-full flex items-center gap-2 active:scale-95 transition-all"
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#0060FF] to-[#FF00FF]" />
          <span className="text-xs font-bold tracking-tight">{userName || "Guest"}</span>
        </button>
      </header>

      <main className="flex-1 px-6 flex flex-col pt-2">
        <div className="mb-6">
          <h2 className="text-4xl font-[900] tracking-tighter leading-[0.9] mb-4">
            Paint the City <br />
            <span className="holi-gradient-text tracking-[-0.05em]">With Your Vibe</span>
          </h2>
          <p className="text-zinc-400 text-sm font-medium tracking-tight">Pick a liquid color and splash it on the digital canvas instantly.</p>
        </div>

        {/* Color Grid - Styled like Premium Action Cards */}
        <div className="grid grid-cols-2 gap-3 mb-10">
          {COLORS.map((c) => (
            <button
              key={c.hex}
              onClick={() => {
                setSelectedColor(c.hex);
                posthog.capture('color_selection_changed', { color: c.name, hex: c.hex });
              }}
              className={`relative overflow-hidden h-28 rounded-[28px] transition-all duration-300 group flex flex-col items-center justify-center gap-2 ${selectedColor === c.hex
                ? "bg-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border-white scale-105 z-10"
                : "bg-zinc-50 border-transparent hover:bg-zinc-100"
                } border-2`}
            >
              <motion.div
                animate={selectedColor === c.hex ? { scale: [1, 1.2, 1] } : {}}
                className="w-10 h-10 rounded-full shadow-lg"
                style={{ backgroundColor: c.hex }}
              />
              <span className={`text-[10px] font-black uppercase tracking-widest ${selectedColor === c.hex ? "text-zinc-900" : "text-zinc-400"
                }`}>
                {c.name}
              </span>

              {selectedColor === c.hex && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute bottom-3 w-1.5 h-1.5 rounded-full bg-[#0060FF]"
                />
              )}
            </button>
          ))}
        </div>

        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100 mb-6"
          >
            {message}
          </motion.div>
        )}

        {/* Global Action Button */}
        <button
          onClick={handleThrow}
          disabled={status === "throwing"}
          className="w-full py-5 rounded-[28px] bg-zinc-900 text-white font-extrabold text-lg shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] active:scale-95 transition-all disabled:opacity-50 mt-auto mb-6 flex items-center justify-center gap-3"
        >
          {status === "throwing" ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
              <span>SENDING...</span>
            </>
          ) : (
            <>
              <span>SPLASH NOW</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
      </main>

      {/* Name Prompt Modal - Styled as Premium Full-Screen Overlay */}
      <AnimatePresence>
        {showNameModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/80 backdrop-blur-2xl z-[100] flex items-center justify-center p-8"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="w-full max-w-md"
            >
              <p className="text-[#0060FF] text-xs font-black uppercase tracking-[0.3em] mb-4 text-center">Identity Setup</p>
              <h2 className="text-5xl font-[900] mb-8 tracking-tighter text-zinc-900 text-center leading-none">Who are<br />you?</h2>

              <form onSubmit={saveName} className="space-y-4">
                <input
                  autoFocus
                  type="text"
                  placeholder="Your display name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-white border border-zinc-100 shadow-xl rounded-[32px] py-6 px-10 text-xl font-bold focus:ring-4 focus:ring-[#0060FF]/10 transition-all outline-none text-center"
                />
                <button
                  type="submit"
                  disabled={!userName.trim()}
                  className="w-full bg-[#0060FF] text-white font-black py-6 rounded-[32px] shadow-2xl shadow-[#0060FF]/30 disabled:opacity-50 text-xl tracking-tight"
                >
                  START SPLASHING
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success View */}
      <AnimatePresence>
        {status === "success" && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed inset-0 bg-[#0060FF] text-white z-[200] flex flex-col p-8 overflow-y-auto"
          >
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-32 h-32 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center mb-10 border border-white/30"
              >
                <div className="w-16 h-16 rounded-full" style={{ backgroundColor: selectedColor }} />
              </motion.div>

              <h1 className="text-6xl font-[900] tracking-tighter italic leading-none mb-6">BOOM!<br />SPLASHED</h1>
              <p className="text-white/70 text-lg font-medium max-w-[240px]">Hey {userName}, your color just landed on the big screen.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-2xl p-10 rounded-[48px] border border-white/20 mb-8">
              <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-2">Claim your reward</p>
              <h3 className="text-3xl font-extrabold mb-6 tracking-tight">{reward?.message}</h3>
              {reward?.coupon && (
                <div className="bg-white text-[#0060FF] py-5 rounded-[24px] text-3xl font-black italic tracking-tighter">
                  {reward.coupon}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setStatus("idle");
                posthog.capture('throw_again_clicked');
              }}
              className="w-full py-6 rounded-[32px] bg-white text-[#0060FF] font-black text-xl shadow-2xl active:scale-95 transition-all mb-4"
            >
              THROW AGAIN
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
