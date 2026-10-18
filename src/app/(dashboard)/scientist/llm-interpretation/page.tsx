"use client";

import { useState, useRef, useEffect } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { BrainCircuit, Terminal, Sparkles, Database, FileText, CheckCircle2, Circle } from "lucide-react";

// Mock Data Feed from Module 4
const availableMetrics = [
  { id: "m1", label: "Length-Weight (b)", value: "2.95", desc: "Isometric Growth" },
  { id: "m2", label: "ELEFAN (K)", value: "0.45", desc: "Moderate Growth Velocity" },
  { id: "m3", label: "L-infinity (L∞)", value: "65cm", desc: "Asymptotic Length" },
  { id: "m4", label: "Total Mortality (Z)", value: "1.2", desc: "Catch Curve Estimate" },
  { id: "m5", label: "Fishing Mortality (F/M)", value: "1.8", desc: "High Fishing Pressure" },
  { id: "m6", label: "SPR Threshold", value: "18%", desc: "Critical Depletion Risk" },
];

export default function LLMInterpretationPage() {
  const [selectedMetrics, setSelectedMetrics] = useState<Set<string>>(new Set(availableMetrics.map(m => m.id)));
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => setShowCursor(c => !c), 500);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll terminal
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [generatedText]);

  const toggleMetric = (id: string) => {
    const next = new Set(selectedMetrics);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedMetrics(next);
  };

  const generateReport = () => {
    if (selectedMetrics.size === 0) return;
    setIsGenerating(true);
    setGeneratedText("");

    // Step 1: Deterministic Academic String Templating based on selected mock metrics
    let statusText = "Executive Summary: The analyzed marine population ";
    if (selectedMetrics.has("m6")) { // SPR
      statusText += "is currently facing severe reproductive pressure, with a Spawning Potential Ratio (SPR) of 18%. This indicates a critical state of depletion wherein the biomass is insufficient to maintain long-term recruitment. ";
    } else {
      statusText += "demonstrates varying indicators of ecological health based on the recent assessment data. ";
    }

    if (selectedMetrics.has("m1") && selectedMetrics.has("m2")) {
      statusText += "Morphometric analysis reveals an isometric growth pattern (b = 2.95) coupled with a moderate von Bertalanffy growth coefficient (K = 0.45). ";
    }

    let impactText = "\n\nEcological Impact: ";
    if (selectedMetrics.has("m5") || selectedMetrics.has("m4")) {
      impactText += "The mortality parameters are highly concerning. An F/M ratio of 1.8 coupled with a total mortality (Z) of 1.2 suggests that fishing pressure is disproportionately extracting the upper cohorts before they reach their asymptotic length (L∞ = 65cm). This truncation of the age structure significantly destabilizes the trophic balance of the localized ecosystem.";
    } else {
      impactText += "Without complete mortality parameters, the trophic impact remains uncertain, though the growth indicators suggest a standard metabolic trajectory within the estuarine environment.";
    }

    let policyText = "\n\nPolicy Recommendation: ";
    if (selectedMetrics.has("m6") || selectedMetrics.has("m5")) {
      policyText += "Immediate managerial intervention is strongly advised. To mitigate recruitment overfishing, policy frameworks must enforce stringent gear restrictions to increase the age-at-first-capture. Furthermore, a temporal closure of the spawning grounds during peak seasons should be modeled to allow the SPR to recover to the 40% target reference point.";
    } else {
      policyText += "Continued continuous telemetry monitoring is recommended. No immediate restrictive policies are required until comprehensive mortality and reproductive thresholds are breached.";
    }

    const fullReport = statusText + impactText + policyText;

    // Step 2: Typewriter Effect
    let i = 0;
    const interval = setInterval(() => {
      setGeneratedText((prev) => prev + fullReport.charAt(i));
      i++;
      if (i >= fullReport.length) {
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, 15); // Fast, robotic typing speed
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full h-full p-4 md:p-8 flex flex-col gap-6 relative">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 relative z-10"
      >
        <div className="p-3 bg-cyan-950/50 border border-cyan-500/50 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.3)]">
          <BrainCircuit className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
            Automated Interpretation
          </h1>
          <p className="text-cyan-100/70 text-sm font-light">The Autonomous Scientist (Local LLM)</p>
        </div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 relative z-10"
      >
        {/* Left Column: Data Feed Selection */}
        <motion.div variants={itemVariants} className="lg:col-span-1 bg-cyan-950/20 backdrop-blur-3xl border border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.1)] rounded-3xl p-6 flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none z-0"></div>
          
          <div className="flex items-center gap-2 mb-6 relative z-10">
            <Database className="w-4 h-4 text-cyan-500" />
            <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-widest">Telemetry Context Buffer</h3>
          </div>
          
          <p className="text-xs text-cyan-100/60 leading-relaxed font-light mb-4 relative z-10">
            Select the localized mathematical parameters to inject into the neural synthesis context window.
          </p>

          <div className="space-y-3 relative z-10 flex-1 overflow-y-auto pr-2 scrollbar-hide">
            {availableMetrics.map((metric) => {
              const isSelected = selectedMetrics.has(metric.id);
              return (
                <div 
                  key={metric.id}
                  onClick={() => toggleMetric(metric.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]' 
                      : 'bg-cyan-950/20 border-cyan-500/20 hover:border-cyan-500/50'
                  }`}
                >
                  <div>
                    <p className={`font-mono font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-400'}`}>
                      {metric.label}
                    </p>
                    <p className="text-[10px] text-cyan-100/50 uppercase tracking-widest">{metric.desc}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`font-mono text-sm ${isSelected ? 'text-blue-300 drop-shadow-[0_0_5px_rgba(147,197,253,0.8)]' : 'text-slate-500'}`}>
                      {metric.value}
                    </span>
                    {isSelected ? <CheckCircle2 className="w-4 h-4 text-cyan-400" /> : <Circle className="w-4 h-4 text-slate-600" />}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={generateReport}
            disabled={isGenerating || selectedMetrics.size === 0}
            className="w-full mt-4 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.8)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none relative z-10"
          >
            <Sparkles className="w-4 h-4" />
            Synthesize Report
          </button>
        </motion.div>

        {/* Right Column: AI Terminal Synthesizer */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-black/60 backdrop-blur-3xl border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.15)] rounded-3xl flex flex-col relative overflow-hidden h-[500px] lg:h-auto">
          
          {/* Custom SVG Neural Core Background (Active when generating) */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 1 } }}
                className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none mix-blend-screen"
              >
                <svg className="w-full h-full opacity-30 animate-pulse" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <radialGradient id="neural-glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#0284c7" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <circle cx="50" cy="50" r="50" fill="url(#neural-glow)" />
                  <path d="M0,50 Q25,25 50,50 T100,50" stroke="#0891b2" strokeWidth="0.5" fill="none" opacity="0.5" />
                  <path d="M0,25 Q50,75 100,25" stroke="#38bdf8" strokeWidth="0.2" fill="none" opacity="0.3" />
                  <path d="M0,75 Q50,25 100,75" stroke="#38bdf8" strokeWidth="0.2" fill="none" opacity="0.3" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Terminal Header */}
          <div className="bg-cyan-950/80 border-b border-cyan-500/30 p-4 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <h3 className="text-cyan-100 font-bold uppercase tracking-widest text-sm drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">Autonomous Synthesis Output</h3>
            </div>
            <div className="flex items-center gap-2">
              {isGenerating ? (
                <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-mono animate-pulse flex items-center gap-1">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full"></span> Processing
                </span>
              ) : (
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono flex items-center gap-1">
                  <span className="w-2 h-2 bg-slate-500 rounded-full"></span> Idle
                </span>
              )}
            </div>
          </div>

          {/* Terminal Body */}
          <div 
            ref={scrollRef}
            className="flex-1 p-6 overflow-y-auto relative z-10 font-mono text-sm sm:text-base leading-loose tracking-wide scrollbar-hide text-cyan-50"
          >
            {generatedText === "" && !isGenerating ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-cyan-500/30">
                <FileText className="w-12 h-12 mb-2" />
                <p>Awaiting context injection...</p>
              </div>
            ) : (
              <div className="whitespace-pre-wrap">
                {generatedText}
                <span className={`inline-block w-2 h-4 sm:h-5 bg-cyan-400 ml-1 translate-y-1 ${showCursor ? 'opacity-100' : 'opacity-0'} ${isGenerating ? 'shadow-[0_0_8px_rgba(34,211,238,1)]' : ''}`}></span>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
