import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, TrendingUp, Award, BookOpen } from "lucide-react";

const DemoWeeklyReflection = () => {
  const stats = [
    { icon: CalendarDays, label: "Check-ins", value: "5/7" },
    { icon: TrendingUp, label: "Mood Avg", value: "Good" },
    { icon: Award, label: "Cookies", value: "12" },
    { icon: BookOpen, label: "Entries", value: "4" },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Weekly Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div 
              key={stat.label}
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-lg font-semibold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-sm text-muted-foreground text-center mt-4">
          Great progress this week! Keep it up 🌟
        </p>
      </CardContent>
    </Card>
  );
};

export default DemoWeeklyReflection;
