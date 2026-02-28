import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Loader2, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAllDailyCheckins, useSaveDailyCheckin } from "../hooks/useQueries";
import {
  formatDate,
  getMoodColor,
  getMoodEmoji,
  getMoodLabel,
  today,
} from "../utils/constants";

export default function DailyCheckin() {
  const { data: checkins, isLoading } = useAllDailyCheckins();
  const saveCheckin = useSaveDailyCheckin();

  const todayStr = today();
  const existingToday = useMemo(
    () => (checkins || []).find((c) => c.date === todayStr),
    [checkins, todayStr],
  );

  const [mood, setMood] = useState<number[]>([
    existingToday ? Number(existingToday.mood) : 5,
  ]);
  const [workHours, setWorkHours] = useState(
    existingToday?.workHours?.toString() ?? "8",
  );
  const [exerciseHours, setExerciseHours] = useState(
    existingToday?.exerciseHours?.toString() ?? "1",
  );
  const [restHours, setRestHours] = useState(
    existingToday?.restHours?.toString() ?? "7",
  );
  const [notes, setNotes] = useState(existingToday?.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<"form" | "history">("form");

  // Reset form when today's data loads
  useMemo(() => {
    if (existingToday) {
      setMood([Number(existingToday.mood)]);
      setWorkHours(existingToday.workHours.toString());
      setExerciseHours(existingToday.exerciseHours.toString());
      setRestHours(existingToday.restHours.toString());
      setNotes(existingToday.notes);
    }
  }, [existingToday]);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await saveCheckin.mutateAsync({
        date: todayStr,
        mood: BigInt(mood[0]),
        workHours: Number.parseFloat(workHours) || 0,
        exerciseHours: Number.parseFloat(exerciseHours) || 0,
        restHours: Number.parseFloat(restHours) || 0,
        notes,
      });
      toast.success("Check-in saved! Keep it up. 🌱");
    } catch {
      toast.error("Failed to save check-in");
    } finally {
      setSaving(false);
    }
  };

  const sortedCheckins = useMemo(
    () => [...(checkins || [])].sort((a, b) => b.date.localeCompare(a.date)),
    [checkins],
  );

  const getTrend = (current: number, previous: number) => {
    if (current > previous)
      return <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />;
    if (current < previous)
      return <TrendingDown className="w-3.5 h-3.5 text-red-500" />;
    return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-24 lg:pb-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-1">
          Awareness Practice
        </p>
        <h1 className="font-display text-3xl font-semibold text-foreground">
          Daily Check-in
        </h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Gentle self-awareness is the foundation of recovery.
        </p>
      </div>

      {/* View toggle */}
      <div className="flex gap-2 mb-6 p-1 bg-muted rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setView("form")}
          className={cn(
            "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
            view === "form"
              ? "bg-card text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => setView("history")}
          className={cn(
            "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
            view === "history"
              ? "bg-card text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          History
        </button>
      </div>

      {view === "form" ? (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-base">
                {formatDate(todayStr)}
                {existingToday && (
                  <span className="ml-2 text-xs font-body font-normal text-muted-foreground">
                    (updating today's check-in)
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mood Slider */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  How are you feeling?
                </Label>
                <div className="text-center py-3">
                  <span className="text-5xl">{getMoodEmoji(mood[0])}</span>
                  <p
                    className={cn(
                      "font-display text-xl font-semibold mt-2",
                      getMoodColor(mood[0]),
                    )}
                  >
                    {mood[0]}/10 — {getMoodLabel(mood[0])}
                  </p>
                </div>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={mood}
                  onValueChange={setMood}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Very Low</span>
                  <span>Excellent</span>
                </div>
              </div>

              <Separator />

              {/* Hours */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Hours Today
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      💼 Work
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      value={workHours}
                      onChange={(e) => setWorkHours(e.target.value)}
                      className="text-center"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      🏃 Exercise
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      value={exerciseHours}
                      onChange={(e) => setExerciseHours(e.target.value)}
                      className="text-center"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      😴 Rest
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      value={restHours}
                      onChange={(e) => setRestHours(e.target.value)}
                      className="text-center"
                    />
                  </div>
                </div>

                {/* Work hours warning */}
                {Number.parseFloat(workHours) > 9 && (
                  <p className="text-xs text-terracotta mt-2 flex items-center gap-1.5">
                    <span>⚠️</span> Working over 9 hours can reinforce
                    workaholism patterns. How can you create more balance
                    tomorrow?
                  </p>
                )}
                {Number.parseFloat(exerciseHours) > 2 && (
                  <p className="text-xs text-amber-deep mt-2 flex items-center gap-1.5">
                    <span>⚠️</span> Over 2 hours of exercise may indicate
                    compulsive patterns. Rest is healing too.
                  </p>
                )}
              </div>

              <Separator />

              {/* Notes */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Reflection Notes{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </Label>
                <Textarea
                  placeholder="What's on your mind? What are you grateful for? What was challenging today?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="resize-none text-sm"
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={saving}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : existingToday ? (
                  "Update Today's Check-in"
                ) : (
                  "Save Check-in"
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          key="history"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          ) : sortedCheckins.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">📋</p>
              <p className="text-foreground font-medium">No check-ins yet</p>
              <p className="text-muted-foreground text-sm mt-1">
                Start today to see your history here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedCheckins.map((c, idx) => {
                const prev = sortedCheckins[idx + 1];
                const moodNum = Number(c.mood);
                return (
                  <Card
                    key={c.date}
                    className="hover:shadow-wellness transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {getMoodEmoji(moodNum)}
                          </span>
                          <div>
                            <p className="font-medium text-sm text-foreground">
                              {formatDate(c.date)}
                            </p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span
                                className={cn(
                                  "text-xs font-medium",
                                  getMoodColor(moodNum),
                                )}
                              >
                                Mood {moodNum}/10
                              </span>
                              {prev && getTrend(moodNum, Number(prev.mood))}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3 text-center text-xs text-muted-foreground">
                          <div>
                            <p className="font-display text-base font-semibold text-foreground">
                              {c.workHours}h
                            </p>
                            <p>Work</p>
                          </div>
                          <div>
                            <p className="font-display text-base font-semibold text-foreground">
                              {c.exerciseHours}h
                            </p>
                            <p>Exercise</p>
                          </div>
                          <div>
                            <p className="font-display text-base font-semibold text-foreground">
                              {c.restHours}h
                            </p>
                            <p>Rest</p>
                          </div>
                        </div>
                      </div>
                      {c.notes && (
                        <p className="text-xs text-muted-foreground mt-3 italic leading-relaxed line-clamp-2">
                          "{c.notes}"
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
