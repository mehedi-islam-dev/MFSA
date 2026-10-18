"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, LayoutTemplate, Activity, CheckCircle, Download, Cloud, Mail, BarChart2, Grid, Droplets, ArrowRight, Settings2 } from 'lucide-react';

const templates = [
  { 
    id: 1, 
    title: "Fisheries Stock Assessment", 
    subtitle: "(ELEFAN/SPR Analysis)",
    icon: BarChart2,
    docTitle: "AUTOMATED STOCK ASSESSMENT REPORT",
    chartType: "SPAWNING POTENTIAL RATIO CHART",
    paragraphs: [
      "Based on aggregated length-frequency data from the Mirsharai landing centers, the ELEFAN analysis indicates a clear shift towards smaller size classes in Tenualosa ilisha catches.",
      "Spawning Potential Ratio (SPR) has dropped below the 20% limit reference point, signaling severe recruitment overfishing. Immediate adjustment of mesh size regulations is recommended to prevent stock collapse."
    ]
  },
  { 
    id: 2, 
    title: "Industrial ETP Evaluation", 
    subtitle: "& EIA Matrix",
    icon: Grid,
    docTitle: "ENVIRONMENTAL IMPACT & ETP COMPLIANCE",
    chartType: "EIA VULNERABILITY MATRIX",
    paragraphs: [
      "Analysis of continuous effluent monitoring sensors at the primary industrial outfall indicates repeated exceedances of Biological Oxygen Demand (BOD) during nocturnal discharge cycles.",
      "The integrated EIA matrix flags the adjacent mangrove buffer zone as 'Critically Vulnerable'. Mandatory upgrades to tertiary treatment phases are required to maintain operating licenses."
    ]
  },
  { 
    id: 3, 
    title: "Coastal Water Quality", 
    subtitle: "Quarterly Analysis",
    icon: Droplets,
    docTitle: "QUARTERLY WATER QUALITY INDEX",
    chartType: "SALINITY & PH SPATIAL HEATMAP",
    paragraphs: [
      "Aggregated satellite and drone sensor data reveal localized acidification events (pH < 7.2) correlating with unseasonal agricultural runoff in the upper estuarine delta.",
      "Heavy metal concentrations remain within tolerable limits, but microplastic particle density has increased by 14% year-over-year. Continuous spatial monitoring protocols have been re-calibrated."
    ]
  }
];

export default function ReportingEngine() {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isCompiled, setIsCompiled] = useState(false);
  
  // To re-trigger animations when re-compiling the same template
  const [animationKey, setAnimationKey] = useState(0);

  const handleSelectTemplate = (id: number) => {
    if (isCompiling) return;
    setSelectedTemplate(id);
    setIsCompiled(false);
  };

  const initializeCompilation = () => {
    setIsCompiling(true);
    setIsCompiled(false);
    setAnimationKey(prev => prev + 1);

    // JARVIS Voice
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance("Report compilation initiated. Aggregating field data, E I A matrices, and industrial effluent parameters. Final document ready for export.");
      msg.rate = 0.95;
      msg.pitch = 0.85;
      window.speechSynthesis.speak(msg);
    }

    setTimeout(() => {
      setIsCompiling(false);
      setIsCompiled(true);
    }, 4500); // 4.5 seconds for the writing animation to complete
  };

  const activeTemplateData = templates.find(t => t.id === selectedTemplate)!;

  return (
    <div className="min-h-screen bg-[#010409] text-cyan-500 font-mono p-6 flex flex-col gap-6 selection:bg-purple-900 selection:text-purple-100">
      
      {/* Header */}
      <header className="flex items-center justify-between border-b border-cyan-900/50 pb-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-950/30 rounded-lg border border-cyan-800">
            <LayoutTemplate className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-widest text-cyan-300">AUTOMATED REPORTING ENGINE</h1>
            <p className="text-xs text-cyan-700 tracking-[0.2em] mt-1">MODULE 07: n8n AUTOMATION & CAREER ECOSYSTEM</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex flex-col items-end">
            <span className="text-cyan-700 text-xs tracking-widest">ENGINE STATUS</span>
            <span className={`font-bold tracking-widest flex items-center gap-2 ${isCompiling ? 'text-purple-400' : isCompiled ? 'text-green-400' : 'text-cyan-400'}`}>
              <span className={`w-2 h-2 rounded-full ${isCompiling ? 'bg-purple-500 animate-pulse' : isCompiled ? 'bg-green-500' : 'bg-cyan-500'}`} /> 
              {isCompiling ? 'GENERATING DOCUMENT...' : isCompiled ? 'READY FOR EXPORT' : 'STANDBY'}
            </span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex gap-6 overflow-hidden">
        
        {/* Left Panel (Template Selection) */}
        <div className="w-[320px] shrink-0 border border-cyan-900/40 bg-[#020b14]/80 backdrop-blur p-6 rounded-xl flex flex-col shadow-[0_0_30px_rgba(8,51,68,0.3)]">
          <div className="flex items-center gap-3 border-b border-cyan-900/50 pb-4 mb-6">
            <FileText className="text-cyan-500 w-5 h-5" />
            <h2 className="text-sm font-bold tracking-[0.2em] text-cyan-400">REPORT TEMPLATES</h2>
          </div>

          <div className="flex-1 space-y-4">
             {templates.map(t => (
               <div 
                 key={t.id}
                 onClick={() => handleSelectTemplate(t.id)}
                 className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 relative overflow-hidden group
                    ${selectedTemplate === t.id 
                       ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.15)]' 
                       : 'bg-[#010811] border-cyan-900/50 hover:border-cyan-700/50'
                    }`}
               >
                 {selectedTemplate === t.id && (
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400" />
                 )}
                 <div className="flex items-start gap-3">
                    <t.icon className={`w-5 h-5 shrink-0 mt-0.5 ${selectedTemplate === t.id ? 'text-cyan-400' : 'text-cyan-700 group-hover:text-cyan-500'}`} />
                    <div>
                      <h3 className={`text-xs font-bold tracking-widest uppercase mb-1 ${selectedTemplate === t.id ? 'text-cyan-300' : 'text-cyan-600'}`}>
                        {t.title}
                      </h3>
                      <p className={`text-[10px] tracking-wider ${selectedTemplate === t.id ? 'text-cyan-500' : 'text-cyan-800'}`}>
                        {t.subtitle}
                      </p>
                    </div>
                 </div>
               </div>
             ))}
          </div>

          <div className="pt-6">
            <button
               onClick={initializeCompilation}
               disabled={isCompiling}
               className={`w-full py-4 rounded font-bold tracking-[0.2em] text-xs transition-all duration-300 flex items-center justify-center gap-3
                 ${isCompiling 
                   ? 'bg-purple-950/40 text-purple-400 border border-purple-900 cursor-not-allowed' 
                   : 'bg-cyan-950/60 text-cyan-400 border border-cyan-800 hover:bg-cyan-900 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:text-cyan-200'
                 }`}
            >
               {isCompiling ? <Activity className="animate-spin w-4 h-4" /> : <Settings2 className="w-4 h-4" />}
               {isCompiling ? 'COMPILING DATA...' : 'INITIALIZE COMPILATION'}
            </button>
          </div>
        </div>

        {/* Center Display (Live Document Preview) */}
        <div className="flex-1 relative border border-cyan-900/60 bg-gradient-to-br from-[#010a14] to-[#011421] rounded-xl overflow-hidden shadow-[inset_0_0_100px_rgba(2,15,25,1)] flex justify-center items-center py-8">
           
           {/* Document A4 Canvas */}
           <div className="w-[450px] h-[636px] bg-[#020b14]/80 backdrop-blur-md border border-cyan-800/40 shadow-[0_0_50px_rgba(8,51,68,0.6)] relative overflow-hidden flex flex-col p-8">
              
              {/* Background Document Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-20 pointer-events-none" />
              
              {/* Scanning Laser Line during compilation */}
              <AnimatePresence>
                 {isCompiling && (
                   <motion.div 
                     className="absolute left-0 right-0 h-1 bg-purple-500 shadow-[0_0_20px_#a855f7] z-50 pointer-events-none"
                     initial={{ top: '0%' }}
                     animate={{ top: '100%' }}
                     transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                   />
                 )}
              </AnimatePresence>

              {/* Document Header Logo/Title */}
              <div className="flex justify-between items-end border-b-2 border-cyan-900/60 pb-4 mb-6 relative z-10">
                 <div>
                    <h2 className="text-cyan-600 text-[10px] tracking-[0.3em] font-bold">MARINE ANALYTICA</h2>
                    <p className="text-cyan-800 text-[8px] tracking-widest mt-1">AUTOMATED COMPILATION SYSTEM v2.4</p>
                 </div>
                 <div className="text-right">
                    <p className="text-cyan-600 text-[8px] tracking-widest">CLASSIFICATION: UNCLASSIFIED</p>
                    <p className="text-cyan-800 text-[8px] tracking-widest mt-1">DATE: 2026-09-20</p>
                 </div>
              </div>

              {/* Dynamic Content Rendering */}
              <div className="flex-1 relative z-10" key={animationKey}>
                 {(!isCompiling && !isCompiled) ? (
                    <div className="h-full flex items-center justify-center text-cyan-900/50 flex-col gap-4">
                       <LayoutTemplate className="w-12 h-12" />
                       <span className="text-xs tracking-[0.2em] font-bold">AWAITING COMPILATION DIRECTIVE</span>
                    </div>
                 ) : (
                    <div className="h-full flex flex-col gap-6">
                       
                       <motion.h1 
                          initial={{ opacity: 0, x: -20 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          transition={{ delay: 0.2 }}
                          className="text-sm font-bold tracking-[0.2em] text-cyan-300 shadow-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                       >
                          {activeTemplateData.docTitle}
                       </motion.h1>

                       <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }} 
                          animate={{ opacity: 1, scale: 1 }} 
                          transition={{ delay: 1 }}
                          className="w-full h-40 bg-cyan-950/20 border border-cyan-800/50 rounded flex items-center justify-center flex-col gap-3 relative overflow-hidden"
                       >
                          <activeTemplateData.icon className="w-8 h-8 text-cyan-700" />
                          <span className="text-[10px] text-cyan-600 tracking-widest uppercase font-bold">{activeTemplateData.chartType} [VISUALIZATION]</span>
                       </motion.div>

                       <div className="space-y-4">
                          {activeTemplateData.paragraphs.map((text, i) => (
                             <motion.p 
                                key={i}
                                initial={{ opacity: 0, y: 10 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                transition={{ delay: 2 + (i * 1.2) }}
                                className="text-xs text-cyan-400/80 leading-relaxed tracking-wide text-justify"
                             >
                                {text}
                             </motion.p>
                          ))}
                       </div>

                       {/* Completion Stamp */}
                       <AnimatePresence>
                          {isCompiled && (
                             <motion.div 
                               initial={{ opacity: 0, scale: 2, rotate: -15 }}
                               animate={{ opacity: 1, scale: 1, rotate: -5 }}
                               transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.5 }}
                               className="absolute bottom-10 right-10 border-2 border-green-500/50 text-green-500 px-4 py-2 rounded-lg font-bold tracking-widest shadow-[0_0_20px_rgba(74,222,128,0.2)] bg-[#020b14]/80 backdrop-blur"
                             >
                               AI VERIFIED
                             </motion.div>
                          )}
                       </AnimatePresence>

                    </div>
                 )}
              </div>

           </div>
        </div>

        {/* Right Panel (Export Hub) */}
        <div className="w-[300px] shrink-0 border border-cyan-800/50 bg-[#020b14]/90 backdrop-blur p-6 rounded-xl flex flex-col shadow-[0_0_40px_rgba(8,51,68,0.3)]">
          
          <div className="flex items-center gap-3 border-b border-cyan-900/80 pb-6 mb-6">
            <Cloud className="w-6 h-6 text-cyan-400" />
            <h2 className="text-sm font-bold tracking-[0.2em] text-cyan-300">EXPORT HUB</h2>
          </div>
          
          <div className="flex-1 flex flex-col justify-center gap-4">
            
            <button
               disabled={!isCompiled}
               className={`p-4 rounded-lg font-bold tracking-widest text-xs transition-all duration-300 flex items-center justify-between group
                  ${isCompiled 
                     ? 'bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-900 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]' 
                     : 'bg-[#010811] border border-cyan-900/30 text-cyan-800 cursor-not-allowed'
                  }`}
            >
               <div className="flex items-center gap-3">
                  <Download className={`w-4 h-4 ${isCompiled ? 'text-cyan-400' : 'text-cyan-800'}`} />
                  Export as PDF
               </div>
               {isCompiled && <ArrowRight className="w-4 h-4 text-cyan-600 group-hover:text-cyan-400 transition-colors" />}
            </button>

            <button
               disabled={!isCompiled}
               className={`p-4 rounded-lg font-bold tracking-widest text-xs transition-all duration-300 flex items-center justify-between group
                  ${isCompiled 
                     ? 'bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-900 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]' 
                     : 'bg-[#010811] border border-cyan-900/30 text-cyan-800 cursor-not-allowed'
                  }`}
            >
               <div className="flex items-center gap-3">
                  <Cloud className={`w-4 h-4 ${isCompiled ? 'text-cyan-400' : 'text-cyan-800'}`} />
                  Google Workspace
               </div>
               {isCompiled && <ArrowRight className="w-4 h-4 text-cyan-600 group-hover:text-cyan-400 transition-colors" />}
            </button>

            <button
               disabled={!isCompiled}
               className={`p-4 rounded-lg font-bold tracking-widest text-xs transition-all duration-300 flex items-center justify-between group
                  ${isCompiled 
                     ? 'bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-900 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]' 
                     : 'bg-[#010811] border border-cyan-900/30 text-cyan-800 cursor-not-allowed'
                  }`}
            >
               <div className="flex items-center gap-3">
                  <Mail className={`w-4 h-4 ${isCompiled ? 'text-cyan-400' : 'text-cyan-800'}`} />
                  Send via Email
               </div>
               {isCompiled && <ArrowRight className="w-4 h-4 text-cyan-600 group-hover:text-cyan-400 transition-colors" />}
            </button>

          </div>

          <div className={`mt-auto p-4 border rounded-lg flex items-center gap-3 transition-colors duration-1000 ${isCompiled ? 'border-green-500/50 bg-green-950/20' : 'border-cyan-900/30 bg-[#010811]'}`}>
             <CheckCircle className={`w-6 h-6 shrink-0 ${isCompiled ? 'text-green-500' : 'text-cyan-800'}`} />
             <div>
                <h4 className="text-[10px] text-cyan-600 uppercase tracking-widest mb-1 font-bold">Document Status</h4>
                <div className={`text-xs font-bold tracking-widest ${isCompiled ? 'text-green-400' : 'text-cyan-800'}`}>
                  {isCompiled ? 'CLEARED FOR EXPORT' : 'PENDING'}
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
