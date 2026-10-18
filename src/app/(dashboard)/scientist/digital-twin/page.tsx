"use client";

import { useState, useMemo } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { Globe2, ThermometerSun, Droplets, Navigation, Activity, Cpu, AlertTriangle, PlayCircle, BrainCircuit } from "lucide-react";

// Generate a 10x10 Grid with simulated environmental data
const GRID_SIZE = 10;
const generateGridData = () => {
  const grid = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const id = `${String.fromCharCode(65 + y)}${x + 1}`; // e.g., A1, B4
      
      // Simulate a thermal front moving from Top-Right (hot) to Bottom-Left (cold)
      const distanceToHotSpot = Math.sqrt(Math.pow(GRID_SIZE - x, 2) + Math.pow(y, 2));
      const normalizedDist = distanceToHotSpot / Math.sqrt(2 * Math.pow(GRID_SIZE, 2));
      
      // SST ranges from 24 (cold) to 31 (hot)
      const sst = 31 - (normalizedDist * 7) + (Math.random() * 0.8 - 0.4);
      
      // Salinity ranges from 33 (fresh) to 36 (salty)
      const salinity = 36 - (normalizedDist * 3) + (Math.random() * 0.5 - 0.25);
      
      // Determine Cell Color based on SST
      let colorClass = "bg-blue-950/40"; // Default cold
      if (sst > 30) colorClass = "bg-rose-600/60 shadow-[0_0_15px_rgba(225,29,72,0.6)]";
      else if (sst > 29) colorClass = "bg-rose-500/50";
      else if (sst > 28) colorClass = "bg-purple-500/50";
      else if (sst > 27) colorClass = "bg-indigo-500/50";
      else if (sst > 26) colorClass = "bg-cyan-600/50";
      else if (sst > 25) colorClass = "bg-cyan-800/40";

      // AI Prediction: Migration Probability based on heat
      const migrationProb = Math.min(99, Math.max(5, (sst - 26) * 15 + Math.random() * 10));

      grid.push({
        id, x, y, sst, salinity, colorClass, migrationProb
      });
    }
  }
  return grid;
};

export default function DigitalTwinPage() {
  const gridData = useMemo(() => generateGridData(), []);
  const [selectedCell, setSelectedCell] = useState(gridData[55]); // Default to center-ish
  const [isSimulating, setIsSimulating] = useState(false);

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      const message = "Climate simulation complete. Rising sea surface temperatures in the northeastern sectors indicate an 85 percent probability of a northward shift in target biomass over the next 72 hours.";
      const event = new CustomEvent("jarvisVoiceCommand", { detail: message });
      window.dispatchEvent(event);
    }, 1500);
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
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between relative z-10"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-950/50 border border-cyan-500/50 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            <Globe2 className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
              Ocean-Climate Digital Twin
            </h1>
            <p className="text-cyan-100/70 text-sm font-light">Interactive Sector Heatmap & AI Telemetry</p>
          </div>
        </div>
        
        <button
          onClick={runSimulation}
          disabled={isSimulating}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase tracking-widest text-xs rounded-xl flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSimulating ? <Cpu className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
          Run Climate Simulation
        </button>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 relative z-10"
      >
        {/* Left/Main Panel: The Grid Heatmap */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-black/40 backdrop-blur-3xl border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.1)] rounded-3xl p-6 flex flex-col relative overflow-hidden h-[400px] lg:h-auto">
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-widest">Sector Heatmap (SST)</h2>
            <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-100/60">
              <span>Cold</span>
              <div className="w-24 h-2 bg-gradient-to-r from-blue-900 via-cyan-500 to-rose-600 rounded-full"></div>
              <span>Hot</span>
            </div>
          </div>

          <div className="flex-1 w-full relative group">
            {/* Simulation Overlay */}
            <AnimatePresence>
              {isSimulating && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 bg-cyan-950/40 backdrop-blur-sm flex flex-col items-center justify-center border border-cyan-400/50 rounded-xl"
                >
                  <Cpu className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
                  <p className="font-mono text-cyan-300 font-bold tracking-widest uppercase animate-pulse">Running Monte Carlo Simulation...</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CSS Grid */}
            <div 
              className="absolute inset-0 grid gap-1 p-2 border border-cyan-900/50 rounded-xl bg-cyan-950/10"
              style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
            >
              {gridData.map((cell) => (
                <div
                  key={cell.id}
                  onClick={() => setSelectedCell(cell)}
                  className={`
                    relative cursor-pointer transition-all duration-300 rounded-[4px] border
                    ${cell.colorClass} 
                    ${selectedCell.id === cell.id 
                      ? 'border-white shadow-[0_0_15px_rgba(255,255,255,0.8)] scale-110 z-10' 
                      : 'border-transparent hover:border-cyan-300/50 hover:scale-105 opacity-80 hover:opacity-100'
                    }
                  `}
                >
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity">
                    <span className="text-[8px] font-mono text-white/50">{cell.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Panel: Telemetry HUD */}
        <motion.div variants={itemVariants} className="lg:col-span-1 bg-cyan-950/20 backdrop-blur-3xl border border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.15)] rounded-3xl p-6 flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none z-0"></div>
          
          <div className="flex items-center gap-2 mb-6 relative z-10">
            <Activity className="w-4 h-4 text-cyan-500" />
            <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-widest">Sector Telemetry</h3>
          </div>

          <div className="flex flex-col gap-6 relative z-10">
            {/* Selected Sector Title */}
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
              <span className="text-slate-400 font-mono text-sm">Target Lock</span>
              <span className="text-3xl font-extrabold text-cyan-300 font-mono drop-shadow-[0_0_8px_rgba(103,232,249,0.8)] flex items-center gap-2">
                <Navigation className="w-5 h-5 text-cyan-500" />
                Sector {selectedCell.id}
              </span>
            </div>

            {/* SST */}
            <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-cyan-900/50">
              <div className="flex items-center gap-3">
                <ThermometerSun className={`w-5 h-5 ${selectedCell.sst > 28 ? 'text-rose-500' : 'text-cyan-400'}`} />
                <span className="text-cyan-100/70 text-sm font-medium">SST</span>
              </div>
              <span className={`text-xl font-mono font-bold ${selectedCell.sst > 28 ? 'text-rose-400' : 'text-cyan-300'}`}>
                {selectedCell.sst.toFixed(1)}°C
              </span>
            </div>

            {/* Salinity */}
            <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-cyan-900/50">
              <div className="flex items-center gap-3">
                <Droplets className="w-5 h-5 text-blue-400" />
                <span className="text-cyan-100/70 text-sm font-medium">Salinity</span>
              </div>
              <span className="text-xl font-mono font-bold text-blue-300">
                {selectedCell.salinity.toFixed(2)} PSU
              </span>
            </div>

            {/* AI Prediction */}
            <div className={`mt-4 p-5 rounded-2xl border flex flex-col gap-3 transition-colors duration-500 ${selectedCell.migrationProb > 75 ? 'bg-rose-950/30 border-rose-500/50 shadow-[0_0_15px_rgba(225,29,72,0.2)]' : 'bg-cyan-950/30 border-cyan-500/30'}`}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-300 flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4" /> Migration Probability
                </span>
                {selectedCell.migrationProb > 75 && <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />}
              </div>
              
              <div className="flex items-end gap-2">
                <span className={`text-4xl font-black font-mono tracking-tighter ${selectedCell.migrationProb > 75 ? 'text-rose-400' : 'text-cyan-400'}`}>
                  {selectedCell.migrationProb.toFixed(0)}%
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-700 ease-out ${selectedCell.migrationProb > 75 ? 'bg-rose-500 shadow-[0_0_10px_rgba(225,29,72,1)]' : 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)]'}`}
                  style={{ width: `${selectedCell.migrationProb}%` }}
                ></div>
              </div>
              
              <p className="text-xs text-cyan-100/50 mt-1">
                {selectedCell.migrationProb > 75 
                  ? "High thermal stress detected. Biomass emigration highly probable." 
                  : "Stable thermal environment. Biomass retention expected."}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
