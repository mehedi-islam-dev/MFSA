"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Code, FileText, CheckCircle, Database, UploadCloud, Terminal as TerminalIcon, ToggleLeft, ToggleRight, Share2, Rocket, Settings, Check, Globe, Activity } from 'lucide-react';

// --- MOCK README CONTENT ---
const README_RAW = `# 🌊 Marine Analytica 

![Version](https://img.shields.io/badge/version-2.4-00F0FF?style=for-the-badge) ![Build](https://img.shields.io/badge/build-passing-4ade80?style=for-the-badge) ![License](https://img.shields.io/badge/license-MIT-a855f7?style=for-the-badge)

## Autonomous Marine Ecology & Supply Chain Intelligence

**Marine Analytica** is an end-to-end, God-Level Progressive Web App (PWA) architected to fuse advanced marine science with high-frequency commerce. Built with a strict *Abyssal Futurism* UI/UX, this ecosystem empowers marine researchers to operate entirely offline while seamlessly syncing data to global markets.

### ⚡ Key Features
- **Zero-API Offline First**: Direct IndexedDB integration (Dexie.js) for localized field data collection.
- **Smart Matrix Compilation**: Automated L-F synchronization bridging field captures to ELEFAN.
- **AI Camera Vision**: Simulated biometric extraction for deep-sea targets.
- **Autonomous Matrices**: Immersive, full-screen cinematic presentation modules for thesis defense.

### 🛠️ Architecture Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 (Inline Classes) & Framer Motion
- **Agent Integration**: Web Speech API (JARVIS Core)
- **Database**: IndexedDB / Local Storage

---
*Architected for the Mirsharai Coastal Zone. Deployed via the Vercel Edge Network.*`;

export default function ReleaseEngine() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [typedContent, setTypedContent] = useState("");
  
  // Toggles
  const [toggles, setToggles] = useState({
    readme: true,
    diagrams: true,
    vercel: true
  });

  const handleToggle = (key: keyof typeof toggles) => {
    if (!isGenerating && !isComplete) {
       setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  // --- Typing Effect Logic ---
  const typeIndexRef = useRef(0);
  
  useEffect(() => {
    let typeInterval: NodeJS.Timeout;
    
    if (isGenerating && typeIndexRef.current < README_RAW.length) {
      typeInterval = setInterval(() => {
        setTypedContent(README_RAW.substring(0, typeIndexRef.current + 3));
        typeIndexRef.current += 3;
        
        if (typeIndexRef.current >= README_RAW.length) {
          clearInterval(typeInterval);
          setIsGenerating(false);
          setIsComplete(true);
          
          // JARVIS VOICE
          if ('speechSynthesis' in window) {
             window.speechSynthesis.cancel();
             const msg = new SpeechSynthesisUtterance("Open-source release protocol initiated. Generating architecture documentation and syncing with global portfolio. Marine Analytica is now ready for deployment.");
             msg.rate = 0.95; msg.pitch = 0.85;
             window.speechSynthesis.speak(msg);
          }
        }
      }, 5); // Rapid typing
    }
    
    return () => clearInterval(typeInterval);
  }, [isGenerating]);

  const handleInitiateRelease = () => {
    setIsGenerating(true);
    setIsComplete(false);
    setTypedContent("");
    typeIndexRef.current = 0;
  };

  return (
    <div className="min-h-screen bg-[#010409] font-mono flex flex-col p-6 lg:p-8 text-cyan-500 overflow-x-hidden">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-cyan-900/60 pb-6 gap-4 shrink-0 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-[0.25em] text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] flex items-center gap-4">
            <Share2 className="w-8 h-8" />
            OPEN-SOURCE RELEASE ENGINE
          </h1>
          <p className="text-xs text-cyan-600 tracking-[0.3em] mt-2 font-bold uppercase">Automated GitHub & Portfolio Synchronization Matrix</p>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1">
        
        {/* Left Panel: Release Configuration */}
        <div className="lg:col-span-1 glass-panel p-6 flex flex-col gap-6 h-fit">
          <h2 className="text-xs font-bold tracking-[0.2em] text-cyan-400 border-b border-cyan-900/50 pb-2 flex items-center gap-2">
            <Settings className="w-4 h-4" /> DEPLOYMENT CONFIG
          </h2>
          
          <div className="flex flex-col gap-4 mt-2">
            
            <div className="flex items-center justify-between p-3 rounded bg-[#01060c] border border-cyan-900/40">
               <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-cyan-700" />
                  <span className="text-[10px] font-bold tracking-widest text-cyan-500">Sci-Fi README.md</span>
               </div>
               <button onClick={() => handleToggle('readme')} className="text-cyan-400">
                  {toggles.readme ? <ToggleRight className="w-6 h-6 text-green-400" /> : <ToggleLeft className="w-6 h-6 text-cyan-800" />}
               </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded bg-[#01060c] border border-cyan-900/40">
               <div className="flex items-center gap-3">
                  <Database className="w-4 h-4 text-cyan-700" />
                  <span className="text-[10px] font-bold tracking-widest text-cyan-500">Architecture Diagrams</span>
               </div>
               <button onClick={() => handleToggle('diagrams')} className="text-cyan-400">
                  {toggles.diagrams ? <ToggleRight className="w-6 h-6 text-green-400" /> : <ToggleLeft className="w-6 h-6 text-cyan-800" />}
               </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded bg-[#01060c] border border-cyan-900/40">
               <div className="flex items-center gap-3">
                  <UploadCloud className="w-4 h-4 text-cyan-700" />
                  <span className="text-[10px] font-bold tracking-widest text-cyan-500">Vercel Packaging</span>
               </div>
               <button onClick={() => handleToggle('vercel')} className="text-cyan-400">
                  {toggles.vercel ? <ToggleRight className="w-6 h-6 text-green-400" /> : <ToggleLeft className="w-6 h-6 text-cyan-800" />}
               </button>
            </div>

          </div>

          <button 
            onClick={handleInitiateRelease}
            disabled={isGenerating || isComplete}
            className={`mt-4 w-full py-5 rounded-lg font-bold tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 transition-all duration-300 border
              ${isGenerating ? 'bg-cyan-900/50 border-cyan-800 text-cyan-500 cursor-not-allowed shadow-[0_0_20px_rgba(34,211,238,0.2)]' : 
                isComplete ? 'bg-green-950/80 border-green-500 text-green-400 shadow-[0_0_30px_rgba(74,222,128,0.4)]' :
                'bg-cyan-950/80 border-cyan-400 text-cyan-300 hover:bg-cyan-900 hover:shadow-[0_0_30px_#22d3ee] active:scale-95'}`}
          >
            {isGenerating ? (
              <><TerminalIcon className="w-5 h-5 animate-pulse" /> GENERATING DEPLOYMENT...</>
            ) : isComplete ? (
              <><CheckCircle className="w-5 h-5" /> RELEASE COMPLETE</>
            ) : (
              <><Rocket className="w-5 h-5" /> INITIATE OPEN-SOURCE RELEASE</>
            )}
          </button>
        </div>

        {/* Center Display: Live Code/Markdown Preview */}
        <div className={`lg:col-span-2 p-1 rounded-xl transition-all duration-700 ${isComplete ? 'bg-green-500/20 shadow-[0_0_50px_rgba(74,222,128,0.2)]' : 'bg-cyan-900/20'}`}>
           <div className="w-full h-full glass-panel flex flex-col overflow-hidden relative min-h-[500px]">
              
              {/* Terminal Header */}
              <div className={`flex items-center gap-2 px-4 py-3 border-b transition-colors duration-700 ${isComplete ? 'bg-green-950/40 border-green-900/50' : 'bg-[#01060c] border-cyan-900/50'}`}>
                 <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                 </div>
                 <div className="mx-auto text-[10px] tracking-widest text-cyan-700 font-bold flex items-center gap-2">
                    <Code className="w-3 h-3" /> README.md
                 </div>
              </div>

              {/* Terminal Body */}
              <div className="flex-1 p-6 overflow-y-auto custom-scrollbar font-mono text-sm leading-relaxed">
                 {!isGenerating && !isComplete && (
                    <div className="flex h-full items-center justify-center opacity-30">
                       <TerminalIcon className="w-16 h-16 text-cyan-500" />
                    </div>
                 )}

                 <div className={`whitespace-pre-wrap transition-colors duration-700 ${isComplete ? 'text-green-300' : 'text-cyan-300'}`}>
                    {typedContent}
                    {isGenerating && (
                       <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse" />
                    )}
                 </div>
              </div>

           </div>
        </div>

        {/* Right Panel: Portfolio Sync HUD */}
        <div className="lg:col-span-1 glass-panel p-6 flex flex-col gap-6 h-fit">
          <h2 className="text-xs font-bold tracking-[0.2em] text-cyan-400 border-b border-cyan-900/50 pb-2 flex items-center gap-2">
            <Globe className="w-4 h-4" /> PORTFOLIO SYNC HUD
          </h2>

          <div className="flex flex-col gap-5 mt-2">
            
            <div className="flex flex-col gap-2">
               <span className="text-[9px] tracking-widest uppercase text-cyan-700 font-bold">Flagship Project Status</span>
               <div className={`flex items-center gap-3 p-3 rounded border transition-colors duration-500 ${isComplete ? 'bg-green-950/20 border-green-900/50' : 'bg-cyan-950/20 border-cyan-900/50'}`}>
                  {isComplete ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Activity className="w-5 h-5 text-cyan-500 animate-pulse" />}
                  <span className={`text-[10px] font-bold tracking-widest ${isComplete ? 'text-green-400' : 'text-cyan-300'}`}>
                     {isComplete ? 'SYNCED & LIVE' : 'READY TO SYNC'}
                  </span>
               </div>
            </div>

            <div className="flex flex-col gap-2">
               <span className="text-[9px] tracking-widest uppercase text-cyan-700 font-bold">Architecture Handshake</span>
               <div className="bg-[#01060c] border border-cyan-900/30 p-3 rounded flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[10px] text-cyan-500">
                     <Check className="w-3 h-3 text-cyan-700" /> Next.js 16 App Router
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-cyan-500">
                     <Check className="w-3 h-3 text-cyan-700" /> Tailwind v4 + Framer Motion
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-cyan-500">
                     <Check className="w-3 h-3 text-cyan-700" /> Zero-API IndexedDB Core
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-cyan-500">
                     <Check className="w-3 h-3 text-cyan-700" /> Web Speech API (JARVIS)
                  </div>
               </div>
            </div>

            {isComplete && (
               <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                  className="mt-4 p-4 rounded bg-green-950/30 border border-green-500/50 text-center shadow-[0_0_20px_rgba(74,222,128,0.2)]"
               >
                  <span className="text-xs font-bold text-green-400 tracking-widest block mb-1">MISSION ACCOMPLISHED</span>
                  <span className="text-[9px] text-green-600 tracking-wider">Portfolio updated. Repository public.</span>
               </motion.div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
