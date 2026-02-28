import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Brain,
  Dumbbell,
  ExternalLink,
  Globe,
  Heart,
  MessageSquare,
  Phone,
  Sparkles,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

type ResourceCategory = {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  items: ResourceItem[];
};

type ResourceItem = {
  title: string;
  description: string;
  url?: string;
  phone?: string;
  type: "website" | "crisis" | "book" | "tip" | "therapy";
};

const RESOURCES: ResourceCategory[] = [
  {
    id: "wa",
    title: "Workaholics Anonymous",
    icon: Users,
    color: "bg-sage-100 text-sage-700",
    items: [
      {
        title: "Workaholics Anonymous Website",
        description:
          "Official WA website with meeting schedules, literature, and resources for recovery from compulsive work.",
        url: "https://workaholics-anonymous.org",
        type: "website",
      },
      {
        title: "WA Meeting Finder",
        description:
          "Find in-person and online WA meetings near you or accessible remotely.",
        url: "https://workaholics-anonymous.org/meetings",
        type: "website",
      },
      {
        title: "The Book of Recovery",
        description:
          "The WA literature guide to understanding and working the 12-step program for workaholics.",
        type: "book",
      },
      {
        title: "WA Pamphlet: Are You a Workaholic?",
        description:
          "A self-assessment tool to help identify compulsive work patterns and the impact on your life.",
        url: "https://workaholics-anonymous.org/literature",
        type: "website",
      },
    ],
  },
  {
    id: "exercise",
    title: "Exercise Addiction Support",
    icon: Dumbbell,
    color: "bg-orange-100 text-orange-700",
    items: [
      {
        title: "NEDA Helpline",
        description:
          "National Eating Disorders Association — also supports exercise compulsion. Call or text for confidential support.",
        url: "https://www.nationaleatingdisorders.org/help-support/contact-helpline",
        phone: "1-800-931-2237",
        type: "crisis",
      },
      {
        title: "Exercise Addiction Ireland",
        description:
          "Dedicated resources and information about compulsive exercise disorder and paths to recovery.",
        url: "https://www.exerciseaddiction.ie",
        type: "website",
      },
      {
        title: '"The Exercise Addiction" by Heather Hausenblas',
        description:
          "A research-backed book exploring the psychology of exercise addiction and evidence-based recovery approaches.",
        type: "book",
      },
      {
        title: '"Running on Empty" by Christine Courtois',
        description:
          "Explores compulsive behavior patterns including exercise addiction and offers healing frameworks.",
        type: "book",
      },
    ],
  },
  {
    id: "crisis",
    title: "Mental Health Crisis Lines",
    icon: Phone,
    color: "bg-red-100 text-red-700",
    items: [
      {
        title: "988 Suicide & Crisis Lifeline",
        description:
          "Call or text 988 anytime for confidential mental health crisis support in the US.",
        phone: "988",
        url: "https://988lifeline.org",
        type: "crisis",
      },
      {
        title: "Crisis Text Line",
        description:
          "Text HOME to 741741 to connect with a trained crisis counselor. Free, 24/7, confidential.",
        phone: "Text HOME to 741741",
        url: "https://www.crisistextline.org",
        type: "crisis",
      },
      {
        title: "SAMHSA National Helpline",
        description:
          "Substance Abuse and Mental Health Services — free, confidential, 24/7 treatment referral service.",
        phone: "1-800-662-4357",
        url: "https://www.samhsa.gov/find-help/national-helpline",
        type: "crisis",
      },
      {
        title: "International Association for Suicide Prevention",
        description:
          "Global directory of crisis centers and hotlines for international users.",
        url: "https://www.iasp.info/resources/Crisis_Centres",
        type: "website",
      },
    ],
  },
  {
    id: "reading",
    title: "Recommended Reading",
    icon: BookOpen,
    color: "bg-amber-100 text-amber-700",
    items: [
      {
        title: '"Chained to the Desk" by Bryan Robinson',
        description:
          "The definitive guide to understanding workaholism — its causes, consequences, and recovery strategies.",
        type: "book",
      },
      {
        title:
          '"Work Addiction: Hidden Legacies of Adult Children" by Bryan Robinson',
        description:
          "Explores the family and childhood roots of workaholism and how to break free.",
        type: "book",
      },
      {
        title:
          '"Rest: Why You Get More Done When You Work Less" by Alex Soojung-Kim Pang',
        description:
          "Evidence-based exploration of why rest makes us more creative, focused, and fulfilled.",
        type: "book",
      },
      {
        title: '"The Joy of Missing Out" by Tonya Dalton',
        description:
          "Rediscover your priorities and reclaim your life from the tyranny of busyness and overwork.",
        type: "book",
      },
      {
        title:
          '"Burnout: The Secret to Unlocking the Stress Cycle" by Emily & Amelia Nagoski',
        description:
          "Science-based strategies for completing the stress cycle and preventing burnout.",
        type: "book",
      },
    ],
  },
  {
    id: "therapy",
    title: "Therapeutic Approaches",
    icon: Brain,
    color: "bg-purple-100 text-purple-700",
    items: [
      {
        title: "Cognitive Behavioral Therapy (CBT)",
        description:
          "CBT helps identify and restructure the beliefs that drive compulsive work and exercise — like 'my worth depends on my productivity.' It's the most evidence-supported approach for behavioral addictions.",
        type: "therapy",
      },
      {
        title: "Dialectical Behavior Therapy (DBT)",
        description:
          "DBT teaches distress tolerance, emotional regulation, and interpersonal effectiveness. Especially helpful if anxiety or emotional overwhelm drives overwork.",
        type: "therapy",
      },
      {
        title: "Acceptance and Commitment Therapy (ACT)",
        description:
          "ACT helps you clarify your values and commit to behavior aligned with them — rather than what fear or perfectionism dictates. Highly effective for workaholism recovery.",
        type: "therapy",
      },
      {
        title: "Schema Therapy",
        description:
          "Addresses deep-seated patterns (schemas) from childhood that drive compulsive behavior — such as defectiveness, subjugation, or unrelenting standards.",
        type: "therapy",
      },
      {
        title: "Somatic Therapy",
        description:
          "Body-centered healing that addresses the physical manifestations of stress and trauma. Especially useful alongside exercise addiction recovery.",
        type: "therapy",
      },
    ],
  },
  {
    id: "selfcare",
    title: "Self-Care in Recovery",
    icon: Heart,
    color: "bg-pink-100 text-pink-700",
    items: [
      {
        title: "Schedule Rest Like Appointments",
        description:
          "Block rest time in your calendar with the same commitment you give work meetings. Rest is not optional — it is medical necessity.",
        type: "tip",
      },
      {
        title: "Practice the 90-Minute Work Block",
        description:
          "Work in 90-minute focused intervals followed by genuine 20-30 minute breaks. This mimics your body's natural ultradian rhythm.",
        type: "tip",
      },
      {
        title: "Set Digital Boundaries",
        description:
          "Turn off work notifications after a set hour. Your nervous system needs to learn the workday ends. Consider a phone-free bedroom.",
        type: "tip",
      },
      {
        title: "Cultivate Identity Beyond Work",
        description:
          "Recovery requires building a rich sense of self outside productivity. Try a hobby purely for joy — not optimization or achievement.",
        type: "tip",
      },
      {
        title: "Connect With Your Body Through Gentle Movement",
        description:
          "For exercise addiction recovery: try yoga, walking, or tai chi — movement that emphasizes restoration rather than performance.",
        type: "tip",
      },
      {
        title: "Attend Therapy Weekly",
        description:
          "Behavioral addiction recovery is significantly more effective with professional psychological support. Prioritize it.",
        type: "tip",
      },
    ],
  },
];

const TYPE_BADGES: Record<string, { label: string; color: string }> = {
  website: {
    label: "Website",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  crisis: {
    label: "Crisis Line",
    color: "bg-red-100 text-red-700 border-red-200",
  },
  book: {
    label: "Book",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  tip: { label: "Tip", color: "bg-sage-100 text-sage-700 border-sage-200" },
  therapy: {
    label: "Therapy",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
};

export default function Resources() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const visibleCategories = activeCategory
    ? RESOURCES.filter((r) => r.id === activeCategory)
    : RESOURCES;

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-24 lg:pb-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-1">
          Knowledge & Support
        </p>
        <h1 className="font-display text-3xl font-semibold text-foreground">
          Resources
        </h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          You don't have to walk this path alone. Here are tools, people, and
          wisdom to support your recovery.
        </p>
      </div>

      {/* Crisis Banner */}
      <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
        <Phone className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-red-800 text-sm">
            In a mental health crisis?
          </p>
          <p className="text-red-700 text-xs mt-0.5">
            Call or text <strong>988</strong> (US) · Text{" "}
            <strong>HOME to 741741</strong> · Call{" "}
            <strong>1-800-662-4357</strong> (SAMHSA)
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
            !activeCategory
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-muted-foreground border-border hover:border-primary/40",
          )}
        >
          <Sparkles className="w-3 h-3" />
          All
        </button>
        {RESOURCES.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              type="button"
              key={cat.id}
              onClick={() =>
                setActiveCategory(activeCategory === cat.id ? null : cat.id)
              }
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:border-primary/40",
              )}
            >
              <Icon className="w-3 h-3" />
              {cat.title.split(" ")[0]}
            </button>
          );
        })}
      </div>

      {/* Resource Categories */}
      <div className="space-y-6">
        {visibleCategories.map((category, catIdx) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIdx * 0.06 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="font-display text-base flex items-center gap-2">
                    <span
                      className={cn(
                        "w-7 h-7 rounded-lg flex items-center justify-center",
                        category.color,
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </span>
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {category.items.map((item) => {
                      const badge = TYPE_BADGES[item.type];
                      return (
                        <div
                          key={item.title}
                          className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-medium text-sm text-foreground">
                                  {item.title}
                                </p>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-[10px] px-1.5 py-0",
                                    badge.color,
                                  )}
                                >
                                  {badge.label}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                {item.description}
                              </p>
                              {item.phone && (
                                <div className="flex items-center gap-1.5 mt-2">
                                  {item.phone.startsWith("Text") ? (
                                    <MessageSquare className="w-3 h-3 text-muted-foreground" />
                                  ) : (
                                    <Phone className="w-3 h-3 text-muted-foreground" />
                                  )}
                                  <span className="text-xs font-medium text-foreground">
                                    {item.phone}
                                  </span>
                                </div>
                              )}
                            </div>
                            {item.url && (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0 w-7 h-7 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                              >
                                {item.type === "crisis" ? (
                                  <Globe className="w-3.5 h-3.5" />
                                ) : (
                                  <ExternalLink className="w-3.5 h-3.5" />
                                )}
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="mt-8 p-4 rounded-xl border border-dashed border-border text-center">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Recovery is a journey, not a destination. Every resource here is a
          door — you only need to open one. You are worthy of healing.
        </p>
      </div>
    </div>
  );
}
