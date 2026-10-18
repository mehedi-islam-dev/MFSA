"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TestTube, Ruler, BarChart2, CheckCircle2, Beaker, Cpu, Activity, Database, RefreshCw } from 'lucide-react';

const MODULES = [
  {
    id: 'ichthyometer',
    label: 'Smart Ichthyometer',
    icon: Ruler,
    color: 'cyan',
    description: 'AI-assisted biometric measurement of total length, standard length, and estimated weight from image data.',
    stats: [
      { label: 'Measurements Today', value: '24' },
      { label: 'Avg TL (cm)', value: '28.4' },
      { label: 'Species Identified', value: '3' },
    ]
  },
  {
    id: 'feedopt',
    label: 'Feed Optimizer',
    icon: Beaker,
    color: 'green',
    description: 'Calculates optimal feeding rates and composition for targeted fish species based on weight, temperature, and FCR targets.',
    stats: [
      { label: 'FCR Target', value: '1.2' },
      { label: 'Daily Feed (kg)', value: '3.6' },
      { label: 'Growth Rate (%/day)', value: '0.85' },
    ]
  },
  {
    id: 'bioassay',
    label: 'Bioassay Engine',
    icon: TestTube,
    color: 'purple',
    description: 'Track water quality parameters and run toxicity threshold alerts against DO, temperature, and ammonia levels.',
    stats: [
      { label: 'DO Level (mg/L)', value: '6.8' },
      { label: 'Water Temp (°C)', value: '27.3' },
      { label: 'pH', value: '7.6' },
    ]
  },
  {
    id: 'analytics',
    label: 'Lab Analytics',
    icon: BarChart2,
    color: 'yellow',
    description: 'Consolidated dashboard for all lab experiments, historical runs, and cross-experiment comparison metrics.',
    stats: [
      { label: 'Active Runs', value: '5' },
      { label: 'Avg. Confidence', value: '94.1%' },
      { label: 'Samples This Week', value: '142' },
    ]
  },
];

const COLOR_MAP: Record<string, { border: string; glow: string; text: string; bg: string; badge: string }> = {
  cyan:   { border: 'border-cyan-500/40',   glow: 'shadow-[0_0_20px_rgba(0,240,255,0.15)]',   text: 'text-cyan-400',   bg: 'bg-cyan-950/30',   badge: 'bg-cyan-950/50 text-cyan-300 border-cyan-800/50' },
  green:  { border: 'border-green-500/40',  glow: 'shadow-[0_0_20px_rgba(0,255,102,0.15)]',   text: 'text-green-400',  bg: 'bg-green-950/30',  badge: 'bg-green-950/50 text-green-300 border-green-800/50' },
  purple: { border: 'border-purple-500/40', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.15)]',  text: 'text-purple-400', bg: 'bg-purple-950/30', badge: 'bg-purple-950/50 text-purple-300 border-purple-800/50' },
  yellow: { border: 'border-yellow-500/40', glow: 'shadow-[0_0_20px_rgba(234,179,8,0.15)]',   text: 'text-yellow-400', bg: 'bg-yellow-950/30', badge: 'bg-yellow-950/50 text-yellow-300 border-yellow-800/50' },
};

export default function LabModule() {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const active = MODULES.find(m => m.id === activeModule);

  return (
    <div className="min-h-screen w-full bg-[#010409] text-[#00f0ff] font-mono overflow-y-auto pb-24 relative">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-[0.05]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto p-4 md:p-8 pt-8 md:pt-12 flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-cyan-900/50 pb-6">
          <div className="p-3 bg-cyan-950/50 border border-cyan-500/40 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            <TestTube className="w-7 h-7 text-[#00f0ff]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-[0.2em] text-[#00f0ff] drop-shadow-[0_0_15px_rgba(0,240,255,0.7)] uppercase">
              Smart Ichthyometer & Lab
            </h1>
            <p className="text-[10px] text-cyan-600 tracking-[0.3em] uppercase font-bold mt-1">Biometric Analysis & Feed Optimization</p>
          </div>
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {MODULES.map(mod => {
            const C = COLOR_MAP[mod.color];
            const isActive = activeModule === mod.id;
            return (
              <motion.button
                key={mod.id}
                onClick={() => setActiveModule(isActive ? null : mod.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`glass-panel p-6 text-left border rounded-2xl relative overflow-hidden transition-all duration-300 ${C.border} ${isActive ? C.glow : 'shadow-none hover:' + C.glow} ${C.bg}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <mod.icon className={`w-5 h-5 ${C.text}`} />
                    <h3 className={`font-black text-sm tracking-widest uppercase ${C.text}`}>{mod.label}</h3>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded border ${C.badge}`}>
                    {isActive ? 'ACTIVE' : 'STANDBY'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{mod.description}</p>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 grid grid-cols-3 gap-3 overflow-hidden"
                    >
                      {mod.stats.map(s => (
                        <div key={s.label} className="text-center p-2 bg-[#010811]/80 rounded-lg border border-cyan-900/30">
                          <p className="text-[8px] text-slate-500 uppercase tracking-widest">{s.label}</p>
                          <p className={`text-lg font-black font-mono mt-1 ${C.text}`}>{s.value}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        {/* System Status Bar */}
        <div className="p-4 bg-[#010811]/80 border border-cyan-900/40 rounded-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs tracking-widest text-cyan-700">
            <Activity className="w-4 h-4" />
            <span>STATUS:</span><span className="text-cyan-400 font-bold">ONLINE</span>
          </div>
          <div className="flex items-center gap-3 text-xs tracking-widest text-cyan-700">
            <Database className="w-4 h-4" />
            <span>SYNC:</span><span className="text-green-400 font-bold">ACTIVE</span>
          </div>
          <div className="flex items-center gap-3 text-xs tracking-widest text-cyan-700">
            <Cpu className="w-4 h-4" />
            <span>AI ENGINE:</span><span className="text-purple-400 font-bold">READY</span>
          </div>
          <div className="flex items-center gap-3 text-xs tracking-widest text-cyan-700">
            <RefreshCw className="w-3 h-3 text-cyan-500 animate-spin" />
            <span className="text-cyan-600">Last sync 2 min ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
