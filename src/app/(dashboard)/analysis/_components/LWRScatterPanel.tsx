"use client";

import { FishRecord } from "@/components/providers/DataProvider";
import { LWRParams } from "@/lib/marineMath";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Line,
  ComposedChart, Label
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, Info } from "lucide-react";

interface Props {
  records: FishRecord[];
  lwrParams: LWRParams;
}

const TT_STYLE = {
  backgroundColor: "#010811",
  border: "1px solid rgba(0,240,255,0.4)",
  borderRadius: "8px",
  fontFamily: "monospace",
  fontSize: "11px",
  color: "#00f0ff",
};

export default function LWRScatterPanel({ records, lwrParams }: Props) {
  // Build scatter points: { length, weight, predictedWeight }
  const scatterData = records.map((r) => ({
    length: r.length,
    weight: r.weight,
  }));

  // Generate smooth regression line: W = a * L^b over the length range
  const lengths = records.map((r) => r.length);
  const minL = Math.max(0, Math.min(...lengths) - 2);
  const maxL = Math.max(...lengths) + 3;
  const regressionLine = lwrParams.b > 0
    ? Array.from({ length: 60 }, (_, i) => {
        const L = minL + (i * (maxL - minL)) / 59;
        return { length: parseFloat(L.toFixed(2)), predicted: parseFloat((lwrParams.a * Math.pow(L, lwrParams.b)).toFixed(2)) };
      })
    : [];

  // Growth type classification
  let growthType = "Isometric Growth";
  let growthColor = "#00ff66";
  if (lwrParams.b < 2.9) { growthType = "Negative Allometric"; growthColor = "#f59e0b"; }
  else if (lwrParams.b > 3.1) { growthType = "Positive Allometric"; growthColor = "#a855f7"; }

  const avgK = records.length > 0
    ? (records.reduce((s, r) => s + (r.weight / (0.01 * Math.pow(r.length, 3))), 0) / records.length).toFixed(3)
    : "�";

  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="glass-panel p-6 relative overflow-hidden">

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,240,255,0.04),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] opacity-[0.06] pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div>
            <h3 className="text-sm font-black tracking-[0.25em] uppercase text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.6)] flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              LWR Scatter Plot
            </h3>
            <p className="text-[10px] text-slate-500 mt-1 tracking-widest">
              Observed specimens � Least-squares regression fit � W = {lwrParams.a.toExponential(3)} � L^{lwrParams.b.toFixed(4)}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "a (intercept)", value: lwrParams.a.toExponential(4), color: "text-cyan-300" },
              { label: "b (exponent)",  value: lwrParams.b.toFixed(4),       color: "text-purple-300" },
              { label: "R�",            value: lwrParams.r2?.toFixed(4) ?? "�", color: "text-green-300" },
              { label: "n (records)", value: records.length.toString(), color: "text-yellow-300" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex flex-col items-center px-3 py-1.5 bg-cyan-950/20 border border-cyan-900/30 rounded-lg">
                <span className="text-[8px] text-slate-500 uppercase tracking-widest">{label}</span>
                <span className={`text-sm font-black font-mono ${color}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="h-64 md:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart margin={{ top: 5, right: 20, left: 0, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,240,255,0.07)" />
              <XAxis dataKey="length" type="number" domain={[minL, maxL]}
                tick={{ fill: "#4b7280", fontSize: 10, fontFamily: "monospace" }} tickLine={false} axisLine={false}>
                <Label value="Total Length (cm)" offset={-12} position="insideBottom" fill="#4b7280" fontSize={10} fontFamily="monospace" />
              </XAxis>
              <YAxis tick={{ fill: "#4b7280", fontSize: 10, fontFamily: "monospace" }} tickLine={false} axisLine={false}>
                <Label value="Weight (g)" angle={-90} position="insideLeft" fill="#4b7280" fontSize={10} fontFamily="monospace" />
              </YAxis>
              <Tooltip contentStyle={TT_STYLE} itemStyle={{ color: "#00f0ff" }}
                formatter={((v: unknown) => [`${Number(v).toFixed(2)} g`, "Value"]) as any} />
              {/* Regression line */}
              {regressionLine.length > 0 && (
                <Line data={regressionLine} dataKey="predicted" name="LWR Regression" type="monotone"
                  stroke="#00f0ff" strokeWidth={2} dot={false}
                  style={{ filter: "drop-shadow(0 0 5px rgba(0,240,255,0.7))" }} />
              )}
              {/* Scatter points */}
              <Scatter data={scatterData} dataKey="weight" name="weight" fill="rgba(168,85,247,0.75)"
                r={4} style={{ filter: "drop-shadow(0 0 4px rgba(168,85,247,0.6))" }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom stats row */}
        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Growth Type",          value: growthType,               color: growthColor },
            { label: "Avg Fulton K",         value: avgK,                     color: "#00f0ff"   },
            { label: "LWR Formula",          value: `W = a�L^b`,              color: "#a855f7"   },
            { label: "Sample Size",          value: `${records.length} specimens`, color: "#f59e0b" },
          ].map(({ label, value, color }) => (
            <div key={label} className="px-3 py-2.5 bg-cyan-950/20 border border-cyan-900/30 rounded-lg">
              <p className="text-[8px] text-slate-500 uppercase tracking-widest">{label}</p>
              <p className="text-xs font-black font-mono mt-0.5 truncate" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Info note */}
        <div className="mt-4 flex items-start gap-2 px-4 py-2.5 bg-cyan-950/10 border border-cyan-900/20 rounded-lg">
          <Info className="w-3.5 h-3.5 text-cyan-700 shrink-0 mt-0.5" />
          <p className="text-[9px] text-slate-600 tracking-wider leading-relaxed">
            Neon line = LWR regression curve (W = a�L^b). Purple dots = observed specimens.
            {lwrParams.b >= 2.9 && lwrParams.b <= 3.1 && " b � 3.0 indicates isometric growth (ideal health condition)."}
            {lwrParams.b < 2.9 && " b < 3.0 indicates negative allometry � fish grow proportionally lighter with length."}
            {lwrParams.b > 3.1 && " b > 3.0 indicates positive allometry � fish accumulate mass faster than length."}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
