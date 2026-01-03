import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Eye, Users, Scale, Heart } from "lucide-react";

const PerspectiveSwap = () => {
  const navigate = useNavigate();
  const [situation, setSituation] = useState("");
  const [perspectives, setPerspectives] = useState<{
    yours: string;
    theirs: string;
    neutral: string;
    nextStep: string;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePerspectives = () => {
    if (!situation.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate generating perspectives (in a real app, this could use AI)
    setTimeout(() => {
      setPerspectives({
        yours: "It's natural to feel this way. Your feelings are valid based on your experience and expectations. Consider what need isn't being met right now.",
        theirs: "They might be dealing with their own challenges you're not aware of. Perhaps they're overwhelmed, distracted, or simply didn't realize the impact of their actions.",
        neutral: "From outside, this seems like a communication gap or misunderstanding. Neither party may have intended harm. It might help to pause before assuming the worst.",
        nextStep: "Consider reaching out with curiosity rather than judgment. A simple 'Hey, is everything okay?' can open doors. Remember: you can only control your response, not others' actions.",
      });
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Reflect
        </Button>

        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Perspective Swap 🔄
          </h1>
          <p className="text-muted-foreground">
            Describe something that happened, and we'll show you different ways to look at it.
          </p>
        </div>

        {/* Input section */}
        <Card className="bg-card shadow-card border-0 mb-8 animate-fade-in-up">
          <CardContent className="pt-6 space-y-4">
            <Textarea
              placeholder="Example: My friend didn't reply to my message and now I feel ignored..."
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              className="min-h-[120px] bg-secondary/50 border-sage-light/30 focus:border-primary resize-none"
            />
            <div className="flex justify-center">
              <Button
                variant="wellness"
                size="lg"
                onClick={generatePerspectives}
                disabled={!situation.trim() || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-pulse-soft" />
                    Generating perspectives...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    See perspectives
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Perspectives output */}
        {perspectives && (
          <div className="space-y-4">
            {/* Your perspective */}
            <Card className="bg-gradient-to-br from-sage-light to-mint shadow-card border-0 animate-fade-in-up stagger-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-sage-dark flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Your perspective
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{perspectives.yours}</p>
              </CardContent>
            </Card>

            {/* Their perspective */}
            <Card className="bg-gradient-to-br from-lavender to-sticky-pink shadow-card border-0 animate-fade-in-up stagger-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Their possible perspective
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{perspectives.theirs}</p>
              </CardContent>
            </Card>

            {/* Neutral observer */}
            <Card className="bg-gradient-to-br from-sticky-blue to-secondary shadow-card border-0 animate-fade-in-up stagger-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Scale className="w-5 h-5" />
                  Neutral observer view
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{perspectives.neutral}</p>
              </CardContent>
            </Card>

            {/* Gentle next step */}
            <Card className="bg-gradient-to-br from-accent to-cream-warm shadow-card border-0 animate-fade-in-up stagger-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-accent-foreground flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Gentle next step
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{perspectives.nextStep}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Safety note */}
        <footer className="text-center py-8 animate-fade-in">
          <p className="text-sm text-muted-foreground">
            ⚠️ This tool is for reflection and self-awareness — not diagnosis or therapy. 💚
          </p>
        </footer>
      </div>
    </div>
  );
};

export default PerspectiveSwap;
