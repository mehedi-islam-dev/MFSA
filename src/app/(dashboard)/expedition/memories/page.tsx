"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Users, Calendar, PlusSquare, BookHeart, Compass, Camera, HardDrive, CheckCircle, Image as ImageIcon } from 'lucide-react';

interface LogEntry {
  id: string;
  date: string;
  location: string;
  team: string;
  notes: string;
  hasPhoto: boolean;
}

const INITIAL_ENTRIES: LogEntry[] = [
  {
    id: 'entry-1',
    date: 'May 14, 2026',
    location: 'Mirsharai / Shaherkhali Coast',
    team: 'Mehedi, Rahman, Dr. Islam',
    notes: 'Length-frequency sampling at Mirsharai estuary. Tough conditions during low tide, but successfully recorded 87 total length measurements for Tenualosa ilisha. Pelagic catch composition was dominated by juveniles in zone A, with larger adults concentrated at the deeper channel mouth in zone B.',
    hasPhoto: true,
  }
];

export default function FieldLogbook() {
  const [entries, setEntries] = useState<LogEntry[]>(INITIAL_ENTRIES);
  const [isLogging, setIsLogging] = useState(false);
  
  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [team, setTeam] = useState('');
  const [notes, setNotes] = useState('');
  const [photoUploaded, setPhotoUploaded] = useState(false);

  // --- ACTIONS ---
  const handleLogExpedition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !notes) return;

    setIsLogging(true);

    setTimeout(() => {
      const newEntry: LogEntry = {
        id: `entry-${Date.now()}`,
        date: new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        location,
        team,
        notes,
        hasPhoto: photoUploaded
      };

      setEntries(prev => [newEntry, ...prev]);
      
      // Reset form
      setLocation('');
      setTeam('');
      setNotes('');
      setPhotoUploaded(false);
      setIsLogging(false);

      // JARVIS Voice
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance("Expedition memory securely archived. Visuals and field notes synced to local vault.");
        msg.rate = 0.95; msg.pitch = 0.85;
        window.speechSynthesis.speak(msg);
      }
    }, 1500); // Simulated processing time
  };

  return (
    <div className="min-h-[calc(100vh-2rem)] font-mono flex flex-col p-4 lg:p-8 text-cyan-500 overflow-x-hidden">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-cyan-900/60 pb-6 gap-4 shrink-0 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-[0.25em] text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] flex items-center gap-4">
            <BookHeart className="w-8 h-8" />
            EXPEDITION MEMORIES
          </h1>
          <p className="text-xs text-cyan-600 tracking-[0.3em] mt-2 font-bold uppercase">Personal Field Logbook & Holographic Archive</p>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 items-start">
        
        {/* Left Panel: Memory Input Form */}
        <div className="lg:col-span-1 glass-panel p-6 flex flex-col gap-6 sticky top-8">
          <h2 className="text-xs font-bold tracking-[0.2em] text-cyan-400 border-b border-cyan-900/50 pb-2 flex items-center gap-2">
            <PlusSquare className="w-4 h-4" /> LOG NEW MEMORY
          </h2>

          <form onSubmit={handleLogExpedition} className="flex flex-col gap-4 mt-2">
            
            <div className="flex flex-col gap-1">
               <label className="text-[9px] tracking-widest text-cyan-600 font-bold uppercase flex items-center gap-1"><Calendar className="w-3 h-3"/> Expedition Date</label>
               <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-[#01060c] border border-cyan-900/50 rounded px-3 py-2 text-xs text-cyan-300 focus:outline-none focus:border-cyan-500 transition-colors"
                  required
               />
            </div>

            <div className="flex flex-col gap-1">
               <label className="text-[9px] tracking-widest text-cyan-600 font-bold uppercase flex items-center gap-1"><Map className="w-3 h-3"/> Location</label>
               <input 
                  type="text" 
                  placeholder="e.g., Shaherkhali / Saiyadpur"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-[#01060c] border border-cyan-900/50 rounded px-3 py-2 text-xs text-cyan-300 focus:outline-none focus:border-cyan-500 transition-colors"
                  required
               />
            </div>

            <div className="flex flex-col gap-1">
               <label className="text-[9px] tracking-widest text-cyan-600 font-bold uppercase flex items-center gap-1"><Users className="w-3 h-3"/> Team Members</label>
               <input 
                  type="text" 
                  placeholder="e.g., Dr. Smith, Mehedi"
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  className="bg-[#01060c] border border-cyan-900/50 rounded px-3 py-2 text-xs text-cyan-300 focus:outline-none focus:border-cyan-500 transition-colors"
               />
            </div>

            <div className="flex flex-col gap-1">
               <label className="text-[9px] tracking-widest text-cyan-600 font-bold uppercase">Field Notes & Reflections</label>
               <textarea 
                  rows={4}
                  placeholder="Log your observations, struggles, and triumphs..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-[#01060c] border border-cyan-900/50 rounded px-3 py-2 text-xs text-cyan-300 focus:outline-none focus:border-cyan-500 transition-colors resize-none custom-scrollbar"
                  required
               />
            </div>

            {/* Neon Bordered Dropzone */}
            <div 
               className={`w-full h-24 mt-2 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-300
                  ${photoUploaded ? 'bg-cyan-950/30 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)] text-cyan-300' : 'bg-[#01060c] border-cyan-900/50 text-cyan-700 hover:border-cyan-500/80 hover:bg-cyan-950/20'}`}
               onClick={() => setPhotoUploaded(!photoUploaded)}
            >
               {photoUploaded ? (
                  <>
                     <CheckCircle className="w-6 h-6 mb-2" />
                     <span className="text-[9px] font-bold tracking-widest">PHOTO ATTACHED</span>
                  </>
               ) : (
                  <>
                     <ImageIcon className="w-6 h-6 mb-2" />
                     <span className="text-[9px] font-bold tracking-widest">CLICK TO ATTACH PHOTO</span>
                  </>
               )}
            </div>

            <button 
               type="submit"
               disabled={isLogging || !location || !notes}
               className={`w-full py-4 mt-4 rounded-lg font-bold tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 transition-all duration-300 border
                 ${isLogging ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.4)] cursor-not-allowed' : 
                   (!location || !notes) ? 'bg-[#010409] border-cyan-900/30 text-cyan-800 cursor-not-allowed' :
                   'bg-cyan-950 border-cyan-400 text-cyan-300 hover:bg-cyan-900 hover:shadow-[0_0_20px_#22d3ee] active:scale-95'}`}
            >
               {isLogging ? (
                  <span className="animate-pulse">ARCHIVING MEMORY...</span>
               ) : (
                  <>
                     <HardDrive className="w-4 h-4" /> LOG EXPEDITION
                  </>
               )}
            </button>
          </form>
        </div>

        {/* Center Display: The Memory Timeline */}
        <div className="lg:col-span-2 relative min-h-[600px] pb-24">
           
           {/* Timeline Line */}
           <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 via-cyan-900/50 to-transparent shadow-[0_0_10px_#22d3ee]" />

           <div className="flex flex-col gap-12 w-full pt-8">
              <AnimatePresence>
                 {entries.map((entry, index) => {
                    const isEven = index % 2 === 0;

                    return (
                       <motion.div 
                          key={entry.id}
                          initial={{ opacity: 0, y: 50, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                          className={`relative flex w-full md:justify-between items-center ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'}`}
                       >
                          
                          {/* Timeline Node */}
                          <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-[#010409] border-2 border-cyan-400 shadow-[0_0_15px_#22d3ee] transform -translate-x-1/2 z-10" />

                          {/* Content Card */}
                          <div className={`w-[calc(100%-4rem)] ml-[4rem] md:ml-0 md:w-[calc(50%-3rem)] glass-panel p-6 relative group hover:border-cyan-400/80 transition-colors duration-500`}>
                             
                             <div className="text-[10px] font-bold tracking-[0.2em] text-cyan-400 mb-4 flex items-center gap-2">
                                <Calendar className="w-3 h-3" /> {entry.date}
                             </div>
                             
                             <p className="text-xs leading-relaxed text-cyan-100 tracking-wide mb-6">
                                "{entry.notes}"
                             </p>

                             <div className="flex flex-col gap-2 pt-4 border-t border-cyan-900/50">
                                <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest text-cyan-600 uppercase">
                                   <Map className="w-3 h-3" /> {entry.location}
                                </div>
                                {entry.team && (
                                   <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest text-cyan-600 uppercase">
                                      <Users className="w-3 h-3" /> {entry.team}
                                   </div>
                                )}
                             </div>

                             {/* Polaroid Mock Image */}
                             {entry.hasPhoto && (
                                <div className="mt-6 p-2 bg-[#fdfdfd] shadow-xl rotate-1 group-hover:rotate-0 group-hover:scale-105 transition-all duration-500 ease-out origin-bottom">
                                   <div className="w-full h-32 bg-gray-200 overflow-hidden relative border border-gray-300">
                                      {/* Mock noisy ocean/sediment image feel */}
                                      <div className="absolute inset-0 bg-cyan-900 opacity-20" />
                                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" />
                                      <div className="w-full h-full flex items-center justify-center">
                                         <Camera className="w-8 h-8 text-gray-400" />
                                      </div>
                                   </div>
                                   <div className="pt-2 text-center">
                                      <span className="font-serif text-[10px] italic text-gray-600">Field capture - {entry.location.split('/')[0].trim()}</span>
                                   </div>
                                </div>
                             )}

                          </div>

                       </motion.div>
                    );
                 })}
              </AnimatePresence>
           </div>
        </div>

        {/* Right Panel: Journey Stats */}
        <div className="lg:col-span-1 glass-panel p-6 flex flex-col gap-6 h-fit sticky top-8">
          <h2 className="text-xs font-bold tracking-[0.2em] text-cyan-400 border-b border-cyan-900/50 pb-2 flex items-center gap-2">
            <Compass className="w-4 h-4" /> JOURNEY STATS
          </h2>

          <div className="flex flex-col gap-4 mt-2">
            
            <div className="p-4 rounded bg-[#01060c] border border-cyan-900/50 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
                  <Compass className="w-8 h-8 text-cyan-500" />
               </div>
               <span className="text-[10px] tracking-widest text-cyan-700 font-bold uppercase block mb-1">Total Expeditions</span>
               <span className="text-3xl font-bold text-cyan-300">12</span>
            </div>

            <div className="p-4 rounded bg-[#01060c] border border-cyan-900/50 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
                  <Camera className="w-8 h-8 text-cyan-500" />
               </div>
               <span className="text-[10px] tracking-widest text-cyan-700 font-bold uppercase block mb-1">Photos Logged</span>
               <span className="text-3xl font-bold text-cyan-300">48</span>
            </div>

            <div className="p-4 rounded bg-[#01060c] border border-cyan-900/50 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
                  <BookHeart className="w-8 h-8 text-cyan-500" />
               </div>
               <span className="text-[10px] tracking-widest text-cyan-700 font-bold uppercase block mb-1">Memories Archived</span>
               <span className="text-3xl font-bold text-cyan-300">{entries.length + 23}</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
