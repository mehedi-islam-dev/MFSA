"use client";

import { useState } from "react";
import { useData } from "@/components/providers/DataProvider";
import { FileSpreadsheet, Bot, Loader2, Sparkles, Database } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function ReportsPage() {
  const { fishRecords } = useData();
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  const handleDownloadCSV = () => {
    let recordsToExport = fishRecords;
    if (fishRecords.length === 0) {
      recordsToExport = [
        { id: "sample-1", species: "Sample Species A", length: 45.2, weight: 1200, date: "2026-10-04" },
        { id: "sample-2", species: "Sample Species B", length: 32.1, weight: 800, date: "2026-10-04" }
      ] as any;
    }
    
    // Convert to CSV
    const headers = ["ID", "Species", "Length (cm)", "Weight (g)", "Date Captured"];
    const csvRows = [headers.join(",")];
    
    recordsToExport.forEach((record: any) => {
      csvRows.push(`${record.id},${record.species},${record.length},${record.weight},${record.date}`);
    });
    
    const csvData = csvRows.join("\n");
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `marine_data_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("CSV Export Successful!");
  };

  const handleGenerateAI = () => {
    setIsGeneratingAI(true);
    setAiReport(null);
    toast.info("Neural Net Synthesis Initiated: Compiling report...");
    
    const recordCount = fishRecords.length > 0 ? fishRecords.length : "sample";
    // Simulate cinematic loading state
    setTimeout(() => {
      setIsGeneratingAI(false);
      setAiReport(
        `[SYSTEM NOTIFICATION] AI Analysis Complete.\n\n` +
        `Analyzed ${recordCount} telemetry records.\n` +
        `Population health is stable. Growth patterns indicate optimal environmental conditions in Sector 4.\n` +
        `Recommendation: Maintain current observation parameters and await further data accumulation for long-term viability tracking.`
      );
      toast.success("AI Synthesis Complete!");
    }, 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-mono text-[var(--color-neon-cyan)] relative">
      
      {/* Header */}
      <div className="border-b border-[var(--color-neon-cyan)]/30 pb-4 relative">
        <h1 className="text-3xl font-black flex items-center gap-3 text-[var(--color-neon-cyan)] uppercase tracking-[0.3em] drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]">
          <Bot className="w-8 h-8" />
          Automated Reporting Engine
        </h1>
        <p className="text-sm font-bold text-[var(--color-neon-purple)] uppercase tracking-widest mt-2">
          Data Extraction & Autonomous Synthesis
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* CSV Export Panel */}
        <div className="glass-panel p-8 border border-[var(--color-neon-cyan)]/30 shadow-[0_0_30px_rgba(0,240,255,0.1)] rounded-2xl relative overflow-hidden group bg-[rgba(1,4,9,0.5)] flex flex-col items-center text-center justify-center gap-6">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-neon-cyan)]/5 to-transparent pointer-events-none" />
          
          <Database className="w-16 h-16 text-[var(--color-neon-cyan)] drop-shadow-[0_0_15px_rgba(0,240,255,0.8)] group-hover:scale-110 transition-transform duration-500" />
          
          <div className="relative z-10">
            <h2 className="text-xl font-bold uppercase tracking-widest text-slate-100">Raw Data Extraction</h2>
            <p className="text-sm text-slate-400 mt-2">Export {fishRecords.length} records to a universal CSV format for external processing.</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px 0px rgba(0,240,255,0.8)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadCSV}
            className="relative z-10 px-8 py-3 bg-[var(--color-neon-cyan)]/10 border-2 border-[var(--color-neon-cyan)] text-[var(--color-neon-cyan)] uppercase tracking-[0.2em] font-bold rounded-xl flex items-center gap-3 hover:bg-[var(--color-neon-cyan)] hover:text-[#010409] transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-5 h-5" />
            Export Data
          </motion.button>
        </div>

        {/* AI Synthesis Panel */}
        <div className="glass-panel p-8 border border-[var(--color-neon-purple)]/30 shadow-[0_0_30px_rgba(168,85,247,0.1)] rounded-2xl relative overflow-hidden group bg-[rgba(1,4,9,0.5)] flex flex-col items-center text-center justify-center gap-6">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-neon-purple)]/5 to-transparent pointer-events-none" />
          
          <Sparkles className="w-16 h-16 text-[var(--color-neon-purple)] drop-shadow-[0_0_15px_rgba(168,85,247,0.8)] group-hover:scale-110 transition-transform duration-500" />
          
          <div className="relative z-10">
            <h2 className="text-xl font-bold uppercase tracking-widest text-slate-100">Autonomous Synthesis</h2>
            <p className="text-sm text-slate-400 mt-2">Engage Neural Net to generate a high-level summary of the dataset.</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px 0px rgba(168,85,247,0.8)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerateAI}
            className="relative z-10 px-8 py-3 bg-[var(--color-neon-purple)]/10 border-2 border-[var(--color-neon-purple)] text-[var(--color-neon-purple)] uppercase tracking-[0.2em] font-bold rounded-xl flex items-center gap-3 hover:bg-[var(--color-neon-purple)] hover:text-[#010409] transition-colors cursor-pointer"
          >
            {isGeneratingAI ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bot className="w-5 h-5" />}
            {isGeneratingAI ? "Analyzing..." : "Generate AI Report"}
          </motion.button>
        </div>

      </div>

      {/* AI Report Output */}
      <AnimatePresence>
        {isGeneratingAI && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-panel p-8 border border-[var(--color-neon-cyan)]/30 rounded-2xl bg-[rgba(1,4,9,0.8)] flex items-center justify-center gap-4 text-[var(--color-neon-cyan)] shadow-[0_0_30px_rgba(0,240,255,0.1)]"
          >
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="uppercase tracking-[0.2em] font-bold animate-pulse">Neural Net Processing Telemetry...</span>
          </motion.div>
        )}

        {aiReport && !isGeneratingAI && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-8 border border-[var(--color-neon-green)]/40 rounded-2xl bg-slate-900/60 shadow-[inset_0_0_20px_rgba(0,255,102,0.1),0_0_30px_rgba(0,255,102,0.1)] relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-neon-green)] to-transparent" />
            <h3 className="text-xl font-bold uppercase tracking-widest text-[var(--color-neon-green)] mb-4 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(0,255,102,0.8)]">
              <Bot className="w-6 h-6" />
              Synthesis Complete
            </h3>
            <pre className="whitespace-pre-wrap text-slate-300 font-mono text-sm leading-relaxed border-l-2 border-[var(--color-neon-green)] pl-4">
              {aiReport}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
