import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

interface UseDemoNotificationsProps {
  onMoodSelect?: (mood: string) => void;
  enabled?: boolean;
}

const MOOD_OPTIONS = [
  { emoji: "😊", label: "Great", mood: "great" },
  { emoji: "🙂", label: "Good", mood: "good" },
  { emoji: "😐", label: "Okay", mood: "okay" },
  { emoji: "😔", label: "Low", mood: "low" },
  { emoji: "😢", label: "Struggling", mood: "struggling" },
];

export const useDemoNotifications = ({ onMoodSelect, enabled = true }: UseDemoNotificationsProps) => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [hasShownMoodPrompt, setHasShownMoodPrompt] = useState(false);

  // Request notification permission on mount
  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return false;
    }

    if (Notification.permission === "granted") {
      setPermissionGranted(true);
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      const granted = permission === "granted";
      setPermissionGranted(granted);
      
      if (granted) {
        toast.success("Notifications enabled! We'll check in with you throughout the day. 💚");
      }
      
      return granted;
    }

    return false;
  }, []);

  // Show mood prompt toast (works without browser notification permission)
  const showMoodPromptToast = useCallback(() => {
    if (hasShownMoodPrompt) return;
    
    toast(
      <div className="space-y-3">
        <p className="font-medium">How are you feeling right now? 💭</p>
        <div className="flex gap-2 flex-wrap">
          {MOOD_OPTIONS.map((option) => (
            <button
              key={option.mood}
              onClick={() => {
                onMoodSelect?.(option.mood);
                toast.success(`Mood recorded: ${option.emoji} ${option.label}`);
                toast.dismiss();
              }}
              className="flex flex-col items-center p-2 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <span className="text-2xl">{option.emoji}</span>
              <span className="text-xs text-muted-foreground">{option.label}</span>
            </button>
          ))}
        </div>
      </div>,
      {
        duration: 30000, // 30 seconds
        position: "top-center",
      }
    );
    
    setHasShownMoodPrompt(true);
  }, [hasShownMoodPrompt, onMoodSelect]);

  // Request permission and show mood prompt after 10 seconds
  useEffect(() => {
    if (!enabled) return;

    // Request permission immediately on demo load
    requestPermission();

    // Show mood prompt after 10 seconds
    const moodTimer = setTimeout(() => {
      showMoodPromptToast();
    }, 10000);

    return () => {
      clearTimeout(moodTimer);
    };
  }, [enabled, requestPermission, showMoodPromptToast]);

  return {
    permissionGranted,
    requestPermission,
    showMoodPromptToast,
  };
};
