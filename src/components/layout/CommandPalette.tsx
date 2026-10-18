"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Terminal, Database, Activity, FileText, ArrowRight, CornerDownLeft, Globe, Briefcase, Cpu } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ALL_COMMANDS = [
  // --- Navigation: Scientist Modules ---
  { id: 'dt', title: 'Open Ecosystem Digital Twin', category: 'Module 04: The Autonomous Scientist', icon: Activity, path: '/scientist/digital-twin', msg: 'Navigating to Ecosystem Digital Twin.' },
  { id: 'drone', title: 'Launch Drone/Satellite Vision', category: 'Module 05: The Autonomous Scientist', icon: Globe, path: '/scientist/drone-vision', msg: 'Initializing Drone and Satellite Vision uplink.' },
  { id: 'gear', title: 'Open Gear Efficiency Vision', category: 'Module 05: The Autonomous Scientist', icon: Cpu, path: '/scientist/gear-vision', msg: 'Accessing Bycatch and Gear Efficiency Vision.' },
  
  // --- Navigation: Ecosystem & Automation ---
  { id: 'pol', title: 'Run Socio-Ecological Policy Generator', category: 'Module 07: Automation', icon: FileText, path: '/automation/policy-generator', msg: 'Loading socio-ecological policy generator.' },
  { id: 'rep', title: 'Open Automated Reporting Engine', category: 'Module 07: Automation', icon: Terminal, path: '/automation/reporting', msg: 'Accessing automated reporting engine.' },
  { id: 'port', title: 'Generate Academic Portfolio', category: 'Module 07: Automation', icon: Briefcase, path: '/automation/portfolio-generator', msg: 'Initializing academic portfolio generator.' },
  
  // --- Navigation: Commercial Modules ---
  { id: 'daas', title: 'DaaS Open API Gateway', category: 'Module 08: Commercial Scaling', icon: Database, path: '/commercial/daas-api', msg: 'Opening Data as a Service API gateway.' },
  { id: 'b2b', title: 'Sustainable B2B Marketplace', category: 'Module 08: Commercial Scaling', icon: Database, path: '/commercial/marketplace', msg: 'Connecting to Sustainable B 2 B marketplace.' },
  
  // --- Local DB Queries (Mock) ---
  { id: 's1', title: "Search local reports for 'Mirsharai'", category: 'Local IndexedDB', icon: Search, path: '#', msg: 'Querying local database for Mirsharai reports.' },
  { id: 's2', title: "Query Microplastics AI Model", category: 'Local IndexedDB', icon: Search, path: '#', msg: 'Initializing microplastics A I model query.' },
  { id: 's3', title: "Export all Synced Data to CSV", category: 'System Action', icon: Database, path: '#', msg: 'Data export initiated. Formatting payload.' },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Global Keyboard Listener for Trigger
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filteredCommands = ALL_COMMANDS.filter(cmd => 
    cmd.title.toLowerCase().includes(query.toLowerCase()) || 
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll to selected item
  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const executeCommand = (cmd: typeof ALL_COMMANDS[0]) => {
    // 1. JARVIS Voice Confirmation
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance(cmd.msg);
      msg.rate = 0.95; 
      msg.pitch = 0.85;
      window.speechSynthesis.speak(msg);
    }

    // 2. Routing / Action
    if (cmd.path !== '#') {
      router.push(cmd.path);
    }

    // 3. Cleanup
    setIsOpen(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredCommands.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(filteredCommands[selectedIndex]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-[#010409]/80 backdrop-blur-md"
          onClick={() => setIsOpen(false)}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-[650px] bg-[#020b14]/95 border border-cyan-500/50 rounded-2xl shadow-[0_0_80px_rgba(34,211,238,0.15)] flex flex-col overflow-hidden relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20 pointer-events-none z-0" />

            {/* Header / Input */}
            <div className="flex items-center px-6 py-4 border-b border-cyan-900/60 relative z-10 bg-cyan-950/20">
              <Search className="w-6 h-6 text-cyan-400 mr-4 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Command the ecosystem... (Navigate, Search, Execute)"
                className="w-full bg-transparent border-none outline-none text-lg text-cyan-300 placeholder-cyan-800 font-mono tracking-wide"
              />
              <div className="flex items-center gap-2 shrink-0 text-[10px] text-cyan-700 font-bold bg-[#01060c] px-2 py-1 rounded border border-cyan-900/50">
                <span>ESC</span> TO CLOSE
              </div>
            </div>

            {/* Command List */}
            <div className="max-h-[400px] overflow-y-auto p-3 relative z-10 custom-scrollbar" ref={listRef}>
              {filteredCommands.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-cyan-800">
                  <Terminal className="w-10 h-10 mb-4 opacity-50" />
                  <span className="text-xs tracking-[0.2em] font-bold uppercase">No matching directives found in matrix</span>
                </div>
              ) : (
                filteredCommands.map((cmd, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <div 
                      key={cmd.id}
                      onClick={() => executeCommand(cmd)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-200 group
                        ${isSelected 
                          ? 'bg-cyan-950/60 border border-cyan-400 shadow-[inset_0_0_15px_rgba(34,211,238,0.2)]' 
                          : 'bg-transparent border border-transparent text-cyan-700 hover:bg-cyan-950/20 hover:text-cyan-500'
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg transition-colors ${isSelected ? 'bg-cyan-900' : 'bg-[#010811] border border-cyan-900/40 group-hover:border-cyan-800'}`}>
                          <cmd.icon className={`w-4 h-4 ${isSelected ? 'text-cyan-300' : 'text-cyan-700 group-hover:text-cyan-500'}`} />
                        </div>
                        <div className="flex flex-col">
                           <span className={`text-sm font-bold tracking-wider ${isSelected ? 'text-cyan-300' : ''}`}>
                             {cmd.title}
                           </span>
                           <span className={`text-[9px] tracking-[0.2em] uppercase mt-1 ${isSelected ? 'text-cyan-500' : 'text-cyan-800'}`}>
                             {cmd.category}
                           </span>
                        </div>
                      </div>
                      
                      {isSelected && (
                        <div className="flex items-center gap-2 text-cyan-500">
                           <span className="text-[9px] tracking-widest font-bold">EXECUTE</span>
                           <CornerDownLeft className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
            
            {/* Footer */}
            <div className="border-t border-cyan-900/50 bg-[#01060c]/80 p-3 flex justify-between items-center text-[9px] text-cyan-800 font-bold tracking-[0.2em] relative z-10">
               <div>OMNI-SEARCH INTERFACE v2.4</div>
               <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1"><ArrowRight className="w-3 h-3" /> NAVIGATE</span>
                  <span className="flex items-center gap-1"><CornerDownLeft className="w-3 h-3" /> SELECT</span>
               </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
