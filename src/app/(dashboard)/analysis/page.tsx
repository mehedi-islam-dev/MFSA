"use client";

import { useData } from "@/components/providers/DataProvider";
import AnalysisCharts from "./_components/AnalysisCharts";
import LWRScatterPanel from "./_components/LWRScatterPanel";
import StockAssessmentPanel from "./_components/StockAssessmentPanel";
import { LineChart, FlaskConical, TrendingUp, Database, Calculator, UploadCloud, Mic, MicOff } from "lucide-react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { FishRecord } from "@/components/providers/DataProvider";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 200, damping: 22 } }
};

export default function AnalysisPage() {
  const { fishRecords, setFishRecords, lwrParams, loadDemoData, isLoading, avgConditionFactor } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      toast.info("Voice recording stopped.", { description: "Processing audio..." });
      setTimeout(() => {
        toast.error("AI Voice API not connected.", { description: "Falling back to manual entry." });
      }, 1000);
    } else {
      setIsRecording(true);
      toast.success("AI Voice Entry activated.", { description: "Listening for specimen data..." });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      if (!data) {
        setIsUploading(false);
        return;
      }

      try {
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const json: any[][] = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' });

        if (json.length < 2) {
          toast.error("File appears to be empty or lacks data rows.");
          setIsUploading(false);
          return;
        }

        const rawHeaders = json[0].map(h => String(h || '').trim().toLowerCase().replace(/[^a-z0-9]/g, ''));
        const findCol = (candidates: string[]) => {
          return rawHeaders.findIndex(h => candidates.some(c => h.includes(c) || c.includes(h)));
        };

        const speciesIdx  = findCol(['species', 'name', 'fish']);
        const lengthIdx   = findCol(['length', 'len', 'tl', 'totallength', 'sl', 'l']);
        const weightIdx   = findCol(['weight', 'wt', 'mass', 'wg', 'wtg']);
        const locationIdx = findCol(['location', 'site', 'station', 'area', 'loc']);
        const dateIdx     = findCol(['date', 'datetime', 'sampledate', 'collected']);

        const records: FishRecord[] = [];
        for (let i = 1; i < json.length; i++) {
          const row = json[i];
          if (row.every(v => v === undefined || v === null || v === '')) continue;
          
          const lenVal = lengthIdx >= 0 ? parseFloat(row[lengthIdx]) : NaN;
          const wtVal = weightIdx >= 0 ? parseFloat(row[weightIdx]) : NaN;
          
          if (isNaN(lenVal) || lenVal <= 0) continue;
          
          records.push({
            id: `direct-upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            species:  speciesIdx  >= 0 ? String(row[speciesIdx] || 'Unknown') : 'Unknown',
            length:   lenVal,
            weight:   isNaN(wtVal) ? 0 : wtVal,
            location: locationIdx >= 0 ? String(row[locationIdx] || 'Unknown') : 'Unknown',
            date:     dateIdx     >= 0 ? String(row[dateIdx] || '') : '',
          });
        }

        if (records.length > 0) {
          setFishRecords(records);
          toast.success(`Loaded ${records.length} records directly into Math Engine!`);
        } else {
          toast.error("No valid numeric length data found in file.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to parse Excel/CSV file.");
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsArrayBuffer(file);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-cyan-500 animate-pulse font-mono tracking-widest text-sm">LOADING ENGINE...</div>
      </div>
    );
  }

  if (fishRecords.length === 0) {
    return (
      <motion.div key="empty-state" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
        className="min-h-[60vh] flex items-center justify-center">
        <div className="glass-panel p-12 max-w-lg w-full text-center border border-cyan-900/50 rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.04),transparent_70%)] pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center gap-5">
            <div className="p-4 bg-cyan-950/40 rounded-xl border border-cyan-800/50 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
              <Database className="w-10 h-10 text-cyan-500" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-[0.2em] text-cyan-300 uppercase drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
                No Data Available
              </h2>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Load specimen records in the Data Entry workspace to activate the Core Math Engine.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center w-full mt-2">
              <button 
                onClick={toggleRecording}
                className={`px-6 py-2.5 rounded-xl transition-all font-bold tracking-widest uppercase text-sm flex items-center gap-2 ${
                  isRecording 
                    ? "bg-red-950/40 border border-red-700/60 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse" 
                    : "bg-purple-950/40 border border-purple-700/60 text-purple-400 hover:bg-purple-900/60 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />} Voice Entry
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-6 py-2.5 bg-purple-950/40 border border-purple-700/60 text-purple-400 hover:bg-purple-900/60 hover:text-purple-200 hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] rounded-xl transition-all font-bold tracking-widest uppercase text-sm flex items-center gap-2"
              >
                {isUploading ? <span className="animate-pulse">Loading...</span> : <><UploadCloud className="w-4 h-4" /> Direct Upload</>}
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".csv,.xlsx,.xls" 
                onChange={handleFileUpload} 
              />
              <button 
                onClick={loadDemoData}
                className="px-6 py-2.5 bg-cyan-950/40 border border-cyan-700/60 text-cyan-400 hover:bg-cyan-900/60 hover:text-cyan-200 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] rounded-xl transition-all font-bold tracking-widest uppercase text-sm flex items-center gap-2"
              >
                Load Demo
              </button>
              <Link href="/data-entry"
                className="px-6 py-2.5 bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 hover:bg-[#00f0ff] hover:text-black hover:shadow-[0_0_25px_rgba(0,240,255,0.8)] rounded-xl transition-all font-bold tracking-widest uppercase text-sm flex items-center gap-2">
                Data Entry
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div key="data-state" variants={containerVariants} initial="hidden" animate="show"
      className="w-full max-w-6xl mx-auto flex flex-col gap-8 pb-12" id="tour-analysis-charts">

      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-950/50 border border-cyan-500/40 rounded-xl shadow-[0_0_12px_rgba(0,240,255,0.3)]">
            <LineChart className="w-6 h-6 text-[#00f0ff]" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-[0.2em] text-[#00f0ff] drop-shadow-[0_0_12px_rgba(0,240,255,0.6)] uppercase">
              Core Math Engine
            </h1>
            <p className="text-[10px] text-cyan-600 tracking-[0.25em] uppercase font-bold">
              Length-Weight Dynamics � Population Structure � LWR Analytics
            </p>
          </div>
        </div>
      </motion.div>

      {/* -- LWR Section -------------------------------------------------- */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-black tracking-[0.3em] uppercase text-cyan-400 drop-shadow-[0_0_6px_rgba(0,240,255,0.5)]">
            Length-Weight Relationship � W = aL^b
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/30 to-transparent ml-2" />
        </div>
        <LWRScatterPanel records={fishRecords} lwrParams={lwrParams} />
      </motion.div>

      {/* -- Existing Charts (LFD + AI summary) -------------------------- */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-2 mb-4">
          <FlaskConical className="w-4 h-4 text-purple-400" />
          <h2 className="text-xs font-black tracking-[0.3em] uppercase text-purple-400 drop-shadow-[0_0_6px_rgba(168,85,247,0.5)]">
            Population Structure & AI Interpretation
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-purple-500/30 to-transparent ml-2" />
        </div>
        <AnalysisCharts records={fishRecords} />
      </motion.div>

      {/* -- Full Stock Assessment ---------------------------------------- */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs font-black tracking-[0.3em] uppercase text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]">
            Full Stock Assessment Analytics
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-emerald-500/30 to-transparent ml-2" />
        </div>
        <StockAssessmentPanel records={fishRecords} avgConditionFactor={avgConditionFactor} />
      </motion.div>
    </motion.div>
  );
}
