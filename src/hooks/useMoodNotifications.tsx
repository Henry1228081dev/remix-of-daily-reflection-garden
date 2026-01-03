import { useEffect, useCallback, useRef } from "react";
import { toast } from "@/hooks/use-toast";

interface MoodNotificationSettings {
  enabled: boolean;
  lastAskedPermission: string | null;
  sleepStart: number; // Hour in 24h format (default 22 = 10pm)
  sleepEnd: number;   // Hour in 24h format (default 10 = 10am)
  scheduledTimes: number[]; // Array of scheduled notification times (timestamps)
}

const STORAGE_KEY = "moodNotificationSettings";
const MOODS = [
  { id: "great", emoji: "😊", label: "Great" },
  { id: "good", emoji: "🙂", label: "Good" },
  { id: "okay", emoji: "😐", label: "Okay" },
  { id: "low", emoji: "😔", label: "Low" },
  { id: "sad", emoji: "😢", label: "Sad" },
];

const getSettings = (): MoodNotificationSettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to parse notification settings:", e);
  }
  return {
    enabled: false,
    lastAskedPermission: null,
    sleepStart: 22, // 10pm
    sleepEnd: 10,   // 10am
    scheduledTimes: [],
  };
};

const saveSettings = (settings: MoodNotificationSettings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

// Generate 4 random times between sleepEnd and sleepStart (awake hours)
const generateRandomNotificationTimes = (sleepStart: number, sleepEnd: number): number[] => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const times: number[] = [];
  
  // Calculate awake hours (e.g., 10am to 10pm = 12 hours)
  const awakeHours = sleepStart > sleepEnd 
    ? sleepStart - sleepEnd 
    : (24 - sleepEnd) + sleepStart;
  
  // Generate 4 random times within awake hours
  const intervals = awakeHours / 5; // Divide into 5 sections, pick from middle 4
  
  for (let i = 0; i < 4; i++) {
    const baseHour = sleepEnd + (intervals * (i + 0.5 + Math.random()));
    const hour = Math.floor(baseHour) % 24;
    const minutes = Math.floor(Math.random() * 60);
    
    const notificationTime = new Date(today);
    notificationTime.setHours(hour, minutes, 0, 0);
    
    // If this time has already passed today, schedule for tomorrow
    if (notificationTime.getTime() < now.getTime()) {
      notificationTime.setDate(notificationTime.getDate() + 1);
    }
    
    times.push(notificationTime.getTime());
  }
  
  return times.sort((a, b) => a - b);
};

const isWithinAwakeHours = (sleepStart: number, sleepEnd: number): boolean => {
  const now = new Date();
  const currentHour = now.getHours();
  
  if (sleepEnd < sleepStart) {
    // Normal case: awake from sleepEnd to sleepStart (e.g., 10am to 10pm)
    return currentHour >= sleepEnd && currentHour < sleepStart;
  } else {
    // Inverted case: awake from sleepEnd through midnight to sleepStart
    return currentHour >= sleepEnd || currentHour < sleepStart;
  }
};

export const useMoodNotifications = (onMoodSelect?: (mood: string) => void) => {
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const settings = getSettings();

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!("Notification" in window)) {
      toast({
        title: "Notifications not supported",
        description: "Your browser doesn't support notifications.",
        variant: "destructive",
      });
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission === "denied") {
      toast({
        title: "Notifications blocked",
        description: "Please enable notifications in your browser settings.",
        variant: "destructive",
      });
      return false;
    }

    const permission = await Notification.requestPermission();
    
    if (permission === "granted") {
      const newSettings = getSettings();
      newSettings.lastAskedPermission = new Date().toISOString();
      saveSettings(newSettings);
      return true;
    }

    return false;
  }, []);

  const enableNotifications = useCallback(async () => {
    const hasPermission = await requestPermission();
    
    if (hasPermission) {
      const currentSettings = getSettings();
      currentSettings.enabled = true;
      currentSettings.scheduledTimes = generateRandomNotificationTimes(
        currentSettings.sleepStart,
        currentSettings.sleepEnd
      );
      saveSettings(currentSettings);
      
      toast({
        title: "Mood check-ins enabled! 🎉",
        description: "You'll receive 4 friendly reminders throughout the day (between 10am and 10pm).",
      });
      
      return true;
    }
    
    return false;
  }, [requestPermission]);

  const disableNotifications = useCallback(() => {
    const currentSettings = getSettings();
    currentSettings.enabled = false;
    currentSettings.scheduledTimes = [];
    saveSettings(currentSettings);
    
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
    }
    
    toast({
      title: "Mood check-ins disabled",
      description: "You won't receive any more mood reminders.",
    });
  }, []);

  const showMoodNotification = useCallback(() => {
    if (Notification.permission !== "granted") return;
    
    const notification = new Notification("How are you feeling? 💭", {
      body: "Take a moment to check in with yourself",
      icon: "/favicon.ico",
      tag: "mood-checkin",
      requireInteraction: true,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
      // Show a toast with mood options
      toast({
        title: "What's your mood right now?",
        description: (
          <div className="flex gap-2 mt-2">
            {MOODS.map(mood => (
              <button
                key={mood.id}
                onClick={() => {
                  onMoodSelect?.(mood.id);
                  toast({
                    title: `Feeling ${mood.label} ${mood.emoji}`,
                    description: "Mood recorded! Keep checking in 💚",
                  });
                }}
                className="text-2xl hover:scale-125 transition-transform cursor-pointer"
                title={mood.label}
              >
                {mood.emoji}
              </button>
            ))}
          </div>
        ) as any,
        duration: 30000, // Show for 30 seconds
      });
    };
  }, [onMoodSelect]);

  const checkAndShowNotification = useCallback(() => {
    const currentSettings = getSettings();
    
    if (!currentSettings.enabled) return;
    if (!isWithinAwakeHours(currentSettings.sleepStart, currentSettings.sleepEnd)) return;
    
    const now = Date.now();
    const dueNotifications = currentSettings.scheduledTimes.filter(time => time <= now);
    
    if (dueNotifications.length > 0) {
      // Show notification
      showMoodNotification();
      
      // Remove shown notifications and regenerate if all are done
      const remainingTimes = currentSettings.scheduledTimes.filter(time => time > now);
      
      if (remainingTimes.length === 0) {
        // All notifications shown for today, generate for tomorrow
        currentSettings.scheduledTimes = generateRandomNotificationTimes(
          currentSettings.sleepStart,
          currentSettings.sleepEnd
        );
      } else {
        currentSettings.scheduledTimes = remainingTimes;
      }
      
      saveSettings(currentSettings);
    }
  }, [showMoodNotification]);

  // Start checking for due notifications
  useEffect(() => {
    if (settings.enabled && Notification.permission === "granted") {
      // Check every minute
      checkIntervalRef.current = setInterval(checkAndShowNotification, 60000);
      
      // Also check immediately
      checkAndShowNotification();
    }

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [settings.enabled, checkAndShowNotification]);

  const updateSleepHours = useCallback((sleepStart: number, sleepEnd: number) => {
    const currentSettings = getSettings();
    currentSettings.sleepStart = sleepStart;
    currentSettings.sleepEnd = sleepEnd;
    
    if (currentSettings.enabled) {
      currentSettings.scheduledTimes = generateRandomNotificationTimes(sleepStart, sleepEnd);
    }
    
    saveSettings(currentSettings);
  }, []);

  return {
    isEnabled: settings.enabled,
    hasPermission: typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted",
    sleepStart: settings.sleepStart,
    sleepEnd: settings.sleepEnd,
    enableNotifications,
    disableNotifications,
    updateSleepHours,
    requestPermission,
    showMoodNotification, // For testing
  };
};
