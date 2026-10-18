"use client";

import { Bug, CheckCircle2, CircleDashed, Filter, Activity, Plus, BrainCircuit } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

type Issue = {
  id: string;
  title: string;
  module: string;
  status: "resolved" | "active" | "pending" | "ai-task";
  priority: "high" | "medium" | "low";
  timestamp: string;
};

const MOCK_ISSUES: Issue[] = [
  { id: "ISS-012", title: "API latency in Ocean Digital Twin sync", module: "Ecosystem", status: "active", priority: "high", timestamp: "10 mins ago" },
  { id: "ISS-011", title: "Missing LFD parameters in auto-derivation", module: "ELEFAN Engine", status: "resolved", priority: "high", timestamp: "1 hr ago" },
  { id: "ISS-010", title: "Implement AI voice-to-text data entry model", module: "Data Ingestion", status: "ai-task", priority: "medium", timestamp: "3 hrs ago" },
  { id: "ISS-009", title: "Microplastics threshold calibration required", module: "Eco Intelligence", status: "pending", priority: "low", timestamp: "1 day ago" },
];

export default function IssueTrackerPage() {
  const [filter, setFilter] = useState<"all" | "green" | "purple">("all");

  const filteredIssues = MOCK_ISSUES.filter(issue => {
    if (filter === "all") return true;
    if (filter === "green") return issue.status === "resolved" || issue.status === "active";
    if (filter === "purple") return issue.status === "pending" || issue.status === "ai-task";
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-950/40 border border-cyan-500/30 rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Bug className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-[0.2em] text-cyan-300 uppercase drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]">
              Issue Tracker
            </h1>
            <p className="text-[10px] text-cyan-500/80 uppercase tracking-widest font-bold mt-1">
              System Diagnostics • AI Tasks • Resolution Log
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-cyan-950/40 border border-cyan-800 text-cyan-400 hover:bg-cyan-900/60 hover:border-cyan-500 rounded-lg transition-all text-xs font-bold uppercase tracking-widest">
            <Plus className="w-4 h-4" /> New Issue
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-cyan-950/20 p-2 rounded-xl border border-cyan-900/30 w-fit">
        <Filter className="w-4 h-4 text-cyan-600 ml-2" />
        <button 
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-all ${filter === "all" ? 'bg-cyan-900/50 text-cyan-300' : 'text-slate-400 hover:text-cyan-400'}`}
        >
          ALL ISSUES
        </button>
        <button 
          onClick={() => setFilter("green")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-all flex items-center gap-2 ${filter === "green" ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-800/50' : 'text-slate-400 hover:text-emerald-400'}`}
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div> GREEN (Active/Resolved)
        </button>
        <button 
          onClick={() => setFilter("purple")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-all flex items-center gap-2 ${filter === "purple" ? 'bg-purple-950/50 text-purple-400 border border-purple-800/50' : 'text-slate-400 hover:text-purple-400'}`}
        >
          <div className="w-2 h-2 rounded-full bg-purple-500"></div> PURPLE (Pending/AI)
        </button>
      </div>

      {/* Issue List */}
      <div className="space-y-3">
        {filteredIssues.map((issue, idx) => {
          const isGreen = issue.status === "resolved" || issue.status === "active";
          const isPurple = issue.status === "pending" || issue.status === "ai-task";
          
          return (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={issue.id} 
              className={`flex items-center justify-between p-4 rounded-xl border bg-cyan-950/10 backdrop-blur-sm transition-all hover:scale-[1.01] ${
                isGreen ? 'border-emerald-900/40 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 
                'border-purple-900/40 hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${isGreen ? 'bg-emerald-950/50 text-emerald-400' : 'bg-purple-950/50 text-purple-400'}`}>
                  {issue.status === "resolved" && <CheckCircle2 className="w-5 h-5" />}
                  {issue.status === "active" && <Activity className="w-5 h-5" />}
                  {issue.status === "pending" && <CircleDashed className="w-5 h-5" />}
                  {issue.status === "ai-task" && <BrainCircuit className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isGreen ? 'text-emerald-500' : 'text-purple-500'}`}>
                      {issue.id}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {issue.module}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-200 mt-1">{issue.title}</h3>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border ${
                  isGreen ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-400' : 'bg-purple-950/30 border-purple-800/50 text-purple-400'
                }`}>
                  {issue.status}
                </span>
                <span className="text-[10px] text-slate-500">{issue.timestamp}</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  );
}
