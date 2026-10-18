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
  ReferenceLine,
  Label,
} from "recharts";
import { LengthBin } from "@/types";
import { formatNumber } from "@/lib/utils";

interface LengthFrequencyChartProps {
  data: LengthBin[];
  meanLength: number;
  isPrint?: boolean;
}

const BAR_COLOR = "#1a6fcc";
const BAR_COLOR_PRINT = "#555555";
const AXIS_COLOR = "#7cb9ef";
const GRID_COLOR = "rgba(61,143,224,0.1)";

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: LengthBin }[] }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="glass" style={{ padding: "10px 14px", borderRadius: 10, fontSize: 12 }}>
      <p style={{ color: "#e2eaf4", fontWeight: 600, marginBottom: 4 }}>Class: {d.bin} cm</p>
      <p style={{ color: "#7cb9ef" }}>Count: <span style={{ color: "#fff" }}>{d.count}</span></p>
      <p style={{ color: "#7cb9ef" }}>Frequency: <span style={{ color: "#fff" }}>{formatNumber(d.frequency, 1)}%</span></p>
      <p style={{ color: "#7cb9ef" }}>Midpoint: <span style={{ color: "#fff" }}>{d.midpoint} cm</span></p>
    </div>
  );
};

export default function LengthFrequencyChart({ data, meanLength, isPrint = false }: LengthFrequencyChartProps) {
  const axisColor = isPrint ? "#000000" : AXIS_COLOR;
  const gridColor = isPrint ? "#cccccc" : GRID_COLOR;
  const maxFreq = Math.max(...data.map((d) => d.frequency), 0);

  return (
    <div>
      {/* Summary line */}
      <div style={{ fontSize: 13, color: isPrint ? "#000" : "var(--color-ocean-200)", marginBottom: 12 }}>
        <span style={{ marginRight: 16 }}>Bin width: 5 cm</span>
        <span style={{ marginRight: 16 }}>Classes: {data.length}</span>
        <strong style={{ color: isPrint ? "#000" : "var(--color-teal-400)" }}>
          Mean TL: {formatNumber(meanLength, 1)} cm
        </strong>
      </div>

      <ResponsiveContainer width="100%" height={300}>
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
            <Label value="Length Class (cm)" position="insideBottom" offset={-35} fill={axisColor} fontSize={12} />
          </XAxis>
          <YAxis
            stroke={axisColor}
            tick={{ fill: axisColor, fontSize: 11 }}
            tickLine={{ stroke: axisColor }}
            domain={[0, Math.ceil(maxFreq * 1.15)]}
          >
            <Label value="Relative Frequency (%)" angle={-90} position="insideLeft" offset={15} fill={axisColor} fontSize={12} />
          </YAxis>
          <Tooltip content={isPrint ? <></> : <CustomTooltip />} />

          {/* Mean length reference line */}
          {meanLength > 0 && (
            <ReferenceLine
              x={data.find((d) => d.midpoint >= meanLength)?.bin}
              stroke={isPrint ? "#000000" : "#ffd166"}
              strokeDasharray="4 3"
              strokeWidth={isPrint ? 1 : 1.5}
              label={{ value: `Mean (${formatNumber(meanLength, 1)})`, fill: isPrint ? "#000" : "#ffd166", fontSize: 10, position: "top" }}
            />
          )}

          <Bar
            dataKey="frequency"
            name="Frequency (%)"
            isAnimationActive={!isPrint}
            radius={[3, 3, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={isPrint ? BAR_COLOR_PRINT : `rgba(26,111,204,${0.5 + (entry.frequency / maxFreq) * 0.5})`}
                stroke={isPrint ? "#000" : "#3d8fe0"}
                strokeWidth={0.5}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
