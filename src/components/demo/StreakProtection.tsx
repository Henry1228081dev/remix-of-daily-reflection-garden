import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Flame, AlertTriangle, Cookie, Check } from "lucide-react";
import { toast } from "sonner";

interface StreakProtectionProps {
  currentStreak: number;
  missedDay: boolean; // Whether user missed yesterday
  cookieBalance: number;
  onProtect: (cost: number) => void;
  protectionCost?: number;
}

const StreakProtection = ({ 
  currentStreak, 
  missedDay, 
  cookieBalance, 
  onProtect,
  protectionCost = 10 
}: StreakProtectionProps) => {
  const [isProtected, setIsProtected] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const canAfford = cookieBalance >= protectionCost;
  const shouldShow = missedDay && currentStreak > 0 && !isProtected;

  const handleProtect = () => {
    if (!canAfford) {
      toast.error("Not enough cookies! Keep earning to protect your streak.");
      return;
    }

    onProtect(protectionCost);
    setIsProtected(true);
    setShowConfirm(false);
    toast.success(
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-primary" />
        <span>Streak protected! Your {currentStreak}-day streak is safe! 🛡️</span>
      </div>
    );
  };

  if (!shouldShow) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Card className="bg-gradient-to-br from-terracotta/20 to-destructive/10 border-terracotta/30 shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-terracotta">
              <AlertTriangle className="w-5 h-5" />
              Streak in Danger!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-terracotta/20 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-terracotta" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {currentStreak}-day streak at risk!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    You missed yesterday's check-in
                  </p>
                </div>
              </div>
            </div>

            {!showConfirm ? (
              <Button
                onClick={() => setShowConfirm(true)}
                className="w-full gap-2 bg-gradient-to-r from-primary to-sage-dark hover:from-primary/90 hover:to-sage-dark/90"
              >
                <Shield className="w-4 h-4" />
                Protect Streak for {protectionCost} 🍪
              </Button>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-3"
              >
                <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                  <p className="text-sm text-center mb-2">
                    Spend <span className="font-bold text-terracotta">{protectionCost} cookies</span> to protect your streak?
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Cookie className="w-4 h-4" />
                    <span>Your balance: {cookieBalance} cookies</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleProtect}
                    disabled={!canAfford}
                    className="flex-1 gap-2 bg-primary hover:bg-primary/90"
                  >
                    <Check className="w-4 h-4" />
                    Confirm
                  </Button>
                </div>
                
                {!canAfford && (
                  <p className="text-xs text-center text-destructive">
                    You need {protectionCost - cookieBalance} more cookies!
                  </p>
                )}
              </motion.div>
            )}

            <p className="text-xs text-center text-muted-foreground">
              💡 Tip: Complete habits and journal entries to earn more cookies!
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default StreakProtection;
