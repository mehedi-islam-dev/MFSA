"use client";

import { FishRecord } from "@/components/providers/DataProvider";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export function LengthWeightModelChart({ records }: { records: FishRecord[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#0891b2" strokeOpacity={0.2} vertical={false} />
        <XAxis 
          dataKey="length" 
          type="number" 
          name="Length" 
          unit=" cm" 
          stroke="#0891b2"
          tick={{ fill: '#67e8f9', fontFamily: 'monospace' }}
        />
        <YAxis 
          dataKey="weight" 
          type="number" 
          name="Weight" 
          unit=" g" 
          stroke="#0891b2"
          tick={{ fill: '#67e8f9', fontFamily: 'monospace' }}
        />
        <Tooltip 
          cursor={{ strokeDasharray: '3 3', stroke: '#00f0ff' }}
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
        <Legend wrapperStyle={{ paddingTop: '10px', color: '#00f0ff', fontFamily: 'monospace' }} />
        <Scatter 
          name="Fish Samples" 
          data={records} 
          fill="#00f0ff" 
          style={{ filter: 'drop-shadow(0px 0px 8px rgba(0,240,255,1))' }} 
          isAnimationActive={true} 
          animationDuration={1500}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
