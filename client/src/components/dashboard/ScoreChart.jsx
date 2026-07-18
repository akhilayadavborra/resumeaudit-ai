import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import GlowCard from "../ui/GlowCard";

export default function ScoreChart({ data }) {
  return (
    <GlowCard className="p-6">
      <h3 className="font-semibold text-white mb-4">Score Trend</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
          <YAxis domain={[0, 100]} stroke="#6b7280" fontSize={12} />
          <Tooltip contentStyle={{ background: "#1d1c20", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} labelStyle={{ color: "#9ca3af" }} />
          <Line type="monotone" dataKey="score" stroke="#ff5a1f" strokeWidth={2.5} dot={{ fill: "#ffb300", r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </GlowCard>
  );
}