import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, RefreshCw } from "lucide-react";

const kindNotes = [
  "You're doing better than you think. Every small step counts. 💚",
  "It's okay to rest. You can't pour from an empty cup. ☕",
  "Your feelings are valid. Take the time you need. 🌱",
  "You've overcome challenges before. You'll do it again. 💪",
  "Progress isn't always linear. Be gentle with yourself. 🌸",
  "You bring something unique to this world. Don't forget that. ✨",
];

const DemoKindNotesCard = () => {
  const [currentNote, setCurrentNote] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const getNewNote = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentNote((prev) => (prev + 1) % kindNotes.length);
      setIsAnimating(false);
    }, 200);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Heart className="w-5 h-5 text-primary" />
          Kind Note
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          className={`p-4 rounded-lg bg-primary/5 border border-primary/10 min-h-[80px] flex items-center justify-center transition-opacity duration-200 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
        >
          <p className="text-center text-foreground italic">
            "{kindNotes[currentNote]}"
          </p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={getNewNote}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Get another note
        </Button>
      </CardContent>
    </Card>
  );
};

export default DemoKindNotesCard;
