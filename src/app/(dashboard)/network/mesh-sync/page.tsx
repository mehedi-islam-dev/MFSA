"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Wifi, QrCode, Scan, ArrowRightLeft, ShieldCheck, Database, CheckCircle, Activity, Smartphone } from 'lucide-react';

type ConnectionState = 'idle' | 'hosting' | 'joining' | 'connected' | 'syncing' | 'complete';

const MOCK_PACKETS = [
  "ELEFAN Matrix Alpha",
  "Field Samples [Mirsharai]",
  "LB-SPR Base Metrics",
  "Biometric Image Headers"
];

export default function LocalMeshSync() {
  const [connState, setConnState] = useState<ConnectionState>('idle');
  const [syncedRecords, setSyncedRecords] = useState(0);
  const [activePacket, setActivePacket] = useState("");

  // --- AUTOMATED FLOW LOGIC (MOCK) ---
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (connState === 'hosting' || connState === 'joining') {
      // Simulate finding a peer after 3 seconds
      timeout = setTimeout(() => {
        setConnState('connected');
        if ('speechSynthesis' in window) {
           window.speechSynthesis.cancel();
           const msg = new SpeechSynthesisUtterance("Peer-to-peer mesh network established.");
           msg.rate = 0.95; msg.pitch = 0.85;
           window.speechSynthesis.speak(msg);
        }
      }, 3000);
    }

    if (connState === 'connected') {
       // Transition to syncing after a brief pause
       timeout = setTimeout(() => {
          setConnState('syncing');
       }, 1500);
    }

    if (connState === 'syncing') {
       // Simulate data transfer
       let packetIndex = 0;
       const syncInterval = setInterval(() => {
          if (packetIndex < MOCK_PACKETS.length) {
             setActivePacket(MOCK_PACKETS[packetIndex]);
             setSyncedRecords(prev => prev + 342); // arbitrary jump
             packetIndex++;
          } else {
             clearInterval(syncInterval);
             setConnState('complete');
             
             if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const msg = new SpeechSynthesisUtterance("Data synchronization complete. Field sampling databases are now merged.");
                msg.rate = 0.95; msg.pitch = 0.85;
                window.speechSynthesis.speak(msg);
             }
          }
       }, 1200);

       return () => clearInterval(syncInterval);
    }

    return () => clearTimeout(timeout);
  }, [connState]);

  // --- HANDLERS ---
  const handleHost = () => setConnState('hosting');
  const handleJoin = () => setConnState('joining');
  const handleReset = () => {
     setConnState('idle');
     setSyncedRecords(0);
  };

  return (
    <div className="min-h-[calc(100vh-2rem)] font-mono flex flex-col p-4 lg:p-8 text-cyan-500 overflow-x-hidden">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-cyan-900/60 pb-6 gap-4 shrink-0 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-[0.25em] text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] flex items-center gap-4">
            <Network className="w-8 h-8" />
            LOCAL MESH NETWORK SYNC
          </h1>
          <p className="text-xs text-cyan-600 tracking-[0.3em] mt-2 font-bold uppercase">Peer-to-Peer WebRTC Offline Database Merge</p>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1">
        
        {/* Left Panel: Connection Modes */}
        <div className="lg:col-span-1 glass-panel p-6 flex flex-col gap-6 h-fit">
          <h2 className="text-xs font-bold tracking-[0.2em] text-cyan-400 border-b border-cyan-900/50 pb-2 flex items-center gap-2">
            <Wifi className="w-4 h-4" /> HANDSHAKE PROTOCOLS
          </h2>
          
          <div className="flex flex-col gap-4 mt-2">
             
             <button 
                onClick={handleHost}
                disabled={connState !== 'idle'}
                className={`w-full py-6 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all duration-300 relative overflow-hidden group
                   ${connState === 'hosting' ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.4)]' : 
                     connState !== 'idle' ? 'bg-[#010409] border-cyan-900/30 text-cyan-800 cursor-not-allowed' :
                     'bg-[#01060c] border-cyan-900/50 text-cyan-600 hover:border-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40'}`}
             >
                <QrCode className="w-8 h-8 group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] transition-all" />
                <span className="text-[10px] font-bold tracking-[0.2em]">HOST NETWORK</span>
             </button>

             <button 
                onClick={handleJoin}
                disabled={connState !== 'idle'}
                className={`w-full py-6 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all duration-300 relative overflow-hidden group
                   ${connState === 'joining' ? 'bg-purple-950 border-purple-400 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 
                     connState !== 'idle' ? 'bg-[#010409] border-cyan-900/30 text-cyan-800 cursor-not-allowed' :
                     'bg-[#01060c] border-purple-900/30 text-purple-600 hover:border-purple-400 hover:text-purple-300 hover:bg-purple-950/30'}`}
             >
                <Scan className="w-8 h-8 group-hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.8)] transition-all" />
                <span className="text-[10px] font-bold tracking-[0.2em]">JOIN NETWORK</span>
             </button>

             {connState === 'complete' && (
                <button 
                   onClick={handleReset}
                   className="mt-4 w-full py-3 border border-cyan-900 rounded bg-[#01060c] text-[9px] tracking-[0.2em] hover:bg-cyan-950/50 transition-colors"
                >
                   TERMINATE SESSION
                </button>
             )}

          </div>
        </div>

        {/* Center Display: Tactical Radar & Transfer HUD */}
        <div className="lg:col-span-2 glass-panel p-6 flex flex-col gap-6 relative min-h-[500px] overflow-hidden">
           
           <h2 className="text-xs font-bold tracking-[0.2em] text-cyan-400 border-b border-cyan-900/50 pb-2 flex items-center gap-2 z-10">
             <Activity className="w-4 h-4" /> TACTICAL MESH HUD
           </h2>

           <div className="flex-1 flex items-center justify-center relative w-full h-full">
              
              <AnimatePresence mode="wait">
                 
                 {/* STATE: IDLE / JOINING (Radar) */}
                 {(connState === 'idle' || connState === 'joining') && (
                    <motion.div 
                       key="radar"
                       initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.2 }}
                       className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border border-cyan-900 flex items-center justify-center bg-[#010811] shadow-[inset_0_0_50px_rgba(34,211,238,0.05)]"
                    >
                       {/* Radar Rings */}
                       <div className="absolute inset-4 rounded-full border border-cyan-900/50" />
                       <div className="absolute inset-12 rounded-full border border-cyan-900/50" />
                       <div className="absolute inset-24 rounded-full border border-cyan-900/50" />
                       <div className="absolute w-full h-[1px] bg-cyan-900/50" />
                       <div className="absolute h-full w-[1px] bg-cyan-900/50" />
                       
                       {/* Scanning Sweep */}
                       {connState === 'joining' && (
                          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_70%,rgba(168,85,247,0.4)_100%)] animate-[spin_2s_linear_infinite]" />
                       )}
                       {connState === 'idle' && (
                          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_70%,rgba(34,211,238,0.2)_100%)] animate-[spin_4s_linear_infinite]" />
                       )}

                       <div className={`text-xs tracking-[0.2em] font-bold ${connState === 'joining' ? 'text-purple-400 animate-pulse' : 'text-cyan-800'}`}>
                          {connState === 'joining' ? 'SCANNING FOR PEERS...' : 'STANDBY'}
                       </div>
                    </motion.div>
                 )}

                 {/* STATE: HOSTING (QR Code Mock) */}
                 {connState === 'hosting' && (
                    <motion.div 
                       key="hosting"
                       initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.2 }}
                       className="flex flex-col items-center"
                    >
                       <div className="w-64 h-64 bg-cyan-400 p-2 rounded relative flex items-center justify-center shadow-[0_0_50px_rgba(34,211,238,0.3)]">
                          {/* Mock intricate QR pattern using CSS grid */}
                          <div className="w-full h-full bg-[#010409] grid grid-cols-6 grid-rows-6 gap-1 p-3">
                             {Array.from({ length: 36 }).map((_, i) => (
                                <div key={i} className={`bg-cyan-400 ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`} />
                             ))}
                             {/* QR Corner anchors */}
                             <div className="absolute top-4 left-4 w-12 h-12 border-4 border-cyan-400 flex items-center justify-center"><div className="w-6 h-6 bg-cyan-400" /></div>
                             <div className="absolute top-4 right-4 w-12 h-12 border-4 border-cyan-400 flex items-center justify-center"><div className="w-6 h-6 bg-cyan-400" /></div>
                             <div className="absolute bottom-4 left-4 w-12 h-12 border-4 border-cyan-400 flex items-center justify-center"><div className="w-6 h-6 bg-cyan-400" /></div>
                          </div>
                       </div>
                       <div className="mt-8 text-xs tracking-[0.3em] text-cyan-300 font-bold animate-pulse">
                          AWAITING PEER CONNECTION...
                       </div>
                    </motion.div>
                 )}

                 {/* STATE: CONNECTED / SYNCING / COMPLETE (Data Flow) */}
                 {(connState === 'connected' || connState === 'syncing' || connState === 'complete') && (
                    <motion.div 
                       key="transfer"
                       initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                       className="w-full h-full flex flex-col items-center justify-center"
                    >
                       <div className="flex items-center justify-between w-full max-w-lg relative">
                          
                          {/* Device Alpha (Self) */}
                          <div className="flex flex-col items-center gap-3">
                             <div className="w-16 h-24 border-2 border-cyan-500 rounded bg-cyan-950/50 flex flex-col items-center justify-center relative shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                                <Smartphone className="w-8 h-8 text-cyan-300" />
                             </div>
                             <span className="text-[10px] tracking-widest font-bold text-cyan-400">DEV-ALPHA</span>
                          </div>

                          {/* Connection Track */}
                          <div className="flex-1 h-[2px] bg-cyan-900/50 mx-4 relative flex items-center justify-center">
                             {connState === 'syncing' && (
                                <div className="absolute inset-0 overflow-hidden">
                                   <div className="w-full h-full bg-[linear-gradient(90deg,transparent_0%,rgba(34,211,238,0.8)_50%,transparent_100%)] w-[200%] animate-[slide_1s_linear_infinite]" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black, transparent)' }} />
                                </div>
                             )}
                             
                             {connState === 'syncing' && activePacket && (
                                <motion.div 
                                   initial={{ y: -20, opacity: 0 }} animate={{ y: -30, opacity: 1 }} exit={{ opacity: 0 }}
                                   className="absolute bg-cyan-950 border border-cyan-400 px-3 py-1 rounded text-[9px] tracking-widest text-cyan-300 whitespace-nowrap shadow-[0_0_10px_#22d3ee]"
                                >
                                   {activePacket}
                                </motion.div>
                             )}

                             {connState === 'complete' && (
                                <div className="bg-[#010409] px-2">
                                   <CheckCircle className="w-6 h-6 text-green-400 shadow-[0_0_15px_#4ade80] rounded-full" />
                                </div>
                             )}
                          </div>

                          {/* Device Bravo (Peer) */}
                          <div className="flex flex-col items-center gap-3">
                             <div className="w-16 h-24 border-2 border-purple-500 rounded bg-purple-950/50 flex flex-col items-center justify-center relative shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                                <Smartphone className="w-8 h-8 text-purple-300" />
                             </div>
                             <span className="text-[10px] tracking-widest font-bold text-purple-400">DEV-BRAVO</span>
                          </div>

                       </div>

                       <div className="mt-12 text-center h-8">
                          {connState === 'connected' && <span className="text-xs tracking-[0.3em] font-bold text-cyan-300">WEBRTC TUNNEL SECURED. INITIALIZING SYNC...</span>}
                          {connState === 'syncing' && <span className="text-xs tracking-[0.3em] font-bold text-cyan-400 animate-pulse">MERGING DATABASES...</span>}
                          {connState === 'complete' && <span className="text-xs tracking-[0.3em] font-bold text-green-400">SYNC COMPLETE. 100% INTEGRITY.</span>}
                       </div>
                    </motion.div>
                 )}

              </AnimatePresence>

           </div>
        </div>

        {/* Right Panel: Sync Status */}
        <div className="lg:col-span-1 glass-panel p-6 flex flex-col gap-6 h-fit">
          <h2 className="text-xs font-bold tracking-[0.2em] text-cyan-400 border-b border-cyan-900/50 pb-2 flex items-center gap-2">
            <Database className="w-4 h-4" /> SYNC TELEMETRY
          </h2>

          <div className="flex flex-col gap-5 mt-2">
            
            <div className={`flex items-center gap-3 p-3 rounded border transition-colors duration-500
               ${connState === 'connected' || connState === 'syncing' ? 'bg-cyan-950/30 border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 
                 connState === 'complete' ? 'bg-green-950/30 border-green-500/50 shadow-[0_0_15px_rgba(74,222,128,0.2)]' :
                 'bg-[#01060c] border-cyan-900/30'}`}
            >
               <ShieldCheck className={`w-5 h-5 ${connState === 'complete' ? 'text-green-400' : connState === 'idle' || connState === 'hosting' || connState === 'joining' ? 'text-cyan-800' : 'text-cyan-400 animate-pulse'}`} />
               <div>
                  <span className={`text-[10px] tracking-widest font-bold block
                     ${connState === 'complete' ? 'text-green-400' : connState === 'idle' || connState === 'hosting' || connState === 'joining' ? 'text-cyan-700' : 'text-cyan-300'}`}
                  >
                     {connState === 'idle' || connState === 'hosting' || connState === 'joining' ? 'OFFLINE' : 'CONNECTION SECURE'}
                  </span>
                  <span className="text-[8px] tracking-wider text-cyan-600">P2P Encryption Active</span>
               </div>
            </div>

            <div className="p-4 rounded bg-[#01060c] border border-cyan-900/50 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-2 opacity-10">
                  <ArrowRightLeft className="w-8 h-8 text-cyan-500" />
               </div>
               <span className="text-[10px] tracking-widest text-cyan-700 font-bold uppercase block mb-1">Records Synced</span>
               <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-cyan-300">{syncedRecords}</span>
                  <span className="text-xs text-cyan-600 mb-1">rows</span>
               </div>
            </div>

            <div className="flex flex-col gap-2 mt-4">
               <span className="text-[9px] font-bold text-cyan-700 tracking-widest uppercase">Target Database</span>
               <div className="h-2 w-full bg-[#01060c] rounded-full overflow-hidden border border-cyan-900/50">
                  <div className="h-full bg-cyan-500 transition-all duration-300" style={{ width: `${Math.min(100, (syncedRecords / 1368) * 100)}%` }} />
               </div>
            </div>

          </div>
        </div>

      </div>
      
      {/* Global Animation Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide {
           0% { transform: translateX(-50%); }
           100% { transform: translateX(0%); }
        }
      `}} />
    </div>
  );
}
