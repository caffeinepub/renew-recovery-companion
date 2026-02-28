// ─── Workaholics Anonymous 12 Steps ──────────────────────────────────────────

export const WA_STEPS = [
  {
    number: 1,
    title: "Admitted Powerlessness",
    description:
      "We admitted we were powerless over work—that our lives had become unmanageable. We recognized that our compulsive working had taken control and that on our own, we could not stop.",
  },
  {
    number: 2,
    title: "Came to Believe",
    description:
      "Came to believe that a Power greater than ourselves could restore us to sanity. We opened ourselves to the possibility of healing through something beyond our own willpower.",
  },
  {
    number: 3,
    title: "Turned Our Will Over",
    description:
      "Made a decision to turn our will and our lives over to the care of God as we understood God. We chose to release our need for control and trust in a higher source of guidance.",
  },
  {
    number: 4,
    title: "Moral Inventory",
    description:
      "Made a searching and fearless moral inventory of ourselves. We honestly examined our patterns, behaviors, beliefs, and the ways that workaholism had shaped our lives and relationships.",
  },
  {
    number: 5,
    title: "Admitted Our Wrongs",
    description:
      "Admitted to God, to ourselves, and to another human being the exact nature of our wrongs. We found courage to share our inventory with a trusted person, releasing shame through honesty.",
  },
  {
    number: 6,
    title: "Ready for Removal",
    description:
      "Were entirely ready to have God remove all these defects of character. We became willing to let go of the beliefs and behaviors that drove our workaholism.",
  },
  {
    number: 7,
    title: "Humbly Asked for Removal",
    description:
      "Humbly asked God to remove our shortcomings. We surrendered our defects with humility, trusting in our higher power to help transform us.",
  },
  {
    number: 8,
    title: "Made a List",
    description:
      "Made a list of all persons we had harmed, and became willing to make amends to them all. We honestly reflected on how our workaholism had affected others—family, friends, colleagues.",
  },
  {
    number: 9,
    title: "Made Direct Amends",
    description:
      "Made direct amends to such people wherever possible, except when to do so would injure them or others. We repaired relationships and took responsibility for our actions.",
  },
  {
    number: 10,
    title: "Continued Personal Inventory",
    description:
      "Continued to take personal inventory and when we were wrong, promptly admitted it. We commit to ongoing self-reflection, catching and correcting compulsive patterns as they arise.",
  },
  {
    number: 11,
    title: "Sought Conscious Contact",
    description:
      "Sought through prayer and meditation to improve our conscious contact with God as we understood God, praying only for knowledge of God's will for us and the power to carry that out.",
  },
  {
    number: 12,
    title: "Carried the Message",
    description:
      "Having had a spiritual awakening as the result of these steps, we tried to carry this message to other workaholics and to practice these principles in all our affairs.",
  },
];

// ─── Recovery Habits ──────────────────────────────────────────────────────────

export const RECOVERY_HABITS = [
  {
    name: "Sleep 7–9 Hours",
    icon: "🌙",
    description: "Rest is not laziness — it is essential for recovery.",
  },
  {
    name: "Take Scheduled Breaks",
    icon: "⏸️",
    description: "Step away from work every 90 minutes.",
  },
  {
    name: "Leisure Time",
    icon: "🌿",
    description:
      "Engage in an activity purely for enjoyment, not productivity.",
  },
  {
    name: "Social Connection",
    icon: "🤝",
    description: "Spend quality time with loved ones or friends.",
  },
  {
    name: "Meditation / Mindfulness",
    icon: "🧘",
    description: "Practice present-moment awareness for 10+ minutes.",
  },
  {
    name: "Avoid Working Overtime",
    icon: "🚫",
    description: "Honor boundaries around your work schedule.",
  },
  {
    name: "Rest Day (No Exercise)",
    icon: "🛋️",
    description: "Allow your body full rest at least once per week.",
  },
  {
    name: "Creative Activity",
    icon: "🎨",
    description: "Express yourself through art, music, writing, or craft.",
  },
];

// ─── Motivational Recovery Quotes ────────────────────────────────────────────

export const RECOVERY_QUOTES = [
  {
    text: "Recovery is not a race. You don't have to feel guilty if it takes you longer than you thought.",
    author: "Unknown",
  },
  {
    text: "Rest is not idle, it is the wisdom to restore body and mind for greater purpose.",
    author: "Workaholics Anonymous",
  },
  {
    text: "The most important thing you can do for your work is to stop working and rest.",
    author: "Recovery Wisdom",
  },
  {
    text: "Balance is not something you find, it's something you create.",
    author: "Jana Kingsford",
  },
  {
    text: "You are worthy of rest. You are worthy of joy. You are enough without your productivity.",
    author: "Recovery Community",
  },
  {
    text: "Healing is not linear — every small step forward is a victory worth celebrating.",
    author: "Workaholics Anonymous",
  },
  {
    text: "Slow down and everything you are chasing will come around and catch you.",
    author: "John De Paola",
  },
  {
    text: "You can't pour from an empty cup. Take care of yourself first.",
    author: "Recovery Wisdom",
  },
  {
    text: "Progress, not perfection. One day at a time.",
    author: "12-Step Tradition",
  },
  {
    text: "The body is not a machine to be optimized — it is a home to be cherished.",
    author: "Recovery Wisdom",
  },
];

// ─── Journal Tags ─────────────────────────────────────────────────────────────

export const JOURNAL_TAGS = [
  "mental health",
  "work",
  "exercise",
  "rest",
  "medication",
  "gratitude",
  "relationships",
  "progress",
  "setback",
  "reflection",
];

// ─── Appointment Types ────────────────────────────────────────────────────────

export const APPOINTMENT_TYPES = [
  "Therapist",
  "Psychiatrist",
  "General Practitioner",
  "Support Group",
  "Nutritionist",
  "Physical Therapist",
  "Other",
];

export const APPOINTMENT_TYPE_COLORS: Record<string, string> = {
  Therapist: "bg-sage-100 text-sage-700",
  Psychiatrist: "bg-purple-100 text-purple-700",
  "General Practitioner": "bg-blue-100 text-blue-700",
  "Support Group": "bg-amber-100 text-amber-700",
  Nutritionist: "bg-green-100 text-green-700",
  "Physical Therapist": "bg-orange-100 text-orange-700",
  Other: "bg-gray-100 text-gray-700",
};

// ─── Medication Frequency Options ─────────────────────────────────────────────

export const FREQUENCY_OPTIONS = [
  "Once daily",
  "Twice daily",
  "Three times daily",
  "Every other day",
  "Weekly",
  "As needed",
];

export const TIME_OF_DAY_OPTIONS = [
  "Morning",
  "Afternoon",
  "Evening",
  "Bedtime",
  "With meals",
  "As prescribed",
];

// ─── Mood Emoji Map ───────────────────────────────────────────────────────────

export function getMoodEmoji(mood: number): string {
  if (mood <= 2) return "😔";
  if (mood <= 4) return "😕";
  if (mood <= 6) return "😐";
  if (mood <= 8) return "🙂";
  return "😊";
}

export function getMoodLabel(mood: number): string {
  if (mood <= 2) return "Very Low";
  if (mood <= 4) return "Low";
  if (mood <= 6) return "Neutral";
  if (mood <= 8) return "Good";
  return "Excellent";
}

export function getMoodColor(mood: number): string {
  if (mood <= 2) return "text-red-500";
  if (mood <= 4) return "text-orange-500";
  if (mood <= 6) return "text-yellow-500";
  if (mood <= 8) return "text-sage-500";
  return "text-emerald-500";
}

// ─── Date Helpers ─────────────────────────────────────────────────────────────

export function today(): string {
  return new Date().toISOString().split("T")[0];
}

export function formatDate(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(dateTimeStr: string): string {
  const d = new Date(dateTimeStr);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}
