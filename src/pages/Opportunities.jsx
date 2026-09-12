import React, { useState, useEffect, useMemo } from "react";
import { Sparkles, Search, X, SlidersHorizontal, Building2, MapPin, Gauge } from "lucide-react";
import { base44 } from "@/api/base44Client";
import EntityOpportunityCard from "@/components/EntityOpportunityCard";

const scoreBands = [
  { label: "All scores", min: 0 },
  { label: "8+ Excellent", min: 8 },
  { label: "6+ Strong", min: 6 },
  { label: "4+ Fair", min: 4 },
];

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("All");
  const [company, setCompany] = useState("All");
  const [scoreBand, setScoreBand] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const list = await base44.entities.Opportunity.list("-match_score", 200);
        setOpportunities(list || []);
      } catch (e) {
        setOpportunities([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const locations = useMemo(() => {
    const set = new Set(opportunities.map((o) => o.location).filter(Boolean));
    return ["All", ...Array.from(set).sort()];
  }, [opportunities]);

  const companies = useMemo(() => {
    const set = new Set(opportunities.map((o) => o.company).filter(Boolean));
    return ["All", ...Array.from(set).sort()];
  }, [opportunities]);

  const filtered = useMemo(() => {
    const minScore = scoreBands[scoreBand].min;
    return opportunities
      .filter((o) => {
        if (location !== "All" && o.location !== location) return false;
        if (company !== "All" && o.company !== company) return false;
        if ((o.match_score ?? 0) < minScore) return false;
        if (query) {
          const q = query.toLowerCase();
          if (!o.title?.toLowerCase().includes(q) && !o.company?.toLowerCase().includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => (b.match_score ?? 0) - (a.match_score ?? 0));
  }, [opportunities, location, company, scoreBand, query]);

  const hasFilters = query || location !== "All" || company !== "All" || scoreBand !== 0;

  const clearFilters = () => {
    setQuery("");
    setLocation("All");
    setCompany("All");
    setScoreBand(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-extrabold tracking-tight">Opportunity Feed</h1>
        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-primary" />
          AI-ranked opportunities tailored to your profile
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or company…"
          className="w-full h-11 pl-10 pr-9 rounded-xl bg-card border border-border focus:border-primary focus:outline-none text-sm placeholder:text-muted-foreground transition-colors shadow-soft"
        />
        {query && (
          <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Location */}
        <div className="flex items-center gap-2 flex-1">
          <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full h-11 rounded-xl bg-card border border-border px-3 text-sm font-medium focus:border-primary focus:outline-none shadow-soft cursor-pointer"
          >
            {locations.map((l) => (
              <option key={l} value={l}>{l === "All" ? "All locations" : l}</option>
            ))}
          </select>
        </div>
        {/* Company */}
        <div className="flex items-center gap-2 flex-1">
          <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
          <select
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full h-11 rounded-xl bg-card border border-border px-3 text-sm font-medium focus:border-primary focus:outline-none shadow-soft cursor-pointer"
          >
            {companies.map((c) => (
              <option key={c} value={c}>{c === "All" ? "All companies" : c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Match score chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
        {scoreBands.map((band, i) => (
          <button
            key={band.label}
            onClick={() => setScoreBand(i)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              scoreBand === i
                ? "bg-brand-gradient text-white shadow-soft"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {band.label}
          </button>
        ))}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-2 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1 shrink-0"
          >
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{filtered.length}</span> opportunities
        {filtered.length > 0 && <span> · sorted by match score</span>}
      </p>

      {/* Grid */}
      {loading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5 h-64 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Search className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="font-semibold">No opportunities found</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search.</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((opp, i) => (
            <EntityOpportunityCard key={opp.id} opportunity={opp} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}