import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { StepStatus } from "../backend.d";
import { createActorWithConfig } from "../config";
import { useActor } from "./useActor";

// Helper to get actor for mutations (no identity needed for basic anonymous calls)
async function getActor() {
  return createActorWithConfig();
}

// ─── Daily Check-ins ──────────────────────────────────────────────────────────

export function useAllDailyCheckins() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["dailyCheckins"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDailyCheckins();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveDailyCheckin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      date: string;
      mood: bigint;
      workHours: number;
      exerciseHours: number;
      restHours: number;
      notes: string;
    }) => {
      const actor = await getActor();
      return actor.saveDailyCheckin(
        args.date,
        args.mood,
        args.workHours,
        args.exerciseHours,
        args.restHours,
        args.notes,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dailyCheckins"] }),
  });
}

// ─── 12-Step Progress ─────────────────────────────────────────────────────────

export function useAllStepProgress() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["stepProgress"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStepProgress();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveStepProgress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      stepNumber: bigint;
      status: StepStatus;
      notes: string;
    }) => {
      const actor = await getActor();
      return actor.saveStepProgress(args.stepNumber, args.status, args.notes);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["stepProgress"] }),
  });
}

// ─── Medications ──────────────────────────────────────────────────────────────

export function useAllMedications() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["medications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMedications();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddOrUpdateMedication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      id: bigint;
      name: string;
      dosage: string;
      frequency: string;
      timeOfDay: string;
      active: boolean;
    }) => {
      const actor = await getActor();
      return actor.addOrUpdateMedication(
        args.id,
        args.name,
        args.dosage,
        args.frequency,
        args.timeOfDay,
        args.active,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["medications"] }),
  });
}

export function useDeleteMedication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      const actor = await getActor();
      return actor.deleteMedication(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["medications"] }),
  });
}

export function useLogMedication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      date: string;
      medicationId: bigint;
      taken: boolean;
    }) => {
      const actor = await getActor();
      return actor.logMedication(args.date, args.medicationId, args.taken);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["medicationLogs"] });
    },
  });
}

export function useMedicationLogsForRange(startDate: string, endDate: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["medicationLogs", startDate, endDate],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMedicationLogsForRange(startDate, endDate);
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Appointments ─────────────────────────────────────────────────────────────

export function useAllAppointments() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAppointments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddOrUpdateAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      id: bigint;
      providerName: string;
      appointmentType: string;
      dateTime: string;
      notes: string;
      completed: boolean;
    }) => {
      const actor = await getActor();
      return actor.addOrUpdateAppointment(
        args.id,
        args.providerName,
        args.appointmentType,
        args.dateTime,
        args.notes,
        args.completed,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });
}

export function useDeleteAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      const actor = await getActor();
      return actor.deleteAppointment(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });
}

export function useUpdateAppointmentCompleted() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { id: bigint; completed: boolean }) => {
      const actor = await getActor();
      return actor.updateAppointmentCompleted(args.id, args.completed);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });
}

// ─── Journal ──────────────────────────────────────────────────────────────────

export function useAllJournalEntries() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["journalEntries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllJournalEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddOrUpdateJournalEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      id: bigint;
      date: string;
      content: string;
      tags: string[];
    }) => {
      const actor = await getActor();
      return actor.addOrUpdateJournalEntry(
        args.id,
        args.date,
        args.content,
        args.tags,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["journalEntries"] }),
  });
}

export function useDeleteJournalEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      const actor = await getActor();
      return actor.deleteJournalEntry(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["journalEntries"] }),
  });
}

// ─── Habits ───────────────────────────────────────────────────────────────────

export function useHabitCompletionsForDate(date: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["habitCompletions", date],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHabitCompletionsForDate(date);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveHabitCompletion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      date: string;
      habitName: string;
      completed: boolean;
    }) => {
      const actor = await getActor();
      return actor.saveHabitCompletion(
        args.date,
        args.habitName,
        args.completed,
      );
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["habitCompletions", vars.date] });
    },
  });
}
