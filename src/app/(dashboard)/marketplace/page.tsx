"use client";

import { Store, Package, Users, Globe } from "lucide-react";

const SAMPLE_LISTINGS = [
  { name: "Premium Barramundi Dataset — Kerala 2024", seller: "CMFRI Lab", price: "$49", tag: "Dataset" },
  { name: "Hilsa Stock Assessment Report — Bay of Bengal", seller: "BOBP-IGO", price: "$89", tag: "Report" },
  { name: "Snapper LWR Parameters Pack (12 species)", seller: "Dr. A. Kumar", price: "$29", tag: "Dataset" },
  { name: "Trawl Survey Data — Gulf of Mannar 2023", seller: "FSI India", price: "$120", tag: "Survey" },
];

export default function MarketplacePage() {
  return (
    <div className="page-container">
      <div className="section-header">
        <div className="icon-wrap"><Store className="w-5 h-5" /></div>
        <div>
          <h2 className="text-xl font-bold text-white">B2B Marketplace</h2>
          <p className="text-sm text-[var(--color-ocean-200)]">Buy and sell marine research datasets, reports, and services</p>
        </div>
      </div>

      {/* Coming Soon Banner */}
      <div className="glass-card p-8 flex items-center gap-6 coming-soon-bg">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[rgba(0,212,170,0.1)] border border-[rgba(0,212,170,0.15)] flex-shrink-0 animate-float">
          <Store className="w-8 h-8 text-[var(--color-teal-400)] opacity-60" />
        </div>
        <div>
          <div className="badge-teal mb-2">Coming Soon</div>
          <h3 className="text-xl font-bold text-white mb-1">Research Data Marketplace</h3>
          <p className="text-sm text-[var(--color-ocean-200)]">
            A peer-to-peer platform for marine researchers to monetize datasets, buy validated stock assessment data,
            and commission custom surveys.
          </p>
        </div>
      </div>

      {/* Preview Listings */}
      <div>
        <p className="text-sm font-semibold text-[var(--color-ocean-300)] mb-4 uppercase tracking-wider">
          Preview — Sample Listings
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {SAMPLE_LISTINGS.map((item, i) => (
            <div key={i} className="glass-card p-5 flex flex-col gap-3 opacity-70 pointer-events-none select-none">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-white text-[14px] leading-snug flex-1">{item.name}</p>
                <span className="badge-teal text-[10px] flex-shrink-0">{item.tag}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[rgba(0,212,170,0.15)] flex items-center justify-center">
                    <Users className="w-3 h-3 text-[var(--color-teal-400)]" />
                  </div>
                  <span className="text-xs text-[var(--color-ocean-200)]">{item.seller}</span>
                </div>
                <span className="text-base font-bold text-[var(--color-teal-400)]">{item.price}</span>
              </div>
              <div className="flex gap-2">
                <Package className="w-3.5 h-3.5 text-[var(--color-ocean-400)]" />
                <Globe className="w-3.5 h-3.5 text-[var(--color-ocean-400)]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
