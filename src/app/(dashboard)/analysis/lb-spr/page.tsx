"use client";

import { useState, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { Activity, Settings2, ShieldAlert, Cpu, AlertTriangle } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function LBSprPage() {
  const [mkRatio, setMkRatio] = useState<number>(1.5);
  const [l50, setL50] = useState<number>(35);
  const [l95, setL95] = useState<number>(45);
  const [fmRatio, setFmRatio] = useState<number>(1.0);
  
  const [jarvisThinking, setJarvisThinking] = useState(false);

  // Approximate SPR Calculation for UI Interactivity
  // A true LB-SPR calculates integrals over length classes. We simulate the final SPR% 
  // based on the core interactions of these 4 parameters to drive the interactive UI.
  const calculateSPR = (mk: number, fm: number, l50Val: number) => {
    // Highly simplified proxy model: High M/K and High F/M drops SPR.
    // Base SPR (Unfished) is 100%. 
    // Fishing pressure (F/M) exponentially decreases SPR.
    const baseSpr = 100 * Math.exp(-0.8 * fm * (mk / 1.5));
    // L50 shift: If L50 is very small relative to max size, SPR drops faster.
    const l50Factor = Math.min(1, Math.max(0.2, l50 / 60)); 
    const finalSpr = Math.max(5, Math.min(100, baseSpr * l50Factor));
    return finalSpr;
  };

  const currentSPR = useMemo(() => calculateSPR(mkRatio, fmRatio, l50), [mkRatio, fmRatio, l50]);

  // Determine Threshold Status
  const getStatus = (spr: number) => {
    if (spr > 40) return { label: "Healthy Stock", color: "text-emerald-400", hex: "#34d399", shadow: "shadow-[0_0_20px_rgba(52,211,153,0.3)]", bg: "bg-emerald-950/20", border: "border-emerald-500/50" };
    if (spr >= 20) return { label: "Fully Exploited", color: "text-yellow-400", hex: "#facc15", shadow: "shadow-[0_0_20px_rgba(250,204,21,0.3)]", bg: "bg-yellow-950/20", border: "border-yellow-500/50" };
    return { label: "CRITICAL DEPLETION", color: "text-red-400", hex: "#f87171", shadow: "shadow-[0_0_30px_rgba(248,113,113,0.5)]", bg: "bg-red-950/20", border: "border-red-500/50" };
  };

  const status = getStatus(currentSPR);

  // Generate Area Chart Data (Relative Length vs Reproductive Potential)
  const chartData = useMemo(() => {
    const data = [];
    for (let l = 10; l <= 80; l += 2) {
      // Maturity ogive simulation
      const maturity = 1 / (1 + Math.exp(-0.5 * (l - l50)));
      // Density drops with length due to mortality
      const density = Math.max(0, 100 - (l * 1.2));
      // Potential is the product of maturity and surviving density, scaled by overall SPR
      const unfishedPotential = maturity * density;
      const fishedPotential = unfishedPotential * (currentSPR / 100);
      
      data.push({
        length: l,
        unfished: unfishedPotential,
        fished: fishedPotential
      });
    }
    return data;
  }, [currentSPR, l50]);

  const triggerJarvisDiagnostic = () => {
    setJarvisThinking(true);
    setTimeout(() => {
      setJarvisThinking(false);
      let message = "";
      if (currentSPR > 40) {
        message = `The Spawning Potential Ratio is currently at ${currentSPR.toFixed(1)} percent. The stock is maintaining robust reproductive capacity.`;
      } else if (currentSPR >= 20) {
        message = `Caution. The Spawning Potential Ratio has fallen to ${currentSPR.toFixed(1)} percent. The stock is fully exploited and approaching dangerous thresholds.`;
      } else {
        message = `Critical alert! The Spawning Potential Ratio is at ${currentSPR.toFixed(1)} percent, well below the 20 percent safety threshold. Immediate reduction in fishing mortality is advised to prevent stock collapse.`;
      }
      const event = new CustomEvent("jarvisVoiceCommand", { detail: message });
      window.dispatchEvent(event);
    }, 1200);
  };

  // SVG Gauge Calculations
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentSPR / 100) * circumference;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full h-full p-4 md:p-8 flex flex-col gap-6 relative">
      {/* Danger Pulse if Critical */}
      {currentSPR < 20 && (
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-red-900/5 animate-pulse"></div>
          <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(248,113,113,0.1)] animate-pulse"></div>
        </div>
      )}

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between relative z-10"
      >
        <div className="flex items-center gap-3">
          <div className={`p-3 bg-cyan-950/50 border rounded-xl ${status.border} ${status.shadow} transition-all duration-500`}>
            <Activity className={`w-6 h-6 ${status.color} transition-colors duration-500`} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
              LB-SPR Framework
            </h1>
            <p className="text-cyan-100/70 text-sm font-light">Length-Based Spawning Potential Ratio</p>
          </div>
        </div>
        
        {/* JARVIS Trigger Button */}
        <button
          onClick={triggerJarvisDiagnostic}
          disabled={jarvisThinking}
          className={`px-4 py-2 flex items-center gap-2 rounded-lg font-mono text-xs font-bold uppercase tracking-widest transition-all border ${status.bg} ${status.border} ${status.color} ${status.shadow} hover:brightness-125`}
        >
          {jarvisThinking ? <Cpu className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
          Request SPR Diagnostic
        </button>
      </motion.div>

      {currentSPR < 20 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full bg-red-950/40 border border-red-500/50 rounded-xl p-4 flex items-center gap-4 shadow-[0_0_20px_rgba(248,113,113,0.2)] animate-pulse"
        >
          <AlertTriangle className="w-6 h-6 text-red-400" />
          <div>
            <h3 className="text-red-300 font-bold tracking-widest text-sm uppercase">Recruitment Overfishing Detected</h3>
            <p className="text-red-200/70 text-xs">The spawning stock biomass has fallen below the 20% limit reference point.</p>
          </div>
        </motion.div>
      )}

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 relative z-10"
      >
        {/* Left Column: Parameters */}
        <motion.div variants={itemVariants} className="xl:col-span-1 bg-cyan-950/20 backdrop-blur-3xl border border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.1)] rounded-3xl p-6 flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none z-0"></div>
          
          <div className="flex items-center gap-2 mb-6 relative z-10">
            <Settings2 className="w-4 h-4 text-cyan-500" />
            <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-widest">Life History & Fishing Drivers</h3>
          </div>
          
          <div className="space-y-6 relative z-10">
            {/* M/K Ratio */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="text-slate-400 text-sm font-medium">M/K Ratio</label>
                <span className="text-lg font-mono font-bold text-cyan-300 drop-shadow-[0_0_5px_rgba(103,232,249,0.8)]">
                  {mkRatio.toFixed(2)}
                </span>
              </div>
              <input 
                type="range" min="0.1" max="3.0" step="0.05" value={mkRatio}
                onChange={(e) => setMkRatio(Number(e.target.value))}
                className="w-full h-1.5 bg-cyan-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* L50 */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="text-slate-400 text-sm font-medium">L50 (Maturity)</label>
                <span className="text-lg font-mono font-bold text-blue-300 drop-shadow-[0_0_5px_rgba(147,197,253,0.8)]">
                  {l50} <span className="text-xs text-blue-500">cm</span>
                </span>
              </div>
              <input 
                type="range" min="20" max="60" step="1" value={l50}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setL50(val);
                  if (val >= l95) setL95(val + 2);
                }}
                className="w-full h-1.5 bg-cyan-950 rounded-lg appearance-none cursor-pointer accent-blue-400"
              />
            </div>

            {/* L95 */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="text-slate-400 text-sm font-medium">L95 (Maturity)</label>
                <span className="text-lg font-mono font-bold text-blue-300 drop-shadow-[0_0_5px_rgba(147,197,253,0.8)]">
                  {l95} <span className="text-xs text-blue-500">cm</span>
                </span>
              </div>
              <input 
                type="range" min={l50 + 2} max="80" step="1" value={l95}
                onChange={(e) => setL95(Number(e.target.value))}
                className="w-full h-1.5 bg-cyan-950 rounded-lg appearance-none cursor-pointer accent-blue-400"
              />
            </div>

            <div className="h-px bg-gradient-to-r from-cyan-500/20 via-cyan-500/10 to-transparent"></div>

            {/* F/M Ratio */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="text-slate-400 text-sm font-medium">F/M Ratio (Fishing Pressure)</label>
                <span className={`text-lg font-mono font-bold drop-shadow-[0_0_5px_currentColor] ${status.color} transition-colors duration-500`}>
                  {fmRatio.toFixed(2)}
                </span>
              </div>
              <input 
                type="range" min="0.1" max="4.0" step="0.1" value={fmRatio}
                onChange={(e) => setFmRatio(Number(e.target.value))}
                className="w-full h-1.5 bg-cyan-950 rounded-lg appearance-none cursor-pointer accent-current"
                style={{ color: status.hex }}
              />
            </div>
          </div>
        </motion.div>

        {/* Right Column: Dynamic Gauge & Area Chart */}
        <motion.div variants={itemVariants} className="xl:col-span-2 grid grid-rows-[auto_1fr] gap-6">
          
          {/* Top Half: The Gauge and Status */}
          <div className="bg-cyan-950/10 backdrop-blur-3xl border border-cyan-400/20 shadow-[0_0_30px_rgba(6,182,212,0.15)] rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-center gap-8 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_50px_rgba(6,182,212,0.05)] z-0"></div>
            
            {/* Custom SVG Circular Gauge */}
            <div className="relative w-48 h-48 flex-shrink-0 z-10">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                {/* Background Track */}
                <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(34, 211, 238, 0.1)" strokeWidth="8" />
                {/* Dynamic Progress Indicator */}
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="none"
                  stroke={status.hex}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-out"
                  style={{ filter: `drop-shadow(0 0 8px ${status.hex})` }}
                />
              </svg>
              {/* Inner Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-mono font-bold ${status.color} transition-colors duration-1000 drop-shadow-[0_0_10px_currentColor]`}>
                  {currentSPR.toFixed(0)}%
                </span>
                <span className="text-[10px] text-cyan-100/50 uppercase tracking-widest mt-1">SPR</span>
              </div>
            </div>

            <div className="flex flex-col text-center sm:text-left z-10 max-w-xs">
              <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Ecological Status</h2>
              <div className={`text-2xl font-bold uppercase tracking-wide mb-2 ${status.color} transition-colors duration-500 drop-shadow-[0_0_10px_currentColor]`}>
                {status.label}
              </div>
              <p className="text-cyan-100/70 text-sm leading-relaxed font-light">
                {currentSPR > 40 
                  ? "The spawning potential is well above the 40% target reference point. Current exploitation levels are highly sustainable." 
                  : currentSPR >= 20 
                  ? "The stock is fully exploited. Management should monitor F/M closely to prevent dropping below the 20% limit reference point." 
                  : "Danger. The stock lacks sufficient reproductive biomass to replenish itself. Severe catch restrictions are recommended."}
              </p>
            </div>
          </div>

          {/* Bottom Half: Area Chart */}
          <div className="bg-cyan-950/10 backdrop-blur-3xl border border-cyan-400/20 shadow-[0_0_30px_rgba(6,182,212,0.15)] rounded-3xl p-6 flex flex-col relative overflow-hidden min-h-[300px]">
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_50px_rgba(6,182,212,0.05)] z-0"></div>
            
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-widest drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">
                Spawning Potential Profile
              </h2>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-cyan-100">
                  <span className="w-3 h-3 rounded-sm bg-slate-500/50 border border-slate-500"></span> Unfished
                </span>
                <span className="flex items-center gap-1.5 text-blue-300">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: status.hex, border: `1px solid ${status.hex}`, opacity: 0.8 }}></span> Fished (Current)
                </span>
              </div>
            </div>

            <div className="flex-1 w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#0891b2" opacity={0.15} vertical={false} />
                  
                  <XAxis 
                    dataKey="length" 
                    type="number" 
                    stroke="#0891b2"
                    tick={{ fill: "#67e8f9", fontSize: 10, fontFamily: "monospace" }}
                    label={{ value: 'Length (cm)', position: 'insideBottom', offset: -10, fill: '#0891b2', fontSize: 10 }}
                  />
                  
                  <YAxis 
                    stroke="#0891b2"
                    tick={{ fill: "#67e8f9", fontSize: 10, fontFamily: "monospace" }}
                    label={{ value: 'Reproductive Potential', angle: -90, position: 'insideLeft', fill: '#0891b2', fontSize: 10 }}
                  />

                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(8, 51, 68, 0.95)', borderColor: 'rgba(34, 211, 238, 0.4)', borderRadius: '12px', color: '#cffafe', fontFamily: 'monospace' }}
                  />

                  {/* Unfished Area (Baseline) */}
                  <Area 
                    type="monotone" 
                    dataKey="unfished" 
                    name="Unfished Density"
                    stroke="#64748b" 
                    fill="#334155" 
                    fillOpacity={0.3}
                    strokeWidth={2}
                    isAnimationActive={false}
                  />

                  {/* Fished Area (Dynamic) */}
                  <Area 
                    type="monotone" 
                    dataKey="fished" 
                    name="Current Density"
                    stroke={status.hex} 
                    fill={status.hex} 
                    fillOpacity={0.4}
                    strokeWidth={2}
                    style={{ transition: 'all 0.5s ease-out', filter: `drop-shadow(0 0 8px ${status.hex})` }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
