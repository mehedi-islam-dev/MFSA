"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Cpu, ArrowRight, Network, CheckCircle, HardDrive, BarChart4, Table as TableIcon } from 'lucide-react';
import Link from 'next/link';

// --- MOCK DATA ---
const RAW_DATA = [
  { id: 'REC-01', tl: 28.5 },
  { id: 'REC-02', tl: 34.2 },
  { id: 'REC-03', tl: 31.0 },
  { id: 'REC-04', tl: 29.1 },
  { id: 'REC-05', tl: 33.8 },
  { id: 'REC-06', tl: 32.5 },
  { id: 'REC-07', tl: 30.2 },
  { id: 'REC-08', tl: 35.1 },
];

const INITIAL_BINS = [
  { range: '28-30', min: 28, max: 30, count: 0 },
  { range: '30-32', min: 30, max: 32, count: 0 },
  { range: '32-34', min: 32, max: 34, count: 0 },
  { range: '34-36', min: 34, max: 36, count: 0 },
];

export default function LFSyncPipeline() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const [processingIndex, setProcessingIndex] = useState(-1);
  const [bins, setBins] = useState(INITIAL_BINS);

  // --- Sync Logic ---
  useEffect(() => {
    if (isSyncing && processingIndex < RAW_DATA.length) {
      const timer = setTimeout(() => {
        
        // 1. Sort current item into bin
        if (processingIndex >= 0) {
          const currentItem = RAW_DATA[processingIndex];
          setBins(prev => prev.map(bin => {
            if (currentItem.tl >= bin.min && currentItem.tl < bin.max) {
              return { ...bin, count: bin.count + 1 };
            }
            return bin;
          }));
        }

        // 2. Advance to next item
        if (processingIndex + 1 < RAW_DATA.length) {
          setProcessingIndex(prev => prev + 1);
        } else {
          // Finished
          setIsSyncing(false);
          setIsComplete(true);
          
          if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const msg = new SpeechSynthesisUtterance("Data synchronization complete. Raw morphometric field data has been successfully compiled into Length-Frequency matrices and routed to the ELEFAN analytical engine.");
            msg.rate = 0.95; msg.pitch = 0.85;
            window.speechSynthesis.speak(msg);
          }
        }
      }, 800); // 800ms per item processed

      return () => clearTimeout(timer);
    }
  }, [isSyncing, processingIndex]);

  const handleInitiateSync = () => {
    setBins(INITIAL_BINS);
    setIsComplete(false);
    setIsSyncing(true);
    setProcessingIndex(0);
  };

  return (
    <div className="min-h-screen bg-[#010409] font-mono text-cyan-500 p-6 lg:p-8 flex flex-col gap-8 selection:bg-cyan-900 selection:text-cyan-100 overflow-x-hidden">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-cyan-900/60 pb-6 gap-4 shrink-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-[0.25em] text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] flex items-center gap-4">
            <Network className="w-8 h-8" />
            AUTOMATED L-F SYNC PIPELINE
          </h1>
          <p className="text-xs text-cyan-600 tracking-[0.3em] mt-2 font-bold uppercase">Bridging Module 02 (Data Collection) to Module 04 (ELEFAN)</p>
        </div>
      </header>

      {/* Top Panel: System Statuses */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-4 flex items-center gap-4">
           <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${isSyncing || isComplete ? 'bg-cyan-950/50 border-cyan-400 shadow-[0_0_15px_#22d3ee]' : 'bg-[#010811] border-cyan-900/50'}`}>
              <HardDrive className={`w-5 h-5 ${isSyncing || isComplete ? 'text-cyan-300' : 'text-cyan-700'}`} />
           </div>
           <div>
              <h3 className="text-[9px] tracking-[0.2em] text-cyan-700 font-bold">NODE 01</h3>
              <div className="text-xs font-bold tracking-widest text-cyan-400">IndexedDB: ACTIVE</div>
           </div>
        </div>

        <div className="glass-panel p-4 flex items-center gap-4">
           <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${isSyncing || isComplete ? 'bg-purple-950/50 border-purple-400 shadow-[0_0_15px_#a855f7]' : 'bg-[#010811] border-cyan-900/50'}`}>
              <Cpu className={`w-5 h-5 ${isSyncing || isComplete ? 'text-purple-300' : 'text-cyan-700'}`} />
           </div>
           <div>
              <h3 className="text-[9px] tracking-[0.2em] text-cyan-700 font-bold">NODE 02</h3>
              <div className="text-xs font-bold tracking-widest text-purple-400">Matrix Compiler: {isSyncing ? 'PROCESSING' : isComplete ? 'COMPILED' : 'READY'}</div>
           </div>
        </div>

        <div className="glass-panel p-4 flex items-center gap-4">
           <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${isComplete ? 'bg-green-950/50 border-green-400 shadow-[0_0_15px_#4ade80]' : 'bg-[#010811] border-cyan-900/50'}`}>
              <Activity className={`w-5 h-5 ${isComplete ? 'text-green-300' : 'text-cyan-700'}`} />
           </div>
           <div>
              <h3 className="text-[9px] tracking-[0.2em] text-cyan-700 font-bold">NODE 03</h3>
              <div className="text-xs font-bold tracking-widest text-green-400">ELEFAN Bridge: {isComplete ? 'CONNECTED' : 'STANDBY'}</div>
           </div>
        </div>
      </div>

      {/* Center Display: Data Flow Visualization */}
      <div className="glass-panel p-8 relative overflow-hidden min-h-[300px] flex flex-col justify-center">
         <h2 className="text-xs font-bold tracking-[0.25em] text-cyan-500 absolute top-6 left-6 flex items-center gap-2">
           <Activity className="w-4 h-4" /> LIVE DATA TELEMETRY
         </h2>

         <div className="flex items-center justify-between mt-8 relative z-10">
            
            {/* Source: Local DB Queue */}
            <div className="w-1/4 h-48 border-2 border-dashed border-cyan-800/50 rounded-xl p-4 flex flex-col items-center bg-[#01060c]/50 relative">
               <h3 className="text-[10px] tracking-widest text-cyan-600 font-bold mb-4">RAW LOCAL QUEUE</h3>
               <div className="w-full h-full flex flex-col items-center gap-2 overflow-hidden relative">
                  {RAW_DATA.map((data, index) => {
                     const isProcessing = index === processingIndex;
                     const isDone = index < processingIndex;
                     
                     if (isDone) return null; // Remove from queue once processed
                     
                     return (
                        <motion.div 
                           key={data.id}
                           layout
                           className={`w-full py-2 text-center rounded text-[10px] tracking-widest font-bold border transition-all duration-300
                              ${isProcessing ? 'border-cyan-400 bg-cyan-950/80 text-cyan-300 shadow-[0_0_15px_#22d3ee]' : 'border-cyan-900/50 bg-[#010811] text-cyan-700'}`}
                        >
                           {data.id} | TL: {data.tl}cm
                        </motion.div>
                     );
                  })}
               </div>
            </div>

            {/* The Pipeline Animation Track */}
            <div className="flex-1 h-32 relative mx-8 flex items-center justify-center border-y border-cyan-900/30">
               {/* Background flow lines */}
               <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px)] bg-[size:2rem_100%] opacity-20 pointer-events-none" />
               <ArrowRight className="w-8 h-8 text-cyan-900/50 absolute left-4" />
               <ArrowRight className="w-8 h-8 text-cyan-900/50 absolute right-4" />
               <ArrowRight className="w-8 h-8 text-cyan-900/50 absolute" />

               {/* Processing Particle */}
               <AnimatePresence>
                 {isSyncing && processingIndex >= 0 && processingIndex < RAW_DATA.length && (
                    <motion.div 
                       key={processingIndex}
                       initial={{ x: -200, opacity: 0, scale: 0.5 }}
                       animate={{ x: 200, opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 1.5 }}
                       transition={{ duration: 0.7, ease: "linear" }}
                       className="absolute py-2 px-6 rounded-full border border-cyan-400 bg-cyan-950/90 text-cyan-300 font-bold tracking-widest text-[10px] shadow-[0_0_20px_#22d3ee] flex items-center gap-2"
                    >
                       <Activity className="w-3 h-3 animate-pulse" />
                       PARSING: TL {RAW_DATA[processingIndex].tl}
                    </motion.div>
                 )}
               </AnimatePresence>
            </div>

            {/* Destination: L-F Bins */}
            <div className="w-1/3 h-48 border border-cyan-700/50 rounded-xl p-4 flex flex-col bg-[#020b14] relative shadow-[inset_0_0_20px_rgba(34,211,238,0.1)]">
               <h3 className="text-[10px] tracking-widest text-cyan-400 font-bold mb-4 flex items-center justify-between">
                  <span>L-F MATRIX BINS</span>
                  <BarChart4 className="w-4 h-4" />
               </h3>
               
               <div className="flex flex-col gap-2 h-full justify-center">
                  {bins.map((bin, i) => (
                     <div key={i} className="flex items-center gap-3 w-full">
                        <div className="w-16 text-right text-[10px] tracking-widest text-cyan-600 font-bold">[{bin.range}]</div>
                        <div className="flex-1 h-3 bg-[#01060c] border border-cyan-900/50 rounded overflow-hidden relative">
                           <motion.div 
                              className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]"
                              initial={{ width: 0 }}
                              animate={{ width: `${(bin.count / RAW_DATA.length) * 100}%` }}
                              transition={{ duration: 0.5 }}
                           />
                        </div>
                        <div className="w-8 text-[10px] font-bold text-cyan-400">{bin.count}</div>
                     </div>
                  ))}
               </div>
            </div>

         </div>
      </div>

      {/* Bottom Panel: Matrix Preview & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 glass-panel p-6">
            <h3 className="text-xs font-bold tracking-[0.25em] text-cyan-500 flex items-center gap-2 border-b border-cyan-900/50 pb-4 mb-4">
               <TableIcon className="w-4 h-4" /> COMPILED MATRIX PREVIEW
            </h3>
            
            <div className="overflow-x-auto custom-scrollbar pb-2">
               <table className="w-full text-left text-xs tracking-widest border-collapse">
                  <thead>
                     <tr className="border-b border-cyan-900/60 text-cyan-700">
                        <th className="pb-2 px-4 font-bold">LENGTH CLASS (CM)</th>
                        <th className="pb-2 px-4 font-bold">MIDLENGTH (ML)</th>
                        <th className="pb-2 px-4 font-bold">FREQUENCY (F)</th>
                     </tr>
                  </thead>
                  <tbody>
                     {bins.map((bin, i) => (
                        <tr key={i} className="border-b border-cyan-900/30 hover:bg-cyan-950/20 transition-colors">
                           <td className="py-3 px-4 text-cyan-300 font-bold">{bin.range}</td>
                           <td className="py-3 px-4 text-cyan-500">{(bin.min + bin.max) / 2}</td>
                           <td className={`py-3 px-4 font-bold ${bin.count > 0 ? 'text-green-400 neon-text' : 'text-cyan-800'}`}>
                              {bin.count}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         <div className="glass-panel p-6 flex flex-col justify-between">
            <div>
               <h3 className="text-xs font-bold tracking-[0.25em] text-cyan-500 border-b border-cyan-900/50 pb-4 mb-4">
                  EXECUTION PROTOCOL
               </h3>
               <p className="text-[10px] text-cyan-600 tracking-wider leading-relaxed">
                  This protocol extracts raw Total Length (TL) measurements from the local IndexedDB cache, 
                  compiles them into standardized Length-Frequency bins, and constructs the required matrix for ELEFAN stock assessment algorithms.
               </p>
            </div>

            <div className="mt-8">
               <button 
                  onClick={handleInitiateSync}
                  disabled={isSyncing}
                  className={`w-full py-4 rounded-xl border font-bold tracking-[0.2em] text-sm flex items-center justify-center gap-3 transition-all duration-300
                    ${isSyncing ? 'bg-cyan-900/50 border-cyan-900 text-cyan-500 cursor-not-allowed' : 
                      isComplete ? 'bg-green-950/80 border-green-400 text-green-400 hover:bg-green-900 hover:shadow-[0_0_20px_#4ade80]' : 
                      'bg-cyan-950/80 border-cyan-400 text-cyan-300 hover:bg-cyan-900 hover:shadow-[0_0_20px_#22d3ee]'}`}
                >
                  {isSyncing ? (
                    <>
                      <Network className="w-5 h-5 animate-pulse" />
                      SYNCING PIPELINE...
                    </>
                  ) : isComplete ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      PIPELINE SYNCED
                    </>
                  ) : (
                    <>
                      <Cpu className="w-5 h-5" />
                      INITIATE PIPELINE SYNC
                    </>
                  )}
                </button>
            </div>
         </div>
      </div>

    </div>
  );
}
