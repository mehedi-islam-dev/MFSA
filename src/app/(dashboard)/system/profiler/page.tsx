"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Activity, Cpu, Battery, Gauge, Zap, Server, MemoryStick, Search, CheckCircle } from 'lucide-react';
import { LineChart, Line, YAxis, ResponsiveContainer } from 'recharts';

const MODULES = [
  { id: 1, name: 'CENTRAL CMD', baseStatus: 'optimal' },
  { id: 2, name: 'AI VISION', baseStatus: 'optimal' },
  { id: 3, name: 'L-F SYNC', baseStatus: 'optimal' },
  { id: 4, name: 'ELEFAN', baseStatus: 'optimal' },
  { id: 5, name: 'DIGITAL TWIN', baseStatus: 'warning' }, // Heavy 3D load mock
  { id: 6, name: 'ELEFAN ENGINE', baseStatus: 'optimal' },
  { id: 7, name: 'P2P SYNC', baseStatus: 'optimal' },
  { id: 8, name: 'RELEASE ENG', baseStatus: 'optimal' },
];

export default function SystemProfiler() {
  const [isScanning, setIsScanning] = useState(false);
  const [isScanComplete, setIsScanComplete] = useState(false);
  const [cpuData, setCpuData] = useState<{time: string, load: number}[]>([]);
  const [vitals, setVitals] = useState({ fps: 60, mem: 142, battery: -1.2 });
  const [scannedModuleIndex, setScannedModuleIndex] = useState(-1);

  // --- OSCILLOSCOPE & VITALS GENERATION ---
  useEffect(() => {
    // Initial data fill
    const initialData = Array.from({ length: 40 }).map((_, i) => ({
      time: i.toString(),
      load: Math.random() * 20 + 10
    }));
    setCpuData(initialData);

    const interval = setInterval(() => {
      // Update Vitals
      setVitals(prev => ({
         fps: isScanning ? Math.floor(Math.random() * 5 + 45) : Math.floor(Math.random() * 3 + 58),
         mem: isScanning ? prev.mem + Math.random() * 10 : Math.max(142, prev.mem + (Math.random() * 2 - 1)),
         battery: isScanning ? -2.8 : -1.2 + (Math.random() * 0.2 - 0.1)
      }));

      // Update Oscilloscope
      setCpuData(prev => {
        const newLoad = isScanning 
            ? Math.random() * 40 + 50 // Spike load during scan
            : Math.random() * 20 + 10; // Normal load
        const newData = [...prev.slice(1), { time: Date.now().toString(), load: newLoad }];
        return newData;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isScanning]);

  // --- SCAN LOGIC ---
  const handleRunDiagnostic = () => {
    setIsScanning(true);
    setIsScanComplete(false);
    setScannedModuleIndex(0);

    // Module scan sequence
    const scanInterval = setInterval(() => {
      setScannedModuleIndex(prev => {
         if (prev < MODULES.length - 1) return prev + 1;
         clearInterval(scanInterval);
         
         // Finalize scan after last module
         setTimeout(() => {
            setIsScanning(false);
            setIsScanComplete(true);
            setScannedModuleIndex(-1); // Reset scan highlight

            // JARVIS Voice
            if ('speechSynthesis' in window) {
               window.speechSynthesis.cancel();
               const msg = new SpeechSynthesisUtterance("Diagnostic sequence initiated. Memory allocation stable. All 8 core modules are operating at maximum efficiency. System is ready for prolonged field deployment.");
               msg.rate = 0.95; msg.pitch = 0.85;
               window.speechSynthesis.speak(msg);
            }
         }, 1000);
         
         return prev;
      });
    }, 400); // 400ms per module
  };

  return (
    <div className="min-h-screen bg-[#010409] font-mono flex flex-col p-6 lg:p-8 text-cyan-500 overflow-x-hidden">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-cyan-900/60 pb-6 gap-4 shrink-0 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-[0.25em] text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] flex items-center gap-4">
            <Gauge className="w-8 h-8" />
            SYSTEM DIAGNOSTICS & PROFILER
          </h1>
          <p className="text-xs text-cyan-600 tracking-[0.3em] mt-2 font-bold uppercase">Field Readiness & Telemetry Engine</p>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1">
        
        {/* Left Panel: Live Vitals */}
        <div className="lg:col-span-1 glass-panel p-6 flex flex-col gap-6 h-fit">
          <h2 className="text-xs font-bold tracking-[0.2em] text-cyan-400 border-b border-cyan-900/50 pb-2 flex items-center gap-2">
            <Activity className="w-4 h-4" /> LIVE VITALS
          </h2>
          
          <div className="flex flex-col gap-4 mt-2">
            
            {/* FPS Gauge */}
            <div className={`p-4 rounded bg-[#01060c] border relative overflow-hidden transition-colors duration-300 ${vitals.fps < 50 ? 'border-yellow-900/50' : 'border-cyan-900/50'}`}>
               <div className="flex justify-between items-start mb-2 relative z-10">
                  <span className="text-[10px] tracking-widest text-cyan-700 font-bold uppercase">Render FPS</span>
                  <Activity className={`w-4 h-4 ${vitals.fps < 50 ? 'text-yellow-500' : 'text-cyan-500'}`} />
               </div>
               <div className="flex items-end gap-2 relative z-10">
                  <span className={`text-3xl font-bold ${vitals.fps < 50 ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]'}`}>
                     {vitals.fps}
                  </span>
                  <span className="text-[9px] text-cyan-700 mb-1 tracking-widest">/ 60</span>
               </div>
               {/* Background Bar */}
               <div className="absolute bottom-0 left-0 h-1 bg-cyan-900/30 w-full">
                  <div className={`h-full transition-all duration-300 ${vitals.fps < 50 ? 'bg-yellow-500 shadow-[0_0_10px_#eab308]' : 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]'}`} style={{ width: `${(vitals.fps / 60) * 100}%` }} />
               </div>
            </div>

            {/* Memory Gauge */}
            <div className={`p-4 rounded bg-[#01060c] border relative overflow-hidden transition-colors duration-300 ${vitals.mem > 200 ? 'border-yellow-900/50' : 'border-cyan-900/50'}`}>
               <div className="flex justify-between items-start mb-2 relative z-10">
                  <span className="text-[10px] tracking-widest text-cyan-700 font-bold uppercase">Heap Memory</span>
                  <MemoryStick className={`w-4 h-4 ${vitals.mem > 200 ? 'text-yellow-500' : 'text-cyan-500'}`} />
               </div>
               <div className="flex items-end gap-2 relative z-10">
                  <span className={`text-3xl font-bold ${vitals.mem > 200 ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]'}`}>
                     {vitals.mem.toFixed(1)}
                  </span>
                  <span className="text-[9px] text-cyan-700 mb-1 tracking-widest">MB</span>
               </div>
            </div>

            {/* Battery Drain */}
            <div className="p-4 rounded bg-[#01060c] border border-cyan-900/50 relative overflow-hidden">
               <div className="flex justify-between items-start mb-2 relative z-10">
                  <span className="text-[10px] tracking-widest text-cyan-700 font-bold uppercase">Drain Rate</span>
                  <Battery className="w-4 h-4 text-cyan-500" />
               </div>
               <div className="flex items-end gap-2 relative z-10">
                  <span className="text-3xl font-bold text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                     {vitals.battery.toFixed(2)}
                  </span>
                  <span className="text-[9px] text-cyan-700 mb-1 tracking-widest">% / min</span>
               </div>
            </div>

          </div>
        </div>

        {/* Center Display: Performance Oscilloscope */}
        <div className="lg:col-span-2 glass-panel p-6 flex flex-col gap-6 relative min-h-[400px]">
           
           <h2 className="text-xs font-bold tracking-[0.2em] text-cyan-400 border-b border-cyan-900/50 pb-2 flex items-center gap-2 z-10 justify-between">
             <div className="flex items-center gap-2"><Cpu className="w-4 h-4" /> CPU THREAD LOAD (OSCILLOSCOPE)</div>
             {isScanning && <span className="text-yellow-400 animate-pulse font-bold tracking-widest text-[9px]">STRESS TEST ACTIVE</span>}
           </h2>

           <div className="flex-1 w-full relative bg-[#01060c] border border-cyan-900/30 rounded-lg overflow-hidden shadow-[inset_0_0_30px_rgba(34,211,238,0.05)]">
              {/* Grid Background */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20 pointer-events-none" />
              
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={cpuData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                    <YAxis domain={[0, 100]} hide />
                    <Line 
                       type="monotone" 
                       dataKey="load" 
                       stroke={isScanning ? "#eab308" : "#22d3ee"} 
                       strokeWidth={2} 
                       dot={false}
                       isAnimationActive={false} // Disable Recharts animation to make it feel like a raw oscilloscope
                       style={{ filter: `drop-shadow(0px 0px 8px ${isScanning ? 'rgba(234,179,8,0.8)' : 'rgba(34,211,238,0.8)'})` }}
                    />
                 </LineChart>
              </ResponsiveContainer>

              {/* Scanning Overlay Effect */}
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none opacity-50" />
           </div>

           <button 
             onClick={handleRunDiagnostic}
             disabled={isScanning}
             className={`w-full py-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden group mt-2
                ${isScanning ? 'bg-yellow-950 border-yellow-500 text-yellow-300 shadow-[0_0_30px_rgba(234,179,8,0.3)] cursor-not-allowed' : 
                  isScanComplete ? 'bg-green-950/80 border-green-500 text-green-400 shadow-[0_0_20px_rgba(74,222,128,0.3)]' :
                  'bg-cyan-950/80 border-cyan-400 text-cyan-300 hover:bg-cyan-900 hover:shadow-[0_0_30px_#22d3ee] active:scale-95'}`}
           >
              {isScanning ? (
                 <>
                    <Search className="w-6 h-6 animate-pulse" />
                    <span className="text-[10px] font-bold tracking-[0.3em]">EXECUTING DEEP DIAGNOSTIC...</span>
                 </>
              ) : isScanComplete ? (
                 <>
                    <CheckCircle className="w-6 h-6" />
                    <span className="text-[10px] font-bold tracking-[0.3em]">SYSTEM OPTIMAL. READY FOR DEPLOYMENT.</span>
                 </>
              ) : (
                 <>
                    <Zap className="w-6 h-6 group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] transition-all" />
                    <span className="text-[10px] font-bold tracking-[0.3em]">RUN DEEP DIAGNOSTIC</span>
                 </>
              )}
           </button>
        </div>

        {/* Right Panel: Module Health Matrix */}
        <div className="lg:col-span-1 glass-panel p-6 flex flex-col gap-6 h-fit">
          <h2 className="text-xs font-bold tracking-[0.2em] text-cyan-400 border-b border-cyan-900/50 pb-2 flex items-center gap-2">
            <Server className="w-4 h-4" /> MODULE HEALTH
          </h2>

          <div className="grid grid-cols-2 gap-3 mt-2">
             {MODULES.map((mod, i) => {
                const isCurrentlyScanning = scannedModuleIndex === i;
                
                // Determine final state display
                let currentStatus = mod.baseStatus;
                if (isScanComplete) {
                   // If scan completes, clear the mock warning to show "all stable"
                   currentStatus = 'optimal'; 
                }

                return (
                   <div key={mod.id} className={`p-3 rounded border flex flex-col gap-2 transition-all duration-300 relative
                      ${isCurrentlyScanning ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_15px_#22d3ee]' : 
                        currentStatus === 'warning' ? 'bg-yellow-950/20 border-yellow-900/50' : 
                        isScanComplete ? 'bg-green-950/20 border-green-900/50' :
                        'bg-[#01060c] border-cyan-900/30'}`}
                   >
                      <span className="text-[8px] font-bold tracking-widest text-cyan-600 truncate">{mod.name}</span>
                      
                      <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full 
                            ${isCurrentlyScanning ? 'bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]' : 
                              currentStatus === 'warning' ? 'bg-yellow-500 animate-pulse shadow-[0_0_10px_#eab308]' : 
                              isScanComplete ? 'bg-green-500 shadow-[0_0_10px_#4ade80]' :
                              'bg-cyan-700'}`} 
                         />
                         <span className={`text-[8px] tracking-widest font-bold uppercase
                            ${isCurrentlyScanning ? 'text-cyan-300' : 
                              currentStatus === 'warning' ? 'text-yellow-500' : 
                              isScanComplete ? 'text-green-400' :
                              'text-cyan-800'}`}
                         >
                            {isCurrentlyScanning ? 'SCANNING' : currentStatus}
                         </span>
                      </div>
                   </div>
                );
             })}
          </div>
        </div>

      </div>
    </div>
  );
}
