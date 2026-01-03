import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Crown, Palette, Award, Zap, MousePointer, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShopItemCard, { ShopItem } from "./ShopItemCard";

interface DemoCookieShopProps {
  isOpen: boolean;
  onClose: () => void;
  cookieBalance: number;
  onPurchase: (item: ShopItem) => void;
  ownedItems: string[];
  equippedAvatar: string | null;
  equippedTheme: string | null;
  equippedCursor: string | null;
  onEquip: (itemId: string | null, type: "avatar" | "theme" | "cursor") => void;
  onResetTheme?: () => void;
}

const SHOP_ITEMS: ShopItem[] = [
  // Avatars
  { id: "avatar-zen", name: "Zen Master", price: 15, category: "avatar", rarity: "rare", emoji: "🧘", description: "A peaceful meditating figure with calming aura", gradient: "from-primary/60 to-mint" },
  { id: "avatar-nature", name: "Nature Spirit", price: 20, category: "avatar", rarity: "rare", emoji: "🌿", description: "One with the forest, wrapped in leaves", gradient: "from-sage to-mint" },
  { id: "avatar-cosmic", name: "Cosmic Explorer", price: 30, category: "avatar", rarity: "epic", emoji: "🚀", description: "Traverse the galaxy with cosmic wisdom", gradient: "from-lavender to-primary/50" },
  { id: "avatar-phoenix", name: "Golden Phoenix", price: 45, category: "avatar", rarity: "legendary", emoji: "🔥", description: "Rise from the ashes, reborn in gold", gradient: "from-terracotta to-accent" },
  { id: "avatar-crystal", name: "Crystal Guardian", price: 50, category: "avatar", rarity: "legendary", emoji: "💎", description: "Rare crystalline being of pure energy", gradient: "from-mint to-primary" },
  
  // Themes
  { id: "theme-sunset", name: "Sunset Vibes", price: 12, category: "theme", rarity: "common", emoji: "🌅", description: "Warm orange and pink tones", gradient: "from-terracotta to-sticky-pink" },
  { id: "theme-ocean", name: "Ocean Calm", price: 15, category: "theme", rarity: "rare", emoji: "🌊", description: "Deep blue tranquility", gradient: "from-sticky-blue to-primary/40" },
  { id: "theme-forest", name: "Forest Dream", price: 18, category: "theme", rarity: "rare", emoji: "🌲", description: "Deep greens of nature", gradient: "from-sage-dark to-sage" },
  { id: "theme-midnight", name: "Midnight Mode", price: 20, category: "theme", rarity: "epic", emoji: "🌙", description: "Premium dark aesthetic", gradient: "from-foreground/80 to-lavender" },
  { id: "theme-aurora", name: "Aurora Borealis", price: 35, category: "theme", rarity: "legendary", emoji: "✨", description: "Dancing northern lights", gradient: "from-sage via-sticky-blue to-lavender" },
  
  // Badges
  { id: "badge-star", name: "Rising Star", price: 5, category: "badge", rarity: "common", emoji: "⭐", description: "You're on your way up!", gradient: "from-sticky-yellow to-terracotta" },
  { id: "badge-mindful", name: "Mindful Master", price: 10, category: "badge", rarity: "rare", emoji: "🧠", description: "Peak mental clarity achieved", gradient: "from-lavender to-primary/60" },
  { id: "badge-flame", name: "Streak Flame", price: 15, category: "badge", rarity: "rare", emoji: "🔥", description: "Your streak is on fire!", gradient: "from-terracotta to-destructive/60" },
  { id: "badge-diamond", name: "Diamond Focus", price: 25, category: "badge", rarity: "epic", emoji: "💠", description: "Unbreakable concentration", gradient: "from-mint to-primary" },
  { id: "badge-crown", name: "Legendary Crown", price: 40, category: "badge", rarity: "legendary", emoji: "👑", description: "Rule your mental kingdom", gradient: "from-sticky-yellow to-terracotta" },
  
  // Effects
  { id: "effect-sparkle", name: "Sparkle Trail", price: 8, category: "effect", rarity: "common", emoji: "✨", description: "Leave sparkles wherever you go", gradient: "from-sticky-pink to-lavender" },
  { id: "effect-confetti", name: "Party Confetti", price: 10, category: "effect", rarity: "rare", emoji: "🎊", description: "Extra confetti on celebrations", gradient: "from-sticky-pink to-sticky-yellow" },
  { id: "effect-rainbow", name: "Rainbow Pop", price: 12, category: "effect", rarity: "rare", emoji: "🌈", description: "Rainbow effects on actions", gradient: "from-terracotta via-sticky-yellow to-primary" },
  { id: "effect-fireworks", name: "Fireworks Show", price: 20, category: "effect", rarity: "epic", emoji: "🎆", description: "Epic fireworks celebrations", gradient: "from-lavender to-sticky-pink" },
  
  // Cursors
  { id: "cursor-wand", name: "Magic Wand", price: 10, category: "cursor", rarity: "common", emoji: "🪄", description: "Wave your magic cursor", gradient: "from-lavender to-primary" },
  { id: "cursor-star", name: "Star Trail", price: 15, category: "cursor", rarity: "rare", emoji: "⭐", description: "Leave a trail of stars behind your cursor", gradient: "from-sticky-yellow to-terracotta" },
  { id: "cursor-heart", name: "Heart Pointer", price: 18, category: "cursor", rarity: "rare", emoji: "💖", description: "Spread love with every click", gradient: "from-sticky-pink to-terracotta" },
  { id: "cursor-pet-cat", name: "Cursor Pet: Cat", price: 25, category: "cursor", rarity: "epic", emoji: "🐱", description: "A cute cat follows your cursor around", gradient: "from-terracotta to-accent" },
  { id: "cursor-pet-dog", name: "Cursor Pet: Dog", price: 25, category: "cursor", rarity: "epic", emoji: "🐕", description: "A loyal pup that chases your cursor", gradient: "from-sage to-mint" },
  { id: "cursor-halo", name: "Golden Halo", price: 30, category: "cursor", rarity: "epic", emoji: "😇", description: "A glowing halo surrounds your cursor", gradient: "from-sticky-yellow to-cream-warm" },
  { id: "cursor-galaxy", name: "Galaxy Cursor", price: 40, category: "cursor", rarity: "legendary", emoji: "🌌", description: "The cosmos follows your every move", gradient: "from-lavender via-sticky-blue to-primary" },
];

const categories = [
  { id: "avatar", label: "Avatars", icon: Crown },
  { id: "theme", label: "Themes", icon: Palette },
  { id: "cursor", label: "Cursors", icon: MousePointer },
  { id: "badge", label: "Badges", icon: Award },
  { id: "effect", label: "Effects", icon: Zap },
];

const DemoCookieShop = ({ 
  isOpen, 
  onClose, 
  cookieBalance, 
  onPurchase, 
  ownedItems,
  equippedAvatar,
  equippedTheme,
  equippedCursor,
  onEquip,
  onResetTheme
}: DemoCookieShopProps) => {
  const [activeCategory, setActiveCategory] = useState("avatar");

  const filteredItems = SHOP_ITEMS.filter(item => item.category === activeCategory);
  
  // Check if user has any owned themes
  const ownedThemes = ownedItems.filter(id => id.startsWith("theme-"));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Shop Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-card via-secondary/50 to-card rounded-2xl border border-primary/30 shadow-2xl overflow-hidden"
          >
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-primary/30 rounded-full"
                  initial={{ 
                    x: Math.random() * 100 + "%", 
                    y: Math.random() * 100 + "%",
                    scale: Math.random() * 0.5 + 0.5
                  }}
                  animate={{ 
                    y: [null, "-100%"],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>

            {/* Header */}
            <div className="relative p-6 border-b border-primary/20 bg-gradient-to-r from-primary/10 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-8 h-8 text-primary" />
                  </motion.div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-sage-dark to-primary bg-clip-text text-transparent">
                    COOKIE SHOP
                  </h2>
                </div>
                
                {/* Cookie Balance */}
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="flex items-center gap-2 bg-gradient-to-r from-accent to-cream-warm px-4 py-2 rounded-full border border-terracotta/30"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-2xl">🍪</span>
                    <span className="text-xl font-bold text-foreground">{cookieBalance}</span>
                  </motion.div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-muted-foreground hover:text-foreground hover:bg-primary/10"
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>
              </div>

              {/* Category Tabs */}
              <div className="flex gap-2 mt-6">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      activeCategory === cat.id
                        ? "bg-primary/20 text-primary border border-primary/40"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <cat.icon className="w-4 h-4" />
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Items Grid */}
            <div className="p-6 overflow-y-auto max-h-[60vh] bg-gradient-to-b from-transparent to-secondary/30">
              {/* Theme Reset Button - only show in themes tab when user has themes */}
              {activeCategory === "theme" && ownedThemes.length > 0 && equippedTheme && (
                <div className="mb-4 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={onResetTheme}
                    className="gap-2 border-primary/30 hover:border-primary"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset to Default Theme
                  </Button>
                </div>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredItems.map(item => (
                  <ShopItemCard
                    key={item.id}
                    item={item}
                    isOwned={ownedItems.includes(item.id)}
                    isEquipped={equippedAvatar === item.id || equippedTheme === item.id || equippedCursor === item.id}
                    canAfford={cookieBalance >= item.price}
                    onPurchase={() => onPurchase(item)}
                    onEquip={() => onEquip(item.id, item.category as "avatar" | "theme" | "cursor")}
                  />
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-primary/20 bg-secondary/50">
              <p className="text-center text-muted-foreground text-sm">
                Earn more cookies by journaling, completing habits, and tracking your mood! 🍪
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DemoCookieShop;
