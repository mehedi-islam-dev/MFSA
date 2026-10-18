"use client";

import { useState, useEffect, useRef } from "react";
import { Waves, UploadCloud, Play, Square, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function BioacousticsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bars, setBars] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Generate random heights for the dummy spectrogram
    setBars(Array.from({ length: 40 }).map(() => Math.random() * 100));
  }, [file]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.name.endsWith('.wav') || f.type === 'audio/wav') {
      setFile(f);
    } else {
      toast.error('Please upload a .wav audio file');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.wav')) {
        setFile(droppedFile);
      } else {
        toast.error("Please upload a .wav audio file");
      }
    }
  };

  const handleAnalyze = () => {
    toast.info("Bioacoustics AI engine is training.", {
      description: "Call analysis and classification will be available soon."
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-100">
          <Waves className="w-6 h-6 text-cyan-400" />
          Bioacoustics Engine
        </h1>
        <p className="text-slate-400">Analyze underwater soundscapes to monitor species presence and behavior.</p>
      </div>

      <div className="bg-cyan-950/10 backdrop-blur-3xl border border-cyan-400/20 shadow-[0_0_30px_rgba(6,182,212,0.15)] rounded-2xl relative overflow-hidden group p-6 md:p-10">
        <div className="absolute inset-0 pointer-events-none rounded-2xl shadow-[inset_0_0_20px_rgba(6,182,212,0.1)] border border-cyan-400/10 z-0"></div>
        <div className="relative z-10">
          {!file ? (
            <div 
              className="border-2 border-dashed border-cyan-500/50 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] rounded-3xl p-12 flex flex-col items-center justify-center bg-slate-900/50 hover:bg-slate-800/80 transition-all cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
              <input ref={fileInputRef} type="file" accept=".wav,audio/wav" className="hidden" onChange={handleFileInput} />
              <UploadCloud className="w-16 h-16 text-cyan-500 mb-4 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
            <h3 className="text-lg font-bold text-slate-200 mb-1">Upload Hydrophone Data</h3>
            <p className="text-sm text-slate-400 text-center max-w-sm">
              Drag and drop your .wav audio file here to begin AI acoustic analysis.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cyan-900/50 border border-cyan-500/30 rounded-full flex items-center justify-center text-cyan-400">
                  <Volume2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100">{file.name}</h3>
                  <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB • Hydrophone Recording</p>
                </div>
              </div>
              <button 
                onClick={() => setFile(null)}
                className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
              >
                Clear
              </button>
            </div>

            <div className="bg-cyan-950/20 rounded-2xl p-6 border border-cyan-500/20 shadow-inner relative">
              <div className="flex items-end gap-1 h-32 mb-6">
                {bars.map((height, i) => (
                  <motion.div 
                    key={i}
                    animate={isPlaying ? { scaleY: [1, Math.random() * 1.5 + 0.5, 1] } : { scaleY: 1 }}
                    transition={{ repeat: Infinity, duration: 0.5 + Math.random(), ease: "easeInOut" }}
                    className={`flex-1 rounded-t-sm transition-colors ${
                      isPlaying 
                        ? 'bg-cyan-400 opacity-90 shadow-[0_0_10px_rgba(34,211,238,0.8)]' 
                        : 'bg-cyan-900/50 opacity-50'
                    }`}
                    style={{ 
                      height: `${height}%`,
                      transformOrigin: 'bottom'
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-center">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 bg-transparent border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(6,182,212,1)] rounded-full flex items-center justify-center transition-all duration-300"
                >
                  {isPlaying ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              <button 
                onClick={handleAnalyze}
                className="px-8 py-3 bg-transparent border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_40px_rgba(6,182,212,1)] transition-all duration-300 uppercase tracking-[0.2em] font-bold flex items-center gap-2 rounded-xl"
              >
                <Waves className="w-5 h-5" />
                Analyze Species Call
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
