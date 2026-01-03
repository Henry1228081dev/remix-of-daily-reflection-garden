import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Info, X, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
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
import DemoCookieShop from "@/components/demo/DemoCookieShop";
import DemoPerspectiveSwap from "@/components/demo/DemoPerspectiveSwap";
import CursorEffects from "@/components/demo/CursorEffects";
import PerfectDayCelebration from "@/components/demo/PerfectDayCelebration";
import AchievementBadges from "@/components/demo/AchievementBadges";
import StreakProtection from "@/components/demo/StreakProtection";
import LofiPlayer from "@/components/demo/LofiPlayer";
import SafetyNote from "@/components/SafetyNote";
import { useConfetti } from "@/hooks/useConfetti";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useDemoNotifications } from "@/hooks/useDemoNotifications";
import { ShopItem } from "@/components/demo/ShopItemCard";
import { toast } from "sonner";

// Theme ID to CSS class mapping
const THEME_CLASS_MAP: Record<string, string> = {
  "theme-sunset": "theme-sunset",
  "theme-ocean": "theme-ocean",
  "theme-forest": "theme-forest",
  "theme-midnight": "theme-midnight",
  "theme-aurora": "theme-aurora",
};

// View states for navigation
type ViewState = "perspective" | "checkin" | "dashboard";

const DemoDashboard = () => {
  // Navigation state - start with dashboard
  const [currentView, setCurrentView] = useState<ViewState>("dashboard");
  const [viewHistory, setViewHistory] = useState<ViewState[]>(["dashboard"]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(true);
  const [showShop, setShowShop] = useState(false);
  const [checkInComplete, setCheckInComplete] = useState(false);
  
  // Track completed habits and steps for streak
  const [completedHabits, setCompletedHabits] = useState<Record<string, boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [totalHabits, setTotalHabits] = useState(3);
  const [totalSteps, setTotalSteps] = useState(3);
  
  // Achievement tracking
  const [habitsCompletedTotal, setHabitsCompletedTotal] = useState(5);
  const [perfectDaysCount, setPerfectDaysCount] = useState(2);
  const [journalEntriesCount, setJournalEntriesCount] = useState(3);
  const [showPerfectDayCelebration, setShowPerfectDayCelebration] = useState(false);
  const [hasCelebratedToday, setHasCelebratedToday] = useState(false);
  
  // Streak protection demo state
  const [currentStreak, setCurrentStreak] = useState(5);
  const [missedDay, setMissedDay] = useState(true);
  const [streakProtected, setStreakProtected] = useState(false);
  
  // Cookie state
  const [cookies, setCookies] = useState([
    { id: "1", description: "Completed morning meditation", earned_at: new Date().toISOString(), source: "habit" },
    { id: "2", description: "Wrote in journal", earned_at: new Date().toISOString(), source: "journal" },
    { id: "3", description: "Took a mindful walk", earned_at: new Date().toISOString(), source: "step" },
    { id: "4", description: "7-day streak bonus!", earned_at: new Date().toISOString(), source: "bonus" },
    { id: "5", description: "Weekly reflection completed", earned_at: new Date().toISOString(), source: "journal" },
    { id: "6", description: "Tracked mood for 5 days", earned_at: new Date().toISOString(), source: "mood" },
    { id: "7", description: "First habit completed", earned_at: new Date().toISOString(), source: "habit" },
    { id: "8", description: "Gratitude entry", earned_at: new Date().toISOString(), source: "journal" },
    { id: "9", description: "Evening wind-down", earned_at: new Date().toISOString(), source: "habit" },
    { id: "10", description: "Perfect day bonus!", earned_at: new Date().toISOString(), source: "bonus" },
  ]);
  
  const [bonusCookies] = useState(() => 
    Array.from({ length: 40 }, (_, i) => ({
      id: `bonus-${i + 11}`,
      description: `Achievement ${i + 1}`,
      earned_at: new Date().toISOString(),
      source: "bonus"
    }))
  );

  const allCookies = [...cookies, ...bonusCookies];
  const cookieBalance = allCookies.length;

  // Shop state
  const [ownedItems, setOwnedItems] = useState<string[]>([]);
  const [equippedAvatar, setEquippedAvatar] = useState<string | null>(null);
  const [equippedTheme, setEquippedTheme] = useState<string | null>(null);
  const [equippedCursor, setEquippedCursor] = useState<string | null>(null);
  const [spentCookies, setSpentCookies] = useState(0);

  const availableBalance = cookieBalance - spentCookies;

  const { celebrateMilestone, celebratePurchase, celebrate } = useConfetti();
  const { playCookieEarned, playPurchase, playEquip, playClick, playSuccess } = useSoundEffects();

  useDemoNotifications({
    onMoodSelect: (mood) => {
      setSelectedMood(mood);
      playSuccess();
    },
    enabled: currentView === "dashboard",
  });

  // Navigation functions
  const navigateTo = (view: ViewState) => {
    const newHistory = [...viewHistory.slice(0, historyIndex + 1), view];
    setViewHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentView(view);
    playClick();
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentView(viewHistory[newIndex]);
      playClick();
    }
  };

  const goForward = () => {
    if (historyIndex < viewHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentView(viewHistory[newIndex]);
      playClick();
    }
  };

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < viewHistory.length - 1;

  // Check for perfect day
  const isPerfectDay = useMemo(() => {
    if (totalHabits === 0 && totalSteps === 0) return false;
    const habitsComplete = totalHabits > 0 && Object.values(completedHabits).filter(Boolean).length >= totalHabits;
    const stepsComplete = totalSteps > 0 && Object.values(completedSteps).filter(Boolean).length >= totalSteps;
    return habitsComplete && stepsComplete;
  }, [completedHabits, completedSteps, totalHabits, totalSteps]);

  useEffect(() => {
    if (isPerfectDay && !hasCelebratedToday) {
      setShowPerfectDayCelebration(true);
      setHasCelebratedToday(true);
      setPerfectDaysCount(prev => prev + 1);
      setTimeout(() => {
        handleAddCookie("🏆 Perfect Day Achievement!", "bonus");
      }, 500);
    }
  }, [isPerfectDay, hasCelebratedToday]);

  const handleAddCookie = (description: string, source: string) => {
    const newCookie = {
      id: Date.now().toString(),
      description,
      earned_at: new Date().toISOString(),
      source
    };
    setCookies(prev => [...prev, newCookie]);
    playCookieEarned();
    const newCount = cookies.length + 1;
    celebrateMilestone(newCount);
    
    if (newCount === 1) toast.success("🍪 Your first cookie! Keep it up!");
    else if (newCount === 5) toast.success("🎉 5 cookies! You're on a roll!");
    else if (newCount === 10) toast.success("🔥 10 cookies! Amazing progress!");
  };

  const handlePurchase = (item: ShopItem) => {
    if (availableBalance >= item.price) {
      setSpentCookies(prev => prev + item.price);
      setOwnedItems(prev => [...prev, item.id]);
      celebratePurchase();
      playPurchase();
      toast.success(`🎁 Purchased ${item.name}!`);
      
      if (item.category === "avatar" && !equippedAvatar) setEquippedAvatar(item.id);
      if (item.category === "theme" && !equippedTheme) setEquippedTheme(item.id);
      if (item.category === "cursor" && !equippedCursor) setEquippedCursor(item.id);
    }
  };

  const handleEquip = (itemId: string | null, type: "avatar" | "theme" | "cursor") => {
    playEquip();
    if (type === "avatar") {
      setEquippedAvatar(itemId);
      toast.success(itemId ? "Avatar equipped!" : "Avatar unequipped!");
    } else if (type === "theme") {
      setEquippedTheme(itemId);
      toast.success(itemId ? "Theme applied! 🎨" : "Theme reset to default! 🌿");
    } else {
      setEquippedCursor(itemId);
      toast.success(itemId ? "Cursor equipped! 🖱️" : "Cursor reset!");
    }
  };

  const handleResetTheme = () => {
    playClick();
    handleEquip(null, "theme");
  };

  const handleStreakProtect = (cost: number) => {
    setSpentCookies(prev => prev + cost);
    setStreakProtected(true);
    setMissedDay(false);
    celebrate("epic");
    playSuccess();
  };

  const handleHabitComplete = (habitId: string, completed: boolean) => {
    playClick();
    setCompletedHabits(prev => ({ ...prev, [habitId]: completed }));
    if (completed) setHabitsCompletedTotal(prev => prev + 1);
  };

  const handleJournalSave = (desc: string) => {
    handleAddCookie(desc, "journal");
    setJournalEntriesCount(prev => prev + 1);
    setCheckInComplete(true);
  };

  const handleStartCheckIn = () => {
    navigateTo("checkin");
  };

  const handleFinishCheckIn = () => {
    navigateTo("dashboard");
  };

  const handleOpenPerspective = () => {
    navigateTo("perspective");
  };

  const handleClosePerspective = () => {
    goBack();
  };

  // Apply theme class
  useEffect(() => {
    Object.values(THEME_CLASS_MAP).forEach(cls => document.documentElement.classList.remove(cls));
    if (equippedTheme) {
      const themeClass = THEME_CLASS_MAP[equippedTheme];
      if (themeClass) document.documentElement.classList.add(themeClass);
    }
    return () => {
      Object.values(THEME_CLASS_MAP).forEach(cls => document.documentElement.classList.remove(cls));
    };
  }, [equippedTheme]);

  const achievementStats = useMemo(() => ({
    currentStreak: streakProtected ? currentStreak : (missedDay ? 0 : currentStreak),
    totalCookies: cookieBalance,
    habitsCompleted: habitsCompletedTotal,
    perfectDays: perfectDaysCount,
    journalEntries: journalEntriesCount,
  }), [currentStreak, streakProtected, missedDay, cookieBalance, habitsCompletedTotal, perfectDaysCount, journalEntriesCount]);

  // Render Perspective Swap (clean, distraction-free view)
  if (currentView === "perspective") {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Minimal Header */}
          <header className="flex items-center justify-between mb-8">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClosePerspective}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
            <span className="text-lg font-semibold text-foreground">🌿 Reflect</span>
            <div className="w-16" /> {/* Spacer for centering */}
          </header>

          {/* Clean Perspective Swap - no distractions */}
          <div className="animate-fade-in">
            <DemoPerspectiveSwap />
          </div>
        </div>
        <CursorEffects equippedCursor={equippedCursor} />
      </div>
    );
  }

  // Render Check-in View (only check-in related content)
  if (currentView === "checkin") {
    return (
      <div className="min-h-screen bg-background">
        <PerfectDayCelebration 
          isActive={showPerfectDayCelebration} 
          onComplete={() => setShowPerfectDayCelebration(false)}
        />

        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={goBack}
                disabled={!canGoBack}
                className={!canGoBack ? "opacity-50" : ""}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={goForward}
                disabled={!canGoForward}
                className={!canGoForward ? "opacity-50" : ""}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
            
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-semibold text-foreground">🌿 Reflect</span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                DEMO
              </span>
            </Link>

            {checkInComplete && (
              <Button onClick={handleFinishCheckIn} className="gap-2">
                View Dashboard
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Check-in Content */}
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">Daily Check-In ✨</h1>
              <p className="text-muted-foreground">Take a moment to reflect on how you're feeling.</p>
            </div>

            <DemoMoodTracker onMoodSelect={(mood) => {
              playClick();
              setSelectedMood(mood);
            }} />
            
            <ReflectionPrompts isVisible={true} />
            
            <DemoCheckInJournal 
              selectedMood={selectedMood} 
              onCookieEarned={handleJournalSave}
            />

            {checkInComplete && (
              <div className="pt-4 text-center">
                <Button onClick={handleFinishCheckIn} size="lg" className="gap-2">
                  Continue to Dashboard
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
        <CursorEffects equippedCursor={equippedCursor} />
      </div>
    );
  }

  // Render Main Dashboard
  return (
    <div className="min-h-screen bg-background">
      <PerfectDayCelebration 
        isActive={showPerfectDayCelebration} 
        onComplete={() => setShowPerfectDayCelebration(false)}
      />

      {showBanner && (
        <div className="bg-primary/10 border-b border-primary/20 px-4 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-primary flex-shrink-0" />
              <p className="text-sm text-foreground">
                <span className="font-medium">Demo Mode:</span> You're exploring Reflect!{" "}
                <Link to="/auth" className="text-primary hover:underline font-medium">
                  Create an account
                </Link>{" "}
                to save your progress.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 bg-amber-500/20 px-3 py-1 rounded-full">
                <span className="text-lg">🍪</span>
                <span className="font-bold text-amber-700 dark:text-amber-300">{availableBalance}</span>
              </div>
              <button 
                onClick={() => { playClick(); setShowBanner(false); }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 pb-8">
        {/* Header with Navigation */}
        <header className="py-4 flex items-center justify-between border-b border-border/50 mb-6">
          <div className="flex items-center gap-4">
            {/* Back/Forward Navigation */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={goBack}
                disabled={!canGoBack}
                className={!canGoBack ? "opacity-50" : ""}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={goForward}
                disabled={!canGoForward}
                className={!canGoForward ? "opacity-50" : ""}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
            
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-semibold text-foreground">🌿 Reflect</span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                DEMO
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <LofiPlayer />
            <Link to="/auth">
              <Button size="sm" className="rounded-full" onClick={playClick}>
                Sign Up Free
              </Button>
            </Link>
          </div>
        </header>

        {/* Streak Protection Alert */}
        {missedDay && !streakProtected && (
          <div className="mb-6">
            <StreakProtection
              currentStreak={currentStreak}
              missedDay={missedDay}
              cookieBalance={availableBalance}
              onProtect={handleStreakProtect}
              protectionCost={10}
            />
          </div>
        )}
        
        <HeroSection onStartCheckIn={handleStartCheckIn} />

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
            <DemoHabitTrackerCard 
              onCookieEarned={(desc) => handleAddCookie(desc, "habit")} 
              onHabitToggle={handleHabitComplete}
              onHabitsChange={(count) => setTotalHabits(count)}
            />
            <DemoTinyStepsCard 
              onCookieEarned={(desc) => handleAddCookie(desc, "step")}
              onStepToggle={(stepId, completed) => {
                playClick();
                setCompletedSteps(prev => ({ ...prev, [stepId]: completed }));
              }}
              onStepsChange={(count) => setTotalSteps(count)}
            />
            <DemoCookieJarCard 
              cookies={allCookies.slice(0, 10)} 
              totalBalance={availableBalance}
              onOpenShop={() => { playClick(); setShowShop(true); }}
              ownedItemsCount={ownedItems.length}
              equippedAvatar={equippedAvatar}
            />
            <DemoKindNotesCard />
          </div>
        </div>

        {/* Perspective Swap Button at bottom */}
        <div className="py-8 max-w-md mx-auto text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={handleOpenPerspective}
            className="group border-2 border-primary/30 hover:border-primary hover:bg-sage-light/50"
          >
            <RefreshCw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
            Get a new perspective on something
          </Button>
        </div>

        {/* Achievements at the end */}
        <div className="py-6 max-w-2xl mx-auto">
          <AchievementBadges 
            stats={achievementStats}
            onAchievementUnlock={(achievement) => {
              celebrate("large");
              handleAddCookie(`🏅 Achievement: ${achievement.name}`, "bonus");
            }}
          />
        </div>
        
        <SafetyNote />
      </div>

      <DemoCookieShop
        isOpen={showShop}
        onClose={() => { playClick(); setShowShop(false); }}
        cookieBalance={availableBalance}
        onPurchase={handlePurchase}
        ownedItems={ownedItems}
        equippedAvatar={equippedAvatar}
        equippedTheme={equippedTheme}
        equippedCursor={equippedCursor}
        onEquip={handleEquip}
        onResetTheme={handleResetTheme}
      />

      <CursorEffects equippedCursor={equippedCursor} />
    </div>
  );
};

export default DemoDashboard;
