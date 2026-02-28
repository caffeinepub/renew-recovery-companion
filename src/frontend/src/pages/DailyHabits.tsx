import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  useHabitCompletionsForDate,
  useSaveHabitCompletion,
} from "../hooks/useQueries";
import { RECOVERY_HABITS, formatDate, today } from "../utils/constants";

export default function DailyHabits() {
  const todayStr = today();
  const { data: completions, isLoading } = useHabitCompletionsForDate(todayStr);
  const saveHabit = useSaveHabitCompletion();
  const [saving, setSaving] = useState<string | null>(null);

  const completedSet = useMemo(
    () =>
      new Set(
        (completions || []).filter((c) => c.completed).map((c) => c.habitName),
      ),
    [completions],
  );

  const completedCount = completedSet.size;
  const totalCount = RECOVERY_HABITS.length;
  const pct = Math.round((completedCount / totalCount) * 100);

  const handleToggle = async (habitName: string, checked: boolean) => {
    setSaving(habitName);
    try {
      await saveHabit.mutateAsync({
        date: todayStr,
        habitName,
        completed: checked,
      });
      if (checked) {
        toast.success(`"${habitName}" — keep it up! 🌿`);
      }
    } catch {
      toast.error("Failed to save habit");
    } finally {
      setSaving(null);
    }
  };

  const getEncouragement = () => {
    if (pct === 0)
      return "Start with one habit — small steps lead to big change.";
    if (pct <= 25) return "You've begun. That matters more than you know.";
    if (pct <= 50) return "Halfway there. You're building real momentum.";
    if (pct <= 75) return "Excellent work! Recovery habits are taking root.";
    if (pct < 100) return "Almost there — you're doing beautifully!";
    return "All habits complete today. You should feel proud. 🌱";
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-24 lg:pb-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-1">
          Daily Practice
        </p>
        <h1 className="font-display text-3xl font-semibold text-foreground">
          Daily Habits
        </h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Recovery is built through consistent, compassionate daily practice.
        </p>
      </div>

      {/* Today's Progress */}
      <div className="mb-8 p-5 bg-card rounded-xl border border-border shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-medium text-foreground">
              {formatDate(todayStr)}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {getEncouragement()}
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-2xl font-semibold text-primary">
              {completedCount}
              <span className="text-muted-foreground font-body text-base font-normal">
                /{totalCount}
              </span>
            </p>
            <p className="text-xs text-muted-foreground">{pct}% complete</p>
          </div>
        </div>
        <Progress value={pct} className="h-2" />
      </div>

      {/* Habits List */}
      {isLoading ? (
        <div className="space-y-3">
          {["h1", "h2", "h3", "h4", "h5", "h6", "h7", "h8"].map((k) => (
            <Skeleton key={k} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {RECOVERY_HABITS.map((habit, idx) => {
            const isChecked = completedSet.has(habit.name);
            const isSaving = saving === habit.name;

            return (
              <motion.div
                key={habit.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
              >
                <Card
                  className={cn(
                    "transition-all hover:shadow-wellness",
                    isChecked && "bg-secondary/30 border-secondary/60",
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5">
                        <Checkbox
                          id={habit.name}
                          checked={isChecked}
                          disabled={isSaving}
                          onCheckedChange={(checked) =>
                            handleToggle(habit.name, checked === true)
                          }
                          className={cn(
                            "w-5 h-5 transition-all",
                            isChecked &&
                              "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
                          )}
                        />
                      </div>
                      <label
                        htmlFor={habit.name}
                        className={cn(
                          "flex-1 cursor-pointer",
                          isSaving && "opacity-60",
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{habit.icon}</span>
                          <p
                            className={cn(
                              "font-medium text-sm text-foreground transition-all",
                              isChecked && "line-through text-muted-foreground",
                            )}
                          >
                            {habit.name}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {habit.description}
                        </p>
                      </label>
                      {isChecked && (
                        <Badge
                          variant="outline"
                          className="shrink-0 text-[10px] px-1.5 py-0.5 bg-secondary/50 text-primary border-secondary"
                        >
                          Done ✓
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Encouragement footer */}
      {!isLoading && completedCount === totalCount && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-5 bg-sidebar rounded-xl text-center"
        >
          <p className="text-4xl mb-2">🎉</p>
          <p className="font-display text-lg text-sidebar-foreground font-semibold">
            All habits complete!
          </p>
          <p className="text-sidebar-foreground/70 text-sm mt-1">
            You showed up for yourself today. That is recovery in action.
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Flame className="w-4 h-4 text-sidebar-primary" />
            <span className="text-sidebar-primary font-medium text-sm">
              Keep the streak going tomorrow
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
