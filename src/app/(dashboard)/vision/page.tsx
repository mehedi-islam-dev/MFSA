"use client";

import { useState } from "react";
import { Camera, UploadCloud, X, ScanLine, Ruler } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function VisionPage() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }
    const url = URL.createObjectURL(file);
    setSelectedImage(url);
  };

  const clearImage = () => {
    setSelectedImage(null);
  };

  const analyzeImage = () => {
    setIsAnalyzing(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsAnalyzing(false);
      toast.info("Computer Vision API integration coming soon", {
        description: "This will automatically extract the species and morphological measurements.",
      });
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-100">
          <Camera className="w-6 h-6 text-cyan-400" />
          AI Vision Engine
        </h1>
        <p className="text-slate-400">Automate morphometric measurements using computer vision.</p>
      </div>

      <div className="bg-cyan-950/10 backdrop-blur-3xl border border-cyan-400/20 shadow-[0_0_30px_rgba(6,182,212,0.15)] rounded-2xl relative overflow-hidden group">
        <div className="absolute inset-0 pointer-events-none rounded-2xl shadow-[inset_0_0_20px_rgba(6,182,212,0.1)] border border-cyan-400/10 z-0"></div>
        <div className="relative z-10 p-6 md:p-10">
          {!selectedImage ? (
            <div 
              className={`relative border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all ${
                dragActive 
                  ? "border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.5)] bg-cyan-900/30" 
                  : "border-cyan-500/50 bg-slate-900/50 hover:bg-slate-800/80 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud className={`w-16 h-16 mb-4 ${dragActive ? "text-cyan-400" : "text-slate-500"}`} />
              <h3 className="text-lg font-bold text-slate-200 mb-1">Drag and drop your image</h3>
              <p className="text-sm text-slate-400 text-center max-w-sm">
                Upload a clear photo of the specimen against a standard measurement board. PNG, JPG up to 10MB.
              </p>
              <div className="mt-6 px-6 py-2 bg-transparent border-2 border-cyan-500 text-cyan-400 rounded-xl text-sm font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)] pointer-events-none uppercase tracking-widest">
                Browse Files
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative aspect-video w-full max-w-2xl mx-auto bg-slate-900 rounded-xl overflow-hidden border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={selectedImage} 
                  alt="Uploaded specimen preview" 
                  className={`w-full h-full object-contain ${isAnalyzing ? "opacity-50" : "opacity-100"} transition-opacity duration-300`}
                />
                
                {/* Scanning Animation Overlay */}
                {isAnalyzing && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                    <div className="w-full h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] absolute top-0 animate-[scan_2s_ease-in-out_infinite]"></div>
                    <ScanLine className="w-12 h-12 text-cyan-400 animate-pulse mb-2" />
                    <span className="text-cyan-400 font-mono font-bold tracking-widest text-sm bg-slate-900/80 px-3 py-1 rounded">PROCESSING...</span>
                  </div>
                )}
                
                <button 
                  onClick={clearImage}
                  disabled={isAnalyzing}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition-colors disabled:opacity-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex justify-center">
                <button 
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                  className="px-8 py-3 bg-transparent border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_40px_rgba(6,182,212,1)] transition-all duration-300 uppercase tracking-[0.2em] font-bold flex items-center gap-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Ruler className="w-5 h-5" />
                  {isAnalyzing ? "Extracting Morphometrics..." : "Analyze Fish Length via AI"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Required for the scanning animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}} />
    </div>
  );
}
