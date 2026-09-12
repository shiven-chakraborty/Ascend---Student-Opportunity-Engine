import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop";

export default function ProjectDialog({ open, onOpenChange, onSubmit, initial, saving }) {
  const [form, setForm] = useState({ title: "", description: "", tags: "", link: "", github: "", role: "", image: "" });

  useEffect(() => {
    if (open) {
      setForm({
        title: initial?.title || "",
        description: initial?.description || "",
        tags: (initial?.tags || []).join(", "),
        link: initial?.link || "",
        github: initial?.github || "",
        role: initial?.role || "",
        image: initial?.image || "",
      });
    }
  }, [open, initial]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      link: form.link.trim(),
      github: form.github.trim(),
      role: form.role.trim(),
      image: form.image.trim() || PLACEHOLDER_IMG,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit project" : "Add a project"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div>
            <Label>Project name</Label>
            <Input value={form.title} onChange={set("title")} placeholder="e.g. EduMate — AI Study Companion" className="mt-1.5" autoFocus />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={form.description} onChange={set("description")} rows={3} placeholder="What does it do? What problem does it solve?" className="mt-1.5" />
          </div>
          <div>
            <Label>Technologies / skills used</Label>
            <Input value={form.tags} onChange={set("tags")} placeholder="React, FastAPI, AI (comma separated)" className="mt-1.5" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Project link</Label>
              <Input value={form.link} onChange={set("link")} placeholder="https://…" className="mt-1.5" />
            </div>
            <div>
              <Label>GitHub link</Label>
              <Input value={form.github} onChange={set("github")} placeholder="https://github.com/…" className="mt-1.5" />
            </div>
          </div>
          <div>
            <Label>Your role / contribution</Label>
            <Input value={form.role} onChange={set("role")} placeholder="e.g. Lead developer" className="mt-1.5" />
          </div>
          <div>
            <Label>Cover image URL (optional)</Label>
            <Input value={form.image} onChange={set("image")} placeholder="https://…" className="mt-1.5" />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={saving || !form.title.trim()}>{saving ? "Saving…" : "Save project"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}