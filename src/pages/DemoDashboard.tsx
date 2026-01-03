import { useState, useEffect } from "react";
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
import DemoCookieShop from "@/components/demo/DemoCookieShop";
import PerspectiveSwapButton from "@/components/PerspectiveSwapButton";
import SafetyNote from "@/components/SafetyNote";
import { useConfetti } from "@/hooks/useConfetti";
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

const DemoDashboard = () => {
  const [showReflection, setShowReflection] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(true);
  const [showShop, setShowShop] = useState(false);
  
  // Start with 50 cookies for demo - enough to buy stuff!
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
  
  // For every 5 cookies, add 5 more to get to 50 total
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
  const [spentCookies, setSpentCookies] = useState(0);

  const availableBalance = cookieBalance - spentCookies;

  const { celebrateMilestone, celebratePurchase } = useConfetti();

  const handleAddCookie = (description: string, source: string) => {
    const newCookie = {
      id: Date.now().toString(),
      description,
      earned_at: new Date().toISOString(),
      source
    };
    setCookies(prev => [...prev, newCookie]);
    
    // Check for milestone celebrations
    const newCount = cookies.length + 1;
    celebrateMilestone(newCount);
    
    if (newCount === 1) {
      toast.success("🍪 Your first cookie! Keep it up!");
    } else if (newCount === 5) {
      toast.success("🎉 5 cookies! You're on a roll!");
    } else if (newCount === 10) {
      toast.success("🔥 10 cookies! Amazing progress!");
    }
  };

  const handlePurchase = (item: ShopItem) => {
    if (availableBalance >= item.price) {
      setSpentCookies(prev => prev + item.price);
      setOwnedItems(prev => [...prev, item.id]);
      celebratePurchase();
      toast.success(`🎁 Purchased ${item.name}!`);
      
      // Auto-equip if it's the first avatar/theme
      if (item.category === "avatar" && !equippedAvatar) {
        setEquippedAvatar(item.id);
      }
      if (item.category === "theme" && !equippedTheme) {
        setEquippedTheme(item.id);
      }
    }
  };

  const handleEquip = (itemId: string, type: "avatar" | "theme") => {
    if (type === "avatar") {
      setEquippedAvatar(itemId);
      toast.success("Avatar equipped!");
    } else {
      setEquippedTheme(itemId);
      toast.success("Theme applied! 🎨");
    }
  };

  // Apply theme class to document when equipped theme changes
  useEffect(() => {
    // Remove all theme classes first
    Object.values(THEME_CLASS_MAP).forEach(cls => {
      document.documentElement.classList.remove(cls);
    });
    
    // Apply new theme if one is equipped
    if (equippedTheme) {
      const themeClass = THEME_CLASS_MAP[equippedTheme];
      if (themeClass) {
        document.documentElement.classList.add(themeClass);
      }
    }
    
    // Cleanup on unmount - remove theme classes
    return () => {
      Object.values(THEME_CLASS_MAP).forEach(cls => {
        document.documentElement.classList.remove(cls);
      });
    };
  }, [equippedTheme]);

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
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 bg-amber-500/20 px-3 py-1 rounded-full">
                <span className="text-lg">🍪</span>
                <span className="font-bold text-amber-700 dark:text-amber-300">{availableBalance}</span>
              </div>
              <button 
                onClick={() => setShowBanner(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
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
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button size="sm" className="rounded-full">
                Sign Up Free
              </Button>
            </Link>
          </div>
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
            <DemoCookieJarCard 
              cookies={allCookies.slice(0, 10)} 
              totalBalance={availableBalance}
              onOpenShop={() => setShowShop(true)}
              ownedItemsCount={ownedItems.length}
              equippedAvatar={equippedAvatar}
            />
            <DemoKindNotesCard />
          </div>
        </div>

        <PerspectiveSwapButton />
        
        <SafetyNote />
      </div>

      {/* Cookie Shop Modal */}
      <DemoCookieShop
        isOpen={showShop}
        onClose={() => setShowShop(false)}
        cookieBalance={availableBalance}
        onPurchase={handlePurchase}
        ownedItems={ownedItems}
        equippedAvatar={equippedAvatar}
        equippedTheme={equippedTheme}
        onEquip={handleEquip}
      />
    </div>
  );
};

export default DemoDashboard;
