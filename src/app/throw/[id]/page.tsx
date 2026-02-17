"use client";

import { useState, useEffect, useMemo } from "react";
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
  const [hasShared, setHasShared] = useState(false);
  const [referralId] = useState(() => Math.random().toString(36).substring(7));

  // Mock leaderboard - in a real app, this would come from an API
  const leaderboard = useMemo(() => [
    { name: "Red", count: 42, color: "#E63946" },
    { name: "Blue", count: 28, color: "#457B9D" },
    { name: "Pink", count: 15, color: "#FF00FF" },
    { name: "Others", count: 15, color: "#CBD5E1" },
  ], []);

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

  const handleThrow = async (isBonus = false) => {
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
      const clickedAt = new Date().toISOString();

      const res = await fetch("/api/interaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          screen_id: screenId,
          color: selectedColor,
          fingerprint,
          userName: userName,
          isBonus: hasShared,
          clickedAt,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setReward(data.reward);
        if (hasShared) setHasShared(false); // Reset after using the bonus throw
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

  const shareOnWhatsApp = () => {
    const colorName = COLORS.find(c => c.hex === selectedColor)?.name || "a color";
    const shareUrl = `${window.location.origin}/throw/${screenId}?ref=${referralId}`;
    const text = `I just took over the billboard! 🎨💥 My ${colorName} vibe is live at Holi Fest. Not a filter. A real billboard.\n\nCheck it out & splash your colors too: ${shareUrl}\n\n#HoliFest2026 #DigitalHoli #PaintTheCity #InteractiveBillboard`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    setHasShared(true);
    posthog.capture('share_whatsapp_clicked', { referralId });
  };

  const shareOnInstagram = () => {
    const caption = `I just made the city colorful! 🎨💥 My vibe is live on the Digital Billboard. Not a filter. Real life. #HoliFest2026 #DigitalHoli #PaintTheCity #InteractiveArt`;
    navigator.clipboard.writeText(caption);
    alert("📸 Caption copied! Now take a photo of the billboard and share it on Instagram!");
    setHasShared(true);
    posthog.capture('share_instagram_clicked', { referralId });
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

        {/* Color Grid */}
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
              <div
                className="w-10 h-10 rounded-full shadow-lg"
                style={{ backgroundColor: c.hex }}
              />
              <span className={`text-[10px] font-black uppercase tracking-widest ${selectedColor === c.hex ? "text-zinc-900" : "text-zinc-400"
                }`}>
                {c.name}
              </span>
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

        <button
          onClick={() => handleThrow()}
          disabled={status === "throwing"}
          className="w-full py-5 rounded-[28px] bg-zinc-900 text-white font-extrabold text-lg shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] active:scale-95 transition-all disabled:opacity-50 mt-auto mb-6 flex items-center justify-center gap-3"
        >
          {status === "throwing" ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
          ) : (
            <span>SPLASH NOW</span>
          )}
        </button>
      </main>

      <AnimatePresence>
        {status === "success" && (
          <motion.div initial={{ opacity: 0, y: "100%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: "100%" }} className="fixed inset-0 bg-zinc-950 text-white z-[200] flex flex-col p-8 overflow-y-auto">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-[#0060FF]/20 to-transparent pointer-events-none" />

            {/* Pride Badge */}
            <motion.div initial={{ scale: 0, rotate: 10 }} animate={{ scale: 1, rotate: -5 }} className="self-center mb-6 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#0060FF] to-[#FF00FF] flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">I was on a Billboard this Holi</span>
            </motion.div>

            <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-32 h-32 bg-white/5 backdrop-blur-3xl rounded-[40px] flex items-center justify-center mb-6 border border-white/10 relative">
                <div className="w-16 h-16 rounded-full shadow-2xl" style={{ backgroundColor: selectedColor }} />
              </motion.div>

              <h1 className="text-4xl font-[900] tracking-tighter italic leading-none mb-3">YOU JUST MADE<br /><span className="text-[#0060FF]">THE CITY COLORFUL.</span></h1>
              <p className="text-zinc-500 text-sm font-medium mb-8">Not a filter. A real billboard. Few people get this moment.</p>

              {/* Leaderboard */}
              <div className="w-full bg-white/5 border border-white/10 rounded-[32px] p-6 mb-8 text-left">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#0060FF] mb-4">City Color Trends</h4>
                <div className="space-y-3">
                  {leaderboard.map((item: any) => (
                    <div key={item.name} className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight">
                        <span>{item.name}</span>
                        <span>{item.count}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ backgroundColor: item.color, width: `${item.count}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                {COLORS.find(c => c.hex === selectedColor)?.name.includes("Red") && (
                  <p className="mt-4 text-[10px] text-zinc-400 font-medium italic">🔥 You contributed to the leading flavor!</p>
                )}
              </div>

              {/* Reward */}
              <div className="w-full bg-white text-zinc-950 p-6 rounded-[32px] mb-8">
                <p className="text-[#0060FF] text-[10px] font-black uppercase tracking-widest mb-1 text-left">Exclusive Reward</p>
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black tracking-tighter">{reward?.message}</h3>
                  {reward?.coupon && <span className="bg-[#0060FF]/10 text-[#0060FF] px-3 py-1 rounded-lg font-black text-sm italic">{reward.coupon}</span>}
                </div>
              </div>
            </div>

            {/* Share to Unlock */}
            <div className="space-y-4 mb-8 relative z-10 w-full">
              <p className={`text-center text-[10px] font-black uppercase tracking-[0.3em] mb-4 transition-colors duration-500 ${!hasShared ? 'text-[#0060FF] animate-bounce' : 'text-zinc-500'}`}>
                {hasShared ? "THANKS FOR SHARING!" : "Share to unlock bonus throw"}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={shareOnWhatsApp}
                  className={`flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#25D366] text-white font-bold text-sm transition-all ${!hasShared ? 'scale-105 shadow-[0_10px_30px_rgba(37,211,102,0.3)]' : 'opacity-50'}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.485 8.413-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884 0 2.225.569 3.446 1.698 5.392l-.999 3.647 3.79-.938zm11.387-5.464c-.3-.149-1.774-.874-2.048-.974-.274-.1-.474-.149-.674.149-.2.3-.774.974-.948 1.174-.174.2-.349.224-.649.074-.3-.149-1.265-.467-2.41-1.487-.89-.794-1.49-1.773-1.665-2.074-.174-.3-.019-.462.13-.611.135-.133.3-.349.45-.523.15-.174.2-.3.3-.499.1-.2.05-.374-.025-.523-.075-.15-.674-1.623-.924-2.223-.244-.585-.491-.504-.674-.513-.175-.008-.374-.01-.574-.01s-.524.074-.798.374c-.275.3-1.047 1.022-1.047 2.492 0 1.47 1.072 2.89 1.222 3.09.15.2 2.11 3.22 5.11 4.514.714.308 1.272.492 1.707.631.717.228 1.369.196 1.885.119.574-.085 1.774-.724 2.023-1.42.249-.697.249-1.294.174-1.42-.075-.124-.275-.199-.575-.349z" /></svg>
                  <span>WHATSAPP</span>
                </button>
                <button
                  onClick={shareOnInstagram}
                  className={`flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-tr from-[#FD5949] via-[#D6249F] to-[#285AEB] text-white font-bold text-sm transition-all ${!hasShared ? 'scale-105 shadow-[0_10px_30px_rgba(214,36,159,0.3)]' : 'opacity-50'}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                  <span>INSTAGRAM</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                if (hasShared) {
                  setStatus("idle");
                  posthog.capture('bonus_throw_used');
                } else {
                  setStatus("idle");
                }
              }}
              className={`w-full py-6 rounded-3xl font-black text-xl shadow-2xl transition-all duration-500 mb-4 mt-auto relative z-10 ${hasShared
                ? 'bg-[#0060FF] text-white scale-105 shadow-[0_0_50px_rgba(0,96,255,0.4)] animate-pulse'
                : 'bg-white/10 text-white/40 border border-white/10'
                }`}
            >
              {hasShared ? (
                <div className="flex items-center justify-center gap-2">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full bg-white"
                  />
                  BONUS THROW UNLOCKED
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 opacity-50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>THROW AGAIN (LOCKED)</span>
                </div>
              )}
              <span className="text-xs text-white/40">Share to unlock bonus throw</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNameModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-white/80 backdrop-blur-2xl z-[100] flex items-center justify-center p-8">
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }} className="w-full max-w-md text-center">
              <p className="text-[#0060FF] text-xs font-black uppercase tracking-[0.3em] mb-4 text-center">Identity Setup</p>
              <h2 className="text-5xl font-[900] mb-8 tracking-tighter text-zinc-900 text-center leading-none">Who are<br />you?</h2>
              <form onSubmit={saveName} className="space-y-4">
                <input autoFocus type="text" placeholder="Your display name" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full bg-white border border-zinc-100 shadow-xl rounded-[32px] py-6 px-10 text-xl font-bold focus:ring-4 focus:ring-[#0060FF]/10 transition-all outline-none text-center" />
                <button type="submit" disabled={!userName.trim()} className="w-full bg-[#0060FF] text-white font-black py-6 rounded-[32px] shadow-2xl shadow-[#0060FF]/30 disabled:opacity-50 text-xl tracking-tight">START SPLASHING</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
