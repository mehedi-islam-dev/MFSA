"use client";

import React, { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Activity, Database, Cpu, Terminal, ChevronRight, List, Camera, DatabaseBackup, Leaf } from 'lucide-react';
import Link from 'next/link';
import { useData } from "@/components/providers/DataProvider";

// --- Framer Motion Variants ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  }
};

const RECENT_TELEMETRY = [
  { time: '12:00 PM', event: 'LB-SPR Assessment Completed', detail: 'Tenualosa ilisha SPR at 18.4% (Critical)', status: 'warning' },
  { time: '10:30 AM', event: 'Microplastics Simulation Saved', detail: 'Trophic magnification modeled for Sector 4', status: 'success' },
  { time: '09:15 AM', event: 'New EIA Policy Generated', detail: 'Locally cached to IndexedDB. Awaiting sync.', status: 'info' },
  { time: '08:00 AM', event: 'Drone Fleet Connected', detail: '4/4 UAVs linked. Radar sweep active.', status: 'success' },
];

export default function CentralCommandDashboard() {
  const [bootSequence, setBootSequence] = useState(false);
  const { fishRecords } = useData();

  useEffect(() => {
    // Simulate a brief system check before showing the dashboard
    const timer = setTimeout(() => {
      setBootSequence(true);
      
      // JARVIS Greeting
      if ('speechSynthesis' in window) {
         window.speechSynthesis.cancel();
         const msg = new SpeechSynthesisUtterance("Central command online. Systems fully operational. Welcome back, Architect.");
         msg.rate = 0.95; msg.pitch = 0.85;
         // window.speechSynthesis.speak(msg); // Optional: disabled by default so it doesn't scare the user
      }
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (!bootSequence) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#010409] flex flex-col items-center justify-center font-mono text-[var(--color-neon-cyan)]">
        <Activity className="w-12 h-12 animate-spin mb-6 drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]" />
        <h1 className="text-xl tracking-[0.3em] font-bold uppercase">Initializing Core Systems</h1>
        <div className="w-64 h-1 bg-slate-800 mt-4 rounded overflow-hidden">
           <motion.div 
             className="h-full bg-[var(--color-neon-cyan)] shadow-[0_0_10px_rgba(0,240,255,1)]" 
             initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 0.7 }}
           />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] text-[var(--color-neon-cyan)] font-mono flex flex-col gap-8 max-w-7xl mx-auto pb-12">
      
      {/* Dashboard Header */}
      <motion.header 
         initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
         className="flex flex-col md:flex-row md:items-end justify-between border-b border-[var(--color-neon-cyan)]/30 pb-6 gap-4 shrink-0 relative"
      >
        <div>
          <h1 className="text-3xl font-black uppercase tracking-[0.3em] text-[var(--color-neon-cyan)] drop-shadow-[0_0_15px_rgba(0,240,255,0.8)] flex items-center gap-4">
            <Terminal className="w-8 h-8" />
            Central Command
          </h1>
          <p className="text-sm font-bold text-[var(--color-neon-purple)] uppercase tracking-widest mt-2">
            Marine Analytica — Autonomous Intelligence Network
          </p>
        </div>
        <div className="text-[10px] bg-[rgba(1,4,9,0.8)] border border-[var(--color-neon-cyan)]/50 px-4 py-2 rounded text-[var(--color-neon-cyan)] tracking-widest font-bold shadow-[0_0_15px_rgba(0,240,255,0.2)]">
          [ SYSTEM ARCHITECT : AUTHORIZED ]
        </div>
      </motion.header>

      <motion.div 
         variants={containerVariants} 
         initial="hidden" 
         animate="visible"
         className="flex flex-col gap-8 w-full"
      >
        
        {/* Top Section: System Vitals & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           
           {/* Total Records DB Stats */}
           <motion.div variants={itemVariants} className="glass-panel p-6 border border-[var(--color-neon-cyan)]/30 shadow-[0_0_20px_rgba(0,240,255,0.1)] rounded-xl relative overflow-hidden bg-[rgba(1,4,9,0.5)] group hover:shadow-[0_0_30px_rgba(0,240,255,0.2)] transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-neon-cyan)]/5 to-transparent pointer-events-none" />
              <div className="flex justify-between items-center relative z-10 mb-4">
                 <h3 className="text-xs tracking-[0.2em] text-slate-400 font-bold uppercase">IndexedDB Vault</h3>
                 <DatabaseBackup className="w-5 h-5 text-[var(--color-neon-cyan)]" />
              </div>
              <div className="relative z-10 flex items-end gap-2">
                 <span className="text-4xl font-black text-slate-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{fishRecords.length}</span>
                 <span className="text-xs text-[var(--color-neon-cyan)] font-bold mb-1 tracking-widest">RECORDS</span>
              </div>
           </motion.div>

           {/* API Status */}
           <motion.div variants={itemVariants} className="glass-panel p-6 border border-[var(--color-neon-green)]/30 shadow-[0_0_20px_rgba(0,255,102,0.1)] rounded-xl relative overflow-hidden bg-[rgba(1,4,9,0.5)] group hover:shadow-[0_0_30px_rgba(0,255,102,0.2)] transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-neon-green)]/5 to-transparent pointer-events-none" />
              <div className="flex justify-between items-center relative z-10 mb-4">
                 <h3 className="text-xs tracking-[0.2em] text-slate-400 font-bold uppercase">DaaS API Network</h3>
                 <div className="relative">
                   <div className="w-3 h-3 rounded-full bg-[var(--color-neon-green)] shadow-[0_0_10px_rgba(0,255,102,0.8)] absolute"></div>
                   <div className="w-3 h-3 rounded-full bg-[var(--color-neon-green)] animate-ping"></div>
                 </div>
              </div>
              <div className="relative z-10">
                 <span className="text-xl font-black text-[var(--color-neon-green)] tracking-widest uppercase drop-shadow-[0_0_10px_rgba(0,255,102,0.8)]">Online</span>
                 <div className="text-[10px] text-slate-400 mt-1 uppercase">0ms Latency</div>
              </div>
           </motion.div>

           {/* Digital Twin Status */}
           <motion.div variants={itemVariants} className="glass-panel p-6 border border-[var(--color-neon-purple)]/30 shadow-[0_0_20px_rgba(168,85,247,0.1)] rounded-xl relative overflow-hidden bg-[rgba(1,4,9,0.5)] group hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-neon-purple)]/5 to-transparent pointer-events-none" />
              <div className="flex justify-between items-center relative z-10 mb-4">
                 <h3 className="text-xs tracking-[0.2em] text-slate-400 font-bold uppercase">Ocean Digital Twin</h3>
                 <div className="relative">
                   <div className="w-3 h-3 rounded-full bg-[var(--color-neon-purple)] shadow-[0_0_10px_rgba(168,85,247,0.8)] absolute"></div>
                   <div className="w-3 h-3 rounded-full bg-[var(--color-neon-purple)] animate-pulse"></div>
                 </div>
              </div>
              <div className="relative z-10">
                 <span className="text-xl font-black text-[var(--color-neon-purple)] tracking-widest uppercase drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">Active</span>
                 <div className="text-[10px] text-slate-400 mt-1 uppercase">Live Telemetry Feed</div>
              </div>
           </motion.div>

           {/* AI Vision Status */}
           <motion.div variants={itemVariants} className="glass-panel p-6 border border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.1)] rounded-xl relative overflow-hidden bg-[rgba(1,4,9,0.5)] group hover:shadow-[0_0_30px_rgba(234,179,8,0.2)] transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent pointer-events-none" />
              <div className="flex justify-between items-center relative z-10 mb-4">
                 <h3 className="text-xs tracking-[0.2em] text-slate-400 font-bold uppercase">Neural Vision Net</h3>
                 <div className="relative">
                   <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)] absolute"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
                 </div>
              </div>
              <div className="relative z-10">
                 <span className="text-xl font-black text-yellow-500 tracking-widest uppercase drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]">Standby</span>
                 <div className="text-[10px] text-slate-400 mt-1 uppercase">Awaiting Target</div>
              </div>
           </motion.div>
        </div>

        {/* Middle & Bottom Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Quick Launch Grid (Spans 2 columns) */}
           <div className="lg:col-span-2 flex flex-col gap-4">
              <motion.h2 variants={itemVariants} className="text-xs font-bold tracking-[0.25em] text-[var(--color-neon-cyan)] flex items-center gap-2 border-b border-[var(--color-neon-cyan)]/30 pb-2 drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">
                 <Cpu className="w-4 h-4" /> MODULE QUICK LAUNCH
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 h-full">
                 
                 <motion.div variants={itemVariants}>
                    <Link href="/data-entry" className="block group h-full">
                       <div className="glass-panel p-6 border border-[var(--color-neon-cyan)]/30 shadow-[0_0_20px_rgba(0,240,255,0.1)] rounded-xl relative overflow-hidden bg-[rgba(1,4,9,0.5)] h-full flex flex-col hover:border-[var(--color-neon-cyan)] hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all duration-300">
                          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[var(--color-neon-cyan)]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                          <div className="flex justify-between items-start mb-6 relative z-10">
                             <div className="p-3 rounded-lg bg-slate-900 border border-[var(--color-neon-cyan)]/30 group-hover:border-[var(--color-neon-cyan)] transition-colors">
                                <Database className="w-6 h-6 text-[var(--color-neon-cyan)]" />
                             </div>
                             <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-[var(--color-neon-cyan)] transition-transform group-hover:translate-x-1" />
                          </div>
                          <div className="mt-auto relative z-10">
                             <h3 className="text-sm font-bold tracking-widest text-slate-100 mb-1 uppercase drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">Data Entry</h3>
                             <p className="text-[10px] text-slate-400 tracking-wider font-bold uppercase">In-App Spreadsheet</p>
                          </div>
                       </div>
                    </Link>
                 </motion.div>

                 <motion.div variants={itemVariants}>
                    <Link href="/ai-vision" className="block group h-full">
                       <div className="glass-panel p-6 border border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.1)] rounded-xl relative overflow-hidden bg-[rgba(1,4,9,0.5)] h-full flex flex-col hover:border-yellow-500 hover:shadow-[0_0_30px_rgba(234,179,8,0.3)] transition-all duration-300">
                          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-yellow-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                          <div className="flex justify-between items-start mb-6 relative z-10">
                             <div className="p-3 rounded-lg bg-slate-900 border border-yellow-500/30 group-hover:border-yellow-500 transition-colors">
                                <Camera className="w-6 h-6 text-yellow-500" />
                             </div>
                             <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-yellow-500 transition-transform group-hover:translate-x-1" />
                          </div>
                          <div className="mt-auto relative z-10">
                             <h3 className="text-sm font-bold tracking-widest text-slate-100 mb-1 uppercase drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">AI Vision</h3>
                             <p className="text-[10px] text-slate-400 tracking-wider font-bold uppercase">Autonomous Scanner</p>
                          </div>
                       </div>
                    </Link>
                 </motion.div>

                 <motion.div variants={itemVariants}>
                    <Link href="/ecosystem" className="block group h-full">
                       <div className="glass-panel p-6 border border-[var(--color-neon-purple)]/30 shadow-[0_0_20px_rgba(168,85,247,0.1)] rounded-xl relative overflow-hidden bg-[rgba(1,4,9,0.5)] h-full flex flex-col hover:border-[var(--color-neon-purple)] hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all duration-300">
                          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[var(--color-neon-purple)]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                          <div className="flex justify-between items-start mb-6 relative z-10">
                             <div className="p-3 rounded-lg bg-slate-900 border border-[var(--color-neon-purple)]/30 group-hover:border-[var(--color-neon-purple)] transition-colors">
                                <Leaf className="w-6 h-6 text-[var(--color-neon-purple)]" />
                             </div>
                             <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-[var(--color-neon-purple)] transition-transform group-hover:translate-x-1" />
                          </div>
                          <div className="mt-auto relative z-10">
                             <h3 className="text-sm font-bold tracking-widest text-slate-100 mb-1 uppercase drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">Digital Twin</h3>
                             <p className="text-[10px] text-slate-400 tracking-wider font-bold uppercase">Ocean Telemetry</p>
                          </div>
                       </div>
                    </Link>
                 </motion.div>

              </div>
           </div>

           {/* Recent Telemetry & Activity */}
           <div className="flex flex-col gap-4">
              <motion.h2 variants={itemVariants} className="text-xs font-bold tracking-[0.25em] text-[var(--color-neon-cyan)] flex items-center gap-2 border-b border-[var(--color-neon-cyan)]/30 pb-2 drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">
                 <List className="w-4 h-4" /> RECENT TELEMETRY
              </motion.h2>
              <motion.div variants={itemVariants} className="flex-1 glass-panel bg-[rgba(1,4,9,0.5)] rounded-xl border border-[var(--color-neon-cyan)]/30 p-6 shadow-[inset_0_0_30px_rgba(0,240,255,0.05)] mt-2 flex flex-col gap-5 overflow-y-auto max-h-[300px] lg:max-h-none">
                 
                 {RECENT_TELEMETRY.map((log, i) => (
                    <div key={i} className="flex gap-4 border-l-2 border-[var(--color-neon-cyan)]/30 pl-4 relative group">
                       <div className={`absolute -left-[5px] top-1 w-2 h-2 rounded-full 
                          ${log.status === 'warning' ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]' : 
                            log.status === 'success' ? 'bg-[var(--color-neon-green)] shadow-[0_0_8px_rgba(0,255,102,0.8)]' : 
                            'bg-[var(--color-neon-cyan)] shadow-[0_0_8px_rgba(0,240,255,0.8)]'}`} 
                       />
                       <div className="flex flex-col w-full">
                          <div className="flex justify-between items-start mb-1">
                             <span className={`text-[10px] font-bold tracking-widest uppercase ${
                                log.status === 'warning' ? 'text-yellow-400' : 
                                log.status === 'success' ? 'text-[var(--color-neon-green)]' : 
                                'text-[var(--color-neon-cyan)]'
                             }`}>
                                {log.event}
                             </span>
                             <span className="text-[8px] text-slate-500 tracking-widest font-bold whitespace-nowrap ml-2">
                                {log.time}
                             </span>
                          </div>
                          <span className="text-[10px] text-slate-400 tracking-wider">
                             {log.detail}
                          </span>
                       </div>
                    </div>
                 ))}
                 
                 <div className="mt-auto pt-4 flex justify-center opacity-50 border-t border-[var(--color-neon-cyan)]/20">
                    <Activity className="w-4 h-4 animate-pulse text-[var(--color-neon-cyan)]" />
                 </div>
              </motion.div>
           </div>

        </div>
      </motion.div>
    </div>
  );
}
