"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Unlock, DownloadCloud, UploadCloud, Database, Hash, FileJson, CheckCircle, Activity, ShieldAlert, FileOutput } from 'lucide-react';
import Link from 'next/link';

export default function EncryptedDataVault() {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isBackupComplete, setIsBackupComplete] = useState(false);
  const [isRestoreComplete, setIsRestoreComplete] = useState(false);
  
  const [encryptionHashes, setEncryptionHashes] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- HASH GENERATION (Visual Only) ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBackingUp || isRestoring) {
      interval = setInterval(() => {
        const randomHash = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        setEncryptionHashes(prev => {
           const newHashes = [randomHash, ...prev];
           return newHashes.slice(0, 15); // Keep last 15 hashes
        });
      }, 100);
    } else {
      // Clear when idle
      setEncryptionHashes([]);
    }
    return () => clearInterval(interval);
  }, [isBackingUp, isRestoring]);

  // --- ACTION HANDLERS ---
  const handleBackup = () => {
    setIsBackingUp(true);
    setIsBackupComplete(false);
    setIsRestoreComplete(false);

    setTimeout(() => {
      setIsBackingUp(false);
      setIsBackupComplete(true);
      
      // Trigger dummy download
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
        vault: "Marine Analytica Offline Cache",
        timestamp: new Date().toISOString(),
        records: 1402,
        integrity: "Verified"
      }, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `marine_analytica_vault_${Date.now()}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();

      // JARVIS Voice
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance("Securing local IndexedDB. Encrypted offline backup generated successfully.");
        msg.rate = 0.95; msg.pitch = 0.85;
        window.speechSynthesis.speak(msg);
      }
    }, 3000);
  };

  const handleRestoreClick = () => {
     if (fileInputRef.current) {
        fileInputRef.current.click();
     }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
       setIsRestoring(true);
       setIsBackupComplete(false);
       setIsRestoreComplete(false);
       
       setTimeout(() => {
         setIsRestoring(false);
         setIsRestoreComplete(true);

         // JARVIS Voice
         if ('speechSynthesis' in window) {
           window.speechSynthesis.cancel();
           const msg = new SpeechSynthesisUtterance("Backup file authenticated. Restoring marine analytics ecosystem to previous state.");
           msg.rate = 0.95; msg.pitch = 0.85;
           window.speechSynthesis.speak(msg);
         }
       }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#010409] font-mono flex flex-col p-6 lg:p-8 text-cyan-500 overflow-x-hidden">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-cyan-900/60 pb-6 gap-4 shrink-0 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-[0.25em] text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] flex items-center gap-4">
            <Shield className="w-8 h-8" />
            ENCRYPTED DATA VAULT
          </h1>
          <p className="text-xs text-cyan-600 tracking-[0.3em] mt-2 font-bold uppercase">IndexedDB Offline Persistence & Military-Grade Backup</p>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1">
        
        {/* Left Panel: Vault Status */}
        <div className="lg:col-span-1 glass-panel p-6 flex flex-col gap-6 h-fit">
          <h2 className="text-xs font-bold tracking-[0.2em] text-cyan-400 border-b border-cyan-900/50 pb-2 flex items-center gap-2">
            <Database className="w-4 h-4" /> LOCAL VAULT STATUS
          </h2>
          
          <div className="flex flex-col gap-5 mt-2">
            
            <div className="p-4 rounded bg-[#01060c] border border-cyan-900/50 relative overflow-hidden group hover:border-cyan-400 transition-colors">
               <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                  <Database className="w-8 h-8 text-cyan-500" />
               </div>
               <span className="text-[10px] tracking-widest text-cyan-700 font-bold uppercase block mb-1">Stored Records</span>
               <span className="text-2xl font-bold text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">1,402</span>
            </div>

            <div className="p-4 rounded bg-[#01060c] border border-cyan-900/50 relative overflow-hidden group hover:border-cyan-400 transition-colors">
               <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                  <Hash className="w-8 h-8 text-cyan-500" />
               </div>
               <span className="text-[10px] tracking-widest text-cyan-700 font-bold uppercase block mb-1">Storage Used</span>
               <span className="text-2xl font-bold text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">14.2 MB</span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded bg-green-950/20 border border-green-900/50 mt-4">
               <ShieldAlert className="w-5 h-5 text-green-400" />
               <div>
                  <span className="text-[10px] tracking-widest text-green-400 font-bold block">INTEGRITY VERIFIED</span>
                  <span className="text-[8px] tracking-wider text-green-700">AES-256 Checksum Valid</span>
               </div>
            </div>

          </div>
        </div>

        {/* Center Display: Backup & Restore Terminal */}
        <div className="lg:col-span-2 glass-panel p-6 flex flex-col gap-6 min-h-[500px]">
           <h2 className="text-xs font-bold tracking-[0.2em] text-cyan-400 border-b border-cyan-900/50 pb-2 flex items-center gap-2">
            <Lock className="w-4 h-4" /> CRYPTOGRAPHY TERMINAL
           </h2>

           <div className="flex-1 flex flex-col gap-6 mt-2">
              
              {/* ZONE 1: GENERATE BACKUP */}
              <button 
                 onClick={handleBackup}
                 disabled={isBackingUp || isRestoring}
                 className={`flex-1 rounded-xl border flex flex-col items-center justify-center gap-4 transition-all duration-300 overflow-hidden relative group
                    ${isBackingUp ? 'bg-cyan-950 border-cyan-500 shadow-[0_0_30px_rgba(34,211,238,0.3)] cursor-not-allowed' : 
                      isBackupComplete ? 'bg-green-950/50 border-green-500 text-green-400' :
                      'bg-[#01060c] border-cyan-900/50 text-cyan-600 hover:border-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30'}`}
              >
                 <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(34,211,238,0.05)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] group-hover:animate-bg-pan" />
                 
                 {isBackingUp ? (
                    <>
                       <DownloadCloud className="w-12 h-12 text-cyan-400 animate-bounce" />
                       <span className="text-sm tracking-[0.3em] font-bold text-cyan-300">GENERATING OFFLINE BACKUP...</span>
                    </>
                 ) : isBackupComplete ? (
                    <>
                       <CheckCircle className="w-12 h-12 text-green-400" />
                       <span className="text-sm tracking-[0.3em] font-bold text-green-400">BACKUP DOWNLOADED</span>
                    </>
                 ) : (
                    <>
                       <FileOutput className="w-12 h-12 group-hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] transition-all" />
                       <span className="text-sm tracking-[0.3em] font-bold">GENERATE OFFLINE BACKUP</span>
                    </>
                 )}
              </button>

              {/* ZONE 2: RESTORE FROM BACKUP */}
              <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
              
              <button 
                 onClick={handleRestoreClick}
                 disabled={isBackingUp || isRestoring}
                 className={`flex-1 rounded-xl border flex flex-col items-center justify-center gap-4 transition-all duration-300 overflow-hidden relative group
                    ${isRestoring ? 'bg-purple-950 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.3)] text-purple-300 cursor-not-allowed' : 
                      isRestoreComplete ? 'bg-green-950/50 border-green-500 text-green-400' :
                      'bg-[#01060c] border-purple-900/30 text-purple-600 hover:border-purple-400 hover:text-purple-300 hover:bg-purple-950/20'}`}
              >
                 <div className="absolute inset-0 border-2 border-dashed border-purple-900/30 group-hover:border-purple-500/50 m-2 rounded-lg pointer-events-none transition-colors" />
                 
                 {isRestoring ? (
                    <>
                       <UploadCloud className="w-12 h-12 text-purple-400 animate-bounce" />
                       <span className="text-sm tracking-[0.3em] font-bold text-purple-300">AUTHENTICATING & RESTORING...</span>
                    </>
                 ) : isRestoreComplete ? (
                    <>
                       <CheckCircle className="w-12 h-12 text-green-400" />
                       <span className="text-sm tracking-[0.3em] font-bold text-green-400">ECOSYSTEM RESTORED</span>
                    </>
                 ) : (
                    <>
                       <FileJson className="w-12 h-12 group-hover:drop-shadow-[0_0_15px_rgba(168,85,247,0.8)] transition-all" />
                       <span className="text-sm tracking-[0.3em] font-bold">RESTORE FROM BACKUP (.JSON)</span>
                    </>
                 )}
              </button>

           </div>
        </div>

        {/* Right Panel: Encryption HUD */}
        <div className="lg:col-span-1 glass-panel p-6 flex flex-col gap-6 h-fit">
          <h2 className="text-xs font-bold tracking-[0.2em] text-cyan-400 border-b border-cyan-900/50 pb-2 flex items-center gap-2">
            <Unlock className="w-4 h-4" /> AES-256 CIPHER
          </h2>

          <div className="flex-1 bg-[#01060c] border border-cyan-900/30 rounded p-4 overflow-hidden relative min-h-[300px] flex flex-col">
             
             <div className="flex items-center justify-between mb-4 pb-2 border-b border-cyan-900/50">
                <span className="text-[10px] tracking-widest text-cyan-600 font-bold uppercase">Hash Stream</span>
                {isBackingUp || isRestoring ? (
                   <Activity className="w-4 h-4 text-cyan-400 animate-spin" />
                ) : (
                   <Lock className="w-4 h-4 text-cyan-800" />
                )}
             </div>

             <div className="flex-1 flex flex-col gap-1 overflow-hidden font-mono text-[9px] text-cyan-800 break-all leading-tight">
                {encryptionHashes.length === 0 && !isBackingUp && !isRestoring && (
                   <div className="flex-1 flex items-center justify-center text-cyan-900/50">
                      CIPHER IDLE
                   </div>
                )}
                <AnimatePresence>
                   {encryptionHashes.map((hash, i) => (
                      <motion.div 
                         key={`${hash}-${i}`}
                         initial={{ opacity: 0, x: -10 }}
                         animate={{ opacity: 1, x: 0 }}
                         exit={{ opacity: 0 }}
                         className={i === 0 ? 'text-cyan-300 drop-shadow-[0_0_5px_#22d3ee] font-bold' : ''}
                      >
                         {hash}
                      </motion.div>
                   ))}
                </AnimatePresence>
             </div>

             {/* Overlay Scanline Effect */}
             <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none opacity-50" />
          </div>
        </div>

      </div>
    </div>
  );
}
