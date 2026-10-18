"use client";

import { Menu } from "lucide-react";

export default function MobileNavbar() {
  return (
    <header className="md:hidden flex items-center justify-between h-16 backdrop-blur-xl bg-slate-900/30 border border-white/10 shadow-2xl text-white px-4 shrink-0 relative z-10 rounded-none border-t-0 border-l-0 border-r-0" id="tour-mobile-nav">
      <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Marine Analytica</h1>
      <button className="p-2 text-slate-300 hover:text-cyan-400 transition-colors" aria-label="Menu">
        <Menu className="w-6 h-6" />
      </button>
    </header>
  );
}
