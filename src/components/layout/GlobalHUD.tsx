"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Upload, FileSpreadsheet, X, UploadCloud, Database, Activity } from 'lucide-react';

export default function GlobalHUD() {
  const [jarvisActive, setJarvisActive] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isParsed, setIsParsed] = useState(false);

  const toggleJarvis = () => {
    const newState = !jarvisActive;
    setJarvisActive(newState);
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance(
        newState 
          ? "JARVIS voice interface online and listening." 
          : "JARVIS voice interface deactivated."
      );
      msg.rate = 0.95;
      msg.pitch = 0.85;
      window.speechSynthesis.speak(msg);
    }
  };

  const handleMockUpload = () => {
    setIsParsing(true);
    setIsParsed(false);

    setTimeout(() => {
      setIsParsing(false);
      setIsParsed(true);

      if (jarvisActive && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance("Data upload complete. Excel matrix successfully parsed and integrated into the global dataset.");
        msg.rate = 0.95;
        msg.pitch = 0.85;
        window.speechSynthesis.speak(msg);
      }
      
      setTimeout(() => {
        setIsUploadOpen(false);
        setIsParsed(false);
      }, 3000);
    }, 2500);
  };

  return (
    <>
      {/* HUD Controls */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-5">
        
        {/* Upload Data Button */}
        <button 
          onClick={() => setIsUploadOpen(true)}
          className="group flex items-center gap-3 bg-[#020b14]/90 border border-cyan-500/50 text-cyan-300 px-5 py-3 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:bg-cyan-900 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] backdrop-blur transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:0.5rem_0.5rem] opacity-20 pointer-events-none" />
          <span className="text-[10px] tracking-[0.2em] font-bold group-hover:text-white relative z-10">UPLOAD DATA</span>
          <Upload className="w-4 h-4 relative z-10 group-hover:text-white" />
        </button>

        {/* JARVIS Link Orb */}
        <div className="flex items-center gap-4">
           {/* Tooltip / Status indicator */}
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="bg-[#01060c]/90 border border-cyan-900/50 px-3 py-1 rounded text-[9px] tracking-[0.2em] font-bold text-cyan-700 backdrop-blur"
           >
              JARVIS LINK
           </motion.div>

           <button 
             onClick={toggleJarvis}
             className={`relative flex items-center justify-center w-16 h-16 rounded-full border-2 transition-all duration-500 backdrop-blur
               ${jarvisActive 
                 ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_30px_#22d3ee]' 
                 : 'bg-red-950/80 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
               }`}
           >
             {jarvisActive && (
               <>
                 {/* Inner Pulse */}
                 <motion.div 
                   className="absolute inset-0 rounded-full bg-cyan-400/30"
                   animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                   transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                 />
                 {/* Outer Radar Ring */}
                 <motion.div 
                   className="absolute inset-[-10px] rounded-full border border-cyan-400/20"
                   animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                   transition={{ duration: 2, repeat: Infinity, delay: 0.5, ease: "easeInOut" }}
                 />
               </>
             )}
             
             {jarvisActive 
               ? <Mic className="w-6 h-6 text-cyan-300 relative z-10 drop-shadow-[0_0_8px_#22d3ee]" /> 
               : <MicOff className="w-6 h-6 text-red-500 relative z-10 opacity-70" />
             }
           </button>
        </div>

      </div>

      {/* Smart Excel Parser Modal */}
      <AnimatePresence>
        {isUploadOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-[#010409]/90 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-[500px] bg-[#020b14]/90 border border-cyan-500/50 rounded-2xl shadow-[0_0_50px_rgba(34,211,238,0.15)] relative overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="h-14 border-b border-cyan-900/50 flex items-center justify-between px-6 bg-cyan-950/20">
                 <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-xs font-bold tracking-[0.2em] text-cyan-300">SMART EXCEL PARSER</h3>
                 </div>
                 <button onClick={() => !isParsing && setIsUploadOpen(false)} className="text-cyan-700 hover:text-cyan-300 transition-colors">
                    <X className="w-5 h-5" />
                 </button>
              </div>

              {/* Body */}
              <div className="p-8">
                 <div className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center p-10 transition-colors duration-300
                    ${isParsed ? 'border-green-500/50 bg-green-950/10' : 'border-cyan-800/50 bg-[#01060c]'}`}>
                    
                    {isParsed ? (
                       <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-green-950/80 border border-green-500 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(74,222,128,0.3)]">
                             <FileSpreadsheet className="w-8 h-8 text-green-400" />
                          </div>
                          <h4 className="text-sm font-bold tracking-widest text-green-400 mb-1">PARSING COMPLETE</h4>
                          <p className="text-[10px] text-green-600/80 tracking-widest uppercase">Data integrated into global cache</p>
                       </motion.div>
                    ) : isParsing ? (
                       <div className="flex flex-col items-center">
                          <Activity className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
                          <h4 className="text-sm font-bold tracking-widest text-cyan-400 mb-1">ANALYZING MATRIX...</h4>
                          <p className="text-[10px] text-cyan-700 tracking-widest uppercase">Scanning for ecological anomalies</p>
                       </div>
                    ) : (
                       <div className="flex flex-col items-center cursor-pointer group" onClick={handleMockUpload}>
                          <div className="w-16 h-16 rounded-full bg-cyan-950/40 border border-cyan-800 flex items-center justify-center mb-4 group-hover:border-cyan-400 group-hover:bg-cyan-900 transition-all duration-300">
                             <UploadCloud className="w-8 h-8 text-cyan-600 group-hover:text-cyan-400" />
                          </div>
                          <h4 className="text-sm font-bold tracking-widest text-cyan-500 mb-1 group-hover:text-cyan-300 transition-colors">DRAP & DROP DATASET</h4>
                          <p className="text-[10px] text-cyan-800 tracking-widest uppercase">Supports .XLSX, .CSV, .JSON</p>
                       </div>
                    )}
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
