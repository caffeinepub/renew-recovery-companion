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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { BookOpen, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { JournalEntry } from "../backend.d";
import {
  useAddOrUpdateJournalEntry,
  useAllJournalEntries,
  useDeleteJournalEntry,
} from "../hooks/useQueries";
import { JOURNAL_TAGS, formatDate, today } from "../utils/constants";

type JournalForm = {
  date: string;
  content: string;
  tags: string[];
};

const defaultForm = (): JournalForm => ({
  date: today(),
  content: "",
  tags: [],
});

const TAG_COLORS: Record<string, string> = {
  "mental health": "bg-purple-100 text-purple-700 border-purple-200",
  work: "bg-blue-100 text-blue-700 border-blue-200",
  exercise: "bg-orange-100 text-orange-700 border-orange-200",
  rest: "bg-sage-100 text-sage-700 border-sage-200",
  medication: "bg-amber-100 text-amber-700 border-amber-200",
  gratitude: "bg-pink-100 text-pink-700 border-pink-200",
  relationships: "bg-rose-100 text-rose-700 border-rose-200",
  progress: "bg-emerald-100 text-emerald-700 border-emerald-200",
  setback: "bg-red-100 text-red-700 border-red-200",
  reflection: "bg-indigo-100 text-indigo-700 border-indigo-200",
};

function getTagColor(tag: string): string {
  return TAG_COLORS[tag] ?? "bg-muted text-muted-foreground border-border";
}

export default function Journal() {
  const { data: entries, isLoading } = useAllJournalEntries();
  const addOrUpdate = useAddOrUpdateJournalEntry();
  const deleteEntry = useDeleteJournalEntry();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<JournalEntry | null>(null);
  const [form, setForm] = useState<JournalForm>(defaultForm());
  const [deleteTarget, setDeleteTarget] = useState<JournalEntry | null>(null);
  const [saving, setSaving] = useState(false);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sortedEntries = useMemo(() => {
    const all = [...(entries || [])].sort((a, b) =>
      b.date.localeCompare(a.date),
    );
    if (tagFilter) return all.filter((e) => e.tags.includes(tagFilter));
    return all;
  }, [entries, tagFilter]);

  const openAdd = () => {
    setEditing(null);
    setForm(defaultForm());
    setModalOpen(true);
  };

  const openEdit = (entry: JournalEntry) => {
    setEditing(entry);
    setForm({
      date: entry.date,
      content: entry.content,
      tags: [...entry.tags],
    });
    setModalOpen(true);
  };

  const toggleTag = (tag: string) => {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag)
        ? f.tags.filter((t) => t !== tag)
        : [...f.tags, tag],
    }));
  };

  const handleSave = async () => {
    if (!form.content.trim()) {
      toast.error("Entry content is required");
      return;
    }
    setSaving(true);
    try {
      await addOrUpdate.mutateAsync({
        id: editing?.id ?? BigInt(Date.now()),
        date: form.date,
        content: form.content,
        tags: form.tags,
      });
      toast.success(editing ? "Entry updated" : "Entry saved 📝");
      setModalOpen(false);
    } catch {
      toast.error("Failed to save entry");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteEntry.mutateAsync(deleteTarget.id);
      toast.success("Entry deleted");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete entry");
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-24 lg:pb-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-1">
            Inner Reflection
          </p>
          <h1 className="font-display text-3xl font-semibold text-foreground">
            Journal
          </h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Writing is a powerful tool for healing and self-discovery.
          </p>
        </div>
        <Button
          onClick={openAdd}
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Write
        </Button>
      </div>

      {/* Tag Filter */}
      <div className="mb-5 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setTagFilter(null)}
          className={cn(
            "px-2.5 py-1 rounded-full text-xs font-medium border transition-all",
            !tagFilter
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-muted-foreground border-border hover:border-primary/40",
          )}
        >
          All
        </button>
        {JOURNAL_TAGS.map((tag) => (
          <button
            type="button"
            key={tag}
            onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium border transition-all",
              tagFilter === tag
                ? `${getTagColor(tag)} opacity-100`
                : "bg-card text-muted-foreground border-border hover:border-primary/40",
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : sortedEntries.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <BookOpen className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-foreground font-medium">
            {tagFilter
              ? `No entries tagged "${tagFilter}"`
              : "Your journal is empty"}
          </p>
          <p className="text-muted-foreground text-sm mt-1 mb-4">
            {tagFilter
              ? "Try a different filter"
              : "Start writing — even a few sentences can bring clarity"}
          </p>
          {!tagFilter && (
            <Button onClick={openAdd} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-1.5" />
              Write First Entry
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {sortedEntries.map((entry) => {
              const isExpanded = expandedId === entry.id.toString();
              return (
                <motion.div
                  key={entry.id.toString()}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                >
                  <Card className="hover:shadow-wellness transition-shadow cursor-pointer">
                    <CardHeader
                      className="pb-2 pt-4 px-4"
                      onClick={() =>
                        setExpandedId(isExpanded ? null : entry.id.toString())
                      }
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-display text-sm font-semibold text-foreground">
                            {formatDate(entry.date)}
                          </p>
                          {entry.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {entry.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className={cn(
                                    "text-[10px] px-1.5 py-0.5 rounded-full border",
                                    getTagColor(tag),
                                  )}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEdit(entry);
                            }}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTarget(entry);
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <button
                        type="button"
                        className={cn(
                          "text-sm text-muted-foreground leading-relaxed text-left w-full bg-transparent border-none p-0 cursor-pointer",
                          !isExpanded && "line-clamp-3",
                        )}
                        onClick={() =>
                          setExpandedId(isExpanded ? null : entry.id.toString())
                        }
                      >
                        {entry.content}
                      </button>
                      {entry.content.length > 200 && (
                        <button
                          type="button"
                          className="text-xs text-primary mt-1.5 hover:underline"
                          onClick={() =>
                            setExpandedId(
                              isExpanded ? null : entry.id.toString(),
                            )
                          }
                        >
                          {isExpanded ? "Show less" : "Read more"}
                        </button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Write/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editing ? "Edit Entry" : "New Journal Entry"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Entry</Label>
              <Textarea
                placeholder="What's on your mind? How are you feeling? What are you grateful for today? What's one small step forward?"
                value={form.content}
                onChange={(e) =>
                  setForm((f) => ({ ...f, content: e.target.value }))
                }
                rows={8}
                className="resize-none text-sm leading-relaxed"
              />
            </div>
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-1.5">
                {JOURNAL_TAGS.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium border transition-all",
                      form.tags.includes(tag)
                        ? getTagColor(tag)
                        : "bg-card text-muted-foreground border-border hover:border-primary/40",
                    )}
                  >
                    {form.tags.includes(tag) && (
                      <X className="w-3 h-3 inline mr-1 -mt-0.5" />
                    )}
                    {tag}
                  </button>
                ))}
              </div>
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
              ) : editing ? (
                "Update Entry"
              ) : (
                "Save Entry"
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
            <AlertDialogTitle>Delete Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Delete your entry from{" "}
              {deleteTarget && formatDate(deleteTarget.date)}? This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
