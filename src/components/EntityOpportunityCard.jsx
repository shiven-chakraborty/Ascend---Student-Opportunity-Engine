import React from "react";
import { MapPin, Building2, Sparkles, ExternalLink, CheckCircle2, AlertCircle } from "lucide-react";

function scoreColor(score) {
  if (score >= 8) return { ring: "text-emerald-500", bg: "bg-emerald-50", stroke: "stroke-emerald-500", label: "Excellent" };
  if (score >= 6) return { ring: "text-primary", bg: "bg-primary/10", stroke: "stroke-primary", label: "Strong" };
  if (score >= 4) return { ring: "text-amber-500", bg: "bg-amber-50", stroke: "stroke-amber-500", label: "Fair" };
  return { ring: "text-muted-foreground", bg: "bg-muted", stroke: "stroke-muted-foreground", label: "Low" };
}

export default function EntityOpportunityCard({ opportunity, index = 0 }) {
  const score = opportunity.match_score ?? 0;
  const pct = Math.min(100, (score / 10) * 100);
  const c = scoreColor(score);
  const radius = 26;
  const circ = 2 * Math.PI * radius;

  return (
    <div
      className="relative bg-card border border-border rounded-2xl p-5 shadow-soft hover:shadow-lift hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5 flex flex-col animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-bold text-base leading-snug text-foreground line-clamp-2">
            {opportunity.title}
          </h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1 font-medium">
              <Building2 className="w-3.5 h-3.5" /> {opportunity.company || "—"}
            </span>
            {opportunity.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {opportunity.location}
              </span>
            )}
            {opportunity.salary > 0 && (
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                ₹{Number(opportunity.salary).toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>

        {/* Prominent match score ring */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="relative w-16 h-16">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r={radius} className="stroke-muted" strokeWidth="5" fill="none" />
              <circle
                cx="32" cy="32" r={radius}
                className={c.stroke}
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={circ - (pct / 100) * circ}
                style={{ transition: "stroke-dashoffset 0.6s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`font-heading font-extrabold text-lg leading-none ${c.ring}`}>{score}</span>
              <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide">/ 10</span>
            </div>
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-wide ${c.ring}`}>{c.label}</span>
        </div>
      </div>

      {/* Description */}
      {opportunity.description && (
        <p className="text-sm text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
          {opportunity.description}
        </p>
      )}

      {/* AI Reason */}
      {opportunity.reason && (
        <div className={`mt-3 rounded-xl ${c.bg} border border-border/60 p-3 flex items-start gap-2`}>
          <Sparkles className={`w-4 h-4 shrink-0 mt-0.5 ${c.ring}`} />
          <p className="text-xs leading-relaxed text-foreground/80">
            <span className="font-semibold">AI Insight: </span>
            {opportunity.reason}
          </p>
        </div>
      )}

      {/* Skills */}
      {(opportunity.matched_skills?.length > 0 || opportunity.missing_skills?.length > 0) && (
        <div className="mt-3 space-y-2">
          {opportunity.matched_skills?.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              {opportunity.matched_skills.map((s) => (
                <span key={s} className="text-[11px] font-medium bg-emerald-50 text-emerald-700 rounded-md px-2 py-0.5">
                  {s}
                </span>
              ))}
            </div>
          )}
          {opportunity.missing_skills?.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              {opportunity.missing_skills.map((s) => (
                <span key={s} className="text-[11px] font-medium bg-amber-50 text-amber-700 rounded-md px-2 py-0.5">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Apply button */}
      <div className="mt-4 pt-4 border-t border-border">
        <a
          href={opportunity.url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-brand-gradient text-white text-sm font-semibold shadow-soft hover:opacity-90 transition-opacity"
        >
          Apply Now <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}