"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Activity, Droplets, Droplet, FileText, CheckCircle, Scale, Factory, FileCheck } from 'lucide-react';

const IEE_CHECKLIST = [
  { id: 'c1', label: 'Site Clearance Certificate', checked: true },
  { id: 'c2', label: 'ECA 1995 Section 12 Compliance', checked: true },
  { id: 'c3', label: 'Coastal Zone Policy Alignment', checked: false },
  { id: 'c4', label: 'Local Stakeholder Consultation', checked: true },
  { id: 'c5', label: 'Zero Liquid Discharge (ZLD) Audit', checked: false },
];

const MATRIX_ACTIONS = ['Effluent Discharge', 'Dredging', 'Construction'];
const MATRIX_FACTORS = ['Water Quality', 'Benthic Ecology', 'Air Quality'];

interface CellScore {
  actionIndex: number;
  factorIndex: number;
  magnitude: number;
  importance: number;
}

export default function MatrixAnalyzer() {
  const [checklist, setChecklist] = useState(IEE_CHECKLIST);
  const [scores, setScores] = useState<CellScore[]>([]);
  const [selectedCell, setSelectedCell] = useState<{a: number, f: number} | null>(null);
  
  const [isCompiling, setIsCompiling] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Simulated ETP Dials
  const [etpData, setEtpData] = useState({
     bod: 45, // mg/L
     cod: 180, // mg/L
     ph: 7.2,
     tss: 35 // mg/L
  });

  useEffect(() => {
     const interval = setInterval(() => {
        setEtpData(prev => ({
           bod: Math.max(30, Math.min(60, prev.bod + (Math.random() * 4 - 2))),
           cod: Math.max(150, Math.min(250, prev.cod + (Math.random() * 10 - 5))),
           ph: Math.max(6.5, Math.min(8.5, prev.ph + (Math.random() * 0.2 - 0.1))),
           tss: Math.max(20, Math.min(50, prev.tss + (Math.random() * 4 - 2)))
        }));
     }, 1000);
     return () => clearInterval(interval);
  }, []);

  const toggleChecklist = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const getScore = (a: number, f: number) => {
     return scores.find(s => s.actionIndex === a && s.factorIndex === f);
  };

  const updateScore = (a: number, f: number, type: 'magnitude' | 'importance', value: number) => {
     setScores(prev => {
        const existing = prev.find(s => s.actionIndex === a && s.factorIndex === f);
        if (existing) {
           return prev.map(s => (s.actionIndex === a && s.factorIndex === f) ? { ...s, [type]: value } : s);
        }
        return [...prev, { actionIndex: a, factorIndex: f, magnitude: type === 'magnitude' ? value : 5, importance: type === 'importance' ? value : 5 }];
     });
  };

  const handleCompile = () => {
     setIsCompiling(true);
     setSelectedCell(null);
     
     setTimeout(() => {
        setIsCompiling(false);
        setIsComplete(true);

        if ('speechSynthesis' in window) {
           window.speechSynthesis.cancel();
           const msg = new SpeechSynthesisUtterance("Environmental Impact Assessment complete. Industrial ETP parameters cross-referenced with coastal legal registers. Matrix finalized for regulatory submission.");
           msg.rate = 0.95; msg.pitch = 0.85;
           window.speechSynthesis.speak(msg);
        }
     }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#010409] font-mono flex flex-col p-4 lg:p-8 text-cyan-500 overflow-x-hidden">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-cyan-900/60 pb-6 gap-4 shrink-0 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-[0.25em] text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] flex items-center gap-4">
            <Scale className="w-8 h-8" />
            EIA MATRIX & ETP TRACKER
          </h1>
          <p className="text-xs text-cyan-600 tracking-[0.3em] mt-2 font-bold uppercase">Regulatory Compliance & Environmental Security Console</p>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 items-start">
        
        {/* Left Panel: IEE & Legal Register */}
        <div className="lg:col-span-1 glass-panel p-6 flex flex-col gap-6 sticky top-8">
          <h2 className="text-xs font-bold tracking-[0.2em] text-cyan-400 border-b border-cyan-900/50 pb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" /> LEGAL REGISTER (IEE)
          </h2>

          <div className="flex flex-col gap-3 mt-2">
            {checklist.map(item => (
               <div 
                  key={item.id} 
                  onClick={() => toggleChecklist(item.id)}
                  className={`flex items-start gap-3 p-3 rounded border transition-all duration-300 cursor-pointer
                     ${item.checked ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.2)]' : 'bg-[#01060c] border-cyan-900/30 text-cyan-700 hover:border-cyan-700/50'}`}
               >
                  <div className={`w-4 h-4 shrink-0 mt-0.5 border rounded flex items-center justify-center transition-colors
                     ${item.checked ? 'border-cyan-400 bg-cyan-400' : 'border-cyan-700 bg-transparent'}`}
                  >
                     {item.checked && <CheckCircle className="w-3 h-3 text-[#010409]" />}
                  </div>
                  <span className="text-[10px] tracking-widest font-bold leading-tight">{item.label}</span>
               </div>
            ))}
          </div>
        </div>

        {/* Center Display: Interactive Leopold Matrix */}
        <div className="lg:col-span-2 glass-panel p-6 flex flex-col gap-6 relative min-h-[500px]">
           
           <h2 className="text-xs font-bold tracking-[0.2em] text-cyan-400 border-b border-cyan-900/50 pb-2 flex items-center gap-2 z-10 justify-between">
             <div className="flex items-center gap-2"><Scale className="w-4 h-4" /> LEOPOLD MATRIX (M/I)</div>
             <span className="text-[9px] text-cyan-700">Magnitude (M) / Importance (I)</span>
           </h2>

           <div className={`flex-1 overflow-x-auto transition-all duration-500 ${isCompiling ? 'blur-sm scale-[0.99] opacity-70' : ''}`}>
              <table className="w-full text-left text-[10px] tracking-widest border-collapse">
                 <thead>
                    <tr>
                       <th className="p-2 border border-cyan-900/50 bg-[#01060c] text-cyan-700">ACTIONS →<br/>FACTORS ↓</th>
                       {MATRIX_ACTIONS.map(action => (
                          <th key={action} className="p-2 border border-cyan-900/50 bg-[#01060c] text-center text-cyan-500 font-bold w-1/4">
                             {action}
                          </th>
                       ))}
                    </tr>
                 </thead>
                 <tbody>
                    {MATRIX_FACTORS.map((factor, fIndex) => (
                       <tr key={factor}>
                          <th className="p-2 border border-cyan-900/50 bg-[#01060c] text-cyan-500 font-bold">
                             {factor}
                          </th>
                          {MATRIX_ACTIONS.map((action, aIndex) => {
                             const score = getScore(aIndex, fIndex);
                             const isSelected = selectedCell?.a === aIndex && selectedCell?.f === fIndex;
                             
                             // Calculate severity color
                             const m = score?.magnitude || 0;
                             const i = score?.importance || 0;
                             const severity = m * i;
                             const isHighImpact = severity > 50;

                             return (
                                <td 
                                   key={aIndex} 
                                   onClick={() => setSelectedCell({a: aIndex, f: fIndex})}
                                   className={`p-0 border border-cyan-900/50 relative cursor-pointer group transition-colors duration-300
                                      ${isSelected ? 'bg-cyan-950/80 ring-2 ring-cyan-400 z-10' : 'bg-transparent hover:bg-cyan-950/30'}`}
                                >
                                   <div className="w-full h-full min-h-[60px] relative">
                                      {/* Diagonal slash for Leopold format */}
                                      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 stroke-cyan-900" preserveAspectRatio="none">
                                         <line x1="0" y1="0" x2="100%" y2="100%" vectorEffect="non-scaling-stroke" />
                                      </svg>
                                      
                                      <div className={`absolute top-1 left-2 font-bold ${isHighImpact ? 'text-yellow-400 drop-shadow-[0_0_5px_#eab308]' : 'text-cyan-300'}`}>
                                         {score ? Math.abs(score.magnitude) : '-'}
                                      </div>
                                      
                                      <div className={`absolute bottom-1 right-2 font-bold ${isHighImpact ? 'text-yellow-400 drop-shadow-[0_0_5px_#eab308]' : 'text-cyan-600'}`}>
                                         {score ? Math.abs(score.importance) : '-'}
                                      </div>
                                   </div>
                                </td>
                             );
                          })}
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           {/* Cell Editor */}
           <AnimatePresence>
              {selectedCell && (
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                    className="p-4 rounded border border-cyan-400 bg-cyan-950/50 shadow-[0_0_20px_rgba(34,211,238,0.2)] mt-4"
                 >
                    <div className="flex justify-between items-center mb-4">
                       <span className="text-xs font-bold text-cyan-300">
                          {MATRIX_ACTIONS[selectedCell.a]} × {MATRIX_FACTORS[selectedCell.f]}
                       </span>
                       <button onClick={() => setSelectedCell(null)} className="text-[10px] tracking-widest text-cyan-600 hover:text-cyan-400">CLOSE</button>
                    </div>

                    <div className="flex gap-8">
                       <div className="flex-1 flex flex-col gap-2">
                          <label className="text-[9px] tracking-widest text-cyan-500 font-bold uppercase">Magnitude (1-10)</label>
                          <input 
                             type="range" min="1" max="10" 
                             value={getScore(selectedCell.a, selectedCell.f)?.magnitude || 5}
                             onChange={(e) => updateScore(selectedCell.a, selectedCell.f, 'magnitude', Number(e.target.value))}
                             className="w-full accent-cyan-400"
                          />
                          <span className="text-center text-xs font-bold text-cyan-300">{getScore(selectedCell.a, selectedCell.f)?.magnitude || 5}</span>
                       </div>
                       
                       <div className="flex-1 flex flex-col gap-2">
                          <label className="text-[9px] tracking-widest text-cyan-500 font-bold uppercase">Importance (1-10)</label>
                          <input 
                             type="range" min="1" max="10" 
                             value={getScore(selectedCell.a, selectedCell.f)?.importance || 5}
                             onChange={(e) => updateScore(selectedCell.a, selectedCell.f, 'importance', Number(e.target.value))}
                             className="w-full accent-cyan-600"
                          />
                          <span className="text-center text-xs font-bold text-cyan-600">{getScore(selectedCell.a, selectedCell.f)?.importance || 5}</span>
                       </div>
                    </div>
                 </motion.div>
              )}
           </AnimatePresence>

           <button 
             onClick={handleCompile}
             disabled={isCompiling || isComplete}
             className={`w-full py-4 mt-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden group
                ${isCompiling ? 'bg-cyan-950 border-cyan-500 shadow-[inset_0_0_30px_rgba(34,211,238,0.2)] cursor-not-allowed' : 
                  isComplete ? 'bg-green-950/80 border-green-500 text-green-400 shadow-[0_0_20px_rgba(74,222,128,0.3)] cursor-not-allowed' :
                  'bg-cyan-950/80 border-cyan-400 text-cyan-300 hover:bg-cyan-900 hover:shadow-[0_0_30px_#22d3ee] active:scale-95'}`}
           >
              {isCompiling ? (
                 <>
                    <Activity className="w-5 h-5 animate-spin text-cyan-400" />
                    <span className="text-[10px] font-bold tracking-[0.3em] text-cyan-300">AGGREGATING MATRIX SCORES...</span>
                 </>
              ) : isComplete ? (
                 <>
                    <FileCheck className="w-5 h-5" />
                    <span className="text-[10px] font-bold tracking-[0.3em]">EIA REPORT COMPILED</span>
                 </>
              ) : (
                 <>
                    <FileText className="w-5 h-5 group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] transition-all" />
                    <span className="text-[10px] font-bold tracking-[0.3em]">COMPILE EIA REPORT</span>
                 </>
              )}
           </button>
        </div>

        {/* Right Panel: ETP Telemetry */}
        <div className="lg:col-span-1 glass-panel p-6 flex flex-col gap-6 h-fit sticky top-8">
          <h2 className="text-xs font-bold tracking-[0.2em] text-cyan-400 border-b border-cyan-900/50 pb-2 flex items-center gap-2">
            <Factory className="w-4 h-4" /> ETP TELEMETRY
          </h2>

          <div className="flex flex-col gap-4 mt-2">
            
            {/* BOD Dial */}
            <div className={`p-4 rounded border relative overflow-hidden transition-colors duration-300 ${etpData.bod > 50 ? 'bg-yellow-950/20 border-yellow-900/50' : 'bg-[#01060c] border-cyan-900/50'}`}>
               <div className="flex justify-between items-start mb-2 relative z-10">
                  <span className="text-[10px] tracking-widest text-cyan-700 font-bold uppercase">BOD (mg/L)</span>
                  <Droplet className={`w-4 h-4 ${etpData.bod > 50 ? 'text-yellow-500' : 'text-cyan-500'}`} />
               </div>
               <div className="flex items-end gap-2 relative z-10">
                  <span className={`text-3xl font-bold ${etpData.bod > 50 ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'text-cyan-300'}`}>
                     {etpData.bod.toFixed(1)}
                  </span>
               </div>
               {/* Progress bar mock */}
               <div className="absolute bottom-0 left-0 h-1 bg-cyan-900/30 w-full">
                  <div className={`h-full transition-all duration-1000 ${etpData.bod > 50 ? 'bg-yellow-500' : 'bg-cyan-500'}`} style={{ width: `${Math.min(100, (etpData.bod / 100) * 100)}%` }} />
               </div>
            </div>

            {/* COD Dial */}
            <div className={`p-4 rounded border relative overflow-hidden transition-colors duration-300 ${etpData.cod > 200 ? 'bg-yellow-950/20 border-yellow-900/50' : 'bg-[#01060c] border-cyan-900/50'}`}>
               <div className="flex justify-between items-start mb-2 relative z-10">
                  <span className="text-[10px] tracking-widest text-cyan-700 font-bold uppercase">COD (mg/L)</span>
                  <Droplets className={`w-4 h-4 ${etpData.cod > 200 ? 'text-yellow-500' : 'text-cyan-500'}`} />
               </div>
               <div className="flex items-end gap-2 relative z-10">
                  <span className={`text-3xl font-bold ${etpData.cod > 200 ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'text-cyan-300'}`}>
                     {etpData.cod.toFixed(0)}
                  </span>
               </div>
               <div className="absolute bottom-0 left-0 h-1 bg-cyan-900/30 w-full">
                  <div className={`h-full transition-all duration-1000 ${etpData.cod > 200 ? 'bg-yellow-500' : 'bg-cyan-500'}`} style={{ width: `${Math.min(100, (etpData.cod / 300) * 100)}%` }} />
               </div>
            </div>

            {/* pH Level */}
            <div className={`p-4 rounded border relative overflow-hidden transition-colors duration-300 bg-[#01060c] border-cyan-900/50`}>
               <div className="flex justify-between items-start mb-2 relative z-10">
                  <span className="text-[10px] tracking-widest text-cyan-700 font-bold uppercase">pH Level</span>
                  <Activity className="w-4 h-4 text-cyan-500" />
               </div>
               <div className="flex items-end gap-2 relative z-10">
                  <span className="text-3xl font-bold text-cyan-300">
                     {etpData.ph.toFixed(2)}
                  </span>
               </div>
               <div className="absolute bottom-0 left-0 h-1 bg-cyan-900/30 w-full flex">
                  {/* Visual pH scale representation */}
                  <div className="h-full bg-red-500 w-[40%]" />
                  <div className="h-full bg-green-500 w-[20%]" />
                  <div className="h-full bg-blue-500 w-[40%]" />
                  
                  {/* Indicator notch */}
                  <div className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_5px_white] transition-all duration-1000" style={{ left: `${(etpData.ph / 14) * 100}%` }} />
               </div>
            </div>

          </div>

          <div className="mt-2 p-3 bg-[#01060c] border border-cyan-900/50 rounded flex items-start gap-3">
             <ShieldAlert className="w-4 h-4 text-cyan-500 mt-1 shrink-0" />
             <p className="text-[9px] tracking-wider text-cyan-600 leading-relaxed font-bold">
                ETP parameters simulate a local dyeing/printing facility output. Spikes in BOD/COD indicate potential treatment failure impacting the estuary.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
}
