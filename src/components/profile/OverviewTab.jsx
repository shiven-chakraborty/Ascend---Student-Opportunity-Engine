import React from "react";
import { Sparkles, Heart, TrendingUp, Award, FolderGit2, Trophy } from "lucide-react";
import SkillChip from "@/components/SkillChip";

function Section({ icon: Icon, title, children, action }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-primary" />
          <h2 className="font-heading font-bold text-base">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

export default function OverviewTab({ profile, skills, projects, achievements, onGoTab }) {
  const certs = achievements.filter((a) => a.type === "Certification");
  const wins = achievements.filter((a) => a.type === "Achievement");

  return (
    <div className="space-y-6 animate-fade-in-fast">
      <Section icon={Sparkles} title="About">
        {profile.bio ? (
          <p className="text-sm leading-relaxed text-muted-foreground">{profile.bio}</p>
        ) : (
          <p className="text-sm text-muted-foreground italic">No bio yet. Edit your profile to add one.</p>
        )}
      </Section>

      <Section icon={Heart} title="Interests">
        {profile.interests?.length ? (
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((i) => (
              <span key={i} className="text-sm font-medium text-accent rounded-lg px-3 py-1.5" style={{ backgroundColor: "hsl(262 83% 58% / 0.08)" }}>{i}</span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No interests added yet.</p>
        )}
      </Section>

      <Section icon={TrendingUp} title="Career goals">
        <p className="text-sm text-muted-foreground">{profile.careerGoals || "Not set yet."}</p>
      </Section>

      <Section icon={Sparkles} title="Top Skills" action={<button onClick={() => onGoTab("skills")} className="text-xs font-semibold text-primary">View all</button>}>
        {skills.length ? (
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 5).map((s) => <SkillChip key={s.id} name={s.name} category={s.category} level={s.level} showLevel />)}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No skills yet. Add your first skill.</p>
        )}
      </Section>

      <div className="grid sm:grid-cols-3 gap-4">
        <MiniStat icon={FolderGit2} label="Projects" value={projects.length} />
        <MiniStat icon={Award} label="Certifications" value={certs.length} />
        <MiniStat icon={Trophy} label="Achievements" value={wins.length} />
      </div>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-soft flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Icon className="w-5 h-5 text-primary" /></div>
      <div><p className="font-heading text-xl font-extrabold leading-none">{value}</p><p className="text-xs text-muted-foreground mt-1">{label}</p></div>
    </div>
  );
}