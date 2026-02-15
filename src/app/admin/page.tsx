"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login for demo
    if (email === "admin@holi-ooh.com" && password === "admin123") {
      localStorage.setItem("admin_token", "fake-jwt-token");
      router.push("/admin/dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 font-[family-name:var(--font-outfit)]">
      <div className="w-full max-w-md bg-white border border-zinc-100 p-12 rounded-[48px] shadow-2xl shadow-zinc-200/50">
        <h1 className="text-4xl font-black text-zinc-900 mb-10 tracking-tighter uppercase italic">
          Admin <span className="holi-gradient-text">Login</span>
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-8 text-xs font-bold uppercase tracking-widest">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-8">
          <div>
            <label className="block text-zinc-400 text-[10px] font-bold uppercase mb-3 tracking-[0.2em] ml-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-5 px-8 text-zinc-900 focus:ring-4 focus:ring-zinc-900/5 transition-all outline-none font-bold"
              placeholder="admin@holi-ooh.com"
            />
          </div>
          <div>
            <label className="block text-zinc-400 text-[10px] font-bold uppercase mb-3 tracking-[0.2em] ml-1">Secure Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-5 px-8 text-zinc-900 focus:ring-4 focus:ring-zinc-900/5 transition-all outline-none font-bold"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-zinc-900 text-white font-black py-6 rounded-2xl hover:bg-zinc-800 transition-all uppercase tracking-[0.2em] text-sm shadow-xl shadow-zinc-900/20 active:scale-95"
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
}
