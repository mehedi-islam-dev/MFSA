"use client";

import { Zap, Webhook, GitBranch, BarChart2 } from "lucide-react";

export default function AutomationPage() {
  return (
    <div className="page-container">
      <div className="section-header">
        <div className="icon-wrap"><Zap className="w-5 h-5" /></div>
        <div>
          <h2 className="text-xl font-bold text-white">n8n Automation Hub</h2>
          <p className="text-sm text-[var(--color-ocean-200)]">No-code workflow automation for data pipelines and alerts</p>
        </div>
      </div>

      <div className="glass-card p-16 flex flex-col items-center text-center gap-6 coming-soon-bg">
        <div className="flex items-center justify-center w-24 h-24 rounded-3xl bg-[rgba(255,209,102,0.08)] border border-[rgba(255,209,102,0.15)] animate-pulse-glow">
          <Zap className="w-12 h-12 text-[var(--color-solar-400)] opacity-60" />
        </div>
        <div>
          <div className="badge-solar mb-3 mx-auto">Coming Soon</div>
          <h3 className="text-2xl font-bold text-white mb-3">Workflow Automation via n8n</h3>
          <p className="text-[var(--color-ocean-200)] max-w-md leading-relaxed">
            Connect Marine Analytica to your existing research tools via n8n webhooks. Automate data export
            to Google Sheets, trigger alerts when stock thresholds are breached, and schedule batch reports.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-2">
          {[
            { icon: Webhook, label: "Webhook Triggers" },
            { icon: GitBranch, label: "Workflow Builder" },
            { icon: BarChart2, label: "Scheduled Reports" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[rgba(7,30,56,0.4)] border border-[rgba(61,143,224,0.1)]">
              <Icon className="w-5 h-5 text-[var(--color-solar-400)]" />
              <p className="text-xs text-[var(--color-ocean-200)]">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
