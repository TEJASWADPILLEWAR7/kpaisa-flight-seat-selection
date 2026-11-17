import { Check, Sparkles, Star, X } from "lucide-react";
import { SEAT_CATEGORY_META } from "../../data/seats";
import { formatINR } from "../../utils/pricing";

export function SeatLegend() {
  return (
    <div
      aria-label="Seat status and pricing legend"
      className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-800/50"
    >
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-slate-300 bg-white text-[10px] font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
            ₹0
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
              {SEAT_CATEGORY_META.standard.label}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Free
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 border-indigo-400 bg-indigo-50/70 text-indigo-700 dark:border-indigo-500/70 dark:bg-indigo-950/60 dark:text-indigo-300">
            <Star className="h-3 w-3" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
              {SEAT_CATEGORY_META.premium.label}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {formatINR(SEAT_CATEGORY_META.premium.price)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 border-amber-400 bg-amber-50/80 text-amber-700 dark:border-amber-500/70 dark:bg-amber-950/60 dark:text-amber-300">
            <Sparkles className="h-3 w-3" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
              {SEAT_CATEGORY_META["extra-legroom"].label}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {formatINR(SEAT_CATEGORY_META["extra-legroom"].price)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-sky-600 text-white shadow-2xs">
            <Check className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
              Selected
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Current traveler
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-800 text-[10px] font-bold text-white dark:bg-slate-700">
            P2
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
              Assigned
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Other passenger
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-200/80 text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500">
            <X className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
              Occupied
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Unavailable
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
