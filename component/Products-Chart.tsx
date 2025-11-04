"use client";

import { CartesianGrid, ResponsiveContainer, AreaChart, XAxis, YAxis, Area, Tooltip } from "recharts";

interface ChartData {
  weeks: string;
  products: number;
}

export default function ProductsChart({ data }: { data: ChartData[] }) {
    return (
        <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 6, right: 10, left: -35, bottom: 2 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="weeks" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Area type="monotone" dataKey="products" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} strokeWidth={2} dot={{ fill: "#8b5cf6", r: 2 }} activeDot={{ fill: "#8b5cf6", r: 4 }} />
                    <Tooltip contentStyle={{
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        fontSize: '12px',
                    }}
                        labelStyle={{ color: '#666', fontWeight: 'bold' }}
                    />
                </AreaChart>
        </ResponsiveContainer>
    </div>
        );
}
