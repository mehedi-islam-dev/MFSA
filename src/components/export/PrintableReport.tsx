"use client";

import { forwardRef } from "react";
import { SummaryStats, ReportMeta, LengthBin } from "@/types";
import { buildRegressionPoints, computeSexBreakdown, buildConditionDistribution, buildResiduals } from "@/lib/fish-math";
import { formatNumber } from "@/lib/utils";
import LengthWeightChart from "@/components/charts/LengthWeightChart";
import LengthFrequencyChart from "@/components/charts/LengthFrequencyChart";
import SexMaturityChart from "@/components/charts/SexMaturityChart";
import ConditionFactorChart from "@/components/charts/ConditionFactorChart";
import ResidualsChart from "@/components/charts/ResidualsChart";
import { FishSample } from "@/types";

interface PrintableReportProps {
  meta: ReportMeta;
  stats: SummaryStats;
  samples: FishSample[];
}

// ============================================================
// PrintableReport — A4-optimized academic report component
// This component is ONLY rendered in the print canvas
// ============================================================
const PrintableReport = forwardRef<HTMLDivElement, PrintableReportProps>(
  ({ meta, stats, samples }, ref) => {
    const regressionPoints = buildRegressionPoints(samples, stats.lwrParams);
    const sexBreakdown = computeSexBreakdown(samples, stats.lwrParams);
    const conditionDist = buildConditionDistribution(samples, stats.lwrParams, 0.05);
    const residuals = buildResiduals(samples, stats.lwrParams);
    const { lwrParams: lwr } = stats;

    const printStyle: React.CSSProperties = {
      fontFamily: "Georgia, 'Times New Roman', serif",
      color: "#000000",
      background: "#ffffff",
    };

    const headingStyle: React.CSSProperties = {
      color: "#000000",
      fontWeight: "bold",
    };

    const labelStyle: React.CSSProperties = {
      color: "#444444",
      fontSize: 11,
      fontFamily: "Arial, sans-serif",
    };

    const valueStyle: React.CSSProperties = {
      color: "#000000",
      fontSize: 12,
      fontWeight: 600,
      fontFamily: "Arial, sans-serif",
    };

    return (
      <div
        id="printable-report"
        ref={ref}
        style={{
          ...printStyle,
          width: "210mm",
          minHeight: "297mm",
          padding: "20mm",
          boxSizing: "border-box",
          background: "#ffffff",
        }}
      >
        {/* ── Header ── */}
        <div style={{ borderBottom: "2px solid #000", paddingBottom: 12, marginBottom: 20 }}>
          <p style={{ ...labelStyle, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>
            Marine Analytica — Scientific Report
          </p>
          <h1 style={{ ...headingStyle, fontSize: 22, marginBottom: 6 }}>
            {meta.title}
          </h1>
          <h2 style={{ ...headingStyle, fontSize: 16, fontStyle: "italic", marginBottom: 12 }}>
            {meta.species}
          </h2>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            {[
              ["Author", meta.author],
              ["Institution", meta.institution],
              ["Location", meta.location],
              ["Date", meta.date],
            ].map(([label, value]) => (
              <div key={label}>
                <p style={labelStyle}>{label}</p>
                <p style={valueStyle}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Abstract ── */}
        <section style={{ marginBottom: 24 }}>
          <h3 style={{ ...headingStyle, fontSize: 14, borderBottom: "1px solid #ccc", paddingBottom: 4, marginBottom: 8 }}>
            Abstract
          </h3>
          <p style={{ fontSize: 12, lineHeight: 1.7, color: "#000", fontFamily: "Arial, sans-serif", textAlign: "justify" }}>
            This report presents the length-weight relationship (LWR) and population structure analysis for <em>{meta.species}</em> based on{" "}
            {stats.n} specimens collected from {meta.location}. The LWR was estimated using log-transformed data
            following the model W = aL<sup>b</sup>. The allometric coefficient b = {formatNumber(lwr.b, 4)} (95% CI: [{formatNumber(lwr.ci_b_lower || 0, 4)}, {formatNumber(lwr.ci_b_upper || 0, 4)}]; R² ={" "}
            {formatNumber(lwr.r2, 4)}) indicates {lwr.b < 3 ? "negative" : lwr.b > 3 ? "positive" : "isometric"} allometric
            growth. The mean Fulton condition factor K = {formatNumber(stats.meanK, 4)} suggests
            {stats.meanK >= 1 ? " healthy" : " below-average"} condition of the sampled population.
          </p>
        </section>

        {/* ── Summary Statistics ── */}
        <section style={{ marginBottom: 24 }}>
          <h3 style={{ ...headingStyle, fontSize: 14, borderBottom: "1px solid #ccc", paddingBottom: 4, marginBottom: 12 }}>
            1. Summary Statistics
          </h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: "Arial, sans-serif" }}>
            <thead>
              <tr>
                {["Parameter", "N", "Mean ± SD", "Min", "Max"].map((h) => (
                  <th key={h} style={{ border: "1px solid #999", padding: "6px 10px", background: "#f0f0f0", textAlign: "left", fontWeight: "bold" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  label: "Total Length (cm)",
                  n: stats.n,
                  mean: `${formatNumber(stats.meanTL)} ± ${formatNumber(stats.sdTL)}`,
                  min: formatNumber(stats.minTL, 1),
                  max: formatNumber(stats.maxTL, 1),
                },
                {
                  label: "Body Weight (g)",
                  n: stats.n,
                  mean: `${formatNumber(stats.meanWeight)} ± ${formatNumber(stats.sdWeight)}`,
                  min: formatNumber(stats.minWeight, 1),
                  max: formatNumber(stats.maxWeight, 1),
                },
              ].map((row, i) => (
                <tr key={row.label} style={{ background: i % 2 === 0 ? "#fff" : "#f9f9f9" }}>
                  {[row.label, row.n, row.mean, row.min, row.max].map((v, j) => (
                    <td key={j} style={{ border: "1px solid #ccc", padding: "5px 10px" }}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ── LWR Parameters ── */}
        <section style={{ marginBottom: 24 }}>
          <h3 style={{ ...headingStyle, fontSize: 14, borderBottom: "1px solid #ccc", paddingBottom: 4, marginBottom: 12 }}>
            2. Length-Weight Relationship Parameters
          </h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: "Arial, sans-serif" }}>
            <thead>
              <tr>
                {["Parameter", "Value", "Interpretation"].map((h) => (
                  <th key={h} style={{ border: "1px solid #999", padding: "6px 10px", background: "#f0f0f0", textAlign: "left", fontWeight: "bold" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { param: "a (intercept)", value: lwr.a.toString(), interp: "Condition at unit length" },
                { param: "b (slope / exponent)", value: `${formatNumber(lwr.b, 4)} ± ${formatNumber(lwr.se_b || 0, 4)} SE`, interp: lwr.b < 3 ? "Negative allometric growth (b < 3)" : lwr.b > 3 ? "Positive allometric growth (b > 3)" : "Isometric growth (b = 3)" },
                { param: "R² (coefficient of determination)", value: formatNumber(lwr.r2, 4), interp: lwr.r2 > 0.95 ? "Excellent fit" : lwr.r2 > 0.9 ? "Good fit" : "Fair fit" },
                { param: "Mean Fulton's K", value: formatNumber(stats.meanK, 4), interp: stats.meanK >= 1 ? "Healthy condition (K ≥ 1)" : "Below average condition (K < 1)" },
              ].map((row, i) => (
                <tr key={row.param} style={{ background: i % 2 === 0 ? "#fff" : "#f9f9f9" }}>
                  <td style={{ border: "1px solid #ccc", padding: "5px 10px", fontStyle: "italic" }}>{row.param}</td>
                  <td style={{ border: "1px solid #ccc", padding: "5px 10px", fontWeight: 600 }}>{row.value}</td>
                  <td style={{ border: "1px solid #ccc", padding: "5px 10px" }}>{row.interp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ── LWR Chart ── */}
        <section style={{ marginBottom: 24, pageBreakInside: "avoid" }}>
          <h3 style={{ ...headingStyle, fontSize: 14, borderBottom: "1px solid #ccc", paddingBottom: 4, marginBottom: 12 }}>
            3. Length-Weight Scatter Plot
          </h3>
          <div style={{ background: "#fff", padding: "8px 0" }}>
            <LengthWeightChart data={regressionPoints} lwr={stats.lwrParams} isPrint />
          </div>
          <p style={{ fontSize: 10, color: "#555", fontFamily: "Arial", marginTop: 6, textAlign: "center", fontStyle: "italic" }}>
            Figure 1. Log-transformed length-weight scatter plot. W = {lwr.a} × L<sup>{formatNumber(lwr.b, 4)}</sup> (R² = {formatNumber(lwr.r2, 4)}).
          </p>
        </section>

        {/* ── Residuals & Sex Charts ── */}
        <section style={{ marginBottom: 24, pageBreakInside: "avoid" }}>
          <h3 style={{ ...headingStyle, fontSize: 14, borderBottom: "1px solid #ccc", paddingBottom: 4, marginBottom: 12 }}>
            4. Diagnostics & Population Structure
          </h3>
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 1, background: "#fff", padding: "8px 0" }}>
              <p style={{ fontSize: 11, fontWeight: "bold", textAlign: "center" }}>LWR Residuals</p>
              <ResidualsChart data={residuals} isPrint />
            </div>
            <div style={{ flex: 1, background: "#fff", padding: "8px 0" }}>
              <p style={{ fontSize: 11, fontWeight: "bold", textAlign: "center" }}>Sex Distribution</p>
              <SexMaturityChart data={sexBreakdown} isPrint />
            </div>
          </div>
        </section>

        {/* ── Frequency Chart ── */}
        <section style={{ marginBottom: 24, pageBreakInside: "avoid" }}>
          <h3 style={{ ...headingStyle, fontSize: 14, borderBottom: "1px solid #ccc", paddingBottom: 4, marginBottom: 12 }}>
            5. Length Frequency Distribution
          </h3>
          <div style={{ background: "#fff", padding: "8px 0" }}>
            <LengthFrequencyChart data={stats.lengthBins} meanLength={stats.meanTL} isPrint />
          </div>
          <p style={{ fontSize: 10, color: "#555", fontFamily: "Arial", marginTop: 6, textAlign: "center", fontStyle: "italic" }}>
            Figure 2. Length frequency histogram. Dashed line indicates mean total length ({formatNumber(stats.meanTL, 1)} cm).
          </p>
        </section>

        {/* ── Frequency Table ── */}
        <section style={{ marginBottom: 24, pageBreakInside: "avoid" }}>
          <h3 style={{ ...headingStyle, fontSize: 14, borderBottom: "1px solid #ccc", paddingBottom: 4, marginBottom: 12 }}>
            6. Length Frequency Table
          </h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10, fontFamily: "Arial, sans-serif" }}>
            <thead>
              <tr>
                {["Length Class (cm)", "Midpoint (cm)", "Count (n)", "Frequency (%)", "Cumulative (%)"].map((h) => (
                  <th key={h} style={{ border: "1px solid #999", padding: "5px 8px", background: "#f0f0f0", textAlign: "center", fontWeight: "bold" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.lengthBins.map((bin: LengthBin, i: number) => {
                const cum = stats.lengthBins.slice(0, i + 1).reduce((a, b) => a + b.frequency, 0);
                return (
                  <tr key={bin.bin} style={{ background: i % 2 === 0 ? "#fff" : "#f9f9f9" }}>
                    {[bin.bin, bin.midpoint, bin.count, `${bin.frequency.toFixed(2)}%`, `${cum.toFixed(2)}%`].map((v, j) => (
                      <td key={j} style={{ border: "1px solid #ccc", padding: "4px 8px", textAlign: "center" }}>{v}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        {/* ── Footer ── */}
        <div style={{ borderTop: "1px solid #ccc", paddingTop: 12, marginTop: 24, display: "flex", justifyContent: "space-between", fontSize: 9, color: "#777", fontFamily: "Arial" }}>
          <span>Generated by Marine Analytica v2.0 — {new Date().toLocaleDateString()}</span>
          <span>Confidential — For Academic Use Only</span>
        </div>
      </div>
    );
  }
);

PrintableReport.displayName = "PrintableReport";
export default PrintableReport;
