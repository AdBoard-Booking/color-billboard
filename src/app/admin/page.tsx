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
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-10 rounded-3xl shadow-2xl">
        <h1 className="text-3xl font-black text-white mb-8 tracking-tighter uppercase">Admin Login</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-zinc-500 text-xs font-bold uppercase mb-2 tracking-widest">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-800 border-none rounded-xl py-4 px-6 text-white focus:ring-2 focus:ring-white transition-all outline-none"
              placeholder="admin@holi-ooh.com"
            />
          </div>
          <div>
            <label className="block text-zinc-500 text-xs font-bold uppercase mb-2 tracking-widest">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-800 border-none rounded-xl py-4 px-6 text-white focus:ring-2 focus:ring-white transition-all outline-none"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-zinc-200 transition-colors uppercase tracking-widest"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
