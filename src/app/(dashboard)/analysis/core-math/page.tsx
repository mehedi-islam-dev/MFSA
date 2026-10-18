"use client";

import { motion, Variants } from "framer-motion";
import { Calculator, Database, AlertCircle, TrendingUp, TrendingDown, Target } from "lucide-react";
import { useData } from "@/components/providers/DataProvider";
import { useRouter } from "next/navigation";
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
} from "recharts";

export default function CoreMathPage() {
  const { fishRecords, lwrParams } = useData();
  const router = useRouter();

  // Sort records by length to generate a smooth theoretical curve
  const sortedRecords = [...fishRecords].sort((a, b) => a.length - b.length);
  
  // Format data for Recharts ComposedChart
  const chartData = sortedRecords.map(record => {
    const theoreticalWeight = lwrParams.a * Math.pow(record.length, lwrParams.b);
    return {
      length: record.length,
      actualWeight: record.weight,
      theoreticalWeight: isNaN(theoreticalWeight) ? null : theoreticalWeight,
      species: record.species
    };
  });

  const getGrowthInterpretation = (b: number) => {
    if (b === 0) return { text: "Insufficient Data", icon: AlertCircle, color: "text-slate-400" };
    if (b > 2.95 && b < 3.05) return { text: "Isometric Growth (b ≈ 3)", icon: Target, color: "text-cyan-400" };
    if (b < 3) return { text: "Negative Allometric (b < 3)", icon: TrendingDown, color: "text-blue-400" };
    return { text: "Positive Allometric (b > 3)", icon: TrendingUp, color: "text-indigo-400" };
  };

  const interpretation = getGrowthInterpretation(lwrParams.b);

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
          <Calculator className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
            Core Mathematical Engine
          </h1>
          <p className="text-cyan-100/70 text-sm font-light">Length-Weight Relationship (LWR) Analyzer</p>
        </div>
      </motion.div>

      {fishRecords.length < 2 ? (
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="show"
          className="flex-1 bg-cyan-950/10 backdrop-blur-3xl border border-cyan-400/20 shadow-[0_0_30px_rgba(6,182,212,0.15)] rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_50px_rgba(6,182,212,0.05)] z-0"></div>
          <Database className="w-16 h-16 text-cyan-500/50 mb-4 animate-pulse relative z-10" />
          <h2 className="text-xl font-bold text-cyan-300 relative z-10">Insufficient Telemetry Data</h2>
          <p className="text-cyan-100/70 max-w-md mt-2 mb-6 relative z-10">
            The mathematical engine requires a minimum of 2 records to calculate the Length-Weight regression. Please upload a dataset to the In-App Spreadsheet.
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
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1"
        >
          {/* Left Column: Stats & Interpretation */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <motion.div variants={itemVariants} className="bg-cyan-950/20 backdrop-blur-3xl border border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.1)] rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none z-0"></div>
              <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-4 relative z-10">Regression Parameters</h3>
              
              <div className="space-y-6 relative z-10">
                <div>
                  <p className="text-slate-400 text-sm">Slope (b-value)</p>
                  <div className="text-4xl font-mono font-bold text-cyan-300 drop-shadow-[0_0_10px_rgba(103,232,249,0.8)]">
                    {lwrParams.b.toFixed(4)}
                  </div>
                  <div className={`mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-xs font-medium ${interpretation.color}`}>
                    <interpretation.icon className="w-3.5 h-3.5" />
                    {interpretation.text}
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-cyan-500/20 via-cyan-500/10 to-transparent"></div>

                <div>
                  <p className="text-slate-400 text-sm">Intercept (a-value)</p>
                  <div className="text-2xl font-mono font-bold text-cyan-100 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                    {lwrParams.a.toFixed(6)}
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-cyan-500/20 via-cyan-500/10 to-transparent"></div>

                <div>
                  <p className="text-slate-400 text-sm">Confidence (R²)</p>
                  <div className="text-2xl font-mono font-bold text-blue-300 drop-shadow-[0_0_5px_rgba(147,197,253,0.5)]">
                    {lwrParams.r2.toFixed(4)}
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-cyan-950/20 backdrop-blur-3xl border border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.1)] rounded-2xl p-6 flex-1">
               <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-4">Dataset Integrity</h3>
               <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-12 bg-cyan-950/50 border border-cyan-500/50 rounded-full flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                   <Database className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-2xl font-mono font-bold text-white">{fishRecords.length}</p>
                   <p className="text-slate-400 text-sm">Total Records Loaded</p>
                 </div>
               </div>
               <p className="text-xs text-cyan-100/60 leading-relaxed font-light">
                 The mathematical engine uses log-transformed linear regression (log W = log a + b * log L) to calculate parameters across the entire loaded telemetry buffer.
               </p>
            </motion.div>
          </div>

          {/* Right Column: Visualization HUD */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-2 bg-cyan-950/10 backdrop-blur-3xl border border-cyan-400/20 shadow-[0_0_30px_rgba(6,182,212,0.15)] rounded-3xl p-6 flex flex-col relative overflow-hidden min-h-[400px]"
          >
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_50px_rgba(6,182,212,0.05)] z-0"></div>
            
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-widest drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">
                LWR Regression Curve
              </h2>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-cyan-100">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.8)]"></span> Actual
                </span>
                <span className="flex items-center gap-1.5 text-blue-300">
                  <span className="w-4 h-0.5 bg-blue-400 shadow-[0_0_5px_rgba(96,165,250,0.8)]"></span> Theoretical
                </span>
              </div>
            </div>

            <div className="flex-1 w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#0891b2" opacity={0.2} vertical={false} />
                  <XAxis 
                    dataKey="length" 
                    type="number" 
                    name="Length" 
                    unit=" cm"
                    stroke="#0891b2"
                    tick={{ fill: "#67e8f9", fontSize: 12, fontFamily: "monospace" }}
                    domain={['auto', 'auto']}
                    tickFormatter={(val) => val.toFixed(1)}
                  />
                  <YAxis 
                    dataKey="actualWeight" 
                    type="number" 
                    name="Weight" 
                    unit=" g"
                    stroke="#0891b2"
                    tick={{ fill: "#67e8f9", fontSize: 12, fontFamily: "monospace" }}
                    domain={['auto', 'auto']}
                  />
                  <ZAxis range={[30, 30]} /> {/* Fixed dot size */}
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3', stroke: '#22d3ee', opacity: 0.5 }}
                    contentStyle={{ 
                      backgroundColor: 'rgba(8, 51, 68, 0.9)', 
                      borderColor: 'rgba(34, 211, 238, 0.4)',
                      borderRadius: '12px',
                      color: '#cffafe',
                      boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)',
                      backdropFilter: 'blur(16px)'
                    }}
                    itemStyle={{ color: '#22d3ee', fontFamily: 'monospace' }}
                    labelStyle={{ display: 'none' }}
                  />
                  <Scatter 
                    name="Observed Weight" 
                    dataKey="actualWeight" 
                    fill="#22d3ee"
                    style={{ filter: "drop-shadow(0px 0px 4px rgba(34, 211, 238, 0.8))" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="theoreticalWeight" 
                    name="Theoretical Curve" 
                    stroke="#60a5fa" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={false}
                    style={{ filter: "drop-shadow(0px 0px 6px rgba(96, 165, 250, 0.8))" }}
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
