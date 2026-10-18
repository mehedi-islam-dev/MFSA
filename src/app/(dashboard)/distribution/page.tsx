"use client";

import React from 'react';
import { Globe, Activity, Database } from 'lucide-react';

export default function DistributionModule() {
  return (
    <div className="min-h-screen bg-[#010409] text-cyan-500 font-mono p-8 flex flex-col items-center justify-center">
      <div className="glass-panel p-10 max-w-2xl w-full text-center border border-cyan-900/50 rounded-2xl shadow-[0_0_50px_rgba(8,51,68,0.4)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#01060c] to-[#010409] pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="p-4 bg-cyan-950/30 rounded-xl border border-cyan-800 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
            <Globe className="w-10 h-10 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-[0.25em] text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] uppercase">
              ADVANCED ECOSYSTEM
            </h1>
            <p className="text-xs text-cyan-600 tracking-[0.2em] mt-3 uppercase font-bold">
              eDNA Mapper & Spatial Analysis
            </p>
          </div>
          <div className="mt-8 p-4 bg-[#01060c] border border-cyan-900/40 rounded-lg w-full flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs tracking-widest text-cyan-700">
              <Activity className="w-4 h-4" /> STATUS: <span className="text-cyan-400 font-bold">ONLINE</span>
            </div>
            <div className="flex items-center gap-3 text-xs tracking-widest text-cyan-700">
              <Database className="w-4 h-4" /> SYNC: <span className="text-green-400 font-bold">ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
