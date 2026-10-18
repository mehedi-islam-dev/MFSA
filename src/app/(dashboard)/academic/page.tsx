"use client";

import React, { useState } from 'react';
import { GraduationCap, Award, BookOpen, Terminal, Code2, Download, Edit2, Save } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { toast } from "sonner";

export default function AcademicPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState({
    name: "Mehedi Islam",
    title: "Full-Stack Marine Informatics",
    bio: "Pioneering the intersection of marine biology and hyper-modern software architecture. Building scalable digital twins, real-time AI telemetry pipelines, and autonomous data ecosystems for the next generation of oceanographic research.",
    eduTime: "Present",
    eduTitle: "Institute of Marine Sciences",
    eduDesc: "4th-year student, University of Chittagong",
    researchTitle: "Mangrove Sediment & Water Fungi",
    researchDesc: "Isolating and identifying mangrove sediment and water fungi from coastal sites in Chattogram.",
    profTitle: "Uddom Academic Care & Marine Analytica",
    profDesc: "Founder of Uddom Academic Care; Developer of Marine Analytica."
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const slideUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-mono text-[var(--color-neon-cyan)] relative pb-12">
      
      {/* Background Cinematic Effects */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(0,240,255,0.03)_0%,transparent_70%)] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(168,85,247,0.03)_0%,transparent_70%)] rounded-full blur-3xl"></div>
      </div>

      {/* Header Profile Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-panel p-8 border border-[var(--color-neon-cyan)]/30 shadow-[0_0_40px_rgba(0,240,255,0.15)] rounded-3xl relative overflow-hidden bg-[rgba(1,4,9,0.7)] flex flex-col md:flex-row items-center md:items-start gap-8"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-neon-cyan)]/10 to-transparent pointer-events-none" />
        
        {/* Avatar glowing ring */}
        <div className="relative z-10 shrink-0">
          <div className="w-32 h-32 rounded-full border-2 border-[var(--color-neon-cyan)] shadow-[0_0_20px_rgba(0,240,255,0.5)] flex items-center justify-center bg-slate-900 overflow-hidden relative group">
            <div className="absolute inset-0 bg-[var(--color-neon-cyan)]/20 animate-pulse pointer-events-none"></div>
            <Terminal className="w-12 h-12 text-[var(--color-neon-cyan)] group-hover:scale-110 transition-transform" />
          </div>
        </div>

        <div className="relative z-10 flex-1 text-center md:text-left space-y-4 w-full">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="w-full">
              {isEditing ? (
                <input 
                  name="name" value={data.name} onChange={handleChange} 
                  className="w-full text-4xl font-black uppercase tracking-[0.2em] bg-gray-900 border border-cyan-800 text-white rounded px-2 py-1 mb-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              ) : (
                <h1 className="text-4xl font-black uppercase tracking-[0.2em] text-slate-100 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                  {data.name}
                </h1>
              )}
              
              {isEditing ? (
                <input 
                  name="title" value={data.title} onChange={handleChange} 
                  className="w-full text-lg font-bold uppercase tracking-widest bg-gray-900 border border-cyan-800 text-[var(--color-neon-purple)] rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              ) : (
                <p className="text-lg font-bold text-[var(--color-neon-purple)] uppercase tracking-widest mt-2 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">
                  {data.title}
                </p>
              )}
            </div>
            
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="border border-cyan-800 text-cyan-400 bg-cyan-950/40 hover:bg-cyan-900/50 px-3 py-1.5 rounded text-xs flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
            >
              {isEditing ? <><Save className="w-3 h-3"/> Save Changes</> : <><Edit2 className="w-3 h-3"/> Edit Portfolio</>}
            </button>
          </div>
          
          {isEditing ? (
            <textarea 
              name="bio" value={data.bio} onChange={handleChange} rows={3}
              className="w-full text-sm text-white bg-gray-900 border border-cyan-800 rounded px-2 py-1 leading-relaxed focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          ) : (
            <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
              {data.bio}
            </p>
          )}
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
            <a href="/Mehedi_Islam_CV.pdf" download className="px-6 py-2 bg-[var(--color-neon-cyan)]/10 border-2 border-[var(--color-neon-cyan)] text-[var(--color-neon-cyan)] hover:bg-[var(--color-neon-cyan)] hover:text-black uppercase tracking-widest text-xs font-bold rounded-full transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] flex items-center gap-2">
              <Download className="w-4 h-4" /> Export CV
            </a>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,1)]"></span>
              Available for Deployment
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        
        {/* Core Competencies */}
        <motion.div variants={slideUp} className="glass-panel p-8 border border-[var(--color-neon-green)]/30 shadow-[0_0_30px_rgba(0,255,102,0.1)] rounded-2xl relative overflow-hidden bg-[rgba(1,4,9,0.5)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-neon-green)]/5 to-transparent pointer-events-none" />
          <h2 className="text-xl font-bold uppercase tracking-widest text-slate-100 flex items-center gap-3 relative z-10 mb-6 drop-shadow-[0_0_8px_rgba(0,255,102,0.5)]">
            <Code2 className="w-6 h-6 text-[var(--color-neon-green)]" />
            Core Competencies
          </h2>
          
          <div className="relative z-10 space-y-6">
            <div>
              <div className="flex justify-between text-xs uppercase tracking-widest mb-2 text-slate-300">
                <span>Frontend Architecture (React/Next.js)</span>
                <span className="text-[var(--color-neon-green)] font-bold">98%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: "98%" }} transition={{ duration: 1.5 }} className="h-full bg-[var(--color-neon-green)] shadow-[0_0_10px_rgba(0,255,102,1)]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs uppercase tracking-widest mb-2 text-slate-300">
                <span>Data Modeling & Backend</span>
                <span className="text-[var(--color-neon-cyan)] font-bold">92%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: "92%" }} transition={{ duration: 1.5, delay: 0.2 }} className="h-full bg-[var(--color-neon-cyan)] shadow-[0_0_10px_rgba(0,240,255,1)]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs uppercase tracking-widest mb-2 text-slate-300">
                <span>Computer Vision & AI Integration</span>
                <span className="text-[var(--color-neon-purple)] font-bold">85%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} transition={{ duration: 1.5, delay: 0.4 }} className="h-full bg-[var(--color-neon-purple)] shadow-[0_0_10px_rgba(168,85,247,1)]" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Academic Milestones */}
        <motion.div variants={slideUp} className="glass-panel p-8 border border-[var(--color-neon-purple)]/30 shadow-[0_0_30px_rgba(168,85,247,0.1)] rounded-2xl relative overflow-hidden bg-[rgba(1,4,9,0.5)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-neon-purple)]/5 to-transparent pointer-events-none" />
          <h2 className="text-xl font-bold uppercase tracking-widest text-slate-100 flex items-center gap-3 relative z-10 mb-6 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
            <GraduationCap className="w-6 h-6 text-[var(--color-neon-purple)]" />
            Academic Trajectory
          </h2>
          
          <div className="relative z-10 space-y-6">
            
            <div className="relative pl-6 border-l-2 border-[var(--color-neon-purple)]/50">
              <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[var(--color-neon-purple)] shadow-[0_0_8px_rgba(168,85,247,1)]"></div>
              {isEditing ? (
                <div className="space-y-2">
                  <input name="eduTime" value={data.eduTime} onChange={handleChange} className="w-full text-[10px] uppercase tracking-widest bg-gray-900 border border-cyan-800 text-white rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                  <input name="eduTitle" value={data.eduTitle} onChange={handleChange} className="w-full text-sm font-bold uppercase tracking-wider bg-gray-900 border border-cyan-800 text-white rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                  <textarea name="eduDesc" value={data.eduDesc} onChange={handleChange} rows={2} className="w-full text-xs bg-gray-900 border border-cyan-800 text-white rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                </div>
              ) : (
                <>
                  <span className="text-[10px] text-[var(--color-neon-purple)] font-bold uppercase tracking-widest block mb-1">{data.eduTime}</span>
                  <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">{data.eduTitle}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{data.eduDesc}</p>
                </>
              )}
            </div>
            
          </div>
        </motion.div>

        {/* Selected Publications / Projects */}
        <motion.div variants={slideUp} className="md:col-span-2 glass-panel p-8 border border-[var(--color-neon-cyan)]/30 shadow-[0_0_30px_rgba(0,240,255,0.1)] rounded-2xl relative overflow-hidden bg-[rgba(1,4,9,0.5)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-neon-cyan)]/5 to-transparent pointer-events-none" />
          <h2 className="text-xl font-bold uppercase tracking-widest text-slate-100 flex items-center gap-3 relative z-10 mb-6 drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">
            <BookOpen className="w-6 h-6 text-[var(--color-neon-cyan)]" />
            Field Deployments & Research
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div 
              onClick={() => !isEditing && toast.success("Accessing publication archive...")}
              className="p-4 bg-slate-900/60 border border-[var(--color-neon-cyan)]/20 rounded-xl hover:border-[var(--color-neon-cyan)]/60 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[var(--color-neon-cyan)] uppercase tracking-widest">
                <Award className="w-4 h-4" />
                Research
              </div>
              {isEditing ? (
                <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                  <input name="researchTitle" value={data.researchTitle} onChange={handleChange} className="w-full text-sm font-bold bg-gray-900 border border-cyan-800 text-white rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                  <textarea name="researchDesc" value={data.researchDesc} onChange={handleChange} rows={3} className="w-full text-xs bg-gray-900 border border-cyan-800 text-white rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                </div>
              ) : (
                <>
                  <h3 className="text-sm font-bold text-slate-200 mb-2 leading-tight">{data.researchTitle}</h3>
                  <p className="text-xs text-slate-500">{data.researchDesc}</p>
                </>
              )}
            </div>

            <div 
              onClick={() => !isEditing && toast.success("Initializing deployment metrics telemetry...")}
              className="p-4 bg-slate-900/60 border border-[var(--color-neon-purple)]/20 rounded-xl hover:border-[var(--color-neon-purple)]/60 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[var(--color-neon-purple)] uppercase tracking-widest">
                <Award className="w-4 h-4" />
                Professional
              </div>
              {isEditing ? (
                <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                  <input name="profTitle" value={data.profTitle} onChange={handleChange} className="w-full text-sm font-bold bg-gray-900 border border-cyan-800 text-white rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                  <textarea name="profDesc" value={data.profDesc} onChange={handleChange} rows={3} className="w-full text-xs bg-gray-900 border border-cyan-800 text-white rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                </div>
              ) : (
                <>
                  <h3 className="text-sm font-bold text-slate-200 mb-2 leading-tight">{data.profTitle}</h3>
                  <p className="text-xs text-slate-500">{data.profDesc}</p>
                </>
              )}
            </div>
          </div>
        </motion.div>

      </motion.div>

    </div>
  );
}
