import React from "react";
import { cn } from "@/lib/utils";

const typeStyles = {
  Internship: "bg-indigo-50 text-indigo-700 border-indigo-100",
  Hackathon: "bg-amber-50 text-amber-700 border-amber-100",
  Scholarship: "bg-rose-50 text-rose-700 border-rose-100",
  Competition: "bg-violet-50 text-violet-700 border-violet-100",
  Project: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

export default function TypeBadge({ type, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border",
        typeStyles[type] || "bg-muted text-muted-foreground border-border",
        className
      )}
    >
      {type}
    </span>
  );
}