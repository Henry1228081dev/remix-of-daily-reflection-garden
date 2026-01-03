import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Cookie, BookOpen, TrendingUp, Award } from "lucide-react";
import { subDays, format } from "date-fns";

const JOURNAL_STORAGE_KEY = "reflect-journal-entries";
const COOKIE_STORAGE_KEY = "reflect-cookie-jar";

interface JournalEntry {
  date: string;
  entry: string;
  prompt?: string;
  mood?: string;
  cookiesEarned?: number;
}

const moodEmojis: Record<string, string> = {
  great: "😀",
  hopeful: "💫",
  good: "🙂",
  okay: "😐",
  low: "😟",
  sad: "😢",
  overwhelmed: "😵‍💫",
};

const WeeklyReflectionSummary = () => {
  const weekData = useMemo(() => {
    const saved = localStorage.getItem(JOURNAL_STORAGE_KEY);
    const entries: JournalEntry[] = saved ? JSON.parse(saved) : [];
    
    const cookiesSaved = localStorage.getItem(COOKIE_STORAGE_KEY);
    const totalCookies = cookiesSaved ? JSON.parse(cookiesSaved).length : 0;
    
    // Get entries from the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      return date.toDateString();
    });
    
    const weekEntries = entries.filter(e => last7Days.includes(e.date));
    const daysJournaled = weekEntries.length;
    
    // Calculate streak
    let streak = 0;
    for (let i = 0; i < 30; i++) {
      const checkDate = subDays(new Date(), i).toDateString();
      if (entries.some(e => e.date === checkDate)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    // Get mood distribution
    const moodCounts: Record<string, number> = {};
    weekEntries.forEach(e => {
      if (e.mood) {
        moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
      }
    });
    
    const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];
    
    // Count cookies earned this week
    const weekCookies = weekEntries.reduce((sum, e) => sum + (e.cookiesEarned || 0), 0);
    
    // Calculate total sentences written
    const totalSentences = weekEntries.reduce((sum, e) => {
      const sentences = e.entry.split(/[.!?]+/).filter(s => s.trim().split(/\s+/).length >= 4);
      return sum + sentences.length;
    }, 0);
    
    return {
      daysJournaled,
      streak,
      totalCookies,
      weekCookies,
      dominantMood,
      totalSentences,
      weekEntries,
    };
  }, []);

  const getInsight = () => {
    const { daysJournaled, streak, dominantMood } = weekData;
    
    if (daysJournaled === 0) {
      return "Start your reflection journey this week! Every entry is a gift to yourself 🌱";
    }
    
    if (streak >= 7) {
      return "Incredible! A full week of daily reflection. You're building a powerful habit 🏆";
    }
    
    if (streak >= 3) {
      return `${streak} days in a row! Your consistency is inspiring. Keep the momentum going! 💪`;
    }
    
    if (dominantMood) {
      const moodMessages: Record<string, string> = {
        great: "Your week has been filled with great energy! Celebrate these wins 🎉",
        hopeful: "Hope has been your companion this week. That's beautiful to see 💫",
        good: "A good week overall! You're taking care of yourself 💚",
        okay: "You've been showing up even on 'okay' days. That takes courage 🌟",
        low: "Low days are part of the journey. You're still here, still trying 💙",
        sad: "It's been tough, but you're processing your feelings. That's strength 💜",
        overwhelmed: "Feeling overwhelmed is valid. Each journal entry is a release valve 🌊",
      };
      return moodMessages[dominantMood[0]] || "You're doing great! Keep reflecting 🌱";
    }
    
    return `You journaled ${daysJournaled} day${daysJournaled !== 1 ? 's' : ''} this week. Every entry matters 💚`;
  };

  return (
    <Card className="bg-gradient-to-br from-card to-mint/20 shadow-card border-0 animate-fade-in-up">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Weekly Reflection
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card/80 rounded-xl p-3 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs">Days Journaled</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{weekData.daysJournaled}/7</p>
          </div>
          
          <div className="bg-card/80 rounded-xl p-3 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs">Current Streak</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{weekData.streak} 🔥</p>
          </div>
          
          <div className="bg-card/80 rounded-xl p-3 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Cookie className="w-4 h-4" />
              <span className="text-xs">Total Cookies</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{weekData.totalCookies} 🍪</p>
          </div>
          
          <div className="bg-card/80 rounded-xl p-3 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Award className="w-4 h-4" />
              <span className="text-xs">Sentences</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{weekData.totalSentences}</p>
          </div>
        </div>
        
        {/* Dominant Mood */}
        {weekData.dominantMood && (
          <div className="bg-accent/30 rounded-lg p-3 flex items-center gap-3">
            <span className="text-2xl">{moodEmojis[weekData.dominantMood[0]]}</span>
            <div>
              <p className="text-sm font-medium text-foreground">
                Most common mood: {weekData.dominantMood[0]}
              </p>
              <p className="text-xs text-muted-foreground">
                {weekData.dominantMood[1]} day{weekData.dominantMood[1] !== 1 ? 's' : ''} this week
              </p>
            </div>
          </div>
        )}
        
        {/* Encouraging Insight */}
        <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
          <p className="text-sm text-foreground font-medium leading-relaxed">
            💭 {getInsight()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyReflectionSummary;
