import React from "react";
import { Award, Trophy, Medal, Pencil, Trash2, ExternalLink, Sparkles, Plus } from "lucide-react";

export default function AchievementsTab({ items, loading, saving, onAdd, onEdit, onDelete, onSeed }) {
  if (loading) return <div className="text-sm text-muted-foreground py-10 text-center">Loading…</div>;
  const certs = items.filter((a) => a.type === "Certification");
  const wins = items.filter((a) => a.type === "Achievement");

  const Card = ({ a, color }) => (
    <div className="group flex items-start gap-3 bg-card border border-border rounded-2xl p-4 shadow-soft">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        {a.logo && a.logo.length <= 2 ? <span className="text-2xl">{a.logo}</span> : <Award className="w-5 h-5 text-amber-600" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{a.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{a.description || (a.issuer ? `${a.issuer}` : "")}</p>
        <div className="flex items-center gap-2 mt-1">
          {a.issuer && <span className="text-[11px] font-semibold text-muted-foreground">{a.issuer}</span>}
          {a.date && <span className="text-[11px] font-semibold text-muted-foreground">· {a.date}</span>}
          {a.proofLink && <a href={a.proofLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-primary hover:underline"><ExternalLink className="w-3 h-3" /> Proof</a>}
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(a)} className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5"><Pencil className="w-3.5 h-3.5" /></button>
        <button onClick={() => onDelete(a.id)} disabled={saving} className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-50"><Trash2 className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  );

  return (
    <div className="grid lg:grid-cols-2 gap-5 animate-fade-in-fast">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><Medal className="w-4 h-4 text-primary" /><h2 className="font-heading font-bold text-base">Certifications</h2></div>
          <button onClick={() => onAdd("Certification")} className="text-xs font-semibold text-primary inline-flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Add</button>
        </div>
        {certs.length ? certs.map((a) => <Card key={a.id} a={a} color="bg-muted" />) : (
          <button onClick={onSeed} className="w-full flex items-center justify-center gap-2 border border-dashed border-border rounded-2xl p-4 text-sm font-semibold text-muted-foreground hover:border-primary hover:text-primary transition-colors"><Sparkles className="w-4 h-4" /> Load sample certifications</button>
        )}
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><Trophy className="w-4 h-4 text-primary" /><h2 className="font-heading font-bold text-base">Achievements</h2></div>
          <button onClick={() => onAdd("Achievement")} className="text-xs font-semibold text-primary inline-flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Add</button>
        </div>
        {wins.length ? wins.map((a) => <Card key={a.id} a={a} color="bg-amber-50" />) : (
          <button onClick={onSeed} className="w-full flex items-center justify-center gap-2 border border-dashed border-border rounded-2xl p-4 text-sm font-semibold text-muted-foreground hover:border-primary hover:text-primary transition-colors"><Sparkles className="w-4 h-4" /> Load sample achievements</button>
        )}
      </div>
    </div>
  );
}