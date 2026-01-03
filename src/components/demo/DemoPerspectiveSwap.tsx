import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Users, Scale, Heart, Sparkles, Lock } from "lucide-react";
import { Link } from "react-router-dom";

// Static example - no AI credits used
const STATIC_EXAMPLE = {
  situation: "My friends went to eat without me. They went behind my back, and when I asked them about it, they didn't tell me and ignored me.",
  perspectives: {
    yours: "It's completely understandable to feel hurt and excluded. Being left out, especially without explanation, can feel like a betrayal of trust. Your feelings of disappointment are valid.",
    theirs: "They might have made spontaneous plans without realizing you'd want to join. Perhaps they assumed you were busy, or maybe they're dealing with something and needed space. It's possible they didn't mean to hurt you.",
    neutral: "This looks like a communication breakdown. From outside, it could be an innocent oversight that snowballed - they may now feel awkward bringing it up. Neither side may have intended harm.",
    nextStep: "Consider reaching out calmly: 'Hey, I noticed you went out without me. I felt a bit left out - is everything okay between us?' This opens dialogue without accusations.",
  }
};

const DemoPerspectiveSwap = () => {
  const [showPerspectives, setShowPerspectives] = useState(false);

  const handleShowPerspectives = () => {
    setShowPerspectives(true);
  };

  if (!showPerspectives) {
    return (
      <Card className="bg-card shadow-card border-0 animate-fade-in-up">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Get a Different Perspective
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            See how a situation looks from different angles. This can help you understand others better and find peace.
          </p>
          
          {/* Demo notice */}
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start gap-2">
            <Lock className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-amber-700 dark:text-amber-400">
              <span className="font-medium">Demo Mode:</span> This shows a sample scenario.{" "}
              <Link to="/auth" className="underline hover:no-underline font-medium">
                Sign in
              </Link>{" "}
              to write your own situations.
            </div>
          </div>

          <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
            <p className="text-xs text-muted-foreground mb-1 font-medium">Example scenario:</p>
            <p className="text-sm text-foreground italic">
              "{STATIC_EXAMPLE.situation}"
            </p>
          </div>
          
          <div className="flex justify-center">
            <Button
              variant="wellness"
              onClick={handleShowPerspectives}
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              See Different Perspectives
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Original situation */}
      <Card className="bg-card shadow-card border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Perspective Swap
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground italic">
            "{STATIC_EXAMPLE.situation}"
          </p>
          <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20">
            <p className="text-xs text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <Lock className="w-3 h-3" />
              <span>Demo example only.</span>
              <Link to="/auth" className="underline hover:no-underline font-medium">
                Sign in for custom prompts →
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Your perspective */}
      <Card className="bg-gradient-to-br from-sage-light to-mint shadow-card border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-sage-dark flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Your perspective
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground leading-relaxed">
            {STATIC_EXAMPLE.perspectives.yours}
          </p>
        </CardContent>
      </Card>

      {/* Their perspective */}
      <Card className="bg-gradient-to-br from-lavender to-sticky-pink shadow-card border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Users className="w-4 h-4" />
            Their possible perspective
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground leading-relaxed">
            {STATIC_EXAMPLE.perspectives.theirs}
          </p>
        </CardContent>
      </Card>

      {/* Neutral observer */}
      <Card className="bg-gradient-to-br from-sticky-blue to-secondary shadow-card border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Scale className="w-4 h-4" />
            Neutral observer view
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground leading-relaxed">
            {STATIC_EXAMPLE.perspectives.neutral}
          </p>
        </CardContent>
      </Card>

      {/* Gentle next step */}
      <Card className="bg-gradient-to-br from-accent to-cream-warm shadow-card border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-accent-foreground flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Gentle next step
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground leading-relaxed">
            {STATIC_EXAMPLE.perspectives.nextStep}
          </p>
        </CardContent>
      </Card>

      <p className="text-xs text-center text-muted-foreground">
        ⚠️ This is for reflection, not diagnosis or therapy. 💚
      </p>
    </div>
  );
};

export default DemoPerspectiveSwap;
