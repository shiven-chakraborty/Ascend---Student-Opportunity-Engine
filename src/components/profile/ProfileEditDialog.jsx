import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const OPP_TYPES = ["Internship", "Hackathon", "Scholarship", "Competition", "Project"];

export default function ProfileEditDialog({ open, onOpenChange, onSubmit, initial, saving }) {
  const [f, setF] = useState({});

  useEffect(() => {
    if (open) {
      setF({
        headline: initial?.headline || "",
        bio: initial?.bio || "",
        university: initial?.university || "",
        degree: initial?.degree || "",
        graduationYear: initial?.graduationYear || "",
        location: initial?.location || "",
        careerGoals: initial?.careerGoals || "",
        interests: (initial?.interests || []).join(", "),
        preferredTypes: initial?.preferredTypes || [],
        github: initial?.github || "",
        linkedin: initial?.linkedin || "",
        portfolio: initial?.portfolio || "",
        resume: initial?.resume || "",
      });
    }
  }, [open, initial]);

  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const toggleType = (t) =>
    setF((p) => ({
      ...p,
      preferredTypes: p.preferredTypes.includes(t) ? p.preferredTypes.filter((x) => x !== t) : [...p.preferredTypes, t],
    }));

  const submit = (e) => {
    e.preventDefault();
    onSubmit({
      headline: f.headline.trim(),
      bio: f.bio.trim(),
      university: f.university.trim(),
      degree: f.degree.trim(),
      graduationYear: f.graduationYear.trim(),
      location: f.location.trim(),
      careerGoals: f.careerGoals.trim(),
      interests: f.interests.split(",").map((s) => s.trim()).filter(Boolean),
      preferredTypes: f.preferredTypes,
      github: f.github.trim(),
      linkedin: f.linkedin.trim(),
      portfolio: f.portfolio.trim(),
      resume: f.resume.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4 max-h-[72vh] overflow-y-auto pr-1">
          <div>
            <Label>Headline</Label>
            <Input value={f.headline} onChange={set("headline")} placeholder="e.g. B.Tech CS · Aspiring ML Engineer" className="mt-1.5" />
          </div>
          <div>
            <Label>Bio</Label>
            <Textarea value={f.bio} onChange={set("bio")} rows={3} className="mt-1.5" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>University</Label>
              <Input value={f.university} onChange={set("university")} className="mt-1.5" />
            </div>
            <div>
              <Label>Degree / course</Label>
              <Input value={f.degree} onChange={set("degree")} className="mt-1.5" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Graduation year</Label>
              <Input value={f.graduationYear} onChange={set("graduationYear")} placeholder="2027" className="mt-1.5" />
            </div>
            <div>
              <Label>Location</Label>
              <Input value={f.location} onChange={set("location")} className="mt-1.5" />
            </div>
          </div>
          <div>
            <Label>Career goals</Label>
            <Input value={f.careerGoals} onChange={set("careerGoals")} placeholder="e.g. ML Engineer at a product company" className="mt-1.5" />
          </div>
          <div>
            <Label>Interests (comma separated)</Label>
            <Input value={f.interests} onChange={set("interests")} placeholder="AI, Sustainability, EdTech" className="mt-1.5" />
          </div>
          <div>
            <Label>Preferred opportunity types</Label>
            <div className="flex flex-wrap gap-3 mt-2">
              {OPP_TYPES.map((t) => (
                <label key={t} className="inline-flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={f.preferredTypes?.includes(t)} onCheckedChange={() => toggleType(t)} />
                  {t}
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>GitHub</Label>
              <Input value={f.github} onChange={set("github")} placeholder="https://github.com/…" className="mt-1.5" />
            </div>
            <div>
              <Label>LinkedIn</Label>
              <Input value={f.linkedin} onChange={set("linkedin")} placeholder="https://linkedin.com/…" className="mt-1.5" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Portfolio</Label>
              <Input value={f.portfolio} onChange={set("portfolio")} placeholder="https://…" className="mt-1.5" />
            </div>
            <div>
              <Label>Resume link</Label>
              <Input value={f.resume} onChange={set("resume")} placeholder="https://…" className="mt-1.5" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save profile"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}