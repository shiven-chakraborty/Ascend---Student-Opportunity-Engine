import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";

export const DEFAULT_PROFILE = {
  headline: "",
  bio: "",
  university: "",
  degree: "",
  graduationYear: "",
  location: "",
  interests: [],
  careerGoals: "",
  github: "",
  linkedin: "",
  portfolio: "",
  resume: "",
  preferredTypes: [],
  verified: false,
  verificationMethod: null,
  verificationEmail: null,
  notifyPrefs: {
    emailReminders: true,
    pushNotifications: true,
    weeklyDigest: false,
    newMatches: true,
    profileViews: false,
    disabledDeadlines: [],
  },
  privacyPrefs: {
    publicProfile: true,
    showToRecruiters: true,
    allowAiMatching: true,
  },
};

export function useProfile() {
  const { user, checkUserAuth } = useAuth();
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        ...DEFAULT_PROFILE,
        ...user,
        interests: user.interests || [],
        preferredTypes: user.preferredTypes || [],
        notifyPrefs: { ...DEFAULT_PROFILE.notifyPrefs, ...(user.notifyPrefs || {}) },
        privacyPrefs: { ...DEFAULT_PROFILE.privacyPrefs, ...(user.privacyPrefs || {}) },
      });
    }
  }, [user]);

  const updateProfile = useCallback(
    async (partial) => {
      setSaving(true);
      try {
        await base44.auth.updateMe(partial);
        setProfile((p) => ({
          ...p,
          ...partial,
          notifyPrefs: { ...p.notifyPrefs, ...(partial.notifyPrefs || {}) },
        }));
        if (checkUserAuth) await checkUserAuth();
      } finally {
        setSaving(false);
      }
    },
    [checkUserAuth]
  );

  return { profile, updateProfile, saving };
}

const WEIGHTS = {
  headline: 8, bio: 8, university: 8, degree: 6, graduationYear: 4, location: 4,
  careerGoals: 6, interests: 6, preferredTypes: 5,
  github: 5, linkedin: 5, portfolio: 5, resume: 5,
  verified: 10, hasSkill: 5, hasProject: 5, hasAchievement: 5,
};

export function computeCompletion(profile, counts = {}) {
  let score = 0;
  ["headline", "bio", "university", "degree", "graduationYear", "location", "careerGoals", "github", "linkedin", "portfolio", "resume"].forEach((f) => {
    if (profile[f] && String(profile[f]).trim()) score += WEIGHTS[f];
  });
  if (profile.interests?.length) score += WEIGHTS.interests;
  if (profile.preferredTypes?.length) score += WEIGHTS.preferredTypes;
  if (profile.verified) score += WEIGHTS.verified;
  if (counts.skills) score += WEIGHTS.hasSkill;
  if (counts.projects) score += WEIGHTS.hasProject;
  if (counts.achievements) score += WEIGHTS.hasAchievement;
  return Math.min(100, Math.round(score));
}