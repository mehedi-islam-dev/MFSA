"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Terminal, Settings, ShieldCheck, Database, ClipboardList, Map, TestTube,
  LineChart, Globe, Leaf, Waves, Cpu, Camera, Eye, BrainCircuit,
  FileSignature, FileText, GraduationCap, Briefcase, ShoppingCart, Network,
  User, LogOut, Menu, X, MonitorPlay, Activity, FilePlus, Globe2, Bug
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/ui/Logo";
import { signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import { useData } from "@/components/providers/DataProvider";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeLang, setActiveLang] = useState("EN");
  const { isAdmin, setIsAdmin } = useData();

  const handleLogout = async () => {
    const loadingToast = toast.loading("Disconnecting...");
    try {
      await signOut();
      localStorage.removeItem("guestMode");
      toast.success("Disconnected successfully", { id: loadingToast });
      router.push("/login");
    } catch (err) {
      toast.error("Failed to disconnect", { id: loadingToast });
    }
  };

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const menuSections = [
    {
      title: "1. CORE SAAS ARCHITECTURE",
      links: [
        { href: "/system", label: "Command Center", icon: Terminal },
        { href: "/settings", label: "Global Settings", icon: Settings },
        { href: "/security/data-vault", label: "Security & Auth", icon: ShieldCheck },
        { href: "/tracker", label: "Issue Tracker", icon: Bug },
      ]
    },
    {
      title: "2. SMART DATA COLLECTION",
      links: [
        { href: "/ai-vision", label: "AI Photo-to-Length", icon: Camera },
        { href: "/vision", label: "Computer Vision", icon: Eye },
        { href: "/lab/feed-optimizer", label: "Smart Ichthyometer", icon: TestTube },
        { href: "/collection/lf-sync", label: "Data Collection", icon: ClipboardList },
        { href: "/expedition/memories", label: "Offline Mode PWA", icon: Map },
        { href: "/network/mesh-sync", label: "Citizen Science", icon: Network },
      ]
    },
    {
      title: "3. DATA MANAGEMENT",
      links: [
        { href: "/data-entry/spreadsheet", label: "In-App Spreadsheet", icon: Database },
        { href: "/data-entry", label: "AI Data Ingestion", icon: ClipboardList },
        { href: "/data-entry/new", label: "New Data Entry", icon: FilePlus },
        { href: "/automation", label: "AI Data Cleaning", icon: Cpu },
      ]
    },
    {
      title: "4. ADVANCED POPULATION DYNAMICS",
      links: [
        { href: "/analysis", label: "Core Math Engine", icon: LineChart },
        { href: "/elefan", label: "Automated ELEFAN", icon: Activity },
      ]
    },
    {
      title: "5. THE AUTONOMOUS SCIENTIST",
      links: [
        { href: "/scientist/llm-interpretation", label: "LLM Interpretation", icon: BrainCircuit },
        { href: "/ecosystem", label: "Ocean Digital Twin", icon: Leaf },
        { href: "/bioacoustics", label: "AI Bioacoustics", icon: Waves },
      ]
    },
    {
      title: "6. ADVANCED ECOSYSTEM",
      links: [
        { href: "/ecosystem/edna-mapper", label: "eDNA Mapper", icon: Globe },
        { href: "/eia", label: "EIA Dashboard", icon: ShieldCheck },
      ]
    },
    {
      title: "7. AUTOMATION & CAREER",
      links: [
        { href: "/automation/policy-generator", label: "Policy Generator", icon: FileSignature },
        { href: "/reports", label: "Automated Reporting", icon: FileText },
        { href: "/academic", label: "Academic Portfolio", icon: GraduationCap },
      ]
    },
    {
      title: "8. COMMERCIAL SCALING",
      links: [
        { href: "/commercial", label: "DaaS Open API", icon: Briefcase },
        { href: "/marketplace", label: "B2B Marketplace", icon: ShoppingCart },
      ]
    }
  ];

  const renderNavContent = () => (
    <>
      <div className="p-6 border-b border-cyan-500/20 relative z-10 shrink-0 bg-transparent flex items-center">
        <Logo className="!gap-3" imageClassName="h-8 w-auto md:h-10" />
      </div>
      
      <nav className="flex-1 p-4 overflow-y-auto relative z-10 scrollbar-hide">
        {menuSections.map((section, idx) => (
          <div key={idx} className="mb-6">
            <h2 className="text-cyan-500/70 text-[10px] font-extrabold uppercase tracking-widest mt-2 mb-3 px-4 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">
              {section.title}
            </h2>
            <div className="space-y-1">
              {section.links.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(`${link.href}/`));
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all z-10 group ${
                      isActive 
                        ? "text-cyan-950 font-bold" 
                        : "text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/30 border border-transparent hover:border-cyan-500/30 hover:shadow-[inset_4px_0_0_rgba(34,211,238,0.8)]"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 bg-cyan-400 rounded-xl -z-10 shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-cyan-950' : 'group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]'}`} />
                    <span className="relative z-10 text-[13px] tracking-wide truncate">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-cyan-500/20 relative z-10 shrink-0 flex flex-col gap-3">
        <Link
          href="/presentation"
          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-cyan-950/40 border border-purple-500/50 text-purple-400 hover:bg-purple-900/60 hover:text-white hover:shadow-[0_0_25px_rgba(168,85,247,0.8)] rounded-xl transition-all font-bold text-sm uppercase tracking-widest animate-pulse hover:animate-none"
        >
          <MonitorPlay className="w-4 h-4" />
          STRATEGIC OVERVIEW
        </Link>
        
        <div className="flex justify-between items-center px-4 py-2 bg-cyan-950/20 border border-cyan-900/50 rounded-xl">
          <div className="flex items-center gap-2 text-cyan-400">
            <Globe2 className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-widest uppercase">Language</span>
          </div>
          <div className="flex gap-1">
            {["EN", "BN", "ES"].map(lang => (
              <button 
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={`text-[9px] font-black px-1.5 py-0.5 rounded transition-all ${activeLang === lang ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(0,240,255,0.6)]' : 'text-cyan-600 hover:text-cyan-300'}`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-2 bg-cyan-950/20 border border-cyan-900/50 rounded-xl p-3 shadow-[inset_0_0_15px_rgba(34,211,238,0.05)]">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setIsAdmin(!isAdmin)}
            title="Click to toggle Role for testing"
          >
            <div className="w-10 h-10 rounded-full bg-cyan-900 border border-cyan-400 flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.5)] group-hover:bg-cyan-800 transition-colors">
              <User className="w-5 h-5 text-cyan-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-cyan-100 text-sm font-bold tracking-wider group-hover:text-cyan-300 transition-colors">MEHEDI ISLAM</span>
              <span className={`text-[10px] tracking-widest uppercase ${isAdmin ? 'text-cyan-500/70' : 'text-purple-400'}`}>
                {isAdmin ? 'System Admin' : 'Field Researcher'}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 mt-1 bg-transparent border border-cyan-900/50 text-cyan-500/70 hover:bg-red-900/40 hover:border-red-500/50 hover:text-red-400 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] rounded-lg transition-all font-bold text-[10px] uppercase tracking-widest"
          >
            <LogOut className="w-3 h-3" />
            Disconnect
          </button>
        </div>

      </div>
    </>
  );

  return (
    <>
      {/* Mobile Floating Toggle Button */}
      <button 
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 bg-cyan-950/80 backdrop-blur-xl border border-cyan-400/50 p-2.5 rounded-xl text-cyan-400 hover:text-white shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.8)] transition-all"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Slide-In Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-50 bg-[#030712]/80 backdrop-blur-sm"
          >
            {/* Slide-In Menu */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-[85%] max-w-[320px] h-full bg-cyan-950/40 backdrop-blur-3xl border-r border-cyan-400/20 shadow-[10px_0_30px_rgba(6,182,212,0.15)] flex flex-col relative overflow-hidden"
            >
              <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(6,182,212,0.1)] z-0"></div>
              
              <button 
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-6 right-4 z-50 text-cyan-500 hover:text-cyan-300 transition-colors bg-cyan-950/80 p-2 rounded-lg border border-cyan-500/30"
              >
                <X className="w-5 h-5" />
              </button>

              {renderNavContent()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col w-72 backdrop-blur-3xl bg-cyan-950/10 border border-cyan-400/20 shadow-[0_0_30px_rgba(6,182,212,0.15)] text-white h-[calc(100vh-2rem)] ml-4 my-4 rounded-3xl shrink-0 relative overflow-hidden" id="tour-sidebar">
        <div className="absolute inset-0 pointer-events-none rounded-3xl shadow-[inset_0_0_20px_rgba(6,182,212,0.1)] border border-cyan-400/10 z-0"></div>
        {renderNavContent()}
      </aside>
    </>
  );
}
