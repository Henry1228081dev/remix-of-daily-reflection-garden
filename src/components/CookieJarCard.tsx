import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Cookie, X, Sparkles } from "lucide-react";

const STORAGE_KEY = "reflect-cookie-jar";

export interface CookieJarCardRef {
  refresh: () => void;
}

interface CookieJarCardProps {
  externalCount?: number;
}

const CookieJarCard = forwardRef<CookieJarCardRef, CookieJarCardProps>(({ externalCount }, ref) => {
  const [cookies, setCookies] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [newCookie, setNewCookie] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);
  const [prevCount, setPrevCount] = useState(cookies.length);

  useImperativeHandle(ref, () => ({
    refresh: () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      const newCookies = saved ? JSON.parse(saved) : [];
      if (newCookies.length > cookies.length) {
        setShowAnimation(true);
        setTimeout(() => setShowAnimation(false), 600);
      }
      setCookies(newCookies);
    }
  }));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cookies));
  }, [cookies]);

  // Watch for external count changes (from journaling)
  useEffect(() => {
    if (externalCount !== undefined && externalCount > prevCount) {
      const saved = localStorage.getItem(STORAGE_KEY);
      const newCookies = saved ? JSON.parse(saved) : [];
      setCookies(newCookies);
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 600);
      setPrevCount(externalCount);
    }
  }, [externalCount, prevCount]);

  const addCookie = () => {
    if (newCookie.trim()) {
      setCookies([...cookies, newCookie.trim()]);
      setNewCookie("");
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 600);
    }
  };

  const removeCookie = (index: number) => {
    setCookies(cookies.filter((_, i) => i !== index));
  };

  return (
    <Card className="bg-gradient-to-br from-accent to-cream-warm shadow-card border-0 animate-fade-in-up stagger-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-accent-foreground flex items-center gap-2">
          Cookie jar 🍪
          {showAnimation && (
            <Sparkles className="w-4 h-4 text-terracotta animate-pulse" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className={`flex items-center gap-2 text-2xl font-bold text-foreground transition-transform ${showAnimation ? 'scale-110' : 'scale-100'}`}>
          <Cookie className={`w-6 h-6 text-terracotta ${showAnimation ? 'animate-gentle-bounce' : ''}`} />
          <span>Cookies stored: {cookies.length}</span>
        </div>

        <p className="text-sm text-muted-foreground">
          Cookies are earned by journaling! Each thoughtful sentence = 1 cookie 🍪
        </p>

        {cookies.length > 0 && (
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {cookies.slice(-5).reverse().map((cookie, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 bg-card/50 rounded-lg px-3 py-2 group"
              >
                <span className="text-sm flex-1 truncate">{cookie}</span>
                <button 
                  onClick={() => removeCookie(cookies.length - 1 - index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {cookies.length > 5 && (
              <p className="text-xs text-muted-foreground text-center">
                +{cookies.length - 5} more cookies in your jar
              </p>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Input
            placeholder="Add a custom achievement..."
            value={newCookie}
            onChange={(e) => setNewCookie(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCookie()}
            className="bg-card/50 border-sage-light/30 text-sm"
          />
          <Button 
            variant="gentle" 
            size="icon"
            onClick={addCookie}
            disabled={!newCookie.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-xs text-muted-foreground italic text-center">
          Journal more to earn more cookies! 💚
        </p>
      </CardContent>
    </Card>
  );
});

CookieJarCard.displayName = "CookieJarCard";

export default CookieJarCard;
