import { useEffect, useRef } from "react";

interface UserProfile {
  intent: string[];
  habitToBuild: string;
  dailyHabits: string[];
  tinySteps: string[];
  stepPreference: string;
  obstacles: string[];
  reflectionStyle: string;
  consentGiven: boolean;
  completedAt: string;
}

export const useOnboardingData = () => {
  const getProfile = (): UserProfile | null => {
    try {
      const stored = localStorage.getItem("userProfile");
      if (stored) {
        return JSON.parse(stored) as UserProfile;
      }
    } catch (e) {
      console.error("Failed to parse user profile:", e);
    }
    return null;
  };

  const hasCompletedSurvey = (): boolean => {
    return localStorage.getItem("surveyCompleted") === "true";
  };

  const getDailyHabits = (): string[] => {
    const profile = getProfile();
    return profile?.dailyHabits || [];
  };

  const getTinySteps = (): string[] => {
    const profile = getProfile();
    return profile?.tinySteps || [];
  };

  const getReflectionStyle = (): string | null => {
    const profile = getProfile();
    return profile?.reflectionStyle || null;
  };

  const getObstacles = (): string[] => {
    const profile = getProfile();
    return profile?.obstacles || [];
  };

  const markHabitsAsPopulated = () => {
    localStorage.setItem("habitsPopulated", "true");
  };

  const markStepsAsPopulated = () => {
    localStorage.setItem("stepsPopulated", "true");
  };

  const shouldPopulateHabits = (): boolean => {
    return hasCompletedSurvey() && localStorage.getItem("habitsPopulated") !== "true";
  };

  const shouldPopulateSteps = (): boolean => {
    return hasCompletedSurvey() && localStorage.getItem("stepsPopulated") !== "true";
  };

  return {
    getProfile,
    hasCompletedSurvey,
    getDailyHabits,
    getTinySteps,
    getReflectionStyle,
    getObstacles,
    markHabitsAsPopulated,
    markStepsAsPopulated,
    shouldPopulateHabits,
    shouldPopulateSteps,
  };
};

// Hook to auto-populate habits from survey on first load
export const useAutoPopulateFromSurvey = (
  addHabit: (name: string) => void,
  addStep: (text: string) => void,
  isHabitsLoading: boolean,
  isStepsLoading: boolean,
  existingHabits: { name: string }[],
  existingSteps: { text: string }[]
) => {
  const hasPopulatedHabits = useRef(false);
  const hasPopulatedSteps = useRef(false);
  const onboarding = useOnboardingData();

  useEffect(() => {
    // Only run once habits are loaded and we haven't populated yet
    if (
      !isHabitsLoading &&
      !hasPopulatedHabits.current &&
      onboarding.shouldPopulateHabits()
    ) {
      const surveyHabits = onboarding.getDailyHabits();
      const existingNames = new Set(existingHabits.map(h => h.name.toLowerCase()));

      // Only add habits that don't already exist
      surveyHabits.forEach(habit => {
        // Clean emoji prefix if present
        const cleanHabit = habit.replace(/^[\u{1F300}-\u{1F9FF}]\s*/u, '');
        if (!existingNames.has(cleanHabit.toLowerCase()) && !existingNames.has(habit.toLowerCase())) {
          addHabit(cleanHabit);
        }
      });

      onboarding.markHabitsAsPopulated();
      hasPopulatedHabits.current = true;
    }
  }, [isHabitsLoading, existingHabits, addHabit]);

  useEffect(() => {
    // Only run once steps are loaded and we haven't populated yet
    if (
      !isStepsLoading &&
      !hasPopulatedSteps.current &&
      onboarding.shouldPopulateSteps()
    ) {
      const surveySteps = onboarding.getTinySteps();
      const existingTexts = new Set(existingSteps.map(s => s.text.toLowerCase()));

      // Only add steps that don't already exist
      surveySteps.forEach(step => {
        if (!existingTexts.has(step.toLowerCase())) {
          addStep(step);
        }
      });

      onboarding.markStepsAsPopulated();
      hasPopulatedSteps.current = true;
    }
  }, [isStepsLoading, existingSteps, addStep]);
};
