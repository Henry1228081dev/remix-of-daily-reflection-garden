import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ReflectionPrompts from "@/components/ReflectionPrompts";
import QuoteCard from "@/components/QuoteCard";
import TinyStepsCard from "@/components/TinyStepsCard";
import CookieJarCard from "@/components/CookieJarCard";
import PastJournalsCard from "@/components/PastJournalsCard";
import KindNotesCard from "@/components/KindNotesCard";
import MoodTracker from "@/components/MoodTracker";
import MoodChart from "@/components/MoodChart";
import CheckInJournal from "@/components/CheckInJournal";
import PerspectiveSwapButton from "@/components/PerspectiveSwapButton";
import SafetyNote from "@/components/SafetyNote";

const Index = () => {
  const [showReflection, setShowReflection] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [journalKey, setJournalKey] = useState(0);

  const handleJournalSave = () => {
    setJournalKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <Header />
        
        <HeroSection onStartCheckIn={() => setShowReflection(true)} />
        
        {showReflection && (
          <div className="py-6 space-y-6">
            <MoodTracker onMoodSelect={setSelectedMood} />
            <ReflectionPrompts isVisible={showReflection} />
            <CheckInJournal selectedMood={selectedMood} onSave={handleJournalSave} />
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
            <TinyStepsCard />
            <MoodChart key={journalKey} />
            <PastJournalsCard key={`journal-${journalKey}`} />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <CookieJarCard />
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
