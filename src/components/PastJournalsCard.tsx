import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useJournalEntries } from "@/hooks/useJournalEntries";

const moodEmojis: Record<string, string> = {
  great: "😀",
  good: "🙂",
  okay: "😐",
  low: "😟",
  sad: "😢",
  overwhelmed: "😵‍💫",
  hopeful: "💫",
};

const PastJournalsCard = () => {
  const { entries, isLoading } = useJournalEntries();

  const formatDate = (dateString: string, timestamp?: string) => {
    try {
      if (timestamp) {
        const date = new Date(timestamp);
        return format(date, "MMMM d, yyyy 'at' h:mm a");
      }
      const date = new Date(dateString);
      return format(date, "MMMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-card shadow-card border-0 animate-fade-in-up stagger-5">
        <CardContent className="p-6 text-center text-muted-foreground">
          Loading journal entries...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card shadow-card border-0 animate-fade-in-up stagger-5">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Past journal entries
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          A look back at your reflections, one day at a time.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {entries.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground italic">
              You haven't written any journal entries yet. Your story starts today 🌱
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {entries.slice(0, 5).map((entry, index) => (
              <div 
                key={entry.id} 
                className="bg-secondary/50 rounded-lg p-3 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-2 text-sm text-sage-dark mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">{formatDate(entry.date, entry.created_at)}</span>
                  {entry.mood && (
                    <span className="ml-auto text-lg" title={`Mood: ${entry.mood}`}>
                      {moodEmojis[entry.mood] || entry.mood}
                    </span>
                  )}
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {entry.entry}
                </p>
                {entry.prompt && (
                  <p className="text-xs text-muted-foreground italic mt-2">
                    💭 {entry.prompt}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PastJournalsCard;
