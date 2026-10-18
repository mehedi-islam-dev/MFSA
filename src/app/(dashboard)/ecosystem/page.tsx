"use client";

import { Droplets, Activity, Thermometer, Wind, Radar, Waves } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DigitalTwinPage() {
  const [telemetry, setTelemetry] = useState({
    temp: 28.5,
    salinity: 32.1,
    depth: -45,
    currents: 1.2,
  });

  // Mock real-time data updates every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => ({
        temp: +(prev.temp + (Math.random() * 0.4 - 0.2)).toFixed(1),
        salinity: +(prev.salinity + (Math.random() * 0.2 - 0.1)).toFixed(1),
        depth: +(prev.depth + (Math.random() * 2 - 1)).toFixed(0),
        currents: +(prev.currents + (Math.random() * 0.2 - 0.1)).toFixed(2),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-mono text-[var(--color-neon-cyan)] relative">
      
      {/* Header */}
      <div className="border-b border-[var(--color-neon-cyan)]/30 pb-4 relative">
        <h1 className="text-3xl font-black flex items-center gap-3 text-[var(--color-neon-cyan)] uppercase tracking-[0.3em] drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]">
          <Radar className="w-8 h-8 animate-[spin_3s_linear_infinite]" />
          Ocean Digital Twin
        </h1>
        <p className="text-sm font-bold text-[var(--color-neon-purple)] uppercase tracking-widest mt-2">
          Global Real-Time Telemetry Uplink // ACTIVE
        </p>
        <div className="absolute right-0 top-0 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,1)] animate-pulse"></span>
          <span className="text-xs font-bold text-green-400 tracking-widest uppercase">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Radar / Digital Map Simulation */}
        <div className="lg:col-span-2 glass-panel p-6 relative overflow-hidden min-h-[400px] flex items-center justify-center border border-[var(--color-neon-cyan)]/30 shadow-[0_0_30px_rgba(0,240,255,0.1)] rounded-2xl group bg-[rgba(1,4,9,0.5)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.1),transparent_70%)] pointer-events-none" />
          
          {/* Radar Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.1)_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

          {/* Radar Circles */}
          <div className="absolute w-[300px] h-[300px] border border-[var(--color-neon-cyan)]/20 rounded-full shadow-[0_0_15px_rgba(0,240,255,0.1)]"></div>
          <div className="absolute w-[200px] h-[200px] border border-[var(--color-neon-cyan)]/40 rounded-full shadow-[0_0_10px_rgba(0,240,255,0.2)]"></div>
          <div className="absolute w-[100px] h-[100px] border border-[var(--color-neon-cyan)]/60 rounded-full shadow-[0_0_5px_rgba(0,240,255,0.3)]"></div>
          
          {/* Radar Sweep line */}
          <div className="absolute w-[150px] h-[2px] bg-gradient-to-r from-[var(--color-neon-cyan)] to-transparent top-1/2 left-1/2 origin-left animate-[spin_2s_linear_infinite] shadow-[0_0_15px_rgba(0,240,255,0.8)]" />

          {/* Random blips */}
          <motion.div 
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="absolute w-3 h-3 bg-[var(--color-neon-red)] rounded-full top-[30%] left-[40%] shadow-[0_0_10px_rgba(255,0,60,1)]"
          />
          <motion.div 
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
            className="absolute w-2 h-2 bg-[var(--color-neon-green)] rounded-full top-[60%] left-[70%] shadow-[0_0_10px_rgba(0,255,102,1)]"
          />
          <motion.div 
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full top-[45%] left-[25%] shadow-[0_0_10px_rgba(250,204,21,1)]"
          />

          <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300 bg-slate-900/50 px-2 py-1 rounded border border-slate-700/50">Sector: Alpha-Quadrant</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300 bg-slate-900/50 px-2 py-1 rounded border border-slate-700/50">Scan Resolution: 0.5m</p>
          </div>
        </div>

        {/* Live Telemetry Panel */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <h2 className="text-xl font-bold uppercase tracking-widest flex items-center gap-2 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)] bg-slate-900/30 p-2 rounded-lg border border-cyan-900/30">
            <Activity className="w-5 h-5 text-[var(--color-neon-green)] animate-pulse" />
            Live Telemetry
          </h2>
          
          <div className="grid grid-cols-1 gap-4 flex-1">
            
            {/* Temp */}
            <div className="glass-panel p-4 flex items-center justify-between border border-[var(--color-neon-cyan)]/20 shadow-[inset_0_0_15px_rgba(0,240,255,0.05)] rounded-xl relative overflow-hidden group bg-slate-900/40">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-neon-cyan)]/5 to-transparent pointer-events-none" />
              <div className="flex items-center gap-3 relative z-10">
                <Thermometer className="w-6 h-6 text-[var(--color-neon-red)] drop-shadow-[0_0_5px_rgba(255,0,60,0.8)]" />
                <span className="text-xs uppercase tracking-widest text-slate-300 font-bold">Water Temp</span>
              </div>
              <AnimatePresence mode="popLayout">
                <motion.span 
                  key={telemetry.temp}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-2xl font-black drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]"
                >
                  {telemetry.temp.toFixed(1)}°C
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Salinity */}
            <div className="glass-panel p-4 flex items-center justify-between border border-[var(--color-neon-cyan)]/20 shadow-[inset_0_0_15px_rgba(0,240,255,0.05)] rounded-xl relative overflow-hidden group bg-slate-900/40">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-neon-cyan)]/5 to-transparent pointer-events-none" />
              <div className="flex items-center gap-3 relative z-10">
                <Droplets className="w-6 h-6 text-[var(--color-neon-purple)] drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]" />
                <span className="text-xs uppercase tracking-widest text-slate-300 font-bold">Salinity</span>
              </div>
              <AnimatePresence mode="popLayout">
                <motion.span 
                  key={telemetry.salinity}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-2xl font-black drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]"
                >
                  {telemetry.salinity.toFixed(1)} ppt
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Depth */}
            <div className="glass-panel p-4 flex items-center justify-between border border-[var(--color-neon-cyan)]/20 shadow-[inset_0_0_15px_rgba(0,240,255,0.05)] rounded-xl relative overflow-hidden group bg-slate-900/40">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-neon-cyan)]/5 to-transparent pointer-events-none" />
              <div className="flex items-center gap-3 relative z-10">
                <Waves className="w-6 h-6 text-[var(--color-neon-green)] drop-shadow-[0_0_5px_rgba(0,255,102,0.8)]" />
                <span className="text-xs uppercase tracking-widest text-slate-300 font-bold">Sensor Depth</span>
              </div>
              <AnimatePresence mode="popLayout">
                <motion.span 
                  key={telemetry.depth}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-2xl font-black drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]"
                >
                  {telemetry.depth}m
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Currents */}
            <div className="glass-panel p-4 flex items-center justify-between border border-[var(--color-neon-cyan)]/20 shadow-[inset_0_0_15px_rgba(0,240,255,0.05)] rounded-xl relative overflow-hidden group bg-slate-900/40">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-neon-cyan)]/5 to-transparent pointer-events-none" />
              <div className="flex items-center gap-3 relative z-10">
                <Wind className="w-6 h-6 text-[var(--color-neon-cyan)] drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]" />
                <span className="text-xs uppercase tracking-widest text-slate-300 font-bold">Currents</span>
              </div>
              <AnimatePresence mode="popLayout">
                <motion.span 
                  key={telemetry.currents}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-2xl font-black drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]"
                >
                  {telemetry.currents.toFixed(2)} kts
                </motion.span>
              </AnimatePresence>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
