import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";

actor {
  // Types
  type StepStatus = {
    #notStarted;
    #inProgress;
    #completed;
  };

  type TwelveStepProgress = {
    stepNumber : Nat;
    status : StepStatus;
    notes : Text;
    lastUpdated : Time.Time;
  };

  type DailyCheckin = {
    date : Text;
    mood : Nat;
    workHours : Float;
    exerciseHours : Float;
    restHours : Float;
    notes : Text;
  };

  type Medication = {
    id : Nat;
    name : Text;
    dosage : Text;
    frequency : Text;
    timeOfDay : Text;
    active : Bool;
  };

  type MedicationLog = {
    date : Text;
    medicationId : Nat;
    taken : Bool;
  };

  type Appointment = {
    id : Nat;
    providerName : Text;
    appointmentType : Text;
    dateTime : Text;
    notes : Text;
    completed : Bool;
  };

  type JournalEntry = {
    id : Nat;
    date : Text;
    content : Text;
    tags : [Text];
  };

  type HabitCompletion = {
    date : Text;
    habitName : Text;
    completed : Bool;
  };

  // Maps
  let steps = Map.empty<Nat, TwelveStepProgress>();
  let checkins = Map.empty<Text, DailyCheckin>();
  let medications = Map.empty<Nat, Medication>();
  let medicationLogs = Map.empty<Nat, MedicationLog>();
  let appointments = Map.empty<Nat, Appointment>();
  let journalEntries = Map.empty<Nat, JournalEntry>();
  let habitCompletions = Map.empty<Text, HabitCompletion>();

  // ID counters
  var nextMedicationLogId = 0;

  module TwelveStepProgress {
    public func compare(a : TwelveStepProgress, b : TwelveStepProgress) : Order.Order {
      Nat.compare(a.stepNumber, b.stepNumber);
    };
  };

  // 12 Step Progress Functions
  public shared ({ caller }) func saveStepProgress(stepNumber : Nat, status : StepStatus, notes : Text) : async () {
    let progress : TwelveStepProgress = {
      stepNumber;
      status;
      notes;
      lastUpdated = Time.now();
    };
    steps.add(stepNumber, progress);
  };

  public query ({ caller }) func getAllStepProgress() : async [TwelveStepProgress] {
    steps.values().toArray().sort();
  };

  // Daily Check-in Functions
  public shared ({ caller }) func saveDailyCheckin(date : Text, mood : Nat, workHours : Float, exerciseHours : Float, restHours : Float, notes : Text) : async () {
    let checkin : DailyCheckin = {
      date;
      mood;
      workHours;
      exerciseHours;
      restHours;
      notes;
    };
    checkins.add(date, checkin);
  };

  public query ({ caller }) func getAllDailyCheckins() : async [DailyCheckin] {
    checkins.values().toArray();
  };

  // Medication Functions
  public shared ({ caller }) func addOrUpdateMedication(id : Nat, name : Text, dosage : Text, frequency : Text, timeOfDay : Text, active : Bool) : async () {
    let medication : Medication = {
      id;
      name;
      dosage;
      frequency;
      timeOfDay;
      active;
    };
    medications.add(id, medication);
  };

  public shared ({ caller }) func deleteMedication(id : Nat) : async () {
    if (not medications.containsKey(id)) {
      Runtime.trap("Medication does not exist");
    };
    medications.remove(id);
  };

  public query ({ caller }) func getAllMedications() : async [Medication] {
    medications.values().toArray();
  };

  // Medication Log Functions
  public shared ({ caller }) func logMedication(date : Text, medicationId : Nat, taken : Bool) : async () {
    let log : MedicationLog = {
      date;
      medicationId;
      taken;
    };
    medicationLogs.add(nextMedicationLogId, log);
    nextMedicationLogId += 1;
  };

  public query ({ caller }) func getMedicationLogsForRange(_startDate : Text, _endDate : Text) : async [MedicationLog] {
    // In a real implementation, parse and compare dates here.
    medicationLogs.values().toArray();
  };

  // Appointment Functions
  public shared ({ caller }) func addOrUpdateAppointment(id : Nat, providerName : Text, appointmentType : Text, dateTime : Text, notes : Text, completed : Bool) : async () {
    let appointment : Appointment = {
      id;
      providerName;
      appointmentType;
      dateTime;
      notes;
      completed;
    };
    appointments.add(id, appointment);
  };

  public shared ({ caller }) func deleteAppointment(id : Nat) : async () {
    if (not appointments.containsKey(id)) {
      Runtime.trap("Appointment does not exist");
    };
    appointments.remove(id);
  };

  public query ({ caller }) func getAllAppointments() : async [Appointment] {
    appointments.values().toArray();
  };

  // Journal Entry Functions
  public shared ({ caller }) func addOrUpdateJournalEntry(id : Nat, date : Text, content : Text, tags : [Text]) : async () {
    let entry : JournalEntry = {
      id;
      date;
      content;
      tags;
    };
    journalEntries.add(id, entry);
  };

  public shared ({ caller }) func deleteJournalEntry(id : Nat) : async () {
    if (not journalEntries.containsKey(id)) {
      Runtime.trap("Journal entry does not exist");
    };
    journalEntries.remove(id);
  };

  public query ({ caller }) func getAllJournalEntries() : async [JournalEntry] {
    journalEntries.values().toArray();
  };

  // Habit Completion Functions
  public shared ({ caller }) func saveHabitCompletion(date : Text, habitName : Text, completed : Bool) : async () {
    let habit : HabitCompletion = {
      date;
      habitName;
      completed;
    };
    habitCompletions.add(date # habitName, habit);
  };

  public query ({ caller }) func getHabitCompletionsForDate(date : Text) : async [HabitCompletion] {
    let results = List.empty<HabitCompletion>();
    for (habit in habitCompletions.values()) {
      if (habit.date == date) {
        results.add(habit);
      };
    };
    results.toArray();
  };

  public shared ({ caller }) func updateAppointmentCompleted(_id : Nat, _completed : Bool) : async () { () };
};
