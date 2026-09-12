import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AchievementDialog({ open, onOpenChange, onSubmit, initial, saving }) {
  const [form, setForm] = useState({ title: "", description: "", issuer: "", date: "", type: "Achievement", proofLink: "", logo: "" });

  useEffect(() => {
    if (open) {
      setForm({
        title: initial?.title || "",
        description: initial?.description || "",
        issuer: initial?.issuer || "",
        date: initial?.date || "",
        type: initial?.type || "Achievement",
        proofLink: initial?.proofLink || "",
        logo: initial?.logo || "",
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
      issuer: form.issuer.trim(),
      date: form.date.trim(),
      type: form.type,
      proofLink: form.proofLink.trim(),
      logo: form.logo.trim() || (form.type === "Certification" ? "🎓" : "🏆"),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit entry" : "Add achievement"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Achievement">Achievement</SelectItem>
                  <SelectItem value="Certification">Certification</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date / year</Label>
              <Input value={form.date} onChange={set("date")} placeholder="e.g. 2025" className="mt-1.5" />
            </div>
          </div>
          <div>
            <Label>{form.type === "Certification" ? "Certification name" : "Achievement title"}</Label>
            <Input value={form.title} onChange={set("title")} placeholder="e.g. Smart India Hackathon — Winner" className="mt-1.5" autoFocus />
          </div>
          <div>
            <Label>Issuing organization</Label>
            <Input value={form.issuer} onChange={set("issuer")} placeholder="e.g. Google" className="mt-1.5" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={form.description} onChange={set("description")} rows={2} placeholder="Brief details" className="mt-1.5" />
          </div>
          <div>
            <Label>Certificate / proof link (optional)</Label>
            <Input value={form.proofLink} onChange={set("proofLink")} placeholder="https://…" className="mt-1.5" />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={saving || !form.title.trim()}>{saving ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}