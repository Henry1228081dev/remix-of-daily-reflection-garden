import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from "recharts";
import { TrendingUp, Calendar } from "lucide-react";
import { format, subDays, startOfWeek, eachDayOfInterval } from "date-fns";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const moodLabels: Record<number, string> = {
  6: "Great",
  5: "Hopeful",
  4: "Good",
  3: "Okay",
  2: "Low",
  1: "Sad",
  0: "Overwhelmed",
};

const EnhancedMoodChart = () => {
  const [view, setView] = useState<"week" | "month">("week");

  const chartData = useMemo(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const entries: JournalEntry[] = saved ? JSON.parse(saved) : [];
    
    const days = view === "week" ? 7 : 30;
    
    const data = Array.from({ length: days }, (_, i) => {
      const date = subDays(new Date(), days - 1 - i);
      const dateString = date.toDateString();
      const entry = entries.find(e => e.date === dateString);
      
      return {
        day: format(date, view === "week" ? "EEE" : "MMM d"),
        date: dateString,
        fullDate: format(date, "MMM d, yyyy"),
        mood: entry?.mood || null,
        value: entry?.mood ? moodValues[entry.mood] : null,
        emoji: entry?.mood ? moodEmojis[entry.mood] : null,
      };
    });
    
    return data;
  }, [view]);

  const hasAnyMood = chartData.some(d => d.value !== null);
  
  // Calculate trend
  const trend = useMemo(() => {
    const moodsWithValues = chartData.filter(d => d.value !== null);
    if (moodsWithValues.length < 2) return null;
    
    const firstHalf = moodsWithValues.slice(0, Math.floor(moodsWithValues.length / 2));
    const secondHalf = moodsWithValues.slice(Math.floor(moodsWithValues.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, d) => sum + (d.value || 0), 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, d) => sum + (d.value || 0), 0) / secondHalf.length;
    
    const diff = secondAvg - firstAvg;
    if (diff > 0.5) return "improving";
    if (diff < -0.5) return "declining";
    return "stable";
  }, [chartData]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length && payload[0].payload.mood) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-2 shadow-lg">
          <p className="text-xs text-muted-foreground">{data.fullDate}</p>
          <p className="text-sm font-medium flex items-center gap-1">
            {data.emoji} {data.mood}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-card shadow-card border-0 animate-fade-in-up">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Mood Patterns
          </CardTitle>
          
          <Tabs value={view} onValueChange={(v) => setView(v as "week" | "month")} className="h-8">
            <TabsList className="h-8 p-1">
              <TabsTrigger value="week" className="text-xs h-6 px-2">This Week</TabsTrigger>
              <TabsTrigger value="month" className="text-xs h-6 px-2">This Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {trend && (
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            {trend === "improving" && "📈 Your mood is trending upward!"}
            {trend === "declining" && "📉 Hang in there, brighter days ahead"}
            {trend === "stable" && "📊 Your mood has been steady"}
          </p>
        )}
      </CardHeader>
      
      <CardContent>
        {!hasAnyMood ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground italic">
              No mood data yet. Start checking in to see your patterns 🌱
            </p>
          </div>
        ) : (
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  interval={view === "month" ? 4 : 0}
                />
                <YAxis 
                  hide 
                  domain={[0, 6]} 
                  tickFormatter={(value) => moodLabels[value] || ""}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#moodGradient)"
                  connectNulls
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    if (payload.value === null) return null;
                    return (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={4}
                        fill="hsl(var(--primary))"
                        stroke="hsl(var(--card))"
                        strokeWidth={2}
                      />
                    );
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {/* Mood Legend */}
        {hasAnyMood && (
          <div className="flex flex-wrap justify-center gap-2 mt-4 text-xs">
            {Object.entries(moodEmojis).map(([mood, emoji]) => (
              <span key={mood} className="flex items-center gap-1 text-muted-foreground">
                {emoji} {mood}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedMoodChart;
