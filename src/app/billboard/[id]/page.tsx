"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

interface SplashBlob {
  id: string;
  color: string;
  userName: string;
  x: number;
  y: number;
  size: number;
  blobs: { offsetX: number; offsetY: number; size: number }[];
}

export default function BillboardPage() {
  const { id: screenId } = useParams();
  const [splashes, setSplashes] = useState<SplashBlob[]>([]);
  const [currentBrand] = useState("Uber Holi");
  const [overlay, setOverlay] = useState<{ name: string; color: string } | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io();
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join-screen", screenId);
    });

    socket.on("color_splash", (data: any) => {
      const centerX = Math.random() * 80 + 10;
      const centerY = Math.random() * 60 + 20;
      const splashId = Math.random().toString(36).substr(2, 9);

      // Generate 5-8 smaller blobs around the center to simulate a splash
      const blobs = Array.from({ length: Math.floor(Math.random() * 4) + 4 }).map(() => ({
        offsetX: (Math.random() - 0.5) * 80,
        offsetY: (Math.random() - 0.5) * 80,
        size: Math.random() * 100 + 50,
      }));

      const newSplash: SplashBlob = {
        id: splashId,
        color: data.color,
        userName: data.userName,
        x: centerX,
        y: centerY,
        size: Math.random() * 100 + 300,
        blobs,
      };

      setSplashes((prev) => [...prev, newSplash]);
      setOverlay({ name: data.userName, color: data.color });
      setTimeout(() => setOverlay(null), 3000);

      // AUTO-REMOVE after 1 minute (60000ms)
      setTimeout(() => {
        setSplashes((prev) => prev.filter(s => s.id !== splashId));
      }, 60000);
    });

    return () => {
      socket.disconnect();
    };
  }, [screenId]);

  const mobileUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/throw/${screenId}`;

  return (
    <div className="relative w-full h-screen bg-[#FDFDFD] overflow-hidden flex flex-col items-center justify-center">
      {/* Visual Canvas - Paint Splats */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          {splashes.map((splash) => (
            <motion.div
              key={splash.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2, filter: "blur(40px)" }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                opacity: { duration: 0.2 }
              }}
              className="absolute"
              style={{
                left: `${splash.x}%`,
                top: `${splash.y}%`,
                width: 1, height: 1
              }}
            >
              {/* Main Core */}
              <div
                className="absolute rounded-full"
                style={{
                  backgroundColor: splash.color,
                  width: `${splash.size}px`,
                  height: `${splash.size}px`,
                  filter: "blur(25px)",
                  opacity: 0.5,
                  transform: "translate(-50%, -50%)"
                }}
              />

              {/* User Name Tag - Compact & Premium */}
              <div
                className="absolute z-10 whitespace-nowrap"
                style={{ transform: "translate(-50%, -50%)" }}
              >
                <div className="bg-white/80 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/40 shadow-xl flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: splash.color }} />
                  <span className="text-zinc-900 font-bold text-sm tracking-tight">
                    {splash.userName}
                  </span>
                </div>
              </div>

              {/* Splatter Droplets */}
              {splash.blobs.map((blob, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.3, scale: 1, x: blob.offsetX, y: blob.offsetY }}
                  className="absolute rounded-full"
                  style={{
                    backgroundColor: splash.color,
                    width: `${blob.size}px`,
                    height: `${blob.size}px`,
                    filter: "blur(15px)",
                    transform: "translate(-50%, -50%)"
                  }}
                />
              ))}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* TOP LEFT: Attribution */}
      <div className="absolute top-8 left-10 z-20 flex gap-8 items-center bg-white/40 backdrop-blur-md p-6 rounded-[32px] border border-white/20">
        <div className="flex flex-col">
          <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Publisher</span>
          <span className="text-zinc-900 font-extrabold text-base tracking-tight leading-none">City Media</span>
        </div>
        <div className="w-px h-6 bg-zinc-200" />
        <div className="flex flex-col">
          <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Brand</span>
          <span className="text-[#0060FF] font-extrabold text-base tracking-tight leading-none">Uber Holi</span>
        </div>
      </div>

      {/* TOP RIGHT: Powered By */}
      <div className="absolute top-8 right-10 z-20">
        <div className="bg-zinc-900 text-white px-8 py-3 rounded-full font-bold text-xs tracking-tight shadow-2xl shadow-zinc-900/20">
          Powered by AdBoard Booking
        </div>
      </div>

      {/* CENTER: Minimal Hero (Reduced size to make space for colors) */}
      <div className="relative z-10 text-center pointer-events-none px-4 max-w-4xl select-none">
        <h1 className="text-[8vw] font-[900] text-zinc-900 leading-[1] tracking-tighter mb-4 opacity-[0.9] mix-blend-multiply">
          Paint your<br />
          <span className="holi-gradient-text">Perspective</span>
        </h1>
        <p className="text-xl text-zinc-400 font-medium tracking-tight max-w-lg mx-auto leading-relaxed">
          Scan to splash your color on the canvas.
        </p>
      </div>

      {/* BOTTOM LEFT: Info */}
      <div className="absolute bottom-10 left-10 z-20">
        <div className="bg-white/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-zinc-400 text-[9px] font-bold uppercase tracking-widest">
          © 2026 Holi Interactive Platform
        </div>
      </div>

      {/* BOTTOM RIGHT: QR Code */}
      <div className="absolute bottom-10 right-10 z-20 flex flex-col items-end gap-4">
        <div className="bg-white p-5 rounded-[40px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] border border-white origin-bottom-right transition-transform hover:scale-105 duration-500">
          <QRCodeSVG value={mobileUrl} size={110} />
        </div>
      </div>

      {/* Notification (Centered & Floating) */}
      <AnimatePresence>
        {overlay && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -20 }}
            className="absolute bottom-40 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-3xl border border-white px-8 py-4 rounded-full shadow-2xl z-50 flex items-center gap-4"
          >
            <div className="w-8 h-8 rounded-full shadow-lg" style={{ backgroundColor: overlay.color }} />
            <h3 className="text-lg font-black text-zinc-900 tracking-tight">{overlay.name} just splashed! ✨</h3>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
