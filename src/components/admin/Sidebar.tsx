"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Monitor,
  Target,
  Users,
  Layers,
  Activity,
  Sparkles,
  LogOut
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/admin/dashboard" },
    { icon: Monitor, label: "Screens", href: "/admin/screens" },
    { icon: Target, label: "Campaigns", href: "/admin/campaigns" },
    { icon: Users, label: "Brands", href: "/admin/brands" },
  ];

  return (
    <aside className="w-72 border-r border-zinc-100 flex flex-col p-8 bg-white sticky top-0 h-screen">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center">
          <Sparkles className="text-white" size={20} />
        </div>
        <h2 className="text-xl font-black tracking-tighter uppercase italic text-zinc-900 font-[family-name:var(--font-outfit)]">OOH-Matic</h2>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            active={pathname === item.href}
          />
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.3)]" />
            <span className="text-xs font-medium text-zinc-600">All Systems Online</span>
          </div>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("admin_token");
            router.push("/admin");
          }}
          className="w-full flex items-center justify-between p-4 rounded-xl border border-zinc-100 hover:bg-zinc-50 transition-all group"
        >
          <span className="text-sm font-bold text-zinc-400 group-hover:text-zinc-900 transition-colors">Sign Out</span>
          <LogOut size={16} className="text-zinc-400 group-hover:text-zinc-900 transition-colors" />
        </button>
      </div>
    </aside>
  );
}

function NavItem({ icon: Icon, label, href, active = false }: { icon: any, label: string, href: string, active?: boolean }) {
  return (
    <Link href={href}>
      <div className={`
        flex items-center justify-between p-4 rounded-2xl w-full transition-all group
        ${active ? 'bg-zinc-900 text-white shadow-xl shadow-zinc-900/10' : 'text-zinc-400 hover:bg-zinc-50'}
      `}>
        <div className="flex items-center gap-4">
          <Icon size={20} className={active ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-600'} />
          <span className="font-bold text-sm tracking-tight">{label}</span>
        </div>
        {active && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
      </div>
    </Link>
  );
}
