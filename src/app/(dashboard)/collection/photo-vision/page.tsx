"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, ScanLine, Save, Target, CheckCircle, Database, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { LocalDB } from '@/lib/localDb';

export default function AIPhotoVision() {
  const [isScanning, setIsScanning] = useState(false);
  const [isCaptured, setIsCaptured] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Simulated Camera Stream "Noise"
  const [noiseOffset, setNoiseOffset] = useState(0);
  useEffect(() => {
    if (!isCaptured) {
      const interval = setInterval(() => {
        setNoiseOffset(Math.random() * 100);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isCaptured]);

  const handleCapture = () => {
    setIsScanning(true);
    
    // Simulate AI Processing Delay
    setTimeout(() => {
      setIsScanning(false);
      setIsCaptured(true);
      
      // JARVIS Audio Feedback
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance("Biometric scan complete. Target isolated.");
        msg.rate = 0.95; msg.pitch = 0.85;
        window.speechSynthesis.speak(msg);
      }
    }, 2000);
  };

  const handleSaveToLocalDB = async () => {
    try {
      // Mock saving to IndexedDB using our schema
      await LocalDB.saveStockAssessment({
        species: 'Tenualosa ilisha',
        region: 'Mirsharai Estuary',
        biomassIndex: 34.2, // Repurposing biomass field to store TL temporarily for the mock
        spr: 96, // Repurposing spr to store confidence
        timestamp: new Date().toISOString()
      });
      
      setIsSaved(true);

      // JARVIS Audio Feedback
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance("Morphometric data logged to local memory. Ready for ELEFAN processing.");
        msg.rate = 0.95; msg.pitch = 0.85;
        window.speechSynthesis.speak(msg);
      }

      // Reset after 3 seconds to take another photo
      setTimeout(() => {
        setIsCaptured(false);
        setIsSaved(false);
      }, 4000);
    } catch (error) {
      console.error("LocalDB Error:", error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-2rem)] flex flex-col font-mono text-cyan-500 overflow-hidden relative">
      
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-cyan-900/50 bg-[#010409]/90 z-20 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 rounded-lg bg-[#020b14] border border-cyan-900/50 hover:bg-cyan-900/30 transition-colors">
             <ChevronLeft className="w-5 h-5 text-cyan-500" />
          </Link>
          <h1 className="text-sm tracking-widest font-bold neon-text">AI PHOTO-VISION</h1>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_#ef4444]" />
           <span className="text-[10px] tracking-widest text-red-400 font-bold">REC</span>
        </div>
      </header>

      {/* Main Camera Viewfinder (Mobile Optimized) */}
      <main className="flex-1 relative bg-black flex flex-col items-center justify-center overflow-hidden">
        
        {/* Mock "Live Camera" Background (Static underwater gradient + noise) */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-[#021120] to-[#010a12] opacity-80"
          style={{ backgroundPosition: `0px ${noiseOffset}px`, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")', mixBlendMode: 'overlay' }}
        />

        {/* HUD Overlay / Grid */}
        <div className="absolute inset-0 pointer-events-none border-[1px] border-cyan-500/20 m-4 lg:m-12 rounded-2xl">
           <div className="absolute top-0 left-1/4 bottom-0 w-[1px] bg-cyan-500/10" />
           <div className="absolute top-0 right-1/4 bottom-0 w-[1px] bg-cyan-500/10" />
           <div className="absolute left-0 top-1/3 right-0 h-[1px] bg-cyan-500/10" />
           <div className="absolute left-0 bottom-1/3 right-0 h-[1px] bg-cyan-500/10" />
           
           {/* Corner Reticles */}
           <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400 rounded-tl-2xl" />
           <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400 rounded-tr-2xl" />
           <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400 rounded-bl-2xl" />
           <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400 rounded-br-2xl" />
        </div>

        {/* Scanning Laser Animation */}
        <AnimatePresence>
          {(isScanning || !isCaptured) && (
            <motion.div 
              className="absolute left-4 right-4 h-[2px] bg-cyan-400 shadow-[0_0_20px_#22d3ee] z-10"
              initial={{ top: '10%' }}
              animate={{ top: '90%' }}
              transition={{ duration: isScanning ? 0.8 : 3, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
            />
          )}
        </AnimatePresence>

        {/* Mock "Detected Fish" Silhouette & Bounding Box */}
        <AnimatePresence>
          {isCaptured && (
            <motion.div 
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
            >
              <div className="relative w-64 h-32 border-2 border-green-400 bg-green-500/10 shadow-[inset_0_0_20px_rgba(74,222,128,0.2),_0_0_20px_rgba(74,222,128,0.4)]">
                 {/* Bounding Box Labels */}
                 <div className="absolute -top-6 left-0 bg-green-500 text-[#010409] text-[9px] font-bold px-2 py-1 tracking-widest">
                    TARGET LOCATED
                 </div>
                 <div className="absolute -bottom-6 right-0 text-green-400 text-[10px] font-bold tracking-widest">
                    CONF: 96.4%
                 </div>
                 
                 {/* Crosshair */}
                 <Target className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-green-400 opacity-50" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Results Card overlay when captured */}
        <AnimatePresence>
          {isCaptured && !isSaved && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute bottom-32 left-4 right-4 lg:left-1/2 lg:-translate-x-1/2 lg:w-96 glass-panel p-5 z-20"
            >
              <h3 className="text-xs tracking-[0.2em] font-bold text-green-400 mb-4 flex items-center gap-2">
                 <CheckCircle className="w-4 h-4" /> BIOMETRIC MATCH
              </h3>
              
              <div className="space-y-3">
                 <div className="flex justify-between items-end border-b border-cyan-900/50 pb-1">
                    <span className="text-[10px] text-cyan-600 tracking-widest">SPECIES</span>
                    <span className="text-sm font-bold text-cyan-300">Tenualosa ilisha</span>
                 </div>
                 <div className="flex justify-between items-end border-b border-cyan-900/50 pb-1">
                    <span className="text-[10px] text-cyan-600 tracking-widest">TOTAL LENGTH (TL)</span>
                    <span className="text-sm font-bold text-cyan-300">34.2 cm</span>
                 </div>
                 <div className="flex justify-between items-end border-b border-cyan-900/50 pb-1">
                    <span className="text-[10px] text-cyan-600 tracking-widest">STANDARD LENGTH (SL)</span>
                    <span className="text-sm font-bold text-cyan-300">28.5 cm</span>
                 </div>
                 <div className="flex justify-between items-end border-b border-cyan-900/50 pb-1">
                    <span className="text-[10px] text-cyan-600 tracking-widest">WEIGHT (EST)</span>
                    <span className="text-sm font-bold text-cyan-300">1.2 kg</span>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Success Alert */}
        <AnimatePresence>
          {isSaved && (
             <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-30 bg-[#010409]/80 backdrop-blur-sm"
             >
                <div className="flex flex-col items-center gap-4 text-center">
                   <div className="w-20 h-20 rounded-full bg-green-950/50 border border-green-500 flex items-center justify-center shadow-[0_0_30px_rgba(74,222,128,0.3)]">
                      <Database className="w-10 h-10 text-green-400" />
                   </div>
                   <h2 className="text-xl font-bold tracking-[0.2em] text-green-400">DATA LOGGED</h2>
                   <p className="text-xs text-green-600 tracking-widest max-w-[250px]">Saved to secure local storage. Ready for ELEFAN processing.</p>
                </div>
             </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Bottom Control Panel */}
      <footer className="p-6 bg-[#020b14]/95 border-t border-cyan-900/50 z-20 shrink-0 relative flex flex-col gap-4">
        
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-20 pointer-events-none" />

        {!isCaptured ? (
          <button 
            onClick={handleCapture}
            disabled={isScanning}
            className={`w-full relative z-10 py-5 rounded-xl border border-cyan-400 font-bold tracking-[0.2em] text-sm flex items-center justify-center gap-3 transition-all duration-300
              ${isScanning ? 'bg-cyan-900/50 text-cyan-300 cursor-not-allowed' : 'bg-cyan-950/80 text-cyan-300 hover:bg-cyan-900 hover:shadow-[0_0_20px_#22d3ee] active:scale-95'}`}
          >
            {isScanning ? (
              <>
                <ScanLine className="w-5 h-5 animate-spin" />
                ANALYZING BIOMETRICS...
              </>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                SNAP & MEASURE
              </>
            )}
          </button>
        ) : (
          <button 
            onClick={handleSaveToLocalDB}
            disabled={isSaved}
            className="w-full relative z-10 py-5 rounded-xl border border-green-400 bg-green-950/80 text-green-400 font-bold tracking-[0.2em] text-sm flex items-center justify-center gap-3 transition-all duration-300 hover:bg-green-900 hover:shadow-[0_0_20px_#4ade80] active:scale-95"
          >
            <Save className="w-5 h-5" />
            SAVE TO LOCAL DB
          </button>
        )}
        
        <div className="flex justify-between items-center text-[9px] text-cyan-800 tracking-widest font-bold mt-2 relative z-10">
           <span>LOCAL MODE</span>
           <span>LAT: 22.75 | LON: 91.53</span>
        </div>
      </footer>

    </div>
  );
}
