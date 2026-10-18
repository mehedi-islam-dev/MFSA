"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, FileSpreadsheet, FileText, Cpu, CheckCircle2, 
  ChevronDown, RefreshCw, AlertCircle, Database, Link as LinkIcon, 
  Settings2, Activity, ArrowRight, Sparkles, Filter, Mic, MicOff
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { useData } from "@/components/providers/DataProvider";

// ─── Constants & Types ────────────────────────────────────────────────────────
const REQUIRED_FIELDS = [
  { id: 'species',  label: 'Species Name',    aliases: ['species', 'name', 'fish_type', 'organism', 'taxa', 'sp'] },
  { id: 'length',   label: 'Length (cm)',     aliases: ['length', 'len', 'tl', 'total_length', 'sl', 'fl', 'l_cm', 'size', 'l'] },
  { id: 'weight',   label: 'Weight (g)',      aliases: ['weight', 'wt', 'mass', 'body_weight', 'w_g', 'wt_g', 'w'] },
  { id: 'location', label: 'Sampling Site',   aliases: ['location', 'site', 'station', 'area', 'region', 'loc', 'zone'] },
  { id: 'date',     label: 'Collection Date', aliases: ['date', 'time', 'datetime', 'sample_date', 'collected_on', 'timestamp'] }
] as const;

type FieldId = typeof REQUIRED_FIELDS[number]['id'];

interface DetectedHeader {
  original: string;
  normalized: string;
}

export interface SanitizedRecord {
  species: string;
  length: number;
  weight: number;
  location: string;
  date: string;
}

// ─── AI Auto-Mapping Logic ────────────────────────────────────────────────────
function autoMapHeaders(headers: string[]): Record<FieldId, string> {
  const mapping: Partial<Record<FieldId, string>> = {};

  REQUIRED_FIELDS.forEach(field => {
    // 1. Exact Match
    let match = headers.find(h => 
      field.aliases.some(alias => h.toLowerCase().replace(/[^a-z0-9]/g, '') === alias.replace(/[^a-z0-9]/g, ''))
    );
    // 2. Fuzzy / Includes match
    if (!match) {
      match = headers.find(h => {
        const normH = h.toLowerCase().replace(/[^a-z0-9]/g, '');
        return field.aliases.some(alias => {
          const normAlias = alias.replace(/[^a-z0-9]/g, '');
          return normH.includes(normAlias) || normAlias.includes(normH);
        });
      });
    }
    mapping[field.id] = match ? match : '';
  });

  return mapping as Record<FieldId, string>;
}

// ─── AI Data Sanitization ─────────────────────────────────────────────────────
function extractNumeric(val: string): number | null {
  if (!val) return null;
  // Extract first contiguous number (including decimals/negatives)
  const match = val.match(/-?\d+(?:\.\d+)?/);
  if (match) {
    const num = parseFloat(match[0]);
    if (!isNaN(num)) return num;
  }
  return null;
}

function AutoDataSanitizer(
  headers: string[],
  rows: string[][],
  mappings: Record<FieldId, string>
): { cleaned: SanitizedRecord[], rawCount: number, cleanCount: number } {
  
  const rawCount = rows.length;
  const cleaned: SanitizedRecord[] = [];

  // Map header string to index
  const hMap: Record<string, number> = {};
  headers.forEach((h, i) => hMap[h] = i);

  for (const row of rows) {
    // 1. Messy Row Cleanup: Skip completely blank rows
    if (row.every(cell => !cell || cell.trim() === '')) continue;
    // 2. Skip header duplicate rows
    if (row.join(',') === headers.join(',')) continue;

    // Get mapped values
    const speciesRaw = mappings.species ? (row[hMap[mappings.species]] || '') : '';
    const lengthRaw  = mappings.length  ? (row[hMap[mappings.length]] || '') : '';
    const weightRaw  = mappings.weight  ? (row[hMap[mappings.weight]] || '') : '';
    const locRaw     = mappings.location? (row[hMap[mappings.location]] || '') : '';
    const dateRaw    = mappings.date    ? (row[hMap[mappings.date]] || '') : '';

    // 3. Smart Value Extraction
    const lengthNum = extractNumeric(lengthRaw);
    const weightNum = extractNumeric(weightRaw);

    // 4. Missing Data Handling (Must have valid length to be useful for ELEFAN)
    if (lengthNum === null || lengthNum <= 0) {
      continue; // Drop row if length is invalid
    }

    cleaned.push({
      species: speciesRaw.trim() || 'Unknown',
      length: lengthNum,
      weight: weightNum !== null && weightNum > 0 ? weightNum : 0,
      location: locRaw.trim() || 'Unknown',
      date: dateRaw.trim() || '—',
    });
  }

  return { cleaned, rawCount, cleanCount: cleaned.length };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function DataEntryPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [step, setStep] = useState<'upload' | 'scanning' | 'mapping' | 'sanitizing' | 'sanitized' | 'success'>('upload');
  
  const [headers, setHeaders] = useState<string[]>([]);
  // We keep all raw rows just in case, but display a preview
  const [rawRows, setRawRows] = useState<string[][]>([]);
  const [mappings, setMappings] = useState<Record<FieldId, string>>({
    species: '', length: '', weight: '', location: '', date: ''
  });

  const [sanitizedData, setSanitizedData] = useState<SanitizedRecord[]>([]);
  const [rawCount, setRawCount] = useState(0);
  const { setFishRecords } = useData();
  
  const [isRecording, setIsRecording] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse CSV mock or actual basic parse
  const handleFileProcess = (file: File) => {
    setFile(file);
    setStep('scanning');

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (!data) return;

      setTimeout(() => {
        try {
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          // header: 1 ensures it returns an array of arrays
          const json: any[][] = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' });

          if (json.length > 0) {
            // Remove empty trailing columns from header
            let extractedHeaders = json[0].map(h => String(h || '').trim());
            // Find the last non-empty header index
            let lastCol = extractedHeaders.length - 1;
            while (lastCol >= 0 && extractedHeaders[lastCol] === '') lastCol--;
            extractedHeaders = extractedHeaders.slice(0, lastCol + 1);

            const rows = json.slice(1).map(row => {
              const r = [];
              for (let i = 0; i < extractedHeaders.length; i++) {
                r.push(String(row[i] || '').trim());
              }
              return r;
            });

            setHeaders(extractedHeaders);
            setRawRows(rows);
            
            const autoMapped = autoMapHeaders(extractedHeaders);
            setMappings(autoMapped);
            
            // Check if length and weight are matched
            const matchedCount = Object.values(autoMapped).filter(Boolean).length;
            if (matchedCount > 0) {
              toast.success(`Data mapped autonomously: ${rows.length} records found.`);
            } else {
              toast.warning(`Could not autonomously map headers. Please map manually.`);
            }
            
            setStep('mapping');
          } else {
            toast.error("File is empty or invalid format.");
            setStep('upload');
          }
        } catch (err) {
          console.error(err);
          toast.error("Failed to parse Excel/CSV file.");
          setStep('upload');
        }
      }, 1500); 
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && (dropped.name.endsWith('.csv') || dropped.name.endsWith('.xlsx') || dropped.name.endsWith('.xls'))) {
      handleFileProcess(dropped);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) handleFileProcess(selected);
  };

  const updateMapping = (field: FieldId, header: string) => {
    setMappings(prev => ({ ...prev, [field]: header }));
  };

  const handleConfirmMapping = () => {
    setStep('sanitizing');
    setTimeout(() => {
      const { cleaned, rawCount, cleanCount } = AutoDataSanitizer(headers, rawRows, mappings);
      setSanitizedData(cleaned);
      setRawCount(rawCount);
      setStep('sanitized');
    }, 2500);
  };

  const handleFinalize = () => {
    // Generate IDs for records to match FishRecord type requirements in DataProvider
    const mappedToGlobal = sanitizedData.map(r => ({
      ...r,
      id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }));
    setFishRecords(mappedToGlobal);
    toast.success('Data synced to Core Math Engine successfully');
    setStep('success');
  };

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

  const reset = () => {
    setFile(null);
    setHeaders([]);
    setRawRows([]);
    setSanitizedData([]);
    setStep('upload');
  };

  const previewData = rawRows.slice(0, 6); // First 6 rows for preview

  return (
    <div className="min-h-screen w-full bg-[#010409] text-[#00f0ff] font-mono overflow-y-auto pb-24 relative">
      
      {/* Background Cyber-Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-[0.05]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,rgba(0,240,255,0.05),transparent_60%)] blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(ellipse,rgba(168,85,247,0.05),transparent_60%)] blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col gap-8 p-4 md:p-8 pt-8 md:pt-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-cyan-900/50 pb-6">
          <div>
            <h1 className="text-2xl md:text-4xl font-black tracking-[0.2em] text-[#00f0ff] drop-shadow-[0_0_15px_rgba(0,240,255,0.7)] uppercase flex items-center gap-3">
              <Database className="w-8 h-8 text-cyan-400" /> AI Data Ingestion
            </h1>
            <p className="text-[10px] md:text-xs text-cyan-600 tracking-[0.3em] uppercase font-bold mt-2">
              Smart Column Mapping · Auto-Sanitization · CSV & XLSX
            </p>
          </div>
          {file && step !== 'scanning' && step !== 'sanitizing' && (
            <button onClick={reset} className="flex items-center gap-2 px-4 py-2 bg-red-950/40 border border-red-900/50 text-red-400 hover:text-red-300 hover:bg-red-900/60 transition-all rounded-lg text-[10px] uppercase tracking-widest font-bold">
              <RefreshCw className="w-3.5 h-3.5" /> Start Over
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          
          {/* ─────────────────────────────────────────────────────────────────
              STEP 1: UPLOAD
          ────────────────────────────────────────────────────────────────── */}
          {step === 'upload' && (
            <motion.div key="upload"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            >
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative group w-full p-16 md:p-24 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-6 cursor-pointer transition-all duration-500 overflow-hidden ${
                  isDragOver 
                    ? 'border-[#00f0ff] bg-cyan-950/20 shadow-[0_0_50px_rgba(0,240,255,0.15)]' 
                    : 'border-cyan-900/50 bg-[#010811]/60 hover:border-cyan-500/50 hover:bg-cyan-950/10'
                }`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.1),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFileInput} />
                <div className={`p-6 rounded-2xl border transition-all duration-500 relative z-10 ${
                  isDragOver ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.4)] scale-110' : 'bg-cyan-950/40 border-cyan-900/60 group-hover:border-cyan-500/50 group-hover:bg-cyan-950/60'
                }`}>
                  <UploadCloud className={`w-12 h-12 transition-colors duration-500 ${isDragOver ? 'text-[#00f0ff]' : 'text-cyan-700 group-hover:text-[#00f0ff]'}`} />
                </div>
                <div className="text-center relative z-10">
                  <h3 className={`text-xl font-black tracking-widest uppercase transition-colors duration-500 ${isDragOver ? 'text-[#00f0ff]' : 'text-slate-300 group-hover:text-cyan-200'}`}>
                    Drop EXCEL/CSV Here
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 flex items-center justify-center gap-3">
                    <span className="flex items-center gap-1"><FileSpreadsheet className="w-3.5 h-3.5 text-green-500/70" /> .xlsx / .xls</span>
                    <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-blue-500/70" /> .csv</span>
                  </p>
                </div>
              </div>
              
              {/* Voice Entry Button */}
              <div className="flex justify-center mt-6">
                <button 
                  onClick={toggleRecording}
                  className={`px-8 py-3 rounded-xl font-bold tracking-widest text-xs transition-all uppercase flex items-center gap-3 ${
                    isRecording 
                      ? "bg-red-950/50 border border-red-500/50 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse" 
                      : "bg-purple-950/20 border border-purple-500/50 text-purple-400 hover:bg-purple-900/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                  }`}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />} 
                  {isRecording ? "Stop Voice Tracking" : "AI Voice Entry"}
                </button>
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              STEP 2: AI SCANNING
          ────────────────────────────────────────────────────────────────── */}
          {step === 'scanning' && (
            <motion.div key="scanning"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
              className="flex flex-col items-center justify-center py-32 gap-8 relative"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1),transparent_50%)] animate-pulse pointer-events-none" />
              <div className="relative">
                <div className="absolute inset-0 border-[3px] border-purple-500/30 rounded-full animate-[spin_3s_linear_infinite]" />
                <div className="absolute inset-[-10px] border-[1px] border-cyan-500/20 rounded-full animate-[spin_4s_linear_infinite_reverse]" />
                <div className="w-24 h-24 bg-purple-950/40 rounded-full border border-purple-500/50 flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.4)] backdrop-blur-md relative z-10">
                  <Cpu className="w-10 h-10 text-[#a855f7] animate-pulse" />
                </div>
              </div>
              <div className="text-center relative z-10">
                <h3 className="text-lg font-black tracking-[0.2em] uppercase text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">
                  Neural Scan Initiated
                </h3>
                <p className="text-xs text-slate-400 mt-2 font-mono flex items-center justify-center gap-2">
                  <Activity className="w-3 h-3 text-cyan-500 animate-bounce" /> Analyzing headers...
                </p>
                <div className="w-48 h-1 bg-cyan-950/50 rounded-full mt-6 mx-auto overflow-hidden border border-cyan-900/50">
                  <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.8, ease: 'easeInOut' }}
                    className="h-full bg-gradient-to-r from-purple-500 to-[#00f0ff] shadow-[0_0_10px_#00f0ff]" />
                </div>
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              STEP 3: MAPPING
          ────────────────────────────────────────────────────────────────── */}
          {step === 'mapping' && (
            <motion.div key="mapping"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              className="flex flex-col gap-8"
            >
              <div className="flex items-start md:items-center justify-between p-4 bg-cyan-950/20 border border-cyan-900/40 rounded-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(0,240,255,0.05),transparent_60%)] pointer-events-none" />
                <div className="relative z-10 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-cyan-400 shrink-0" />
                  <div>
                    <h3 className="text-sm font-black tracking-widest uppercase text-cyan-400">File Parsed Successfully</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Detected {headers.length} columns in <span className="text-cyan-300 font-bold">{file?.name}</span></p>
                  </div>
                </div>
                <button onClick={handleConfirmMapping} className="hidden md:flex relative z-10 items-center gap-2 px-6 py-2.5 bg-purple-950/60 border border-purple-500/60 text-purple-300 rounded-xl hover:bg-purple-500 hover:text-black hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] transition-all font-bold tracking-widest text-xs uppercase group">
                  <Sparkles className="w-4 h-4 group-hover:animate-pulse" /> Sanitize & Parse Data
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
                
                {/* Auto-Mapper Config (Left, col-span-2) */}
                <div className="lg:col-span-2 glass-panel p-6 border border-cyan-900/40 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <Settings2 className="w-32 h-32 text-[#00f0ff]" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-xs font-black tracking-[0.2em] uppercase text-[#00f0ff] mb-6 flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" /> Column Auto-Mapping
                    </h3>
                    <div className="space-y-4">
                      {REQUIRED_FIELDS.map(field => {
                        const isMapped = !!mappings[field.id];
                        return (
                          <div key={field.id} className="flex flex-col gap-2 p-3 rounded-lg border bg-[#010811]/60 transition-colors hover:bg-cyan-950/20 group border-cyan-900/30">
                            <div className="flex items-center justify-between">
                              <p className="text-[11px] font-bold tracking-wider text-slate-300 uppercase flex items-center gap-2">
                                {field.label}
                                {isMapped ? (
                                  <span className="px-1.5 py-0.5 rounded text-[8px] bg-green-950/50 text-green-400 border border-green-800/50 font-black">AI MATCH</span>
                                ) : (
                                  <span className="px-1.5 py-0.5 rounded text-[8px] bg-amber-950/50 text-amber-500 border border-amber-800/50 font-black flex items-center gap-1">
                                    <AlertCircle className="w-2.5 h-2.5" /> UNMAPPED
                                  </span>
                                )}
                              </p>
                            </div>
                            <div className="relative w-full shrink-0">
                              <select 
                                value={mappings[field.id]}
                                onChange={(e) => updateMapping(field.id, e.target.value)}
                                className={`w-full appearance-none bg-[#010811] border ${
                                  isMapped ? 'border-cyan-500/50 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.1)]' : 'border-slate-800 text-slate-500'
                                } rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#00f0ff] focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all cursor-pointer`}
                              >
                                <option value="">-- Ignore Field --</option>
                                {headers.map((h, index) => (
                                  <option key={`header-${index}`} value={h}>{h || `Unnamed Column ${index + 1}`}</option>
                                ))}
                              </select>
                              <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isMapped ? 'text-cyan-500' : 'text-slate-600'}`} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Data Preview (Right, col-span-3) */}
                <div className="lg:col-span-3 glass-panel p-6 border border-purple-900/30 rounded-2xl relative overflow-hidden h-full flex flex-col">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.05),transparent_60%)] pointer-events-none" />
                  <div className="relative z-10 flex flex-col h-full flex-1">
                    <h3 className="text-xs font-black tracking-[0.2em] uppercase text-purple-400 mb-6 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Raw Data Stream Preview (Messy)
                    </h3>
                    <div className="flex-1 min-h-[300px] overflow-x-auto rounded-lg border border-purple-900/30 bg-[#010811]/80 backdrop-blur-sm custom-scrollbar">
                      <table className="w-full text-left text-[10px] font-mono whitespace-nowrap">
                        <thead className="bg-purple-950/40 border-b border-purple-900/50 sticky top-0">
                          <tr>
                            {headers.map((h, idx) => {
                              const mappedTo = Object.entries(mappings).find(([_, val]) => val === h);
                              return (
                                <th key={`${h}-${idx}`} className="p-3 font-bold">
                                  <div className="text-slate-400 uppercase tracking-widest">{h}</div>
                                  {mappedTo && (
                                    <div className="text-[#00f0ff] text-[8px] mt-1 bg-cyan-950/40 border border-cyan-800/50 px-1.5 py-0.5 rounded w-fit flex items-center gap-1">
                                      <LinkIcon className="w-2.5 h-2.5" /> {mappedTo[0]}
                                    </div>
                                  )}
                                </th>
                              );
                            })}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-purple-900/20">
                          {previewData.map((row, i) => (
                            <tr key={`row-${i}`} className="hover:bg-purple-950/20 transition-colors">
                              {row.map((cell, j) => (
                                <td key={`cell-${i}-${j}`} className={`p-3 ${!cell ? 'text-red-500/50 bg-red-950/10' : 'text-slate-400'}`}>{cell || 'NULL'}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-[9px] text-slate-500 tracking-widest uppercase mt-4 text-center">
                      Showing first {previewData.length} of {rawRows.length} messy rows
                    </p>
                  </div>
                </div>

              </div>
              <button onClick={handleConfirmMapping} className="md:hidden flex items-center justify-center gap-2 w-full py-4 bg-purple-950/60 border border-purple-500/60 text-purple-300 rounded-xl hover:bg-purple-500 hover:text-black transition-all font-black tracking-widest text-xs uppercase shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                <Sparkles className="w-4 h-4" /> Sanitise & Parse Data
              </button>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              STEP 4: SANITIZING ANIMATION
          ────────────────────────────────────────────────────────────────── */}
          {step === 'sanitizing' && (
            <motion.div key="sanitizing"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
              className="flex flex-col items-center justify-center py-32 gap-8 relative"
            >
              <div className="w-24 h-24 bg-green-950/40 rounded-xl border border-green-500/50 flex items-center justify-center shadow-[0_0_40px_rgba(0,255,102,0.4)] backdrop-blur-md relative z-10 rotate-45 animate-pulse">
                <Filter className="w-10 h-10 text-[#00ff66] -rotate-45" />
              </div>
              <div className="text-center relative z-10">
                <h3 className="text-lg font-black tracking-[0.2em] uppercase text-green-400 drop-shadow-[0_0_10px_rgba(0,255,102,0.8)]">
                  Executing Auto-Sanitizer
                </h3>
                <p className="text-xs text-slate-400 mt-2 font-mono flex items-center justify-center gap-2">
                  <RefreshCw className="w-3 h-3 text-cyan-500 animate-spin" /> Purging anomalies, nulls, and extracting pure values...
                </p>
                <div className="w-64 h-1 bg-cyan-950/50 rounded-full mt-6 mx-auto overflow-hidden border border-cyan-900/50">
                  <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2.3, ease: 'easeInOut' }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-green-400 shadow-[0_0_10px_#00ff66]" />
                </div>
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              STEP 5: SANITIZED UI
          ────────────────────────────────────────────────────────────────── */}
          {step === 'sanitized' && (
            <motion.div key="sanitized"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              className="flex flex-col gap-8"
            >
              <div className="glass-panel p-6 border border-green-500/30 rounded-2xl relative overflow-hidden bg-green-950/10 shadow-[0_0_40px_rgba(0,255,102,0.05)]">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,102,0.05),transparent_60%)] pointer-events-none" />
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-950/50 border border-green-500/50 rounded-full shadow-[0_0_15px_rgba(0,255,102,0.3)]">
                      <Sparkles className="w-8 h-8 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black tracking-widest uppercase text-green-400 drop-shadow-[0_0_10px_rgba(0,255,102,0.5)]">
                        Data Sanitized Successfully
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 font-mono">
                        Invalid rows dropped, pure floats extracted. Ready for ELEFAN.
                      </p>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center gap-4 font-mono">
                    <div className="text-center p-3 border border-red-900/30 bg-red-950/20 rounded-xl min-w-[100px]">
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest">Raw Rows</p>
                      <p className="text-xl font-black text-red-400 mt-1">{rawCount}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-600" />
                    <div className="text-center p-3 border border-green-900/30 bg-green-950/20 rounded-xl min-w-[100px] relative">
                      <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-400 animate-ping" />
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest">Clean Rows</p>
                      <p className="text-xl font-black text-green-400 mt-1">{sanitizedData.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Perfectly Structured Preview */}
              <div className="glass-panel p-6 border border-cyan-900/40 rounded-2xl relative">
                <h3 className="text-xs font-black tracking-[0.2em] uppercase text-cyan-400 mb-4 flex items-center gap-2">
                  <Database className="w-4 h-4" /> Perfected Structure Preview
                </h3>
                <div className="overflow-x-auto rounded-lg border border-cyan-900/30 bg-[#010811]/90 custom-scrollbar">
                  <table className="w-full text-left text-[11px] font-mono whitespace-nowrap">
                    <thead className="bg-cyan-950/40 border-b border-cyan-900/50 text-cyan-500 uppercase tracking-widest text-[9px]">
                      <tr>
                        <th className="p-3">Species</th>
                        <th className="p-3">Length (cm)</th>
                        <th className="p-3">Weight (g)</th>
                        <th className="p-3">Location</th>
                        <th className="p-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cyan-900/20">
                      {sanitizedData.slice(0, 8).map((row, i) => (
                        <tr key={i} className="hover:bg-cyan-950/20 transition-colors group">
                          <td className="p-3 text-[#00f0ff] font-bold">{row.species}</td>
                          <td className="p-3 text-green-400 font-black">{row.length.toFixed(1)}</td>
                          <td className="p-3 text-purple-300">{row.weight > 0 ? row.weight.toFixed(1) : '—'}</td>
                          <td className="p-3 text-slate-400">{row.location}</td>
                          <td className="p-3 text-slate-500">{row.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 flex justify-end">
                  <button onClick={handleFinalize} className="flex items-center gap-2 px-8 py-3 bg-cyan-950/60 border border-[#00f0ff]/60 text-[#00f0ff] rounded-xl hover:bg-[#00f0ff] hover:text-black transition-all font-black tracking-widest text-xs uppercase shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                    <CheckCircle2 className="w-4 h-4" /> Push to Math Engine
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              STEP 6: SUCCESS
          ────────────────────────────────────────────────────────────────── */}
          {step === 'success' && (
            <motion.div key="success"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="w-24 h-24 bg-cyan-950/40 rounded-full border border-cyan-500/50 flex items-center justify-center shadow-[0_0_40px_rgba(0,240,255,0.3)] mb-6">
                <Database className="w-10 h-10 text-cyan-400" />
              </div>
              <h3 className="text-xl font-black tracking-widest uppercase text-cyan-400 drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]">
                Data Stream Active
              </h3>
              <p className="text-xs text-slate-400 mt-3 max-w-md mx-auto leading-relaxed">
                The sanitized dataset has successfully bridged to the core Population Dynamics & ELEFAN computational engines.
              </p>
              <button onClick={reset} className="mt-8 px-6 py-3 bg-purple-950/30 border border-purple-800/50 text-purple-400 hover:bg-purple-900/50 rounded-xl transition-all font-bold text-xs tracking-widest uppercase shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                Ingest Another File
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
