"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, CheckCircle2, FileText, AlertCircle, Scan, X } from "lucide-react";
import { smartParse, ParseResult } from "@/lib/smartParser";
import { useData } from "@/components/providers/DataProvider";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

export default function SmartUploadHUD() {
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ParseResult | null>(null);
  const { setFishRecords, fishRecords } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (!file.name.endsWith(".csv") && !file.name.endsWith(".txt") && !file.name.endsWith(".tsv")) {
      toast.error("Unsupported format. Please upload CSV or TSV.");
      return;
    }

    setIsScanning(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setTimeout(() => {
        const parsed = smartParse(text);
        setResult(parsed);
        setIsScanning(false);
      }, 1500); // Simulate scanning delay for HUD effect
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleConfirm = () => {
    if (!result) return;
    
    // Convert to FishRecord format with strict sanitization
    const newRecords = result.records.map((r) => {
      const parsedLength = typeof r.length === 'number' ? r.length : parseFloat(String(r.length ?? ''));
      const parsedWeight = typeof r.weight === 'number' ? r.weight : parseFloat(String(r.weight ?? ''));
      return {
        id: uuidv4(),
        species: typeof r.species === 'string' && r.species.trim() !== '' ? r.species.trim() : "Unknown",
        length: !isNaN(parsedLength) ? parsedLength : 0,
        weight: !isNaN(parsedWeight) ? parsedWeight : 0,
      };
    }).filter(r => r.length > 0 && r.weight > 0 && r.length < 10000 && r.weight < 100000);

    setFishRecords([...newRecords, ...fishRecords]);
    toast.success(`Imported ${newRecords.length} records successfully.`);
    setResult(null);
  };

  return (
    <div className="bg-cyan-950/10 backdrop-blur-3xl border border-cyan-400/20 shadow-[0_0_30px_rgba(6,182,212,0.15)] rounded-2xl relative overflow-hidden group">
      <div className="absolute inset-0 pointer-events-none rounded-2xl shadow-[inset_0_0_20px_rgba(6,182,212,0.1)] border border-cyan-400/10 z-0"></div>
      
      <div className="p-6 relative z-10">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-slate-100 uppercase tracking-widest">
          <UploadCloud className="w-5 h-5 text-cyan-400" />
          Smart Telemetry Ingestion
        </h2>

        <AnimatePresence mode="wait">
          {!result && !isScanning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-3 ${
                isDragging 
                  ? "border-cyan-400 bg-cyan-950/40 shadow-[0_0_30px_rgba(34,211,238,0.3)]" 
                  : "border-cyan-500/30 hover:border-cyan-400/60 bg-transparent hover:bg-cyan-950/20"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <FileText className={`w-10 h-10 ${isDragging ? "text-cyan-400" : "text-cyan-500/50"} transition-colors`} />
              <div>
                <p className="text-cyan-100 font-bold tracking-wide">Drag & Drop Dataset (CSV/TSV)</p>
                <p className="text-xs text-slate-400 mt-1">Native parsing enabled. No external API required.</p>
              </div>
              <input 
                type="file" 
                accept=".csv,.txt,.tsv" 
                className="hidden" 
                ref={fileInputRef}
                onChange={(e) => e.target.files && processFile(e.target.files[0])}
              />
            </motion.div>
          )}

          {isScanning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="border border-cyan-500/30 rounded-xl p-8 text-center bg-cyan-950/20 flex flex-col items-center justify-center gap-4 relative overflow-hidden"
            >
              <div className="absolute inset-x-0 h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-scanline z-50"></div>
              <Scan className="w-12 h-12 text-cyan-400 animate-pulse drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
              <p className="text-cyan-300 font-mono tracking-widest uppercase animate-pulse">Running Neural Pattern Matcher...</p>
            </motion.div>
          )}

          {result && !isScanning && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-cyan-950/30 border border-cyan-500/30 rounded-xl p-6 space-y-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-cyan-100 font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    Scan Complete: {result.records.length} Rows Detected
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">Verify automated column mapping below.</p>
                </div>
                <button 
                  onClick={() => setResult(null)}
                  className="text-slate-400 hover:text-red-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#030712]/50 border border-white/5 rounded-lg p-3">
                  <span className="text-xs text-slate-500 uppercase font-bold block mb-1">Species Match</span>
                  <span className="font-mono text-cyan-300">{result.mappedColumns.species || <span className="text-red-400">Not Found</span>}</span>
                </div>
                <div className="bg-[#030712]/50 border border-white/5 rounded-lg p-3">
                  <span className="text-xs text-slate-500 uppercase font-bold block mb-1">Length Match</span>
                  <span className="font-mono text-cyan-300">{result.mappedColumns.length || <span className="text-red-400">Not Found</span>}</span>
                </div>
                <div className="bg-[#030712]/50 border border-white/5 rounded-lg p-3">
                  <span className="text-xs text-slate-500 uppercase font-bold block mb-1">Weight Match</span>
                  <span className="font-mono text-cyan-300">{result.mappedColumns.weight || <span className="text-red-400">Not Found</span>}</span>
                </div>
              </div>

              {!result.mappedColumns.length || !result.mappedColumns.weight ? (
                <div className="bg-amber-950/30 border border-amber-500/30 p-3 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-200">Missing critical metrics (Length or Weight). Import aborted.</p>
                </div>
              ) : (
                <button
                  onClick={handleConfirm}
                  className="w-full px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase tracking-[0.2em] rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.8)] transition-all"
                >
                  Confirm & Ingest Data
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
