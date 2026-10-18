"use client";

import { useState, useRef } from "react";
import { Camera, ScanLine, Upload, Sparkles, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AIVisionPage() {
  const [imageUploaded, setImageUploaded] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    const url = URL.createObjectURL(f);
    setImagePreviewUrl(url);
    setImageName(f.name);
    setImageUploaded(true);
    setScanComplete(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    const url = URL.createObjectURL(f);
    setImagePreviewUrl(url);
    setImageName(f.name);
    setImageUploaded(true);
    setScanComplete(false);
  };

  const handleScan = () => {
    setIsScanning(true);
    setScanComplete(false);
    
    // Simulate scan duration
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 4000);
  };

  const handleReset = () => {
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setImageUploaded(false);
    setImagePreviewUrl(null);
    setImageName(null);
    setIsScanning(false);
    setScanComplete(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-mono text-[var(--color-neon-cyan)] relative">
      
      {/* Header */}
      <div className="border-b border-[var(--color-neon-cyan)]/30 pb-4 relative">
        <h1 className="text-3xl font-black flex items-center gap-3 text-[var(--color-neon-cyan)] uppercase tracking-[0.3em] drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]">
          <Camera className="w-8 h-8" />
          AI Photo-to-Length Vision
        </h1>
        <p className="text-sm font-bold text-[var(--color-neon-purple)] uppercase tracking-widest mt-2">
          Autonomous Species Detection & Measurement
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        
        {/* Main Scanner Viewfinder */}
        <div className="lg:col-span-3 glass-panel p-6 border border-[var(--color-neon-cyan)]/30 shadow-[0_0_30px_rgba(0,240,255,0.1)] rounded-2xl relative overflow-hidden bg-[rgba(1,4,9,0.5)] min-h-[450px] flex flex-col justify-center items-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-neon-cyan)]/5 to-transparent pointer-events-none" />
          
          {/* Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.05)_1px,transparent_1px)] bg-[size:1rem_1rem] pointer-events-none" />
          
          {/* Viewfinder Corners */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[var(--color-neon-cyan)] opacity-50" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[var(--color-neon-cyan)] opacity-50" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[var(--color-neon-cyan)] opacity-50" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[var(--color-neon-cyan)] opacity-50" />

          {!imageUploaded ? (
            <>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUpload}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="relative z-10 flex flex-col items-center justify-center gap-4 cursor-pointer p-12 border-2 border-dashed border-[var(--color-neon-cyan)]/50 rounded-xl hover:bg-[var(--color-neon-cyan)]/10 hover:border-[var(--color-neon-cyan)] hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all group w-[80%] aspect-video"
              >
                <Upload className="w-12 h-12 text-[var(--color-neon-cyan)] group-hover:drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
                <div className="text-center">
                  <p className="font-bold uppercase tracking-widest text-slate-200">Upload Target Image</p>
                  <p className="text-xs text-slate-500 mt-2">Drag & Drop or Click to Browse</p>
                </div>
              </motion.div>
            </>
          ) : (
            <div className="relative w-[90%] aspect-video bg-[#01060c] rounded-lg border border-[var(--color-neon-cyan)]/20 overflow-hidden flex items-center justify-center">
              {imagePreviewUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={imagePreviewUrl} alt={imageName ?? 'uploaded'} className="w-full h-full object-contain" />
              ) : (
                <div className="w-[80%] h-[50%] bg-slate-800 rounded-[100%] opacity-50 flex items-center justify-center relative">
                  <span className="text-slate-600 font-bold uppercase tracking-widest text-sm absolute">Target Acquired</span>
                </div>
              )}

              {/* Scanning Overlay Animation */}
              <AnimatePresence>
                {isScanning && (
                  <>
                    <motion.div 
                      initial={{ top: 0 }}
                      animate={{ top: "100%" }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                      className="absolute w-full h-1 bg-[var(--color-neon-cyan)] shadow-[0_0_15px_rgba(0,240,255,1)] z-20"
                    />
                    <div className="absolute inset-0 bg-[var(--color-neon-cyan)]/10 z-10" />
                    
                    {/* Simulated Bounding Boxes flashing */}
                    <motion.div
                      animate={{ opacity: [0, 1, 0, 1], scale: [0.95, 1, 0.98, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute w-[85%] h-[60%] border border-[var(--color-neon-red)] shadow-[inset_0_0_15px_rgba(255,0,60,0.3),0_0_10px_rgba(255,0,60,0.8)] z-20 pointer-events-none"
                    />
                  </>
                )}
              </AnimatePresence>

              {/* Success State Overlay */}
              <AnimatePresence>
                {scanComplete && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 1.2 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 z-20 border-4 border-[var(--color-neon-green)] shadow-[inset_0_0_30px_rgba(0,255,102,0.3)] pointer-events-none"
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "85%" }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="absolute top-1/2 left-[7.5%] h-1 bg-[var(--color-neon-green)] shadow-[0_0_10px_rgba(0,255,102,1)] origin-left"
                    >
                      <div className="absolute -top-6 right-0 text-[10px] bg-[var(--color-neon-green)] text-black font-bold px-2 py-0.5 rounded">
                        45.2cm
                      </div>
                    </motion.div>
                    
                    <div className="absolute top-4 right-4 bg-[var(--color-neon-green)]/20 border border-[var(--color-neon-green)] text-[var(--color-neon-green)] px-3 py-1 rounded text-xs font-bold uppercase tracking-widest backdrop-blur-md flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Locked
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          )}

        </div>

        {/* Action Panel */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          
          <div className="glass-panel p-6 border border-[var(--color-neon-cyan)]/30 shadow-[0_0_30px_rgba(0,240,255,0.1)] rounded-2xl relative overflow-hidden bg-[rgba(1,4,9,0.5)] flex-1 flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-neon-cyan)]/5 to-transparent pointer-events-none" />
            
            <h2 className="text-xl font-bold uppercase tracking-widest text-slate-100 flex items-center gap-2 relative z-10 mb-6 drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">
              <ScanLine className="w-5 h-5 text-[var(--color-neon-cyan)]" />
              Analysis Engine
            </h2>

            <div className="flex-1 flex flex-col justify-center relative z-10 space-y-6">
              
              {!imageUploaded ? (
                <div className="text-center text-slate-500 text-sm border border-slate-800 bg-slate-900/50 rounded-xl p-4">
                  Awaiting image upload to commence analysis.
                </div>
              ) : !scanComplete ? (
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0px 0px 15px 0px rgba(0,240,255,0.6)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleScan}
                  disabled={isScanning}
                  className="w-full py-4 bg-[var(--color-neon-cyan)]/10 border-2 border-[var(--color-neon-cyan)] text-[var(--color-neon-cyan)] uppercase tracking-[0.2em] font-bold rounded-xl flex items-center justify-center gap-3 disabled:opacity-50 hover:bg-[var(--color-neon-cyan)] hover:text-[#010409] transition-colors"
                >
                  {isScanning ? (
                    <>
                      <ScanLine className="w-5 h-5 animate-pulse" />
                      Analyzing Neural Net...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Activate Scanner
                    </>
                  )}
                </motion.button>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="p-4 bg-slate-900/60 border border-[var(--color-neon-green)]/40 rounded-xl shadow-[inset_0_0_15px_rgba(0,255,102,0.1)] space-y-3">
                    <div className="flex items-center justify-between border-b border-[var(--color-neon-green)]/20 pb-2">
                      <span className="text-xs text-slate-400 uppercase tracking-widest">Species Detected</span>
                      <span className="text-[var(--color-neon-green)] font-bold tracking-widest text-sm drop-shadow-[0_0_5px_rgba(0,255,102,0.8)]">Barramundi</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-[var(--color-neon-green)]/20 pb-2">
                      <span className="text-xs text-slate-400 uppercase tracking-widest">Est. Total Length</span>
                      <span className="text-[var(--color-neon-cyan)] font-bold tracking-widest text-sm drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]">45.2 cm</span>
                    </div>
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-xs text-slate-400 uppercase tracking-widest">AI Confidence</span>
                      <span className="text-[var(--color-neon-purple)] font-bold tracking-widest text-sm drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]">98.7%</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleReset}
                    className="w-full py-3 bg-transparent border border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 uppercase tracking-[0.2em] font-bold rounded-xl flex items-center justify-center gap-2 transition-colors text-xs"
                  >
                    Scan Another Target
                  </button>
                </motion.div>
              )}

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
