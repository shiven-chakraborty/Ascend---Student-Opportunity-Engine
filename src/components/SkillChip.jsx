import React from "react";
import { cn } from "@/lib/utils";

const categoryColors = {
  Technical: "bg-primary/10 text-primary",
  Design: "bg-accent/10 text-accent",
  Soft: "bg-emerald-100 text-emerald-700",
};

export default function SkillChip({ name, category, level, showLevel = false }) {
  return (
    <div className="inline-flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-1.5 shadow-soft">
      <span className="text-sm font-medium">{name}</span>
      {category && (
        <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded", categoryColors[category] || "bg-muted text-muted-foreground")}>
          {category}
        </span>
      )}
      {showLevel && level != null && (
        <span className="text-[11px] text-muted-foreground font-semibold">{level}%</span>
      )}
    </div>
  );
}