import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, ChevronRight, Target, Footprints, Sparkles, X } from "lucide-react";

interface DemoTask {
  id: string;
  label: string;
  completed: boolean;
}

interface DemoTasksSidebarProps {
  checkInComplete: boolean;
  journalComplete: boolean;
  habits: { id: string; name: string; completed: boolean }[];
  steps: { id: string; text: string; completed: boolean }[];
  onHabitToggle: (id: string) => void;
  onStepToggle: (id: string) => void;
}

const DemoTasksSidebar = ({
  checkInComplete,
  journalComplete,
  habits,
  steps,
  onHabitToggle,
  onStepToggle,
}: DemoTasksSidebarProps) => {
  const [expandedTab, setExpandedTab] = useState<"daily" | "habits" | "steps" | null>(null);

  const toggleTab = (tab: "daily" | "habits" | "steps") => {
    setExpandedTab(expandedTab === tab ? null : tab);
  };

  const dailyTasks: DemoTask[] = [
    { id: "checkin", label: "Complete daily check-in", completed: checkInComplete },
    { id: "journal", label: "Write in journal", completed: journalComplete },
  ];

  const completedDailyCount = dailyTasks.filter((t) => t.completed).length;
  const completedHabitsCount = habits.filter((h) => h.completed).length;
  const completedStepsCount = steps.filter((s) => s.completed).length;

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2">
      {/* Daily Tasks Tab */}
      <div className="relative">
        <motion.button
          onClick={() => toggleTab("daily")}
          whileHover={{ scale: 1.05, x: 4 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 px-3 py-2 rounded-r-xl rounded-l-lg shadow-lg transition-colors ${
            expandedTab === "daily"
              ? "bg-primary text-primary-foreground"
              : "bg-card border border-border hover:bg-secondary"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-medium whitespace-nowrap">Daily</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
            expandedTab === "daily" ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/10 text-primary"
          }`}>
            {completedDailyCount}/{dailyTasks.length}
          </span>
          <ChevronRight className={`w-3 h-3 transition-transform ${expandedTab === "daily" ? "rotate-180" : ""}`} />
        </motion.button>

        <AnimatePresence>
          {expandedTab === "daily" && (
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              className="absolute left-full top-0 ml-2 w-56 bg-card border border-border rounded-xl shadow-xl p-3 z-50"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-foreground">Daily Tasks</h4>
                <button onClick={() => setExpandedTab(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-2">
                {dailyTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                      task.completed ? "bg-primary/10" : "bg-secondary/50"
                    }`}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className={`text-xs ${task.completed ? "text-primary line-through" : "text-foreground"}`}>
                      {task.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Habits Tab */}
      <div className="relative">
        <motion.button
          onClick={() => toggleTab("habits")}
          whileHover={{ scale: 1.05, x: 4 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 px-3 py-2 rounded-r-xl rounded-l-lg shadow-lg transition-colors ${
            expandedTab === "habits"
              ? "bg-primary text-primary-foreground"
              : "bg-card border border-border hover:bg-secondary"
          }`}
        >
          <Target className="w-4 h-4" />
          <span className="text-xs font-medium whitespace-nowrap">Habits</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
            expandedTab === "habits" ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/10 text-primary"
          }`}>
            {completedHabitsCount}/{habits.length}
          </span>
          <ChevronRight className={`w-3 h-3 transition-transform ${expandedTab === "habits" ? "rotate-180" : ""}`} />
        </motion.button>

        <AnimatePresence>
          {expandedTab === "habits" && (
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              className="absolute left-full top-0 ml-2 w-56 bg-card border border-border rounded-xl shadow-xl p-3 z-50"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-foreground">Daily Habits</h4>
                <button onClick={() => setExpandedTab(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-2">
                {habits.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-2">No habits yet</p>
                ) : (
                  habits.map((habit) => (
                    <button
                      key={habit.id}
                      onClick={() => onHabitToggle(habit.id)}
                      className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors hover:bg-secondary ${
                        habit.completed ? "bg-primary/10" : "bg-secondary/50"
                      }`}
                    >
                      {habit.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className={`text-xs text-left ${habit.completed ? "text-primary line-through" : "text-foreground"}`}>
                        {habit.name}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tiny Steps Tab */}
      <div className="relative">
        <motion.button
          onClick={() => toggleTab("steps")}
          whileHover={{ scale: 1.05, x: 4 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 px-3 py-2 rounded-r-xl rounded-l-lg shadow-lg transition-colors ${
            expandedTab === "steps"
              ? "bg-primary text-primary-foreground"
              : "bg-card border border-border hover:bg-secondary"
          }`}
        >
          <Footprints className="w-4 h-4" />
          <span className="text-xs font-medium whitespace-nowrap">Steps</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
            expandedTab === "steps" ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/10 text-primary"
          }`}>
            {completedStepsCount}/{steps.length}
          </span>
          <ChevronRight className={`w-3 h-3 transition-transform ${expandedTab === "steps" ? "rotate-180" : ""}`} />
        </motion.button>

        <AnimatePresence>
          {expandedTab === "steps" && (
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              className="absolute left-full top-0 ml-2 w-56 bg-card border border-border rounded-xl shadow-xl p-3 z-50"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-foreground">Tiny Steps</h4>
                <button onClick={() => setExpandedTab(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-2">
                {steps.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-2">No steps yet</p>
                ) : (
                  steps.map((step) => (
                    <button
                      key={step.id}
                      onClick={() => onStepToggle(step.id)}
                      className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors hover:bg-secondary ${
                        step.completed ? "bg-primary/10" : "bg-secondary/50"
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className={`text-xs text-left ${step.completed ? "text-primary line-through" : "text-foreground"}`}>
                        {step.text}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DemoTasksSidebar;
