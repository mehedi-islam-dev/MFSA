"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ship, PlusCircle, CalendarDays, MapPin, Fish, Trash2, CheckCircle2, Image, FileX, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Expedition {
  id: number;
  title: string;
  date: string;
  location: string;
  species: string;
  notes: string;
  imageUrl?: string;
}

// Mock data removed in favor of Supabase backend

export default function ExpeditionModule() {
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ title: '', date: '', location: '', species: '', notes: '', imageUrl: '' });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchExpeditions = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.from('expeditions').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          setExpeditions(data);
        }
      } catch (e) {
        console.warn("API unavailable: returning empty expeditions.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchExpeditions();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    setFormData(prev => ({ ...prev, imageUrl: url }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.location) return;
    
    setIsSaving(true);
    try {
      const { data, error } = await supabase.from('expeditions').insert({
        title: formData.title,
        date: formData.date,
        location: formData.location,
        species: formData.species,
        notes: formData.notes,
        image_url: formData.imageUrl
      }).select().single();

      if (error) throw error;
      
      setExpeditions(prev => [data, ...prev]);
      setFormData({ title: '', date: '', location: '', species: '', notes: '', imageUrl: '' });
      setPreviewUrl(null);
      setShowForm(false);
      toast.success("Expedition saved successfully!");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      toast.error(err.message || "Failed to save expedition.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from('expeditions').delete().eq('id', id);
      if (error) throw error;
      setExpeditions(prev => prev.filter(e => e.id !== id));
      toast.success("Expedition deleted.");
    } catch (err) {
      toast.error("Failed to delete expedition.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#010409] text-[#00f0ff] font-mono overflow-y-auto pb-24 relative">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-[0.05]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto p-4 md:p-8 pt-8 md:pt-12 flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-900/50 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-950/50 border border-cyan-500/40 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.2)]">
              <Ship className="w-7 h-7 text-[#00f0ff]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-[0.2em] text-[#00f0ff] drop-shadow-[0_0_15px_rgba(0,240,255,0.7)] uppercase">
                Field Expeditions
              </h1>
              <p className="text-[10px] text-cyan-600 tracking-[0.3em] uppercase font-bold mt-1">{expeditions.length} Expeditions Logged</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AnimatePresence>
              {saved && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2 px-3 py-2 bg-green-950/40 border border-green-500/50 rounded-lg text-green-400 text-[10px] font-black uppercase tracking-widest">
                  <CheckCircle2 className="w-3 h-3" /> Expedition Saved
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => setShowForm(!showForm)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all border ${showForm ? 'border-red-800/50 text-red-400 hover:bg-red-950/30' : 'border-cyan-500/50 text-cyan-300 bg-cyan-950/40 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.5)]'}`}
            >
              <PlusCircle className="w-4 h-4" />
              {showForm ? 'Cancel' : 'Log New Expedition'}
            </button>
          </div>
        </div>

        {/* New Expedition Form */}
        <AnimatePresence>
          {showForm && (
            <motion.form
              onSubmit={handleSave}
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="glass-panel p-6 border border-purple-900/40 rounded-2xl overflow-hidden"
            >
              <h3 className="text-xs font-black tracking-[0.2em] uppercase text-purple-400 mb-5 flex items-center gap-2">
                <PlusCircle className="w-4 h-4" /> New Expedition Entry
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {([
                  { name: 'title',    label: 'Expedition Title', type: 'text',  placeholder: 'Bay of Bengal Survey' },
                  { name: 'date',     label: 'Date',             type: 'date',  placeholder: '' },
                  { name: 'location', label: 'Location/Station', type: 'text',  placeholder: 'e.g. Sandwip Island, BD' },
                  { name: 'species',  label: 'Target Species',   type: 'text',  placeholder: 'e.g. Tenualosa ilisha' },
                ] as const).map(field => (
                  <div key={field.name} className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">{field.label}</label>
                    <input
                      type={field.type}
                      required={field.name === 'title' || field.name === 'date' || field.name === 'location'}
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                      className="bg-[#010811] border border-cyan-900/50 rounded-lg px-3 py-2.5 text-xs text-cyan-100 font-mono focus:outline-none focus:border-purple-500 focus:shadow-[0_0_10px_rgba(168,85,247,0.2)] transition-all"
                    />
                  </div>
                ))}
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Field Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Observations, weather conditions, notes..."
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="bg-[#010811] border border-cyan-900/50 rounded-lg px-3 py-2.5 text-xs text-cyan-100 font-mono resize-none focus:outline-none focus:border-purple-500 focus:shadow-[0_0_10px_rgba(168,85,247,0.2)] transition-all"
                  />
                </div>
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Field Photo (Optional)</label>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <div className="flex items-center gap-4">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-[#010811] border border-cyan-900/50 text-cyan-600 rounded-lg hover:border-cyan-500 hover:text-cyan-300 transition-all text-xs font-bold uppercase tracking-widest">
                      <Image className="w-4 h-4" /> Upload Photo
                    </button>
                    {previewUrl && (
                      <div className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={previewUrl} alt="preview" className="h-12 rounded-lg border border-cyan-900/40 object-cover" />
                        <button type="button" onClick={() => { setPreviewUrl(null); setFormData(prev => ({ ...prev, imageUrl: '' })); }}
                          className="absolute -top-1 -right-1 bg-red-900 rounded-full p-0.5 hover:bg-red-700 transition-colors">
                          <FileX className="w-3 h-3 text-red-300" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button type="submit" disabled={isSaving} className="px-8 py-3 bg-purple-950/60 border border-purple-500/60 text-purple-300 rounded-xl hover:bg-purple-500 hover:text-black transition-all font-black text-xs uppercase tracking-widest disabled:opacity-50">
                  {isSaving ? "Saving..." : "Save Expedition"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Expedition Cards */}
        <div className="flex flex-col gap-4">
          <AnimatePresence>
            {expeditions.map(exp => (
              <motion.div key={exp.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
                className="glass-panel p-5 border border-cyan-900/40 rounded-2xl group"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {exp.imageUrl && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={exp.imageUrl} alt={exp.title} className="w-full md:w-32 h-24 object-cover rounded-xl border border-cyan-900/30 shrink-0" />
                  )}
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-black text-sm tracking-widest uppercase text-slate-100">{exp.title}</h4>
                      <button onClick={() => handleDelete(exp.id)} className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-950/30 rounded transition-all opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3 text-cyan-700" />{exp.date}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-purple-700" />{exp.location}</span>
                      {exp.species && <span className="flex items-center gap-1"><Fish className="w-3 h-3 text-green-700" />{exp.species}</span>}
                    </div>
                    {exp.notes && <p className="text-xs text-slate-400 leading-relaxed border-l-2 border-cyan-900/50 pl-3">{exp.notes}</p>}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading ? (
            <div className="text-center py-16 text-slate-600 border border-dashed border-cyan-900/30 rounded-2xl">
              <Loader2 className="w-10 h-10 mx-auto mb-3 opacity-30 animate-spin" />
              <p className="text-xs uppercase tracking-widest">Loading expeditions...</p>
            </div>
          ) : expeditions.length === 0 ? (
            <div className="text-center py-16 text-slate-600 border border-dashed border-cyan-900/30 rounded-2xl">
              <Ship className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-xs uppercase tracking-widest">No data available</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
