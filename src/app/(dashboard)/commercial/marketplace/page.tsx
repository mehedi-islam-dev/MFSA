"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Filter, ShieldCheck, Box, Activity, Hash, Network, CheckCircle, Leaf, Zap, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const FILTERS = [
  { id: 'spr', label: 'LB-SPR > 40% Verified', icon: Activity },
  { id: 'bycatch', label: 'Zero-Bycatch Gear (TED)', icon: ShieldCheck },
  { id: 'feed', label: 'Optimized Feed Certified', icon: Leaf },
];

interface Listing {
  id: string;
  batch: string;
  origin: string;
  status: string;
  premium: string;
  price: string;
  tags: string[];
}

export default function B2BMarketplace() {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<Listing | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isExecuted, setIsExecuted] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.from('marketplace_listings').select('*');
        if (!error && data) {
          setListings(data);
        }
      } catch (e) {
        console.warn("API unavailable: returning empty listings.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchListings();
  }, []);

  const toggleFilter = (id: string) => {
    setActiveFilters(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const filteredListings = listings.filter(listing => 
    activeFilters.length === 0 || activeFilters.every(f => listing.tags.includes(f))
  );

  const handleSelectBatch = (batch: Listing) => {
    if (isExecuting) return;
    setSelectedBatch(batch);
    setIsExecuted(false);
    setTxHash('');
  };

  const executeContract = () => {
    setIsExecuting(true);
    setIsExecuted(false);

    setTimeout(() => {
      setIsExecuting(false);
      setIsExecuted(true);
      
      // Generate mock Ethereum-style transaction hash
      const chars = '0123456789abcdef';
      let hash = '0x';
      for(let i = 0; i < 40; i++) hash += chars[Math.floor(Math.random() * chars.length)];
      setTxHash(hash);

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance("Transaction verified. Ecological sustainability premium applied. Smart contract executed successfully between institutional buyer and verified supplier.");
        msg.rate = 0.95;
        msg.pitch = 0.85;
        window.speechSynthesis.speak(msg);
      }
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#010409] text-cyan-500 font-mono p-6 flex flex-col gap-6 selection:bg-cyan-900 selection:text-cyan-100">
      
      {/* Header */}
      <header className="flex items-center justify-between border-b border-cyan-900/50 pb-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-950/30 rounded-lg border border-cyan-800 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
            <Network className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-widest text-cyan-300">SUSTAINABLE B2B MARKETPLACE</h1>
            <p className="text-xs text-cyan-700 tracking-[0.2em] mt-1">MODULE 08: COMMERCIAL SCALING (GRAND FINALE)</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex flex-col items-end border-r border-cyan-900 pr-6">
            <span className="text-cyan-700 text-xs tracking-widest">ECO-LIQUIDITY POOL</span>
            <span className="text-cyan-400 font-bold tracking-widest flex items-center gap-2">
              $4.2M USD
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-cyan-700 text-xs tracking-widest">BLOCKCHAIN ORACLE</span>
            <span className="text-green-400 font-bold tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> SYNCED
            </span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex gap-6 overflow-hidden">
        
        {/* Left Panel (Sustainability Filters) */}
        <div className="w-[300px] shrink-0 border border-cyan-900/40 bg-[#020b14]/80 backdrop-blur p-6 rounded-xl flex flex-col shadow-[0_0_30px_rgba(8,51,68,0.3)]">
          <div className="flex items-center gap-3 border-b border-cyan-900/50 pb-4 mb-6">
            <Filter className="text-cyan-500 w-5 h-5" />
            <h2 className="text-xs font-bold tracking-[0.2em] text-cyan-400">ORACLE FILTERS</h2>
          </div>

          <div className="flex flex-col gap-4">
             {FILTERS.map(f => (
                <button
                   key={f.id}
                   onClick={() => toggleFilter(f.id)}
                   className={`p-4 rounded-lg border text-left transition-all duration-300 flex items-center gap-4 group
                     ${activeFilters.includes(f.id)
                       ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.15)]'
                       : 'bg-[#010811] border-cyan-900/40 hover:border-cyan-700/60'
                     }`}
                >
                   <div className={`p-2 rounded ${activeFilters.includes(f.id) ? 'bg-cyan-900/80' : 'bg-[#020b14]'}`}>
                      <f.icon className={`w-4 h-4 ${activeFilters.includes(f.id) ? 'text-cyan-300' : 'text-cyan-800'}`} />
                   </div>
                   <span className={`text-[10px] font-bold tracking-widest uppercase ${activeFilters.includes(f.id) ? 'text-cyan-300' : 'text-cyan-700'}`}>
                      {f.label}
                   </span>
                </button>
             ))}
          </div>

          <div className="mt-auto pt-6 border-t border-cyan-900/50">
             <div className="text-[9px] text-cyan-800 tracking-widest uppercase font-bold text-center">
                Strict adherence to AI-Verified ecological thresholds is enforced by the smart contract protocol.
             </div>
          </div>
        </div>

        {/* Center Display (The Trading Grid) */}
        <div className="flex-1 relative border border-cyan-900/60 bg-gradient-to-br from-[#010a14] to-[#011421] rounded-xl overflow-hidden shadow-[inset_0_0_100px_rgba(2,15,25,1)] flex flex-col p-6">
           
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold tracking-[0.2em] text-cyan-500 flex items-center gap-2">
                 <Box className="w-4 h-4" /> ACTIVE BATCH LISTINGS
              </h2>
              <span className="text-[10px] bg-cyan-950/50 text-cyan-400 border border-cyan-900 px-3 py-1 rounded tracking-widest">
                 {filteredListings.length} MATCHES FOUND
              </span>
           </div>

           <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 gap-4 pb-4 content-start">
              <AnimatePresence>
                 {filteredListings.map(listing => (
                    <motion.div
                       layout
                       initial={{ opacity: 0, scale: 0.9 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.9 }}
                       transition={{ duration: 0.3 }}
                       key={listing.id}
                       onClick={() => handleSelectBatch(listing)}
                       className={`p-5 rounded-xl border backdrop-blur cursor-pointer transition-all duration-300 flex flex-col relative overflow-hidden group
                          ${selectedBatch?.id === listing.id
                             ? 'bg-cyan-950/50 border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.2)]'
                             : 'bg-[#020b14]/80 border-cyan-900/50 hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]'
                          }`}
                    >
                       {/* Hover / Active Glow Effect */}
                       <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none
                          ${selectedBatch?.id === listing.id ? 'opacity-10' : 'group-hover:opacity-5'}
                          bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-400 via-transparent to-transparent`} 
                       />

                       <div className="flex justify-between items-start mb-4 relative z-10">
                          <div>
                             <div className="text-[10px] text-cyan-600 font-bold tracking-widest mb-1">{listing.id}</div>
                             <h3 className={`text-sm font-bold tracking-wider ${selectedBatch?.id === listing.id ? 'text-cyan-300' : 'text-cyan-500'}`}>
                                {listing.batch}
                             </h3>
                          </div>
                          <div className="text-right">
                             <div className="text-lg font-bold text-green-400 tracking-wider">{listing.price}</div>
                             <div className="text-[10px] text-green-600 tracking-widest font-bold bg-green-950/30 px-2 py-0.5 rounded border border-green-900/50 inline-block mt-1">
                                {listing.premium} ECO-PREMIUM
                             </div>
                          </div>
                       </div>
                       
                       <div className="mt-auto pt-4 border-t border-cyan-900/30 flex justify-between items-center relative z-10">
                          <span className="text-[10px] text-cyan-700 tracking-widest uppercase">{listing.origin}</span>
                          <span className="text-[10px] font-bold tracking-widest text-cyan-400 flex items-center gap-1 bg-cyan-950/40 px-2 py-1 rounded">
                             <ShieldCheck className="w-3 h-3" /> {listing.status}
                          </span>
                       </div>
                    </motion.div>
                 ))}
              </AnimatePresence>
              
              {isLoading ? (
                 <div className="col-span-2 py-20 flex flex-col items-center justify-center text-cyan-800">
                    <Loader2 className="w-12 h-12 mb-4 opacity-50 animate-spin" />
                    <span className="text-xs tracking-[0.2em] font-bold">FETCHING DATA...</span>
                 </div>
              ) : filteredListings.length === 0 ? (
                 <div className="col-span-2 py-20 flex flex-col items-center justify-center text-cyan-800">
                    <Filter className="w-12 h-12 mb-4 opacity-50" />
                    <span className="text-xs tracking-[0.2em] font-bold">NO DATA AVAILABLE</span>
                 </div>
              ) : null}
           </div>
        </div>

        {/* Right Panel (Smart Contract HUD) */}
        <div className="w-[380px] shrink-0 border border-cyan-800/50 bg-[#020b14]/90 backdrop-blur p-6 rounded-xl flex flex-col shadow-[0_0_40px_rgba(8,51,68,0.3)] relative overflow-hidden">
          
          <div className="flex items-center gap-3 border-b border-cyan-900/80 pb-6 mb-6">
            <Hash className="w-6 h-6 text-cyan-400" />
            <h2 className="text-sm font-bold tracking-[0.2em] text-cyan-300">SMART CONTRACT HUD</h2>
          </div>
          
          <div className="flex-1 flex flex-col gap-6 relative z-10">
            
            {/* Terminal Flash Animation */}
            <AnimatePresence>
               {isExecuted && (
                  <motion.div 
                     initial={{ opacity: 0.8 }}
                     animate={{ opacity: 0 }}
                     transition={{ duration: 1 }}
                     className="absolute inset-0 bg-green-500/20 z-0 pointer-events-none rounded-xl"
                  />
               )}
            </AnimatePresence>

            {!selectedBatch ? (
               <div className="flex-1 flex flex-col items-center justify-center text-cyan-800/60 gap-4">
                  <ShoppingCart className="w-12 h-12" />
                  <span className="text-xs font-bold tracking-[0.2em] text-center">AWAITING BATCH SELECTION FOR CONTRACT ESCROW</span>
               </div>
            ) : (
               <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                  className="flex flex-col h-full"
               >
                  {/* Escrow Details */}
                  <div className="bg-[#01060c] border border-cyan-900/50 rounded-lg p-5 mb-6 relative overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,1)]">
                     <div className="absolute top-0 left-0 w-full h-1 bg-cyan-900" />
                     <h3 className="text-[10px] text-cyan-600 tracking-[0.2em] font-bold mb-4 flex items-center justify-between">
                        TRANSACTION ESCROW
                        {isExecuted && <span className="text-green-500 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> SECURED</span>}
                     </h3>
                     
                     <div className="space-y-3 font-mono">
                        <div className="flex justify-between border-b border-cyan-900/30 pb-2">
                           <span className="text-[10px] text-cyan-700 tracking-widest">ASSET ID</span>
                           <span className="text-xs text-cyan-300">{selectedBatch.id}</span>
                        </div>
                        <div className="flex justify-between border-b border-cyan-900/30 pb-2">
                           <span className="text-[10px] text-cyan-700 tracking-widest">COMMODITY</span>
                           <span className="text-[10px] text-cyan-400 font-bold max-w-[160px] text-right leading-tight">{selectedBatch.batch}</span>
                        </div>
                        <div className="flex justify-between border-b border-cyan-900/30 pb-2">
                           <span className="text-[10px] text-cyan-700 tracking-widest">ORACLE RATING</span>
                           <span className="text-[10px] text-green-400 font-bold">{selectedBatch.status}</span>
                        </div>
                        <div className="flex justify-between pt-2">
                           <span className="text-[10px] text-cyan-700 tracking-widest">SETTLEMENT</span>
                           <span className="text-sm text-green-400 font-bold tracking-widest">{selectedBatch.price}</span>
                        </div>
                     </div>
                  </div>

                  {/* Blockchain Hash Output */}
                  <div className="mb-6">
                     <h3 className="text-[10px] text-cyan-600 tracking-[0.2em] font-bold mb-2">BLOCKCHAIN RECORD</h3>
                     <div className={`p-4 border rounded font-mono text-[9px] break-all tracking-widest transition-colors duration-500
                        ${isExecuted 
                           ? 'bg-green-950/30 border-green-500/50 text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.1)]' 
                           : 'bg-[#010811] border-cyan-900/30 text-cyan-800'
                        }`}
                     >
                        {txHash ? `TX-HASH: ${txHash}` : 'AWAITING CONTRACT EXECUTION...'}
                     </div>
                  </div>

                  <div className="mt-auto">
                     <button
                        onClick={executeContract}
                        disabled={isExecuting || isExecuted}
                        className={`w-full py-4 rounded font-bold tracking-[0.2em] text-xs transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group
                        ${isExecuted 
                           ? 'bg-green-950/40 border border-green-500/50 text-green-400 cursor-not-allowed'
                           : isExecuting 
                              ? 'bg-cyan-950/40 border border-cyan-900 text-cyan-600 cursor-not-allowed'
                              : 'bg-cyan-950/60 border border-cyan-400 text-cyan-300 hover:bg-cyan-900 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:text-white'
                        }`}
                     >
                        {/* Pulse effect if ready to execute */}
                        {!isExecuting && !isExecuted && (
                           <div className="absolute inset-0 bg-cyan-400/20 group-hover:bg-cyan-400/30 animate-pulse" />
                        )}
                        
                        {isExecuted ? <CheckCircle className="w-4 h-4" /> : isExecuting ? <Activity className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 relative z-10" />}
                        <span className="relative z-10">
                           {isExecuted ? 'CONTRACT DEPLOYED' : isExecuting ? 'VALIDATING LEDGER...' : 'EXECUTE SMART CONTRACT'}
                        </span>
                     </button>
                  </div>
               </motion.div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
