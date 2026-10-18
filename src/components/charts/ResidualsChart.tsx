"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label,
  Cell,
} from "recharts";
import { formatNumber } from "@/lib/utils";

interface ResidualsChartProps {
  data: { totalLength: number; residual: number; sex?: string }[];
  isPrint?: boolean;
}

const AXIS_COLOR = "#7cb9ef";
const GRID_COLOR = "rgba(61,143,224,0.1)";
const MALE_COLOR = "#4dabf7";
const FEMALE_COLOR = "#ff8787";
const UNKNOWN_COLOR = "#00d4aa";

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const sexLabel = d.sex === "M" ? "Male" : d.sex === "F" ? "Female" : d.sex === "U" ? "Undetermined" : "Unknown";
  return (
    <div className="glass" style={{ padding: "10px 14px", borderRadius: 10, fontSize: 12 }}>
      <p style={{ color: "#e2eaf4", fontWeight: 600, marginBottom: 4 }}>Sex: {sexLabel}</p>
      <p style={{ color: "#7cb9ef" }}>Total Length: <span style={{ color: "#fff" }}>{formatNumber(d.totalLength, 1)} cm</span></p>
      <p style={{ color: "#7cb9ef" }}>Residual: <span style={{ color: "#fff" }}>{formatNumber(d.residual, 4)}</span></p>
    </div>
  );
};

export default function ResidualsChart({ data, isPrint = false }: ResidualsChartProps) {
  const axisColor = isPrint ? "#000000" : AXIS_COLOR;
  const gridColor = isPrint ? "#cccccc" : GRID_COLOR;

  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ScatterChart margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis
          dataKey="totalLength"
          type="number"
          domain={["auto", "auto"]}
          stroke={axisColor}
          tick={{ fill: axisColor, fontSize: 11 }}
          tickLine={{ stroke: axisColor }}
        >
          <Label value="Total Length (cm)" position="insideBottom" offset={-18} fill={axisColor} fontSize={12} />
        </XAxis>
        <YAxis
          dataKey="residual"
          type="number"
          domain={["auto", "auto"]}
          stroke={axisColor}
          tick={{ fill: axisColor, fontSize: 11 }}
          tickLine={{ stroke: axisColor }}
        >
          <Label value="Residual log₁₀(W)" angle={-90} position="insideLeft" offset={15} fill={axisColor} fontSize={12} />
        </YAxis>
        <Tooltip content={isPrint ? <></> : <CustomTooltip />} />
        
        <ReferenceLine y={0} stroke={isPrint ? "#000000" : "#ffd166"} strokeDasharray="4 3" />
        
        <Scatter
          name="Residuals"
          data={data}
          fillOpacity={isPrint ? 1 : 0.75}
          isAnimationActive={!isPrint}
          r={isPrint ? 3 : 4}
        >
          {data.map((entry, index) => {
            let color = UNKNOWN_COLOR;
            if (entry.sex === "M") color = MALE_COLOR;
            else if (entry.sex === "F") color = FEMALE_COLOR;
            return (
              <Cell 
                key={`cell-${index}`} 
                fill={isPrint ? (entry.sex === "M" ? "#555" : entry.sex === "F" ? "#888" : "#333") : color} 
                stroke={isPrint ? "#000" : undefined}
              />
            );
          })}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}
