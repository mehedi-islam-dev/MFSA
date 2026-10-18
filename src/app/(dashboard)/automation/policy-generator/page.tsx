"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Database, Users, Cpu, FileText, Activity, Play, Code, ShieldCheck, Leaf } from 'lucide-react';

interface NodeProps {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  x: number;
  y: number;
  active: boolean;
  pulse?: boolean;
}

const WorkflowNode: React.FC<NodeProps> = ({ title, subtitle, icon: Icon, x, y, active, pulse }) => (
  <div 
    className={`absolute w-[220px] p-4 rounded-xl border backdrop-blur flex flex-col items-center text-center transition-all duration-700 z-10
      ${active 
        ? 'border-cyan-400 bg-cyan-950/60 shadow-[0_0_25px_rgba(34,211,238,0.25)]' 
        : 'border-cyan-900/50 bg-[#010811]/90 shadow-none'
      }
    `}
    style={{ left: x, top: y }}
  >
    {pulse && (
      <div className="absolute inset-0 rounded-xl border-2 border-cyan-400 opacity-50 animate-ping pointer-events-none" />
    )}
    <div className={`p-3 rounded-lg mb-3 transition-colors duration-700 ${active ? 'bg-cyan-900/50' : 'bg-[#020b14]'}`}>
       <Icon className={`w-6 h-6 transition-colors duration-700 ${active ? 'text-cyan-400' : 'text-cyan-800'}`} />
    </div>
    <h3 className={`text-xs font-bold tracking-widest leading-snug transition-colors duration-700 ${active ? 'text-cyan-300' : 'text-cyan-700'}`}>
      {title}
    </h3>
    <p className={`text-[10px] mt-2 transition-colors duration-700 ${active ? 'text-cyan-500' : 'text-cyan-800'}`}>
      {subtitle}
    </p>
    
    {/* Node connection port */}
    <div className={`absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 transition-colors duration-700 ${active ? 'bg-cyan-400 border-cyan-200 shadow-[0_0_10px_#22d3ee]' : 'bg-[#010811] border-cyan-900'}`} />
    {/* Left port for the synthesizer node */}
    {x > 100 && (
       <div className={`absolute -left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 transition-colors duration-700 ${active ? 'bg-cyan-400 border-cyan-200 shadow-[0_0_10px_#22d3ee]' : 'bg-[#010811] border-cyan-900'}`} />
    )}
  </div>
);

export default function PolicyGenerator() {
  const [step, setStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [policyMode, setPolicyMode] = useState<'standard' | 'blue-carbon'>('standard');
  
  const standardPolicyText = `INITIAL ENVIRONMENTAL EXAMINATION (IEE) & COASTAL DEVELOPMENT POLICY DIRECTIVE

SECTOR: Mirsharai Coastal Zone
AUTHORIZATION: Integrated Coastal Zone Management (ICZM) Protocol 
STATUS: APPROVED & RATIFIED

1. ECOLOGICAL IMPACT SUMMARY:
   - EIA matrices indicate moderate vulnerability in the estuarine sediment layer.
   - Mitigation: Require buffer zones of 150m around all primary mangrove clusters.

2. SOCIO-ECONOMIC INTEGRATION:
   - Fisher livelihood surveys show 65% dependency on targeted estuarine zones.
   - Directive: Implementation of alternative livelihood subsidies during the spawning season closure (April - May).

3. COMPLIANCE & MONITORING:
   - Automated eDNA & drone surveillance feeds to be linked to local jurisdiction dashboards.
   - Quarterly compliance audits mandated for all industrial effluent pathways.

>> END OF POLICY DIRECTIVE`;

  const blueCarbonPolicyText = `BLUE CARBON POLICY ASSESSMENT & SEQUESTRATION DIRECTIVE

SECTOR: Sundarbans & Southern Delta Region
AUTHORIZATION: National Blue Carbon Framework (NBCF)
STATUS: APPROVED & RATIFIED

1. CARBON SEQUESTRATION VALUATION:
   - Satellite and eDNA data indicate 4.2 tons C/ha/yr sequestration in restored mangrove sectors.
   - Valuation: Estimated carbon credit potential of $2.5M annually on voluntary markets.

2. COMMUNITY-BASED CONSERVATION (CBC):
   - Local coastal communities integrated as primary stewards of carbon sinks.
   - Directive: 40% of generated carbon credit revenue to be directly reinvested in local climate-resilient infrastructure.

3. RESTORATION & EXPANSION TARGETS:
   - Mandated restoration of 500 hectares of degraded wetlands by 2030.
   - Quarterly monitoring of soil carbon metrics via autonomous drone sampling.

>> END OF BLUE CARBON ASSESSMENT`;

  const fullPolicyText = policyMode === 'standard' ? standardPolicyText : blueCarbonPolicyText;


  useEffect(() => {
    if (isTyping) {
      let currentText = "";
      let index = 0;
      const interval = setInterval(() => {
        currentText += fullPolicyText[index];
        setTypedText(currentText);
        index++;
        if (index === fullPolicyText.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 15); // Very fast typing speed
      return () => clearInterval(interval);
    }
  }, [isTyping, fullPolicyText]);

  const executeWorkflow = () => {
    setStep(0);
    setTypedText("");
    
    // Step 1: Input nodes active
    setTimeout(() => {
      setStep(1);
    }, 500);

    // Step 2: Synthesis node active
    setTimeout(() => {
      setStep(2);
    }, 2500);

    // Step 3: Generation complete
    setTimeout(() => {
      setStep(3);
      setIsTyping(true);

      // JARVIS Agent Voice
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance("Automation workflow triggered. Integrating E I A matrices with socio-economic data. Policy directive successfully compiled.");
        msg.rate = 0.95;
        msg.pitch = 0.85;
        window.speechSynthesis.speak(msg);
      }
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-[#010409] text-cyan-500 font-mono p-6 flex flex-col gap-6 selection:bg-purple-900 selection:text-purple-100">
      
      {/* Header */}
      <header className="flex items-center justify-between border-b border-cyan-900/50 pb-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-950/30 rounded-lg border border-cyan-800">
            <Network className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-widest text-cyan-300">SOCIO-ECOLOGICAL POLICY GENERATOR</h1>
            <p className="text-xs text-cyan-700 tracking-[0.2em] mt-1">MODULE 07: n8n AUTOMATION & CAREER ECOSYSTEM</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm">
          {/* Mode Toggle */}
          <div className="flex bg-cyan-950/40 border border-cyan-800 rounded-lg p-1 text-[10px] font-bold tracking-widest uppercase">
            <button
              onClick={() => { setPolicyMode('standard'); setStep(0); setTypedText(''); }}
              className={`px-3 py-2 rounded transition-colors ${policyMode === 'standard' ? 'bg-cyan-500 text-black' : 'text-cyan-600 hover:text-cyan-400'}`}
            >
              Standard IEE
            </button>
            <button
              onClick={() => { setPolicyMode('blue-carbon'); setStep(0); setTypedText(''); }}
              className={`px-3 py-2 rounded transition-colors flex items-center gap-2 ${policyMode === 'blue-carbon' ? 'bg-emerald-500 text-black' : 'text-emerald-600 hover:text-emerald-400'}`}
            >
              <Leaf className="w-3 h-3" /> Blue Carbon
            </button>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-cyan-700 text-xs tracking-widest">WORKFLOW ENGINE</span>
            <span className={`font-bold tracking-widest flex items-center gap-2 ${step > 0 && step < 3 ? 'text-purple-400' : 'text-cyan-400'}`}>
              <span className={`w-2 h-2 rounded-full ${step > 0 && step < 3 ? 'bg-purple-500 animate-pulse' : 'bg-cyan-500'}`} /> 
              {step === 0 ? 'IDLE' : step < 3 ? 'EXECUTING NODES...' : 'EXECUTION COMPLETE'}
            </span>
          </div>
          <button
            onClick={executeWorkflow}
            disabled={step > 0 && step < 3}
            className={`px-6 py-3 rounded font-bold tracking-[0.2em] text-xs transition-all duration-300 flex items-center justify-center gap-3
              ${(step > 0 && step < 3)
                ? 'bg-purple-950/40 text-purple-400 border border-purple-900 cursor-not-allowed' 
                : 'bg-cyan-950/60 text-cyan-400 border border-cyan-800 hover:bg-cyan-900 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:text-cyan-200'
              }`}
          >
            {(step > 0 && step < 3) ? <Activity className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            EXECUTE n8n WORKFLOW
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        
        {/* Top Panel (Workflow Canvas) */}
        <div className="h-[400px] relative border border-cyan-900/60 bg-gradient-to-br from-[#010a14] to-[#011421] rounded-xl overflow-hidden shadow-[inset_0_0_100px_rgba(2,15,25,1)] shrink-0">
          
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 text-xs text-cyan-600 tracking-[0.2em] font-bold">
             <Code className="w-4 h-4" /> CANVAS / POLICY-SYNTHESIS-V1.0
          </div>

          {/* Background Technical Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 pointer-events-none" />
          
          {/* Centered Canvas Container */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px]">
             
             {/* Connection Lines (SVG) */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {/* Static Background Lines */}
                <path d="M 230 75 C 400 75, 400 150, 560 150" fill="transparent" stroke="#083344" strokeWidth="4" />
                <path d="M 230 225 C 400 225, 400 150, 560 150" fill="transparent" stroke="#083344" strokeWidth="4" />

                {/* Animated Flow Lines (Step 1 -> 2) */}
                <AnimatePresence>
                   {step >= 1 && (
                      <>
                         {/* Solid fill animation */}
                         <motion.path 
                           d="M 230 75 C 400 75, 400 150, 560 150" 
                           fill="transparent" stroke="#22d3ee" strokeWidth="4" 
                           initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }}
                         />
                         <motion.path 
                           d="M 230 225 C 400 225, 400 150, 560 150" 
                           fill="transparent" stroke="#22d3ee" strokeWidth="4" 
                           initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }}
                         />
                         
                         {/* Pulsing data packets */}
                         <motion.path 
                           d="M 230 75 C 400 75, 400 150, 560 150" 
                           fill="transparent" stroke="#a855f7" strokeWidth="4" strokeDasharray="10 30"
                           animate={{ strokeDashoffset: -100 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                           style={{ filter: 'drop-shadow(0px 0px 8px #a855f7)' }}
                         />
                         <motion.path 
                           d="M 230 225 C 400 225, 400 150, 560 150" 
                           fill="transparent" stroke="#a855f7" strokeWidth="4" strokeDasharray="10 30"
                           animate={{ strokeDashoffset: -100 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                           style={{ filter: 'drop-shadow(0px 0px 8px #a855f7)' }}
                         />
                      </>
                   )}
                </AnimatePresence>

                {/* Animated Output Line (Step 2 -> 3) */}
                <path d="M 780 150 L 900 150" fill="transparent" stroke="#083344" strokeWidth="4" />
                <AnimatePresence>
                   {step >= 2 && (
                      <>
                         <motion.path 
                           d="M 780 150 L 900 150" 
                           fill="transparent" stroke="#22d3ee" strokeWidth="4" 
                           initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease: "easeInOut" }}
                         />
                         <motion.path 
                           d="M 780 150 L 900 150" 
                           fill="transparent" stroke="#4ade80" strokeWidth="4" strokeDasharray="10 20"
                           animate={{ strokeDashoffset: -100 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                           style={{ filter: 'drop-shadow(0px 0px 8px #4ade80)' }}
                         />
                      </>
                   )}
                </AnimatePresence>
             </svg>

             {/* Node 1: EIA Matrix or Carbon Metrics */}
             <WorkflowNode 
               title={policyMode === 'standard' ? "EIA Matrix Data" : "Carbon Sink Metrics"} 
               subtitle={policyMode === 'standard' ? "(Mirsharai Coastal Zone)" : "(Satellite & eDNA)"} 
               icon={Database} 
               x={10} y={20} 
               active={step >= 1} 
               pulse={step === 1}
             />

             {/* Node 2: Socio-Ec Survey or CBC Data */}
             <WorkflowNode 
               title={policyMode === 'standard' ? "Socio-Economic Survey" : "Community Data"} 
               subtitle={policyMode === 'standard' ? "(Fisher Livelihoods)" : "(CBC Framework)"} 
               icon={Users} 
               x={10} y={170} 
               active={step >= 1} 
               pulse={step === 1}
             />

             {/* Node 3: LLM Synthesizer */}
             <WorkflowNode 
               title="LLM Policy Synthesizer" 
               subtitle="(Core Intelligence Engine)" 
               icon={Cpu} 
               x={560} y={95} 
               active={step >= 2} 
               pulse={step === 2}
             />

          </div>
        </div>

        {/* Bottom Panel (Generated Policy Document) */}
        <div className="flex-1 border border-cyan-800/50 bg-[#020b14]/90 backdrop-blur p-6 rounded-xl flex flex-col shadow-[0_0_40px_rgba(8,51,68,0.3)] relative overflow-hidden">
          
          <div className="flex items-center gap-3 border-b border-cyan-900/80 pb-4 mb-4 shrink-0">
            <FileText className={`w-5 h-5 ${step >= 3 ? 'text-green-400' : 'text-cyan-800'}`} />
            <h2 className="text-xs font-bold tracking-[0.2em] text-cyan-300">GENERATED OUTPUT DOCUMENT</h2>
            
            {step >= 3 && (
               <div className="ml-auto flex items-center gap-2 bg-green-950/40 border border-green-500/50 px-3 py-1 rounded">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span className="text-[10px] text-green-400 font-bold tracking-widest">VERIFIED & APPROVED</span>
               </div>
            )}
          </div>
          
          <div className="flex-1 bg-[#01060c] border border-cyan-900/30 rounded p-6 overflow-y-auto relative shadow-[inset_0_0_20px_rgba(0,0,0,1)]">
             {step >= 3 ? (
               <div className="font-mono text-cyan-200 text-sm whitespace-pre-wrap leading-relaxed tracking-wide">
                  {typedText}
                  {isTyping && <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-pulse" />}
               </div>
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-cyan-800/50 gap-4">
                  <FileText className="w-12 h-12" />
                  <span className="tracking-[0.2em] text-xs font-bold">AWAITING N8N WORKFLOW EXECUTION</span>
               </div>
             )}
          </div>

        </div>

      </div>
    </div>
  );
}
