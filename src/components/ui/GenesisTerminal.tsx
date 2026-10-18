"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Shield, Anchor, Zap, Database, Globe, X } from 'lucide-react';

const SECRET_KEY = "mehedi";

const ASCII_LOGO = `
    __  ___ ___    ____  ____ _   __ ______ 
   /  |/  //   |  / __ \\/  _// | / // ____/ 
  / /|_/ // /| | / /_/ // / /  |/ // __/    
 / /  / // ___ |/ _, _// / / /|  // /___    
/_/  /_//_/  |_/_/ |_/___//_/ |_//_____/    
    ___    _   __ ___    __ __  __ ______ __  ______ ___ 
   /   |  / | / //   |  / // / / //_  __// / / ____//   |
  / /| | /  |/ // /| | / // /_/ /  / /  / / / /    / /| |
 / ___ |/ /|  // ___ |/ // __  /  / /  / / / /___ / ___ |
/_/  |_/_/ |_//_/  |_/_//_/ /_/  /_/  /_/  \\____//_/  |_|
`;

const PROFILE_DATA = [
  "Lead Developer: Mehedi Islam",
  "Designation: Marine Scientist & Full-Stack Architect",
  "Base of Operations: Institute of Marine Sciences, University of Chittagong",
  "Mission: Bridging Marine Ecosystems with Next-Generation AI"
];

const TECH_STACK = [
  { name: 'Next.js 16', icon: Globe },
  { name: 'Tailwind CSS v4', icon: Zap },
  { name: 'IndexedDB', icon: Database },
  { name: 'Framer Motion', icon: Terminal }
];

export function GenesisTerminal() {
  const [isActive, setIsActive] = useState(false);
  const [typedProfile, setTypedProfile] = useState<string[]>(Array(PROFILE_DATA.length).fill(""));
  const inputBuffer = useRef("");

  // --- KEYBOARD LISTENER ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const key = e.key.toLowerCase();
      
      // Maintain a buffer of the last N characters
      inputBuffer.current = (inputBuffer.current + key).slice(-SECRET_KEY.length);

      if (inputBuffer.current === SECRET_KEY && !isActive) {
        triggerGenesisProtocol();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);

  const triggerGenesisProtocol = () => {
    setIsActive(true);
    
    // Reset typing state
    setTypedProfile(Array(PROFILE_DATA.length).fill(""));

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance("Genesis protocol activated. Acknowledging System Architect and Creator. Welcome back to the bridge.");
      msg.rate = 0.95; msg.pitch = 0.85;
      window.speechSynthesis.speak(msg);
    }

    // Sequentially type out the profile lines
    PROFILE_DATA.forEach((line, lineIndex) => {
      setTimeout(() => {
         let currentLineTyped = "";
         const chars = line.split("");
         
         chars.forEach((char, charIndex) => {
            setTimeout(() => {
               currentLineTyped += char;
               setTypedProfile(prev => {
                  const newState = [...prev];
                  newState[lineIndex] = currentLineTyped;
                  return newState;
               });
            }, charIndex * 30); // 30ms per character
         });
      }, lineIndex * 1500 + 1000); // Wait 1.5s per line, start after 1s delay
    });
  };

  const closeTerminal = () => {
    setIsActive(false);
    inputBuffer.current = ""; // Reset buffer so it can be triggered again
  };

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          className="fixed inset-0 z-[9999] bg-[#010409]/95 backdrop-blur-xl border-b-4 border-cyan-500 flex items-center justify-center font-mono text-cyan-500 overflow-hidden shadow-[0_20px_100px_rgba(34,211,238,0.2)]"
        >
           {/* Background Grid & Vignette */}
           <div className="absolute inset-0 pointer-events-none z-0">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#000000_100%)] opacity-80" />
           </div>

           {/* Close Button */}
           <button 
              onClick={closeTerminal}
              className="absolute top-6 right-6 p-2 rounded-full border border-cyan-900/50 hover:bg-cyan-950 hover:border-cyan-400 hover:text-cyan-300 transition-colors z-20"
           >
              <X className="w-6 h-6" />
           </button>

           <div className="w-full max-w-7xl mx-auto p-8 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* Left & Center: ASCII + Profile */}
              <div className="lg:col-span-2 flex flex-col items-center lg:items-start justify-center gap-12">
                 
                 <div className="w-full">
                    <pre className="text-cyan-300 font-bold drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] leading-[1.1] text-[8px] sm:text-[10px] md:text-xs overflow-x-hidden animate-pulse">
                       {ASCII_LOGO}
                    </pre>
                 </div>

                 <div className="w-full bg-[#01060c] border border-cyan-900/50 rounded-xl p-8 shadow-[inset_0_0_30px_rgba(34,211,238,0.05)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Shield className="w-32 h-32 text-cyan-500" /></div>
                    
                    <h2 className="text-xs font-bold tracking-[0.4em] text-cyan-700 mb-6 flex items-center gap-2">
                       <Terminal className="w-4 h-4" /> SYSTEM ARCHITECT IDENTITY
                    </h2>

                    <div className="flex flex-col gap-4 text-sm md:text-base tracking-wider text-cyan-300 h-48">
                       {PROFILE_DATA.map((_, i) => (
                          <div key={i} className="flex">
                             {typedProfile[i] && <span className="text-cyan-700 mr-4 font-bold">{">"}</span>}
                             <span>
                                {typedProfile[i]}
                                {/* Cursor for the currently typing line */}
                                {typedProfile[i] !== PROFILE_DATA[i] && typedProfile[i].length > 0 && (
                                   <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse" />
                                )}
                             </span>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Right Panel: Tech Stack */}
              <div className="lg:col-span-1 flex flex-col justify-center">
                 <div className="glass-panel p-8 rounded-xl bg-cyan-950/20 border border-cyan-500/30 shadow-[0_0_50px_rgba(34,211,238,0.1)] relative">
                    
                    <h2 className="text-xs font-bold tracking-[0.3em] text-cyan-400 border-b border-cyan-900/50 pb-4 mb-6 flex items-center gap-3">
                       <Anchor className="w-5 h-5" /> CORE TECH STACK
                    </h2>

                    <div className="flex flex-col gap-4">
                       {TECH_STACK.map((tech, i) => (
                          <motion.div 
                             key={i}
                             initial={{ opacity: 0, x: 20 }}
                             animate={{ opacity: 1, x: 0 }}
                             transition={{ delay: 1.5 + (i * 0.2), duration: 0.5 }}
                             className="flex items-center gap-4 p-4 rounded bg-[#01060c] border border-cyan-900/50 group hover:border-cyan-400 transition-colors"
                          >
                             <tech.icon className="w-6 h-6 text-cyan-700 group-hover:text-cyan-400 transition-colors" />
                             <span className="font-bold tracking-widest text-xs text-cyan-500 group-hover:text-cyan-300 transition-colors">{tech.name}</span>
                          </motion.div>
                       ))}
                    </div>

                    <div className="absolute bottom-0 right-0 p-4">
                       <span className="text-[8px] tracking-[0.4em] font-bold text-cyan-900/50 uppercase">Genesis v1.0</span>
                    </div>

                 </div>
              </div>

           </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
