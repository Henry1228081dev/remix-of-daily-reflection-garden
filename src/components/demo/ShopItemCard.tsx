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
    border: "border-gray-400/30",
    glow: "",
    badge: "bg-gray-500/20 text-gray-300",
    label: "COMMON"
  },
  rare: {
    border: "border-blue-400/50",
    glow: "shadow-[0_0_20px_rgba(59,130,246,0.3)]",
    badge: "bg-blue-500/20 text-blue-300",
    label: "RARE"
  },
  epic: {
    border: "border-purple-400/50",
    glow: "shadow-[0_0_25px_rgba(168,85,247,0.4)]",
    badge: "bg-purple-500/20 text-purple-300",
    label: "EPIC"
  },
  legendary: {
    border: "border-yellow-400/50",
    glow: "shadow-[0_0_30px_rgba(251,191,36,0.5)]",
    badge: "bg-gradient-to-r from-yellow-500/30 to-orange-500/30 text-yellow-200",
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
      className={`relative rounded-xl overflow-hidden ${rarity.border} ${rarity.glow} border-2 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur`}
    >
      {/* Legendary shimmer effect */}
      {item.rarity === "legendary" && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent"
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
        <div className="absolute top-2 right-2 bg-green-500/20 text-green-300 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
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
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
            EQUIPPED
          </div>
        )}
      </div>

      {/* Item Info */}
      <div className="p-3">
        <h3 className="font-bold text-white text-sm truncate">{item.name}</h3>
        <p className="text-white/50 text-xs mt-1 line-clamp-2 h-8">{item.description}</p>
        
        {/* Action Button */}
        <div className="mt-3">
          {isOwned ? (
            (item.category === "avatar" || item.category === "theme") && !isEquipped ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onEquip}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-sm"
              >
                EQUIP
              </motion.button>
            ) : (
              <div className="w-full py-2 rounded-lg bg-white/10 text-white/50 font-bold text-sm text-center">
                {isEquipped ? "EQUIPPED ✓" : "OWNED ✓"}
              </div>
            )
          ) : canAfford ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPurchase}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm flex items-center justify-center gap-2"
            >
              <span>BUY</span>
              <span className="flex items-center gap-1">
                {item.price} 🍪
              </span>
            </motion.button>
          ) : (
            <div className="w-full py-2 rounded-lg bg-red-500/20 text-red-300/70 font-bold text-sm text-center flex items-center justify-center gap-2">
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
