import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Lock, Flame, Cookie, Target, Calendar, Star, Trophy, Zap, Crown } from "lucide-react";
import { toast } from "sonner";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  requirement: number;
  type: "streak" | "cookies" | "habits" | "steps" | "perfectDays" | "journal";
  rarity: "common" | "rare" | "epic" | "legendary";
  emoji: string;
}

const ACHIEVEMENTS: Achievement[] = [
  // Streak achievements
  { id: "streak-3", name: "Getting Started", description: "Maintain a 3-day streak", icon: Flame, requirement: 3, type: "streak", rarity: "common", emoji: "🔥" },
  { id: "streak-7", name: "Week Warrior", description: "Maintain a 7-day streak", icon: Flame, requirement: 7, type: "streak", rarity: "rare", emoji: "⚡" },
  { id: "streak-14", name: "Fortnight Fighter", description: "Maintain a 14-day streak", icon: Flame, requirement: 14, type: "streak", rarity: "epic", emoji: "💪" },
  { id: "streak-30", name: "Monthly Master", description: "Maintain a 30-day streak", icon: Flame, requirement: 30, type: "streak", rarity: "legendary", emoji: "👑" },
  
  // Cookie achievements
  { id: "cookies-10", name: "Cookie Collector", description: "Earn 10 cookies", icon: Cookie, requirement: 10, type: "cookies", rarity: "common", emoji: "🍪" },
  { id: "cookies-25", name: "Cookie Jar", description: "Earn 25 cookies", icon: Cookie, requirement: 25, type: "cookies", rarity: "rare", emoji: "🏺" },
  { id: "cookies-50", name: "Cookie Monster", description: "Earn 50 cookies", icon: Cookie, requirement: 50, type: "cookies", rarity: "epic", emoji: "🦖" },
  { id: "cookies-100", name: "Cookie Tycoon", description: "Earn 100 cookies", icon: Cookie, requirement: 100, type: "cookies", rarity: "legendary", emoji: "💰" },
  
  // Habit achievements
  { id: "habits-5", name: "Habit Starter", description: "Complete 5 habits", icon: Target, requirement: 5, type: "habits", rarity: "common", emoji: "🎯" },
  { id: "habits-25", name: "Habit Builder", description: "Complete 25 habits", icon: Target, requirement: 25, type: "habits", rarity: "rare", emoji: "🏗️" },
  { id: "habits-50", name: "Habit Hero", description: "Complete 50 habits", icon: Target, requirement: 50, type: "habits", rarity: "epic", emoji: "🦸" },
  
  // Perfect day achievements
  { id: "perfect-1", name: "Perfect Start", description: "Complete your first perfect day", icon: Star, requirement: 1, type: "perfectDays", rarity: "common", emoji: "⭐" },
  { id: "perfect-5", name: "Perfect Week", description: "Complete 5 perfect days", icon: Star, requirement: 5, type: "perfectDays", rarity: "rare", emoji: "🌟" },
  { id: "perfect-10", name: "Perfectionist", description: "Complete 10 perfect days", icon: Trophy, requirement: 10, type: "perfectDays", rarity: "epic", emoji: "🏆" },
  
  // Special achievements
  { id: "first-journal", name: "Dear Diary", description: "Write your first journal entry", icon: Calendar, requirement: 1, type: "journal", rarity: "common", emoji: "📔" },
  { id: "journal-7", name: "Storyteller", description: "Write 7 journal entries", icon: Calendar, requirement: 7, type: "journal", rarity: "rare", emoji: "📚" },
];

const RARITY_COLORS = {
  common: "from-secondary to-muted",
  rare: "from-sticky-blue to-primary/50",
  epic: "from-lavender to-sticky-pink",
  legendary: "from-sticky-yellow via-terracotta to-accent",
};

const RARITY_BORDER = {
  common: "border-muted-foreground/30",
  rare: "border-primary/50",
  epic: "border-lavender",
  legendary: "border-sticky-yellow",
};

interface AchievementBadgesProps {
  stats: {
    currentStreak: number;
    totalCookies: number;
    habitsCompleted: number;
    perfectDays: number;
    journalEntries: number;
  };
  onAchievementUnlock?: (achievement: Achievement) => void;
}

const AchievementBadges = ({ stats, onAchievementUnlock }: AchievementBadgesProps) => {
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement | null>(null);

  const checkAchievements = useMemo(() => {
    const unlocked = new Set<string>();
    
    ACHIEVEMENTS.forEach(achievement => {
      let value = 0;
      switch (achievement.type) {
        case "streak": value = stats.currentStreak; break;
        case "cookies": value = stats.totalCookies; break;
        case "habits": value = stats.habitsCompleted; break;
        case "perfectDays": value = stats.perfectDays; break;
        case "journal": value = stats.journalEntries; break;
      }
      
      if (value >= achievement.requirement) {
        unlocked.add(achievement.id);
      }
    });
    
    return unlocked;
  }, [stats]);

  // Check for newly unlocked achievements
  useEffect(() => {
    const newUnlocks = [...checkAchievements].filter(id => !unlockedIds.has(id));
    
    if (newUnlocks.length > 0) {
      const newAchievement = ACHIEVEMENTS.find(a => a.id === newUnlocks[0]);
      if (newAchievement) {
        setNewlyUnlocked(newAchievement);
        onAchievementUnlock?.(newAchievement);
        toast.success(
          <div className="flex items-center gap-2">
            <span className="text-2xl">{newAchievement.emoji}</span>
            <div>
              <p className="font-semibold">Achievement Unlocked!</p>
              <p className="text-sm text-muted-foreground">{newAchievement.name}</p>
            </div>
          </div>
        );
        
        // Hide popup after 3 seconds
        setTimeout(() => setNewlyUnlocked(null), 3000);
      }
      setUnlockedIds(checkAchievements);
    }
  }, [checkAchievements, unlockedIds, onAchievementUnlock]);

  const unlockedCount = checkAchievements.size;
  const totalCount = ACHIEVEMENTS.length;

  return (
    <>
      <Card className="bg-card shadow-card border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Achievements
            </div>
            <span className="text-sm font-normal text-muted-foreground">
              {unlockedCount}/{totalCount}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2">
            {ACHIEVEMENTS.slice(0, 8).map(achievement => {
              const isUnlocked = checkAchievements.has(achievement.id);
              const Icon = achievement.icon;
              
              return (
                <motion.div
                  key={achievement.id}
                  whileHover={{ scale: 1.05 }}
                  className={`relative aspect-square rounded-lg border-2 flex flex-col items-center justify-center p-2 cursor-pointer transition-all ${
                    isUnlocked
                      ? `bg-gradient-to-br ${RARITY_COLORS[achievement.rarity]} ${RARITY_BORDER[achievement.rarity]}`
                      : "bg-secondary/50 border-muted opacity-50"
                  }`}
                  title={`${achievement.name}: ${achievement.description}`}
                >
                  {isUnlocked ? (
                    <>
                      <span className="text-xl mb-1">{achievement.emoji}</span>
                      <span className="text-[10px] text-center font-medium line-clamp-1">
                        {achievement.name.split(" ")[0]}
                      </span>
                    </>
                  ) : (
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  )}
                  
                  {/* Rarity indicator */}
                  {isUnlocked && achievement.rarity !== "common" && (
                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                      achievement.rarity === "rare" ? "bg-primary" :
                      achievement.rarity === "epic" ? "bg-lavender" :
                      "bg-sticky-yellow"
                    }`} />
                  )}
                </motion.div>
              );
            })}
          </div>
          
          <p className="text-xs text-center text-muted-foreground mt-3">
            Keep going to unlock more badges! 🏆
          </p>
        </CardContent>
      </Card>

      {/* Achievement Unlock Popup */}
      <AnimatePresence>
        {newlyUnlocked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50"
          >
            <div className={`bg-gradient-to-r ${RARITY_COLORS[newlyUnlocked.rarity]} p-4 rounded-xl shadow-2xl border-2 ${RARITY_BORDER[newlyUnlocked.rarity]}`}>
              <div className="flex items-center gap-3">
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                  className="text-4xl"
                >
                  {newlyUnlocked.emoji}
                </motion.span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-foreground/70">Achievement Unlocked!</p>
                  <p className="font-bold text-foreground">{newlyUnlocked.name}</p>
                  <p className="text-sm text-foreground/80">{newlyUnlocked.description}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AchievementBadges;
