"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Server, Key, Activity, ShieldCheck, Globe, Zap } from 'lucide-react';

const endpoints = [
  {
    id: 1,
    method: 'GET',
    path: '/api/v1/stock-status',
    description: 'Retrieve real-time species biomass and SPR analytics.',
    json: JSON.stringify({
      status: "success",
      timestamp: new Date().toISOString(),
      data: {
        species: "Tenualosa ilisha",
        region: "Mirsharai Coastal Zone",
        metrics: { 
          biomass_index: 0.32, 
          exploitation_rate: 0.68, 
          spr: 18.4 
        },
        warnings: [
          "SPR below 20% limit reference point.",
          "Severe recruitment overfishing detected."
        ]
      }
    }, null, 2)
  },
  {
    id: 2,
    method: 'POST',
    path: '/api/v1/elefan-calc',
    description: 'Submit length-frequency data for asynchronous optimization.',
    json: JSON.stringify({
      status: "processing",
      job_id: "elf-883a-492b",
      priority: "high",
      result: {
        L_inf: 54.2,
        K: 0.82,
        goodness_of_fit: 0.285
      },
      message: "Optimization converged in 43 iterations."
    }, null, 2)
  },
  {
    id: 3,
    method: 'GET',
    path: '/api/v1/blue-carbon-credit',
    description: 'Fetch real-time habitat sequestration valuations.',
    json: JSON.stringify({
      status: "success",
      query_region: "Sector 7",
      data: {
        habitat: "Mangrove Forest",
        area_ha: 1500,
        carbon_tCO2e: 45200,
        market_valuation_usd: 1356000,
        certification_eligible: true
      },
      oracle_node: "verified"
    }, null, 2)
  }
];

export default function DaaSAPI() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(endpoints[0]);
  const [typedChars, setTypedChars] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  
  const [apiKey, setApiKey] = useState('********************************');
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);

  // Trigger typing effect when endpoint changes
  useEffect(() => {
    setIsTyping(true);
    setTypedChars(0);
  }, [selectedEndpoint]);

  useEffect(() => {
    if (isTyping) {
      const totalChars = selectedEndpoint.json.length;
      const interval = setInterval(() => {
        setTypedChars((prev) => {
          const next = prev + 15; // Type 15 characters per tick for high speed
          if (next >= totalChars) {
            clearInterval(interval);
            setIsTyping(false);
            return totalChars;
          }
          return next;
        });
      }, 15);
      return () => clearInterval(interval);
    }
  }, [isTyping, selectedEndpoint.json.length]);

  const generateKey = () => {
    setIsGeneratingKey(true);
    
    setTimeout(() => {
      setIsGeneratingKey(false);
      // Generate a mock hash key
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let hash = 'sk_live_';
      for(let i = 0; i < 24; i++) {
        hash += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setApiKey(hash);

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance("Enterprise API key generated. Data as a Service endpoints are now live and ready for third-party institutional integration.");
        msg.rate = 0.95;
        msg.pitch = 0.85;
        window.speechSynthesis.speak(msg);
      }
    }, 2000);
  };

  // Syntax highlighting parser
  const renderHighlightedJSON = (str: string) => {
    if (!str) return null;
    const regex = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g;
    
    const elements = [];
    let lastIndex = 0;
    
    let match;
    let i = 0;
    while ((match = regex.exec(str)) !== null) {
      if (match.index > lastIndex) {
        elements.push(<span key={`text-${i}`} className="text-cyan-700">{str.slice(lastIndex, match.index)}</span>);
      }
      
      let cls = 'text-purple-400'; // number
      if (/^"/.test(match[0])) {
        if (/:$/.test(match[0])) {
          cls = 'text-cyan-300 font-bold'; // key
        } else {
          cls = 'text-green-400'; // string
        }
      } else if (/true|false/.test(match[0])) {
        cls = 'text-purple-500 font-bold'; // boolean
      }
      
      elements.push(<span key={`token-${i}`} className={cls}>{match[0]}</span>);
      lastIndex = regex.lastIndex;
      i++;
    }
    
    if (lastIndex < str.length) {
      elements.push(<span key={`text-end`} className="text-cyan-700">{str.slice(lastIndex)}</span>);
    }
    
    return elements;
  };

  const visibleJSON = selectedEndpoint.json.slice(0, typedChars);

  return (
    <div className="min-h-screen bg-[#010409] text-cyan-500 font-mono p-6 flex flex-col gap-6 selection:bg-purple-900 selection:text-purple-100">
      
      {/* Header */}
      <header className="flex items-center justify-between border-b border-cyan-900/50 pb-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-950/30 rounded-lg border border-cyan-800">
            <Server className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-widest text-cyan-300">DATA AS A SERVICE (DaaS) OPEN API</h1>
            <p className="text-xs text-cyan-700 tracking-[0.2em] mt-1">MODULE 08: COMMERCIAL SCALING</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex flex-col items-end border-r border-cyan-900 pr-6">
            <span className="text-cyan-700 text-xs tracking-widest">NETWORK LATENCY</span>
            <span className="text-cyan-400 font-bold tracking-widest flex items-center gap-2">
              12ms
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-cyan-700 text-xs tracking-widest">API GATEWAY</span>
            <span className="text-green-400 font-bold tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> ONLINE
            </span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex gap-6 overflow-hidden">
        
        {/* Left Panel (Endpoint Navigator) */}
        <div className="w-[340px] shrink-0 border border-cyan-900/40 bg-[#020b14]/80 backdrop-blur p-6 rounded-xl flex flex-col shadow-[0_0_30px_rgba(8,51,68,0.3)]">
          <div className="flex items-center gap-3 border-b border-cyan-900/50 pb-4 mb-6">
            <Globe className="text-cyan-500 w-5 h-5" />
            <h2 className="text-sm font-bold tracking-[0.2em] text-cyan-400">ENDPOINT NAVIGATOR</h2>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
             {endpoints.map((ep) => (
               <div 
                 key={ep.id}
                 onClick={() => setSelectedEndpoint(ep)}
                 className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 group
                    ${selectedEndpoint.id === ep.id
                       ? 'bg-cyan-950/60 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.1)]' 
                       : 'bg-[#010811] border-cyan-900/40 hover:border-cyan-700/60'
                    }`}
               >
                 <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-widest ${ep.method === 'GET' ? 'bg-green-950/50 text-green-400 border border-green-500/30' : 'bg-purple-950/50 text-purple-400 border border-purple-500/30'}`}>
                       {ep.method}
                    </span>
                 </div>
                 <div className={`text-xs font-bold tracking-wider mb-2 ${selectedEndpoint.id === ep.id ? 'text-cyan-300' : 'text-cyan-600'}`}>
                    {ep.path}
                 </div>
                 <div className={`text-[10px] leading-relaxed ${selectedEndpoint.id === ep.id ? 'text-cyan-500' : 'text-cyan-800'}`}>
                    {ep.description}
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Center Display (Live JSON Terminal) */}
        <div className="flex-1 relative border border-cyan-900/60 bg-[#01060c] rounded-xl overflow-hidden shadow-[inset_0_0_100px_rgba(2,15,25,1)] flex flex-col">
           
           {/* Terminal Header */}
           <div className="h-12 bg-cyan-950/30 border-b border-cyan-900/60 flex items-center px-4 gap-4">
              <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-cyan-900" />
                 <div className="w-3 h-3 rounded-full bg-cyan-900" />
                 <div className="w-3 h-3 rounded-full bg-cyan-900" />
              </div>
              <div className="text-[10px] text-cyan-600 tracking-[0.2em] font-bold flex items-center gap-2">
                 <Terminal className="w-4 h-4" /> BASH / LIVE-REQUEST-TEST
              </div>
           </div>

           {/* Terminal Output */}
           <div className="flex-1 p-6 overflow-y-auto relative font-mono text-sm leading-relaxed">
              <div className="mb-4 text-cyan-600">
                 $ curl -X {selectedEndpoint.method} "https://api.marine-analytica.io{selectedEndpoint.path}" \ <br/>
                 &nbsp;&nbsp;&nbsp;&nbsp;-H "Authorization: Bearer {apiKey.substring(0, 12)}..."
              </div>
              
              <div className="mb-4 text-green-500/50 text-xs">
                 &gt; Resolving host...<br/>
                 &gt; Connecting to 104.21.43.12:443... connected.<br/>
                 &gt; HTTP/2 200 OK<br/>
              </div>

              <div className="whitespace-pre">
                 {renderHighlightedJSON(visibleJSON)}
                 {isTyping && <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-1 align-middle" />}
              </div>
           </div>
           
           {/* Background Scanner Line */}
           <AnimatePresence>
             {isTyping && (
                <motion.div 
                  className="absolute left-0 right-0 h-0.5 bg-cyan-500/20 shadow-[0_0_10px_#22d3ee] pointer-events-none"
                  initial={{ top: '0%' }}
                  animate={{ top: '100%' }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
             )}
           </AnimatePresence>
        </div>

        {/* Right Panel (API Management) */}
        <div className="w-[340px] shrink-0 border border-cyan-800/50 bg-[#020b14]/90 backdrop-blur p-6 rounded-xl flex flex-col shadow-[0_0_40px_rgba(8,51,68,0.3)]">
          
          <div className="flex items-center gap-3 border-b border-cyan-900/80 pb-6 mb-6">
            <Key className="w-6 h-6 text-cyan-400" />
            <h2 className="text-sm font-bold tracking-[0.2em] text-cyan-300">API MANAGEMENT</h2>
          </div>
          
          <div className="flex-1 flex flex-col gap-8">
            
            {/* Active API Key */}
            <div>
               <h3 className="text-[10px] text-cyan-600 tracking-widest font-bold mb-3 uppercase">Active Enterprise Key</h3>
               <div className="p-3 bg-[#01060c] border border-cyan-900 rounded font-mono text-xs text-cyan-400 break-all flex items-center justify-between shadow-[inset_0_0_10px_rgba(0,0,0,1)]">
                  <span className={apiKey.includes('*') ? 'opacity-50 tracking-widest' : 'tracking-wider'}>{apiKey}</span>
                  {apiKey.includes('sk_') && <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />}
               </div>
            </div>

            {/* Usage Quota */}
            <div>
               <div className="flex justify-between items-end mb-2">
                  <h3 className="text-[10px] text-cyan-600 tracking-widest font-bold uppercase">Usage Quota</h3>
                  <span className="text-[10px] text-cyan-400 font-bold tracking-widest">84% REMAINING</span>
               </div>
               <div className="h-2 w-full bg-cyan-950 rounded-full overflow-hidden border border-cyan-900">
                  <div className="h-full bg-gradient-to-r from-green-500 to-cyan-400 w-[84%] shadow-[0_0_10px_#22d3ee]" />
               </div>
               <p className="text-[9px] text-cyan-700 tracking-widest mt-2 text-right">8,420,119 / 10,000,000 REQ</p>
            </div>

            {/* Real-time Request Metrics */}
            <div>
               <h3 className="text-[10px] text-cyan-600 tracking-widest font-bold mb-3 uppercase flex items-center gap-2">
                  <Activity className="w-3 h-3" /> Live Request Metrics
               </h3>
               <div className="h-24 bg-cyan-950/20 border border-cyan-900/50 rounded-lg flex items-end justify-between p-2 gap-1">
                  {[20, 35, 25, 60, 45, 80, 50, 70, 40, 90, 55, 30].map((h, i) => (
                     <motion.div 
                        key={i}
                        className="flex-1 bg-purple-500/80 rounded-t-sm shadow-[0_0_8px_#a855f7]"
                        initial={{ height: `${h}%` }}
                        animate={{ height: [`${h}%`, `${Math.max(10, h + (Math.random() * 40 - 20))}%`, `${h}%`] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                     />
                  ))}
               </div>
               <div className="flex justify-between text-[9px] text-cyan-700 tracking-widest mt-2 font-bold">
                  <span>-1 MIN</span>
                  <span>NOW (420 REQ/s)</span>
               </div>
            </div>

          </div>

          <div className="pt-6 mt-6 border-t border-cyan-900/50">
             <button
               onClick={generateKey}
               disabled={isGeneratingKey}
               className={`w-full py-4 rounded font-bold tracking-[0.2em] text-[10px] uppercase transition-all duration-300 flex items-center justify-center gap-3
                 ${isGeneratingKey 
                   ? 'bg-purple-950/40 text-purple-400 border border-purple-900 cursor-not-allowed' 
                   : 'bg-cyan-950/60 text-cyan-400 border border-cyan-800 hover:bg-cyan-900 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:text-cyan-200'
                 }`}
             >
               {isGeneratingKey ? <Activity className="animate-spin w-4 h-4" /> : <Zap className="w-4 h-4" />}
               {isGeneratingKey ? 'GENERATING ENCRYPTION HASH...' : 'GENERATE ENTERPRISE KEY'}
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}
