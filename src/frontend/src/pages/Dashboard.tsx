import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  CalendarDays,
  CheckSquare,
  ChevronRight,
  Flame,
  ListChecks,
  Pill,
  Quote,
} from "lucide-react";
import { type Variants, motion } from "motion/react";
import { useMemo } from "react";
import { StepStatus } from "../backend.d";
import { useAllStepProgress } from "../hooks/useQueries";
import { useAllDailyCheckins } from "../hooks/useQueries";
import { useAllAppointments } from "../hooks/useQueries";
import { useMedicationLogsForRange } from "../hooks/useQueries";
import { useAllMedications } from "../hooks/useQueries";
import {
  RECOVERY_QUOTES,
  daysAgo,
  formatDateTime,
  getMoodEmoji,
  today,
} from "../utils/constants";

type Page =
  | "dashboard"
  | "steps"
  | "checkin"
  | "medications"
  | "appointments"
  | "journal"
  | "habits"
  | "resources";

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Dashboard({ onNavigate }: DashboardProps) {
  // Stable quote based on day of year
  const quote = useMemo(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        86400000,
    );
    return RECOVERY_QUOTES[dayOfYear % RECOVERY_QUOTES.length];
  }, []);

  const { data: stepProgress, isLoading: stepsLoading } = useAllStepProgress();
  const { data: checkins, isLoading: checkinsLoading } = useAllDailyCheckins();
  const { data: appointments, isLoading: appointmentsLoading } =
    useAllAppointments();
  const { data: medications } = useAllMedications();

  const start7 = daysAgo(7);
  const todayStr = today();
  const { data: medLogs } = useMedicationLogsForRange(start7, todayStr);

  // Computed stats
  const completedSteps = useMemo(
    () =>
      (stepProgress || []).filter((s) => s.status === StepStatus.completed)
        .length,
    [stepProgress],
  );

  const todaysCheckin = useMemo(
    () => (checkins || []).find((c) => c.date === todayStr),
    [checkins, todayStr],
  );

  // Days journaled in last 30 days
  const daysCheckined = useMemo(() => {
    const last30 = daysAgo(30);
    return (checkins || []).filter((c) => c.date >= last30).length;
  }, [checkins]);

  // Current streak
  const streak = useMemo(() => {
    if (!checkins || checkins.length === 0) return 0;
    const sorted = [...checkins].sort((a, b) => b.date.localeCompare(a.date));
    let count = 0;
    let cursor = today();
    for (const c of sorted) {
      if (c.date === cursor) {
        count++;
        const d = new Date(`${cursor}T00:00:00`);
        d.setDate(d.getDate() - 1);
        cursor = d.toISOString().split("T")[0];
      } else {
        break;
      }
    }
    return count;
  }, [checkins]);

  // Medication adherence
  const adherencePct = useMemo(() => {
    if (!medLogs || medLogs.length === 0) return null;
    const taken = medLogs.filter((l) => l.taken).length;
    return Math.round((taken / medLogs.length) * 100);
  }, [medLogs]);

  // Upcoming appointments
  const upcomingAppointments = useMemo(() => {
    const now = new Date().toISOString();
    return (appointments || [])
      .filter((a) => !a.completed && a.dateTime >= now)
      .sort((a, b) => a.dateTime.localeCompare(b.dateTime))
      .slice(0, 3);
  }, [appointments]);

  const activeMeds = (medications || []).filter((m) => m.active).length;

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-24 lg:pb-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-1">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground leading-tight">
          Welcome back. 🌱
        </h1>
        <p className="text-muted-foreground mt-1.5">
          Your recovery journey continues — every day is progress.
        </p>
      </motion.div>

      {/* Motivational Quote */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mb-8"
      >
        <div className="relative bg-sidebar rounded-2xl p-6 overflow-hidden">
          <div className="absolute top-3 right-4 opacity-10">
            <Quote className="w-16 h-16 text-sidebar-primary" />
          </div>
          <p className="font-display text-lg md:text-xl text-sidebar-foreground leading-relaxed relative z-10 pr-8">
            "{quote.text}"
          </p>
          <p className="text-sidebar-foreground/50 text-sm mt-3 relative z-10">
            — {quote.author}
          </p>
        </div>
      </motion.div>

      {/* Check-in prompt */}
      {!todaysCheckin && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <div className="bg-accent/30 border border-accent/50 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                <CheckSquare className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">
                  Start your daily check-in
                </p>
                <p className="text-muted-foreground text-xs">
                  Track your mood, hours, and how you're feeling today
                </p>
              </div>
            </div>
            <Button
              onClick={() => onNavigate("checkin")}
              size="sm"
              className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Check In
            </Button>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {/* Steps */}
        <motion.div variants={itemVariants}>
          <button
            type="button"
            onClick={() => onNavigate("steps")}
            className="wellness-card w-full p-4 text-left block"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                <ListChecks className="w-4.5 h-4.5 text-primary" />
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
            {stepsLoading ? (
              <Skeleton className="h-8 w-16 mb-1" />
            ) : (
              <p className="font-display text-2xl font-semibold text-foreground">
                {completedSteps}
                <span className="text-muted-foreground font-body text-base font-normal">
                  /12
                </span>
              </p>
            )}
            <p className="text-muted-foreground text-xs mt-0.5">Steps Done</p>
            {!stepsLoading && (
              <Progress
                value={(completedSteps / 12) * 100}
                className="h-1.5 mt-2"
              />
            )}
          </button>
        </motion.div>

        {/* Adherence */}
        <motion.div variants={itemVariants}>
          <button
            type="button"
            onClick={() => onNavigate("medications")}
            className="wellness-card w-full p-4 text-left block"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-amber-soft/40 flex items-center justify-center">
                <Pill className="w-4.5 h-4.5 text-amber-deep" />
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="font-display text-2xl font-semibold text-foreground">
              {adherencePct !== null ? (
                <>
                  {adherencePct}
                  <span className="text-muted-foreground font-body text-base font-normal">
                    %
                  </span>
                </>
              ) : (
                <span className="text-muted-foreground text-base font-body font-normal">
                  {activeMeds > 0 ? "No logs" : "No meds"}
                </span>
              )}
            </p>
            <p className="text-muted-foreground text-xs mt-0.5">
              Med. Adherence
            </p>
          </button>
        </motion.div>

        {/* Days Checked In */}
        <motion.div variants={itemVariants}>
          <button
            type="button"
            onClick={() => onNavigate("checkin")}
            className="wellness-card w-full p-4 text-left block"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-sage-100 flex items-center justify-center">
                <BookOpen className="w-4.5 h-4.5 text-sage-600" />
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
            {checkinsLoading ? (
              <Skeleton className="h-8 w-16 mb-1" />
            ) : (
              <p className="font-display text-2xl font-semibold text-foreground">
                {daysCheckined}
                <span className="text-muted-foreground font-body text-base font-normal">
                  /30
                </span>
              </p>
            )}
            <p className="text-muted-foreground text-xs mt-0.5">
              Days Checked In
            </p>
          </button>
        </motion.div>

        {/* Streak */}
        <motion.div variants={itemVariants}>
          <button
            type="button"
            onClick={() => onNavigate("checkin")}
            className="wellness-card w-full p-4 text-left block"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-terracotta/15 flex items-center justify-center">
                <Flame className="w-4.5 h-4.5 text-terracotta" />
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
            {checkinsLoading ? (
              <Skeleton className="h-8 w-12 mb-1" />
            ) : (
              <p className="font-display text-2xl font-semibold text-foreground">
                {streak}
                <span className="text-muted-foreground font-body text-base font-normal">
                  {" "}
                  {streak === 1 ? "day" : "days"}
                </span>
              </p>
            )}
            <p className="text-muted-foreground text-xs mt-0.5">
              Check-in Streak
            </p>
          </button>
        </motion.div>
      </motion.div>

      {/* Bottom section: today's mood + upcoming appointments */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Checkin Summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base flex items-center justify-between">
                Today's Check-in
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7 text-primary hover:text-primary"
                  onClick={() => onNavigate("checkin")}
                >
                  {todaysCheckin ? "Edit" : "Add"}
                  <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {checkinsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                </div>
              ) : todaysCheckin ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">
                      {getMoodEmoji(Number(todaysCheckin.mood))}
                    </span>
                    <div>
                      <p className="font-medium text-foreground">
                        Mood: {todaysCheckin.mood.toString()}/10
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {todaysCheckin.mood <= BigInt(4)
                          ? "Be gentle with yourself today."
                          : todaysCheckin.mood <= BigInt(7)
                            ? "A steady day — keep going."
                            : "Great energy today!"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-muted rounded-lg p-2">
                      <p className="font-display text-lg font-semibold">
                        {todaysCheckin.workHours}h
                      </p>
                      <p className="text-xs text-muted-foreground">Work</p>
                    </div>
                    <div className="bg-muted rounded-lg p-2">
                      <p className="font-display text-lg font-semibold">
                        {todaysCheckin.exerciseHours}h
                      </p>
                      <p className="text-xs text-muted-foreground">Exercise</p>
                    </div>
                    <div className="bg-muted rounded-lg p-2">
                      <p className="font-display text-lg font-semibold">
                        {todaysCheckin.restHours}h
                      </p>
                      <p className="text-xs text-muted-foreground">Rest</p>
                    </div>
                  </div>
                  {todaysCheckin.notes && (
                    <p className="text-sm text-muted-foreground italic leading-relaxed">
                      "{todaysCheckin.notes}"
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-4xl mb-3">🌅</p>
                  <p className="text-foreground font-medium text-sm">
                    No check-in yet
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    How are you feeling today?
                  </p>
                  <Button
                    size="sm"
                    className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => onNavigate("checkin")}
                  >
                    Start Check-in
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base flex items-center justify-between">
                Upcoming Appointments
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7 text-primary hover:text-primary"
                  onClick={() => onNavigate("appointments")}
                >
                  View All
                  <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {appointmentsLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-lg" />
                  ))}
                </div>
              ) : upcomingAppointments.length > 0 ? (
                <div className="space-y-2">
                  {upcomingAppointments.map((appt) => (
                    <div
                      key={appt.id.toString()}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                        <CalendarDays className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">
                          {appt.providerName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {appt.appointmentType}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDateTime(appt.dateTime)}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        Upcoming
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-4xl mb-3">📅</p>
                  <p className="text-foreground font-medium text-sm">
                    No upcoming appointments
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Schedule time with your support team
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-4"
                    onClick={() => onNavigate("appointments")}
                  >
                    Add Appointment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
