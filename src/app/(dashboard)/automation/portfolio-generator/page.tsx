"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Fingerprint, CheckSquare, Square, User, Activity, CheckCircle, Code, Cloud, FileText, Send, Zap, ChevronRight, Database } from 'lucide-react';

const MODULES_LIST = [
  "EIA Reports & Matrices",
  "ELEFAN Stock Assessments",
  "Microplastics Research",
  "Linear Programming Solver",
  "Drone/Satellite Vision",
  "eDNA Biodiversity Mapper"
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -30, filter: 'blur(10px)' },
  visible: { 
    opacity: 1, 
    x: 0, 
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 100, damping: 15 } 
  }
};

export default function PortfolioGenerator() {
  const [selectedModules, setSelectedModules] = useState<string[]>(MODULES_LIST.slice(0, 3));
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const toggleModule = (mod: string) => {
    if (isGenerating) return;
    setSelectedModules(prev => 
      prev.includes(mod) ? prev.filter(m => m !== mod) : [...prev, mod]
    );
    setIsGenerated(false);
  };

  const generateIdentity = () => {
    setIsGenerating(true);
    setIsGenerated(false);
    setAnimationKey(prev => prev + 1);

    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance("Academic portfolio generated successfully. Aggregating all research modules, environmental impact assessments, and stock analytics into a unified professional digital identity.");
        msg.rate = 0.95;
        msg.pitch = 0.85;
        window.speechSynthesis.speak(msg);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#010409] text-cyan-500 font-mono p-6 flex flex-col gap-6 selection:bg-cyan-900 selection:text-cyan-100">
      
      {/* Header */}
      <header className="flex items-center justify-between border-b border-cyan-900/50 pb-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-950/30 rounded-lg border border-cyan-800">
            <Fingerprint className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-widest text-cyan-300">ACADEMIC PORTFOLIO GENERATOR</h1>
            <p className="text-xs text-cyan-700 tracking-[0.2em] mt-1">MODULE 07: n8n AUTOMATION & CAREER ECOSYSTEM</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex flex-col items-end">
            <span className="text-cyan-700 text-xs tracking-widest">IDENTITY MATRIX</span>
            <span className={`font-bold tracking-widest flex items-center gap-2 ${isGenerating ? 'text-cyan-400 animate-pulse' : isGenerated ? 'text-green-400' : 'text-cyan-600'}`}>
              <span className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-cyan-400' : isGenerated ? 'bg-green-500' : 'bg-cyan-800'}`} /> 
              {isGenerating ? 'COMPILING HOLOGRAPHIC ID...' : isGenerated ? 'SECURE IDENTITY SYNCED' : 'AWAITING GENERATION'}
            </span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex gap-6 overflow-hidden">
        
        {/* Left Panel (Data Sources & Modules) */}
        <div className="w-[340px] shrink-0 border border-cyan-900/40 bg-[#020b14]/80 backdrop-blur p-6 rounded-xl flex flex-col shadow-[0_0_30px_rgba(8,51,68,0.3)]">
          <div className="flex items-center gap-3 border-b border-cyan-900/50 pb-4 mb-6">
            <Database className="text-cyan-500 w-5 h-5" />
            <h2 className="text-sm font-bold tracking-[0.2em] text-cyan-400">RESEARCH DATA SOURCES</h2>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto pr-2">
             {MODULES_LIST.map((mod) => (
               <div 
                 key={mod}
                 onClick={() => toggleModule(mod)}
                 className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 flex items-center gap-4 group
                    ${selectedModules.includes(mod)
                       ? 'bg-cyan-950/60 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.1)]' 
                       : 'bg-[#010811] border-cyan-900/40 hover:border-cyan-700/60'
                    }`}
               >
                 {selectedModules.includes(mod) 
                    ? <CheckSquare className="w-5 h-5 text-cyan-400 shrink-0 shadow-cyan-400" />
                    : <Square className="w-5 h-5 text-cyan-800 shrink-0 group-hover:text-cyan-600" />
                 }
                 <span className={`text-xs tracking-widest font-bold ${selectedModules.includes(mod) ? 'text-cyan-300' : 'text-cyan-700 group-hover:text-cyan-500'}`}>
                    {mod}
                 </span>
               </div>
             ))}
          </div>

          <div className="pt-6 border-t border-cyan-900/50 mt-4">
            <button
               onClick={generateIdentity}
               disabled={isGenerating || selectedModules.length === 0}
               className={`w-full py-4 rounded font-bold tracking-[0.2em] text-xs transition-all duration-300 flex items-center justify-center gap-3
                 ${(isGenerating || selectedModules.length === 0)
                   ? 'bg-cyan-950/30 text-cyan-600 border border-cyan-900 cursor-not-allowed' 
                   : 'bg-cyan-950/80 text-cyan-300 border border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:bg-cyan-900 hover:text-white'
                 }`}
            >
               {isGenerating ? <Activity className="animate-spin w-4 h-4" /> : <Zap className="w-4 h-4" />}
               {isGenerating ? 'COMPILING MATRIX...' : 'GENERATE DIGITAL IDENTITY'}
            </button>
          </div>
        </div>

        {/* Center Display (Holographic CV Preview) */}
        <div className="flex-1 relative border border-cyan-900/60 bg-gradient-to-b from-[#010a14] to-[#011421] rounded-xl overflow-hidden shadow-[inset_0_0_100px_rgba(2,15,25,1)] flex justify-center items-center py-8">
           
           {/* Technical Ambient Background */}
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent pointer-events-none" />
           
           {/* Grid sweep animation during compilation */}
           <AnimatePresence>
             {isGenerating && (
                <motion.div 
                  className="absolute inset-0 bg-cyan-500/5 z-0"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                />
             )}
           </AnimatePresence>

           <div className="relative z-10 w-full max-w-[600px] px-8" key={animationKey}>
              {(!isGenerating && !isGenerated) ? (
                 <div className="flex flex-col items-center justify-center h-full text-cyan-800/60 gap-6">
                    <Fingerprint className="w-20 h-20 opacity-20" />
                    <span className="text-sm font-bold tracking-[0.3em]">HOLOGRAPHIC MATRIX OFFLINE</span>
                 </div>
              ) : (
                 <motion.div 
                   variants={containerVariants} 
                   initial="hidden" 
                   animate="visible" 
                   className="bg-[#020b14]/90 backdrop-blur-xl border border-cyan-500/60 rounded-2xl p-8 shadow-[0_0_60px_rgba(34,211,238,0.25)] relative overflow-hidden"
                 >
                    {/* Glass reflections */}
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-400/10 rounded-full blur-[80px] pointer-events-none" />
                    
                    {/* Header: Name & Title */}
                    <motion.div variants={itemVariants} className="flex items-center gap-8 border-b border-cyan-800/80 pb-6 mb-6 relative z-10">
                       <div className="w-28 h-28 rounded-full border-2 border-cyan-400 p-1 flex items-center justify-center bg-cyan-950/60 shadow-[0_0_30px_rgba(34,211,238,0.3)] relative group">
                           <div className="absolute inset-0 rounded-full border border-cyan-300 animate-[spin_4s_linear_infinite]" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
                           <User className="w-14 h-14 text-cyan-300" />
                       </div>
                       <div>
                          <h2 className="text-3xl font-bold tracking-[0.25em] text-white drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">ALANA VANCE</h2>
                          <p className="text-xs text-cyan-400 tracking-[0.2em] mt-2 font-bold">LEAD MARINE ECOLOGIST / SYSTEM ARCHITECT</p>
                          <div className="flex gap-3 mt-3">
                             <span className="text-[9px] px-3 py-1 bg-green-950/50 border border-green-500/50 text-green-400 rounded tracking-widest font-bold flex items-center gap-1">
                               <CheckCircle className="w-3 h-3" /> CLEARANCE: L7
                             </span>
                             <span className="text-[9px] px-3 py-1 bg-purple-950/50 border border-purple-500/50 text-purple-400 rounded tracking-widest font-bold">
                               AI-SYNC NETWORK
                             </span>
                          </div>
                       </div>
                    </motion.div>

                    {/* Skills & Capabilities */}
                    <motion.div variants={itemVariants} className="mb-8 relative z-10">
                       <h3 className="text-[10px] font-bold tracking-[0.2em] text-cyan-600 mb-4 border-l-2 border-cyan-600 pl-3">CORE TECHNICAL MATRIX</h3>
                       <div className="flex flex-wrap gap-2">
                          {['ELEFAN/SPR Analysis', 'Spatial Data & GIS', 'Next.js & React', 'n8n Workflow Automation', 'eDNA Sequencing', 'EIA Compliance'].map(s => (
                             <div key={s} className="px-4 py-1.5 bg-[#010811] border border-cyan-900 text-cyan-300 text-[10px] tracking-widest rounded-full shadow-[inset_0_0_10px_rgba(34,211,238,0.05)]">
                               {s}
                             </div>
                          ))}
                       </div>
                    </motion.div>

                    {/* Research & Data Visualization Sync */}
                    <motion.div variants={itemVariants} className="grid grid-cols-2 gap-8 relative z-10">
                       <div>
                          <h3 className="text-[10px] font-bold tracking-[0.2em] text-cyan-600 mb-4 border-l-2 border-cyan-600 pl-3">SYNCED RESEARCH MODULES</h3>
                          <ul className="space-y-3">
                             {selectedModules.length > 0 ? selectedModules.map(m => (
                                <li key={m} className="text-[10px] text-cyan-400 flex items-center gap-3 tracking-wider font-bold">
                                   <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_#22d3ee]" /> 
                                   {m.toUpperCase()}
                                </li>
                             )) : (
                               <li className="text-[10px] text-cyan-800">NO MODULES SELECTED</li>
                             )}
                          </ul>
                       </div>
                       <div>
                          <h3 className="text-[10px] font-bold tracking-[0.2em] text-cyan-600 mb-4 border-l-2 border-cyan-600 pl-3">LIVE VISUALIZATION CACHE</h3>
                          <div className="h-28 bg-[#010811] border border-cyan-900/50 rounded-lg flex items-center justify-center relative overflow-hidden group shadow-[inset_0_0_30px_rgba(8,51,68,0.6)]">
                             <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:0.5rem_0.5rem] opacity-30" />
                             <div className="flex items-end justify-center gap-1 z-10 w-full px-4 h-12">
                               {[40, 70, 45, 90, 65, 80, 50, 100].map((h, i) => (
                                  <motion.div 
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ duration: 0.5, delay: 1 + (i * 0.1) }}
                                    className="flex-1 bg-cyan-500 shadow-[0_0_10px_#22d3ee] rounded-t-sm" 
                                  />
                               ))}
                             </div>
                          </div>
                       </div>
                    </motion.div>

                 </motion.div>
              )}
           </div>

        </div>

        {/* Right Panel (Deployment Hub) */}
        <div className="w-[300px] shrink-0 border border-cyan-800/50 bg-[#020b14]/90 backdrop-blur p-6 rounded-xl flex flex-col shadow-[0_0_40px_rgba(8,51,68,0.3)]">
          
          <div className="flex items-center gap-3 border-b border-cyan-900/80 pb-6 mb-6">
            <Send className="w-6 h-6 text-cyan-400" />
            <h2 className="text-sm font-bold tracking-[0.2em] text-cyan-300">DEPLOYMENT HUB</h2>
          </div>
          
          <div className="flex-1 flex flex-col justify-center gap-4">
            
            <button
               disabled={!isGenerated}
               className={`p-4 rounded-lg font-bold tracking-widest text-[10px] uppercase transition-all duration-300 flex items-center justify-between group
                  ${isGenerated 
                     ? 'bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-900 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]' 
                     : 'bg-[#010811] border border-cyan-900/30 text-cyan-800 cursor-not-allowed'
                  }`}
            >
               <div className="flex items-center gap-3">
                  <Cloud className={`w-4 h-4 ${isGenerated ? 'text-cyan-400' : 'text-cyan-800'}`} />
                  Deploy to Vercel (Mock)
               </div>
               {isGenerated && <ChevronRight className="w-4 h-4 text-cyan-600 group-hover:text-cyan-400 transition-colors" />}
            </button>

            <button
               disabled={!isGenerated}
               className={`p-4 rounded-lg font-bold tracking-widest text-[10px] uppercase transition-all duration-300 flex items-center justify-between group
                  ${isGenerated 
                     ? 'bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-900 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]' 
                     : 'bg-[#010811] border border-cyan-900/30 text-cyan-800 cursor-not-allowed'
                  }`}
            >
               <div className="flex items-center gap-3">
                  <Code className={`w-4 h-4 ${isGenerated ? 'text-cyan-400' : 'text-cyan-800'}`} />
                  Sync with GitHub Workspace
               </div>
               {isGenerated && <ChevronRight className="w-4 h-4 text-cyan-600 group-hover:text-cyan-400 transition-colors" />}
            </button>

            <button
               disabled={!isGenerated}
               className={`p-4 rounded-lg font-bold tracking-widest text-[10px] uppercase transition-all duration-300 flex items-center justify-between group
                  ${isGenerated 
                     ? 'bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-900 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]' 
                     : 'bg-[#010811] border border-cyan-900/30 text-cyan-800 cursor-not-allowed'
                  }`}
            >
               <div className="flex items-center gap-3">
                  <FileText className={`w-4 h-4 ${isGenerated ? 'text-cyan-400' : 'text-cyan-800'}`} />
                  Generate Interactive PDF
               </div>
               {isGenerated && <ChevronRight className="w-4 h-4 text-cyan-600 group-hover:text-cyan-400 transition-colors" />}
            </button>

          </div>

          <div className={`mt-auto p-4 border rounded-lg flex items-center justify-center transition-colors duration-1000 ${isGenerated ? 'border-cyan-500/50 bg-cyan-950/40 shadow-[0_0_20px_rgba(34,211,238,0.15)]' : 'border-cyan-900/30 bg-[#010811]'}`}>
             <span className={`text-[10px] font-bold tracking-widest ${isGenerated ? 'text-cyan-300 animate-pulse' : 'text-cyan-800'}`}>
                {isGenerated ? 'PORTFOLIO READY FOR DEPLOYMENT' : 'AWAITING DIGITAL IDENTITY'}
             </span>
          </div>
        </div>

      </div>
    </div>
  );
}

// Dummy Database icon since it's missing in some lucide-react versions, using a fallback or importing correctly.
// I imported Database, but in case it fails, it's easily replaceable.
