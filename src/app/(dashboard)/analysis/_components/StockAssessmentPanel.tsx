"use client";

import { useMemo } from "react";
import { performStockAssessment, StockAssessmentMetrics } from "@/lib/marineMath";
import { FishRecord } from "@/components/providers/DataProvider";
import { motion } from "framer-motion";
import { Calculator, AlertTriangle, ShieldCheck, Activity } from "lucide-react";

export default function StockAssessmentPanel({ records, avgConditionFactor }: { records: FishRecord[], avgConditionFactor: number }) {
  const metrics: StockAssessmentMetrics | null = useMemo(() => {
    return performStockAssessment(records);
  }, [records]);

  if (!metrics) return null;

  // Commentary engine
  const getCommentary = (metrics: StockAssessmentMetrics, k: number) => {
    const comments = [];
    if (metrics.E > 0.5) {
      comments.push({
        type: "warning",
        icon: <AlertTriangle className="w-4 h-4" />,
        text: `Stock is overexploited (E = ${metrics.E.toFixed(2)} > 0.50). Recommend reducing fishing effort.`
      });
    } else {
      comments.push({
        type: "success",
        icon: <ShieldCheck className="w-4 h-4" />,
        text: `Stock is sustainably exploited (E = ${metrics.E.toFixed(2)} ≤ 0.50).`
      });
    }

    if (k < 1) {
      comments.push({
        type: "warning",
        icon: <AlertTriangle className="w-4 h-4" />,
        text: `Poor fish condition detected (K = ${k.toFixed(2)}). Possible environmental stress or scarce food availability.`
      });
    } else {
      comments.push({
        type: "success",
        icon: <Activity className="w-4 h-4" />,
        text: `Robust fish condition (K = ${k.toFixed(2)}). Indicates healthy environment and adequate food.`
      });
    }

    return comments;
  };

  const commentary = getCommentary(metrics, avgConditionFactor);

  return (
    <div className="bg-cyan-950/20 backdrop-blur-3xl border border-cyan-800/50 shadow-[0_0_30px_rgba(6,182,212,0.1)] rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,rgba(0,240,255,0.05),transparent_50%)] z-0" />
      
      <div className="relative z-10">
        <h3 className="font-black text-cyan-300 tracking-[0.2em] uppercase flex items-center gap-2 mb-6 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
          <Calculator className="w-5 h-5" /> Stock Assessment Diagnostics
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Card 1: Linf */}
          <div className="bg-[#05080d]/80 border border-cyan-900/40 rounded-xl p-4 flex flex-col justify-center">
            <span className="text-[10px] text-cyan-600 tracking-widest font-bold uppercase mb-1">Asymptotic Length</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-mono text-cyan-400">L<sub>∞</sub></span>
              <span className="text-2xl font-bold text-white tracking-wider">{metrics.Linf.toFixed(2)} <span className="text-sm text-cyan-700">cm</span></span>
            </div>
          </div>
          
          {/* Card 2: Growth K */}
          <div className="bg-[#05080d]/80 border border-cyan-900/40 rounded-xl p-4 flex flex-col justify-center">
            <span className="text-[10px] text-cyan-600 tracking-widest font-bold uppercase mb-1">Growth Coefficient</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-mono text-cyan-400">K</span>
              <span className="text-2xl font-bold text-white tracking-wider">{metrics.K_growth.toFixed(3)} <span className="text-sm text-cyan-700">yr⁻¹</span></span>
            </div>
          </div>
          
          {/* Card 3: t0 */}
          <div className="bg-[#05080d]/80 border border-cyan-900/40 rounded-xl p-4 flex flex-col justify-center">
            <span className="text-[10px] text-cyan-600 tracking-widest font-bold uppercase mb-1">Zero-Length Age</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-mono text-cyan-400">t<sub>0</sub></span>
              <span className="text-2xl font-bold text-white tracking-wider">{metrics.t0.toFixed(3)} <span className="text-sm text-cyan-700">yr</span></span>
            </div>
          </div>
          
          {/* Card 4: Z */}
          <div className="bg-[#05080d]/80 border border-cyan-900/40 rounded-xl p-4 flex flex-col justify-center">
            <span className="text-[10px] text-cyan-600 tracking-widest font-bold uppercase mb-1">Total Mortality</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-mono text-cyan-400">Z</span>
              <span className="text-2xl font-bold text-white tracking-wider">{metrics.Z.toFixed(2)} <span className="text-sm text-cyan-700">yr⁻¹</span></span>
            </div>
          </div>
          
          {/* Card 5: M */}
          <div className="bg-[#05080d]/80 border border-cyan-900/40 rounded-xl p-4 flex flex-col justify-center">
            <span className="text-[10px] text-cyan-600 tracking-widest font-bold uppercase mb-1">Natural Mortality</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-mono text-cyan-400">M</span>
              <span className="text-2xl font-bold text-white tracking-wider">{metrics.M.toFixed(2)} <span className="text-sm text-cyan-700">yr⁻¹</span></span>
            </div>
          </div>
          
          {/* Card 6: F */}
          <div className="bg-[#05080d]/80 border border-cyan-900/40 rounded-xl p-4 flex flex-col justify-center">
            <span className="text-[10px] text-cyan-600 tracking-widest font-bold uppercase mb-1">Fishing Mortality</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-mono text-cyan-400">F</span>
              <span className="text-2xl font-bold text-white tracking-wider">{metrics.F.toFixed(2)} <span className="text-sm text-cyan-700">yr⁻¹</span></span>
            </div>
          </div>
          
          {/* Card 7: E */}
          <div className="bg-[#05080d]/80 border border-cyan-900/40 rounded-xl p-4 flex flex-col justify-center">
            <span className="text-[10px] text-cyan-600 tracking-widest font-bold uppercase mb-1">Exploitation Rate</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-mono text-cyan-400">E</span>
              <span className="text-2xl font-bold text-white tracking-wider">{metrics.E.toFixed(2)}</span>
            </div>
          </div>
          
          {/* Card 8: Kn */}
          <div className="bg-[#05080d]/80 border border-cyan-900/40 rounded-xl p-4 flex flex-col justify-center">
            <span className="text-[10px] text-cyan-600 tracking-widest font-bold uppercase mb-1">Condition Factor</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-mono text-cyan-400">K<sub>n</sub></span>
              <span className="text-2xl font-bold text-white tracking-wider">{avgConditionFactor.toFixed(2)}</span>
            </div>
          </div>
          
          {/* Card 9: MSY */}
          <div className="bg-[#05080d]/80 border border-emerald-900/40 rounded-xl p-4 flex flex-col justify-center">
            <span className="text-[10px] text-emerald-600 tracking-widest font-bold uppercase mb-1">Max Sustainable Yield</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-mono text-emerald-400">MSY</span>
              <span className="text-2xl font-bold text-white tracking-wider">{(metrics.MSY / 1000).toFixed(2)} <span className="text-sm text-emerald-700">kg</span></span>
            </div>
          </div>

          {/* Card 10: VPA Biomass */}
          <div className="bg-[#05080d]/80 border border-emerald-900/40 rounded-xl p-4 flex flex-col justify-center">
            <span className="text-[10px] text-emerald-600 tracking-widest font-bold uppercase mb-1">VPA Biomass</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-mono text-emerald-400">B</span>
              <span className="text-2xl font-bold text-white tracking-wider">{(metrics.VPA_Biomass / 1000).toFixed(2)} <span className="text-sm text-emerald-700">kg</span></span>
            </div>
          </div>

          {/* Card 11: LB-SPR */}
          <div className="bg-[#05080d]/80 border border-purple-900/40 rounded-xl p-4 flex flex-col justify-center">
            <span className="text-[10px] text-purple-600 tracking-widest font-bold uppercase mb-1">Spawning Potential (LB-SPR)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-mono text-purple-400">SPR</span>
              <span className="text-2xl font-bold text-white tracking-wider">{metrics.SPR.toFixed(1)} <span className="text-sm text-purple-700">%</span></span>
            </div>
          </div>

          {/* Card 12: GSI */}
          <div className="bg-[#05080d]/80 border border-purple-900/40 rounded-xl p-4 flex flex-col justify-center">
            <span className="text-[10px] text-purple-600 tracking-widest font-bold uppercase mb-1">Gonadosomatic Index</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-mono text-purple-400">GSI</span>
              <span className="text-2xl font-bold text-white tracking-wider">{metrics.GSI.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {/* Dynamic Commentary */}
        <div className="bg-[#03060a] border border-cyan-900/60 rounded-xl p-5 shadow-[inset_0_0_15px_rgba(0,255,255,0.03)]">
          <h4 className="text-xs font-bold text-cyan-500 tracking-[0.2em] mb-3 uppercase">Automated Intelligence Report</h4>
          <div className="space-y-3">
            {commentary.map((comment, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.2 + (i * 0.1) }}
                className={`flex items-start gap-3 p-3 rounded-lg border text-sm ${
                  comment.type === 'warning' 
                    ? 'bg-amber-950/20 border-amber-900/50 text-amber-200' 
                    : 'bg-emerald-950/20 border-emerald-900/50 text-emerald-200'
                }`}
              >
                <div className="mt-0.5">{comment.icon}</div>
                <p className="leading-relaxed tracking-wide font-medium">{comment.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
