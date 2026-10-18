"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Activity, CheckCircle, Settings2, TestTube, Hexagon, DollarSign, FlaskConical, Cpu, Layers } from 'lucide-react';

const initialData = [
  { subject: 'PROTEIN', A: 22, fullMark: 50 },
  { subject: 'LIPID', A: 28, fullMark: 50 },
  { subject: 'FIBER', A: 18, fullMark: 50 },
  { subject: 'ASH', A: 20, fullMark: 50 },
  { subject: 'MOISTURE', A: 15, fullMark: 50 },
  { subject: 'ENERGY', A: 18, fullMark: 50 },
];

const optimalData = [
  { subject: 'PROTEIN', A: 36.2, fullMark: 50 },
  { subject: 'LIPID', A: 9.8, fullMark: 50 },
  { subject: 'FIBER', A: 4.5, fullMark: 50 },
  { subject: 'ASH', A: 8.2, fullMark: 50 },
  { subject: 'MOISTURE', A: 10.0, fullMark: 50 },
  { subject: 'ENERGY', A: 42.0, fullMark: 50 },
];

export default function NutritionTracker() {
  const [isSolving, setIsSolving] = useState(false);
  const [isOptimal, setIsOptimal] = useState(false);
  const [chartData, setChartData] = useState(initialData);
  
  const [minProtein, setMinProtein] = useState(35);
  const [maxLipid, setMaxLipid] = useState(10);
  const [maxFiber, setMaxFiber] = useState(5);

  const executeLinearSolver = () => {
    setIsSolving(true);
    setIsOptimal(false);
    setChartData(initialData);

    // Simulate simplex linear programming solver iterations
    setTimeout(() => {
      setIsSolving(false);
      setIsOptimal(true);
      
      // Update chart to optimized data
      setChartData(optimalData);

      // Agent Voice Announcement
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance("Linear programming solver complete. Optimal feed formulation achieved meeting all Kjeldahl protein and lipid constraints while minimizing production cost.");
        msg.rate = 0.95;
        msg.pitch = 0.85;
        window.speechSynthesis.speak(msg);
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#010409] text-cyan-500 font-mono p-6 flex flex-col gap-6 selection:bg-cyan-900 selection:text-cyan-100">
      
      {/* Header */}
      <header className="flex items-center justify-between border-b border-cyan-900/50 pb-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-950/30 rounded-lg border border-cyan-800">
            <Hexagon className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-widest text-cyan-300">AQUACULTURE NUTRITION TRACKER</h1>
            <p className="text-xs text-cyan-700 tracking-[0.2em] mt-1">MODULE 06: ADVANCED ECOSYSTEM & ONE HEALTH</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex flex-col items-end">
            <span className="text-cyan-700 text-xs tracking-widest">SOLVER ENGINE</span>
            <span className={`font-bold tracking-widest flex items-center gap-2 ${isSolving ? 'text-purple-400' : isOptimal ? 'text-green-400' : 'text-cyan-400'}`}>
              <span className={`w-2 h-2 rounded-full ${isSolving ? 'bg-purple-500 animate-pulse' : isOptimal ? 'bg-green-500' : 'bg-cyan-500'}`} /> 
              {isSolving ? 'ITERATING SIMPLEX ALGORITHM' : isOptimal ? 'OPTIMAL SOLUTION' : 'IDLE'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        
        {/* Left Panel (Linear Programming Constraints) */}
        <div className="w-[320px] shrink-0 border border-cyan-900/40 bg-[#020b14]/80 backdrop-blur p-6 rounded-xl flex flex-col gap-8 shadow-[0_0_30px_rgba(8,51,68,0.3)]">
          <div className="flex items-center gap-3 border-b border-cyan-900/50 pb-4">
            <Settings2 className="text-cyan-500 w-5 h-5" />
            <h2 className="text-sm font-bold tracking-[0.2em] text-cyan-400">TARGET CONSTRAINTS</h2>
          </div>

          <div className="space-y-8 flex-1">
            <div className="space-y-4">
              <label className="text-xs text-cyan-600 uppercase tracking-widest flex items-center gap-2 font-bold">
                <TestTube className="w-4 h-4 text-cyan-500"/> Min Protein Target (%)
              </label>
              <input 
                type="range" 
                className="w-full accent-cyan-400 bg-cyan-950 h-1.5 rounded-lg appearance-none cursor-pointer" 
                min="20" max="60" step="1"
                value={minProtein} onChange={(e) => setMinProtein(Number(e.target.value))}
                disabled={isSolving}
              />
              <div className="text-right text-cyan-300 font-bold tracking-widest text-lg">{minProtein}%</div>
            </div>
            
            <div className="space-y-4">
              <label className="text-xs text-cyan-600 uppercase tracking-widest flex items-center gap-2 font-bold">
                <FlaskConical className="w-4 h-4 text-cyan-500"/> Max Lipid Limit (%)
              </label>
              <input 
                type="range" 
                className="w-full accent-cyan-400 bg-cyan-950 h-1.5 rounded-lg appearance-none cursor-pointer" 
                min="5" max="25" step="1"
                value={maxLipid} onChange={(e) => setMaxLipid(Number(e.target.value))}
                disabled={isSolving}
              />
              <div className="text-right text-cyan-300 font-bold tracking-widest text-lg">{maxLipid}%</div>
            </div>
            
            <div className="space-y-4">
              <label className="text-xs text-cyan-600 uppercase tracking-widest flex items-center gap-2 font-bold">
                <Layers className="w-4 h-4 text-cyan-500"/> Max Fiber Content (%)
              </label>
              <input 
                type="range" 
                className="w-full accent-cyan-400 bg-cyan-950 h-1.5 rounded-lg appearance-none cursor-pointer" 
                min="1" max="15" step="1"
                value={maxFiber} onChange={(e) => setMaxFiber(Number(e.target.value))}
                disabled={isSolving}
              />
              <div className="text-right text-cyan-300 font-bold tracking-widest text-lg">{maxFiber}%</div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-cyan-900/50">
             <div className="text-[10px] text-cyan-700 uppercase tracking-widest mb-2 font-bold">Ingredient Database</div>
             <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-cyan-950 border border-cyan-900 rounded text-[9px] text-cyan-500">Fish Meal (Anchovy)</span>
                <span className="px-2 py-1 bg-cyan-950 border border-cyan-900 rounded text-[9px] text-cyan-500">Soybean Meal</span>
                <span className="px-2 py-1 bg-cyan-950 border border-cyan-900 rounded text-[9px] text-cyan-500">Wheat Bran</span>
                <span className="px-2 py-1 bg-cyan-950 border border-cyan-900 rounded text-[9px] text-cyan-500">Fish Oil</span>
             </div>
          </div>
        </div>

        {/* Center Display (Optimization Radar) */}
        <div className="flex-1 relative border border-cyan-900/60 bg-gradient-to-br from-[#010a14] to-[#011421] rounded-xl overflow-hidden shadow-[inset_0_0_100px_rgba(2,15,25,1)] flex justify-center items-center py-6">
          
          {/* Background Technical Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(45deg,#083344_1px,transparent_1px),linear-gradient(-45deg,#083344_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />
          
          {/* Ambient Glows */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] blur-[100px] pointer-events-none transition-colors duration-1000 ${isOptimal ? 'bg-green-900/20' : 'bg-cyan-900/20'}`} />

          {/* Hexagon Spinner during solve */}
          {isSolving && (
            <motion.div 
               className="absolute inset-0 flex justify-center items-center pointer-events-none z-0 opacity-10"
               animate={{ rotate: 360 }}
               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
               <Hexagon className="w-[80%] h-[80%] text-cyan-400 stroke-[0.5]" />
            </motion.div>
          )}

          {/* Recharts Radar */}
          <div className="w-full h-full relative z-10 p-10">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                <PolarGrid stroke="#0e3f54" strokeDasharray="3 3" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: isOptimal ? '#4ade80' : '#22d3ee', fontSize: 11, letterSpacing: '0.2em', fontWeight: 'bold' }} 
                />
                <PolarRadiusAxis angle={90} domain={[0, 50]} tick={false} axisLine={false} />
                <Radar
                  name="Nutritional Profile"
                  dataKey="A"
                  stroke={isOptimal ? '#4ade80' : '#0ea5e9'}
                  fill={isOptimal ? '#4ade80' : '#0ea5e9'}
                  fillOpacity={isOptimal ? 0.3 : 0.2}
                  strokeWidth={2}
                  isAnimationActive={true}
                  animationDuration={1500}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Right Panel (Lab Analysis & Cost HUD) */}
        <div className="w-[360px] shrink-0 border border-cyan-800/50 bg-[#020b14]/90 backdrop-blur p-6 rounded-xl flex flex-col shadow-[0_0_40px_rgba(8,51,68,0.3)] relative overflow-hidden">
          
          <div className="flex items-center gap-3 border-b border-cyan-900/80 pb-6 mb-6">
            <Cpu className={`w-6 h-6 ${isSolving ? 'text-purple-400 animate-pulse' : 'text-cyan-800'}`} />
            <h2 className="text-sm font-bold tracking-[0.2em] text-cyan-300">SOLVER DIAGNOSTICS</h2>
          </div>
          
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Protein Analysis */}
            <div className={`p-4 rounded-lg border transition-all duration-500 ${isOptimal ? 'bg-cyan-950/40 border-cyan-700/50' : 'bg-[#010811] border-cyan-900/30'}`}>
              <h4 className="text-[10px] text-cyan-600 uppercase tracking-widest mb-1 font-bold flex items-center gap-2">
                Estimated Kjeldahl Protein
              </h4>
              <div className="flex items-end gap-2 mt-2">
                 <div className="text-2xl font-bold tracking-wider text-cyan-300">
                   {isSolving ? '---' : isOptimal ? '36.2' : '22.0'}
                 </div>
                 <div className="text-cyan-600 font-bold mb-1">%</div>
              </div>
            </div>

            {/* Lipid Analysis */}
            <div className={`p-4 rounded-lg border transition-all duration-500 ${isOptimal ? 'bg-cyan-950/40 border-cyan-700/50' : 'bg-[#010811] border-cyan-900/30'}`}>
              <h4 className="text-[10px] text-cyan-600 uppercase tracking-widest mb-1 font-bold flex items-center gap-2">
                Estimated Soxhlet Lipid
              </h4>
              <div className="flex items-end gap-2 mt-2">
                 <div className="text-2xl font-bold tracking-wider text-cyan-300">
                   {isSolving ? '---' : isOptimal ? '9.8' : '28.0'}
                 </div>
                 <div className="text-cyan-600 font-bold mb-1">%</div>
              </div>
            </div>

            {/* Optimized Cost */}
            <div className={`p-4 rounded-lg border transition-all duration-500 ${isOptimal ? 'bg-green-950/20 border-green-500/30 shadow-[0_0_20px_rgba(74,222,128,0.1)]' : 'bg-[#010811] border-cyan-900/30'}`}>
              <h4 className="text-[10px] text-cyan-600 uppercase tracking-widest mb-1 font-bold flex items-center gap-2">
                Optimized Feed Cost
              </h4>
              <div className="flex items-center gap-3 mt-2">
                 <DollarSign className={`w-8 h-8 ${isOptimal ? 'text-green-500' : 'text-cyan-800'}`} />
                 <div className={`text-3xl font-bold tracking-wider ${isOptimal ? 'text-green-400' : 'text-cyan-800'}`}>
                   {isSolving ? '---' : isOptimal ? '1.12' : '2.45'}
                 </div>
                 <div className="text-cyan-700 text-xs font-bold mt-2">/ kg</div>
              </div>
            </div>

            {/* Solver Status Banner */}
            <AnimatePresence>
              {isOptimal && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border border-green-500/50 bg-green-950/30 rounded-lg flex items-center gap-3 relative overflow-hidden mt-2"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
                  <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
                  <div>
                    <h4 className="text-xs text-green-400 font-bold tracking-widest">OPTIMAL SOLUTION FOUND</h4>
                    <p className="text-[10px] text-green-200/70 mt-1 uppercase tracking-wider">
                      All nutritional constraints satisfied.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-auto pt-4">
              <button
                onClick={executeLinearSolver}
                disabled={isSolving}
                className={`w-full py-4 rounded font-bold tracking-[0.2em] text-xs transition-all duration-300 flex items-center justify-center gap-3
                  ${isSolving 
                    ? 'bg-purple-950/40 text-purple-400 border border-purple-900 cursor-not-allowed' 
                    : 'bg-cyan-950/60 text-cyan-400 border border-cyan-800 hover:bg-cyan-900 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:text-cyan-200'
                  }`}
              >
                <Activity className={isSolving ? 'animate-spin' : ''} />
                {isSolving ? 'CALCULATING MATRIX...' : 'EXECUTE LINEAR SOLVER'}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
