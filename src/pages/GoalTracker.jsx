import React from "react";
import { Target, TrendingUp, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { goalRoadmap } from "@/lib/mockData";
import RoadmapMap from "@/components/RoadmapMap";

export default function GoalTracker() {
  const { pitstops, progress } = goalRoadmap;
  const doneCount = pitstops.filter((p) => p.status === "done").length;
  const activeStop = pitstops.find((p) => p.status === "active");

  const stats = [
    { label: "Pitstops completed", value: `${doneCount}/${pitstops.length}`, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Overall progress", value: `${progress}%`, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
    { label: "Current step", value: activeStop ? `#${pitstops.indexOf(activeStop) + 1}` : "—", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1.5">
            <Target className="w-4 h-4" />
            Goal Tracker
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight">
            Your roadmap to the goal
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-xl">
            Every pitstop on the journey from where you are today to where you want to be. Track each step, complete tasks, and reach your destination.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-card border border-border rounded-2xl px-4 py-3 shadow-soft">
          <Sparkles className="w-5 h-5 text-primary" />
          <div>
            <p className="text-[11px] text-muted-foreground font-medium leading-none">AI-planned route</p>
            <p className="text-sm font-bold mt-1 leading-none">5 pitstops · 1 goal</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-card border border-border rounded-2xl p-4 shadow-soft">
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-2.5`}>
                <Icon className={`w-4 h-4 ${s.color}`} strokeWidth={2.2} />
              </div>
              <p className="font-heading text-xl sm:text-2xl font-extrabold leading-none">{s.value}</p>
              <p className="text-[11px] sm:text-xs text-muted-foreground font-medium mt-1.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-soft">
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-sm font-semibold">Journey progress</p>
          <p className="text-sm font-bold text-primary">{progress}%</p>
        </div>
        <div className="h-2.5 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-brand-gradient rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs text-muted-foreground mt-2.5">
          {activeStop
            ? `Next up: complete "${activeStop.title}" to unlock the next pitstop.`
            : "Keep going — you're on track!"}
        </p>
      </div>

      {/* The map */}
      <div className="bg-card border border-border rounded-3xl p-5 sm:p-8 shadow-soft">
        <RoadmapMap roadmap={goalRoadmap} />
      </div>
    </div>
  );
}