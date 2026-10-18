"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Variants } from "framer-motion";
import { Activity, Database, Sparkles, Cpu, Settings2 } from "lucide-react";
import { useData } from "@/components/providers/DataProvider";
import { deriveLFD } from "@/lib/marineMath";
import { useRouter } from "next/navigation";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function ElefanPage() {
  const { fishRecords } = useData();
  const router = useRouter();

  const [lInfinity, setLInfinity] = useState<number>(60);
  const [kValue, setKValue] = useState<number>(0.5);
  const [jarvisThinking, setJarvisThinking] = useState(false);
  const [jarvisResponse, setJarvisResponse] = useState<string | null>(null);

  // Calculate dynamic max length from data to set slider bounds
  const maxObservedLength = useMemo(() => {
    if (fishRecords.length === 0) return 60;
    return Math.max(...fishRecords.map(r => r.length));
  }, [fishRecords]);

  // Set initial L_infinity slightly above max observed length
  useEffect(() => {
    if (fishRecords.length > 0) {
      setLInfinity(Math.ceil(maxObservedLength * 1.1));
    }
  }, [maxObservedLength, fishRecords.length]);

  // Binning Logic & VBGF Overlay Logic
  const chartData = useMemo(() => {
    if (fishRecords.length === 0) return [];

    const BIN_SIZE = 2; // 2cm bins
    const maxLen = Math.max(lInfinity, maxObservedLength);
    const numBins = Math.ceil(maxLen / BIN_SIZE);

    // Use our intelligent derivation logic
    const baseBins = deriveLFD(fishRecords, BIN_SIZE);

    // Pad bins up to maxLen to ensure the graph shows the full theoretical curve
    const paddedBins = Array.from({ length: numBins }, (_, i) => {
      const lengthBin = (i + 1) * BIN_SIZE;
      const found = baseBins.find(b => b.lengthBin === lengthBin);
      return {
        lengthBin,
        frequency: found ? found.frequency : 0,
      };
    });

    // Calculate theoretical VBGF relative age for the overlay: t = -(1/K) * ln(1 - L/L_inf)
    // We cap it before L equals L_inf to prevent infinity
    return paddedBins.map(bin => {
      let age = null;
      if (bin.lengthBin < lInfinity) {
        age = -(1 / kValue) * Math.log(1 - (bin.lengthBin / lInfinity));
      }
      return {
        ...bin,
        relativeAge: age !== null ? Math.max(0, age) : null
      };
    });
  }, [fishRecords, lInfinity, kValue, maxObservedLength]);

  const handleJarvisInterpret = () => {
    setJarvisResponse(null);
    setJarvisThinking(true);
    
    // Simulate AI thinking delay
    setTimeout(() => {
      setJarvisThinking(false);
      let speed = kValue > 0.6 ? "fast-growing" : kValue < 0.3 ? "slow-growing" : "moderately-growing";
      let status = lInfinity > maxObservedLength * 1.5 
        ? "suggesting the current stock has not reached its full growth potential."
        : "indicating the observed population is near its maximum theoretical size.";
      
      setJarvisResponse(
        `Sir, the asymptotic length is currently modeled at ${lInfinity}cm with a growth coefficient of ${kValue}. This signifies a ${speed} population, ${status}`
      );
    }, 1500);
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
    <div className="w-full h-full p-4 md:p-8 flex flex-col gap-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-3 bg-cyan-950/50 border border-cyan-500/50 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.3)]">
          <Activity className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
            Automated ELEFAN System
          </h1>
          <p className="text-cyan-100/70 text-sm font-light">Von Bertalanffy Growth Function (VBGF) Matrix</p>
        </div>
      </motion.div>

      {fishRecords.length < 5 ? (
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="show"
          className="flex-1 bg-cyan-950/10 backdrop-blur-3xl border border-cyan-400/20 shadow-[0_0_30px_rgba(6,182,212,0.15)] rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_50px_rgba(6,182,212,0.05)] z-0"></div>
          <Database className="w-16 h-16 text-cyan-500/50 mb-4 animate-pulse relative z-10" />
          <h2 className="text-xl font-bold text-cyan-300 relative z-10">Insufficient Cohort Data</h2>
          <p className="text-cyan-100/70 max-w-md mt-2 mb-6 relative z-10">
            The ELEFAN density matrix requires a minimum of 5 records to form a valid length-frequency histogram. Please upload a dataset.
          </p>
          <button
            onClick={() => router.push("/data-entry")}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.8)] transition-all relative z-10"
          >
            Access Data Entry Module
          </button>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 xl:grid-cols-4 gap-6 flex-1"
        >
          {/* Left Pane: Parameters & JARVIS */}
          <div className="xl:col-span-1 flex flex-col gap-6">
            <motion.div variants={itemVariants} className="bg-cyan-950/20 backdrop-blur-3xl border border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.1)] rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none z-0"></div>
              
              <div className="flex items-center gap-2 mb-6 relative z-10">
                <Settings2 className="w-4 h-4 text-cyan-500" />
                <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-widest">VBGF Parameters</h3>
              </div>
              
              <div className="space-y-8 relative z-10">
                {/* L Infinity Slider */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="text-slate-400 text-sm font-medium">L∞ (Asymptotic Length)</label>
                    <span className="text-xl font-mono font-bold text-cyan-300 drop-shadow-[0_0_5px_rgba(103,232,249,0.8)]">
                      {lInfinity} <span className="text-xs text-cyan-500">cm</span>
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min={Math.floor(maxObservedLength * 0.8)} 
                    max={Math.ceil(maxObservedLength * 2.5)} 
                    step="1"
                    value={lInfinity}
                    onChange={(e) => setLInfinity(Number(e.target.value))}
                    className="w-full h-1.5 bg-cyan-950 rounded-lg appearance-none cursor-pointer accent-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                  />
                </div>

                <div className="h-px bg-gradient-to-r from-cyan-500/20 via-cyan-500/10 to-transparent"></div>

                {/* K Value Slider */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="text-slate-400 text-sm font-medium">K (Growth Coefficient)</label>
                    <span className="text-xl font-mono font-bold text-blue-300 drop-shadow-[0_0_5px_rgba(147,197,253,0.8)]">
                      {kValue.toFixed(2)}
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="0.1" 
                    max="2.0" 
                    step="0.01"
                    value={kValue}
                    onChange={(e) => setKValue(Number(e.target.value))}
                    className="w-full h-1.5 bg-cyan-950 rounded-lg appearance-none cursor-pointer accent-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]"
                  />
                </div>
              </div>
            </motion.div>

            {/* JARVIS Interpret Block */}
            <motion.div variants={itemVariants} className="bg-cyan-950/20 backdrop-blur-3xl border border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.1)] rounded-2xl p-6 flex flex-col relative overflow-hidden flex-1">
              <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-4">Neural Analysis</h3>
              
              <button 
                onClick={handleJarvisInterpret}
                disabled={jarvisThinking}
                className="w-full py-3 bg-cyan-950/50 hover:bg-cyan-900/50 border border-cyan-500/50 rounded-xl text-cyan-300 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                {jarvisThinking ? (
                  <>
                    <Cpu className="w-4 h-4 animate-spin" /> Analyzing Matrix...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Jarvis Interpret
                  </>
                )}
              </button>

              <div className="flex-1 bg-black/40 border border-cyan-500/20 rounded-xl p-4 font-mono text-sm overflow-y-auto">
                {jarvisResponse ? (
                  <motion.p 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="text-cyan-100 leading-relaxed"
                  >
                    <span className="text-cyan-500 font-bold mr-2">{">"}</span>
                    {jarvisResponse}
                  </motion.p>
                ) : (
                  <p className="text-cyan-500/40 italic">Awaiting interpretation directive...</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Pane: Visualization HUD */}
          <motion.div 
            variants={itemVariants}
            className="xl:col-span-3 bg-cyan-950/10 backdrop-blur-3xl border border-cyan-400/20 shadow-[0_0_30px_rgba(6,182,212,0.15)] rounded-3xl p-6 flex flex-col relative overflow-hidden min-h-[500px]"
          >
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_50px_rgba(6,182,212,0.05)] z-0"></div>
            
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-widest drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">
                Length-Frequency & VBGF Overlay
              </h2>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-cyan-100">
                  <span className="w-3 h-3 rounded-sm bg-cyan-400/50 border border-cyan-400"></span> Frequency (n)
                </span>
                <span className="flex items-center gap-1.5 text-blue-300">
                  <span className="w-4 h-0.5 bg-blue-400 shadow-[0_0_5px_rgba(96,165,250,0.8)]"></span> Relative Age (t)
                </span>
              </div>
            </div>

            <div className="flex-1 w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#0891b2" opacity={0.15} vertical={false} />
                  
                  <XAxis 
                    dataKey="lengthBin" 
                    type="category" 
                    name="Length" 
                    unit="cm"
                    stroke="#0891b2"
                    tick={{ fill: "#67e8f9", fontSize: 12, fontFamily: "monospace" }}
                  />
                  
                  {/* Primary Y-Axis for Histogram (Frequency) */}
                  <YAxis 
                    yAxisId="left"
                    stroke="#0891b2"
                    tick={{ fill: "#67e8f9", fontSize: 12, fontFamily: "monospace" }}
                    label={{ value: 'Frequency (Count)', angle: -90, position: 'insideLeft', fill: '#0891b2', fontSize: 12 }}
                  />
                  
                  {/* Secondary Y-Axis for VBGF Curve (Relative Age) */}
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="#3b82f6"
                    tick={{ fill: "#93c5fd", fontSize: 12, fontFamily: "monospace" }}
                    label={{ value: 'Relative Age (t)', angle: 90, position: 'insideRight', fill: '#3b82f6', fontSize: 12 }}
                    domain={[0, 'dataMax']}
                  />

                  <Tooltip
                    cursor={{ fill: 'rgba(34, 211, 238, 0.1)' }}
                    contentStyle={{ 
                      backgroundColor: 'rgba(8, 51, 68, 0.95)', 
                      borderColor: 'rgba(34, 211, 238, 0.4)',
                      borderRadius: '12px',
                      color: '#cffafe',
                      boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)',
                      backdropFilter: 'blur(16px)',
                      fontFamily: 'monospace'
                    }}
                    itemStyle={{ color: '#22d3ee' }}
                  />

                  <Bar 
                    yAxisId="left"
                    dataKey="frequency" 
                    name="Count" 
                    fill="rgba(34, 211, 238, 0.4)" 
                    stroke="#22d3ee"
                    strokeWidth={1}
                    radius={[4, 4, 0, 0]}
                  />
                  
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="relativeAge" 
                    name="Relative Age" 
                    stroke="#60a5fa" 
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, fill: "#60a5fa", stroke: "#020617", strokeWidth: 2 }}
                    style={{ filter: "drop-shadow(0px 0px 8px rgba(96, 165, 250, 0.8))" }}
                    connectNulls
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
