# Recovery & Balance Companion

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- **12-Step Workaholism Anonymous Program tracker**: Display all 12 steps with descriptions, allow users to mark each step as in-progress or completed, add personal notes per step.
- **Daily Check-in system**: Mood/energy check-in (1-10 scale), work hours logged, exercise hours logged, rest hours logged.
- **Medication tracker**: Add medications with name, dosage, frequency, and time reminders. Log daily medication taken/skipped. View adherence history.
- **Psychiatric appointment scheduler**: Add upcoming appointments (therapist, psychiatrist, doctor), notes per appointment, appointment history.
- **Recovery journal**: Free-text daily journal entries with date/time, taggable by category (work, exercise, rest, medication, mental health).
- **Healthy habits tracker**: Track habits like sleep, breaks, social time, leisure, meditation — with daily completion checkboxes.
- **Resource library**: Curated static list of psychological resources, hotlines, and tips for workaholism and exercise addiction recovery.
- **Progress dashboard**: Summary of 12-step progress, medication adherence %, days journaled, upcoming appointments, streak for daily check-ins.

### Modify
N/A — new project.

### Remove
N/A — new project.

## Implementation Plan
1. Backend (Motoko):
   - Store user's 12-step progress (step index, status, notes)
   - Store daily check-ins (date, mood, work hours, exercise hours, rest hours)
   - Store medications (name, dosage, frequency, time) and daily medication logs
   - Store psychiatric appointments (date, provider, type, notes)
   - Store journal entries (date, content, tags)
   - Store daily habit completions (habit name, date, completed)
   - Query functions for dashboard summary stats

2. Frontend (React):
   - Dashboard home with summary cards
   - 12-Step Program page with step-by-step progress UI
   - Daily Check-in page/modal
   - Medication Tracker page
   - Appointments page
   - Journal page
   - Habits page
   - Resources page (static)
   - Bottom navigation or sidebar for routing
