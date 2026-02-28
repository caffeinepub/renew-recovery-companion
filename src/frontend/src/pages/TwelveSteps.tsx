import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Clock,
  Loader2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { StepStatus } from "../backend.d";
import { useAllStepProgress, useSaveStepProgress } from "../hooks/useQueries";
import { WA_STEPS } from "../utils/constants";

const STATUS_CONFIG = {
  [StepStatus.notStarted]: {
    label: "Not Started",
    icon: Circle,
    color: "bg-muted text-muted-foreground",
    dotColor: "bg-muted-foreground",
  },
  [StepStatus.inProgress]: {
    label: "In Progress",
    icon: Clock,
    color: "bg-amber-soft/50 text-amber-deep border-amber-soft",
    dotColor: "bg-amber-warm",
  },
  [StepStatus.completed]: {
    label: "Completed",
    icon: CheckCircle2,
    color: "bg-secondary text-primary border-secondary",
    dotColor: "bg-primary",
  },
};

export default function TwelveSteps() {
  const { data: stepProgress, isLoading } = useAllStepProgress();
  const saveStep = useSaveStepProgress();
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [editNotes, setEditNotes] = useState<Record<number, string>>({});
  const [editStatus, setEditStatus] = useState<Record<number, StepStatus>>({});
  const [saving, setSaving] = useState<number | null>(null);

  const getStepData = (stepNumber: number) => {
    return stepProgress?.find((s) => Number(s.stepNumber) === stepNumber);
  };

  const completedCount = (stepProgress || []).filter(
    (s) => s.status === StepStatus.completed,
  ).length;

  const handleExpand = (stepNum: number) => {
    if (expandedStep === stepNum) {
      setExpandedStep(null);
    } else {
      setExpandedStep(stepNum);
      const data = getStepData(stepNum);
      setEditNotes((prev) => ({
        ...prev,
        [stepNum]: data?.notes ?? "",
      }));
      setEditStatus((prev) => ({
        ...prev,
        [stepNum]: data?.status ?? StepStatus.notStarted,
      }));
    }
  };

  const handleSave = async (stepNum: number) => {
    setSaving(stepNum);
    try {
      await saveStep.mutateAsync({
        stepNumber: BigInt(stepNum),
        status: editStatus[stepNum] ?? StepStatus.notStarted,
        notes: editNotes[stepNum] ?? "",
      });
      toast.success(`Step ${stepNum} saved`);
      setExpandedStep(null);
    } catch {
      toast.error("Failed to save step");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-24 lg:pb-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-1">
          Recovery Program
        </p>
        <h1 className="font-display text-3xl font-semibold text-foreground">
          12-Step Program
        </h1>
        <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
          Workaholics Anonymous — a path to freedom from compulsive work. Work
          each step at your own pace.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8 p-5 bg-card rounded-xl border border-border shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <p className="font-medium text-foreground">Your Progress</p>
          <span className="font-display text-lg font-semibold text-primary">
            {completedCount}/12
          </span>
        </div>
        <Progress value={(completedCount / 12) * 100} className="h-2 mb-2" />
        <p className="text-xs text-muted-foreground">
          {completedCount === 0
            ? "Begin your journey — the first step is the most courageous."
            : completedCount === 12
              ? "You've completed all 12 steps. Keep practicing these principles."
              : `${12 - completedCount} steps remaining. You're doing great.`}
        </p>
      </div>

      {/* Steps List */}
      {isLoading ? (
        <div className="space-y-3">
          {["s1", "s2", "s3", "s4", "s5", "s6"].map((k) => (
            <Skeleton key={k} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {WA_STEPS.map((step) => {
            const data = getStepData(step.number);
            const status = data?.status ?? StepStatus.notStarted;
            const config = STATUS_CONFIG[status];
            const Icon = config.icon;
            const isExpanded = expandedStep === step.number;

            return (
              <motion.div
                key={step.number}
                layout
                className={cn(
                  "rounded-xl border overflow-hidden transition-all duration-200",
                  status === StepStatus.completed
                    ? "border-secondary/80 bg-secondary/20"
                    : "border-border bg-card",
                )}
              >
                {/* Step header */}
                <button
                  type="button"
                  onClick={() => handleExpand(step.number)}
                  className="w-full flex items-start gap-4 p-4 text-left hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-display font-bold",
                        status === StepStatus.completed
                          ? "bg-primary text-primary-foreground"
                          : status === StepStatus.inProgress
                            ? "bg-amber-soft text-amber-deep"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      {status === StepStatus.completed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-foreground leading-snug">
                        Step {step.number}: {step.title}
                      </p>
                      {!isExpanded && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {step.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant="outline"
                      className={cn("text-[10px] px-2 py-0.5", config.color)}
                    >
                      <Icon className="w-3 h-3 mr-1" />
                      {config.label}
                    </Badge>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Expanded content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-1 border-t border-border/50 space-y-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>

                        <div className="space-y-2">
                          <p className="text-xs font-medium text-foreground uppercase tracking-wider">
                            Status
                          </p>
                          <Select
                            value={
                              editStatus[step.number] ?? StepStatus.notStarted
                            }
                            onValueChange={(v) =>
                              setEditStatus((prev) => ({
                                ...prev,
                                [step.number]: v as StepStatus,
                              }))
                            }
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={StepStatus.notStarted}>
                                Not Started
                              </SelectItem>
                              <SelectItem value={StepStatus.inProgress}>
                                In Progress
                              </SelectItem>
                              <SelectItem value={StepStatus.completed}>
                                Completed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs font-medium text-foreground uppercase tracking-wider">
                            Personal Notes
                          </p>
                          <Textarea
                            placeholder="Reflect on this step… What does it mean to you? What actions have you taken?"
                            value={editNotes[step.number] ?? ""}
                            onChange={(e) =>
                              setEditNotes((prev) => ({
                                ...prev,
                                [step.number]: e.target.value,
                              }))
                            }
                            rows={3}
                            className="resize-none text-sm"
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedStep(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            disabled={saving === step.number}
                            onClick={() => handleSave(step.number)}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            {saving === step.number ? (
                              <>
                                <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                                Saving…
                              </>
                            ) : (
                              "Save Progress"
                            )}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
