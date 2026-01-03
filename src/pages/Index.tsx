import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ReflectionPrompts from "@/components/ReflectionPrompts";
import QuoteCard from "@/components/QuoteCard";
import TinyStepsCard from "@/components/TinyStepsCard";
import HabitTrackerCard from "@/components/HabitTrackerCard";
import CookieJarCard, { CookieJarCardRef } from "@/components/CookieJarCard";
import PastJournalsCard from "@/components/PastJournalsCard";
import KindNotesCard from "@/components/KindNotesCard";
import MoodTracker from "@/components/MoodTracker";
import EnhancedMoodChart from "@/components/EnhancedMoodChart";
import EnhancedCheckInJournal from "@/components/EnhancedCheckInJournal";
import WeeklyReflectionSummary from "@/components/WeeklyReflectionSummary";
import PerspectiveSwapButton from "@/components/PerspectiveSwapButton";
import SafetyNote from "@/components/SafetyNote";
import MoodNotificationSettings from "@/components/MoodNotificationSettings";
import { useMoodNotifications } from "@/hooks/useMoodNotifications";
import { useMoodEntries } from "@/hooks/useMoodEntries";

const Index = () => {
  const [showReflection, setShowReflection] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [journalKey, setJournalKey] = useState(0);
  const [cookieCount, setCookieCount] = useState(0);
  const cookieJarRef = useRef<CookieJarCardRef>(null);

  // Initialize mood notifications
  const { upsertMood } = useMoodEntries();
  useMoodNotifications((mood) => upsertMood.mutate(mood));

  const handleJournalSave = () => {
    setJournalKey(prev => prev + 1);
  };

  const handleCookieUpdate = (count: number) => {
    setCookieCount(count);
    cookieJarRef.current?.refresh();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <Header />
        
        <HeroSection onStartCheckIn={() => setShowReflection(true)} />
        
        {showReflection && (
          <div className="py-6 space-y-6">
            <MoodTracker onMoodSelect={setSelectedMood} />
            <ReflectionPrompts isVisible={showReflection} onClose={() => setShowReflection(false)} />
            <EnhancedCheckInJournal 
              selectedMood={selectedMood} 
              onSave={handleJournalSave}
              onCookieUpdate={handleCookieUpdate}
              onClose={() => setShowReflection(false)}
            />
          </div>
        )}

        {/* Quote of the day - center wide card */}
        <div className="py-6">
          <div className="max-w-2xl mx-auto">
            <QuoteCard />
          </div>
        </div>

        {/* Two column layout for cards */}
        <div className="grid md:grid-cols-2 gap-6 py-6">
          {/* Left column */}
          <div className="space-y-6">
            <WeeklyReflectionSummary key={`weekly-${journalKey}`} />
            <EnhancedMoodChart key={`mood-${journalKey}`} />
            <PastJournalsCard key={`journal-${journalKey}`} />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <HabitTrackerCard onCookieEarned={(count) => {
              setCookieCount(count);
              cookieJarRef.current?.refresh();
            }} />
            <TinyStepsCard onCookieEarned={(count) => {
              setCookieCount(count);
              cookieJarRef.current?.refresh();
            }} />
            <CookieJarCard ref={cookieJarRef} externalCount={cookieCount} />
            <MoodNotificationSettings />
            <KindNotesCard />
          </div>
        </div>

        <PerspectiveSwapButton />
        
        <SafetyNote />
      </div>
    </div>
  );
};

export default Index;
