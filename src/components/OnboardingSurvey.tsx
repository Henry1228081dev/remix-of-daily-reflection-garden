import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import BadHabitsOnboarding from "./BadHabitsOnboarding";
import { useBadHabits } from "@/hooks/useBadHabits";
import { useAuth } from "@/hooks/useAuth";

interface BadHabitSelection {
  habitName: string;
  replacement: string;
}

interface UserProfile {
  intent: string[];
  habitToBuild: string;
  dailyHabits: string[];
  tinySteps: string[];
  stepPreference: string;
  obstacles: string[];
  reflectionStyle: string;
  badHabits: BadHabitSelection[];
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

const DAILY_HABIT_SUGGESTIONS = [
  "🧘 Morning meditation",
  "📖 Read for 15 minutes",
  "💧 Drink 8 glasses of water",
  "🚶 Take a 10-minute walk",
  "📓 Write in journal",
  "🍎 Eat a healthy breakfast",
  "😴 Go to bed by 10pm",
  "🧹 Tidy space for 5 minutes",
];

const OnboardingSurvey = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addBadHabit } = useBadHabits();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [newHabit, setNewHabit] = useState("");
  const [newStep, setNewStep] = useState("");
  const [answers, setAnswers] = useState<Partial<UserProfile>>({
    intent: [],
    habitToBuild: "",
    dailyHabits: [],
    tinySteps: [],
    stepPreference: "",
    obstacles: [],
    reflectionStyle: "",
    badHabits: [],
    consentGiven: false,
  });

  const totalQuestions = 9; // Added bad habits step
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const canProceed = (): boolean => {
    switch (currentQuestion) {
      case 0:
        return (answers.intent?.length || 0) > 0;
      case 1:
        return (answers.habitToBuild?.length || 0) >= 5 && (answers.habitToBuild?.length || 0) <= 100;
      case 2:
        return (answers.dailyHabits?.length || 0) >= 1;
      case 3:
        return (answers.tinySteps?.length || 0) >= 1;
      case 4:
        return !!answers.stepPreference;
      case 5:
        return (answers.obstacles?.length || 0) > 0 && (answers.obstacles?.length || 0) <= 2;
      case 6:
        return !!answers.reflectionStyle;
      case 7:
        return true; // Bad habits step - can skip
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

  const completeSurvey = async () => {
    const profile: UserProfile = {
      intent: answers.intent || [],
      habitToBuild: answers.habitToBuild || "",
      dailyHabits: answers.dailyHabits || [],
      tinySteps: answers.tinySteps || [],
      stepPreference: answers.stepPreference || "",
      obstacles: answers.obstacles || [],
      reflectionStyle: answers.reflectionStyle || "",
      badHabits: answers.badHabits || [],
      consentGiven: answers.consentGiven || false,
      completedAt: new Date().toISOString(),
    };

    // Save bad habits to database if user is logged in
    if (user && answers.badHabits && answers.badHabits.length > 0) {
      for (const habit of answers.badHabits) {
        try {
          await addBadHabit.mutateAsync({
            habitName: habit.habitName,
            replacementHabit: habit.replacement,
          });
        } catch (error) {
          console.error("Failed to save bad habit:", error);
        }
      }
    }

    localStorage.setItem("userProfile", JSON.stringify(profile));
    localStorage.setItem("surveyCompleted", "true");

    toast({
      title: "Welcome to Reflect! 🌱",
      description: "Your personalized experience is ready. Let's get started on your journey.",
    });

    navigate("/");
  };

  const handleBadHabitsComplete = (habits: BadHabitSelection[]) => {
    setAnswers((prev) => ({ ...prev, badHabits: habits }));
    setCurrentQuestion((prev) => prev + 1);
  };

  const handleBadHabitsSkip = () => {
    setCurrentQuestion((prev) => prev + 1);
  };

  const addCustomHabit = () => {
    if (newHabit.trim() && !answers.dailyHabits?.includes(newHabit.trim())) {
      setAnswers(prev => ({
        ...prev,
        dailyHabits: [...(prev.dailyHabits || []), newHabit.trim()]
      }));
      setNewHabit("");
    }
  };

  const removeHabit = (habit: string) => {
    setAnswers(prev => ({
      ...prev,
      dailyHabits: (prev.dailyHabits || []).filter(h => h !== habit)
    }));
  };

  const addCustomStep = () => {
    if (newStep.trim() && !answers.tinySteps?.includes(newStep.trim())) {
      setAnswers(prev => ({
        ...prev,
        tinySteps: [...(prev.tinySteps || []), newStep.trim()]
      }));
      setNewStep("");
    }
  };

  const removeStep = (step: string) => {
    setAnswers(prev => ({
      ...prev,
      tinySteps: (prev.tinySteps || []).filter(s => s !== step)
    }));
  };

  const toggleArrayItem = (key: "intent" | "obstacles", item: string, maxItems?: number) => {
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

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">What daily habits do you want to build?</h2>
            <p className="text-muted-foreground">Pick from suggestions or add your own — we'll track these for you</p>
            
            {/* Selected habits */}
            {(answers.dailyHabits?.length || 0) > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {answers.dailyHabits?.map((habit) => (
                  <motion.span
                    key={habit}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center gap-2 bg-primary/20 text-primary px-3 py-1.5 rounded-full text-sm font-medium"
                  >
                    {habit}
                    <button
                      onClick={() => removeHabit(habit)}
                      className="hover:bg-primary/30 rounded-full p-0.5"
                    >
                      ✕
                    </button>
                  </motion.span>
                ))}
              </div>
            )}

            {/* Suggestions */}
            <div className="space-y-2 pt-2">
              <p className="text-sm font-medium text-muted-foreground">Suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {DAILY_HABIT_SUGGESTIONS.filter(h => !answers.dailyHabits?.includes(h)).map((habit) => (
                  <motion.button
                    key={habit}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setAnswers(prev => ({
                      ...prev,
                      dailyHabits: [...(prev.dailyHabits || []), habit]
                    }))}
                    className="px-3 py-1.5 rounded-full border border-border hover:border-primary/50 hover:bg-primary/10 text-sm transition-all"
                  >
                    {habit}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Custom input */}
            <div className="flex gap-2 pt-2">
              <Input
                placeholder="Add your own habit..."
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomHabit()}
                className="flex-1"
              />
              <Button onClick={addCustomHabit} variant="outline" disabled={!newHabit.trim()}>
                Add
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {answers.dailyHabits?.length || 0} habit{(answers.dailyHabits?.length || 0) !== 1 ? 's' : ''} selected
            </p>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">What tiny steps do you want to take today?</h2>
            <p className="text-muted-foreground">Break your goals into small, achievable actions for today</p>
            
            {/* Selected steps */}
            {(answers.tinySteps?.length || 0) > 0 && (
              <div className="space-y-2 pt-2">
                {answers.tinySteps?.map((step, index) => (
                  <motion.div
                    key={step}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex items-center gap-3 bg-secondary/50 p-3 rounded-lg"
                  >
                    <span className="w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="flex-1 text-foreground">{step}</span>
                    <button
                      onClick={() => removeStep(step)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      ✕
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Add step input */}
            <div className="flex gap-2 pt-2">
              <Input
                placeholder="e.g., Drink a glass of water, Take a 5-minute walk..."
                value={newStep}
                onChange={(e) => setNewStep(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomStep()}
                className="flex-1"
              />
              <Button onClick={addCustomStep} variant="outline" disabled={!newStep.trim()}>
                Add
              </Button>
            </div>

            <p className="text-sm text-muted-foreground italic">
              💡 Tip: Keep steps small enough to complete in 5-15 minutes
            </p>
          </div>
        );

      case 4:
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

      case 7:
        return (
          <BadHabitsOnboarding
            onComplete={handleBadHabitsComplete}
            onSkip={handleBadHabitsSkip}
          />
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
