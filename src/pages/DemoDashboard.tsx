import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Info, X } from "lucide-react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ReflectionPrompts from "@/components/ReflectionPrompts";
import QuoteCard from "@/components/QuoteCard";
import DemoTinyStepsCard from "@/components/demo/DemoTinyStepsCard";
import DemoHabitTrackerCard from "@/components/demo/DemoHabitTrackerCard";
import DemoCookieJarCard from "@/components/demo/DemoCookieJarCard";
import DemoPastJournalsCard from "@/components/demo/DemoPastJournalsCard";
import DemoKindNotesCard from "@/components/demo/DemoKindNotesCard";
import DemoMoodTracker from "@/components/demo/DemoMoodTracker";
import DemoMoodChart from "@/components/demo/DemoMoodChart";
import DemoCheckInJournal from "@/components/demo/DemoCheckInJournal";
import DemoWeeklyReflection from "@/components/demo/DemoWeeklyReflection";
import PerspectiveSwapButton from "@/components/PerspectiveSwapButton";
import SafetyNote from "@/components/SafetyNote";

const DemoDashboard = () => {
  const [showReflection, setShowReflection] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(true);
  const [cookies, setCookies] = useState([
    { id: "1", description: "Completed morning meditation", earned_at: new Date().toISOString(), source: "habit" },
    { id: "2", description: "Wrote in journal", earned_at: new Date().toISOString(), source: "journal" },
    { id: "3", description: "Took a mindful walk", earned_at: new Date().toISOString(), source: "step" },
  ]);

  const handleAddCookie = (description: string, source: string) => {
    setCookies(prev => [...prev, {
      id: Date.now().toString(),
      description,
      earned_at: new Date().toISOString(),
      source
    }]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Banner */}
      {showBanner && (
        <div className="bg-primary/10 border-b border-primary/20 px-4 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-primary flex-shrink-0" />
              <p className="text-sm text-foreground">
                <span className="font-medium">Demo Mode:</span> You're exploring Reflect! Changes won't be saved.{" "}
                <Link to="/auth" className="text-primary hover:underline font-medium">
                  Create an account
                </Link>{" "}
                to save your progress.
              </p>
            </div>
            <button 
              onClick={() => setShowBanner(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 pb-8">
        {/* Demo Header */}
        <header className="py-4 flex items-center justify-between border-b border-border/50 mb-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold text-foreground">🌿 Reflect</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              DEMO
            </span>
          </Link>
          <Link to="/auth">
            <Button size="sm" className="rounded-full">
              Sign Up Free
            </Button>
          </Link>
        </header>
        
        <HeroSection onStartCheckIn={() => setShowReflection(true)} />
        
        {showReflection && (
          <div className="py-6 space-y-6">
            <DemoMoodTracker onMoodSelect={setSelectedMood} />
            <ReflectionPrompts isVisible={showReflection} />
            <DemoCheckInJournal 
              selectedMood={selectedMood} 
              onCookieEarned={(desc) => handleAddCookie(desc, "journal")}
            />
          </div>
        )}

        {/* Quote of the day */}
        <div className="py-6">
          <div className="max-w-2xl mx-auto">
            <QuoteCard />
          </div>
        </div>

        {/* Two column layout */}
        <div className="grid md:grid-cols-2 gap-6 py-6">
          <div className="space-y-6">
            <DemoWeeklyReflection />
            <DemoMoodChart />
            <DemoPastJournalsCard />
          </div>

          <div className="space-y-6">
            <DemoHabitTrackerCard onCookieEarned={(desc) => handleAddCookie(desc, "habit")} />
            <DemoTinyStepsCard onCookieEarned={(desc) => handleAddCookie(desc, "step")} />
            <DemoCookieJarCard cookies={cookies} />
            <DemoKindNotesCard />
          </div>
        </div>

        <PerspectiveSwapButton />
        
        <SafetyNote />
      </div>
    </div>
  );
};

export default DemoDashboard;
