import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { Medication } from "../backend.d";
import {
  useAddOrUpdateMedication,
  useAllMedications,
  useDeleteMedication,
  useLogMedication,
  useMedicationLogsForRange,
} from "../hooks/useQueries";
import {
  FREQUENCY_OPTIONS,
  TIME_OF_DAY_OPTIONS,
  daysAgo,
  today,
} from "../utils/constants";

type MedForm = {
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: string;
  active: boolean;
};

const defaultForm: MedForm = {
  name: "",
  dosage: "",
  frequency: "Once daily",
  timeOfDay: "Morning",
  active: true,
};

export default function MedicationTracker() {
  const { data: medications, isLoading } = useAllMedications();
  const addOrUpdate = useAddOrUpdateMedication();
  const deleteMed = useDeleteMedication();
  const logMed = useLogMedication();

  const todayStr = today();
  const start7 = daysAgo(7);
  const { data: medLogs } = useMedicationLogsForRange(start7, todayStr);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState<Medication | null>(null);
  const [form, setForm] = useState<MedForm>(defaultForm);
  const [deleteTarget, setDeleteTarget] = useState<Medication | null>(null);
  const [loggingId, setLoggingId] = useState<bigint | null>(null);
  const [savingMed, setSavingMed] = useState(false);

  const activeMeds = useMemo(
    () => (medications || []).filter((m) => m.active),
    [medications],
  );
  const inactiveMeds = useMemo(
    () => (medications || []).filter((m) => !m.active),
    [medications],
  );

  // Today's logs
  const todaysLogs = useMemo(
    () => (medLogs || []).filter((l) => l.date === todayStr),
    [medLogs, todayStr],
  );

  const getTodayLog = (medId: bigint) =>
    todaysLogs.find((l) => l.medicationId.toString() === medId.toString());

  // Adherence for each med (last 7 days)
  const getAdherence = (medId: bigint) => {
    const logs = (medLogs || []).filter(
      (l) => l.medicationId.toString() === medId.toString(),
    );
    if (logs.length === 0) return null;
    const taken = logs.filter((l) => l.taken).length;
    return Math.round((taken / logs.length) * 100);
  };

  const openAdd = () => {
    setEditingMed(null);
    setForm(defaultForm);
    setModalOpen(true);
  };

  const openEdit = (med: Medication) => {
    setEditingMed(med);
    setForm({
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      timeOfDay: med.timeOfDay,
      active: med.active,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Medication name is required");
      return;
    }
    setSavingMed(true);
    try {
      await addOrUpdate.mutateAsync({
        id: editingMed?.id ?? BigInt(Date.now()),
        ...form,
      });
      toast.success(editingMed ? "Medication updated" : "Medication added");
      setModalOpen(false);
    } catch {
      toast.error("Failed to save medication");
    } finally {
      setSavingMed(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMed.mutateAsync(deleteTarget.id);
      toast.success("Medication removed");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete medication");
    }
  };

  const handleLog = async (medId: bigint, taken: boolean) => {
    setLoggingId(medId);
    try {
      await logMed.mutateAsync({ date: todayStr, medicationId: medId, taken });
      toast.success(taken ? "Marked as taken ✓" : "Marked as skipped");
    } catch {
      toast.error("Failed to log medication");
    } finally {
      setLoggingId(null);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-24 lg:pb-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-1">
            Health Support
          </p>
          <h1 className="font-display text-3xl font-semibold text-foreground">
            Medications
          </h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Consistent medication is part of your care plan.
          </p>
        </div>
        <Button
          onClick={openAdd}
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Med
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          {/* Today's Medication Log */}
          {activeMeds.length > 0 && (
            <div className="mb-8">
              <h2 className="font-display text-base font-semibold text-foreground mb-3">
                Today's Medications
              </h2>
              <div className="space-y-2">
                {activeMeds.map((med) => {
                  const todayLog = getTodayLog(med.id);
                  const isLogging = loggingId?.toString() === med.id.toString();
                  const adherence = getAdherence(med.id);

                  return (
                    <motion.div
                      key={med.id.toString()}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "rounded-xl border p-4 transition-all",
                        todayLog?.taken
                          ? "bg-secondary/30 border-secondary/60"
                          : todayLog
                            ? "bg-destructive/5 border-destructive/20"
                            : "bg-card border-border",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">
                              {med.name}
                            </p>
                            {todayLog?.taken && (
                              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                            )}
                            {todayLog && !todayLog.taken && (
                              <XCircle className="w-4 h-4 text-destructive shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {med.dosage} · {med.frequency} · {med.timeOfDay}
                          </p>
                          {adherence !== null && (
                            <div className="flex items-center gap-2 mt-2">
                              <Progress
                                value={adherence}
                                className="h-1 w-20"
                              />
                              <span className="text-xs text-muted-foreground">
                                {adherence}% (7 days)
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <Button
                            size="sm"
                            variant={todayLog?.taken ? "secondary" : "default"}
                            className={cn(
                              "text-xs h-8",
                              !todayLog?.taken &&
                                "bg-primary text-primary-foreground hover:bg-primary/90",
                            )}
                            disabled={isLogging}
                            onClick={() => handleLog(med.id, !todayLog?.taken)}
                          >
                            {isLogging ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : todayLog?.taken ? (
                              "Undo"
                            ) : (
                              "Taken"
                            )}
                          </Button>
                          {!todayLog?.taken && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-xs h-8 text-destructive hover:text-destructive"
                              onClick={() => handleLog(med.id, false)}
                              disabled={isLogging || todayLog?.taken === false}
                            >
                              {todayLog?.taken === false ? "Skipped" : "Skip"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* All Medications */}
          <div>
            <h2 className="font-display text-base font-semibold text-foreground mb-3">
              All Medications
            </h2>
            {(medications || []).length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-xl">
                <p className="text-4xl mb-3">💊</p>
                <p className="text-foreground font-medium">
                  No medications added
                </p>
                <p className="text-muted-foreground text-sm mt-1 mb-4">
                  Add your prescribed medications to track adherence
                </p>
                <Button onClick={openAdd} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Medication
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {[...activeMeds, ...inactiveMeds].map((med) => (
                  <Card
                    key={med.id.toString()}
                    className={cn(!med.active && "opacity-60")}
                  >
                    <CardContent className="p-4 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm text-foreground">
                            {med.name}
                          </p>
                          <Badge
                            variant={med.active ? "default" : "secondary"}
                            className={cn(
                              "text-[10px] px-1.5",
                              med.active &&
                                "bg-primary/20 text-primary border-primary/30",
                            )}
                          >
                            {med.active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {med.dosage} · {med.frequency} · {med.timeOfDay}
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => openEdit(med)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => setDeleteTarget(med)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingMed ? "Edit Medication" : "Add Medication"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Medication Name</Label>
              <Input
                placeholder="e.g., Sertraline, Lexapro"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Dosage</Label>
              <Input
                placeholder="e.g., 50mg, 10mg"
                value={form.dosage}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dosage: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Frequency</Label>
                <Select
                  value={form.frequency}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, frequency: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FREQUENCY_OPTIONS.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Time of Day</Label>
                <Select
                  value={form.timeOfDay}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, timeOfDay: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_OF_DAY_OPTIONS.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Active Medication</Label>
              <Switch
                checked={form.active}
                onCheckedChange={(v) => setForm((f) => ({ ...f, active: v }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={savingMed}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {savingMed ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Medication</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {deleteTarget?.name}? This will
              also delete all associated logs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
