import { Check, Sparkles, Star, X } from "lucide-react";
import { SEAT_CATEGORY_META } from "../../data/seats";
import type {
  Passenger,
  SeatDefinition,
  SeatStatus,
} from "../../types/booking";
import { formatINR } from "../../utils/pricing";

interface SeatButtonProps {
  seat: SeatDefinition;
  status: SeatStatus;
  assignedPassenger?: Passenger;
  onSelect: (seatId: string) => void;
}

export function SeatButton({
  seat,
  status,
  assignedPassenger,
  onSelect,
}: SeatButtonProps) {
  const categoryMeta = SEAT_CATEGORY_META[seat.category];
  const priceLabel = seat.price === 0 ? "Free" : formatINR(seat.price);
  const isBlocked = status === "occupied" || status === "assigned-other";

  const getVisualClasses = (): string => {
    if (status === "occupied") {
      return "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-600";
    }

    if (status === "selected-current") {
      return "border-sky-700 bg-sky-600 text-white shadow-sm ring-2 ring-sky-300 hover:bg-sky-700 cursor-pointer dark:border-sky-400 dark:ring-sky-500/40";
    }

    if (status === "assigned-other") {
      return "border-slate-800 bg-slate-800 text-white cursor-not-allowed dark:border-slate-600 dark:bg-slate-700";
    }

    if (seat.category === "extra-legroom") {
      return "border-amber-400 bg-amber-50/70 text-slate-900 hover:border-amber-500 hover:bg-amber-100/70 cursor-pointer dark:border-amber-500/60 dark:bg-amber-950/35 dark:text-amber-100 dark:hover:border-amber-400 dark:hover:bg-amber-950/60";
    }

    if (seat.category === "premium") {
      return "border-indigo-300 bg-indigo-50/60 text-slate-900 hover:border-indigo-500 hover:bg-indigo-100/60 cursor-pointer dark:border-indigo-500/60 dark:bg-indigo-950/35 dark:text-indigo-100 dark:hover:border-indigo-400 dark:hover:bg-indigo-950/60";
    }

    return "border-slate-300 bg-white text-slate-900 hover:border-sky-500 hover:bg-sky-50/40 cursor-pointer dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-100 dark:hover:border-sky-400 dark:hover:bg-slate-800";
  };

  const getAriaLabel = (): string => {
    if (status === "occupied") {
      return `Seat ${seat.id}, occupied, unavailable`;
    }
    if (status === "assigned-other" && assignedPassenger) {
      return `Seat ${seat.id}, assigned to ${assignedPassenger.name}, ${categoryMeta.label}, ${priceLabel}`;
    }
    if (status === "selected-current") {
      return `Seat ${seat.id}, selected for current passenger, ${categoryMeta.label}, ${priceLabel}. Click to remove`;
    }
    return `Seat ${seat.id}, available, ${categoryMeta.label}, ${priceLabel}`;
  };

  return (
    <button
      type="button"
      onClick={() => onSelect(seat.id)}
      aria-label={getAriaLabel()}
      aria-pressed={status === "selected-current"}
      aria-disabled={isBlocked}
      title={`${seat.id} · ${categoryMeta.label} · ${priceLabel}`}
      className={`group relative flex h-13 w-12 flex-col items-center justify-center rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 dark:focus:ring-offset-slate-900 sm:h-14 sm:w-13 ${getVisualClasses()}`}
    >
      {status === "occupied" ? (
        <>
          <X className="h-4 w-4 text-slate-400 dark:text-slate-600" />
          <span className="mt-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-600">
            {seat.id}
          </span>
        </>
      ) : status === "selected-current" ? (
        <>
          <div className="flex items-center gap-0.5">
            <span className="text-xs font-bold leading-none">{seat.id}</span>
            <Check className="h-3 w-3 stroke-[2.5]" />
          </div>
          <span className="mt-1 text-[10px] font-medium text-sky-100">
            {priceLabel}
          </span>
        </>
      ) : status === "assigned-other" ? (
        <>
          <span className="text-xs font-bold leading-none">
            {assignedPassenger?.code ?? seat.id}
          </span>
          <span className="mt-1 text-[10px] font-medium text-slate-300">
            {seat.id}
          </span>
        </>
      ) : (
        <>
          <div className="flex items-center gap-0.5">
            <span className="text-xs font-bold leading-none">{seat.id}</span>
            {seat.category === "extra-legroom" && (
              <Sparkles className="h-2.5 w-2.5 text-amber-600 dark:text-amber-400" />
            )}
            {seat.category === "premium" && (
              <Star className="h-2.5 w-2.5 text-indigo-600 dark:text-indigo-400" />
            )}
          </div>
          <span
            className={`mt-1 text-[10px] font-semibold tabular-nums ${
              seat.category === "extra-legroom"
                ? "text-amber-800 dark:text-amber-300"
                : seat.category === "premium"
                  ? "text-indigo-700 dark:text-indigo-300"
                  : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {priceLabel}
          </span>
        </>
      )}
    </button>
  );
}
