import React from "react";
import { Plus, Pencil, Trash2, ExternalLink, Github, FolderGit2, Sparkles } from "lucide-react";
import { Image } from "@/components/ui/image";

const FALLBACK = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop";

export default function ProjectsTab({ items, loading, saving, onAdd, onEdit, onDelete, onSeed }) {
  if (loading) return <div className="text-sm text-muted-foreground py-10 text-center">Loading projects…</div>;
  return (
    <div className="grid sm:grid-cols-2 gap-5 animate-fade-in-fast">
      {items.map((p) => (
        <div key={p.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft hover:shadow-lift transition-shadow group">
          <div className="aspect-[16/10] overflow-hidden bg-muted">
            <Image src={p.image || FALLBACK} alt={p.title} fittingType="fill" className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between">
              <FolderGit2 className="w-4 h-4 text-primary" />
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {p.github && <a href={p.github} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg text-muted-foreground hover:text-primary"><Github className="w-4 h-4" /></a>}
                {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg text-muted-foreground hover:text-primary"><ExternalLink className="w-4 h-4" /></a>}
                <button onClick={() => onEdit(p)} className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => onDelete(p.id)} disabled={saving} className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-50"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <h3 className="font-heading font-bold text-base mt-2">{p.title}</h3>
            {p.role && <p className="text-[11px] font-semibold text-primary mt-0.5">{p.role}</p>}
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed line-clamp-3">{p.description}</p>
            {p.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {p.tags.map((t) => <span key={t} className="text-[11px] font-medium bg-muted text-muted-foreground rounded-md px-2 py-0.5">{t}</span>)}
              </div>
            )}
          </div>
        </div>
      ))}

      {items.length === 0 && (
        <button onClick={onSeed} className="flex items-center justify-center gap-2 border border-dashed border-border rounded-2xl min-h-[200px] text-sm font-semibold text-muted-foreground hover:border-primary hover:text-primary transition-colors">
          <Sparkles className="w-5 h-5" /> Load sample projects
        </button>
      )}

      <button onClick={onAdd} className="flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-2xl min-h-[200px] text-sm font-semibold text-muted-foreground hover:border-primary hover:text-primary transition-colors">
        <Plus className="w-5 h-5" /> Add a project
      </button>
    </div>
  );
}