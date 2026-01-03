import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  category: "avatar" | "theme" | "badge" | "effect";
  rarity: "common" | "rare" | "epic" | "legendary";
  emoji: string;
  description: string;
  gradient: string;
}

interface ShopItemCardProps {
  item: ShopItem;
  isOwned: boolean;
  isEquipped: boolean;
  canAfford: boolean;
  onPurchase: () => void;
  onEquip: () => void;
}

const rarityStyles = {
  common: {
    border: "border-muted-foreground/30",
    glow: "",
    badge: "bg-muted text-muted-foreground",
    label: "COMMON"
  },
  rare: {
    border: "border-primary/50",
    glow: "shadow-[0_0_20px_hsl(var(--primary)/0.3)]",
    badge: "bg-primary/20 text-primary",
    label: "RARE"
  },
  epic: {
    border: "border-lavender/70",
    glow: "shadow-[0_0_25px_hsl(var(--lavender)/0.5)]",
    badge: "bg-lavender/30 text-foreground",
    label: "EPIC"
  },
  legendary: {
    border: "border-terracotta/70",
    glow: "shadow-[0_0_30px_hsl(var(--terracotta)/0.5)]",
    badge: "bg-gradient-to-r from-terracotta/30 to-accent/50 text-foreground",
    label: "LEGENDARY"
  }
};

const ShopItemCard = ({ 
  item, 
  isOwned, 
  isEquipped, 
  canAfford, 
  onPurchase,
  onEquip
}: ShopItemCardProps) => {
  const rarity = rarityStyles[item.rarity];

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`relative rounded-xl overflow-hidden ${rarity.border} ${rarity.glow} border-2 bg-gradient-to-br from-card to-secondary/50 backdrop-blur`}
    >
      {/* Legendary shimmer effect */}
      {item.rarity === "legendary" && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-terracotta/20 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        />
      )}

      {/* Rarity Badge */}
      <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold ${rarity.badge}`}>
        {rarity.label}
      </div>

      {/* Owned Badge */}
      {isOwned && (
        <div className="absolute top-2 right-2 bg-primary/20 text-primary px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
          <Check className="w-3 h-3" />
          OWNED
        </div>
      )}

      {/* Item Display */}
      <div className={`h-24 flex items-center justify-center bg-gradient-to-br ${item.gradient} relative`}>
        <motion.span 
          className="text-5xl drop-shadow-lg"
          animate={item.rarity === "legendary" ? { 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {item.emoji}
        </motion.span>
        
        {/* Equipped indicator */}
        {isEquipped && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-bold">
            EQUIPPED
          </div>
        )}
      </div>

      {/* Item Info */}
      <div className="p-3">
        <h3 className="font-bold text-foreground text-sm truncate">{item.name}</h3>
        <p className="text-muted-foreground text-xs mt-1 line-clamp-2 h-8">{item.description}</p>
        
        {/* Action Button */}
        <div className="mt-3">
          {isOwned ? (
            (item.category === "avatar" || item.category === "theme") && !isEquipped ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onEquip}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-primary to-sage-dark text-primary-foreground font-bold text-sm"
              >
                EQUIP
              </motion.button>
            ) : (
              <div className="w-full py-2 rounded-lg bg-muted text-muted-foreground font-bold text-sm text-center">
                {isEquipped ? "EQUIPPED ✓" : "OWNED ✓"}
              </div>
            )
          ) : canAfford ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPurchase}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-terracotta to-accent text-foreground font-bold text-sm flex items-center justify-center gap-2"
            >
              <span>BUY</span>
              <span className="flex items-center gap-1">
                {item.price} 🍪
              </span>
            </motion.button>
          ) : (
            <div className="w-full py-2 rounded-lg bg-destructive/20 text-destructive font-bold text-sm text-center flex items-center justify-center gap-2">
              <Lock className="w-3 h-3" />
              {item.price} 🍪
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ShopItemCard;
