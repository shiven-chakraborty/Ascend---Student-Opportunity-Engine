import React from "react";
import { Plus, Pencil, Trash2, Sparkles } from "lucide-react";

export default function SkillsTab({ items, loading, saving, onAdd, onEdit, onDelete, onSeed }) {
  if (loading) {
    return <div className="text-sm text-muted-foreground py-10 text-center">Loading skills…</div>;
  }
  return (
    <div className="grid sm:grid-cols-2 gap-4 animate-fade-in-fast">
      {items.map((s) => (
        <div key={s.id} className="bg-card border border-border rounded-2xl p-4 shadow-soft group">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">{s.name}</span>
              <span className="text-[10px] font-semibold bg-muted text-muted-foreground px-1.5 py-0.5 rounded">{s.category}</span>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onEdit(s)} className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5"><Pencil className="w-3.5 h-3.5" /></button>
              <button onClick={() => onDelete(s.id)} disabled={saving} className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-50"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-brand-gradient rounded-full" style={{ width: `${s.level}%` }} />
            </div>
            <span className="text-sm font-bold text-primary">{s.level}%</span>
          </div>
        </div>
      ))}

      {items.length === 0 && (
        <button onClick={onSeed} className="flex items-center justify-center gap-2 border border-dashed border-border rounded-2xl p-4 text-sm font-semibold text-muted-foreground hover:border-primary hover:text-primary transition-colors">
          <Sparkles className="w-4 h-4" /> Load sample skills
        </button>
      )}

      <button onClick={onAdd} className="flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-2xl p-4 text-sm font-semibold text-muted-foreground hover:border-primary hover:text-primary transition-colors">
        <Plus className="w-4 h-4" /> Add a skill
      </button>
    </div>
  );
}