import React, { useState } from "react";
import { BadgeCheck, MapPin, GraduationCap, Pencil } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useProfile, computeCompletion } from "@/hooks/useProfile";
import { useUserCollection } from "@/hooks/useUserCollection";
import { skills as seedSkillsData, projects as seedProjectsData, achievements as seedAchievementsData, certifications as seedCertsData } from "@/lib/mockData";
import OverviewTab from "@/components/profile/OverviewTab";
import SkillsTab from "@/components/profile/SkillsTab";
import ProjectsTab from "@/components/profile/ProjectsTab";
import AchievementsTab from "@/components/profile/AchievementsTab";
import ProfileEditDialog from "@/components/profile/ProfileEditDialog";
import SkillDialog from "@/components/profile/SkillDialog";
import ProjectDialog from "@/components/profile/ProjectDialog";
import AchievementDialog from "@/components/profile/AchievementDialog";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "achievements", label: "Achievements" },
];

export default function Profile() {
  const { user } = useAuth();
  const { profile, updateProfile, saving: profileSaving } = useProfile();
  const skillsCol = useUserCollection("Skill");
  const projectsCol = useUserCollection("Project");
  const achievementsCol = useUserCollection("Achievement");

  const [activeTab, setActiveTab] = useState("overview");
  const [editOpen, setEditOpen] = useState(false);
  const [skillDialog, setSkillDialog] = useState({ open: false, initial: null });
  const [projectDialog, setProjectDialog] = useState({ open: false, initial: null });
  const [achDialog, setAchDialog] = useState({ open: false, initial: null });

  const name = user?.full_name || "Student";
  const email = user?.email || "";
  const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4f46e5&color=fff&bold=true&size=256`;
  const completion = computeCompletion(profile, {
    skills: skillsCol.items.length,
    projects: projectsCol.items.length,
    achievements: achievementsCol.items.length,
  });

  // ---- Skill handlers ----
  const submitSkill = async (payload) => {
    if (skillDialog.initial) await skillsCol.update(skillDialog.initial.id, payload);
    else await skillsCol.create(payload);
    setSkillDialog({ open: false, initial: null });
  };
  const seedSkills = async () => {
    await Promise.all(seedSkillsData.map((s) => skillsCol.create({ name: s.name, category: s.category, level: s.level })));
    await skillsCol.reload();
  };

  // ---- Project handlers ----
  const submitProject = async (payload) => {
    if (projectDialog.initial) await projectsCol.update(projectDialog.initial.id, payload);
    else await projectsCol.create(payload);
    setProjectDialog({ open: false, initial: null });
  };
  const seedProjects = async () => {
    await Promise.all(seedProjectsData.map((p) => projectsCol.create({ title: p.title, description: p.description, tags: p.tags, link: p.link, image: p.image, role: "Builder" })));
    await projectsCol.reload();
  };

  // ---- Achievement handlers ----
  const submitAch = async (payload) => {
    if (achDialog.initial) await achievementsCol.update(achDialog.initial.id, payload);
    else await achievementsCol.create(payload);
    setAchDialog({ open: false, initial: null });
  };
  const seedAchievements = async () => {
    const all = [
      ...seedCertsData.map((c) => ({ title: c.name, issuer: c.issuer, date: c.year, type: "Certification", logo: c.logo })),
      ...seedAchievementsData.map((a) => ({ title: a.title, description: a.detail, date: a.year, type: "Achievement", logo: "🏆" })),
    ];
    await Promise.all(all.map((a) => achievementsCol.create(a)));
    await achievementsCol.reload();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header card */}
      <div className="bg-card border border-border rounded-3xl shadow-card overflow-hidden">
        <div className="h-28 sm:h-36 bg-brand-gradient relative">
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute right-20 top-10 w-24 h-24 rounded-full bg-white/5" />
        </div>
        <div className="px-6 sm:px-8 pb-6 -mt-12 sm:-mt-14">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="relative shrink-0">
              <img src={avatar} alt={name} className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-card shadow-lift" />
              {profile.verified && (
                <span className="absolute -bottom-2 -right-2 bg-card rounded-full p-1 shadow-soft">
                  <BadgeCheck className="w-6 h-6 text-emerald-500 fill-emerald-500/10" />
                </span>
              )}
            </div>
            <div className="flex-1 sm:pb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-heading text-2xl font-extrabold tracking-tight">{name}</h1>
                {profile.verified ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-50 text-emerald-600 rounded-full px-2.5 py-1">
                    <BadgeCheck className="w-3.5 h-3.5" /> Verified Student
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-50 text-amber-600 rounded-full px-2.5 py-1">
                    Unverified
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{profile.headline || "Add a headline to your profile"}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                {profile.degree && <span className="inline-flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> {profile.degree}{profile.university ? `, ${profile.university}` : ""}</span>}
                {profile.location && <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {profile.location}</span>}
                {profile.graduationYear && <span>Class of {profile.graduationYear}</span>}
                <span className="inline-flex items-center gap-1">{email}</span>
              </div>
            </div>
            <button onClick={() => setEditOpen(true)} className="inline-flex items-center gap-2 text-sm font-semibold bg-card border border-border hover:bg-muted rounded-xl px-4 py-2.5 transition-colors sm:mb-2 shadow-soft">
              <Pencil className="w-4 h-4" /> Edit profile
            </button>
          </div>

          {/* Completion bar */}
          <div className="mt-6 bg-muted/50 rounded-2xl p-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold">Profile completeness</span>
                <span className="text-sm font-bold text-primary">{completion}%</span>
              </div>
              <div className="h-2 rounded-full bg-border overflow-hidden">
                <div className="h-full bg-brand-gradient rounded-full transition-all duration-500" style={{ width: `${completion}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">{completion < 100 ? "Add more details to reach 100% and improve your matches." : "Your profile is complete — great job!"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border overflow-x-auto no-scrollbar">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "overview" && <OverviewTab profile={profile} skills={skillsCol.items} projects={projectsCol.items} achievements={achievementsCol.items} onGoTab={setActiveTab} />}
      {activeTab === "skills" && <SkillsTab items={skillsCol.items} loading={skillsCol.loading} saving={skillsCol.saving} onAdd={() => setSkillDialog({ open: true, initial: null })} onEdit={(s) => setSkillDialog({ open: true, initial: s })} onDelete={skillsCol.remove} onSeed={seedSkills} />}
      {activeTab === "projects" && <ProjectsTab items={projectsCol.items} loading={projectsCol.loading} saving={projectsCol.saving} onAdd={() => setProjectDialog({ open: true, initial: null })} onEdit={(p) => setProjectDialog({ open: true, initial: p })} onDelete={projectsCol.remove} onSeed={seedProjects} />}
      {activeTab === "achievements" && <AchievementsTab items={achievementsCol.items} loading={achievementsCol.loading} saving={achievementsCol.saving} onAdd={(type) => setAchDialog({ open: true, initial: { type } })} onEdit={(a) => setAchDialog({ open: true, initial: a })} onDelete={achievementsCol.remove} onSeed={seedAchievements} />}

      {/* Dialogs */}
      <ProfileEditDialog open={editOpen} onOpenChange={setEditOpen} onSubmit={updateProfile} initial={profile} saving={profileSaving} />
      <SkillDialog open={skillDialog.open} onOpenChange={(o) => setSkillDialog((s) => ({ ...s, open: o }))} onSubmit={submitSkill} initial={skillDialog.initial} saving={skillsCol.saving} />
      <ProjectDialog open={projectDialog.open} onOpenChange={(o) => setProjectDialog((s) => ({ ...s, open: o }))} onSubmit={submitProject} initial={projectDialog.initial} saving={projectsCol.saving} />
      <AchievementDialog open={achDialog.open} onOpenChange={(o) => setAchDialog((s) => ({ ...s, open: o }))} onSubmit={submitAch} initial={achDialog.initial} saving={achievementsCol.saving} />
    </div>
  );
}