"use client";

import { FishRecord } from "@/components/providers/DataProvider";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";

export function LengthFrequencyChart({ records }: { records: FishRecord[] }) {
  const bins: Record<string, number> = {};
  records.forEach((r) => {
    const binStart = Math.floor(r.length / 10) * 10;
    const binLabel = `${binStart}-${binStart + 9.9}`;
    bins[binLabel] = (bins[binLabel] || 0) + 1;
  });

  const barData = Object.entries(bins)
    .map(([bin, count]) => ({ bin, count }))
    .sort((a, b) => parseInt(a.bin) - parseInt(b.bin));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={barData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#0891b2" strokeOpacity={0.2} vertical={false} />
        <XAxis
          dataKey="bin"
          stroke="#0891b2"
          tick={{ fill: "#67e8f9", fontFamily: "monospace" }}
        >
          <Label value="Length Class (cm)" position="insideBottom" offset={-15} fill="#67e8f9" style={{ fontFamily: "monospace" }} />
        </XAxis>
        <YAxis
          stroke="#0891b2"
          tick={{ fill: "#67e8f9", fontFamily: "monospace" }}
        >
          <Label value="Frequency (count)" angle={-90} position="insideLeft" offset={10} fill="#67e8f9" style={{ fontFamily: "monospace" }} />
        </YAxis>
        <Tooltip 
          cursor={{ fill: 'rgba(0,240,255,0.1)' }}
          contentStyle={{ 
            backgroundColor: 'rgba(1,4,9,0.9)', 
            backdropFilter: 'blur(16px)', 
            borderColor: '#00f0ff', 
            color: '#00f0ff', 
            borderRadius: '0.25rem', 
            fontFamily: 'monospace', 
            boxShadow: '0 0 25px rgba(0,240,255,0.3)',
            textTransform: 'uppercase'
          }}
          itemStyle={{ color: '#00f0ff' }}
        />
        <Bar 
          dataKey="count" 
          fill="#00f0ff" 
          style={{ filter: 'drop-shadow(0px 0px 8px rgba(0,240,255,0.9))' }} 
          isAnimationActive={true} 
          animationDuration={1500}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
