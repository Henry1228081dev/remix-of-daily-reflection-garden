import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

const notes = [
  {
    text: "You've made it through every tough day so far. That's pretty amazing.",
    color: "bg-sticky-yellow",
    rotation: "rotate-slight-left",
  },
  {
    text: "Future you is proud of you for trying.",
    color: "bg-sticky-pink",
    rotation: "rotate-slight-right",
  },
  {
    text: "Resting isn't failing. It's recharging.",
    color: "bg-sticky-blue",
    rotation: "rotate-slight-more",
  },
];

const KindNotesCard = () => {
  return (
    <Card className="bg-card shadow-card border-0 animate-fade-in-up stagger-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Heart className="w-5 h-5 text-terracotta" />
          Kind notes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {notes.map((note, index) => (
            <div
              key={index}
              className={`${note.color} ${note.rotation} p-4 rounded-lg shadow-sticky transition-all duration-300 hover:scale-[1.02] hover:shadow-card cursor-default`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <p className="text-sm text-foreground font-medium leading-relaxed">
                💌 {note.text}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default KindNotesCard;
