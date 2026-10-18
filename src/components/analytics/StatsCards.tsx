"use client";

import { SummaryStats } from "@/types";
import { formatNumber } from "@/lib/utils";
import { testIsometry } from "@/lib/fish-math";
import { TrendingUp, Scale, Ruler, Activity, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardsProps {
  stats: SummaryStats;
  isPrint?: boolean;
}

export default function StatsCards({ stats, isPrint = false }: StatsCardsProps) {
  if (stats.n === 0) return null;

  const { lwrParams: lwr } = stats;

  const isBAllometric = lwr.b < 2.5 || lwr.b > 3.5;
  const { isIsometric, verdict } = testIsometry(lwr.b, lwr.se_b || 0, lwr.n);

  const cards = [
    {
      icon: Ruler,
      label: "Total Length",
      color: "teal",
      rows: [
        { label: "Mean", value: `${formatNumber(stats.meanTL)} cm` },
        { label: "SD", value: `±${formatNumber(stats.sdTL)} cm` },
        { label: "Range", value: `${formatNumber(stats.minTL, 1)}–${formatNumber(stats.maxTL, 1)} cm` },
      ],
    },
    {
      icon: Scale,
      label: "Body Weight",
      color: "blue",
      rows: [
        { label: "Mean", value: `${formatNumber(stats.meanWeight)} g` },
        { label: "SD", value: `±${formatNumber(stats.sdWeight)} g` },
        { label: "Range", value: `${formatNumber(stats.minWeight, 1)}–${formatNumber(stats.maxWeight, 1)} g` },
      ],
    },
    {
      icon: TrendingUp,
      label: "LWR Parameters",
      color: "solar",
      rows: [
        { label: "a (intercept)", value: lwr.a.toString() },
        { label: "b (slope)", value: `${formatNumber(lwr.b, 4)} ± ${formatNumber(lwr.se_b || 0, 4)} SE` },
        { label: "R²", value: `${formatNumber(lwr.r2, 4)} (${lwr.r2 > 0.95 ? "Excellent" : lwr.r2 > 0.9 ? "Good" : "Fair"})` },
      ],
    },
    {
      icon: Activity,
      label: "Condition Factor",
      color: "coral",
      rows: [
        { label: "Mean Fulton's K", value: formatNumber(stats.meanK, 4) },
        { label: "N (valid samples)", value: stats.n.toString() },
        { label: "Status", value: stats.meanK > 1 ? "Above average condition" : "Below average condition" },
      ],
    },
  ];

  const colorMap: Record<string, string> = {
    teal: "rgba(0,212,170,0.1)",
    blue: "rgba(26,111,204,0.12)",
    solar: "rgba(255,209,102,0.1)",
    coral: "rgba(255,107,107,0.1)",
  };

  const textColorMap: Record<string, string> = {
    teal: "var(--color-teal-400)",
    blue: "var(--color-ocean-300)",
    solar: "var(--color-solar-400)",
    coral: "var(--color-coral-400)",
  };

  return (
    <div>
      <div className={cn("grid gap-4", "sm:grid-cols-2 xl:grid-cols-4")}>
        {cards.map(({ icon: Icon, label, color, rows }) => (
          <div key={label} className={isPrint ? "print-stat-card" : "stat-card"}>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: isPrint ? "transparent" : colorMap[color] }}>
                <Icon className="w-4 h-4" style={{ color: isPrint ? "#000" : textColorMap[color] }} />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: isPrint ? "#000" : textColorMap[color] }}>
                {label}
              </p>
            </div>
            <div className="space-y-1.5">
              {rows.map(({ label: rl, value }) => (
                <div key={rl} className="flex items-start justify-between gap-2">
                  <span className="text-xs" style={{ color: isPrint ? "#444" : "var(--color-ocean-300)" }}>{rl}</span>
                  <span className="text-xs font-semibold text-right flex-shrink-0" style={{ color: isPrint ? "#000" : "#e2eaf4" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* b-value notes */}
      {!isPrint && (
        <div className="mt-4 space-y-2">
          {/* Isometry test result */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-[rgba(61,143,224,0.08)] border border-[rgba(61,143,224,0.2)]">
            <Info className="w-4 h-4 text-[var(--color-ocean-300)] flex-shrink-0" />
            <p className="text-xs text-[var(--color-ocean-200)]">
              <strong>Allometry Test:</strong> {verdict} (95% CI: [{formatNumber(lwr.ci_b_lower || 0, 4)}, {formatNumber(lwr.ci_b_upper || 0, 4)}])
            </p>
          </div>

          {/* Extreme values warning */}
          {isBAllometric && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[rgba(255,209,102,0.08)] border border-[rgba(255,209,102,0.2)]">
              <AlertTriangle className="w-4 h-4 text-[var(--color-solar-400)] flex-shrink-0" />
              <p className="text-xs text-[var(--color-solar-400)]">
                Warning: b = {formatNumber(lwr.b, 4)} is outside the normal expected range [2.5–3.5]. Verify sample quality, precision, or check for outlier residuals.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
