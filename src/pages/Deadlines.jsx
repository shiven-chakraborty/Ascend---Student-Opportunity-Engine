import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, AlertTriangle, Bell, CheckCircle2, BellOff } from "lucide-react";
import { upcomingDeadlines, opportunities } from "@/lib/mockData";
import { useProfile } from "@/hooks/useProfile";
import TypeBadge from "@/components/TypeBadge";
import ToggleRow from "@/components/profile/ToggleRow";
import CalendarButton from "@/components/CalendarButton";

export default function Deadlines() {
  const { profile, updateProfile, saving } = useProfile();
  const sorted = [...upcomingDeadlines].sort((a, b) => a.daysLeft - b.daysLeft);

  const thisWeek = sorted.filter((d) => d.daysLeft <= 7).length;
  const thisMonth = sorted.filter((d) => d.daysLeft <= 30).length;

  const disabled = profile.notifyPrefs?.disabledDeadlines || [];
  const isDisabled = (id) => disabled.includes(id);
  const toggleAlert = (id) => {
    const next = isDisabled(id) ? disabled.filter((x) => x !== id) : [...disabled, id];
    updateProfile({ notifyPrefs: { ...profile.notifyPrefs, disabledDeadlines: next } });
  };

  const setNotif = (key) => (v) => updateProfile({ notifyPrefs: { ...profile.notifyPrefs, [key]: v } });

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="font-heading text-2xl font-extrabold tracking-tight flex items-center gap-2">
          <Bell className="w-6 h-6 text-primary" /> Deadline Alerts
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Never miss an opportunity. Enable alerts per deadline and we'll remind you before they close.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <SummaryCard label="This week" value={thisWeek} color="text-rose-500" bg="bg-rose-50" icon={AlertTriangle} />
        <SummaryCard label="This month" value={thisMonth} color="text-amber-600" bg="bg-amber-50" icon={Clock} />
        <SummaryCard label="Tracked" value={sorted.length} color="text-primary" bg="bg-primary/10" icon={Calendar} />
      </div>

      {/* Google Calendar integration banner */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-4 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-white dark:bg-card flex items-center justify-center shrink-0 shadow-soft">
          <Calendar className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">Google Calendar integration</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            Add any deadline to your calendar with one click. Use the Google Calendar link to save it directly, or download a <span className="font-medium">.ics</span> file for Apple Calendar, Outlook, or any other app.
          </p>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {sorted.map((d) => {
          const urgent = d.daysLeft <= 10;
          const off = isDisabled(d.id);
          return (
            <div key={d.id} className="flex items-center gap-4 bg-card border border-border rounded-2xl p-4 shadow-soft hover:shadow-lift hover:border-primary/30 transition-all">
              <Link to={`/opportunities/${d.id}`} className="flex items-center gap-4 flex-1 min-w-0 group">
                <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 ${urgent ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"}`}>
                  <span className="font-heading font-extrabold text-lg leading-none">{d.daysLeft}</span>
                  <span className="text-[9px] font-semibold uppercase">days</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{d.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <TypeBadge type={d.type} />
                    <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(d.deadline).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>
              </Link>
              {urgent && (
                <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-rose-500 bg-rose-50 rounded-lg px-2.5 py-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Urgent
                </span>
              )}
              {/* Per-deadline alert toggle */}
              <CalendarButton
                event={{
                  title: d.title,
                  date: d.deadline,
                  description: `${d.type} deadline tracked in Ascend. Don't miss it!`,
                  location: "",
                  url: `${window.location.origin}/opportunities/${d.id}`,
                }}
              />
              <button
                onClick={() => toggleAlert(d.id)}
                disabled={saving}
                title={off ? "Alerts off" : "Alerts on"}
                className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg px-2.5 py-1.5 transition-colors ${off ? "bg-muted text-muted-foreground" : "bg-emerald-50 text-emerald-600"}`}
              >
                {off ? <BellOff className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                {off ? "Off" : "On"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Notification preferences */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-soft">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <h2 className="font-heading font-bold text-base">Notification preferences</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-3">These apply to all your tracked deadlines. Changes are saved automatically.</p>
        <ToggleRow label="Email reminders" description="7 days & 1 day before deadline" checked={!!profile.notifyPrefs?.emailReminders} onChange={setNotif("emailReminders")} disabled={saving} />
        <ToggleRow label="Push notifications" description="Real-time alerts on your device" checked={!!profile.notifyPrefs?.pushNotifications} onChange={setNotif("pushNotifications")} disabled={saving} />
        <ToggleRow label="Weekly digest" description="Summary of upcoming deadlines every Monday" checked={!!profile.notifyPrefs?.weeklyDigest} onChange={setNotif("weeklyDigest")} disabled={saving} />
      </div>
    </div>
  );
}

function SummaryCard({ label, value, color, bg, icon: Icon }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-soft">
      <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-2`}>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <p className="font-heading text-xl font-extrabold">{value}</p>
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
    </div>
  );
}