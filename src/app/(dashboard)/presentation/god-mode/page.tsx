"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  FastForward,
  Rewind,
  Activity,
  Database,
  Globe,
  Network,
  Cpu,
  Camera,
  FileText,
  Box,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";

// --- CONFIGURATION ---
const SLIDE_DURATION_MS = 5000;

const SLIDES = [
  {
    id: 1,
    title: "AI CAMERA VISION",
    subtitle: "MODULE 02: SMART DATA COLLECTION",
    icon: Camera,
    desc: "Real-time biometric extraction and IndexedDB offline persistence.",
  },
  {
    id: 2,
    title: "ELEFAN ANALYTICS",
    subtitle: "MODULE 04: CORE ANALYTICS",
    icon: Activity,
    desc: "Advanced Length-Frequency modeling and stock status (LB-SPR) generation.",
  },
  {
    id: 3,
    title: "ECOSYSTEM DIGITAL TWIN",
    subtitle: "MODULE 04: SPATIAL MODELING",
    icon: Globe,
    desc: "Real-time 3D estuarine tracking and environmental parameter mapping.",
  },
  {
    id: 4,
    title: "GEAR EFFICIENCY & BYCATCH",
    subtitle: "MODULE 05: AUTONOMOUS SCIENTIST",
    icon: Network,
    desc: "Deep-sea neural nets isolating target species from critical bycatch.",
  },
  {
    id: 5,
    title: "eDNA BIODIVERSITY MAPPER",
    subtitle: "MODULE 06: ADVANCED ONE HEALTH",
    icon: Cpu,
    desc: "Holographic genetic sequencing mapping complex estuarine biodiversity.",
  },
  {
    id: 6,
    title: "POLICY GENERATOR",
    subtitle: "MODULE 07: AUTOMATION",
    icon: FileText,
    desc: "n8n-driven LLM synthesis automating Socio-Ecological EIA generation.",
  },
  {
    id: 7,
    title: "DaaS OPEN API",
    subtitle: "MODULE 08: COMMERCIAL SCALING",
    icon: Database,
    desc: "Enterprise data gateways transforming ecological metrics into secure APIs.",
  },
  {
    id: 8,
    title: "B2B MARKETPLACE",
    subtitle: "MODULE 08: COMMERCIAL SCALING",
    icon: Box,
    desc: "Oracle-verified smart contracts bridging raw science with sustainable commerce.",
  },
];

export default function GodModePresentation() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [manualOverride, setManualOverride] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // --- Auto-Advance Logic ---
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && !manualOverride) {
      timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
      }, SLIDE_DURATION_MS);
    }
    return () => clearInterval(timer);
  }, [isPlaying, manualOverride]);

  // --- Execution Protocol ---
  const handlePlaySequence = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      setManualOverride(false);
      setCurrentSlide(0);

      // Speech synthesis voiceover
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(
          "Initiating Master Mode. Welcome to Marine Analytica. Commencing automated showcase of the end-to-end autonomous marine intelligence ecosystem."
        );
        msg.rate = 0.95;
        msg.pitch = 0.85;
        window.speechSynthesis.speak(msg);
      }
    } else {
      setIsPlaying(false);
    }
  };

  const handleManualNav = (dir: "next" | "prev") => {
    setManualOverride(true);
    if (dir === "next") {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    } else {
      setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    }
  };

  // --- Animation Variants ---
  const slideVariants = {
    enter: { opacity: 0, scale: 0.9, filter: "blur(12px)", y: 30 },
    center: { zIndex: 1, x: 0, y: 0, opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: { zIndex: 0, opacity: 0, scale: 1.08, filter: "blur(12px)", y: -30 },
  };

  const activeSlideData = SLIDES[currentSlide];
  const progressPercent = ((currentSlide + 1) / SLIDES.length) * 100;

  return (
    <div className="fixed inset-0 z-[100] w-full h-screen bg-slate-950 overflow-hidden flex flex-col justify-between p-6 md:p-12 box-border font-mono text-cyan-400 select-none">
      {/* Background Grid & Vignette */}
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.04]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#020617_100%)]" />
      </div>

      {/* --- TOP BAR --- */}
      <header className="w-full flex items-center justify-between px-4 relative z-20 shrink-0">
        <div className="text-left">
          <h1
            className={`text-lg md:text-xl font-bold tracking-[0.35em] ${
              isPlaying
                ? "text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]"
                : "text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]"
            }`}
          >
            MARINE ANALYTICA
          </h1>
          <p className="text-[10px] tracking-widest uppercase mt-1 text-cyan-600 font-semibold">
            Master Mode Presentation Matrix
          </p>
        </div>

        <div className="flex items-center gap-3">
          {manualOverride && (
            <div className="flex items-center gap-1.5 text-yellow-400 bg-yellow-950/40 px-3 py-1.5 rounded-lg border border-yellow-800/60 text-[10px] tracking-widest font-bold font-mono">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>MANUAL OVERRIDE</span>
            </div>
          )}
          <Link
            href="/system"
            className="px-5 py-2 text-xs tracking-[0.2em] font-bold border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/20 hover:text-white hover:border-cyan-400 transition-all rounded-lg backdrop-blur-md cursor-pointer uppercase shadow-[0_0_12px_rgba(6,182,212,0.15)]"
          >
            EXIT MATRIX
          </Link>
        </div>
      </header>

      {/* --- CENTER DISPLAY: CINEMATIC CAROUSEL --- */}
      <main className="relative z-10 w-full flex-1 flex items-center justify-center my-auto min-h-0">
        <div className="w-full max-w-4xl mx-auto px-6 text-center flex flex-col items-center justify-center my-auto">
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.div
                key={currentSlide}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                className="w-full flex flex-col items-center justify-center text-center"
              >
                {/* Icon Circle */}
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="w-24 h-24 md:w-28 md:h-28 rounded-full border border-cyan-400/40 bg-cyan-950/30 shadow-[0_0_50px_rgba(34,211,238,0.25)] flex items-center justify-center mb-6 shrink-0"
                >
                  <activeSlideData.icon className="w-12 h-12 md:w-14 md:h-14 text-cyan-300 drop-shadow-[0_0_15px_#22d3ee]" />
                </motion.div>

                {/* Subtitle / Module tag */}
                <motion.h3
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-xs md:text-sm tracking-[0.4em] text-cyan-400 font-bold uppercase mb-3"
                >
                  {activeSlideData.subtitle}
                </motion.h3>

                {/* Main Heading */}
                <motion.h2
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-wider break-words whitespace-normal leading-tight text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.4)] mb-4 max-w-3xl"
                >
                  {activeSlideData.title}
                </motion.h2>

                {/* Subtitle / Description */}
                <motion.p
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="max-w-2xl mx-auto text-sm md:text-lg text-cyan-400/80 mt-2 leading-relaxed"
                >
                  {activeSlideData.desc}
                </motion.p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="w-full flex flex-col items-center text-center justify-center"
              >
                <div className="w-24 h-24 rounded-full border border-cyan-800/40 bg-cyan-950/20 flex items-center justify-center mb-6">
                  <Activity className="w-12 h-12 text-cyan-600/70" />
                </div>
                <h2 className="text-2xl sm:text-4xl tracking-[0.3em] font-bold text-cyan-400 uppercase drop-shadow-[0_0_15px_rgba(6,182,212,0.4)] mb-2">
                  SYSTEM STANDBY
                </h2>
                <p className="text-xs md:text-sm text-cyan-700 tracking-widest uppercase mt-2">
                  Awaiting Master Mode Activation
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* --- BOTTOM PANEL: SCRUBBER & CONTROLS --- */}
      <footer className="w-full relative z-20 flex flex-col items-center gap-4 mt-8 mb-2 shrink-0">
        {/* Floating Controls */}
        <div className="flex items-center gap-4 md:gap-6 px-6 py-2.5 rounded-full bg-slate-900/90 border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.2)]">
          <button
            type="button"
            onClick={() => handleManualNav("prev")}
            className="p-2.5 rounded-full hover:bg-cyan-950/60 text-cyan-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Previous Slide"
          >
            <Rewind className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handlePlaySequence}
            className={`px-6 md:px-8 py-2.5 rounded-full font-bold tracking-[0.2em] text-xs md:text-sm flex items-center gap-2.5 transition-all duration-300 cursor-pointer ${
              isPlaying
                ? "bg-transparent border border-cyan-400 text-cyan-300 shadow-[inset_0_0_15px_rgba(34,211,238,0.3)] hover:bg-cyan-950/40"
                : "bg-cyan-500 text-slate-950 shadow-[0_0_25px_rgba(34,211,238,0.6)] hover:bg-cyan-400 hover:scale-105"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" /> SYSTEM ACTIVE
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> PLAY SEQUENCE
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleManualNav("next")}
            className="p-2.5 rounded-full hover:bg-cyan-950/60 text-cyan-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Next Slide"
          >
            <FastForward className="w-5 h-5" />
          </button>
        </div>

        {/* Timeline Scrubber */}
        <div className="w-full max-w-3xl flex items-center gap-3 px-4">
          <span className="text-[10px] font-bold text-cyan-700 tracking-wider font-mono">01</span>
          <div className="flex-1 h-1.5 bg-cyan-950/80 rounded-full overflow-hidden relative border border-cyan-900/40">
            <motion.div
              className="absolute top-0 bottom-0 left-0 bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </div>
          <span className="text-[10px] font-bold text-cyan-700 tracking-wider font-mono">08</span>
        </div>
      </footer>
    </div>
  );
}
