import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Crown, Palette, Award, Zap } from "lucide-react";
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
  onEquip: (itemId: string, type: "avatar" | "theme") => void;
}

const SHOP_ITEMS: ShopItem[] = [
  // Avatars
  { id: "avatar-zen", name: "Zen Master", price: 15, category: "avatar", rarity: "rare", emoji: "🧘", description: "A peaceful meditating figure with calming aura", gradient: "from-blue-400 to-cyan-300" },
  { id: "avatar-nature", name: "Nature Spirit", price: 20, category: "avatar", rarity: "rare", emoji: "🌿", description: "One with the forest, wrapped in leaves", gradient: "from-green-400 to-emerald-300" },
  { id: "avatar-cosmic", name: "Cosmic Explorer", price: 30, category: "avatar", rarity: "epic", emoji: "🚀", description: "Traverse the galaxy with cosmic wisdom", gradient: "from-purple-500 to-pink-400" },
  { id: "avatar-phoenix", name: "Golden Phoenix", price: 45, category: "avatar", rarity: "legendary", emoji: "🔥", description: "Rise from the ashes, reborn in gold", gradient: "from-yellow-400 to-orange-500" },
  { id: "avatar-crystal", name: "Crystal Guardian", price: 50, category: "avatar", rarity: "legendary", emoji: "💎", description: "Rare crystalline being of pure energy", gradient: "from-cyan-300 to-blue-500" },
  
  // Themes
  { id: "theme-sunset", name: "Sunset Vibes", price: 12, category: "theme", rarity: "common", emoji: "🌅", description: "Warm orange and pink tones", gradient: "from-orange-400 to-pink-400" },
  { id: "theme-ocean", name: "Ocean Calm", price: 15, category: "theme", rarity: "rare", emoji: "🌊", description: "Deep blue tranquility", gradient: "from-blue-400 to-teal-400" },
  { id: "theme-forest", name: "Forest Dream", price: 18, category: "theme", rarity: "rare", emoji: "🌲", description: "Deep greens of nature", gradient: "from-green-500 to-emerald-400" },
  { id: "theme-midnight", name: "Midnight Mode", price: 20, category: "theme", rarity: "epic", emoji: "🌙", description: "Premium dark aesthetic", gradient: "from-slate-700 to-purple-900" },
  { id: "theme-aurora", name: "Aurora Borealis", price: 35, category: "theme", rarity: "legendary", emoji: "✨", description: "Dancing northern lights", gradient: "from-green-400 via-blue-500 to-purple-500" },
  
  // Badges
  { id: "badge-star", name: "Rising Star", price: 5, category: "badge", rarity: "common", emoji: "⭐", description: "You're on your way up!", gradient: "from-yellow-300 to-amber-400" },
  { id: "badge-mindful", name: "Mindful Master", price: 10, category: "badge", rarity: "rare", emoji: "🧠", description: "Peak mental clarity achieved", gradient: "from-violet-400 to-purple-400" },
  { id: "badge-flame", name: "Streak Flame", price: 15, category: "badge", rarity: "rare", emoji: "🔥", description: "Your streak is on fire!", gradient: "from-orange-500 to-red-500" },
  { id: "badge-diamond", name: "Diamond Focus", price: 25, category: "badge", rarity: "epic", emoji: "💠", description: "Unbreakable concentration", gradient: "from-cyan-300 to-blue-400" },
  { id: "badge-crown", name: "Legendary Crown", price: 40, category: "badge", rarity: "legendary", emoji: "👑", description: "Rule your mental kingdom", gradient: "from-yellow-400 to-amber-500" },
  
  // Effects
  { id: "effect-sparkle", name: "Sparkle Trail", price: 8, category: "effect", rarity: "common", emoji: "✨", description: "Leave sparkles wherever you go", gradient: "from-pink-300 to-purple-300" },
  { id: "effect-confetti", name: "Party Confetti", price: 10, category: "effect", rarity: "rare", emoji: "🎊", description: "Extra confetti on celebrations", gradient: "from-pink-400 to-yellow-400" },
  { id: "effect-rainbow", name: "Rainbow Pop", price: 12, category: "effect", rarity: "rare", emoji: "🌈", description: "Rainbow effects on actions", gradient: "from-red-400 via-yellow-400 to-blue-400" },
  { id: "effect-fireworks", name: "Fireworks Show", price: 20, category: "effect", rarity: "epic", emoji: "🎆", description: "Epic fireworks celebrations", gradient: "from-purple-500 to-pink-500" },
];

const categories = [
  { id: "avatar", label: "Avatars", icon: Crown },
  { id: "theme", label: "Themes", icon: Palette },
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
  onEquip
}: DemoCookieShopProps) => {
  const [activeCategory, setActiveCategory] = useState("avatar");

  const filteredItems = SHOP_ITEMS.filter(item => item.category === activeCategory);

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
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Shop Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 rounded-2xl border border-purple-500/30 shadow-2xl overflow-hidden"
          >
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
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
            <div className="relative p-6 border-b border-purple-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-8 h-8 text-yellow-400" />
                  </motion.div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
                    COOKIE SHOP
                  </h2>
                </div>
                
                {/* Cookie Balance */}
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-4 py-2 rounded-full border border-amber-400/30"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-2xl">🍪</span>
                    <span className="text-xl font-bold text-amber-200">{cookieBalance}</span>
                  </motion.div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-white/70 hover:text-white hover:bg-white/10"
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
                        ? "bg-purple-500/30 text-purple-200 border border-purple-400/50"
                        : "text-white/60 hover:text-white/80 hover:bg-white/5"
                    }`}
                  >
                    <cat.icon className="w-4 h-4" />
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Items Grid */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredItems.map(item => (
                  <ShopItemCard
                    key={item.id}
                    item={item}
                    isOwned={ownedItems.includes(item.id)}
                    isEquipped={equippedAvatar === item.id || equippedTheme === item.id}
                    canAfford={cookieBalance >= item.price}
                    onPurchase={() => onPurchase(item)}
                    onEquip={() => onEquip(item.id, item.category as "avatar" | "theme")}
                  />
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-purple-500/20 bg-black/20">
              <p className="text-center text-white/50 text-sm">
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
