import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp } from "lucide-react";
import { format, subDays } from "date-fns";

const STORAGE_KEY = "reflect-journal-entries";

interface JournalEntry {
  date: string;
  entry: string;
  prompt?: string;
  mood?: string;
}

const moodValues: Record<string, number> = {
  great: 6,
  hopeful: 5,
  good: 4,
  okay: 3,
  low: 2,
  sad: 1,
  overwhelmed: 0,
};

const moodEmojis: Record<string, string> = {
  great: "😀",
  hopeful: "💫",
  good: "🙂",
  okay: "😐",
  low: "😟",
  sad: "😢",
  overwhelmed: "😵‍💫",
};

const moodColors: Record<string, string> = {
  great: "hsl(var(--primary))",
  hopeful: "hsl(142, 40%, 55%)",
  good: "hsl(142, 35%, 60%)",
  okay: "hsl(40, 50%, 60%)",
  low: "hsl(30, 50%, 55%)",
  sad: "hsl(20, 45%, 50%)",
  overwhelmed: "hsl(10, 40%, 50%)",
};

const MoodChart = () => {
  const chartData = useMemo(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const entries: JournalEntry[] = saved ? JSON.parse(saved) : [];
    
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dateString = date.toDateString();
      const entry = entries.find(e => e.date === dateString);
      
      return {
        day: format(date, "EEE"),
        date: dateString,
        mood: entry?.mood || null,
        value: entry?.mood ? moodValues[entry.mood] : null,
        emoji: entry?.mood ? moodEmojis[entry.mood] : null,
        color: entry?.mood ? moodColors[entry.mood] : "hsl(var(--muted))",
      };
    });
    
    return last7Days;
  }, []);

  const hasAnyMood = chartData.some(d => d.value !== null);

  return (
    <Card className="bg-card shadow-card border-0 animate-fade-in-up stagger-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Mood this week
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          A gentle look at how you've been feeling.
        </p>
      </CardHeader>
      <CardContent>
        {!hasAnyMood ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground italic">
              No mood data yet — start checking in to see your patterns 🌱
            </p>
          </div>
        ) : (
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis hide domain={[0, 6]} />
                <Bar 
                  dataKey="value" 
                  radius={[8, 8, 0, 0]}
                  maxBarSize={40}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.value !== null ? entry.color : 'hsl(var(--muted))'}
                      opacity={entry.value !== null ? 1 : 0.3}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {hasAnyMood && (
          <div className="flex justify-center gap-3 mt-2 flex-wrap">
            {chartData.filter(d => d.emoji).slice(-3).map((d, i) => (
              <span key={i} className="text-xs text-muted-foreground">
                {d.day}: {d.emoji}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodChart;
