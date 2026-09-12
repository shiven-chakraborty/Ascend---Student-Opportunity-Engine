import React from "react";
import { cn } from "@/lib/utils";

const colorByScore = (score) => {
  if (score >= 85) return { stroke: "hsl(152 60% 45%)", text: "text-emerald-600", bg: "bg-emerald-50", label: "Excellent" };
  if (score >= 70) return { stroke: "hsl(246 74% 57%)", text: "text-primary", bg: "bg-primary/10", label: "Strong" };
  if (score >= 55) return { stroke: "hsl(38 92% 50%)", text: "text-amber-600", bg: "bg-amber-50", label: "Fair" };
  return { stroke: "hsl(0 84% 60%)", text: "text-rose-500", bg: "bg-rose-50", label: "Low" };
};

export default function FitScoreRing({ score, size = 56, stroke = 5, showLabel = false }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const colors = colorByScore(score);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-heading font-extrabold leading-none", colors.text)} style={{ fontSize: size * 0.28 }}>
          {score}
        </span>
        {showLabel && (
          <span className="text-[8px] uppercase tracking-wide text-muted-foreground font-semibold mt-0.5">Fit</span>
        )}
      </div>
    </div>
  );
}