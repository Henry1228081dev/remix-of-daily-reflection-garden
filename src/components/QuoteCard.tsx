import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Quote, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const quotes = [
  "You don't have to do everything today. One kind step for yourself is enough.",
  "You are allowed to be both a work in progress and proud of yourself at the same time.",
  "Little progress is still progress.",
  "Be gentle with yourself. You're doing the best you can.",
  "Your feelings are valid, and so is taking time to process them.",
  "Rest is not a reward. It's a necessity.",
  "You've survived 100% of your worst days so far.",
  "Healing isn't linear. It's okay to have setbacks.",
];

const QuoteCard = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const getNewQuote = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
      setIsAnimating(false);
    }, 200);
  };

  useEffect(() => {
    // Random quote on mount
    setCurrentQuote(Math.floor(Math.random() * quotes.length));
  }, []);

  return (
    <Card className="bg-gradient-to-br from-mint to-sage-light shadow-card border-0 animate-fade-in-up stagger-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-sage-dark flex items-center gap-2">
          <Quote className="w-5 h-5" />
          Quote of the day
        </CardTitle>
      </CardHeader>
      <CardContent>
        <blockquote 
          className={`text-foreground text-lg leading-relaxed italic transition-opacity duration-200 ${
            isAnimating ? 'opacity-0' : 'opacity-100'
          }`}
        >
          "{quotes[currentQuote]}"
        </blockquote>
        <div className="mt-4 flex justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={getNewQuote}
            className="text-sage-dark hover:text-primary"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            New quote
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteCard;
