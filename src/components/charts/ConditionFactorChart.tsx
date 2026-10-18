"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Label,
} from "recharts";
import { formatNumber } from "@/lib/utils";

interface ConditionFactorChartProps {
  data: { bin: string; midpoint: number; count: number; frequency: number }[];
  isPrint?: boolean;
}

const BAR_COLOR = "#ff6b6b";
const BAR_COLOR_PRINT = "#555555";
const AXIS_COLOR = "#7cb9ef";
const GRID_COLOR = "rgba(61,143,224,0.1)";

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="glass" style={{ padding: "10px 14px", borderRadius: 10, fontSize: 12 }}>
      <p style={{ color: "#e2eaf4", fontWeight: 600, marginBottom: 4 }}>Kn Range: {d.bin}</p>
      <p style={{ color: "#7cb9ef" }}>Count: <span style={{ color: "#fff" }}>{d.count}</span></p>
      <p style={{ color: "#7cb9ef" }}>Frequency: <span style={{ color: "#fff" }}>{formatNumber(d.frequency, 1)}%</span></p>
    </div>
  );
};

export default function ConditionFactorChart({ data, isPrint = false }: ConditionFactorChartProps) {
  const axisColor = isPrint ? "#000000" : AXIS_COLOR;
  const gridColor = isPrint ? "#cccccc" : GRID_COLOR;

  if (!data || data.length === 0) return null;

  const maxFreq = Math.max(...data.map((d) => d.frequency), 0);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 20, left: 10, bottom: 30 }}
        barCategoryGap="10%"
      >
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis
          dataKey="bin"
          stroke={axisColor}
          tick={{ fill: axisColor, fontSize: 10 }}
          tickLine={{ stroke: axisColor }}
          interval={0}
          angle={-30}
          textAnchor="end"
          height={50}
        >
          <Label value="Relative Condition (Kn)" position="insideBottom" offset={-35} fill={axisColor} fontSize={12} />
        </XAxis>
        <YAxis
          stroke={axisColor}
          tick={{ fill: axisColor, fontSize: 11 }}
          tickLine={{ stroke: axisColor }}
          domain={[0, Math.ceil(maxFreq * 1.15)]}
        >
          <Label value="Frequency (%)" angle={-90} position="insideLeft" offset={15} fill={axisColor} fontSize={12} />
        </YAxis>
        <Tooltip content={isPrint ? <></> : <CustomTooltip />} cursor={{ fill: "rgba(255,107,107,0.1)" }} />
        
        <Bar dataKey="frequency" isAnimationActive={!isPrint} radius={[3, 3, 0, 0]}>
          {data.map((entry, index) => {
            const intensity = 0.5 + (entry.frequency / maxFreq) * 0.5;
            return (
              <Cell
                key={`cell-${index}`}
                fill={isPrint ? BAR_COLOR_PRINT : `rgba(255,107,107,${intensity})`}
                stroke={isPrint ? "#000" : "#ff8585"}
                strokeWidth={0.5}
              />
            );
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
