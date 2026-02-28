import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DailyCheckin {
    date: string;
    mood: bigint;
    restHours: number;
    notes: string;
    exerciseHours: number;
    workHours: number;
}
export type Time = bigint;
export interface JournalEntry {
    id: bigint;
    content: string;
    date: string;
    tags: Array<string>;
}
export interface HabitCompletion {
    date: string;
    habitName: string;
    completed: boolean;
}
export interface TwelveStepProgress {
    status: StepStatus;
    lastUpdated: Time;
    stepNumber: bigint;
    notes: string;
}
export interface MedicationLog {
    taken: boolean;
    date: string;
    medicationId: bigint;
}
export interface Appointment {
    id: bigint;
    completed: boolean;
    appointmentType: string;
    notes: string;
    providerName: string;
    dateTime: string;
}
export interface Medication {
    id: bigint;
    active: boolean;
    dosage: string;
    name: string;
    frequency: string;
    timeOfDay: string;
}
export enum StepStatus {
    notStarted = "notStarted",
    completed = "completed",
    inProgress = "inProgress"
}
export interface backendInterface {
    addOrUpdateAppointment(id: bigint, providerName: string, appointmentType: string, dateTime: string, notes: string, completed: boolean): Promise<void>;
    addOrUpdateJournalEntry(id: bigint, date: string, content: string, tags: Array<string>): Promise<void>;
    addOrUpdateMedication(id: bigint, name: string, dosage: string, frequency: string, timeOfDay: string, active: boolean): Promise<void>;
    deleteAppointment(id: bigint): Promise<void>;
    deleteJournalEntry(id: bigint): Promise<void>;
    deleteMedication(id: bigint): Promise<void>;
    getAllAppointments(): Promise<Array<Appointment>>;
    getAllDailyCheckins(): Promise<Array<DailyCheckin>>;
    getAllJournalEntries(): Promise<Array<JournalEntry>>;
    getAllMedications(): Promise<Array<Medication>>;
    getAllStepProgress(): Promise<Array<TwelveStepProgress>>;
    getHabitCompletionsForDate(date: string): Promise<Array<HabitCompletion>>;
    getMedicationLogsForRange(_startDate: string, _endDate: string): Promise<Array<MedicationLog>>;
    logMedication(date: string, medicationId: bigint, taken: boolean): Promise<void>;
    saveDailyCheckin(date: string, mood: bigint, workHours: number, exerciseHours: number, restHours: number, notes: string): Promise<void>;
    saveHabitCompletion(date: string, habitName: string, completed: boolean): Promise<void>;
    saveStepProgress(stepNumber: bigint, status: StepStatus, notes: string): Promise<void>;
    updateAppointmentCompleted(_id: bigint, _completed: boolean): Promise<void>;
}
