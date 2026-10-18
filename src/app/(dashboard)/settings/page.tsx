"use client";

import { useState, useEffect } from "react";
import { Settings, Key, User, Shield, CheckCircle2, Copy, Webhook } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [profileName, setProfileName] = useState("Dr. Marine Biologist");
  const [profileInstitution, setProfileInstitution] = useState("Oceanic Research Institute");

  const saveProfile = () => {
    toast.success("Profile Updated", { description: "Your researcher profile has been saved." });
  };

  useEffect(() => {
    const saved = localStorage.getItem("n8nWebhookUrl");
    if (saved) setWebhookUrl(saved);
  }, []);

  const saveWebhook = () => {
    localStorage.setItem("n8nWebhookUrl", webhookUrl);
    toast.success("Webhook URL Saved", { description: "Automation triggers updated." });
  };

  const generateApiKey = () => {
    // Generate a mock API key
    const newKey = `ma_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setApiKey(newKey);
    toast.success("New API Key Generated");
  };

  const copyToClipboard = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      toast.success("API Key copied to clipboard");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-100">
          <Settings className="w-6 h-6 text-cyan-400" />
          Settings & Configuration
        </h1>
        <p className="text-slate-400">Manage your account, preferences, and developer access.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* User Profile Section */}
          <div className="bg-cyan-950/10 backdrop-blur-3xl border border-cyan-400/20 shadow-[0_0_30px_rgba(6,182,212,0.15)] rounded-2xl relative overflow-hidden group">
            <div className="absolute inset-0 pointer-events-none rounded-2xl shadow-[inset_0_0_20px_rgba(6,182,212,0.1)] border border-cyan-400/10 z-0"></div>
            <div className="p-6 border-b border-cyan-500/20 flex items-center gap-4 relative z-10">
              <div className="w-16 h-16 bg-cyan-900/50 rounded-full flex items-center justify-center border border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                <User className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">Researcher Profile</h3>
                <p className="text-sm text-cyan-500/80 uppercase tracking-widest font-mono">Standard Marine Analytica Account</p>
              </div>
            </div>
            <div className="p-6 space-y-4 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-cyan-500 uppercase tracking-widest">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-cyan-950/30 border-b-2 border-cyan-500/30 py-2 px-3 text-sm text-cyan-100 focus:outline-none focus:border-cyan-400 transition-all font-mono shadow-inner"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-cyan-500 uppercase tracking-widest">Institution</label>
                  <input
                    type="text"
                    value={profileInstitution}
                    onChange={(e) => setProfileInstitution(e.target.value)}
                    className="w-full bg-cyan-950/30 border-b-2 border-cyan-500/30 py-2 px-3 text-sm text-cyan-100 focus:outline-none focus:border-cyan-400 transition-all font-mono shadow-inner"
                  />
                </div>
              </div>
              <button onClick={saveProfile} className="px-6 py-2.5 bg-transparent border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_40px_rgba(6,182,212,1)] transition-all duration-300 uppercase tracking-[0.2em] font-bold text-sm rounded-xl">
                Save Changes
              </button>
            </div>
          </div>

          {/* Developer API Section */}
          <div className="bg-cyan-950/10 backdrop-blur-3xl border border-cyan-400/20 shadow-[0_0_30px_rgba(6,182,212,0.15)] rounded-2xl relative overflow-hidden group text-white">
            <div className="absolute inset-0 pointer-events-none rounded-2xl shadow-[inset_0_0_20px_rgba(6,182,212,0.1)] border border-cyan-400/10 z-0"></div>
            <div className="p-6 border-b border-cyan-500/20 relative z-10">
              <h3 className="text-lg font-bold flex items-center gap-2 text-slate-100">
                <Key className="w-5 h-5 text-cyan-400" />
                Developer API (DaaS)
              </h3>
              <p className="text-sm text-slate-400 mt-1">Access your stock assessment data programmatically via our REST API.</p>
            </div>
            <div className="p-6 space-y-4 relative z-10">
              <div className="bg-cyan-950/40 rounded-xl p-4 border border-cyan-500/30 shadow-[inset_0_0_15px_rgba(6,182,212,0.1)]">
                <label className="text-xs font-semibold text-cyan-500 uppercase tracking-widest block mb-2">Your API Key</label>
                {apiKey ? (
                  <div className="flex items-center justify-between bg-black/40 border border-cyan-500/50 rounded-md p-2">
                    <code className="text-cyan-300 font-mono text-sm break-all drop-shadow-[0_0_5px_rgba(103,232,249,0.8)]">{apiKey}</code>
                    <button onClick={copyToClipboard} className="p-2 text-cyan-500 hover:text-cyan-300 transition-colors" title="Copy to clipboard">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-cyan-500/50 italic font-mono">No API key generated yet.</p>
                )}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Use this key in the <code className="text-cyan-300 font-mono">Authorization: Bearer &lt;key&gt;</code> header to authenticate your requests to <code className="text-cyan-300 font-mono">/api/v1/public/records</code>. Do not share this key publicly.
              </p>
              <button 
                onClick={generateApiKey}
                className="px-6 py-2.5 bg-transparent border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_40px_rgba(6,182,212,1)] transition-all duration-300 uppercase tracking-[0.2em] font-bold text-sm rounded-xl"
              >
                {apiKey ? "Regenerate API Key" : "Generate API Key"}
              </button>
            </div>
          </div>
          
          {/* Automations Section */}
          <div className="bg-cyan-950/10 backdrop-blur-3xl border border-cyan-400/20 shadow-[0_0_30px_rgba(6,182,212,0.15)] rounded-2xl relative overflow-hidden group">
            <div className="absolute inset-0 pointer-events-none rounded-2xl shadow-[inset_0_0_20px_rgba(6,182,212,0.1)] border border-cyan-400/10 z-0"></div>
            <div className="p-6 border-b border-cyan-500/20 relative z-10">
              <h3 className="text-lg font-bold flex items-center gap-2 text-slate-100">
                <Webhook className="w-5 h-5 text-cyan-400" />
                Workflow Automations (n8n / Make)
              </h3>
              <p className="text-sm text-slate-400 mt-1">Automatically send new fish records to external webhook URLs.</p>
            </div>
            <div className="p-6 space-y-4 relative z-10">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-cyan-500 uppercase tracking-widest">Webhook URL</label>
                <input 
                  type="url" 
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full bg-cyan-950/30 border-b-2 border-cyan-500/30 py-2 px-3 text-sm text-cyan-100 focus:outline-none focus:border-cyan-400 transition-all font-mono shadow-inner placeholder:text-cyan-900/50" 
                  placeholder="https://your-n8n-instance.com/webhook/..." 
                />
              </div>
              <button 
                onClick={saveWebhook}
                className="px-6 py-2.5 bg-transparent border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_40px_rgba(6,182,212,1)] transition-all duration-300 uppercase tracking-[0.2em] font-bold text-sm inline-block rounded-xl"
              >
                Save Webhook
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-cyan-950/10 backdrop-blur-3xl border border-cyan-400/20 shadow-[0_0_30px_rgba(6,182,212,0.15)] rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute inset-0 pointer-events-none rounded-2xl shadow-[inset_0_0_20px_rgba(6,182,212,0.1)] border border-cyan-400/10 z-0"></div>
            <div className="relative z-10">
              <h3 className="font-bold text-cyan-400 flex items-center gap-2 mb-3 uppercase tracking-widest text-sm">
                <Shield className="w-5 h-5 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                Account Status
              </h3>
              <ul className="space-y-3 font-mono">
                <li className="flex items-start gap-2 text-sm text-cyan-100">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
                  <span>Unlimited Data Storage</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-cyan-100">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
                  <span>Advanced Mathematical Models</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-cyan-100">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
                  <span>API Access (10k req/mo)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
