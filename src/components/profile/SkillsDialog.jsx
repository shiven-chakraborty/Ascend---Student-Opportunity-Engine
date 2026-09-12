import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CATEGORIES = ["Technical", "Design", "Soft", "Other"];

export default function SkillDialog({ open, onOpenChange, onSubmit, initial, saving }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Technical");
  const [level, setLevel] = useState(70);

  useEffect(() => {
    if (open) {
      setName(initial?.name || "");
      setCategory(initial?.category || "Technical");
      setLevel(initial?.level ?? 70);
    }
  }, [open, initial]);

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), category, level: Number(level) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit skill" : "Add a skill"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label>Skill name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Python" className="mt-1.5" autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Proficiency: {level}%</Label>
              <input type="range" min={0} max={100} value={level} onChange={(e) => setLevel(e.target.value)} className="w-full mt-3 accent-primary" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={saving || !name.trim()}>{saving ? "Saving…" : "Save skill"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}