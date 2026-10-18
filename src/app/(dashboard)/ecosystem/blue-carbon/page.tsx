"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Globe, Leaf, Wind, Landmark, TrendingUp, MapPin, Activity, FileText, ShieldCheck, Waves } from 'lucide-react';

export default function BlueCarbonPolicy() {
  const [area, setArea] = useState(1500);
  const [habitat, setHabitat] = useState<'mangrove' | 'seagrass' | 'marsh'>('mangrove');
  const [isAssessing, setIsAssessing] = useState(false);
  const [isAssessed, setIsAssessed] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const multiplier = habitat === 'mangrove' ? 30.1333 : habitat === 'seagrass' ? 15.5 : 22.4;
  const totalCarbon = Math.round(area * multiplier);
  const marketValue = totalCarbon * 30; // $30 per tCO2e

  const chartData = useMemo(() => {
    const data = [];
    let cumulative = 0;
    for (let i = 1; i <= 50; i++) {
        // Create an organic-looking growth curve
        const yearlyAddition = area * (multiplier / 50) * (1 + (Math.sin(i) * 0.1)); 
        cumulative += yearlyAddition;
        data.push({ year: `Yr ${i}`, co2: Math.round(cumulative) });
    }
    return data;
  }, [area, habitat, multiplier]);

  const generateAssessment = () => {
    setIsAssessing(true);
    setIsAssessed(false);
    
    // Force re-animation of the chart
    setAnimationKey(prev => prev + 1);

    setTimeout(() => {
      setIsAssessing(false);
      setIsAssessed(true);

      // JARVIS Agent Voice
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance("Assessment complete. The designated mangrove habitat demonstrates high carbon sequestration potential. The area is currently eligible for international blue carbon credit certification.");
        msg.rate = 0.95;
        msg.pitch = 0.85;
        window.speechSynthesis.speak(msg);
      }
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#010409] text-cyan-500 font-mono p-6 flex flex-col gap-6 selection:bg-green-900 selection:text-green-100">
      
      {/* Header */}
      <header className="flex items-center justify-between border-b border-cyan-900/50 pb-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-950/30 rounded-lg border border-cyan-800">
            <Globe className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-widest text-cyan-300">BLUE CARBON POLICY ASSESSMENT</h1>
            <p className="text-xs text-cyan-700 tracking-[0.2em] mt-1">MODULE 06: ADVANCED ECOSYSTEM & ONE HEALTH</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex flex-col items-end border-r border-cyan-900 pr-6">
            <span className="text-cyan-700 text-xs tracking-widest">REGION</span>
            <span className="text-cyan-400 font-bold tracking-widest flex items-center gap-2">
              <MapPin className="w-3 h-3 text-cyan-500" /> MIRSHARAI COASTAL BELT
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-cyan-700 text-xs tracking-widest">NETWORK LINK</span>
            <span className="text-green-400 font-bold tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> ACTIVE
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        
        {/* Left Panel (Habitat Selection) */}
        <div className="w-[320px] shrink-0 border border-cyan-900/40 bg-[#020b14]/80 backdrop-blur p-6 rounded-xl flex flex-col gap-8 shadow-[0_0_30px_rgba(8,51,68,0.3)]">
          <div className="flex items-center gap-3 border-b border-cyan-900/50 pb-4">
            <Leaf className="text-cyan-500 w-5 h-5" />
            <h2 className="text-sm font-bold tracking-[0.2em] text-cyan-400">HABITAT CONFIGURATION</h2>
          </div>

          <div className="space-y-6 flex-1">
            <div className="space-y-4">
              <label className="text-xs text-cyan-600 uppercase tracking-widest font-bold">Habitat Type</label>
              
              <div 
                onClick={() => setHabitat('mangrove')}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 flex items-center justify-between ${habitat === 'mangrove' ? 'bg-cyan-950/60 border-green-500/50 shadow-[0_0_15px_rgba(74,222,128,0.15)]' : 'bg-[#010811] border-cyan-900/30 hover:border-cyan-700/50'}`}
              >
                 <div className="flex items-center gap-3">
                    <Leaf className={`w-4 h-4 ${habitat === 'mangrove' ? 'text-green-400' : 'text-cyan-700'}`} />
                    <span className={`text-sm font-bold tracking-widest ${habitat === 'mangrove' ? 'text-green-400' : 'text-cyan-600'}`}>Mangrove Forest</span>
                 </div>
                 {habitat === 'mangrove' && <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_#4ade80]" />}
              </div>

              <div 
                onClick={() => setHabitat('seagrass')}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 flex items-center justify-between ${habitat === 'seagrass' ? 'bg-cyan-950/60 border-green-500/50 shadow-[0_0_15px_rgba(74,222,128,0.15)]' : 'bg-[#010811] border-cyan-900/30 hover:border-cyan-700/50'}`}
              >
                 <div className="flex items-center gap-3">
                    <Waves className={`w-4 h-4 ${habitat === 'seagrass' ? 'text-green-400' : 'text-cyan-700'}`} />
                    <span className={`text-sm font-bold tracking-widest ${habitat === 'seagrass' ? 'text-green-400' : 'text-cyan-600'}`}>Seagrass Meadows</span>
                 </div>
                 {habitat === 'seagrass' && <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_#4ade80]" />}
              </div>

              <div 
                onClick={() => setHabitat('marsh')}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 flex items-center justify-between ${habitat === 'marsh' ? 'bg-cyan-950/60 border-green-500/50 shadow-[0_0_15px_rgba(74,222,128,0.15)]' : 'bg-[#010811] border-cyan-900/30 hover:border-cyan-700/50'}`}
              >
                 <div className="flex items-center gap-3">
                    <Wind className={`w-4 h-4 ${habitat === 'marsh' ? 'text-green-400' : 'text-cyan-700'}`} />
                    <span className={`text-sm font-bold tracking-widest ${habitat === 'marsh' ? 'text-green-400' : 'text-cyan-600'}`}>Tidal Marshes</span>
                 </div>
                 {habitat === 'marsh' && <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_#4ade80]" />}
              </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-cyan-900/50">
              <label className="text-xs text-cyan-600 uppercase tracking-widest flex items-center gap-2 font-bold">
                <MapPin className="w-4 h-4 text-cyan-500"/> Area Coverage (Hectares)
              </label>
              <input 
                type="range" 
                className="w-full accent-green-400 bg-cyan-950 h-1.5 rounded-lg appearance-none cursor-pointer" 
                min="100" max="10000" step="100"
                value={area} onChange={(e) => setArea(Number(e.target.value))}
                disabled={isAssessing}
              />
              <div className="text-right text-green-300 font-bold tracking-widest text-xl">{area.toLocaleString()} ha</div>
            </div>
          </div>
        </div>

        {/* Main Display (Sequestration Visualization) */}
        <div className="flex-1 relative border border-cyan-900/60 bg-gradient-to-br from-[#010a14] to-[#011421] rounded-xl overflow-hidden shadow-[inset_0_0_100px_rgba(2,15,25,1)] flex flex-col pt-6">
          
          <div className="px-6 mb-4 relative z-10">
             <h3 className="text-xs text-cyan-500 tracking-[0.2em] font-bold">CUMULATIVE CO2 SEQUESTRATION TRAJECTORY (Y1-Y50)</h3>
          </div>

          {/* Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />
          
          {/* Ambient Glows */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[200px] bg-green-900/20 blur-[80px] pointer-events-none" />

          {/* Scanning Line Effect during assessment */}
          <AnimatePresence>
            {isAssessing && (
               <motion.div 
                 className="absolute top-0 bottom-0 w-[2px] bg-green-400 shadow-[0_0_20px_#4ade80] z-20 pointer-events-none"
                 initial={{ left: '5%' }}
                 animate={{ left: '95%' }}
                 transition={{ duration: 2.5, ease: "linear" }}
               />
            )}
          </AnimatePresence>

          {/* Recharts Area Chart */}
          <div className="flex-1 w-full relative z-10 px-4 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart key={animationKey} data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#083344" vertical={false} />
                <XAxis 
                   dataKey="year" 
                   tick={{ fill: '#0891b2', fontSize: 10, letterSpacing: '0.1em' }} 
                   tickLine={false}
                   axisLine={{ stroke: '#083344' }}
                   minTickGap={30}
                />
                <YAxis 
                   tick={{ fill: '#0891b2', fontSize: 10 }} 
                   tickLine={false}
                   axisLine={false}
                   tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#020b14', borderColor: '#0891b2', color: '#4ade80', fontFamily: 'monospace' }}
                   itemStyle={{ color: '#4ade80' }}
                   formatter={((value: number) => [`${value.toLocaleString()} tCO2e`, 'Sequestration']) as any}
                />
                <Area 
                   type="monotone" 
                   dataKey="co2" 
                   stroke="#4ade80" 
                   strokeWidth={3}
                   fillOpacity={1} 
                   fill="url(#colorCo2)" 
                   isAnimationActive={true}
                   animationDuration={2500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Right Panel (Policy & Economic HUD) */}
        <div className="w-[380px] shrink-0 border border-cyan-800/50 bg-[#020b14]/90 backdrop-blur p-6 rounded-xl flex flex-col shadow-[0_0_40px_rgba(8,51,68,0.3)] relative overflow-hidden">
          
          <div className="flex items-center gap-3 border-b border-cyan-900/80 pb-6 mb-6">
            <Landmark className="w-6 h-6 text-cyan-400" />
            <h2 className="text-sm font-bold tracking-[0.2em] text-cyan-300">ECONOMIC VALUATION</h2>
          </div>
          
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Total Carbon Sequestered */}
            <div className="p-4 rounded-lg bg-[#010811] border border-cyan-900/30">
              <h4 className="text-[10px] text-cyan-600 uppercase tracking-widest mb-1 font-bold flex items-center gap-2">
                <TrendingUp className="w-3 h-3" /> Total Carbon Sequestered (50 Yrs)
              </h4>
              <div className="flex items-end gap-2 mt-2">
                 <div className="text-3xl font-bold tracking-wider text-cyan-300">
                   {totalCarbon.toLocaleString()}
                 </div>
                 <div className="text-cyan-600 font-bold mb-1">tCO2e</div>
              </div>
            </div>

            {/* Market Value */}
            <div className="p-5 rounded-lg bg-green-950/10 border border-green-900/40 relative overflow-hidden shadow-[inset_0_0_20px_rgba(74,222,128,0.05)]">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                 <Landmark className="w-16 h-16 text-green-500" />
              </div>
              <h4 className="text-[10px] text-green-500/80 uppercase tracking-widest mb-1 font-bold flex items-center gap-2 relative z-10">
                Global Carbon Credit Market Value
              </h4>
              <div className="flex items-end gap-2 mt-2 relative z-10">
                 <div className="text-3xl font-bold tracking-wider text-green-400">
                   ${(marketValue / 1000000).toFixed(2)}
                 </div>
                 <div className="text-green-600 font-bold mb-1 tracking-widest">MILLION</div>
              </div>
              <div className="text-[9px] text-green-500/50 mt-2 font-bold tracking-widest">
                 BASED ON CURRENT SPOT PRICE: $30.00 / tCO2e
              </div>
            </div>

            {/* Policy Status Banner */}
            <div className={`mt-2 p-4 border ${isAssessed ? 'border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)] bg-cyan-950/40' : 'border-cyan-900/50 bg-cyan-950/20'} rounded-lg flex items-start gap-3 transition-all duration-1000 relative overflow-hidden`}>
              <div className={`absolute left-0 top-0 w-1 h-full ${isAssessed ? 'bg-cyan-400' : 'bg-cyan-800'}`} />
              <ShieldCheck className={`w-6 h-6 shrink-0 mt-0.5 ${isAssessed ? 'text-cyan-400' : 'text-cyan-800'}`} />
              <div>
                <h4 className="text-[10px] text-cyan-600 uppercase tracking-widest mb-1 font-bold">Policy Status</h4>
                <div className={`text-xs font-bold tracking-widest leading-relaxed ${isAssessed ? 'text-cyan-300 animate-pulse' : 'text-cyan-700'}`}>
                  {isAssessed ? 'ELIGIBLE FOR INTERNATIONAL CLIMATE FUNDING' : 'AWAITING FULL GEOSPATIAL ASSESSMENT'}
                </div>
              </div>
            </div>

            <div className="mt-auto pt-4">
              <button
                onClick={generateAssessment}
                disabled={isAssessing}
                className={`w-full py-4 rounded font-bold tracking-[0.2em] text-xs transition-all duration-300 flex items-center justify-center gap-3
                  ${isAssessing 
                    ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-900 cursor-not-allowed' 
                    : 'bg-green-950/40 text-green-400 border border-green-800 hover:bg-green-900/80 hover:shadow-[0_0_20px_rgba(74,222,128,0.3)] hover:text-green-200'
                  }`}
              >
                {isAssessing ? <Activity className="animate-spin" /> : <FileText className="w-4 h-4" />}
                {isAssessing ? 'ANALYZING ECOLOGICAL DATA...' : 'GENERATE POLICY ASSESSMENT'}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
