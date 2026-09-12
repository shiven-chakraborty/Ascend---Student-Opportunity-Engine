import React from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  TrendingUp,
  Bookmark,
  Target,
  ArrowRight,
  Calendar,
  AlertCircle,
  BadgeCheck,
} from "lucide-react";
import { opportunities, upcomingDeadlines, feedStats } from "@/lib/mockData";
import { useAuth } from "@/lib/AuthContext";
import OpportunityCard from "@/components/OpportunityCard";
import TypeBadge from "@/components/TypeBadge";

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.full_name?.split(" ")[0] || "Student";
  const topMatches = [...opportunities].sort((a, b) => b.fitScore - a.fitScore).slice(0, 4);

  const stats = [
    { label: "Total Matches", value: feedStats.totalMatches, icon: Target, color: "text-primary", bg: "bg-primary/10" },
    { label: "New This Week", value: feedStats.newThisWeek, icon: Sparkles, color: "text-accent", bg: "bg-accent/10" },
    { label: "Avg Fit Score", value: `${feedStats.avgFitScore}%`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Saved", value: feedStats.saved, icon: Bookmark, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-3xl bg-brand-gradient p-6 sm:p-8 text-white shadow-card">
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10" />
        <div className="absolute -right-20 top-20 w-64 h-64 rounded-full bg-white/5" />
        <div className="relative">
          <div className="flex items-center gap-2 text-white/80 text-sm font-medium mb-2">
            <Sparkles className="w-4 h-4" />
            AI-matched for you
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-white/85 mt-2 max-w-lg text-sm sm:text-base">
            Gemini analyzed your profile and found <strong className="text-white">{feedStats.newThisWeek} new opportunities</strong> that match your skills, interests, and goals.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-5">
            <Link
              to="/opportunities"
              className="inline-flex items-center gap-2 bg-white text-primary font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-white/90 transition-colors shadow-soft"
            >
              Explore my feed <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              View my profile
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-card border border-border rounded-2xl p-5 shadow-soft">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${s.color}`} strokeWidth={2.2} />
              </div>
              <p className="font-heading text-2xl font-extrabold">{s.value}</p>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Deadline alerts strip */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-amber-600" />
            </div>
            <h2 className="font-heading font-bold text-base">Deadline Alerts</h2>
          </div>
          <Link to="/deadlines" className="text-xs font-semibold text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="space-y-2">
          {upcomingDeadlines.map((d) => (
            <Link
              key={d.id}
              to={`/opportunities/${d.id}`}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/60 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex flex-col items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{d.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <TypeBadge type={d.type} />
                  <span className="text-xs text-muted-foreground">{new Date(d.deadline).toLocaleDateString("en-US", { day: "numeric", month: "short" })}</span>
                </div>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg shrink-0 ${d.daysLeft <= 10 ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-700"}`}>
                {d.daysLeft}d left
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Top matches */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-heading font-bold text-xl">Your top matches</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Ranked by AI fit score based on your profile
            </p>
          </div>
          <Link
            to="/opportunities"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-1.5 transition-all"
          >
            See all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {topMatches.map((opp, i) => (
            <OpportunityCard key={opp.id} opportunity={opp} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}