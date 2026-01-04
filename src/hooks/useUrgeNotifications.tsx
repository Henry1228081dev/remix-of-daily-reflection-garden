import { useEffect, useCallback } from "react";
import { useBadHabits } from "./useBadHabits";
import { toast } from "@/hooks/use-toast";

export const useUrgeNotifications = () => {
  const { habits, logEvent } = useBadHabits();

  const showUrgeCheckIn = useCallback((habit: { id: string; habit_name: string }) => {
    toast({
      title: `Feeling urges to ${habit.habit_name}?`,
      description: "How are you doing with this habit right now?",
      duration: 10000,
      action: (
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              logEvent.mutate({ badHabitId: habit.id, logType: "resist" });
              toast({
                title: "Amazing! 🌟",
                description: "You're doing great! Keep it up!",
              });
            }}
            className="px-3 py-1.5 bg-green-500 text-white rounded-md text-sm hover:bg-green-600"
          >
            I resisted!
          </button>
          <button
            onClick={() => {
              logEvent.mutate({ badHabitId: habit.id, logType: "urge" });
              toast({
                title: "Stay strong 💪",
                description: "This urge will pass. Try your replacement habit!",
              });
            }}
            className="px-3 py-1.5 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600"
          >
            Having urges
          </button>
        </div>
      ),
    });
  }, [logEvent]);

  useEffect(() => {
    if (habits.length === 0) return;

    // Check in every 2 hours (in a real app, this would be background notifications)
    const checkInInterval = 2 * 60 * 60 * 1000; // 2 hours
    
    // For demo, show a check-in after 30 seconds for the first habit
    const demoTimeout = setTimeout(() => {
      if (habits.length > 0) {
        const randomHabit = habits[Math.floor(Math.random() * habits.length)];
        showUrgeCheckIn(randomHabit);
      }
    }, 30000);

    // Regular check-ins
    const intervalId = setInterval(() => {
      if (habits.length > 0) {
        const randomHabit = habits[Math.floor(Math.random() * habits.length)];
        showUrgeCheckIn(randomHabit);
      }
    }, checkInInterval);

    return () => {
      clearTimeout(demoTimeout);
      clearInterval(intervalId);
    };
  }, [habits, showUrgeCheckIn]);

  return { showUrgeCheckIn };
};
