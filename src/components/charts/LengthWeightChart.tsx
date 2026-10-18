"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
  Legend,
  Label,
} from "recharts";
import { RegressionPoint, LWRParams } from "@/types";
import { formatNumber } from "@/lib/utils";

interface LengthWeightChartProps {
  data: RegressionPoint[];
  lwr: LWRParams;
  isPrint?: boolean;
}

const AXIS_COLOR = "#7cb9ef";
const GRID_COLOR = "rgba(61,143,224,0.1)";
const SCATTER_COLOR = "#00d4aa";
const LINE_COLOR = "#ffd166";

// Custom tooltip
const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: RegressionPoint }[] }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="glass" style={{ padding: "10px 14px", borderRadius: 10, fontSize: 12 }}>
      <p style={{ color: "#e2eaf4", fontWeight: 600, marginBottom: 4 }}>Fish Sample</p>
      <p style={{ color: "#7cb9ef" }}>Length: <span style={{ color: "#fff" }}>{formatNumber(d.totalLength, 1)} cm</span></p>
      <p style={{ color: "#7cb9ef" }}>Weight: <span style={{ color: "#fff" }}>{formatNumber(d.weight, 1)} g</span></p>
      <p style={{ color: "#7cb9ef" }}>log(L): <span style={{ color: "#fff" }}>{d.logL}</span></p>
      <p style={{ color: "#7cb9ef" }}>log(W): <span style={{ color: "#fff" }}>{d.logW}</span></p>
    </div>
  );
};

export default function LengthWeightChart({ data, lwr, isPrint = false }: LengthWeightChartProps) {
  const axisColor = isPrint ? "#000000" : AXIS_COLOR;
  const gridColor = isPrint ? "#cccccc" : GRID_COLOR;

  // Build regression line points
  const lineData = [...data]
    .sort((a, b) => a.logL - b.logL)
    .map((d) => ({ logL: d.logL, predictedLogW: d.predictedLogW }));

  return (
    <div>
      {/* Equation display */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div style={{ fontSize: 13, color: isPrint ? "#000" : "var(--color-ocean-200)" }}>
          <strong style={{ color: isPrint ? "#000" : "var(--color-teal-400)" }}>
            W = {lwr.a} × L<sup>{lwr.b}</sup>
          </strong>
          <span style={{ marginLeft: 16 }}>R² = {lwr.r2}</span>
          <span style={{ marginLeft: 16 }}>n = {lwr.n}</span>
          {lwr.b >= 2.5 && lwr.b <= 3.5 && (
            <span style={{ marginLeft: 16, color: isPrint ? "#000" : "var(--color-teal-400)", fontSize: 11 }}>
              ✓ b within normal range [2.5–3.5]
            </span>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <ComposedChart margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="logL"
            type="number"
            name="log(TL)"
            domain={["auto", "auto"]}
            stroke={axisColor}
            tick={{ fill: axisColor, fontSize: 11 }}
            tickLine={{ stroke: axisColor }}
          >
            <Label value="log₁₀(Total Length, cm)" position="insideBottom" offset={-18} fill={axisColor} fontSize={12} />
          </XAxis>
          <YAxis
            dataKey="logW"
            type="number"
            name="log(W)"
            domain={["auto", "auto"]}
            stroke={axisColor}
            tick={{ fill: axisColor, fontSize: 11 }}
            tickLine={{ stroke: axisColor }}
          >
            <Label value="log₁₀(Weight, g)" angle={-90} position="insideLeft" offset={15} fill={axisColor} fontSize={12} />
          </YAxis>
          <Tooltip content={isPrint ? <></> : <CustomTooltip />} />
          <Legend
            wrapperStyle={{ color: isPrint ? "#000" : "#7cb9ef", fontSize: 12, paddingTop: 16 }}
          />

          {/* Scatter points */}
          <Scatter
            name="Observed"
            data={data}
            fill={isPrint ? "#333333" : SCATTER_COLOR}
            fillOpacity={isPrint ? 1 : 0.75}
            stroke={isPrint ? "#000" : "rgba(0,212,170,0.6)"}
            strokeWidth={1}
            isAnimationActive={!isPrint}
            r={isPrint ? 3 : 4}
          />

          {/* Regression line */}
          <Line
            name="Regression Line"
            data={lineData}
            dataKey="predictedLogW"
            stroke={isPrint ? "#000000" : LINE_COLOR}
            strokeWidth={isPrint ? 1.5 : 2}
            dot={false}
            type="monotone"
            isAnimationActive={!isPrint}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
