"use client";

import { useState } from "react";
import { Briefcase, Key, Copy, Check, Terminal, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

const MOCK_API_DATA = [
  { day: "Mon", calls: 1200 },
  { day: "Tue", calls: 2300 },
  { day: "Wed", calls: 1800 },
  { day: "Thu", calls: 3500 },
  { day: "Fri", calls: 2900 },
  { day: "Sat", calls: 4100 },
  { day: "Sun", calls: 4800 },
];

export default function CommercialApiPage() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateKey = () => {
    setIsGenerating(true);
    setApiKey(null);
    setCopied(false);
    
    // Simulate API key generation delay
    setTimeout(() => {
      setIsGenerating(false);
      setApiKey(`sk_live_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}`);
    }, 1500);
  };

  const handleCopy = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-mono text-[var(--color-neon-cyan)] relative">
      
      {/* Header */}
      <div className="border-b border-[var(--color-neon-cyan)]/30 pb-4 relative">
        <h1 className="text-3xl font-black flex items-center gap-3 text-[var(--color-neon-cyan)] uppercase tracking-[0.3em] drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]">
          <Briefcase className="w-8 h-8" />
          DaaS Open API
        </h1>
        <p className="text-sm font-bold text-[var(--color-neon-purple)] uppercase tracking-widest mt-2">
          Commercial Data-as-a-Service Monetization
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Key Generation & Docs */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Generate API Key Panel */}
          <div className="glass-panel p-6 border border-[var(--color-neon-cyan)]/30 shadow-[0_0_30px_rgba(0,240,255,0.1)] rounded-2xl relative overflow-hidden group bg-[rgba(1,4,9,0.5)]">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-neon-cyan)]/5 to-transparent pointer-events-none" />
            
            <h2 className="text-xl font-bold uppercase tracking-widest text-slate-100 flex items-center gap-2 relative z-10 mb-6 drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">
              <Key className="w-5 h-5 text-[var(--color-neon-cyan)]" />
              API Credentials
            </h2>

            <div className="space-y-4 relative z-10">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0px 0px 15px 0px rgba(0,240,255,0.6)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerateKey}
                disabled={isGenerating}
                className="w-full py-3 bg-[var(--color-neon-cyan)]/10 border border-[var(--color-neon-cyan)] text-[var(--color-neon-cyan)] uppercase tracking-[0.2em] font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--color-neon-cyan)] hover:text-[#010409] transition-colors"
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2 animate-pulse">
                    Generating Token...
                  </span>
                ) : (
                  "Generate Live Key"
                )}
              </motion.button>

              <AnimatePresence>
                {apiKey && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-slate-900/60 border border-[var(--color-neon-green)]/40 rounded-xl flex items-center justify-between shadow-[inset_0_0_15px_rgba(0,255,102,0.1)]"
                  >
                    <span className="text-[var(--color-neon-green)] font-bold tracking-widest text-sm truncate mr-2 drop-shadow-[0_0_5px_rgba(0,255,102,0.8)]">
                      {apiKey}
                    </span>
                    <button 
                      onClick={handleCopy}
                      className="p-2 text-[var(--color-neon-green)] hover:bg-[var(--color-neon-green)] hover:text-black rounded transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Quick Docs */}
          <div className="glass-panel p-6 border border-[var(--color-neon-purple)]/30 shadow-[0_0_30px_rgba(168,85,247,0.1)] rounded-2xl relative overflow-hidden bg-[rgba(1,4,9,0.5)]">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-neon-purple)]/5 to-transparent pointer-events-none" />
            <h2 className="text-xl font-bold uppercase tracking-widest text-slate-100 flex items-center gap-2 relative z-10 mb-4 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
              <Terminal className="w-5 h-5 text-[var(--color-neon-purple)]" />
              Quick Start
            </h2>
            
            <div className="relative z-10 bg-[#010409] p-4 rounded-xl border border-[var(--color-neon-purple)]/20 shadow-[inset_0_0_20px_rgba(168,85,247,0.1)] overflow-hidden">
              <div className="flex items-center gap-2 mb-2 border-b border-[var(--color-neon-purple)]/20 pb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                <span className="ml-2 text-xs text-slate-500 font-bold tracking-widest">cURL</span>
              </div>
              <pre className="text-xs text-[var(--color-neon-purple)] whitespace-pre-wrap leading-relaxed drop-shadow-[0_0_5px_rgba(168,85,247,0.8)] break-all">
                curl -X GET \<br/>
                &nbsp;&nbsp;https://api.marineanalytica.io/v1/telemetry \<br/>
                &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY"
              </pre>
            </div>
          </div>

        </div>

        {/* Right Column: Chart */}
        <div className="lg:col-span-2 glass-panel p-6 border border-[var(--color-neon-cyan)]/30 shadow-[0_0_30px_rgba(0,240,255,0.1)] rounded-2xl relative overflow-hidden group bg-[rgba(1,4,9,0.5)] flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-neon-cyan)]/5 to-transparent pointer-events-none" />
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h2 className="text-xl font-bold uppercase tracking-widest text-slate-100 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">
              <Activity className="w-5 h-5 text-[var(--color-neon-cyan)]" />
              API Usage Metrics
            </h2>
            <span className="text-xs font-bold bg-[var(--color-neon-cyan)]/20 text-[var(--color-neon-cyan)] px-3 py-1 rounded-full border border-[var(--color-neon-cyan)]/50">
              Last 7 Days
            </span>
          </div>

          <div className="flex-1 relative z-10 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_API_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#00f0ff" strokeOpacity={0.1} vertical={false} />
                <XAxis 
                  dataKey="day" 
                  stroke="#00f0ff" 
                  tick={{ fill: "#00f0ff", fontFamily: "monospace", fontSize: 12 }} 
                  axisLine={{ strokeOpacity: 0.3 }}
                />
                <YAxis 
                  stroke="#00f0ff" 
                  tick={{ fill: "#00f0ff", fontFamily: "monospace", fontSize: 12 }} 
                  axisLine={{ strokeOpacity: 0.3 }}
                />
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(1,4,9,0.9)', 
                    backdropFilter: 'blur(16px)', 
                    borderColor: '#00f0ff', 
                    color: '#00f0ff', 
                    borderRadius: '0.5rem', 
                    fontFamily: 'monospace', 
                    boxShadow: '0 0 25px rgba(0,240,255,0.3)',
                    textTransform: 'uppercase'
                  }}
                  itemStyle={{ color: '#00f0ff', fontWeight: 'bold' }}
                  cursor={{ stroke: '#00f0ff', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="calls" 
                  stroke="#00f0ff" 
                  strokeWidth={3}
                  dot={{ fill: '#010409', stroke: '#00f0ff', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#00f0ff', stroke: '#fff', strokeWidth: 2 }}
                  style={{ filter: 'drop-shadow(0px 0px 8px rgba(0,240,255,0.8))' }}
                  isAnimationActive={true}
                  animationDuration={2000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
