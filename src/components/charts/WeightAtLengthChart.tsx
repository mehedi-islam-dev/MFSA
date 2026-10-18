"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";
import { formatNumber } from "@/lib/utils";

interface WeightAtLengthChartProps {
  data: { totalLength: number; predictedW: number }[];
  isPrint?: boolean;
}

const LINE_COLOR = "#00d4aa";
const AXIS_COLOR = "#7cb9ef";
const GRID_COLOR = "rgba(61,143,224,0.1)";

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="glass" style={{ padding: "10px 14px", borderRadius: 10, fontSize: 12 }}>
      <p style={{ color: "#7cb9ef" }}>Length: <span style={{ color: "#fff" }}>{formatNumber(d.totalLength, 1)} cm</span></p>
      <p style={{ color: "#7cb9ef" }}>Predicted Weight: <span style={{ color: "#fff" }}>{formatNumber(d.predictedW, 1)} g</span></p>
    </div>
  );
};

export default function WeightAtLengthChart({ data, isPrint = false }: WeightAtLengthChartProps) {
  const axisColor = isPrint ? "#000000" : AXIS_COLOR;
  const gridColor = isPrint ? "#cccccc" : GRID_COLOR;

  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 20, left: 10, bottom: 30 }}
      >
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
          dataKey="predictedW"
          type="number"
          domain={["auto", "auto"]}
          stroke={axisColor}
          tick={{ fill: axisColor, fontSize: 11 }}
          tickLine={{ stroke: axisColor }}
        >
          <Label value="Predicted Weight (g)" angle={-90} position="insideLeft" offset={15} fill={axisColor} fontSize={12} />
        </YAxis>
        <Tooltip content={isPrint ? <></> : <CustomTooltip />} />
        
        <Line
          type="monotone"
          dataKey="predictedW"
          stroke={isPrint ? "#000000" : LINE_COLOR}
          strokeWidth={isPrint ? 1.5 : 2}
          dot={false}
          isAnimationActive={!isPrint}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
