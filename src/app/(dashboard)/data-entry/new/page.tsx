"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, PlusSquare, MapPin, Ruler, Weight, Fish, Save, CheckCircle2, Navigation, Crosshair, Map, Info, Dna } from 'lucide-react';
import { toast } from 'sonner';
import ImageUpload from '@/components/ui/ImageUpload';
import { useRouter } from 'next/navigation';

export default function ManualDataEntryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    species: '',
    length: '',
    weight: '',
    location: '',
    latitude: '',
    longitude: '',
    sex: 'undetermined',
    gearType: 'gillnet',
    image_url: ''
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAutoLocate = () => {
    setLocError(null);
    setIsLocating(true);

    if (!navigator.geolocation) {
      setLocError("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6)
        }));
        setIsLocating(false);
        toast.success("GPS location acquired successfully.");
      },
      (error) => {
        setIsLocating(false);
        let msg = "An unknown error occurred.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg = "User denied the request for Geolocation.";
            break;
          case error.POSITION_UNAVAILABLE:
            msg = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            msg = "The request to get user location timed out.";
            break;
        }
        setLocError(msg);
        toast.error("Failed to acquire GPS location.");
      }
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const res = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      toast.success("Record saved successfully!");
      setFormData({ 
        species: '', 
        length: '', 
        weight: '', 
        location: '',
        latitude: '',
        longitude: '',
        sex: 'undetermined',
        gearType: 'gillnet',
        image_url: ''
      });
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save record.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#010409] text-[#00f0ff] font-mono overflow-y-auto pb-24 relative">
      
      {/* Background Cyber-Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-[0.05]" />
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(0,240,255,0.05),transparent_60%)] blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse,rgba(168,85,247,0.05),transparent_60%)] blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col gap-8 p-4 md:p-8 pt-8 md:pt-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-cyan-900/50 pb-6">
          <div>
            <h1 className="text-2xl md:text-4xl font-black tracking-[0.2em] text-[#00f0ff] drop-shadow-[0_0_15px_rgba(0,240,255,0.7)] uppercase flex items-center gap-3">
              <PlusSquare className="w-8 h-8 text-cyan-400" /> Manual Entry Node
            </h1>
            <p className="text-xs text-cyan-600 tracking-[0.3em] uppercase font-bold mt-2">
              Advanced Field Data Logging · Auto-GPS Enabled
            </p>
          </div>
        </div>

        {/* Form Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 border border-cyan-900/40 rounded-2xl relative overflow-hidden bg-[#010811]/60"
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
            <Database className="w-48 h-48 text-[#00f0ff]" />
          </div>

          <form onSubmit={handleSave} className="relative z-10 flex flex-col gap-8">
            
            {/* ── SECTION: BIOMETRICS ──────────────────────────────────── */}
            <div>
              <h3 className="text-xs font-black tracking-[0.2em] uppercase text-cyan-400 mb-6 flex items-center gap-2 border-b border-cyan-900/40 pb-3">
                <Dna className="w-4 h-4" /> Specimen Biometrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Species */}
                <div className="flex flex-col gap-2 md:col-span-2 lg:col-span-2">
                  <label htmlFor="species" className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 flex items-center gap-2">
                    <Fish className="w-3.5 h-3.5 text-cyan-500" /> Species Name
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      id="species"
                      name="species"
                      required
                      value={formData.species}
                      onChange={handleInputChange}
                      placeholder="e.g. Tenualosa ilisha"
                      className="w-full bg-[#010409]/80 border border-cyan-900/50 rounded-xl px-4 py-3 text-cyan-100 placeholder-cyan-900/50 focus:outline-none focus:border-[#00f0ff] focus:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all font-mono text-sm"
                    />
                    <div className="absolute inset-0 rounded-xl bg-[#00f0ff] opacity-0 group-hover:opacity-5 pointer-events-none transition-opacity" />
                  </div>
                </div>

                {/* Length */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="length" className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 flex items-center gap-2">
                    <Ruler className="w-3.5 h-3.5 text-green-500" /> Length (TL)
                  </label>
                  <div className="relative group">
                    <input
                      type="number"
                      step="0.01"
                      id="length"
                      name="length"
                      required
                      value={formData.length}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="w-full bg-[#010409]/80 border border-cyan-900/50 rounded-xl px-4 py-3 text-green-300 placeholder-cyan-900/50 focus:outline-none focus:border-green-500 focus:shadow-[0_0_20px_rgba(0,255,102,0.2)] transition-all font-mono text-sm font-bold"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 text-[10px] font-bold pointer-events-none uppercase">cm</span>
                  </div>
                </div>

                {/* Weight */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="weight" className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 flex items-center gap-2">
                    <Weight className="w-3.5 h-3.5 text-yellow-500" /> Body Weight
                  </label>
                  <div className="relative group">
                    <input
                      type="number"
                      step="0.01"
                      id="weight"
                      name="weight"
                      required
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="w-full bg-[#010409]/80 border border-cyan-900/50 rounded-xl px-4 py-3 text-yellow-300 placeholder-cyan-900/50 focus:outline-none focus:border-yellow-500 focus:shadow-[0_0_20px_rgba(234,179,8,0.2)] transition-all font-mono text-sm font-bold"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 text-[10px] font-bold pointer-events-none uppercase">g</span>
                  </div>
                </div>

                {/* Sex */}
                <div className="flex flex-col gap-2 md:col-span-1 lg:col-span-2">
                  <label htmlFor="sex" className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 flex items-center gap-2">
                    Biological Sex
                  </label>
                  <select
                    id="sex"
                    name="sex"
                    value={formData.sex}
                    onChange={handleInputChange}
                    className="w-full bg-[#010409]/80 border border-cyan-900/50 rounded-xl px-4 py-3 text-cyan-300 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all font-mono text-sm appearance-none cursor-pointer"
                  >
                    <option value="undetermined">Undetermined</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                {/* Gear Type */}
                <div className="flex flex-col gap-2 md:col-span-1 lg:col-span-2">
                  <label htmlFor="gearType" className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 flex items-center gap-2">
                    Sampling Gear
                  </label>
                  <select
                    id="gearType"
                    name="gearType"
                    value={formData.gearType}
                    onChange={handleInputChange}
                    className="w-full bg-[#010409]/80 border border-cyan-900/50 rounded-xl px-4 py-3 text-purple-300 focus:outline-none focus:border-purple-500 focus:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all font-mono text-sm appearance-none cursor-pointer"
                  >
                    <option value="gillnet">Gillnet</option>
                    <option value="trawl">Bottom Trawl</option>
                    <option value="seine">Purse Seine</option>
                    <option value="longline">Longline</option>
                    <option value="trap">Trap / Pot</option>
                    <option value="other">Other</option>
                  </select>
                </div>

              </div>
            </div>

            {/* ── SECTION: GEOLOCATION ──────────────────────────────────── */}
            <div className="mt-4">
              <div className="flex items-center justify-between border-b border-cyan-900/40 pb-3 mb-6">
                <h3 className="text-xs font-black tracking-[0.2em] uppercase text-purple-400 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Spatial Telemetry
                </h3>
                
                <button
                  type="button"
                  onClick={handleAutoLocate}
                  disabled={isLocating}
                  className="flex items-center gap-2 px-3 py-1.5 bg-purple-950/40 border border-purple-500/50 text-purple-400 rounded-lg hover:bg-purple-900/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all text-[10px] font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLocating ? (
                    <div className="w-3 h-3 border-2 border-purple-700 border-t-purple-300 rounded-full animate-spin" />
                  ) : (
                    <Crosshair className="w-3 h-3" />
                  )}
                  {isLocating ? 'Acquiring Signal...' : 'Auto-Locate GPS'}
                </button>
              </div>

              {/* Geolocation Error Toast */}
              <AnimatePresence>
                {locError && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="flex items-start gap-3 p-3 bg-red-950/40 border border-red-900/50 rounded-xl"
                  >
                    <Info className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-red-400 uppercase tracking-widest leading-relaxed">
                      {locError}. Please enter coordinates manually.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Station Name */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="location" className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 flex items-center gap-2">
                    <Map className="w-3.5 h-3.5 text-purple-500" /> Station Name
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      id="location"
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g. BoB Zone 3"
                      className="w-full bg-[#010409]/80 border border-cyan-900/50 rounded-xl px-4 py-3 text-purple-100 placeholder-cyan-900/50 focus:outline-none focus:border-purple-500 focus:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all font-mono text-sm"
                    />
                  </div>
                </div>

                {/* Latitude */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="latitude" className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 flex items-center gap-2">
                    <Navigation className="w-3.5 h-3.5 text-purple-500" /> Latitude
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      id="latitude"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      placeholder="0.000000"
                      className="w-full bg-[#010409]/80 border border-cyan-900/50 rounded-xl px-4 py-3 text-purple-300 placeholder-cyan-900/50 focus:outline-none focus:border-purple-500 focus:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all font-mono text-sm font-bold"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 text-[10px] font-bold pointer-events-none uppercase">Deg</span>
                  </div>
                </div>

                {/* Longitude */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="longitude" className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 flex items-center gap-2">
                    <Navigation className="w-3.5 h-3.5 text-purple-500 rotate-90" /> Longitude
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      id="longitude"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      placeholder="0.000000"
                      className="w-full bg-[#010409]/80 border border-cyan-900/50 rounded-xl px-4 py-3 text-purple-300 placeholder-cyan-900/50 focus:outline-none focus:border-purple-500 focus:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all font-mono text-sm font-bold"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 text-[10px] font-bold pointer-events-none uppercase">Deg</span>
                  </div>
                </div>

              </div>
            </div>

            {/* ── SECTION: IMAGE UPLOAD ─────────────────────────────────── */}
            <div className="mt-4">
              <h3 className="text-xs font-black tracking-[0.2em] uppercase text-slate-400 mb-6 flex items-center gap-2 border-b border-cyan-900/40 pb-3">
                <Info className="w-4 h-4" /> Photographic Evidence
              </h3>
              <div className="max-w-md mx-auto">
                <ImageUpload 
                  value={formData.image_url} 
                  onUpload={(url) => setFormData(prev => ({ ...prev, image_url: url }))} 
                />
              </div>
            </div>

            <div className="border-t border-cyan-900/40 my-2" />

            {/* ── ACTIONS & FEEDBACK ──────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-6">
              
              <div className="text-[10px] text-slate-500 tracking-widest uppercase flex items-center gap-2">
                <Info className="w-3.5 h-3.5" /> All biometric fields required.
              </div>

              <button 
                type="submit" 
                disabled={isSaving}
                className={`flex items-center justify-center gap-3 px-10 py-4 rounded-xl font-black tracking-[0.2em] text-xs uppercase transition-all ${
                  isSaving 
                    ? 'bg-cyan-950/40 border-cyan-900 text-cyan-700 cursor-not-allowed' 
                    : 'bg-cyan-950/60 border border-[#00f0ff]/60 text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)]'
                }`}
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-cyan-700 border-t-cyan-300 rounded-full animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {isSaving ? 'Logging Data...' : 'Save Record'}
              </button>
            </div>

          </form>
        </motion.div>

      </div>
    </div>
  );
}
