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
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Calendar,
  CheckCircle2,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { Appointment } from "../backend.d";
import {
  useAddOrUpdateAppointment,
  useAllAppointments,
  useDeleteAppointment,
  useUpdateAppointmentCompleted,
} from "../hooks/useQueries";
import { APPOINTMENT_TYPES, formatDateTime } from "../utils/constants";

const APPT_COLORS: Record<string, string> = {
  Therapist: "bg-sage-100 text-sage-700 border-sage-200",
  Psychiatrist: "bg-purple-100 text-purple-700 border-purple-200",
  "General Practitioner": "bg-blue-100 text-blue-700 border-blue-200",
  "Support Group": "bg-amber-100 text-amber-700 border-amber-200",
  Nutritionist: "bg-green-100 text-green-700 border-green-200",
  "Physical Therapist": "bg-orange-100 text-orange-700 border-orange-200",
  Other: "bg-gray-100 text-gray-700 border-gray-200",
};

type ApptForm = {
  providerName: string;
  appointmentType: string;
  dateTime: string;
  notes: string;
};

const defaultForm: ApptForm = {
  providerName: "",
  appointmentType: "Therapist",
  dateTime: "",
  notes: "",
};

export default function Appointments() {
  const { data: appointments, isLoading } = useAllAppointments();
  const addOrUpdate = useAddOrUpdateAppointment();
  const deleteAppt = useDeleteAppointment();
  const markCompleted = useUpdateAppointmentCompleted();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAppt, setEditingAppt] = useState<Appointment | null>(null);
  const [form, setForm] = useState<ApptForm>(defaultForm);
  const [deleteTarget, setDeleteTarget] = useState<Appointment | null>(null);
  const [saving, setSaving] = useState(false);
  const [completingId, setCompletingId] = useState<bigint | null>(null);

  const now = new Date().toISOString();

  const upcoming = useMemo(
    () =>
      (appointments || [])
        .filter((a) => !a.completed && a.dateTime >= now)
        .sort((a, b) => a.dateTime.localeCompare(b.dateTime)),
    [appointments, now],
  );

  const past = useMemo(
    () =>
      (appointments || [])
        .filter((a) => a.completed || a.dateTime < now)
        .sort((a, b) => b.dateTime.localeCompare(a.dateTime)),
    [appointments, now],
  );

  const openAdd = () => {
    setEditingAppt(null);
    setForm(defaultForm);
    setModalOpen(true);
  };

  const openEdit = (appt: Appointment) => {
    setEditingAppt(appt);
    // Convert ISO to local datetime-local format
    const d = new Date(appt.dateTime);
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setForm({
      providerName: appt.providerName,
      appointmentType: appt.appointmentType,
      dateTime: local,
      notes: appt.notes,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.providerName.trim()) {
      toast.error("Provider name is required");
      return;
    }
    if (!form.dateTime) {
      toast.error("Date and time are required");
      return;
    }
    setSaving(true);
    try {
      await addOrUpdate.mutateAsync({
        id: editingAppt?.id ?? BigInt(Date.now()),
        providerName: form.providerName,
        appointmentType: form.appointmentType,
        dateTime: new Date(form.dateTime).toISOString(),
        notes: form.notes,
        completed: editingAppt?.completed ?? false,
      });
      toast.success(editingAppt ? "Appointment updated" : "Appointment added");
      setModalOpen(false);
    } catch {
      toast.error("Failed to save appointment");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteAppt.mutateAsync(deleteTarget.id);
      toast.success("Appointment removed");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete appointment");
    }
  };

  const handleMarkCompleted = async (appt: Appointment) => {
    setCompletingId(appt.id);
    try {
      await markCompleted.mutateAsync({ id: appt.id, completed: true });
      toast.success("Appointment marked as completed ✓");
    } catch {
      toast.error("Failed to update appointment");
    } finally {
      setCompletingId(null);
    }
  };

  const AppointmentCard = ({
    appt,
    showComplete,
  }: { appt: Appointment; showComplete?: boolean }) => {
    const colorClass = APPT_COLORS[appt.appointmentType] ?? APPT_COLORS.Other;
    const isCompleting = completingId?.toString() === appt.id.toString();

    return (
      <Card className="hover:shadow-wellness transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-foreground leading-snug">
                  {appt.providerName}
                </p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge
                    variant="outline"
                    className={cn("text-[10px] px-1.5 py-0.5", colorClass)}
                  >
                    {appt.appointmentType}
                  </Badge>
                  {appt.completed && (
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0.5 bg-secondary/50 text-primary border-secondary"
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Done
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  {formatDateTime(appt.dateTime)}
                </p>
                {appt.notes && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1 italic">
                    {appt.notes}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              {showComplete && !appt.completed && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-8 text-primary border-primary/30 hover:bg-secondary/50"
                  disabled={isCompleting}
                  onClick={() => handleMarkCompleted(appt)}
                >
                  {isCompleting ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Done
                    </>
                  )}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => openEdit(appt)}
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => setDeleteTarget(appt)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-24 lg:pb-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-1">
            Professional Support
          </p>
          <h1 className="font-display text-3xl font-semibold text-foreground">
            Appointments
          </h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Your support team is an essential part of recovery.
          </p>
        </div>
        <Button
          onClick={openAdd}
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Upcoming */}
          <div>
            <h2 className="font-display text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              Upcoming
              {upcoming.length > 0 && (
                <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                  {upcoming.length}
                </Badge>
              )}
            </h2>
            {upcoming.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-border rounded-xl">
                <p className="text-4xl mb-3">📅</p>
                <p className="text-foreground font-medium">
                  No upcoming appointments
                </p>
                <p className="text-muted-foreground text-sm mt-1 mb-4">
                  Schedule sessions with your therapist, psychiatrist, or doctor
                </p>
                <Button onClick={openAdd} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1.5" />
                  Schedule Appointment
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {upcoming.map((appt) => (
                  <motion.div
                    key={appt.id.toString()}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AppointmentCard appt={appt} showComplete />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Past */}
          {past.length > 0 && (
            <div>
              <h2 className="font-display text-base font-semibold text-foreground mb-3 text-muted-foreground">
                Past & Completed
              </h2>
              <div className="space-y-2 opacity-75">
                {past.slice(0, 5).map((appt) => (
                  <AppointmentCard key={appt.id.toString()} appt={appt} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingAppt ? "Edit Appointment" : "Add Appointment"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Provider Name</Label>
              <Input
                placeholder="e.g., Dr. Sarah Chen"
                value={form.providerName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, providerName: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select
                value={form.appointmentType}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, appointmentType: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {APPOINTMENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Date & Time</Label>
              <Input
                type="datetime-local"
                value={form.dateTime}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dateTime: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Notes (optional)</Label>
              <Textarea
                placeholder="Agenda, concerns to discuss, questions to ask…"
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                rows={3}
                className="resize-none text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {saving ? (
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
            <AlertDialogTitle>Remove Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Remove appointment with {deleteTarget?.providerName}?
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
