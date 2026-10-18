"use client";

import { useState, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { AlertTriangle, TrendingDown, Table2, Activity, ShieldAlert, Cpu } from "lucide-react";
import {
  ComposedChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  LineChart
} from "recharts";

// Mock Data Generators for Biomass Analytics
const generateCatchCurveData = () => {
  const data = [];
  // Simulating Length vs Log(Catch)
  for (let l = 20; l <= 60; l += 2) {
    // True log catch declines linearly after a peak
    const logCatch = l < 30 ? Math.log(l * 5) : 8 - (l * 0.15) + (Math.random() * 0.5);
    const theoreticalZ = l < 30 ? null : 8 - (l * 0.15); // Regression line Z
    data.push({ length: l, logCatch: Math.max(0, logCatch), theoreticalZ: theoreticalZ ? Math.max(0, theoreticalZ) : null });
  }
  return data;
};

const generateVPAData = () => {
  return [
    { class: "20-25cm", n: 15400, f: 0.12, m: 0.2 },
    { class: "25-30cm", n: 12100, f: 0.25, m: 0.2 },
    { class: "30-35cm", n: 8900, f: 0.45, m: 0.2 },
    { class: "35-40cm", n: 5200, f: 0.75, m: 0.2 },
    { class: "40-45cm", n: 2100, f: 0.95, m: 0.2 },
    { class: "45-50cm", n: 800, f: 1.10, m: 0.2 },
  ];
};

const generateYieldData = () => {
  const data = [];
  // Yield per recruit parabolic curve
  for (let f = 0; f <= 1.5; f += 0.1) {
    // Parabola peaking around F=0.6
    const yieldValue = -1000 * Math.pow(f - 0.6, 2) + 400;
    data.push({ fMultiplier: Number(f.toFixed(1)), yield: Math.max(0, yieldValue) });
  }
  return data;
};

export default function BiomassYieldPage() {
  const catchCurveData = useMemo(() => generateCatchCurveData(), []);
  const vpaData = useMemo(() => generateVPAData(), []);
  const yieldData = useMemo(() => generateYieldData(), []);

  // Determine Danger Zone (F > M)
  const isOverfishing = vpaData.some(row => row.f > row.m);

  const [jarvisThinking, setJarvisThinking] = useState(false);

  const triggerJarvisDiagnostic = () => {
    setJarvisThinking(true);
    setTimeout(() => {
      setJarvisThinking(false);
      const message = isOverfishing 
        ? "Warning, sir. Current fishing mortality exceeds natural mortality in older cohorts. The overfishing threshold has been breached." 
        : "All systems nominal. The population biomass remains within sustainable yield margins.";
      
      // Dispatch custom event to the globally mounted MarineAgent
      const event = new CustomEvent("jarvisVoiceCommand", { detail: message });
      window.dispatchEvent(event);
    }, 1000);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full min-h-full p-4 md:p-8 flex flex-col gap-6 relative">
      {/* Dynamic Background Pulse for Danger Zone */}
      {isOverfishing && (
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-red-900/5 animate-pulse"></div>
          <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(220,38,38,0.15)] animate-pulse"></div>
        </div>
      )}

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between relative z-10"
      >
        <div className="flex items-center gap-3">
          <div className={`p-3 border rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.3)] ${isOverfishing ? 'bg-red-950/50 border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'bg-cyan-950/50 border-cyan-500/50'}`}>
            <Activity className={`w-6 h-6 ${isOverfishing ? 'text-red-400' : 'text-cyan-400'}`} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
              Biomass & Yield Analytics
            </h1>
            <p className="text-cyan-100/70 text-sm font-light">VPA, Catch Curve, & MSY Modeling</p>
          </div>
        </div>
        
        {/* JARVIS Trigger Button */}
        <button
          onClick={triggerJarvisDiagnostic}
          disabled={jarvisThinking}
          className={`px-4 py-2 flex items-center gap-2 rounded-lg font-mono text-xs font-bold uppercase tracking-widest transition-all border ${
            isOverfishing 
              ? 'bg-red-950/50 border-red-500/50 text-red-300 hover:bg-red-900/60 shadow-[0_0_15px_rgba(220,38,38,0.3)]' 
              : 'bg-cyan-950/50 border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/60 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
          }`}
        >
          {jarvisThinking ? <Cpu className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
          Jarvis Diagnostic
        </button>
      </motion.div>

      {/* Danger Zone Alert */}
      {isOverfishing && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full bg-red-950/40 border border-red-500/50 rounded-xl p-4 flex items-center gap-4 shadow-[0_0_20px_rgba(220,38,38,0.2)] animate-pulse"
        >
          <AlertTriangle className="w-6 h-6 text-red-400" />
          <div>
            <h3 className="text-red-300 font-bold tracking-widest text-sm uppercase">Warning: Overfishing Threshold Breached</h3>
            <p className="text-red-200/70 text-xs">Fishing Mortality (F) exceeds Natural Mortality (M) in upper cohorts. Population collapse imminent if fishing effort is not reduced.</p>
          </div>
        </motion.div>
      )}

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10"
      >
        {/* Section 1: Catch Curve Analysis */}
        <motion.div 
          variants={itemVariants}
          className="bg-cyan-950/10 backdrop-blur-3xl border border-cyan-400/20 shadow-[0_0_30px_rgba(6,182,212,0.15)] rounded-3xl p-6 flex flex-col relative overflow-hidden h-[400px]"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-4 h-4 text-cyan-500" />
            <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-widest">Catch Curve (Total Mortality Z)</h2>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={catchCurveData} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0891b2" opacity={0.15} vertical={false} />
                <XAxis dataKey="length" type="number" stroke="#0891b2" tick={{ fill: "#67e8f9", fontSize: 10, fontFamily: "monospace" }} label={{ value: 'Length (cm)', position: 'insideBottom', offset: -10, fill: '#0891b2', fontSize: 10 }} />
                <YAxis dataKey="logCatch" type="number" stroke="#0891b2" tick={{ fill: "#67e8f9", fontSize: 10, fontFamily: "monospace" }} label={{ value: 'Log(Catch)', angle: -90, position: 'insideLeft', fill: '#0891b2', fontSize: 10 }} />
                <ZAxis range={[20, 20]} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3', stroke: '#22d3ee', opacity: 0.5 }}
                  contentStyle={{ backgroundColor: 'rgba(8, 51, 68, 0.95)', borderColor: 'rgba(34, 211, 238, 0.4)', borderRadius: '8px', color: '#cffafe', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#22d3ee' }}
                />
                <Scatter name="Observed Catch" dataKey="logCatch" fill="#22d3ee" style={{ filter: "drop-shadow(0px 0px 4px rgba(34, 211, 238, 0.8))" }} />
                <Line type="linear" dataKey="theoreticalZ" name="Regression (Z)" stroke="#60a5fa" strokeWidth={2} strokeDasharray="5 5" dot={false} activeDot={false} connectNulls style={{ filter: "drop-shadow(0px 0px 6px rgba(96, 165, 250, 0.8))" }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Section 3: MSY Yield Plot */}
        <motion.div 
          variants={itemVariants}
          className="bg-cyan-950/10 backdrop-blur-3xl border border-cyan-400/20 shadow-[0_0_30px_rgba(6,182,212,0.15)] rounded-3xl p-6 flex flex-col relative overflow-hidden h-[400px]"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-cyan-500" />
            <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-widest">Yield Per Recruit (MSY)</h2>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yieldData} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0891b2" opacity={0.15} vertical={false} />
                <XAxis dataKey="fMultiplier" stroke="#0891b2" tick={{ fill: "#67e8f9", fontSize: 10, fontFamily: "monospace" }} label={{ value: 'Fishing Mortality (F)', position: 'insideBottom', offset: -10, fill: '#0891b2', fontSize: 10 }} />
                <YAxis dataKey="yield" stroke="#0891b2" tick={{ fill: "#67e8f9", fontSize: 10, fontFamily: "monospace" }} label={{ value: 'Yield (g)', angle: -90, position: 'insideLeft', fill: '#0891b2', fontSize: 10 }} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3', stroke: '#22d3ee', opacity: 0.5 }}
                  contentStyle={{ backgroundColor: 'rgba(8, 51, 68, 0.95)', borderColor: 'rgba(34, 211, 238, 0.4)', borderRadius: '8px', color: '#cffafe', fontFamily: 'monospace' }}
                />
                <Line type="monotone" dataKey="yield" name="Yield" stroke="#34d399" strokeWidth={3} dot={false} style={{ filter: "drop-shadow(0px 0px 8px rgba(52, 211, 153, 0.8))" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Section 2: VPA Cohort Table */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-2 bg-cyan-950/20 backdrop-blur-3xl border border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.1)] rounded-2xl overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none z-0"></div>
          <div className="p-6 border-b border-cyan-500/20 flex items-center gap-2 relative z-10">
            <Table2 className="w-4 h-4 text-cyan-500" />
            <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-widest">Virtual Population Analysis (VPA)</h2>
          </div>
          
          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-left font-mono text-sm">
              <thead className="bg-cyan-950/60 border-b border-cyan-500/30">
                <tr>
                  <th className="px-6 py-4 text-cyan-500 font-bold">Length Class</th>
                  <th className="px-6 py-4 text-cyan-500 font-bold">Population (N)</th>
                  <th className="px-6 py-4 text-cyan-500 font-bold">Natural Mortality (M)</th>
                  <th className="px-6 py-4 text-cyan-500 font-bold">Fishing Mortality (F)</th>
                  <th className="px-6 py-4 text-cyan-500 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-500/10">
                {vpaData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-cyan-500/5 transition-colors">
                    <td className="px-6 py-4 text-cyan-100">{row.class}</td>
                    <td className="px-6 py-4 text-cyan-300">{row.n.toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-400">{row.m.toFixed(2)}</td>
                    <td className={`px-6 py-4 font-bold ${row.f > row.m ? 'text-red-400 drop-shadow-[0_0_5px_rgba(220,38,38,0.8)]' : 'text-emerald-400'}`}>
                      {row.f.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      {row.f > row.m ? (
                        <span className="px-2 py-1 bg-red-950/50 border border-red-500/30 text-red-300 rounded text-xs uppercase tracking-wider">Overfished</span>
                      ) : (
                        <span className="px-2 py-1 bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 rounded text-xs uppercase tracking-wider">Sustainable</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
