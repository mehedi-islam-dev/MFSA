"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Wifi, WifiOff, Share2, Database, Activity, RefreshCw, Signal, Server, CheckCircle2 } from 'lucide-react';

const PEER_NODES = [
  { id: 'N-001', name: 'Chittagong Field Station', latency: '14ms',  status: 'online',  region: 'BD-CHT', lastSync: '2 min ago'  },
  { id: 'N-002', name: 'Cox\'s Bazar Node',         latency: '28ms',  status: 'online',  region: 'BD-COX', lastSync: '5 min ago'  },
  { id: 'N-003', name: 'Dhaka HQ Server',           latency: '45ms',  status: 'online',  region: 'BD-DHK', lastSync: '1 min ago'  },
  { id: 'N-004', name: 'Sandwip Island Relay',      latency: '---',   status: 'offline', region: 'BD-SND', lastSync: '2h ago'     },
  { id: 'N-005', name: 'FAO GlobeFish Endpoint',    latency: '120ms', status: 'online',  region: 'INTL',   lastSync: '12 min ago' },
];

export default function NetworkModule() {
  const [syncRunning, setSyncRunning] = useState(false);
  const [syncDone, setSyncDone] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const handleSync = () => {
    setSyncRunning(true);
    setSyncDone(false);
    setTimeout(() => {
      setSyncRunning(false);
      setSyncDone(true);
      setTimeout(() => setSyncDone(false), 4000);
    }, 2500);
  };

  const onlineCount = PEER_NODES.filter(n => n.status === 'online').length;

  return (
    <div className="min-h-screen w-full bg-[#010409] text-[#00f0ff] font-mono overflow-y-auto pb-24 relative">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-[0.05]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto p-4 md:p-8 pt-8 md:pt-12 flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-900/50 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-950/50 border border-cyan-500/40 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.2)]">
              <Globe className="w-7 h-7 text-[#00f0ff]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-[0.2em] text-[#00f0ff] drop-shadow-[0_0_15px_rgba(0,240,255,0.7)] uppercase">
                Mesh Network
              </h1>
              <p className="text-[10px] text-cyan-600 tracking-[0.3em] uppercase font-bold mt-1">Peer-to-Peer Data Sync & Station Management</p>
            </div>
          </div>
          <button
            onClick={handleSync}
            disabled={syncRunning}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
              syncDone
                ? 'bg-green-950/40 border border-green-500/50 text-green-400 shadow-[0_0_15px_rgba(0,255,102,0.2)]'
                : syncRunning
                ? 'bg-cyan-950/40 border border-cyan-900 text-cyan-700 cursor-not-allowed'
                : 'bg-cyan-950/60 border border-cyan-500/60 text-cyan-300 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.5)]'
            }`}
          >
            {syncRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : syncDone ? <CheckCircle2 className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            {syncRunning ? 'Syncing...' : syncDone ? 'Sync Complete' : 'Initiate Mesh Sync'}
          </button>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Nodes Online', value: `${onlineCount}/${PEER_NODES.length}`, icon: Signal, color: 'text-cyan-400' },
            { label: 'Total Synced Records', value: '3,412', icon: Database, color: 'text-green-400' },
            { label: 'Avg Latency', value: '52ms', icon: Activity, color: 'text-yellow-400' },
            { label: 'Uptime', value: '99.1%', icon: Server, color: 'text-purple-400' },
          ].map(stat => (
            <div key={stat.label} className="glass-panel p-4 border border-cyan-900/30 rounded-xl flex flex-col gap-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <p className={`text-xl font-black font-mono ${stat.color}`}>{stat.value}</p>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Peer Node Table */}
        <div className="glass-panel p-6 border border-cyan-900/40 rounded-2xl">
          <h3 className="text-xs font-black tracking-[0.2em] uppercase text-[#00f0ff] mb-5 flex items-center gap-2">
            <Wifi className="w-4 h-4" /> Active Peer Nodes
          </h3>
          <div className="overflow-x-auto rounded-lg border border-cyan-900/30">
            <table className="w-full text-[11px] font-mono">
              <thead className="bg-cyan-950/30 border-b border-cyan-900/50">
                <tr>
                  {['Node ID', 'Station Name', 'Region', 'Latency', 'Last Sync', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[9px] text-slate-500 uppercase tracking-widest font-black">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-900/20">
                {PEER_NODES.map(node => (
                  <tr
                    key={node.id}
                    onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                    className={`cursor-pointer transition-colors ${selectedNode === node.id ? 'bg-cyan-950/30' : 'hover:bg-cyan-950/10'}`}
                  >
                    <td className="px-4 py-3 text-cyan-600 font-bold">{node.id}</td>
                    <td className="px-4 py-3 text-slate-200 font-bold">{node.name}</td>
                    <td className="px-4 py-3 text-slate-500">{node.region}</td>
                    <td className="px-4 py-3 text-yellow-400">{node.latency}</td>
                    <td className="px-4 py-3 text-slate-500">{node.lastSync}</td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${node.status === 'online' ? 'text-green-400' : 'text-red-400'}`}>
                        {node.status === 'online' ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                        {node.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <AnimatePresence>
            {selectedNode && (() => {
              const node = PEER_NODES.find(n => n.id === selectedNode)!;
              return (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 bg-cyan-950/20 border border-cyan-900/40 rounded-xl overflow-hidden"
                >
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-black">Node Details — {node.id}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: 'Full Name', value: node.name },
                      { label: 'Region Code', value: node.region },
                      { label: 'Last Sync', value: node.lastSync },
                      { label: 'Protocol', value: 'P2P v2.1 / TCP' },
                    ].map(d => (
                      <div key={d.label} className="p-2 bg-[#010811]/80 rounded-lg border border-cyan-900/20">
                        <p className="text-[8px] text-slate-600 uppercase tracking-widest">{d.label}</p>
                        <p className="text-xs text-cyan-300 font-bold mt-1">{d.value}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
