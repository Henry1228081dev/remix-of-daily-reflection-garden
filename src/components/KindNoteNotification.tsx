import { useEffect, useState } from "react";
import { Heart, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface KindNoteNotificationProps {
  note: string;
  isVisible: boolean;
  onDismiss: () => void;
}

const KindNoteNotification = ({ note, isVisible, onDismiss }: KindNoteNotificationProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        onDismiss();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onDismiss]);

  if (!isVisible && !isAnimating) return null;

  return (
    <div
      className={cn(
        "fixed bottom-24 right-4 z-50 max-w-sm transition-all duration-500 transform",
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
      onTransitionEnd={() => {
        if (!isVisible) setIsAnimating(false);
      }}
    >
      <div className="bg-gradient-to-br from-sticky-pink to-lavender rounded-xl p-4 shadow-card border border-primary/10 relative">
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex items-start gap-3 pr-4">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 animate-gentle-bounce">
            <Heart className="w-4 h-4 text-primary" />
          </div>
          <p className="text-sm text-foreground font-medium leading-relaxed">
            {note}
          </p>
        </div>
      </div>
    </div>
  );
};

export default KindNoteNotification;
