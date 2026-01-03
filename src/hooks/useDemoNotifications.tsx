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
        toast.success("Desktop notifications enabled! 💚");
      }
      
      return granted;
    }

    return false;
  }, []);

  // Show desktop notification for mood check
  const showDesktopMoodNotification = useCallback(() => {
    if (hasShownMoodPrompt) return;
    
    if (permissionGranted && "Notification" in window) {
      const notification = new Notification("🌿 Reflect Check-In", {
        body: "How are you feeling right now? Click to log your mood.",
        icon: "/favicon.ico",
        tag: "mood-checkin",
        requireInteraction: true,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
        // Show in-app mood selector when they click the notification
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
            duration: 30000,
            position: "top-center",
          }
        );
      };
      
      setHasShownMoodPrompt(true);
    } else {
      // Fallback to in-app toast if no permission
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
          duration: 30000,
          position: "top-center",
        }
      );
      setHasShownMoodPrompt(true);
    }
  }, [hasShownMoodPrompt, onMoodSelect, permissionGranted]);

  // Request permission and show mood prompt after 10 seconds
  useEffect(() => {
    if (!enabled) return;

    // Request permission immediately on demo load
    requestPermission();

    // Show desktop notification after 10 seconds
    const moodTimer = setTimeout(() => {
      showDesktopMoodNotification();
    }, 10000);

    return () => {
      clearTimeout(moodTimer);
    };
  }, [enabled, requestPermission, showDesktopMoodNotification]);

  return {
    permissionGranted,
    requestPermission,
    showDesktopMoodNotification,
  };
};
