import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, ChevronLeft, ChevronRight, Calendar, BookOpen, Target } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar } from "recharts";

const mockMoodData = [
  { date: "Mon", value: 4, mood: "good" },
  { date: "Tue", value: 5, mood: "great" },
  { date: "Wed", value: 3, mood: "okay" },
  { date: "Thu", value: 4, mood: "good" },
  { date: "Fri", value: 2, mood: "low" },
  { date: "Sat", value: 4, mood: "good" },
  { date: "Sun", value: 5, mood: "great" },
];

const mockCheckInData = [
  { date: "Mon", completed: true },
  { date: "Tue", completed: true },
  { date: "Wed", completed: false },
  { date: "Thu", completed: true },
  { date: "Fri", completed: true },
  { date: "Sat", completed: false },
  { date: "Sun", completed: true },
];

const mockJournalData = [
  { date: "Mon", entries: 2 },
  { date: "Tue", entries: 1 },
  { date: "Wed", entries: 0 },
  { date: "Thu", entries: 3 },
  { date: "Fri", entries: 1 },
  { date: "Sat", entries: 0 },
  { date: "Sun", entries: 2 },
];

const VIEWS = [
  { id: "mood", label: "Mood Trends", icon: TrendingUp },
  { id: "checkins", label: "Daily Check-ins", icon: Calendar },
  { id: "journal", label: "Journal Activity", icon: BookOpen },
];

const DemoMoodChart = () => {
  const [currentViewIndex, setCurrentViewIndex] = useState(0);

  const goNext = () => {
    setCurrentViewIndex((prev) => (prev + 1) % VIEWS.length);
  };

  const goPrev = () => {
    setCurrentViewIndex((prev) => (prev - 1 + VIEWS.length) % VIEWS.length);
  };

  const currentView = VIEWS[currentViewIndex];
  const CurrentIcon = currentView.icon;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CurrentIcon className="w-5 h-5 text-primary" />
            {currentView.label}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={goPrev}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs text-muted-foreground min-w-[3rem] text-center">
              {currentViewIndex + 1}/{VIEWS.length}
            </span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={goNext}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          {currentView.id === "mood" && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockMoodData}>
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis domain={[1, 5]} hide />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-popover border rounded-lg px-3 py-2 shadow-lg">
                          <p className="text-sm font-medium capitalize">{data.mood}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#moodGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {currentView.id === "checkins" && (
            <div className="h-full flex flex-col justify-center">
              <div className="grid grid-cols-7 gap-2">
                {mockCheckInData.map((day) => (
                  <div key={day.date} className="flex flex-col items-center gap-1">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                        day.completed
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {day.completed ? "✓" : "–"}
                    </div>
                    <span className="text-xs text-muted-foreground">{day.date}</span>
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">
                5 of 7 days checked in this week
              </p>
            </div>
          )}

          {currentView.id === "journal" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockJournalData}>
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis hide />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-popover border rounded-lg px-3 py-2 shadow-lg">
                          <p className="text-sm font-medium">{data.entries} entries</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="entries"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        <p className="text-xs text-center text-muted-foreground mt-2">
          {currentView.id === "mood" && "Your mood over the past week"}
          {currentView.id === "checkins" && "Daily check-in streak"}
          {currentView.id === "journal" && "Journal entries this week"}
        </p>
      </CardContent>
    </Card>
  );
};

export default DemoMoodChart;
