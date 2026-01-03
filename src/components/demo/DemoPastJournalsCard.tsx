import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ChevronRight } from "lucide-react";
import { format, subDays } from "date-fns";

const mockJournals = [
  {
    id: "1",
    date: format(subDays(new Date(), 1), "yyyy-MM-dd"),
    entry: "Today I practiced gratitude and noticed how much better I felt throughout the day...",
    mood: "good"
  },
  {
    id: "2",
    date: format(subDays(new Date(), 2), "yyyy-MM-dd"),
    entry: "Had a challenging morning but used my breathing techniques to stay calm...",
    mood: "okay"
  },
  {
    id: "3",
    date: format(subDays(new Date(), 4), "yyyy-MM-dd"),
    entry: "Celebrated a small win today - finished reading that book I've been putting off!",
    mood: "great"
  },
];

const moodEmojis: Record<string, string> = {
  great: "😊",
  good: "🙂",
  okay: "😐",
  low: "😔",
  sad: "😢",
};

const DemoPastJournalsCard = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="w-5 h-5 text-primary" />
          Past Reflections
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockJournals.map(journal => (
          <div 
            key={journal.id}
            className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">
                {format(new Date(journal.date), "EEEE, MMM d")}
              </span>
              <div className="flex items-center gap-2">
                <span>{moodEmojis[journal.mood] || "😐"}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {journal.entry}
            </p>
          </div>
        ))}

        <p className="text-xs text-center text-muted-foreground pt-2">
          Sign up to save your reflections permanently
        </p>
      </CardContent>
    </Card>
  );
};

export default DemoPastJournalsCard;
