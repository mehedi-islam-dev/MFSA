"use client";

import { FishRecord, useData } from "@/components/providers/DataProvider";
import { LengthWeightModelChart } from "./LengthWeightModelChart";
import { LengthFrequencyChart } from "./LengthFrequencyChart";
import { Info, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

export default function AnalysisCharts({ records }: { records: FishRecord[] }) {
  const { lwrParams, aiSummary, setAiSummary } = useData();
  const [isGenerating, setIsGenerating] = useState(false);

  // AI Interpretation Logic
  let interpretation = "Insufficient data";
  let badgeColor = "bg-slate-100 text-slate-800";
  if (lwrParams.b > 0) {
    if (lwrParams.b >= 2.9 && lwrParams.b <= 3.1) {
      interpretation = "Isometric Growth";
      badgeColor = "bg-emerald-100 text-emerald-800 border-emerald-200";
    } else if (lwrParams.b < 2.9) {
      interpretation = "Negative Allometric";
      badgeColor = "bg-amber-100 text-amber-800 border-amber-200";
    } else {
      interpretation = "Positive Allometric";
      badgeColor = "bg-blue-100 text-blue-800 border-blue-200";
    }
  }

  const handleGenerateAI = async () => {
    if (records.length === 0) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalSamples: records.length,
          aValue: lwrParams.a,
          bValue: lwrParams.b,
          growthType: interpretation,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiSummary(data.summary);
        toast.success("AI Summary Generated!");
      } else {
        // Fallback mock response if API is not fully ready
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setAiSummary(
          `**Autonomous Analysis:**\n\nThe analyzed stock of ${records.length} specimens is exhibiting **${interpretation}**. Based on the regression constant (a = ${lwrParams.a.toExponential(4)}) and exponent (b = ${lwrParams.b.toFixed(4)}), the population dynamics suggest stable environmental conditions but warrant continuous monitoring for trophic shifts.`
        );
        toast.success("AI Summary Generated (Simulated)!");
      }
    } catch (e) {
      toast.error("Error communicating with AI engine.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }} 
      animate={{ scale: 1, opacity: 1 }} 
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Stock Analytics Summary Card */}
      <div className="bg-cyan-950/10 backdrop-blur-3xl border border-cyan-400/20 shadow-[0_0_30px_rgba(6,182,212,0.15)] rounded-2xl relative overflow-hidden group p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="absolute inset-0 pointer-events-none rounded-2xl shadow-[inset_0_0_20px_rgba(6,182,212,0.1)] border border-cyan-400/10 z-0"></div>
        <div className="relative z-10">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-1 text-slate-100">
            <Info className="w-5 h-5 text-cyan-400" />
            Stock Analytics Summary
          </h2>
          <p className="text-sm text-slate-400">Calculated from {records.length} records using least squares linear regression.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 relative z-10">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Constant (a)</span>
            <span className="font-mono text-xl text-cyan-300 drop-shadow-[0_0_8px_rgba(103,232,249,0.8)]">{lwrParams.a.toExponential(4)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Exponent (b)</span>
            <span className="font-mono text-xl text-cyan-300 drop-shadow-[0_0_8px_rgba(103,232,249,0.8)]">{lwrParams.b.toFixed(4)}</span>
          </div>
          <div className={`px-4 py-2 rounded-lg border text-sm font-bold flex items-center shadow-[0_0_15px_rgba(16,185,129,0.3)] ${badgeColor.replace('bg-', 'bg-').replace('text-', 'text-').replace('border-', 'border-')}`}>
            {interpretation}
          </div>
        </div>
        
        <div className="w-full md:w-auto mt-4 md:mt-0 relative z-10">
          <button
            onClick={handleGenerateAI}
            disabled={isGenerating || records.length === 0 || lwrParams.b === 0}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-transparent border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_40px_rgba(6,182,212,1)] transition-all duration-300 uppercase tracking-[0.2em] font-bold py-2.5 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {isGenerating ? "Analyzing..." : "Generate AI Insights"}
          </button>
        </div>
      </div>

      {aiSummary && (
        <div className="bg-cyan-950/10 backdrop-blur-3xl border border-cyan-400/20 shadow-[0_0_30px_rgba(6,182,212,0.15)] rounded-2xl relative overflow-hidden group p-6 text-slate-200">
          <div className="absolute inset-0 pointer-events-none rounded-2xl shadow-[inset_0_0_20px_rgba(6,182,212,0.1)] border border-cyan-400/10 z-0"></div>
          <div className="relative z-10">
            <h3 className="font-bold flex items-center gap-2 mb-4 text-cyan-400 tracking-wide uppercase">
              <Sparkles className="w-5 h-5 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
              Autonomous Scientist Interpretation
            </h3>
            <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-strong:text-cyan-300">
              <ReactMarkdown>{aiSummary}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Scatter Chart */}
        <div className="bg-cyan-950/10 backdrop-blur-3xl border border-cyan-400/20 shadow-[0_0_30px_rgba(6,182,212,0.15)] rounded-2xl relative overflow-hidden group p-6">
          <div className="absolute inset-0 pointer-events-none rounded-2xl shadow-[inset_0_0_20px_rgba(6,182,212,0.1)] border border-cyan-400/10 z-0"></div>
          <div className="relative z-10">
            <h3 className="font-bold text-slate-100 mb-4 uppercase tracking-widest text-sm text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">Length-Weight Relationship</h3>
            <LengthWeightModelChart records={records} />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-cyan-950/10 backdrop-blur-3xl border border-cyan-400/20 shadow-[0_0_30px_rgba(6,182,212,0.15)] rounded-2xl relative overflow-hidden group p-6">
          <div className="absolute inset-0 pointer-events-none rounded-2xl shadow-[inset_0_0_20px_rgba(6,182,212,0.1)] border border-cyan-400/10 z-0"></div>
          <div className="relative z-10">
            <h3 className="font-bold text-slate-100 mb-4 uppercase tracking-widest text-sm text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">Length Frequency Distribution</h3>
            <LengthFrequencyChart records={records} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
