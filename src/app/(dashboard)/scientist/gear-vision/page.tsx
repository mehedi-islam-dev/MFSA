"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Eye, AlertTriangle, Target, Activity, Crosshair, Settings2 } from 'lucide-react';

interface FishEntityProps {
  type: 'target' | 'bycatch';
  label: string;
  startY: string;
  delay: number;
  speed: number;
  active: boolean;
}

const FishEntity: React.FC<FishEntityProps> = ({ type, label, startY, delay, speed, active }) => {
  const isBycatch = type === 'bycatch';
  
  return (
    <motion.div
      className="absolute h-12 flex items-center justify-center z-20"
      style={{ top: startY }}
      initial={{ left: '110%' }}
      animate={{ left: '-20%' }}
      transition={{ duration: speed, repeat: Infinity, delay, ease: "linear" }}
    >
      {/* The physical shape in the water */}
      <div className={`w-32 h-10 ${isBycatch ? 'bg-[#0f2c41] rounded-[40%] scale-150' : 'bg-[#0a2336] rounded-[50%]'} opacity-90 blur-[1px] shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]`} />
      
      {/* Bounding Box Overlay */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`absolute -inset-4 border-2 ${isBycatch ? 'border-red-500 bg-red-500/10 animate-pulse' : 'border-cyan-400 bg-cyan-400/10'} flex items-center justify-center`}
          >
            {/* Corner brackets */}
            <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 ${isBycatch ? 'border-red-500' : 'border-cyan-400'}`} />
            <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 ${isBycatch ? 'border-red-500' : 'border-cyan-400'}`} />
            <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 ${isBycatch ? 'border-red-500' : 'border-cyan-400'}`} />
            <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 ${isBycatch ? 'border-red-500' : 'border-cyan-400'}`} />
            
            {/* Tag */}
            <div className={`absolute -top-7 left-0 px-2 py-1 text-[10px] font-bold tracking-widest whitespace-nowrap flex items-center gap-1 ${isBycatch ? 'bg-red-500 text-black shadow-[0_0_10px_#ef4444]' : 'bg-cyan-500 text-black shadow-[0_0_10px_#22d3ee]'}`}>
               {label} {isBycatch && <AlertTriangle className="w-3 h-3 ml-1 animate-ping" />}
            </div>
            
            {/* Crosshair inside box */}
            <Crosshair className={`absolute w-6 h-6 opacity-60 ${isBycatch ? 'text-red-500' : 'text-cyan-400'}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Background Bubble Particles
const Bubble = ({ left, delay, duration }: any) => (
  <motion.div
    className="absolute bottom-0 w-1.5 h-1.5 bg-white/10 rounded-full"
    style={{ left }}
    initial={{ bottom: '-10%', opacity: 0 }}
    animate={{ bottom: '110%', opacity: [0, 0.5, 0] }}
    transition={{ duration, repeat: Infinity, delay, ease: "easeIn" }}
  />
);

export default function GearVision() {
  const [isVisionActive, setIsVisionActive] = useState(false);
  const [metricsVisible, setMetricsVisible] = useState(false);

  const activateVisionAI = () => {
    setIsVisionActive(true);
    
    // Announce the warning
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance("Vision A I active. Warning: High ratio of prohibited bycatch detected in the trawl net. Recommend immediate gear modification.");
      msg.rate = 0.95;
      msg.pitch = 0.85;
      window.speechSynthesis.speak(msg);
    }
    
    // Simulate metrics appearing after analysis
    setTimeout(() => {
       setMetricsVisible(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#010409] text-cyan-500 font-mono p-6 flex flex-col gap-6 selection:bg-cyan-900 selection:text-cyan-100">
      
      {/* Header */}
      <header className="flex items-center justify-between border-b border-cyan-900/50 pb-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-950/30 rounded-lg border border-cyan-800">
            <Camera className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-widest text-cyan-300">BYCATCH & GEAR EFFICIENCY VISION</h1>
            <p className="text-xs text-cyan-700 tracking-[0.2em] mt-1">MODULE 05: AUTONOMOUS SCIENTIST NETWORK</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex flex-col items-end">
            <span className="text-cyan-700 text-xs tracking-widest">FEED STATUS</span>
            <span className="text-red-400 font-bold tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> LIVE : DEPTH 145M
            </span>
          </div>
          <div className="flex flex-col items-end border-l border-cyan-900 pl-6">
            <span className="text-cyan-700 text-xs tracking-widest">VESSEL ID</span>
            <span className="text-cyan-400 font-bold tracking-widest">MV-AQUILA-7</span>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        
        {/* Main Display (Live Net Feed) */}
        <div className="flex-1 relative border border-cyan-900/60 bg-gradient-to-b from-[#011a2c] to-[#010b14] rounded-xl overflow-hidden shadow-[inset_0_0_100px_rgba(2,15,25,1)]">
          
          {/* Trawl Net Mesh Overlay */}
          <div className="absolute inset-0 z-30 pointer-events-none opacity-[0.03] bg-[linear-gradient(45deg,transparent_48%,#fff_49%,#fff_51%,transparent_52%),linear-gradient(-45deg,transparent_48%,#fff_49%,#fff_51%,transparent_52%)] bg-[size:4rem_4rem] mix-blend-overlay" />
          
          {/* Deep water lighting / murkiness */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-cyan-900/10 blur-[100px] pointer-events-none" />
          
          {/* Bubbles */}
          <Bubble left="20%" delay={0} duration={4} />
          <Bubble left="45%" delay={1} duration={5} />
          <Bubble left="75%" delay={2} duration={3} />
          <Bubble left="85%" delay={0.5} duration={6} />
          <Bubble left="35%" delay={1.5} duration={4.5} />

          {/* Fish Entities */}
          <FishEntity type="target" label="TARGET: HILSA" startY="20%" delay={0} speed={8} active={isVisionActive} />
          <FishEntity type="target" label="TARGET: HILSA" startY="45%" delay={2} speed={10} active={isVisionActive} />
          <FishEntity type="target" label="TARGET: HILSA" startY="70%" delay={1} speed={7} active={isVisionActive} />
          <FishEntity type="target" label="TARGET: POMFRET" startY="85%" delay={3.5} speed={9} active={isVisionActive} />
          <FishEntity type="target" label="TARGET: POMFRET" startY="10%" delay={5} speed={8.5} active={isVisionActive} />
          
          <FishEntity type="bycatch" label="BYCATCH: SEA TURTLE" startY="55%" delay={1.5} speed={12} active={isVisionActive} />
          <FishEntity type="bycatch" label="BYCATCH: REEF SHARK" startY="30%" delay={4.5} speed={11} active={isVisionActive} />
          <FishEntity type="bycatch" label="BYCATCH: DOLPHIN" startY="75%" delay={7} speed={14} active={isVisionActive} />

          {/* Camera Overlay HUD */}
          <div className="absolute top-4 left-4 z-40 text-xs font-bold tracking-widest pointer-events-none flex flex-col gap-1">
            <span className="text-white bg-red-600/80 px-2 py-1 rounded shadow">REC</span>
            <span className="text-cyan-400 drop-shadow-md mt-2">CAM 04 : PORT TRAWL</span>
          </div>
          
          {/* Scanlines Effect */}
          <div className="absolute inset-0 z-50 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px]" />
          
          {/* Color Dodge Vision Overlay */}
          <AnimatePresence>
            {isVisionActive && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-cyan-900/10 mix-blend-color-dodge z-10 pointer-events-none"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Right Panel (Efficiency Metrics) */}
        <div className="w-[420px] shrink-0 border border-cyan-800/50 bg-[#020b14]/90 backdrop-blur p-6 rounded-xl flex flex-col shadow-[0_0_40px_rgba(8,51,68,0.3)] relative overflow-hidden">
          
          {/* Decorative Corner lines */}
          <div className="absolute top-0 right-0 w-16 h-[2px] bg-cyan-500/50" />
          <div className="absolute top-0 right-0 h-16 w-[2px] bg-cyan-500/50" />

          <div className="flex items-center gap-3 border-b border-cyan-900/80 pb-6 mb-6">
            <Eye className={`w-6 h-6 ${isVisionActive ? 'text-cyan-400' : 'text-cyan-800'}`} />
            <h2 className="text-lg font-bold tracking-[0.2em] text-cyan-300">VISION AI ANALYSIS</h2>
          </div>
          
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Activation Button */}
            {!isVisionActive ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <Target className="w-16 h-16 text-cyan-900 mb-6" />
                <h3 className="text-cyan-600 font-bold tracking-widest mb-2">SYSTEM STANDBY</h3>
                <p className="text-xs text-cyan-800 mb-8 max-w-[250px] leading-relaxed">
                  Raw camera feed is active. Initialize Vision AI to begin real-time species classification and bycatch assessment.
                </p>
                <button
                  onClick={activateVisionAI}
                  className="w-full py-4 rounded font-bold tracking-[0.2em] text-sm bg-cyan-950/60 text-cyan-400 border border-cyan-700 hover:bg-cyan-900 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300 flex items-center justify-center gap-3 group"
                >
                  <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  ACTIVATE VISION AI
                </button>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col"
              >
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold tracking-widest mb-6 bg-cyan-950/30 p-3 rounded border border-cyan-900">
                  <Activity className="w-4 h-4 animate-pulse" />
                  AI CLASSIFICATION ACTIVE
                </div>

                {/* Metrics */}
                <div className="space-y-6">
                  {/* Target Catch Rate */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold tracking-widest">
                      <span className="text-cyan-600">TARGET CATCH RATE</span>
                      {metricsVisible ? <span className="text-cyan-400">65%</span> : <span className="text-cyan-800">ANALYZING...</span>}
                    </div>
                    <div className="h-2 bg-cyan-950 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: metricsVisible ? '65%' : '0%' }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-cyan-500 shadow-[0_0_10px_#22d3ee]"
                      />
                    </div>
                  </div>

                  {/* Bycatch Ratio */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold tracking-widest">
                      <span className="text-cyan-600">BYCATCH RATIO</span>
                      {metricsVisible ? <span className="text-red-400">35%</span> : <span className="text-cyan-800">ANALYZING...</span>}
                    </div>
                    <div className="h-2 bg-cyan-950 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: metricsVisible ? '35%' : '0%' }}
                        transition={{ duration: 1, delay: 0.7 }}
                        className="h-full bg-red-500 shadow-[0_0_10px_#ef4444]"
                      />
                    </div>
                  </div>
                </div>

                {/* Critical Warning & Recommendation */}
                <AnimatePresence>
                  {metricsVisible && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      className="mt-8 flex flex-col gap-4"
                    >
                      <div className="p-4 border border-red-500/40 bg-red-950/20 rounded-lg flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5 animate-pulse" />
                        <div>
                          <h4 className="text-red-500 text-xs font-bold tracking-widest mb-1">CRITICAL THRESHOLD EXCEEDED</h4>
                          <p className="text-red-200/80 text-xs leading-relaxed">
                            Bycatch ratio exceeds the 15% maximum allowable limit. Protected species detected in trawl path.
                          </p>
                        </div>
                      </div>

                      <div className="p-4 border border-cyan-600/40 bg-cyan-950/20 rounded-lg flex items-start gap-3 relative overflow-hidden">
                        <div className="absolute left-0 top-0 w-1 h-full bg-cyan-500" />
                        <Settings2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-cyan-400 text-xs font-bold tracking-widest mb-1">GEAR RECOMMENDATION</h4>
                          <p className="text-cyan-100/90 text-sm leading-relaxed font-semibold">
                            Deploy Turtle Excluder Device (TED) immediately.
                          </p>
                          <button className="mt-3 text-[10px] bg-cyan-900/50 hover:bg-cyan-800 text-cyan-300 px-3 py-1.5 rounded font-bold tracking-widest transition-colors border border-cyan-700/50">
                            TRANSMIT DIRECTIVE TO VESSEL
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
