import { CheckCircle2, Clock, Moon, Plane, Sun, Users } from "lucide-react";
import type { AircraftConfig, AircraftLayoutType } from "../../types/booking";

interface HeaderProps {
  aircraft: AircraftConfig;
  layoutType: AircraftLayoutType;
  passengerCount: number;
  assignedCount: number;
  theme: "light" | "dark";
  onSelectLayout: (layoutType: AircraftLayoutType) => void;
  onToggleTheme: () => void;
}

const LAYOUT_OPTIONS: {
  type: AircraftLayoutType;
  label: string;
  sub: string;
}[] = [
  { type: "3-2", label: "3–2 Layout", sub: "A B C | D E" },
  { type: "2-3-2", label: "2–3–2 Layout", sub: "A B | C D E | F G" },
];

export function Header({
  aircraft,
  layoutType,
  passengerCount,
  assignedCount,
  theme,
  onSelectLayout,
  onToggleTheme,
}: HeaderProps) {
  const allAssigned = passengerCount > 0 && assignedCount === passengerCount;
  const [origin, destination] = aircraft.route
    .split("→")
    .map((part) => part.trim());

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/90 bg-white/95 shadow-2xs backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-900/95">
      <div className="mx-auto flex max-w-7xl flex-col gap-3.5 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="KPaisa Air logo"
              className="h-10 w-10 shrink-0 rounded-xl object-cover shadow-xs ring-1 ring-slate-200 dark:ring-slate-700"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                  KPaisa Air
                </span>
                <span className="rounded-md border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-bold tracking-wide text-sky-800 dark:border-sky-800 dark:bg-sky-950/70 dark:text-sky-300">
                  {aircraft.flightNumber}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {aircraft.aircraftModel}
              </p>
            </div>
          </div>

          <div className="hidden h-7 w-px bg-slate-200 sm:block dark:bg-slate-800" />

          <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-800/70">
            <span className="text-xs font-bold tracking-wide text-slate-900 dark:text-white">
              {origin}
            </span>
            <Plane className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
            <span className="text-xs font-bold tracking-wide text-slate-900 dark:text-white">
              {destination}
            </span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-300">
              <Clock className="h-3 w-3 text-slate-400" />
              {aircraft.departureTime}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2.5 sm:justify-end">
          <div
            role="group"
            aria-label="Aircraft cabin configuration"
            className="inline-flex rounded-xl border border-slate-200 bg-slate-100/90 p-1 dark:border-slate-800 dark:bg-slate-800/90"
          >
            {LAYOUT_OPTIONS.map((option) => {
              const isActive = layoutType === option.type;
              return (
                <button
                  key={option.type}
                  type="button"
                  onClick={() => onSelectLayout(option.type)}
                  aria-pressed={isActive}
                  className={`flex flex-col items-start rounded-lg px-3 py-1.5 text-left transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    isActive
                      ? "bg-white text-slate-900 shadow-xs dark:bg-slate-950 dark:text-white"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  <span className="text-xs font-semibold leading-tight">
                    {option.label}
                  </span>
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    {option.sub}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors ${
              allAssigned
                ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/70 dark:bg-emerald-950/50 dark:text-emerald-300"
                : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-300"
            }`}
          >
            {allAssigned ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Users className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            )}
            <span>
              {passengerCount === 0
                ? "0 Passengers"
                : `${assignedCount} of ${passengerCount} Assigned`}
            </span>
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-slate-800 dark:bg-slate-800 dark:text-amber-300 dark:hover:bg-slate-700"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
