import React, { useState, useEffect } from "react";
import { User, Bell, Shield, Palette, BadgeCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useTheme } from "@/lib/useTheme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ToggleRow from "@/components/profile/ToggleRow";
import VerificationPanel from "@/components/profile/VerificationPanel";

const sections = [
  { id: "account", label: "Account", icon: User },
  { id: "verification", label: "Verification", icon: BadgeCheck },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy & Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
];

const NOTIF_ITEMS = [
  { key: "newMatches", label: "New opportunity matches", desc: "When AI finds opportunities tailored to you" },
  { key: "emailReminders", label: "Deadline reminders", desc: "7 days & 1 day before a deadline" },
  { key: "pushNotifications", label: "Push notifications", desc: "Real-time alerts on your device" },
  { key: "weeklyDigest", label: "Weekly digest", desc: "Summary of upcoming deadlines every Monday" },
  { key: "profileViews", label: "Profile views", desc: "When a recruiter views your profile" },
];

const PRIVACY_ITEMS = [
  { key: "publicProfile", label: "Public profile", desc: "Make your profile visible to others" },
  { key: "showToRecruiters", label: "Show profile to recruiters", desc: "Allow recruiters to discover you" },
  { key: "allowAiMatching", label: "Allow AI matching", desc: "Use your profile to recommend opportunities" },
];

export default function Settings() {
  const { user } = useAuth();
  const { profile, updateProfile, saving } = useProfile();
  const { theme, changeTheme } = useTheme();
  const [active, setActive] = useState("account");

  // local editable account fields
  const [acc, setAcc] = useState({});
  const [accSaved, setAccSaved] = useState(false);
  useEffect(() => {
    setAcc({
      headline: profile.headline || "",
      university: profile.university || "",
      location: profile.location || "",
      graduationYear: profile.graduationYear || "",
      careerGoals: profile.careerGoals || "",
    });
  }, [profile]);

  const setAccField = (k) => (e) => { setAcc((p) => ({ ...p, [k]: e.target.value })); setAccSaved(false); };
  const saveAccount = async () => {
    await updateProfile(acc);
    setAccSaved(true);
    setTimeout(() => setAccSaved(false), 2500);
  };

  const toggleNotif = (key) => (v) => updateProfile({ notifyPrefs: { ...profile.notifyPrefs, [key]: v } });
  const togglePrivacy = (key) => (v) => updateProfile({ privacyPrefs: { ...profile.privacyPrefs, [key]: v } });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-extrabold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences.</p>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        {/* Section nav */}
        <div className="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <button key={s.id} onClick={() => setActive(s.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${active === s.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                <Icon className="w-4 h-4" /> {s.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
          {active === "account" && (
            <div className="space-y-5">
              <h2 className="font-heading font-bold text-lg">Account details</h2>
              <Field label="Full name" value={user?.full_name || ""} readOnly />
              <Field label="Email" value={user?.email || ""} readOnly />
              <div>
                <Label>Headline</Label>
                <Input value={acc.headline || ""} onChange={setAccField("headline")} className="mt-1.5" placeholder="e.g. B.Tech CS · Aspiring ML Engineer" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>University</Label><Input value={acc.university || ""} onChange={setAccField("university")} className="mt-1.5" /></div>
                <div><Label>Location</Label><Input value={acc.location || ""} onChange={setAccField("location")} className="mt-1.5" /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>Graduation year</Label><Input value={acc.graduationYear || ""} onChange={setAccField("graduationYear")} className="mt-1.5" placeholder="2027" /></div>
                <div><Label>Career goals</Label><Input value={acc.careerGoals || ""} onChange={setAccField("careerGoals")} className="mt-1.5" /></div>
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={saveAccount} disabled={saving}>
                  {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</> : "Save changes"}
                </Button>
                {accSaved && <span className="text-xs font-semibold text-emerald-600">Saved ✓</span>}
              </div>
            </div>
          )}

          {active === "verification" && (
            <div className="space-y-4">
              <h2 className="font-heading font-bold text-lg">Student verification</h2>
              <VerificationPanel profile={profile} onVerified={updateProfile} />
            </div>
          )}

          {active === "notifications" && (
            <div className="space-y-4">
              <h2 className="font-heading font-bold text-lg">Notification preferences</h2>
              {NOTIF_ITEMS.map((n) => (
                <ToggleRow key={n.key} label={n.label} description={n.desc} checked={!!profile.notifyPrefs?.[n.key]} onChange={toggleNotif(n.key)} disabled={saving} />
              ))}
            </div>
          )}

          {active === "privacy" && (
            <div className="space-y-4">
              <h2 className="font-heading font-bold text-lg">Privacy & Security</h2>
              {PRIVACY_ITEMS.map((n) => (
                <ToggleRow key={n.key} label={n.label} description={n.desc} checked={!!profile.privacyPrefs?.[n.key]} onChange={togglePrivacy(n.key)} disabled={saving} />
              ))}
            </div>
          )}

          {active === "appearance" && (
            <div className="space-y-4">
              <h2 className="font-heading font-bold text-lg">Appearance</h2>
              <p className="text-sm text-muted-foreground">Choose how Ascend looks to you.</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: "light", label: "Light", preview: "bg-white border-border" },
                  { key: "dark", label: "Dark", preview: "bg-slate-900 border-slate-700" },
                  { key: "system", label: "System", preview: "bg-gradient-to-br from-white to-slate-900 border-border" },
                ].map((opt) => (
                  <button key={opt.key} onClick={() => changeTheme(opt.key)}
                    className={`rounded-xl border-2 p-3 text-sm font-semibold transition-colors ${theme === opt.key ? "border-primary bg-primary/5" : "border-border hover:bg-muted"}`}>
                    <div className={`h-16 rounded-lg border ${opt.preview} mb-2.5`} />
                    <span className={theme === opt.key ? "text-primary" : ""}>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, readOnly }) {
  return (
    <div>
      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</Label>
      <Input value={value} readOnly={readOnly} className="mt-1.5 h-11 px-3.5 rounded-xl bg-muted/40 border border-border text-sm font-medium" />
    </div>
  );
}