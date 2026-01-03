import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Cookie, X } from "lucide-react";

const STORAGE_KEY = "reflect-cookie-jar";

const CookieJarCard = () => {
  const [cookies, setCookies] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [newCookie, setNewCookie] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cookies));
  }, [cookies]);

  const addCookie = () => {
    if (newCookie.trim()) {
      setCookies([...cookies, newCookie.trim()]);
      setNewCookie("");
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
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <Cookie className="w-6 h-6 text-terracotta" />
          <span>Cookies stored: {cookies.length}</span>
        </div>

        <p className="text-sm text-muted-foreground">
          Add your achievements — big or small — so on tough days you can remember what you've already done.
        </p>

        {cookies.length > 0 && (
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {cookies.map((cookie, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 bg-card/50 rounded-lg px-3 py-2 group"
              >
                <span className="text-sm flex-1">{cookie}</span>
                <button 
                  onClick={() => removeCookie(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Input
            placeholder="I'm proud that I..."
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
          Kindness to yourself is worth celebrating. 💚
        </p>
      </CardContent>
    </Card>
  );
};

export default CookieJarCard;
