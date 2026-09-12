import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Clock, Bookmark, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import FitScoreRing from "./FitScoreRing";
import TypeBadge from "./TypeBadge";

function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date("2026-09-07");
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function OpportunityCard({ opportunity, index = 0 }) {
  const daysLeft = daysUntil(opportunity.deadline);
  const urgent = daysLeft <= 10;

  return (
    <Link
      to={`/opportunities/${opportunity.id}`}
      className="group block animate-fade-in"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="relative bg-card border border-border rounded-2xl p-5 shadow-soft hover:shadow-lift hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5">
        <div className="flex items-start gap-4">
          {/* Logo */}
          <div className="w-12 h-12 shrink-0 rounded-xl bg-muted/60 flex items-center justify-center overflow-hidden border border-border">
            {opportunity.logo ? (
              <img src={opportunity.logo} alt={opportunity.organization} className="w-full h-full object-contain p-2" />
            ) : (
              <span className="text-2xl">{opportunity.emoji || "✨"}</span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <TypeBadge type={opportunity.type} />
              <span className="text-[11px] text-muted-foreground">{opportunity.postedDate}</span>
            </div>
            <h3 className="font-heading font-bold text-[15px] leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {opportunity.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">{opportunity.organization}</p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {opportunity.location}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {opportunity.duration}
              </span>
            </div>

            {/* Matched skills */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {opportunity.matchedSkills.slice(0, 3).map((s) => (
                <span
                  key={s}
                  className="text-[11px] font-medium bg-primary/8 text-primary rounded-md px-2 py-0.5"
                  style={{ backgroundColor: "hsl(246 74% 57% / 0.08)" }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Fit score */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <FitScoreRing score={opportunity.fitScore} size={56} />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Fit</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Calendar className={cn("w-4 h-4", urgent ? "text-rose-500" : "text-muted-foreground")} />
            <span className={cn("text-xs font-semibold", urgent ? "text-rose-500" : "text-muted-foreground")}>
              {daysLeft} days left
            </span>
            <span className="text-xs text-muted-foreground">· {opportunity.stipend}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => e.preventDefault()}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-1.5 transition-all">
              View match <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}