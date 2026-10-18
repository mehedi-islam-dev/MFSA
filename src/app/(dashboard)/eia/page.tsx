"use client";

import { Leaf, AlertTriangle, Droplet, Microscope, ShieldAlert, BarChart3 } from "lucide-react";
import { motion, type Variants } from "framer-motion";

export default function EIAPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-mono text-[var(--color-neon-cyan)] relative pb-12">
      
      {/* Header */}
      <div className="border-b border-[var(--color-neon-cyan)]/30 pb-4 relative">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-black flex items-center gap-3 text-[var(--color-neon-cyan)] uppercase tracking-[0.3em] drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]"
        >
          <Leaf className="w-8 h-8" />
          Environmental Impact Assessment
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-sm font-bold text-[var(--color-neon-green)] uppercase tracking-widest mt-2"
        >
          EIA Tracking & Habitat Risk Monitoring
        </motion.p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        
        {/* Coastal Sediment Analysis Card */}
        <motion.div variants={itemVariants} className="glass-panel p-6 border border-[var(--color-neon-purple)]/30 shadow-[0_0_30px_rgba(168,85,247,0.1)] rounded-2xl relative overflow-hidden group bg-[rgba(1,4,9,0.5)] flex flex-col hover:shadow-[0_0_40px_rgba(168,85,247,0.2)] transition-shadow">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-neon-purple)]/5 to-transparent pointer-events-none" />
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h2 className="font-bold uppercase tracking-widest text-slate-100 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
              <Droplet className="w-5 h-5 text-[var(--color-neon-purple)]" />
              Coastal Sediment
            </h2>
            <span className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)] animate-pulse"></span>
          </div>
          
          <div className="space-y-4 relative z-10 flex-1">
            <div className="flex justify-between items-center border-b border-[var(--color-neon-purple)]/20 pb-2">
              <span className="text-xs text-slate-400 uppercase tracking-widest">Heavy Metals (Pb)</span>
              <span className="font-bold text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]">42 mg/kg</span>
            </div>
            <div className="flex justify-between items-center border-b border-[var(--color-neon-purple)]/20 pb-2">
              <span className="text-xs text-slate-400 uppercase tracking-widest">Microplastics</span>
              <span className="font-bold text-[var(--color-neon-purple)]">125 particles/g</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400 uppercase tracking-widest">pH Level</span>
              <span className="font-bold text-[var(--color-neon-purple)]">7.8</span>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-[var(--color-neon-purple)]/30 relative z-10 flex items-center gap-2 text-xs text-yellow-400">
            <AlertTriangle className="w-4 h-4" />
            ELEVATED TOXICITY WARNING
          </div>
        </motion.div>

        {/* Water Quality Anomaly Card */}
        <motion.div variants={itemVariants} className="glass-panel p-6 border border-[var(--color-neon-green)]/30 shadow-[0_0_30px_rgba(0,255,102,0.1)] rounded-2xl relative overflow-hidden group bg-[rgba(1,4,9,0.5)] flex flex-col hover:shadow-[0_0_40px_rgba(0,255,102,0.2)] transition-shadow">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-neon-green)]/5 to-transparent pointer-events-none" />
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h2 className="font-bold uppercase tracking-widest text-slate-100 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(0,255,102,0.5)]">
              <Microscope className="w-5 h-5 text-[var(--color-neon-green)]" />
              Water Quality Anomaly
            </h2>
            <span className="w-2 h-2 rounded-full bg-[var(--color-neon-green)] shadow-[0_0_10px_rgba(0,255,102,0.8)]"></span>
          </div>
          
          <div className="space-y-4 relative z-10 flex-1">
            <div className="flex justify-between items-center border-b border-[var(--color-neon-green)]/20 pb-2">
              <span className="text-xs text-slate-400 uppercase tracking-widest">Dissolved Oxygen</span>
              <span className="font-bold text-[var(--color-neon-red)]">3.2 mg/L</span>
            </div>
            <div className="flex justify-between items-center border-b border-[var(--color-neon-green)]/20 pb-2">
              <span className="text-xs text-slate-400 uppercase tracking-widest">SST Spike</span>
              <span className="font-bold text-slate-100">+1.5°C</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400 uppercase tracking-widest">Salinity Shift</span>
              <span className="font-bold text-[var(--color-neon-cyan)]">34.2 PSU</span>
            </div>
          </div>

          <div className="mt-6 relative z-10 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: "84.2%" }}
               transition={{ duration: 1.5, delay: 0.5 }}
               className="h-full bg-[var(--color-neon-green)] shadow-[0_0_10px_rgba(0,255,102,1)]"
             />
          </div>
        </motion.div>

        {/* Industrial Effluent Card */}
        <motion.div variants={itemVariants} className="glass-panel p-6 border border-[var(--color-neon-red)]/30 shadow-[0_0_30px_rgba(255,0,60,0.1)] rounded-2xl relative overflow-hidden group bg-[rgba(1,4,9,0.5)] flex flex-col lg:col-span-1 md:col-span-2 hover:shadow-[0_0_40px_rgba(255,0,60,0.2)] transition-shadow">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-neon-red)]/5 to-transparent pointer-events-none" />
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h2 className="font-bold uppercase tracking-widest text-slate-100 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(255,0,60,0.5)]">
              <ShieldAlert className="w-5 h-5 text-[var(--color-neon-red)]" />
              Industrial Effluent
            </h2>
            <span className="w-2 h-2 rounded-full bg-[var(--color-neon-red)] shadow-[0_0_10px_rgba(255,0,60,0.8)] animate-pulse"></span>
          </div>
          
          <div className="space-y-4 relative z-10 flex-1">
            <div className="flex justify-between items-center border-b border-[var(--color-neon-red)]/20 pb-2">
              <span className="text-xs text-slate-400 uppercase tracking-widest">BOD Levels</span>
              <span className="font-bold text-[var(--color-neon-red)] drop-shadow-[0_0_5px_rgba(255,0,60,0.8)]">180 mg/L</span>
            </div>
            <div className="flex justify-between items-center border-b border-[var(--color-neon-red)]/20 pb-2">
              <span className="text-xs text-slate-400 uppercase tracking-widest">Suspended Solids</span>
              <span className="font-bold text-slate-100">95 mg/L</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400 uppercase tracking-widest">Source Zone</span>
              <span className="font-bold text-[var(--color-neon-cyan)]">Sector 4-B</span>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-[var(--color-neon-red)]/30 relative z-10 flex items-center gap-2 text-xs text-[var(--color-neon-red)]">
            <AlertTriangle className="w-4 h-4 animate-ping" />
            <span className="font-bold">CRITICAL THRESHOLD EXCEEDED</span>
          </div>
        </motion.div>

        {/* Full-width EIA Summary Table/Panel */}
        <motion.div variants={itemVariants} className="lg:col-span-3 md:col-span-2 glass-panel p-8 border border-[var(--color-neon-cyan)]/30 shadow-[0_0_30px_rgba(0,240,255,0.1)] rounded-2xl relative overflow-hidden group bg-[rgba(1,4,9,0.5)]">
           <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-neon-cyan)]/5 to-transparent pointer-events-none" />
           <div className="flex items-center justify-between mb-8 relative z-10">
              <h2 className="text-xl font-bold uppercase tracking-widest text-slate-100 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">
                <BarChart3 className="w-5 h-5 text-[var(--color-neon-cyan)]" />
                Global Ecosystem Assessment Summary
              </h2>
           </div>

           <div className="relative z-10 overflow-x-auto">
             <table className="w-full text-left text-sm text-slate-300">
               <thead className="text-xs uppercase tracking-widest text-[var(--color-neon-cyan)] border-b border-[var(--color-neon-cyan)]/30">
                 <tr>
                   <th className="py-4 font-bold">Zone</th>
                   <th className="py-4 font-bold">Primary Threat</th>
                   <th className="py-4 font-bold">Severity</th>
                   <th className="py-4 font-bold">Action Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-[var(--color-neon-cyan)]/10 font-mono">
                 <tr className="hover:bg-[var(--color-neon-cyan)]/5 transition-colors">
                   <td className="py-4 font-bold text-slate-100">Coastal Reef A</td>
                   <td className="py-4">Thermal Bleaching</td>
                   <td className="py-4 text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]">Moderate</td>
                   <td className="py-4 text-[var(--color-neon-cyan)]">Monitoring</td>
                 </tr>
                 <tr className="hover:bg-[var(--color-neon-cyan)]/5 transition-colors">
                   <td className="py-4 font-bold text-slate-100">Estuary Grid 4</td>
                   <td className="py-4">Industrial Effluent</td>
                   <td className="py-4 text-[var(--color-neon-red)] drop-shadow-[0_0_5px_rgba(255,0,60,0.8)] font-bold">Critical</td>
                   <td className="py-4 text-[var(--color-neon-purple)]">Intervention Required</td>
                 </tr>
                 <tr className="hover:bg-[var(--color-neon-cyan)]/5 transition-colors">
                   <td className="py-4 font-bold text-slate-100">Pelagic Zone Alpha</td>
                   <td className="py-4">Hypoxia Event (Low DO)</td>
                   <td className="py-4 text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]">Moderate</td>
                   <td className="py-4 text-[var(--color-neon-green)]">Telemetry Active</td>
                 </tr>
               </tbody>
             </table>
           </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
