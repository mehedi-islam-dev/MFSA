"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings2, Activity, ShieldAlert, Waves, Target, Database, FlaskConical, TriangleAlert, Leaf, Bug, Fish, Skull, ArrowUp, Zap } from 'lucide-react';

interface TrophicBlockProps {
  title: string;
  icon: React.ElementType;
  level: number;
  isSimulating: boolean;
}

const TrophicBlock: React.FC<TrophicBlockProps> = ({ title, icon: Icon, level, isSimulating }) => {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; duration: number; delay: number }[]>([]);
  
  useEffect(() => {
     let count = 3;
     if (isSimulating) {
        if (level === 1) count = 8;
        else if (level === 2) count = 18;
        else if (level === 3) count = 40;
        else if (level === 4) count = 80;
     } else {
        if (level === 1) count = 3;
        else if (level === 2) count = 4;
        else if (level === 3) count = 5;
        else if (level === 4) count = 6;
     }
     
     const newParticles = Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
        duration: 1.5 + Math.random() * 2,
        delay: Math.random() * 2
     }));
     setParticles(newParticles);
  }, [isSimulating, level]);

  const isApex = level === 4;
  const isHighToxicity = isSimulating && level > 2;
  const isCritical = isSimulating && isApex;

  return (
    <div className={`w-full max-w-md relative p-4 rounded-xl border backdrop-blur-sm transition-all duration-1000 flex items-center justify-between overflow-hidden group
      ${isCritical ? 'border-purple-500 bg-purple-950/30 shadow-[0_0_30px_rgba(168,85,247,0.2)]' : 
        isHighToxicity ? 'border-purple-800/60 bg-purple-950/10' : 'border-cyan-900/50 bg-[#020b14]/60'}`}>
       
       {/* Trapped internal particles representing accumulated microplastics */}
       <AnimatePresence>
         {particles.map(p => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, left: `${p.x}%`, top: `${p.y}%` }}
              animate={{ 
                 opacity: [0.2, 0.9, 0.2], 
                 left: [`${p.x}%`, `${p.x + (Math.random() * 10 - 5)}%`, `${p.x}%`],
                 top: [`${p.y}%`, `${p.y + (Math.random() * 10 - 5)}%`, `${p.y}%`]
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
              className={`absolute w-1.5 h-1.5 rounded-full z-0 ${isHighToxicity ? 'bg-purple-400 shadow-[0_0_8px_#c084fc]' : 'bg-purple-700/60'}`}
            />
         ))}
       </AnimatePresence>
       
       <div className="relative z-10 flex items-center gap-4">
          <div className={`p-3 rounded-lg border transition-colors duration-1000 ${isCritical ? 'bg-purple-900/40 border-purple-500 text-purple-300' : 'bg-cyan-950/60 border-cyan-800 text-cyan-400'}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className={`font-bold tracking-[0.2em] transition-colors duration-1000 ${isCritical ? 'text-purple-300' : 'text-cyan-300'}`}>{title}</h3>
            <p className={`text-[10px] uppercase tracking-[0.3em] transition-colors duration-1000 ${isCritical ? 'text-purple-400' : 'text-cyan-600'}`}>Trophic Level 0{level}</p>
          </div>
       </div>

       {isCritical && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 px-3 py-1 bg-red-500/20 border border-red-500/50 rounded text-[10px] text-red-400 font-bold tracking-widest flex items-center gap-2"
          >
             <TriangleAlert className="w-3 h-3 animate-pulse" /> TOXIC
          </motion.div>
       )}
    </div>
  );
}

export default function MicroplasticsPredictor() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [resultsReady, setResultsReady] = useState(false);
  const [conc, setConc] = useState(450);
  const [expTime, setExpTime] = useState(120);

  const runSimulation = () => {
    setIsSimulating(true);
    setResultsReady(false);
    
    // Agent Voice Announcement
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance("Simulation complete. Microplastic biomagnification models indicate elevated toxicity in apex predators. Caution advised for human consumption in this sector.");
      msg.rate = 0.95;
      msg.pitch = 0.85;
      window.speechSynthesis.speak(msg);
    }
    
    // Simulate processing time
    setTimeout(() => {
       setResultsReady(true);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#010409] text-cyan-500 font-mono p-6 flex flex-col gap-6 selection:bg-purple-900 selection:text-purple-100">
      
      {/* Header */}
      <header className="flex items-center justify-between border-b border-cyan-900/50 pb-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-950/30 rounded-lg border border-cyan-800">
            <FlaskConical className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-widest text-cyan-300">MICROPLASTICS BIOACCUMULATION PREDICTOR</h1>
            <p className="text-xs text-cyan-700 tracking-[0.2em] mt-1">MODULE 06: ADVANCED ECOSYSTEM & ONE HEALTH</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex flex-col items-end">
            <span className="text-cyan-700 text-xs tracking-widest">MODEL STATUS</span>
            <span className={`font-bold tracking-widest flex items-center gap-2 ${isSimulating ? 'text-purple-400' : 'text-cyan-400'}`}>
              <span className={`w-2 h-2 rounded-full animate-pulse ${isSimulating ? 'bg-purple-500' : 'bg-cyan-500'}`} /> 
              {isSimulating ? 'SIMULATING' : 'STANDBY'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        
        {/* Left Panel (Environmental Parameters) */}
        <div className="w-[320px] shrink-0 border border-cyan-900/40 bg-[#020b14]/80 backdrop-blur p-6 rounded-xl flex flex-col gap-8 shadow-[0_0_30px_rgba(8,51,68,0.3)]">
          <div className="flex items-center gap-3 border-b border-cyan-900/50 pb-4">
            <Settings2 className="text-cyan-500 w-5 h-5" />
            <h2 className="text-sm font-bold tracking-[0.2em] text-cyan-400">ENVIRONMENTAL PARAMETERS</h2>
          </div>

          <div className="space-y-8 flex-1">
            <div className="space-y-4">
              <label className="text-xs text-cyan-600 uppercase tracking-widest flex items-center gap-2 font-bold">
                <Waves className="w-4 h-4 text-cyan-500"/> Concentration (particles/m³)
              </label>
              <input 
                type="range" 
                className="w-full accent-cyan-400 bg-cyan-950 h-1.5 rounded-lg appearance-none cursor-pointer" 
                min="0" max="1500" step="10"
                value={conc} onChange={(e) => setConc(Number(e.target.value))}
              />
              <div className="text-right text-cyan-300 font-bold tracking-widest text-lg">{conc}</div>
            </div>
            
            <div className="space-y-4">
              <label className="text-xs text-cyan-600 uppercase tracking-widest flex items-center gap-2 font-bold">
                <Database className="w-4 h-4 text-cyan-500"/> Polymer Type
              </label>
              <select className="w-full bg-[#010811] border border-cyan-800 p-3 text-cyan-400 outline-none rounded focus:border-cyan-500 transition-colors cursor-pointer text-sm tracking-widest">
                <option>Polyethylene (PE)</option>
                <option>Polypropylene (PP)</option>
                <option>Polystyrene (PS)</option>
                <option>PET Microfibers</option>
              </select>
            </div>
            
            <div className="space-y-4">
              <label className="text-xs text-cyan-600 uppercase tracking-widest flex items-center gap-2 font-bold">
                <Activity className="w-4 h-4 text-cyan-500"/> Exposure Time (Days)
              </label>
              <input 
                type="range" 
                className="w-full accent-cyan-400 bg-cyan-950 h-1.5 rounded-lg appearance-none cursor-pointer" 
                min="0" max="365"
                value={expTime} onChange={(e) => setExpTime(Number(e.target.value))}
              />
              <div className="text-right text-cyan-300 font-bold tracking-widest text-lg">{expTime}</div>
            </div>
          </div>
        </div>

        {/* Main Display (Trophic Biomagnification Model) */}
        <div className="flex-1 relative border border-cyan-900/60 bg-gradient-to-b from-[#010a14] via-[#021326] to-[#010a14] rounded-xl overflow-hidden shadow-[inset_0_0_80px_rgba(2,15,25,1)] flex justify-center items-center py-10">
          
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 pointer-events-none" />
          
          {/* Ambient Glows */}
          <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-purple-900/10 blur-[100px] pointer-events-none" />

          {/* Upward Flowing Particles representing bioaccumulation up the food chain */}
          <div className="absolute inset-0 flex justify-center pointer-events-none overflow-hidden">
            <AnimatePresence>
              {Array.from({ length: isSimulating ? 50 : 15 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: '100vh', opacity: 0, x: (Math.random() - 0.5) * 300 }}
                  animate={{ y: '-10vh', opacity: [0, 1, 1, 0] }}
                  transition={{ 
                     duration: isSimulating ? 2 + Math.random() * 2 : 6 + Math.random() * 4, 
                     repeat: Infinity, 
                     delay: Math.random() * 5,
                     ease: "linear"
                  }}
                  className={`absolute rounded-full shadow-[0_0_10px_#a855f7] ${isSimulating ? 'w-2 h-2 bg-purple-400' : 'w-1 h-1 bg-purple-700/50'}`}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Trophic Levels Stack */}
          <div className="flex flex-col-reverse justify-between items-center gap-6 relative z-10 w-full h-full">
             
             <TrophicBlock title="PHYTOPLANKTON" icon={Leaf} level={1} isSimulating={isSimulating} />
             
             <div className="flex justify-center w-full">
                <ArrowUp className={`w-5 h-5 ${isSimulating ? 'text-purple-500 animate-pulse' : 'text-cyan-900'}`} />
             </div>

             <TrophicBlock title="ZOOPLANKTON" icon={Bug} level={2} isSimulating={isSimulating} />
             
             <div className="flex justify-center w-full">
                <ArrowUp className={`w-5 h-5 ${isSimulating ? 'text-purple-500 animate-pulse' : 'text-cyan-900'}`} />
             </div>

             <TrophicBlock title="PELAGIC FISH" icon={Fish} level={3} isSimulating={isSimulating} />
             
             <div className="flex justify-center w-full">
                <ArrowUp className={`w-5 h-5 ${isSimulating ? 'text-purple-400 animate-pulse' : 'text-cyan-900'}`} />
             </div>

             <TrophicBlock title="APEX PREDATOR" icon={Skull} level={4} isSimulating={isSimulating} />

          </div>
        </div>

        {/* Right Panel (Toxicity HUD) */}
        <div className="w-[360px] shrink-0 border border-cyan-800/50 bg-[#020b14]/90 backdrop-blur p-6 rounded-xl flex flex-col shadow-[0_0_40px_rgba(8,51,68,0.3)] relative overflow-hidden">
          
          <div className="flex items-center gap-3 border-b border-cyan-900/80 pb-6 mb-6">
            <ShieldAlert className={`w-6 h-6 ${isSimulating ? 'text-purple-400 animate-pulse' : 'text-cyan-800'}`} />
            <h2 className="text-sm font-bold tracking-[0.2em] text-cyan-300">TOXICITY ASSESSMENT</h2>
          </div>
          
          <div className="flex-1 flex flex-col gap-6">
            
            <div className={`p-5 rounded-lg border transition-all duration-500 ${resultsReady ? 'bg-cyan-950/40 border-cyan-700/50' : 'bg-[#010811] border-cyan-900/30'}`}>
              <h4 className="text-[10px] text-cyan-600 uppercase tracking-widest mb-2 font-bold flex items-center gap-2">
                <Zap className="w-3 h-3" /> Bioaccumulation Factor (BAF)
              </h4>
              <div className="text-3xl font-bold tracking-wider text-cyan-300">
                {resultsReady ? '4,200' : '---'}
              </div>
              {resultsReady && <p className="text-[10px] text-cyan-500 mt-2 tracking-widest">SEVERE MAGNIFICATION</p>}
            </div>

            <div className={`p-5 rounded-lg border transition-all duration-500 ${resultsReady ? 'bg-purple-950/20 border-purple-500/30' : 'bg-[#010811] border-cyan-900/30'}`}>
              <h4 className="text-[10px] text-cyan-600 uppercase tracking-widest mb-2 font-bold flex items-center gap-2">
                <Target className="w-3 h-3" /> Estimated Apex Concentration
              </h4>
              <div className={`text-3xl font-bold tracking-wider ${resultsReady ? 'text-purple-400' : 'text-cyan-800'}`}>
                {resultsReady ? '15.4 mg/kg' : '---'}
              </div>
            </div>

            <AnimatePresence>
              {resultsReady && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-5 border border-yellow-500/50 bg-yellow-950/30 rounded-lg flex items-start gap-4 shadow-[0_0_20px_rgba(234,179,8,0.15)] relative overflow-hidden mt-4"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500" />
                  <TriangleAlert className="w-8 h-8 text-yellow-500 shrink-0 mt-1 animate-pulse" />
                  <div>
                    <h4 className="text-[10px] text-yellow-500/80 uppercase tracking-widest mb-1 font-bold">Human Health Risk Level</h4>
                    <div className="text-xl font-bold tracking-widest text-yellow-500 mb-2">ELEVATED</div>
                    <p className="text-xs text-yellow-200/70 leading-relaxed font-semibold">
                      Caution advised for human consumption in this sector due to high microplastic retention in tissue.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-auto pt-6">
              <button
                onClick={runSimulation}
                disabled={isSimulating}
                className={`w-full py-4 rounded font-bold tracking-[0.2em] text-xs transition-all duration-300 flex items-center justify-center gap-3
                  ${isSimulating 
                    ? 'bg-purple-950/40 text-purple-400 border border-purple-900 cursor-not-allowed' 
                    : 'bg-cyan-950/60 text-cyan-400 border border-cyan-800 hover:bg-cyan-900 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:text-cyan-200'
                  }`}
              >
                <Activity className={isSimulating ? 'animate-spin' : ''} />
                {isSimulating ? 'MODELING TROPHIC TRANSFER...' : 'RUN ACCUMULATION MODEL'}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
