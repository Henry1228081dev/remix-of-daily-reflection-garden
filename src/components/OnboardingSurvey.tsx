import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

interface UserProfile {
  intent: string[];
  currentHabits: string[];
  habitToBuild: string;
  stepPreference: string;
  currentChallenge: string;
  obstacles: string[];
  hobbies: string;
  reflectionStyle: string;
  consentGiven: boolean;
  completedAt: string;
}

const INTENT_OPTIONS = [
  "I want to track my mood and emotional patterns",
  "I want to build better daily habits",
  "I'm looking to start journaling",
  "I need help managing stress or anxiety",
  "I want to be more intentional with my day",
];

const CURRENT_HABITS_OPTIONS = [
  "Drink water",
  "Exercise/movement",
  "Meditation or breathing exercises",
  "Reading",
  "Creative activities",
  "Social connection",
  "Journaling or reflection",
  "Sleep consistency",
  "None of the above",
];

const STEP_PREFERENCE_OPTIONS = [
  "I like big ambitious goals",
  "I prefer small daily wins",
  "I break things into specific timeframes",
  "I'm not sure what works for me",
];

const OBSTACLES_OPTIONS = [
  "I forget or lose motivation",
  "I set unrealistic expectations",
  "I don't track progress effectively",
  "Life gets chaotic/unpredictable",
  "I struggle with negative self-talk",
  "Something else",
];

const REFLECTION_STYLE_OPTIONS = [
  "Free-writing/stream of consciousness",
  "Answering specific questions",
  "I want to learn how",
  "Not sure",
];

const OnboardingSurvey = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Partial<UserProfile>>({
    intent: [],
    currentHabits: [],
    habitToBuild: "",
    stepPreference: "",
    currentChallenge: "",
    obstacles: [],
    hobbies: "",
    reflectionStyle: "",
    consentGiven: false,
  });

  const totalQuestions = 9;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const canProceed = (): boolean => {
    switch (currentQuestion) {
      case 0:
        return (answers.intent?.length || 0) > 0;
      case 1:
        return (answers.currentHabits?.length || 0) > 0;
      case 2:
        return (answers.habitToBuild?.length || 0) >= 5 && (answers.habitToBuild?.length || 0) <= 100;
      case 3:
        return !!answers.stepPreference;
      case 4:
        return (answers.currentChallenge?.length || 0) >= 10 && (answers.currentChallenge?.length || 0) <= 300;
      case 5:
        return (answers.obstacles?.length || 0) > 0 && (answers.obstacles?.length || 0) <= 2;
      case 6:
        return (answers.hobbies?.length || 0) >= 3;
      case 7:
        return !!answers.reflectionStyle;
      case 8:
        return answers.consentGiven === true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      completeSurvey();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const completeSurvey = () => {
    const profile: UserProfile = {
      intent: answers.intent || [],
      currentHabits: answers.currentHabits || [],
      habitToBuild: answers.habitToBuild || "",
      stepPreference: answers.stepPreference || "",
      currentChallenge: answers.currentChallenge || "",
      obstacles: answers.obstacles || [],
      hobbies: answers.hobbies || "",
      reflectionStyle: answers.reflectionStyle || "",
      consentGiven: answers.consentGiven || false,
      completedAt: new Date().toISOString(),
    };

    localStorage.setItem("userProfile", JSON.stringify(profile));
    localStorage.setItem("surveyCompleted", "true");

    toast({
      title: "Welcome to Reflect! 🌱",
      description: "Your personalized experience is ready. Let's get started on your journey.",
    });

    navigate("/");
  };

  const toggleArrayItem = (key: "intent" | "currentHabits" | "obstacles", item: string, maxItems?: number) => {
    setAnswers(prev => {
      const current = prev[key] || [];
      if (current.includes(item)) {
        return { ...prev, [key]: current.filter(i => i !== item) };
      } else {
        if (maxItems && current.length >= maxItems) {
          return prev;
        }
        return { ...prev, [key]: [...current, item] };
      }
    });
  };

  const renderQuestion = () => {
    switch (currentQuestion) {
      case 0:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">What brings you to Reflect?</h2>
            <p className="text-muted-foreground">Select all that resonate with you</p>
            <div className="space-y-3 pt-4">
              {INTENT_OPTIONS.map((option) => (
                <motion.div
                  key={option}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    answers.intent?.includes(option)
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                  onClick={() => toggleArrayItem("intent", option)}
                >
                  <Checkbox
                    checked={answers.intent?.includes(option)}
                    className="pointer-events-none"
                  />
                  <span className="text-foreground">{option}</span>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Which of these do you already do daily?</h2>
            <p className="text-muted-foreground">It's okay if the answer is none — we're here to help you build!</p>
            <div className="space-y-3 pt-4">
              {CURRENT_HABITS_OPTIONS.map((option) => (
                <motion.div
                  key={option}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    answers.currentHabits?.includes(option)
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                  onClick={() => toggleArrayItem("currentHabits", option)}
                >
                  <Checkbox
                    checked={answers.currentHabits?.includes(option)}
                    className="pointer-events-none"
                  />
                  <span className="text-foreground">{option}</span>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">What's one habit you'd like to build in the next month?</h2>
            <p className="text-muted-foreground">Start with something gentle — small steps lead to big changes</p>
            <div className="pt-4">
              <Input
                placeholder="e.g., Read for 10 minutes before bed"
                value={answers.habitToBuild || ""}
                onChange={(e) => setAnswers(prev => ({ ...prev, habitToBuild: e.target.value }))}
                className="text-lg p-6 rounded-xl"
                maxLength={100}
              />
              <p className="text-sm text-muted-foreground mt-2">
                {answers.habitToBuild?.length || 0}/100 characters
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">How do you prefer to break down goals?</h2>
            <p className="text-muted-foreground">Understanding your style helps us support you better</p>
            <RadioGroup
              value={answers.stepPreference || ""}
              onValueChange={(value) => setAnswers(prev => ({ ...prev, stepPreference: value }))}
              className="space-y-3 pt-4"
            >
              {STEP_PREFERENCE_OPTIONS.map((option) => (
                <motion.div
                  key={option}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    answers.stepPreference === option
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                  onClick={() => setAnswers(prev => ({ ...prev, stepPreference: option }))}
                >
                  <RadioGroupItem value={option} className="pointer-events-none" />
                  <Label className="cursor-pointer flex-1">{option}</Label>
                </motion.div>
              ))}
            </RadioGroup>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">What's one task or habit you're currently struggling with?</h2>
            <p className="text-muted-foreground">No judgment here — we all have our challenges</p>
            <div className="pt-4">
              <Textarea
                placeholder="Share what's been on your mind..."
                value={answers.currentChallenge || ""}
                onChange={(e) => setAnswers(prev => ({ ...prev, currentChallenge: e.target.value }))}
                className="text-lg p-4 rounded-xl min-h-[150px] resize-none"
                maxLength={300}
              />
              <p className="text-sm text-muted-foreground mt-2">
                {answers.currentChallenge?.length || 0}/300 characters
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">What usually stops you from following through?</h2>
            <p className="text-muted-foreground">Select up to 2 that feel most true for you</p>
            <div className="space-y-3 pt-4">
              {OBSTACLES_OPTIONS.map((option) => (
                <motion.div
                  key={option}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    answers.obstacles?.includes(option)
                      ? "border-primary bg-primary/10"
                      : answers.obstacles?.length === 2 && !answers.obstacles?.includes(option)
                      ? "border-border opacity-50 cursor-not-allowed"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                  onClick={() => toggleArrayItem("obstacles", option, 2)}
                >
                  <Checkbox
                    checked={answers.obstacles?.includes(option)}
                    className="pointer-events-none"
                  />
                  <span className="text-foreground">{option}</span>
                </motion.div>
              ))}
            </div>
            {(answers.obstacles?.length || 0) === 2 && (
              <p className="text-sm text-primary">✓ Maximum selections reached</p>
            )}
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">What are 2-3 things that make you feel good?</h2>
            <p className="text-muted-foreground">These help us personalize your Kind Notes</p>
            <div className="pt-4">
              <Input
                placeholder="e.g., Gaming, cooking, talking to friends"
                value={answers.hobbies || ""}
                onChange={(e) => setAnswers(prev => ({ ...prev, hobbies: e.target.value }))}
                className="text-lg p-6 rounded-xl"
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">How do you usually reflect on your day?</h2>
            <p className="text-muted-foreground">This helps us tailor your journaling experience</p>
            <RadioGroup
              value={answers.reflectionStyle || ""}
              onValueChange={(value) => setAnswers(prev => ({ ...prev, reflectionStyle: value }))}
              className="space-y-3 pt-4"
            >
              {REFLECTION_STYLE_OPTIONS.map((option) => (
                <motion.div
                  key={option}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    answers.reflectionStyle === option
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                  onClick={() => setAnswers(prev => ({ ...prev, reflectionStyle: option }))}
                >
                  <RadioGroupItem value={option} className="pointer-events-none" />
                  <Label className="cursor-pointer flex-1">{option}</Label>
                </motion.div>
              ))}
            </RadioGroup>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Almost there! 🌱</h2>
            <p className="text-muted-foreground">One last thing before we get started</p>
            <motion.div
              whileTap={{ scale: 0.98 }}
              className={`flex items-start space-x-4 p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                answers.consentGiven
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              }`}
              onClick={() => setAnswers(prev => ({ ...prev, consentGiven: !prev.consentGiven }))}
            >
              <Checkbox
                checked={answers.consentGiven}
                className="mt-1 pointer-events-none"
              />
              <div className="space-y-2">
                <span className="text-foreground font-medium">
                  I'm okay with Reflect using my responses to personalize my experience
                </span>
                <p className="text-sm text-muted-foreground">
                  We'll use your answers to customize your habits, journal prompts, and Kind Notes. 
                  Your data stays on your device.
                </p>
              </div>
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  const getEncouragingFeedback = () => {
    if (currentQuestion === 1 && (answers.currentHabits?.length || 0) > 0 && !answers.currentHabits?.includes("None of the above")) {
      return `Great! You're already doing ${answers.currentHabits?.length} healthy habit${(answers.currentHabits?.length || 0) > 1 ? "s" : ""}. Let's build on that! 💪`;
    }
    return null;
  };

  const feedback = getEncouragingFeedback();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="font-semibold text-foreground">Reflect</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {currentQuestion + 1} of {totalQuestions}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {renderQuestion()}
              
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-primary/10 rounded-xl text-primary text-sm"
                >
                  {feedback}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-6 border-t border-border bg-background">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="gap-2"
          >
            {currentQuestion === totalQuestions - 1 ? (
              <>
                Complete
                <Check className="h-4 w-4" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSurvey;
