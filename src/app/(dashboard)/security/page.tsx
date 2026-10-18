"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, KeyRound, Eye, EyeOff, Activity, Database, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

const AUDIT_LOG = [
  { id: 1, action: 'User login',               timestamp: '2026-10-02 11:34:12', status: 'success', ip: '192.168.1.7'  },
  { id: 2, action: 'Dataset export (CSV)',      timestamp: '2026-10-02 10:58:05', status: 'success', ip: '192.168.1.7'  },
  { id: 3, action: 'API key generation',        timestamp: '2026-10-02 09:21:30', status: 'success', ip: '192.168.1.7'  },
  { id: 4, action: 'Failed login attempt',      timestamp: '2026-10-02 08:44:11', status: 'warning', ip: '45.33.22.101' },
  { id: 5, action: 'Webhook configuration',     timestamp: '2026-10-01 22:15:44', status: 'success', ip: '192.168.1.7'  },
];

export default function SecurityModule() {
  const [vaultLocked, setVaultLocked] = useState(true);
  const [vaultPinInput, setVaultPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [saved, setSaved] = useState(false);

  const CORRECT_PIN = '0000'; // Demo PIN

  const handleUnlock = () => {
    if (vaultPinInput === CORRECT_PIN) {
      setVaultLocked(false);
      setPinError(false);
      setVaultPinInput('');
    } else {
      setPinError(true);
      setVaultPinInput('');
    }
  };

  const handleSaveSettings = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen w-full bg-[#010409] text-[#00f0ff] font-mono overflow-y-auto pb-24 relative">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-[0.05]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto p-4 md:p-8 pt-8 md:pt-12 flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-cyan-900/50 pb-6">
          <div className="p-3 bg-cyan-950/50 border border-cyan-500/40 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            <Shield className="w-7 h-7 text-[#00f0ff]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-[0.2em] text-[#00f0ff] drop-shadow-[0_0_15px_rgba(0,240,255,0.7)] uppercase">
              Security & Authentication
            </h1>
            <p className="text-[10px] text-cyan-600 tracking-[0.3em] uppercase font-bold mt-1">Secure Data Vault & Protocol Management</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vault Panel */}
          <div className="glass-panel p-6 border border-cyan-900/40 rounded-2xl relative overflow-hidden">
            <h3 className="text-xs font-black tracking-[0.2em] uppercase text-[#00f0ff] mb-5 flex items-center gap-2">
              <Lock className="w-4 h-4" /> Encrypted Data Vault
            </h3>

            <AnimatePresence mode="wait">
              {vaultLocked ? (
                <motion.div key="locked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-5 py-6">
                  <div className="p-5 bg-red-950/40 border border-red-700/50 rounded-full shadow-[0_0_20px_rgba(255,0,60,0.2)]">
                    <Lock className="w-10 h-10 text-red-400" />
                  </div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest text-center">Enter vault PIN to access secure records</p>
                  <div className="flex flex-col items-center gap-3 w-full max-w-xs">
                    <div className="relative w-full">
                      <input
                        type={showPin ? 'text' : 'password'}
                        value={vaultPinInput}
                        onChange={(e) => { setVaultPinInput(e.target.value); setPinError(false); }}
                        onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                        maxLength={6}
                        placeholder="Enter PIN (demo: 0000)"
                        className={`w-full bg-[#010811] border rounded-xl px-4 py-3 text-sm text-cyan-100 font-mono focus:outline-none focus:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all ${pinError ? 'border-red-500 focus:border-red-400' : 'border-cyan-900/50 focus:border-cyan-500'}`}
                      />
                      <button onClick={() => setShowPin(!showPin)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-cyan-400 transition-colors">
                        {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {pinError && <p className="text-red-400 text-[10px] tracking-widest uppercase font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Incorrect PIN</p>}
                    <button onClick={handleUnlock} className="w-full py-3 bg-cyan-950/60 border border-cyan-500/60 text-cyan-300 rounded-xl hover:bg-cyan-500 hover:text-black transition-all font-black tracking-widest text-xs uppercase">
                      <KeyRound className="w-4 h-4 inline-block mr-2" />Unlock Vault
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="unlocked" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 p-3 bg-green-950/30 border border-green-700/40 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-green-400 uppercase tracking-widest">Vault Unlocked</p>
                      <p className="text-[10px] text-slate-500">AES-256 encrypted storage accessible</p>
                    </div>
                  </div>
                  {[
                    { label: 'API Keys', value: '2 active keys', color: 'text-cyan-400' },
                    { label: 'Dataset Records', value: '1,247 encrypted', color: 'text-green-400' },
                    { label: 'Webhook URLs', value: '1 configured', color: 'text-purple-400' },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center p-3 border border-cyan-900/30 rounded-lg bg-[#010811]/60">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest">{item.label}</span>
                      <span className={`text-xs font-bold ${item.color}`}>{item.value}</span>
                    </div>
                  ))}
                  <button onClick={() => setVaultLocked(true)} className="w-full mt-2 py-2 border border-red-900/40 text-red-500 rounded-lg hover:bg-red-950/30 transition-all text-[10px] font-bold uppercase tracking-widest">
                    Lock Vault
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Protocol Settings */}
          <div className="glass-panel p-6 border border-purple-900/40 rounded-2xl relative overflow-hidden flex flex-col gap-5">
            <h3 className="text-xs font-black tracking-[0.2em] uppercase text-purple-400 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Security Protocols
            </h3>

            <div className="space-y-4">
              {/* 2FA Toggle */}
              <div className="flex items-center justify-between p-4 border border-purple-900/30 bg-[#010811]/60 rounded-xl">
                <div>
                  <p className="text-xs font-bold text-slate-200 uppercase tracking-widest">Two-Factor Authentication</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Require OTP on every login</p>
                </div>
                <button
                  onClick={() => setTwoFAEnabled(!twoFAEnabled)}
                  className={`relative w-12 h-6 rounded-full border transition-all duration-300 ${twoFAEnabled ? 'bg-purple-500/30 border-purple-500' : 'bg-slate-900 border-slate-700'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 ${twoFAEnabled ? 'left-[26px] bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 'left-0.5 bg-slate-600'}`} />
                </button>
              </div>

              {/* Session Timeout */}
              <div className="p-4 border border-purple-900/30 bg-[#010811]/60 rounded-xl">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Session Timeout (minutes)</label>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full bg-[#010811] border border-purple-900/50 rounded-lg px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-purple-500 transition-all"
                >
                  {['15', '30', '60', '120'].map(v => <option key={v} value={v}>{v} minutes</option>)}
                </select>
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              className={`mt-auto w-full py-3 rounded-xl font-black tracking-widest text-xs uppercase transition-all ${
                saved
                  ? 'bg-green-950/40 border border-green-500/50 text-green-400 shadow-[0_0_15px_rgba(0,255,102,0.2)]'
                  : 'bg-purple-950/40 border border-purple-500/50 text-purple-300 hover:bg-purple-500 hover:text-black'
              }`}
            >
              {saved ? <><CheckCircle2 className="w-3.5 h-3.5 inline-block mr-1" />Saved!</> : 'Save Protocol Settings'}
            </button>
          </div>
        </div>

        {/* Audit Log */}
        <div className="glass-panel p-6 border border-cyan-900/40 rounded-2xl">
          <h3 className="text-xs font-black tracking-[0.2em] uppercase text-[#00f0ff] mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4" /> Security Audit Log
          </h3>
          <div className="overflow-x-auto rounded-lg border border-cyan-900/30">
            <table className="w-full text-[11px] font-mono">
              <thead className="bg-cyan-950/30 border-b border-cyan-900/50">
                <tr>
                  {['#', 'Action', 'Timestamp', 'IP Address', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[9px] text-slate-500 uppercase tracking-widest font-black">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-900/20">
                {AUDIT_LOG.map(log => (
                  <tr key={log.id} className="hover:bg-cyan-950/20 transition-colors">
                    <td className="px-4 py-3 text-slate-600">{log.id}</td>
                    <td className="px-4 py-3 text-slate-200">{log.action}</td>
                    <td className="px-4 py-3 text-slate-500">{log.timestamp}</td>
                    <td className="px-4 py-3 text-cyan-600">{log.ip}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                        log.status === 'success'
                          ? 'bg-green-950/50 text-green-400 border border-green-800/50'
                          : 'bg-yellow-950/50 text-yellow-400 border border-yellow-800/50'
                      }`}>{log.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
