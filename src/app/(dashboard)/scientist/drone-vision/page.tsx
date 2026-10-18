"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, Satellite, Activity, WifiOff, Map, Target, Crosshair, Radio, ShieldAlert } from 'lucide-react';

interface TargetProps {
  x: string;
  y: string;
  color: 'cyan' | 'red';
  onClick?: () => void;
  locked?: boolean;
  pulsing?: boolean;
}

const TargetDot: React.FC<TargetProps> = ({ x, y, color, onClick, locked, pulsing }) => {
  const isRed = color === 'red';
  
  return (
    <motion.div
      className={`absolute flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group`}
      style={{ left: x, top: y }}
      onClick={onClick}
      whileHover={{ scale: 1.2 }}
    >
      <div className={`w-3 h-3 rounded-full ${isRed ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)]' : 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]'} z-10`} />
      
      {(pulsing || isRed) && (
        <motion.div
          className={`absolute w-8 h-8 rounded-full border ${isRed ? 'border-red-500/50' : 'border-cyan-400/50'}`}
          animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
      )}

      {locked && (
        <motion.div 
          initial={{ opacity: 0, scale: 2, rotate: -90 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          className="absolute z-30 pointer-events-none"
        >
          <Crosshair className="w-12 h-12 text-red-500 animate-pulse" />
          <motion.div 
            className="absolute -top-4 -right-16 bg-red-950/80 border border-red-500 text-red-400 text-[10px] px-2 py-1 rounded whitespace-nowrap"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            TARGET LOCKED
          </motion.div>
        </motion.div>
      )}

      {/* Tooltip on hover */}
      <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity bg-[#030b14]/90 border border-slate-700 text-xs text-slate-300 p-2 rounded whitespace-nowrap z-40 pointer-events-none">
        {isRed ? 'UNKNOWN VESSEL' : 'AUTHORIZED VESSEL'}
        <br />
        <span className="text-[10px] text-slate-500">LAT/LON: {Math.random().toFixed(4)} / {Math.random().toFixed(4)}</span>
      </div>
    </motion.div>
  );
};

export default function DroneVision() {
  const [selectedTarget, setSelectedTarget] = useState<null | 'red1'>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [tacticalLock, setTacticalLock] = useState(false);

  const initiateTacticalScan = () => {
    setIsScanning(true);
    setTacticalLock(false);
    setSelectedTarget(null);
    
    // Play radar ping sound if we had audio files, for now just UI delay
    setTimeout(() => {
      setTacticalLock(true);
      setSelectedTarget('red1');
      setIsScanning(false);

      if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance("Alert. Unauthorized vessel detected operating with disabled AIS in the Mirsharai coastal sector. Logging I U U violation.");
        msg.rate = 0.95;
        msg.pitch = 0.8; // slightly robotic/lower pitch
        msg.volume = 1;
        window.speechSynthesis.speak(msg);
      }
    }, 3500); // 3.5 seconds of intensive scanning
  };

  return (
    <div className="min-h-screen bg-[#010409] text-cyan-500 font-mono p-6 flex flex-col gap-6 selection:bg-cyan-900 selection:text-cyan-100">
      
      {/* Header */}
      <header className="flex items-center justify-between border-b border-cyan-900/50 pb-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-950/30 rounded-lg border border-cyan-800">
            <Radio className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-widest text-cyan-300">ORBITAL COMMAND : DRONE/SATELLITE VISION</h1>
            <p className="text-xs text-cyan-700 tracking-[0.2em] mt-1">MODULE 05: AUTONOMOUS SCIENTIST NETWORK</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex flex-col items-end">
            <span className="text-cyan-700 text-xs">UPLINK STATUS</span>
            <span className="text-green-400 font-bold tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> SECURE
            </span>
          </div>
          <div className="flex flex-col items-end border-l border-cyan-900 pl-6">
            <span className="text-cyan-700 text-xs">SECTOR</span>
            <span className="text-cyan-400 font-bold tracking-widest">BAY OF BENGAL</span>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        
        {/* Main Display (Satellite Feed) */}
        <div className="flex-1 relative border border-cyan-900/60 bg-[#020813] rounded-xl overflow-hidden shadow-[inset_0_0_80px_rgba(8,51,68,0.4)] flex items-center justify-center">
          
          {/* Grid lines background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-10" />

          {/* Topographical / Map-like Blobs (simulating coastlines/depths) */}
          <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[70%] bg-cyan-950/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[50%] bg-blue-900/10 blur-[80px] rounded-full pointer-events-none" />

          {/* Concentric radar circles */}
          <div className="absolute w-[800px] h-[800px] rounded-full border border-cyan-900/30 border-dashed pointer-events-none" />
          <div className="absolute w-[500px] h-[500px] rounded-full border border-cyan-900/50 pointer-events-none" />
          <div className="absolute w-[200px] h-[200px] rounded-full border border-cyan-800/80 pointer-events-none" />
          <div className="absolute w-2 h-2 rounded-full bg-cyan-500 pointer-events-none" />

          {/* Crosshairs Base */}
          <div className="absolute w-full h-[1px] bg-cyan-900/40 pointer-events-none" />
          <div className="absolute h-full w-[1px] bg-cyan-900/40 pointer-events-none" />

          {/* Radar Sweep Animation */}
          <div className="absolute w-[1600px] h-[1600px] pointer-events-none overflow-hidden rounded-full">
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'conic-gradient(from 0deg, transparent 70%, rgba(34,211,238,0.05) 90%, rgba(34,211,238,0.4) 100%)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: isScanning ? 1.2 : 4, repeat: Infinity, ease: "linear" }}
            />
            {/* The sweeping line */}
            <motion.div
              className="absolute top-0 left-1/2 w-[2px] h-[800px] bg-cyan-400 origin-bottom shadow-[0_0_15px_#22d3ee]"
              animate={{ rotate: 360 }}
              transition={{ duration: isScanning ? 1.2 : 4, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Targets */}
          <TargetDot x="30%" y="25%" color="cyan" pulsing />
          <TargetDot x="65%" y="45%" color="cyan" />
          <TargetDot x="22%" y="72%" color="cyan" />
          <TargetDot x="78%" y="82%" color="cyan" pulsing />
          <TargetDot x="45%" y="15%" color="cyan" />
          
          <TargetDot 
            x="58%" 
            y="35%" 
            color="red" 
            onClick={() => {
              setSelectedTarget('red1');
              setTacticalLock(true);
            }} 
            locked={tacticalLock && selectedTarget === 'red1'} 
          />

          {/* Overlay scanning effect */}
          <AnimatePresence>
            {isScanning && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-red-950/10 pointer-events-none mix-blend-color-dodge z-30"
              >
                <div className="w-full h-full bg-[linear-gradient(transparent_50%,rgba(255,0,0,0.1)_50%)] bg-[size:100%_4px] animate-[scan_2s_linear_infinite]" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Map Overlays text */}
          <div className="absolute top-6 left-6 text-xs text-cyan-800 tracking-[0.2em] pointer-events-none">
            <p>LAT 22.7564° N</p>
            <p>LON 91.4423° E</p>
            <p className="mt-2 text-cyan-600/50">ALT 450KM (LEO)</p>
          </div>
        </div>

        {/* Right Panel (Target Telemetry) */}
        <div className="w-[420px] shrink-0 border border-cyan-800/50 bg-[#030b14]/90 backdrop-blur p-6 rounded-xl flex flex-col shadow-[0_0_30px_rgba(8,51,68,0.5)] relative overflow-hidden">
          
          {/* Decorative corner brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500 rounded-br-lg" />

          <div className="flex items-center gap-3 border-b border-cyan-900/80 pb-6 mb-6">
            <Radar className="text-cyan-400 w-6 h-6 animate-pulse" />
            <h2 className="text-lg font-bold tracking-[0.2em] text-cyan-300">TARGET TELEMETRY</h2>
          </div>
          
          {selectedTarget ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-6"
            >
              <div className="space-y-1 group">
                <span className="text-[10px] text-cyan-600 uppercase tracking-widest font-semibold flex items-center gap-2">
                  <Map className="w-3 h-3" /> Location
                </span>
                <p className="text-cyan-50 text-sm tracking-wide bg-cyan-950/20 p-3 rounded border border-cyan-900/30 font-semibold shadow-inner">
                  Mirsharai Coastal Zone<br />
                  <span className="text-cyan-400/70 text-xs font-normal">Bay of Bengal Sector / Grid 7A</span>
                </p>
              </div>
              
              <div className="space-y-1 group">
                <span className="text-[10px] text-cyan-600 uppercase tracking-widest font-semibold flex items-center gap-2">
                  <Satellite className="w-3 h-3" /> Vessel Signature
                </span>
                <p className="text-cyan-50 text-sm tracking-wide bg-cyan-950/20 p-3 rounded border border-cyan-900/30 shadow-inner">
                  Unknown Trawler <span className="text-xs text-slate-500 ml-2">(Class C)</span>
                </p>
              </div>
              
              <div className="space-y-1 group">
                <span className="text-[10px] text-cyan-600 uppercase tracking-widest font-semibold flex items-center gap-2">
                  <Radio className="w-3 h-3" /> Transponder
                </span>
                <p className="text-red-400 text-sm tracking-wide bg-red-950/20 p-3 rounded border border-red-900/40 shadow-[inset_0_0_10px_rgba(239,68,68,0.1)] flex items-center gap-3 font-bold">
                  <WifiOff className="w-4 h-4 text-red-500 animate-pulse" />
                  AIS OFFLINE <span className="text-xs text-red-500/70 ml-auto font-normal">DARK VESSEL</span>
                </p>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 p-5 border border-red-500/40 bg-[#1a0808] rounded-lg shadow-[0_0_20px_rgba(239,68,68,0.15)] relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-red-600" />
                <span className="text-xs text-red-500 uppercase tracking-[0.15em] font-bold flex items-center gap-2 mb-3">
                  <ShieldAlert className="w-4 h-4" />
                  Threat Assessment
                </span>
                <p className="text-red-100 text-sm leading-relaxed font-semibold">
                  <span className="text-red-500 mr-2">CRITICAL:</span> 
                  Illegal Fishing detected within Marine Protected Area parameters.
                </p>
                <div className="mt-4 pt-4 border-t border-red-900/50 flex justify-between items-center text-[10px] text-red-400/70">
                  <span>JARVIS Confidence: 99.4%</span>
                  <span>Action: LOGGED & REPORTED</span>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-cyan-800/40">
              <div className="relative">
                <Target className="w-16 h-16 mb-6 opacity-50" />
                {isScanning && (
                  <motion.div 
                    className="absolute inset-0 border-2 border-cyan-500 rounded-full"
                    animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </div>
              <p className="text-sm tracking-[0.2em] font-bold text-cyan-700">NO TARGET SELECTED</p>
              <p className="text-xs mt-3 max-w-[200px] text-center text-cyan-800/80 leading-relaxed">
                Awaiting manual override or tactical AI scan directive.
              </p>
            </div>
          )}

          <div className="mt-auto pt-8">
            <button
              onClick={initiateTacticalScan}
              disabled={isScanning}
              className={`w-full py-4 rounded font-bold tracking-[0.2em] text-sm transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden
                ${isScanning 
                  ? 'bg-cyan-950/50 text-cyan-500 border border-cyan-900 cursor-not-allowed' 
                  : 'bg-red-950/60 text-red-400 border border-red-900/80 hover:bg-red-900/40 hover:shadow-[0_0_25px_rgba(239,68,68,0.4)] hover:text-red-200'
                }`}
            >
              {isScanning && (
                <div className="absolute inset-0 bg-cyan-900/20 animate-pulse" />
              )}
              <Activity className={isScanning ? 'animate-spin' : ''} />
              <span className="relative z-10">
                {isScanning ? 'SCANNING SECTOR...' : 'INITIATE TACTICAL SCAN'}
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
