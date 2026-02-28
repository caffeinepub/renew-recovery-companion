import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  CalendarDays,
  CheckSquare,
  Heart,
  LayoutDashboard,
  Leaf,
  Library,
  ListChecks,
  Menu,
  Pill,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import Appointments from "./pages/Appointments";
import DailyCheckin from "./pages/DailyCheckin";
import DailyHabits from "./pages/DailyHabits";
import Dashboard from "./pages/Dashboard";
import Journal from "./pages/Journal";
import MedicationTracker from "./pages/MedicationTracker";
import Resources from "./pages/Resources";
import TwelveSteps from "./pages/TwelveSteps";

type Page =
  | "dashboard"
  | "steps"
  | "checkin"
  | "medications"
  | "appointments"
  | "journal"
  | "habits"
  | "resources";

const NAV_ITEMS: {
  id: Page;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "steps", label: "12-Step Program", icon: ListChecks },
  { id: "checkin", label: "Daily Check-in", icon: CheckSquare },
  { id: "medications", label: "Medications", icon: Pill },
  { id: "appointments", label: "Appointments", icon: CalendarDays },
  { id: "journal", label: "Journal", icon: BookOpen },
  { id: "habits", label: "Daily Habits", icon: Heart },
  { id: "resources", label: "Resources", icon: Library },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = (page: Page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* ── Desktop Sidebar ──────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-sidebar text-sidebar-foreground fixed left-0 top-0 bottom-0 z-40">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sidebar-primary flex items-center justify-center shadow-amber">
              <Leaf className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <p className="font-display font-semibold text-base leading-tight text-sidebar-foreground">
                Renew
              </p>
              <p className="text-[11px] text-sidebar-foreground/60 leading-tight">
                Recovery Companion
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => navigate(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <p className="text-[11px] text-sidebar-foreground/40 text-center leading-relaxed">
            © {new Date().getFullYear()}. Built with{" "}
            <span className="text-sidebar-primary">♥</span> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-sidebar-foreground/60"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </aside>

      {/* ── Mobile Sidebar Overlay ───────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/40 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar text-sidebar-foreground z-50 flex flex-col lg:hidden"
            >
              <div className="p-5 border-b border-sidebar-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sidebar-primary flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-sidebar-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-base text-sidebar-foreground">
                      Renew
                    </p>
                    <p className="text-[11px] text-sidebar-foreground/60">
                      Recovery Companion
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = currentPage === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => navigate(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                      )}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-sidebar-border">
                <p className="text-[11px] text-sidebar-foreground/40 text-center">
                  © {new Date().getFullYear()} Built with{" "}
                  <a
                    href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2"
                  >
                    caffeine.ai
                  </a>
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border flex items-center justify-between px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="text-foreground/70"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-primary" />
            <span className="font-display font-semibold text-foreground">
              Renew
            </span>
          </div>
          <div className="w-10" />
        </header>

        {/* Page Content */}
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {currentPage === "dashboard" && (
                <Dashboard onNavigate={navigate} />
              )}
              {currentPage === "steps" && <TwelveSteps />}
              {currentPage === "checkin" && <DailyCheckin />}
              {currentPage === "medications" && <MedicationTracker />}
              {currentPage === "appointments" && <Appointments />}
              {currentPage === "journal" && <Journal />}
              {currentPage === "habits" && <DailyHabits />}
              {currentPage === "resources" && <Resources />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-sidebar/95 backdrop-blur border-t border-sidebar-border z-30 px-1 py-1">
          <div className="flex items-center justify-around">
            {NAV_ITEMS.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const active = currentPage === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={cn(
                    "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all",
                    active
                      ? "text-sidebar-primary"
                      : "text-sidebar-foreground/50",
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[9px] leading-none font-medium">
                    {item.label.split(" ")[0]}
                  </span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-sidebar-foreground/50 transition-all"
            >
              <Menu className="w-5 h-5" />
              <span className="text-[9px] leading-none font-medium">More</span>
            </button>
          </div>
        </nav>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          className: "font-body",
        }}
      />
    </div>
  );
}
