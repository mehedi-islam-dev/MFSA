"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { SexBreakdown } from "@/lib/fish-math";

interface SexMaturityChartProps {
  data: SexBreakdown[];
  isPrint?: boolean;
}

const COLORS = {
  Male: "#4dabf7",
  Female: "#ff8787",
  Undetermined: "#00d4aa",
  Unknown: "#94a3b8"
};

const COLORS_PRINT = {
  Male: "#777777",
  Female: "#cccccc",
  Undetermined: "#333333",
  Unknown: "#aaaaaa"
};

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="glass" style={{ padding: "10px 14px", borderRadius: 10, fontSize: 12 }}>
      <p style={{ color: "#e2eaf4", fontWeight: 600, marginBottom: 4 }}>{d.sex}</p>
      <p style={{ color: "#7cb9ef" }}>Count: <span style={{ color: "#fff" }}>{d.count}</span></p>
      <p style={{ color: "#7cb9ef" }}>Percentage: <span style={{ color: "#fff" }}>{d.percentage}%</span></p>
      <p style={{ color: "#7cb9ef" }}>Mean TL: <span style={{ color: "#fff" }}>{d.meanTL} cm</span></p>
    </div>
  );
};

export default function SexMaturityChart({ data, isPrint = false }: SexMaturityChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={isPrint ? 40 : 60}
          outerRadius={isPrint ? 80 : 100}
          paddingAngle={isPrint ? 0 : 5}
          dataKey="count"
          nameKey="sex"
          isAnimationActive={!isPrint}
          stroke={isPrint ? "#000" : "none"}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={isPrint ? COLORS_PRINT[entry.sex as keyof typeof COLORS_PRINT] || "#999" : COLORS[entry.sex as keyof typeof COLORS] || "#94a3b8"} 
            />
          ))}
        </Pie>
        <Tooltip content={isPrint ? <></> : <CustomTooltip />} />
        <Legend wrapperStyle={{ color: isPrint ? "#000" : "#7cb9ef", fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
