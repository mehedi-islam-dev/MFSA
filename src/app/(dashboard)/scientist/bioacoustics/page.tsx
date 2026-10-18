"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { Waves, Upload, RadioReceiver, AudioLines, BrainCircuit, PlayCircle, Target, Activity } from "lucide-react";

// Generate initial mock waveform data
const WAVEFORM_BARS = 64;
const generateWaveform = (isAnalyzing: boolean) => {
  return Array.from({ length: WAVEFORM_BARS }).map(() => {
    // When analyzing, create chaotic high-amplitude spikes. When idle, low ambient noise.
    const base = isAnalyzing ? 30 : 5;
    const random = isAnalyzing ? Math.random() * 70 : Math.random() * 20;
    return base + random;
  });
};

export default function BioacousticsPage() {
  const [waveform, setWaveform] = useState<number[]>(generateWaveform(false));
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Animate the waveform continuously
  useEffect(() => {
    const interval = setInterval(() => {
      setWaveform(generateWaveform(isAnalyzing));
    }, isAnalyzing ? 100 : 800); // Fast updates when analyzing, slow ambient swell when idle

    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    
    // Simulate processing time
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      
      const message = "Acoustic signature recognized. High probability of spawning aggregation detected in the designated sector.";
      const event = new CustomEvent("jarvisVoiceCommand", { detail: message });
      window.dispatchEvent(event);
    }, 2500);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full h-full p-4 md:p-8 flex flex-col gap-6 relative">
      
      {/* Header & Controls */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-950/50 border border-cyan-500/50 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            <Waves className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-300 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
              AI Bioacoustics Interpreter
            </h1>
            <p className="text-cyan-100/70 text-sm font-light">Hydrophone Sonar & Pattern Recognition</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-cyan-950/30 border border-cyan-500/30 hover:bg-cyan-900/50 text-cyan-300 font-mono text-xs uppercase tracking-widest rounded-xl flex items-center gap-2 transition-all">
            <Upload className="w-4 h-4" /> Upload Audio
          </button>
          <button className="px-4 py-2 bg-purple-950/30 border border-purple-500/30 hover:bg-purple-900/50 text-purple-300 font-mono text-xs uppercase tracking-widest rounded-xl flex items-center gap-2 transition-all">
            <RadioReceiver className="w-4 h-4 animate-pulse" /> Live Stream
          </button>
        </div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 relative z-10"
      >
        {/* Main Display: Waveform Spectrogram */}
        <motion.div variants={itemVariants} className="xl:col-span-2 bg-black/40 backdrop-blur-3xl border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.1)] rounded-3xl p-6 flex flex-col relative overflow-hidden min-h-[400px]">
          
          <div className="flex justify-between items-center mb-6 border-b border-cyan-500/20 pb-4">
            <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <AudioLines className="w-5 h-5" /> Active Sonar Spectrogram
            </h2>
            {isAnalyzing && (
              <span className="text-xs font-mono text-purple-400 uppercase tracking-widest animate-pulse flex items-center gap-2">
                <BrainCircuit className="w-4 h-4" /> Neural Pattern Matching...
              </span>
            )}
          </div>

          {/* Animated Waveform Area */}
          <div className="flex-1 w-full relative flex items-end justify-center gap-1 overflow-hidden px-4">
            {/* Ambient Background Glow */}
            <div className={`absolute inset-0 bg-gradient-to-t from-cyan-900/20 to-transparent transition-opacity duration-500 ${isAnalyzing ? 'opacity-100' : 'opacity-30'}`}></div>
            
            {waveform.map((height, idx) => {
              // Color gradient across the bars
              const isCenter = Math.abs(idx - (WAVEFORM_BARS / 2)) < (WAVEFORM_BARS / 4);
              const colorClass = isAnalyzing 
                ? (isCenter ? "bg-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.8)]" : "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]")
                : "bg-cyan-700/50";

              return (
                <motion.div
                  key={idx}
                  layout
                  className={`w-full rounded-t-sm ${colorClass}`}
                  style={{ height: `${height}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              );
            })}
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={runAnalysis}
              disabled={isAnalyzing}
              className={`px-8 py-4 font-bold uppercase tracking-widest text-sm rounded-xl flex items-center gap-3 transition-all ${
                isAnalyzing 
                  ? 'bg-purple-900/50 border border-purple-500 text-purple-300 shadow-[0_0_30px_rgba(168,85,247,0.4)] cursor-not-allowed'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:shadow-[0_0_30px_rgba(34,211,238,0.8)]'
              }`}
            >
              {isAnalyzing ? <Activity className="w-5 h-5 animate-spin" /> : <PlayCircle className="w-5 h-5" />}
              {isAnalyzing ? "Processing Signature..." : "Analyze Acoustic Signature"}
            </button>
          </div>
        </motion.div>

        {/* Right Panel: AI Classification HUD */}
        <motion.div variants={itemVariants} className="xl:col-span-1 bg-cyan-950/20 backdrop-blur-3xl border border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.15)] rounded-3xl p-6 flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none z-0"></div>
          
          <div className="flex items-center gap-2 mb-6 border-b border-cyan-500/20 pb-4 relative z-10">
            <Target className="w-5 h-5 text-cyan-500" />
            <h3 className="text-sm font-bold text-cyan-500 uppercase tracking-widest">Classification HUD</h3>
          </div>

          <div className="flex flex-col gap-4 relative z-10 h-full">
            {analysisComplete ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                {/* Match Result */}
                <div className="p-4 bg-emerald-950/30 border border-emerald-500/50 rounded-xl shadow-[0_0_15px_rgba(52,211,153,0.1)]">
                  <span className="text-xs font-mono text-emerald-500 uppercase tracking-widest block mb-1">Detected Species</span>
                  <span className="text-xl font-bold text-emerald-300">Tenualosa ilisha (Hilsa)</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Frequency */}
                  <div className="p-3 bg-black/40 border border-cyan-900/50 rounded-xl">
                    <span className="text-[10px] font-mono text-cyan-100/50 uppercase tracking-widest block mb-1">Frequency Band</span>
                    <span className="text-sm font-bold text-cyan-300">400-800 Hz</span>
                  </div>

                  {/* Confidence */}
                  <div className="p-3 bg-black/40 border border-purple-900/50 rounded-xl">
                    <span className="text-[10px] font-mono text-purple-300/50 uppercase tracking-widest block mb-1">Confidence</span>
                    <span className="text-sm font-bold text-purple-400">92.4% Match</span>
                  </div>
                </div>

                {/* Behavioral Tag */}
                <div className="p-4 bg-black/40 border border-cyan-900/50 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-cyan-100/50 uppercase tracking-widest block mb-1">Behavioral Tag</span>
                    <span className="text-base font-bold text-cyan-300 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-cyan-500" /> Spawning Aggregation
                    </span>
                  </div>
                </div>
                
                {/* Actionable Insights */}
                <div className="mt-4 p-4 border-l-2 border-cyan-500 bg-cyan-950/10">
                  <p className="text-xs text-cyan-100/70 font-light leading-relaxed">
                    <strong className="text-cyan-300 block mb-1 font-mono uppercase">Neural Insight:</strong>
                    Acoustic profile aligns with historically documented spawning choruses. Recommend deploying physical sampling gear to Sector 7A to verify gamete release.
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center opacity-30">
                <BrainCircuit className="w-12 h-12 text-cyan-500 mb-4" />
                <p className="font-mono text-sm text-cyan-300 uppercase tracking-widest text-center">Awaiting Acoustic Signature<br/>For Neural Classification</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
