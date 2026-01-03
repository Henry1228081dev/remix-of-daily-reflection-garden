import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingSurvey from "@/components/OnboardingSurvey";
import { useOnboardingData } from "@/hooks/useOnboardingData";

const Onboarding = () => {
  const navigate = useNavigate();
  const { hasCompletedSurvey } = useOnboardingData();

  useEffect(() => {
    if (hasCompletedSurvey()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, hasCompletedSurvey]);

  // Don't render survey if already completed (will redirect)
  if (hasCompletedSurvey()) {
    return null;
  }

  return <OnboardingSurvey />;
};

export default Onboarding;
