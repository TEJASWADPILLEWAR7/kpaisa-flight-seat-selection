import { ArrowRight, Receipt, RotateCcw, Trash2 } from "lucide-react";
import { SEAT_CATEGORY_META } from "../../data/seats";
import type { PassengerCostItem } from "../../types/booking";
import type { PassengerMealCostItem } from "../../types/meals";
import { formatINR } from "../../utils/pricing";

interface BookingSummaryProps {
  costBreakdown: PassengerCostItem[];
  mealBreakdown: PassengerMealCostItem[];
  totalSeatCost: number;
  totalMealCost: number;
  assignedCount: number;
  selectedMealsCount: number;
  onRemoveAssignment: (passengerId: string) => void;
  onRemoveMeal: (passengerId: string) => void;
  onResetAll: () => void;
  onProceedToPayment: () => void;
}

export function BookingSummary({
  costBreakdown,
  mealBreakdown,
  totalSeatCost,
  totalMealCost,
  assignedCount,
  selectedMealsCount,
  onRemoveAssignment,
  onRemoveMeal,
  onResetAll,
  onProceedToPayment,
}: BookingSummaryProps) {
  const passengerCount = costBreakdown.length;
  const combinedTotal = totalSeatCost + totalMealCost;
  const hasAnySelection = assignedCount > 0 || selectedMealsCount > 0;
  const canConfirm = passengerCount > 0 && assignedCount > 0;

  const mealsByPassengerId = Object.fromEntries(
    mealBreakdown.map((item) => [item.passenger.id, item]),
  );

  return (
    <aside
      aria-labelledby="booking-summary-heading"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Receipt className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          <h2
            id="booking-summary-heading"
            className="text-sm font-semibold text-slate-900 dark:text-white"
          >
            Booking Summary
          </h2>
        </div>

        {hasAnySelection ? (
          <button
            type="button"
            onClick={onResetAll}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Clear all</span>
          </button>
        ) : (
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            INR (₹)
          </span>
        )}
      </div>

      {passengerCount === 0 ? (
        <p className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
          Add passengers to calculate seat and meal charges.
        </p>
      ) : (
        <ul
          className="mt-4 divide-y divide-slate-100 dark:divide-slate-800"
          role="list"
        >
          {costBreakdown.map(({ passenger, seat, price }) => {
            const mealItem = mealsByPassengerId[passenger.id];
            const meal = mealItem?.meal ?? null;

            return (
              <li
                key={passenger.id}
                className="space-y-1.5 py-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                      {passenger.code} · {passenger.name}
                    </p>
                    {seat ? (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Seat{" "}
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                          {seat.id}
                        </span>{" "}
                        · {SEAT_CATEGORY_META[seat.category].label}
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">
                        No seat selected
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className="text-xs font-bold tabular-nums text-slate-900 dark:text-white">
                      {seat ? (price === 0 ? "₹0" : formatINR(price)) : "—"}
                    </span>

                    {seat && (
                      <button
                        type="button"
                        onClick={() => onRemoveAssignment(passenger.id)}
                        aria-label={`Clear seat ${seat.id} for ${passenger.name}`}
                        title="Remove seat"
                        className="rounded-md p-1 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:hover:bg-rose-950/60 dark:hover:text-rose-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {meal && (
                  <div className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-2.5 py-1.5 dark:bg-slate-800/70">
                    <span className="truncate text-[11px] text-slate-600 dark:text-slate-300">
                      {meal.name}
                    </span>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <span className="text-[11px] font-semibold tabular-nums text-slate-800 dark:text-slate-200">
                        {meal.price === 0 ? "₹0" : formatINR(meal.price)}
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemoveMeal(passenger.id)}
                        aria-label={`Remove ${meal.name} for ${passenger.name}`}
                        title="Remove meal"
                        className="rounded p-0.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 focus:outline-none dark:hover:bg-rose-950/60 dark:hover:text-rose-400"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-5 space-y-2 border-t border-slate-200 pt-4 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <span>
            Seat Charges ({assignedCount}/{passengerCount})
          </span>
          <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
            {formatINR(totalSeatCost)}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <span>
            Meal Charges ({selectedMealsCount}/{passengerCount})
          </span>
          <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
            {formatINR(totalMealCost)}
          </span>
        </div>

        <div className="flex items-baseline justify-between border-t border-slate-100 pt-2.5 dark:border-slate-800">
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              Combined Total
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              All taxes included
            </p>
          </div>
          <p
            aria-live="polite"
            className="text-xl font-bold tracking-tight tabular-nums text-slate-900 dark:text-white"
          >
            {formatINR(combinedTotal)}
          </p>
        </div>

        <button
          type="button"
          disabled={!canConfirm}
          onClick={onProceedToPayment}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 dark:bg-sky-600 dark:hover:bg-sky-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-600"
        >
          <span>Confirm Selection</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </aside>
  );
}
