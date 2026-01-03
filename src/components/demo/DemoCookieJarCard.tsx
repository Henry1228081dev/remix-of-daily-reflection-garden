import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cookie, ShoppingBag, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CookieItem {
  id: string;
  description: string;
  earned_at: string;
  source: string;
}

interface DemoCookieJarCardProps {
  cookies: CookieItem[];
  totalBalance?: number;
  onOpenShop?: () => void;
  ownedItemsCount?: number;
  equippedAvatar?: string | null;
}

// Map avatar IDs to emojis
const avatarEmojis: Record<string, string> = {
  "avatar-zen": "🧘",
  "avatar-nature": "🌿",
  "avatar-cosmic": "🚀",
  "avatar-phoenix": "🔥",
  "avatar-crystal": "💎",
};

const DemoCookieJarCard = ({ 
  cookies, 
  totalBalance,
  onOpenShop,
  ownedItemsCount = 0,
  equippedAvatar
}: DemoCookieJarCardProps) => {
  const displayBalance = totalBalance ?? cookies.length;

  return (
    <Card className="relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5" />
      
      <CardHeader className="pb-3 relative">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Cookie className="w-5 h-5 text-amber-500" />
            Cookie Jar
          </CardTitle>
          <motion.div 
            className="flex items-center gap-2"
            key={displayBalance}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              {displayBalance}
            </span>
            <span className="text-2xl">🍪</span>
          </motion.div>
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-4">
        {/* Equipped Avatar Display */}
        {equippedAvatar && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/10 border border-primary/20">
            <span className="text-2xl">{avatarEmojis[equippedAvatar] || "🧘"}</span>
            <span className="text-sm font-medium text-primary">Avatar Equipped!</span>
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          Your collection of wins and achievements! 🎉
        </p>
        
        {/* Recent cookies */}
        <div className="space-y-2 max-h-32 overflow-y-auto">
          <AnimatePresence>
            {cookies.slice().reverse().slice(0, 5).map((cookie, index) => (
              <motion.div
                key={cookie.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50"
              >
                <span className="text-lg">🍪</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{cookie.description}</p>
                  <p className="text-xs text-muted-foreground capitalize">{cookie.source}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Shop Button */}
        {onOpenShop && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={onOpenShop}
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white font-bold shadow-lg"
              size="lg"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Open Cookie Shop
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}

        {/* Owned items indicator */}
        {ownedItemsCount > 0 && (
          <p className="text-xs text-center text-muted-foreground">
            ✨ You own {ownedItemsCount} item{ownedItemsCount !== 1 ? "s" : ""}!
          </p>
        )}

        {cookies.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <p>Complete tasks to earn cookies!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DemoCookieJarCard;
