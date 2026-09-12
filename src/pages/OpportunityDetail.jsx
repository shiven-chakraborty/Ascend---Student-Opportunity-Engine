import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Calendar,
  Building2,
  Sparkles,
  CheckCircle2,
  Bookmark,
  Share2,
  ExternalLink,
  BadgeCheck,
  Target,
} from "lucide-react";
import { opportunities, currentUser } from "@/lib/mockData";
import FitScoreRing from "@/components/FitScoreRing";
import TypeBadge from "@/components/TypeBadge";

export default function OpportunityDetail() {
  const { id } = useParams();
  const [saved, setSaved] = useState(false);
  const opp = opportunities.find((o) => o.id === id);

  if (!opp) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-muted-foreground">Opportunity not found.</p>
        <Link to="/opportunities" className="mt-4 text-primary font-semibold hover:underline">
          ← Back to opportunities
        </Link>
      </div>
    );
  }

  const daysLeft = Math.ceil((new Date(opp.deadline) - new Date("2026-09-07")) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link to="/opportunities" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to feed
      </Link>

      {/* Hero */}
      <div className="bg-card border border-border rounded-3xl shadow-card overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <TypeBadge type={opp.type} />
                <span className="text-xs text-muted-foreground">{opp.postedDate}</span>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-muted/60 flex items-center justify-center overflow-hidden border border-border">
                  {opp.logo ? (
                    <img src={opp.logo} alt={opp.organization} className="w-full h-full object-contain p-3" />
                  ) : (
                    <span className="text-3xl">{opp.emoji || "✨"}</span>
                  )}
                </div>
                <div>
                  <h1 className="font-heading text-xl sm:text-2xl font-extrabold tracking-tight leading-tight">{opp.title}</h1>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                    <Building2 className="w-4 h-4" /> {opp.organization}
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 mt-6">
                <InfoRow icon={MapPin} label="Location" value={opp.location} />
                <InfoRow icon={Clock} label="Duration" value={opp.duration} />
                <InfoRow icon={Calendar} label="Deadline" value={new Date(opp.deadline).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })} />
                <InfoRow icon={Target} label="Stipend / Prize" value={opp.stipend} />
              </div>

              <p className="text-sm leading-relaxed text-foreground/90 mt-6">{opp.summary}</p>

              {/* Eligibility */}
              <div className="mt-6">
                <h3 className="font-heading font-bold text-sm mb-3">Eligibility</h3>
                <ul className="space-y-2">
                  {opp.eligibility.map((e) => (
                    <li key={e} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-6">
                {opp.tags.map((t) => (
                  <span key={t} className="text-xs font-medium bg-muted text-muted-foreground rounded-lg px-2.5 py-1">#{t}</span>
                ))}
              </div>
            </div>

            {/* Right: AI match panel */}
            <div className="lg:w-[300px] shrink-0">
              <div className="relative overflow-hidden rounded-2xl bg-brand-gradient p-5 text-white shadow-card">
                <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
                <div className="relative">
                  <div className="flex items-center gap-2 text-white/85 text-xs font-semibold uppercase tracking-wide">
                    <Sparkles className="w-4 h-4" /> AI Match Analysis
                  </div>
                  <div className="flex items-center justify-center my-4">
                    <FitScoreRing score={opp.fitScore} size={96} stroke={7} />
                  </div>
                  <p className="text-center text-sm font-semibold">
                    {opp.fitScore >= 85 ? "Excellent fit" : opp.fitScore >= 70 ? "Strong fit" : "Fair fit"} for your profile
                  </p>
                  <p className="text-center text-xs text-white/75 mt-1">Analyzed by Google Gemini</p>
                </div>
              </div>

              {/* Match reasons */}
              <div className="bg-card border border-border rounded-2xl p-5 mt-4 shadow-soft">
                <h3 className="font-heading font-bold text-sm mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-primary" /> Why this matches you
                </h3>
                <ul className="space-y-3">
                  {opp.matchReasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-muted-foreground leading-relaxed">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Matched skills */}
              <div className="bg-card border border-border rounded-2xl p-5 mt-4 shadow-soft">
                <h3 className="font-heading font-bold text-sm mb-3">Matched skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {opp.matchedSkills.map((s) => (
                    <span key={s} className="text-xs font-semibold bg-primary/10 text-primary rounded-lg px-2.5 py-1">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="border-t border-border px-6 sm:px-8 py-4 flex flex-col sm:flex-row items-center gap-3 bg-muted/30">
          <div className="flex items-center gap-2 text-sm text-muted-foreground sm:mr-auto">
            <Calendar className="w-4 h-4" />
            <span className={daysLeft <= 10 ? "text-rose-500 font-semibold" : ""}>{daysLeft} days left to apply</span>
          </div>
          <button
            onClick={() => setSaved(!saved)}
            className={`inline-flex items-center gap-2 text-sm font-semibold border rounded-xl px-4 py-2.5 transition-colors ${
              saved ? "bg-primary/10 text-primary border-primary/30" : "bg-card text-foreground border-border hover:bg-muted"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? "fill-primary" : ""}`} /> {saved ? "Saved" : "Save"}
          </button>
          <button className="inline-flex items-center gap-2 text-sm font-semibold border border-border bg-card text-foreground rounded-xl px-4 py-2.5 hover:bg-muted transition-colors">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button className="inline-flex items-center gap-2 text-sm font-semibold bg-brand-gradient text-white rounded-xl px-5 py-2.5 hover:opacity-90 transition-opacity shadow-soft">
            Apply now <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Profile context note */}
      <div className="flex items-center gap-3 bg-card border border-border rounded-2xl p-4 shadow-soft text-sm">
        <img src={currentUser.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
        <p className="text-muted-foreground">
          Matched against <span className="font-semibold text-foreground">{currentUser.name}'s</span> profile.
          <Link to="/profile" className="text-primary font-semibold hover:underline ml-1">Update your profile →</Link>
        </p>
        {currentUser.verified && (
          <span className="ml-auto hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-primary">
            <BadgeCheck className="w-4 h-4" /> Verified
          </span>
        )}
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 bg-muted/40 rounded-xl px-3.5 py-3">
      <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold truncate">{value}</p>
      </div>
    </div>
  );
}