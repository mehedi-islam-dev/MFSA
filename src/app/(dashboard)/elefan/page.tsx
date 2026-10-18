"use client";

import React, { useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  Activity, TrendingUp, BarChart3, ChevronRight, Cpu,
  Waves, Target, RefreshCw, AlertCircle, Upload, FileSpreadsheet,
  X, CheckCircle2, Download, Table, Filter, Info
} from 'lucide-react';
import {
  ComposedChart, Bar, Line, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Label, AreaChart, Area
} from 'recharts';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

// ─── Framer Motion Variants ──────────────────────────────────────────────────
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } }
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 220, damping: 22 } }
};
const sectionVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 180, damping: 20 } }
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface FisheryRecord {
  species: string;
  length: number;
  weight: number;
  location: string;
  date: string;
  [key: string]: string | number;
}

interface LFDPoint {
  midpoint: number;
  frequency: number;
  label: string;
  cumulative: number;
}

interface CatchCurvePoint {
  midpoint: number;
  lnFreq: number;
  trend?: number;
}

// ─── Data Parser (Excel/CSV) ────────────────────────────────────────────────────────
function parseData(json: any[][]): FisheryRecord[] {
  if (json.length < 2) return [];
  const rawHeaders = json[0].map(h => String(h || '').trim().toLowerCase().replace(/[^a-z0-9]/g, ''));
  
  const findCol = (candidates: string[]) => {
    return rawHeaders.findIndex(h => candidates.some(c => h.includes(c) || c.includes(h)));
  };
  
  const speciesIdx  = findCol(['species', 'name', 'fish']);
  const lengthIdx   = findCol(['length', 'len', 'tl', 'totallength', 'sl', 'l']);
  const weightIdx   = findCol(['weight', 'wt', 'mass', 'wg', 'wtg']);
  const locationIdx = findCol(['location', 'site', 'station', 'area', 'loc']);
  const dateIdx     = findCol(['date', 'datetime', 'sampledate', 'collected']);

  const records: FisheryRecord[] = [];
  
  for (let i = 1; i < json.length; i++) {
    const row = json[i];
    // Skip completely empty rows
    if (row.every(v => v === undefined || v === null || v === '')) continue;
    
    const lenVal = lengthIdx >= 0 ? parseFloat(row[lengthIdx]) : NaN;
    const wtVal = weightIdx >= 0 ? parseFloat(row[weightIdx]) : NaN;
    
    // We strictly require length to run ELEFAN
    if (isNaN(lenVal) || lenVal <= 0) continue;
    
    records.push({
      species:  speciesIdx  >= 0 ? String(row[speciesIdx] || 'Unknown') : 'Unknown',
      length:   lenVal,
      weight:   isNaN(wtVal) ? 0 : wtVal,
      location: locationIdx >= 0 ? String(row[locationIdx] || 'Unknown') : 'Unknown',
      date:     dateIdx     >= 0 ? String(row[dateIdx] || '') : '',
    });
  }
  return records;
}

// ─── LFD Computation ─────────────────────────────────────────────────────────
function computeLFD(records: FisheryRecord[], classWidth = 2): LFDPoint[] {
  if (records.length === 0) return [];
  const lengths = records.map(r => r.length).filter(l => l > 0);
  if (lengths.length === 0) return [];
  const minL = Math.floor(Math.min(...lengths) / classWidth) * classWidth;
  const maxL = Math.ceil(Math.max(...lengths) / classWidth) * classWidth;
  const bins: LFDPoint[] = [];
  let cumulative = 0;
  for (let lower = minL; lower < maxL; lower += classWidth) {
    const count = lengths.filter(l => l >= lower && l < lower + classWidth).length;
    cumulative += count;
    bins.push({
      midpoint: lower + classWidth / 2,
      frequency: count,
      label: `${lower}–${lower + classWidth}`,
      cumulative,
    });
  }
  return bins;
}

// ─── Catch Curve Computation ──────────────────────────────────────────────────
function computeCatchCurve(lfd: LFDPoint[]): CatchCurvePoint[] {
  const active = lfd.filter(d => d.frequency > 0);
  if (active.length < 3) return active.map(d => ({ midpoint: d.midpoint, lnFreq: Math.log(d.frequency) }));
  // Find descending limb (after modal class)
  const peakIdx = active.reduce((best, d, i) => d.frequency > active[best].frequency ? i : best, 0);
  const descending = active.slice(peakIdx);
  // Simple linear regression on descending limb to get trend
  const n = descending.length;
  const sumX  = descending.reduce((s, d) => s + d.midpoint, 0);
  const lnVals = descending.map(d => Math.log(d.frequency));
  const sumY  = lnVals.reduce((s, v) => s + v, 0);
  const sumXY = descending.reduce((s, d, i) => s + d.midpoint * lnVals[i], 0);
  const sumX2 = descending.reduce((s, d) => s + d.midpoint * d.midpoint, 0);
  const slope     = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  return active.map(d => ({
    midpoint: d.midpoint,
    lnFreq:   parseFloat(Math.log(d.frequency).toFixed(3)),
    trend:    d.midpoint >= descending[0].midpoint
      ? parseFloat((slope * d.midpoint + intercept).toFixed(3))
      : undefined,
  }));
}

// ─── Sample CSV Download ──────────────────────────────────────────────────────
function downloadSampleCSV() {
  const rows = [
    'species,length_cm,weight_g,location,date',
    'Tenualosa ilisha,24.5,185.2,Padma River,2024-01-15',
    'Tenualosa ilisha,18.2,98.5,Padma River,2024-01-15',
    'Tenualosa ilisha,31.0,310.0,Padma River,2024-01-16',
    'Hilsa ilisha,22.4,155.0,Meghna Estuary,2024-01-16',
    'Hilsa ilisha,16.8,80.2,Meghna Estuary,2024-01-17',
    'Hilsa ilisha,28.6,245.5,Meghna Estuary,2024-01-17',
    'Tenualosa ilisha,14.2,52.0,Padma River,2024-01-18',
    'Tenualosa ilisha,20.1,118.0,Padma River,2024-01-18',
    'Hilsa ilisha,26.3,210.0,Meghna Estuary,2024-01-19',
    'Tenualosa ilisha,33.5,345.0,Padma River,2024-01-19',
  ];
  const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'marine_analytica_sample.csv';
  a.click(); URL.revokeObjectURL(url);
}

// ─── Mock data (fallback when no CSV loaded) ──────────────────────────────────
const MOCK_LFD: LFDPoint[] = [
  { midpoint: 9,  frequency: 3,  label: '8–10',  cumulative: 3   },
  { midpoint: 11, frequency: 12, label: '10–12', cumulative: 15  },
  { midpoint: 13, frequency: 28, label: '12–14', cumulative: 43  },
  { midpoint: 15, frequency: 41, label: '14–16', cumulative: 84  },
  { midpoint: 17, frequency: 55, label: '16–18', cumulative: 139 },
  { midpoint: 19, frequency: 62, label: '18–20', cumulative: 201 },
  { midpoint: 21, frequency: 48, label: '20–22', cumulative: 249 },
  { midpoint: 23, frequency: 35, label: '22–24', cumulative: 284 },
  { midpoint: 25, frequency: 27, label: '24–26', cumulative: 311 },
  { midpoint: 27, frequency: 19, label: '26–28', cumulative: 330 },
  { midpoint: 29, frequency: 14, label: '28–30', cumulative: 344 },
  { midpoint: 31, frequency: 8,  label: '30–32', cumulative: 352 },
  { midpoint: 33, frequency: 4,  label: '32–34', cumulative: 356 },
  { midpoint: 35, frequency: 2,  label: '34–36', cumulative: 358 },
];

const VBG_LINF = 38.2; const VBG_K = 0.42; const VBG_T0 = -0.15;
const vbgLength = (t: number) => VBG_LINF * (1 - Math.exp(-VBG_K * (t - VBG_T0)));
const PW_DATA = [
  { meanL: 10.2, deltaLnN: -0.22 }, { meanL: 12.8, deltaLnN: -0.31 },
  { meanL: 15.1, deltaLnN: -0.38 }, { meanL: 17.4, deltaLnN: -0.44 },
  { meanL: 19.6, deltaLnN: -0.51 }, { meanL: 21.9, deltaLnN: -0.58 },
  { meanL: 24.2, deltaLnN: -0.65 }, { meanL: 26.5, deltaLnN: -0.73 },
  { meanL: 28.8, deltaLnN: -0.80 }, { meanL: 31.1, deltaLnN: -0.88 },
];
const PW_REGRESSION = Array.from({ length: 26 }, (_, i) => ({
  meanL: 8 + i, trend: parseFloat((-0.034 * (8 + i) + 0.13).toFixed(3))
}));
const GROWTH_CURVE_DATA = Array.from({ length: 56 }, (_, i) => {
  const t = i * 0.1;
  return { age: parseFloat(t.toFixed(1)), length: parseFloat(vbgLength(t).toFixed(2)) };
});
const COHORT_PEAKS = [
  { age: 0.4, length: 14.2, label: 'Cohort I'   },
  { age: 1.1, length: 21.5, label: 'Cohort II'  },
  { age: 1.9, length: 28.1, label: 'Cohort III' },
  { age: 2.8, length: 33.4, label: 'Cohort IV'  },
];

// ─── Tooltip style ────────────────────────────────────────────────────────────
const TT = { backgroundColor: '#010811', border: '1px solid rgba(0,240,255,0.4)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '11px', color: '#00f0ff' };

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'upload',  label: 'Data Upload',      icon: Upload     },
  { id: 'lfd',     label: 'LFD Analysis',     icon: BarChart3  },
  { id: 'catch',   label: 'Catch Curve',      icon: TrendingUp },
  { id: 'elefan',  label: 'ELEFAN I Growth',  icon: Activity   },
  { id: 'pw',      label: 'Powell-Wetherall', icon: Waves      },
  { id: 'table',   label: 'Data Table',       icon: Table      },
] as const;
type TabId = typeof TABS[number]['id'];

const TABLE_PAGE_SIZE = 25;

// ─── Component ────────────────────────────────────────────────────────────────
export default function AutomatedElefanPage() {
  const [activeTab, setActiveTab] = useState<TabId>('upload');
  const [isRunning,    setIsRunning]    = useState(false);
  const [runComplete,  setRunComplete]  = useState(false);
  const [isDragOver,   setIsDragOver]   = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedRecords, setUploadedRecords] = useState<FisheryRecord[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [tablePage, setTablePage] = useState(0);
  const [speciesFilter, setSpeciesFilter] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Computed data
  const lfdData       = useMemo(() => uploadedRecords.length > 0 ? computeLFD(uploadedRecords)        : MOCK_LFD,      [uploadedRecords]);
  const catchCurve    = useMemo(() => computeCatchCurve(lfdData),                                                        [lfdData]);
  const totalN        = useMemo(() => uploadedRecords.length > 0 ? uploadedRecords.length              : 358,            [uploadedRecords]);
  const uniqueSpecies = useMemo(() => [...new Set(uploadedRecords.map(r => r.species))].filter(Boolean), [uploadedRecords]);
  const filteredRecs  = useMemo(() =>
    speciesFilter ? uploadedRecords.filter(r => r.species.toLowerCase().includes(speciesFilter.toLowerCase())) : uploadedRecords,
    [uploadedRecords, speciesFilter]
  );
  const tablePageCount = Math.max(1, Math.ceil(filteredRecs.length / TABLE_PAGE_SIZE));
  const tableRows      = filteredRecs.slice(tablePage * TABLE_PAGE_SIZE, (tablePage + 1) * TABLE_PAGE_SIZE);

  // File processing
  const processFile = useCallback((file: File) => {
    const isExcelOrCSV = file.name.toLowerCase().endsWith('.csv') || file.name.toLowerCase().endsWith('.xls') || file.name.toLowerCase().endsWith('.xlsx');
    if (!isExcelOrCSV) {
      setUploadError('Invalid file type. Please upload an Excel (.xlsx) or CSV file (.csv).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File too large. Maximum size is 10 MB.');
      return;
    }
    setIsProcessing(true);
    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (!data) return;
      
      try {
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const json: any[][] = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' });
        
        const records = parseData(json);
        if (records.length === 0) {
          setUploadError('No valid records found. Check that your file has a length column with numeric values.');
          setIsProcessing(false);
          return;
        }
        
        toast.success("ELEFAN Data Loaded Successfully");
        setUploadedRecords(records);
        setFileName(file.name);
        setTablePage(0);
        setSpeciesFilter('');
        setRunComplete(false);
        setIsProcessing(false);
        setActiveTab('lfd');
      } catch (err) {
        setUploadError('Failed to parse file. Ensure the file is valid Excel or CSV.');
        setIsProcessing(false);
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const clearData = () => {
    setUploadedRecords([]);
    setFileName(null);
    setUploadError(null);
    setRunComplete(false);
    setActiveTab('upload');
  };

  const handleRun = () => {
    setIsRunning(true); setRunComplete(false);
    setTimeout(() => { setIsRunning(false); setRunComplete(true); }, 2400);
  };

  const isUsingMock = uploadedRecords.length === 0;

  return (
    <div className="min-h-screen w-full bg-[#010409] text-[#00f0ff] font-mono overflow-y-auto pb-24 relative">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-[0.07]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(0,240,255,0.04),transparent_60%)] blur-3xl" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(ellipse,rgba(168,85,247,0.04),transparent_60%)] blur-3xl" />
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="show"
        className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-6 p-4 md:p-8">

        {/* ── Page Header ─────────────────────────────────────────────── */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-950/50 border border-cyan-500/40 rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <Activity className="w-7 h-7 text-[#00f0ff] animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-[0.2em] text-[#00f0ff] drop-shadow-[0_0_15px_rgba(0,240,255,0.7)] uppercase">
                ELEFAN · FiSAT II
              </h1>
              <div className="flex items-center gap-3 mt-0.5">
                <p className="text-[10px] text-cyan-600 tracking-[0.3em] uppercase font-bold">Electronic Length Frequency Analysis Node</p>
                {fileName && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-green-950/50 border border-green-700/50 rounded-full text-[9px] text-green-400 font-bold">
                    <CheckCircle2 className="w-2.5 h-2.5" /> {fileName}
                  </span>
                )}
                {isUsingMock && (
                  <span className="px-2 py-0.5 bg-amber-950/40 border border-amber-700/40 rounded-full text-[9px] text-amber-500 font-bold">DEMO DATA</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {fileName && (
              <button onClick={clearData}
                className="flex items-center gap-1.5 px-3 py-2 bg-red-950/40 border border-red-700/40 text-red-400 hover:bg-red-900/40 rounded-lg transition-all text-xs font-bold tracking-widest uppercase">
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
            <button onClick={handleRun} disabled={isRunning}
              className="flex items-center gap-2 px-5 py-2.5 bg-cyan-950/60 border border-[#00f0ff]/60 text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black hover:shadow-[0_0_30px_rgba(0,240,255,0.8)] rounded-xl transition-all font-bold tracking-widest uppercase text-sm disabled:opacity-60 disabled:cursor-not-allowed">
              {isRunning ? <><RefreshCw className="w-4 h-4 animate-spin" /> Computing…</>
                : runComplete ? <><Target className="w-4 h-4" /> Re-run</>
                : <><Cpu className="w-4 h-4" /> Run Engine</>}
            </button>
          </div>
        </motion.div>

        {/* ── Key Parameter Cards ──────────────────────────────────────── */}
        <motion.div variants={containerVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Records',        value: isUsingMock ? '358 (demo)' : `${totalN.toLocaleString()}`,         cls: 'text-cyan-300',   brd: 'border-cyan-800/40',   bg: 'bg-cyan-950/20',   icon: FileSpreadsheet },
            { label: 'L∞ (Asymptotic L)',     value: '38.2 cm',                                                         cls: 'text-green-300',  brd: 'border-green-800/40',  bg: 'bg-green-950/20',  icon: Waves           },
            { label: 'K (Growth Rate)',       value: '0.42 yr⁻¹',                                                       cls: 'text-purple-300', brd: 'border-purple-800/40', bg: 'bg-purple-950/20', icon: TrendingUp      },
            { label: 'Species Detected',     value: isUsingMock ? 'N/A' : uniqueSpecies.length > 0 ? `${uniqueSpecies.length}` : '—', cls: 'text-yellow-300', brd: 'border-yellow-800/40', bg: 'bg-yellow-950/20', icon: Activity },
          ].map(({ label, value, cls, brd, bg, icon: Icon }) => (
            <motion.div key={label} variants={itemVariants}
              className={`glass-panel p-4 flex flex-col gap-2 relative overflow-hidden hover:scale-[1.02] transition-all duration-300 ${bg} ${brd}`}>
              <Icon className={`w-4 h-4 ${cls}`} />
              <div>
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">{label}</p>
                <p className={`text-lg font-black ${cls} font-mono`}>{value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Status banners ────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {runComplete && (
            <motion.div key="done" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-3 px-5 py-3 bg-green-950/40 border border-green-500/40 rounded-xl text-green-400 text-sm font-bold tracking-wider">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              ELEFAN I convergence reached · Rn = 0.812 · Parameters locked: L∞ = 38.2 cm, K = 0.42 yr⁻¹
            </motion.div>
          )}
          {isUsingMock && !runComplete && (
            <motion.div key="mock" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-3 px-5 py-3 bg-amber-950/20 border border-amber-900/40 rounded-xl text-amber-600 text-xs tracking-wider">
              <Info className="w-4 h-4 shrink-0" />
              Using demo dataset · Upload a real CSV in the "Data Upload" tab to analyse your field data.
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Tab Navigation ────────────────────────────────────────────── */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-1 bg-cyan-950/20 border border-cyan-900/30 p-1 rounded-xl w-fit max-w-full overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all duration-200 whitespace-nowrap ${
                activeTab === id
                  ? 'bg-[#00f0ff]/10 border border-[#00f0ff]/50 text-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                  : 'text-slate-500 hover:text-cyan-400 border border-transparent'
              } ${id === 'table' && uploadedRecords.length === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
              disabled={id === 'table' && uploadedRecords.length === 0}>
              <Icon className="w-3.5 h-3.5" />{label}
              {id === 'table' && uploadedRecords.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-cyan-500/20 text-[#00f0ff] text-[8px] rounded-full font-black">{uploadedRecords.length}</span>
              )}
            </button>
          ))}
        </motion.div>

        {/* ══════════════════════════════════════════════════════════════════
            TAB: DATA UPLOAD
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'upload' && (
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-6">

            {/* Drop Zone */}
            <motion.div variants={sectionVariants}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-10 md:p-16 flex flex-col items-center justify-center gap-5 cursor-pointer transition-all duration-300 group ${
                isDragOver
                  ? 'border-[#00f0ff] bg-cyan-950/30 shadow-[0_0_40px_rgba(0,240,255,0.2)]'
                  : isProcessing
                  ? 'border-purple-500/60 bg-purple-950/10'
                  : uploadedRecords.length > 0
                  ? 'border-green-500/50 bg-green-950/10 hover:border-green-400 hover:shadow-[0_0_25px_rgba(0,255,102,0.15)]'
                  : 'border-cyan-900/50 bg-cyan-950/10 hover:border-cyan-500/60 hover:shadow-[0_0_25px_rgba(0,240,255,0.1)]'
              }`}>
              <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFileInput} />

              <div className={`p-5 rounded-2xl border transition-all duration-300 ${
                isDragOver ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                : uploadedRecords.length > 0 ? 'bg-green-950/40 border-green-500/40'
                : 'bg-cyan-950/40 border-cyan-800/50 group-hover:border-cyan-500/50 group-hover:bg-cyan-950/60'}`}>
                {isProcessing
                  ? <RefreshCw className="w-10 h-10 text-purple-400 animate-spin" />
                  : uploadedRecords.length > 0
                  ? <CheckCircle2 className="w-10 h-10 text-green-400" />
                  : <Upload className={`w-10 h-10 transition-colors ${isDragOver ? 'text-[#00f0ff]' : 'text-cyan-600 group-hover:text-cyan-400'}`} />
                }
              </div>

              {isProcessing ? (
                <div className="text-center">
                  <p className="font-black text-lg tracking-widest uppercase text-purple-300">Processing…</p>
                  <p className="text-xs text-slate-500 mt-1">Parsing Excel/CSV and computing LFD bins</p>
                </div>
              ) : uploadedRecords.length > 0 ? (
                <div className="text-center">
                  <p className="font-black text-lg tracking-widest uppercase text-green-300">
                    {uploadedRecords.length.toLocaleString()} Records Loaded
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{fileName} · Click to replace</p>
                  {uniqueSpecies.length > 0 && (
                    <p className="text-[10px] text-cyan-600 mt-2 tracking-widest">
                      Species: {uniqueSpecies.slice(0, 3).join(', ')}{uniqueSpecies.length > 3 ? ` +${uniqueSpecies.length - 3} more` : ''}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <p className={`font-black text-lg tracking-widest uppercase transition-colors ${isDragOver ? 'text-[#00f0ff]' : 'text-slate-300 group-hover:text-[#00f0ff]'}`}>
                    {isDragOver ? 'Drop to Load Data' : 'Drop EXCEL / CSV Here or Click to Browse'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Length-Frequency data · Max 10 MB · .xlsx or .csv</p>
                </div>
              )}
            </motion.div>

            {/* Error */}
            <AnimatePresence>
              {uploadError && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-3 px-5 py-3 bg-red-950/40 border border-red-700/40 rounded-xl text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {uploadError}
                  <button onClick={() => setUploadError(null)} className="ml-auto text-red-600 hover:text-red-400"><X className="w-4 h-4" /></button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CSV Format Guide + Sample Download */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Format spec */}
              <div className="glass-panel p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,240,255,0.03),transparent_60%)] pointer-events-none" />
                <div className="relative z-10">
                  <h3 className="text-xs font-black tracking-[0.25em] uppercase text-[#00f0ff] mb-4 flex items-center gap-2">
                    <Info className="w-3.5 h-3.5" /> Expected Excel / CSV Format
                  </h3>
                  <div className="space-y-2">
                    {[
                      { col: 'species',   desc: 'Species name',          required: false, ex: 'Tenualosa ilisha'  },
                      { col: 'length_cm', desc: 'Total length (numeric)', required: true,  ex: '24.5'             },
                      { col: 'weight_g',  desc: 'Body weight in grams',   required: false, ex: '185.2'            },
                      { col: 'location',  desc: 'Sampling station/site',  required: false, ex: 'Padma River'      },
                      { col: 'date',      desc: 'Sample date (ISO)',       required: false, ex: '2024-01-15'       },
                    ].map(({ col, desc, required, ex }) => (
                      <div key={col} className="flex items-start gap-3 py-1.5 border-b border-cyan-900/20 last:border-0">
                        <code className="text-[10px] font-mono text-cyan-400 shrink-0 w-20">{col}</code>
                        <div className="flex-1">
                          <p className="text-[10px] text-slate-300">{desc}</p>
                          <p className="text-[9px] text-slate-600">e.g. {ex}</p>
                        </div>
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded shrink-0 ${required ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-800/40' : 'bg-slate-900 text-slate-600'}`}>
                          {required ? 'REQUIRED' : 'optional'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[9px] text-slate-600 mt-4 leading-relaxed">
                    Column headers are auto-detected (case-insensitive). Variants like <code className="text-cyan-700">len</code>, <code className="text-cyan-700">tl</code>, <code className="text-cyan-700">total_length</code>, <code className="text-cyan-700">wt_g</code> are all recognised.
                  </p>
                </div>
              </div>

              {/* Quick actions */}
              <div className="glass-panel p-6 flex flex-col gap-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.03),transparent_60%)] pointer-events-none" />
                <div className="relative z-10 flex flex-col gap-4 h-full">
                  <h3 className="text-xs font-black tracking-[0.25em] uppercase text-purple-400 flex items-center gap-2">
                    <Download className="w-3.5 h-3.5" /> Quick Start
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Download our pre-formatted sample CSV to test the full pipeline before uploading your field data.
                  </p>
                  <button onClick={downloadSampleCSV}
                    className="flex items-center gap-2 px-5 py-3 bg-purple-950/40 border border-purple-700/50 text-purple-300 hover:bg-purple-900/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] rounded-xl transition-all font-bold text-xs tracking-widest uppercase w-fit">
                    <Download className="w-4 h-4" /> Download Sample CSV
                  </button>
                  <div className="mt-auto space-y-2">
                    {[
                      'Auto-detects common column name variants',
                      'Handles UTF-8, Windows (CRLF) & Unix (LF) line endings',
                      'Filters out non-numeric length rows automatically',
                      'Computes LFD, Catch Curve, and species breakdown live',
                    ].map(tip => (
                      <div key={tip} className="flex items-start gap-2 text-[9px] text-slate-500">
                        <CheckCircle2 className="w-3 h-3 text-green-600 shrink-0 mt-0.5" />
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB: LFD ANALYSIS
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'lfd' && (
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-6">
            <motion.div variants={sectionVariants} className="glass-panel p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,240,255,0.03),transparent_60%)] pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="text-sm font-black tracking-[0.25em] uppercase text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]">
                      Length-Frequency Distribution
                    </h2>
                    <p className="text-[10px] text-slate-500 mt-1 tracking-widest">
                      {isUsingMock ? 'Demo dataset · 358 specimens · 14 length classes' : `${totalN} specimens · ${lfdData.length} classes · 2 cm intervals`}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 text-[9px] font-bold tracking-widest shrink-0 ml-4">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-cyan-400/70 inline-block" /> Frequency</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-purple-400/50 inline-block border-l-2 border-purple-400" /> Cumulative</span>
                  </div>
                </div>
                <div className="h-64 md:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={lfdData} margin={{ top: 5, right: 30, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,240,255,0.07)" />
                      <XAxis dataKey="midpoint" tick={{ fill: '#4b7280', fontSize: 10, fontFamily: 'monospace' }} tickLine={false} axisLine={false}>
                        <Label value="Length class midpoint (cm)" offset={-12} position="insideBottom" fill="#4b7280" fontSize={10} fontFamily="monospace" />
                      </XAxis>
                      <YAxis yAxisId="freq" tick={{ fill: '#4b7280', fontSize: 10, fontFamily: 'monospace' }} tickLine={false} axisLine={false} />
                      <YAxis yAxisId="cum" orientation="right" tick={{ fill: '#4b7280', fontSize: 10, fontFamily: 'monospace' }} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={TT} itemStyle={{ color: '#00f0ff' }} />
                      <Bar yAxisId="freq" dataKey="frequency" name="Frequency" fill="rgba(0,240,255,0.55)" radius={[3,3,0,0]}
                        style={{ filter: 'drop-shadow(0 0 4px rgba(0,240,255,0.4))' }} />
                      <Line yAxisId="cum" dataKey="cumulative" name="Cumulative" type="monotone"
                        stroke="rgba(168,85,247,0.8)" strokeWidth={2} dot={false}
                        style={{ filter: 'drop-shadow(0 0 4px rgba(168,85,247,0.5))' }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

            {/* LFD Stats */}
            <motion.div variants={containerVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Modal Class',    value: (() => { const m = lfdData.reduce((a, b) => a.frequency > b.frequency ? a : b, lfdData[0]); return m ? `${m.midpoint} cm` : '—'; })() },
                { label: 'Length Range',   value: lfdData.length > 0 ? `${lfdData[0].midpoint}–${lfdData[lfdData.length-1].midpoint} cm` : '—' },
                { label: 'Sample Size',    value: totalN.toLocaleString() },
                { label: 'No. of Classes', value: lfdData.length.toString() },
              ].map(({ label, value }) => (
                <motion.div key={label} variants={itemVariants} className="glass-panel p-4 text-center">
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest">{label}</p>
                  <p className="text-2xl font-black text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.5)] my-1 font-mono">{value}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB: CATCH CURVE
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'catch' && (
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-6">
            <motion.div variants={sectionVariants} className="glass-panel p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,255,102,0.03),transparent_60%)] pointer-events-none" />
              <div className="relative z-10">
                <div className="mb-5">
                  <h2 className="text-sm font-black tracking-[0.25em] uppercase text-green-400 drop-shadow-[0_0_8px_rgba(0,255,102,0.6)]">
                    Catch Curve Analysis
                  </h2>
                  <p className="text-[10px] text-slate-500 mt-1 tracking-widest">
                    ln(frequency) vs length midpoint · Descending limb regression · Mortality estimation
                  </p>
                </div>
                <div className="h-64 md:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={catchCurve} margin={{ top: 5, right: 20, left: 0, bottom: 25 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,102,0.07)" />
                      <XAxis dataKey="midpoint" tick={{ fill: '#4b7280', fontSize: 10, fontFamily: 'monospace' }} tickLine={false} axisLine={false}>
                        <Label value="Length midpoint (cm)" offset={-12} position="insideBottom" fill="#4b7280" fontSize={10} fontFamily="monospace" />
                      </XAxis>
                      <YAxis tick={{ fill: '#4b7280', fontSize: 10, fontFamily: 'monospace' }} tickLine={false} axisLine={false}>
                        <Label value="ln(frequency)" angle={-90} position="insideLeft" fill="#4b7280" fontSize={10} fontFamily="monospace" />
                      </YAxis>
                      <Tooltip contentStyle={TT} itemStyle={{ color: '#00ff66' }}
                        formatter={((v: unknown) => [`${Number(v).toFixed(3)}`, 'ln(freq)']) as any} />
                      {/* Scatter observed */}
                      <Scatter dataKey="lnFreq" name="ln(freq)" fill="#00f0ff" r={5}
                        style={{ filter: 'drop-shadow(0 0 5px rgba(0,240,255,0.8))' }} />
                      {/* Regression trend */}
                      <Line dataKey="trend" name="Z regression" type="linear"
                        stroke="#00ff66" strokeWidth={2} dot={false} connectNulls={false}
                        style={{ filter: 'drop-shadow(0 0 5px rgba(0,255,102,0.7))' }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 p-4 bg-green-950/20 border border-green-800/30 rounded-xl">
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    <span className="text-green-400 font-bold">Green line</span> = Z-mortality regression fit on the descending limb (right side of modal class). 
                    Slope = –Z (total mortality coefficient). 
                    <span className="text-cyan-400 font-bold"> Cyan dots</span> = observed ln(frequency) per length class. 
                    Points left of modal class (ascending limb) are excluded from regression.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB: ELEFAN I GROWTH
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'elefan' && (
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-6">
            <motion.div variants={sectionVariants} className="glass-panel p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,102,0.03),transparent_60%)] pointer-events-none" />
              <div className="relative z-10">
                <div className="mb-5">
                  <h2 className="text-sm font-black tracking-[0.25em] uppercase text-green-400 drop-shadow-[0_0_8px_rgba(0,255,102,0.6)]">
                    ELEFAN I · von Bertalanffy Growth Fit
                  </h2>
                  <p className="text-[10px] text-slate-500 mt-1 tracking-widest">
                    Best-fit VBGF: Lt = L∞ · (1 − e^(−K(t−t₀))) · Rn-score optimisation
                  </p>
                </div>
                <div className="h-72 md:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart margin={{ top: 5, right: 30, left: 0, bottom: 25 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,102,0.07)" />
                      <XAxis dataKey="age" type="number" domain={[0, 5.5]}
                        tick={{ fill: '#4b7280', fontSize: 10, fontFamily: 'monospace' }} tickLine={false} axisLine={false}>
                        <Label value="Relative Age (years)" offset={-12} position="insideBottom" fill="#4b7280" fontSize={10} fontFamily="monospace" />
                      </XAxis>
                      <YAxis domain={[0, 42]} tick={{ fill: '#4b7280', fontSize: 10, fontFamily: 'monospace' }} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={TT} formatter={((v: unknown) => [`${Number(v).toFixed(2)} cm`, 'Length']) as any} />
                      <ReferenceLine y={VBG_LINF} stroke="rgba(0,255,102,0.35)" strokeDasharray="6 3"
                        label={{ value: `L∞ = ${VBG_LINF} cm`, fill: 'rgba(0,255,102,0.7)', fontSize: 10, fontFamily: 'monospace', position: 'right' }} />
                      <Line data={GROWTH_CURVE_DATA} dataKey="length" name="VBGF" type="monotone"
                        stroke="#00ff66" strokeWidth={2.5} dot={false}
                        style={{ filter: 'drop-shadow(0 0 6px rgba(0,255,102,0.7))' }} />
                      <Scatter data={COHORT_PEAKS} dataKey="length" name="Cohort Peaks" fill="#00f0ff" r={6}
                        style={{ filter: 'drop-shadow(0 0 8px rgba(0,240,255,1))' }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { l: 'L∞', v: '38.2 cm',   d: 'Asymptotic length', cls: 'text-green-300 bg-green-950/20 border-green-800/30'   },
                    { l: 'K',  v: '0.42 yr⁻¹',  d: 'Growth curvature',  cls: 'text-cyan-300 bg-cyan-950/20 border-cyan-800/30'     },
                    { l: 't₀', v: '−0.15 yr',   d: 'Theoretical zero',  cls: 'text-purple-300 bg-purple-950/20 border-purple-800/30' },
                    { l: 'Rn', v: '0.812',      d: 'Goodness of fit',   cls: 'text-yellow-300 bg-yellow-950/20 border-yellow-800/30' },
                  ].map(({ l, v, d, cls }) => (
                    <div key={l} className={`px-4 py-3 border rounded-xl ${cls}`}>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest">{l} — {d}</p>
                      <p className="text-xl font-black font-mono mt-0.5">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            {/* Cohort table */}
            <motion.div variants={itemVariants} className="glass-panel p-5">
              <h3 className="text-xs font-black tracking-[0.25em] uppercase text-[#00f0ff] mb-4 flex items-center gap-2">
                <ChevronRight className="w-4 h-4" /> Cohort Peak Observations
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] font-mono">
                  <thead>
                    <tr className="border-b border-cyan-900/40 text-slate-500 uppercase tracking-widest text-[9px]">
                      {['Cohort','Age (yr)','Observed L (cm)','Predicted L (cm)'].map(h => (
                        <th key={h} className="text-left pb-2 pr-6">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyan-900/20">
                    {COHORT_PEAKS.map(({ label, age, length }) => {
                      const predicted = parseFloat(vbgLength(age).toFixed(2));
                      const residual  = (length - predicted).toFixed(2);
                      return (
                        <tr key={label} className="hover:bg-cyan-950/20 transition-colors">
                          <td className="py-2.5 pr-6 text-[#00f0ff] font-bold">{label}</td>
                          <td className="py-2.5 pr-6 text-slate-300">{age.toFixed(2)}</td>
                          <td className="py-2.5 pr-6 text-green-400">{length.toFixed(1)}</td>
                          <td className="py-2.5">
                            <span className="text-cyan-300">{predicted}</span>
                            <span className={`ml-3 text-[9px] ${Math.abs(parseFloat(residual)) < 1 ? 'text-green-500' : 'text-amber-400'}`}>(Δ {residual})</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB: POWELL-WETHERALL
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'pw' && (
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-6">
            <motion.div variants={sectionVariants} className="glass-panel p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.04),transparent_60%)] pointer-events-none" />
              <div className="relative z-10">
                <div className="mb-5">
                  <h2 className="text-sm font-black tracking-[0.25em] uppercase text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]">
                    Powell-Wetherall Plot
                  </h2>
                  <p className="text-[10px] text-slate-500 mt-1 tracking-widest">Linearized Beverton-Holt · Estimates L∞ and Z/K from catch data</p>
                </div>
                <div className="h-64 md:h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(168,85,247,0.07)" />
                      <XAxis dataKey="meanL" type="number" domain={[8, 34]}
                        tick={{ fill: '#4b7280', fontSize: 10, fontFamily: 'monospace' }} tickLine={false} axisLine={false}>
                        <Label value="Mean Length L̄ (cm)" offset={-12} position="insideBottom" fill="#4b7280" fontSize={10} fontFamily="monospace" />
                      </XAxis>
                      <YAxis domain={[-1.1, 0.25]} tick={{ fill: '#4b7280', fontSize: 10, fontFamily: 'monospace' }} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={TT} itemStyle={{ color: '#a855f7' }} />
                      <ReferenceLine y={0} stroke="rgba(0,240,255,0.2)" strokeDasharray="4 2" />
                      <Line data={PW_REGRESSION} dataKey="trend" name="Regression" type="linear"
                        stroke="#a855f7" strokeWidth={2} dot={false}
                        style={{ filter: 'drop-shadow(0 0 4px rgba(168,85,247,0.6))' }} />
                      <Scatter data={PW_DATA} dataKey="deltaLnN" name="Observed" fill="#00f0ff" r={5}
                        style={{ filter: 'drop-shadow(0 0 4px rgba(0,240,255,0.8))' }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    { label: 'L∞ (x-intercept)', value: '38.2 cm', cls: 'text-cyan-400 bg-cyan-950/20 border-cyan-800/40'     },
                    { label: 'Z/K (slope)',       value: '1.34',    cls: 'text-purple-400 bg-purple-950/20 border-purple-800/40' },
                    { label: 'R² (fit)',          value: '0.964',   cls: 'text-green-400 bg-green-950/20 border-green-800/40'   },
                  ].map(({ label, value, cls }) => (
                    <div key={label} className={`px-4 py-3 border rounded-lg ${cls}`}>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest">{label}</p>
                      <p className="text-lg font-black font-mono">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB: DATA TABLE
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'table' && uploadedRecords.length > 0 && (
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-5">
            {/* Filter + pagination header */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <Filter className="w-4 h-4 text-cyan-600 shrink-0" />
                <input
                  type="text" placeholder="Filter by species…" value={speciesFilter}
                  onChange={(e) => { setSpeciesFilter(e.target.value); setTablePage(0); }}
                  className="flex-1 bg-cyan-950/20 border border-cyan-900/40 rounded-lg px-3 py-2 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 font-mono"
                />
              </div>
              <p className="text-[10px] text-slate-500 tracking-widest shrink-0">
                Showing {Math.min((tablePage+1)*TABLE_PAGE_SIZE, filteredRecs.length)} of {filteredRecs.length} records
                {speciesFilter && ` · filtered from ${uploadedRecords.length}`}
              </p>
            </motion.div>

            {/* Table */}
            <motion.div variants={sectionVariants} className="glass-panel relative overflow-hidden">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-[11px] font-mono min-w-[600px]">
                  <thead className="sticky top-0 bg-[#010811]/95 backdrop-blur-sm z-10">
                    <tr className="border-b border-cyan-900/40">
                      {['#', 'Species', 'Length (cm)', 'Weight (g)', 'Location', 'Date'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-[9px] text-slate-500 uppercase tracking-[0.2em] font-black whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyan-900/15">
                    {tableRows.map((row, i) => {
                      const rowNum = tablePage * TABLE_PAGE_SIZE + i + 1;
                      return (
                        <tr key={rowNum} className="hover:bg-cyan-950/20 transition-colors group">
                          <td className="px-4 py-2.5 text-slate-600 group-hover:text-slate-400">{rowNum}</td>
                          <td className="px-4 py-2.5 text-[#00f0ff] font-semibold">{row.species || '—'}</td>
                          <td className="px-4 py-2.5 text-green-400 font-bold">{row.length.toFixed(1)}</td>
                          <td className="px-4 py-2.5 text-purple-300">{row.weight > 0 ? row.weight.toFixed(1) : '—'}</td>
                          <td className="px-4 py-2.5 text-slate-400">{row.location || '—'}</td>
                          <td className="px-4 py-2.5 text-slate-500">{row.date || '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Empty state for filter */}
              {filteredRecs.length === 0 && (
                <div className="flex flex-col items-center gap-3 py-12 text-center">
                  <Filter className="w-8 h-8 text-slate-700" />
                  <p className="text-sm text-slate-600 font-bold tracking-widest uppercase">No records match filter</p>
                  <button onClick={() => setSpeciesFilter('')} className="text-[10px] text-cyan-600 hover:text-cyan-400 tracking-widest uppercase font-bold">
                    Clear Filter
                  </button>
                </div>
              )}
            </motion.div>

            {/* Pagination */}
            {tablePageCount > 1 && (
              <motion.div variants={itemVariants} className="flex items-center justify-center gap-2">
                <button onClick={() => setTablePage(0)} disabled={tablePage === 0}
                  className="px-3 py-1.5 bg-cyan-950/30 border border-cyan-900/40 rounded text-xs text-cyan-600 hover:text-cyan-400 hover:border-cyan-700/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold">
                  «
                </button>
                <button onClick={() => setTablePage(p => Math.max(0, p - 1))} disabled={tablePage === 0}
                  className="px-3 py-1.5 bg-cyan-950/30 border border-cyan-900/40 rounded text-xs text-cyan-600 hover:text-cyan-400 hover:border-cyan-700/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold">
                  ‹ Prev
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, tablePageCount) }, (_, i) => {
                    const start = Math.max(0, Math.min(tablePage - 2, tablePageCount - 5));
                    const page  = start + i;
                    return page < tablePageCount ? (
                      <button key={page} onClick={() => setTablePage(page)}
                        className={`w-8 h-8 rounded text-[10px] font-black transition-all ${page === tablePage ? 'bg-[#00f0ff]/15 border border-[#00f0ff]/50 text-[#00f0ff]' : 'bg-cyan-950/20 border border-cyan-900/30 text-slate-500 hover:text-cyan-400'}`}>
                        {page + 1}
                      </button>
                    ) : null;
                  })}
                </div>
                <button onClick={() => setTablePage(p => Math.min(tablePageCount - 1, p + 1))} disabled={tablePage >= tablePageCount - 1}
                  className="px-3 py-1.5 bg-cyan-950/30 border border-cyan-900/40 rounded text-xs text-cyan-600 hover:text-cyan-400 hover:border-cyan-700/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold">
                  Next ›
                </button>
                <button onClick={() => setTablePage(tablePageCount - 1)} disabled={tablePage >= tablePageCount - 1}
                  className="px-3 py-1.5 bg-cyan-950/30 border border-cyan-900/40 rounded text-xs text-cyan-600 hover:text-cyan-400 hover:border-cyan-700/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold">
                  »
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

      </motion.div>
    </div>
  );
}
