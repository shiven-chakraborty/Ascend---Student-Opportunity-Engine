import React from "react";
import {
  Code2,
  Award,
  Rocket,
  Briefcase,
  Trophy,
  Flag,
  MapPin,
  Check,
  Lock,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = { Code2, Award, Rocket, Briefcase, Trophy };

const statusConfig = {
  done: {
    node: "bg-emerald-500 text-white border-emerald-500",
    ring: "ring-emerald-500/30",
    label: "Completed",
    labelCls: "text-emerald-600 bg-emerald-50",
    icon: Check,
  },
  active: {
    node: "bg-primary text-white border-primary",
    ring: "ring-primary/30",
    label: "In progress",
    labelCls: "text-primary bg-primary/10",
    icon: Loader2,
  },
  upcoming: {
    node: "bg-card text-muted-foreground border-border",
    ring: "ring-transparent",
    label: "Upcoming",
    labelCls: "text-muted-foreground bg-muted",
    icon: MapPin,
  },
  locked: {
    node: "bg-muted text-muted-foreground/60 border-border",
    ring: "ring-transparent",
    label: "Locked",
    labelCls: "text-muted-foreground/70 bg-muted",
    icon: Lock,
  },
};

export default function RoadmapMap({ roadmap }) {
  const { pitstops, progress } = roadmap;
  const total = pitstops.length;
  const doneCount = pitstops.filter((p) => p.status === "done").length;
  // road fill height: progress% of the road
  const fillHeight = `${progress}%`;

  return (
    <div className="relative">
      {/* Subtle map backdrop */}
      <div
        className="absolute inset-0 rounded-3xl opacity-[0.5] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(hsl(var(--muted-foreground) / 0.18) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative">
        {/* Start flag */}
        <div className="flex items-center justify-center mb-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground bg-card border border-border rounded-full px-3 py-1.5 shadow-soft">
            <Flag className="w-3.5 h-3.5 text-emerald-500" />
            Your journey starts here
          </div>
        </div>

        {/* Road + pitstops */}
        <div className="relative">
          {/* The road (vertical line) */}
          <div
            className="absolute top-0 bottom-0 w-1 left-1/2 -translate-x-1/2 lg:left-1/2 rounded-full bg-muted"
            aria-hidden
          />
          {/* Completed fill on the road */}
          <div
            className="absolute top-0 w-1 left-1/2 -translate-x-1/2 lg:left-1/2 rounded-full bg-brand-gradient transition-all duration-700"
            style={{ height: fillHeight }}
            aria-hidden
          />

          <div className="space-y-7 sm:space-y-9 py-4">
            {pitstops.map((stop, i) => {
              const cfg = statusConfig[stop.status];
              const Icon = iconMap[stop.icon] || MapPin;
              const StatusIcon = cfg.icon;
              const side = i % 2 === 0 ? "left" : "right"; // desktop alternation

              return (
                <div
                  key={stop.id}
                  className="relative flex items-center animate-fade-in"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {/* Card — left side (desktop) */}
                  <div className={cn("hidden lg:block w-[42%]", side === "left" ? "pr-10 text-right" : "order-3 pl-10")}>
                    <PitstopCard stop={stop} cfg={cfg} align={side === "left" ? "right" : "left"} />
                  </div>

                  {/* Node on the road */}
                  <div className="relative z-10 flex-1 flex justify-center lg:order-2">
                    <div className="relative">
                      {stop.status === "active" && (
                        <span className="absolute inset-0 rounded-full ring-4 ring-primary/20 animate-ping" />
                      )}
                      <div
                        className={cn(
                          "relative w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 flex items-center justify-center shadow-soft ring-4",
                          cfg.node,
                          cfg.ring
                        )}
                      >
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.2} />
                      </div>
                      {/* pitstop number bubble */}
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-card border border-border text-[10px] font-bold text-muted-foreground flex items-center justify-center shadow-soft">
                        {i + 1}
                      </span>
                    </div>
                  </div>

                  {/* Spacer for the empty desktop side */}
                  <div className="hidden lg:block w-[42%]" />

                  {/* Card — mobile/tablet (below node, full width) */}
                  <div className="lg:hidden absolute left-[calc(50%+28px)] sm:left-[calc(50%+32px)] right-0 max-w-[78%]">
                    <PitstopCard stop={stop} cfg={cfg} align="left" compact />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Destination goal flag */}
        <div className="relative flex justify-center mt-2">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-6 bg-brand-gradient rounded-full" aria-hidden />
          <div className="mt-6 w-full max-w-md">
            <div className="relative overflow-hidden rounded-2xl bg-brand-gradient p-5 text-white shadow-card text-center">
              <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-2.5">
                  <Trophy className="w-6 h-6" strokeWidth={2.3} />
                </div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/80">
                  🎯 Destination Goal
                </p>
                <h3 className="font-heading font-extrabold text-lg mt-1">{roadmap.goal.title}</h3>
                <p className="text-sm text-white/85 mt-1">{roadmap.goal.description}</p>
                <p className="text-xs text-white/70 mt-2.5 font-medium">Target · {roadmap.goal.target}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PitstopCard({ stop, cfg, align = "left", compact = false }) {
  const StatusIcon = cfg.icon;
  const doneTasks = stop.tasks.filter((t) => t.done).length;

  return (
    <div
      className={cn(
        "inline-block bg-card border border-border rounded-2xl p-4 shadow-soft hover:shadow-card transition-shadow w-full",
        stop.status === "active" && "border-primary/40 ring-2 ring-primary/10"
      )}
    >
      <div className={cn("flex items-center gap-2 mb-1.5", align === "right" && "lg:justify-end")}>
        <span className={cn("inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full", cfg.labelCls)}>
          <StatusIcon className={cn("w-3 h-3", stop.status === "active" && "animate-spin")} />
          {cfg.label}
        </span>
      </div>
      <h4 className="font-heading font-bold text-[15px] leading-snug">{stop.title}</h4>
      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{stop.description}</p>

      {/* Tasks */}
      <ul className={cn("mt-3 space-y-1.5", align === "right" && "lg:text-left")}>
        {stop.tasks.map((t, idx) => (
          <li key={idx} className="flex items-start gap-2 text-xs">
            <span
              className={cn(
                "mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0",
                t.done ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground border border-border"
              )}
            >
              {t.done ? <Check className="w-2.5 h-2.5" strokeWidth={3} /> : <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />}
            </span>
            <span className={cn(t.done ? "text-muted-foreground line-through" : "text-foreground/80")}>{t.label}</span>
          </li>
        ))}
      </ul>

      <div className={cn("flex items-center gap-2 mt-3 pt-3 border-t border-border", align === "right" && "lg:justify-end")}>
        <span className="text-[11px] font-semibold text-muted-foreground">{stop.date}</span>
        <span className="text-[11px] text-muted-foreground/70">·</span>
        <span className="text-[11px] font-semibold text-foreground/70">{doneTasks}/{stop.tasks.length} tasks</span>
      </div>
    </div>
  );
}