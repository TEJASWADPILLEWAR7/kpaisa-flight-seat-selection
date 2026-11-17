import { Check, Utensils, X } from "lucide-react";
import { MEAL_OPTIONS } from "../../data/meals";
import type { Passenger } from "../../types/booking";
import type { PassengerMealCostItem } from "../../types/meals";
import { formatINR } from "../../utils/pricing";

interface MealSelectorProps {
  activePassenger: Passenger | null;
  mealAssignments: Record<string, string>;
  mealBreakdown: PassengerMealCostItem[];
  selectedMealsCount: number;
  onToggleMeal: (passengerId: string, mealId: string) => void;
  onRemoveMeal: (passengerId: string) => void;
}

export function MealSelector({
  activePassenger,
  mealAssignments,
  mealBreakdown,
  selectedMealsCount,
  onToggleMeal,
  onRemoveMeal,
}: MealSelectorProps) {
  const passengerCount = mealBreakdown.length;
  const activeMealId = activePassenger
    ? mealAssignments[activePassenger.id]
    : undefined;

  return (
    <section
      aria-labelledby="meal-selector-heading"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <Utensils className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2
                id="meal-selector-heading"
                className="text-sm font-semibold text-slate-900 dark:text-white"
              >
                In-Flight Meals
              </h2>
              <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 uppercase dark:bg-slate-800 dark:text-slate-400">
                Optional
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {activePassenger
                ? `Choosing meal for ${activePassenger.name} (${activePassenger.code})`
                : "Add a passenger to customize in-flight meals"}
            </p>
          </div>
        </div>

        {passengerCount > 0 && (
          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {selectedMealsCount} of {passengerCount} meals selected
          </span>
        )}
      </div>

      {!activePassenger ? (
        <p className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
          Add at least one passenger to select complimentary or paid meals.
        </p>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {MEAL_OPTIONS.map((meal) => {
              const isSelected = activeMealId === meal.id;
              const priceLabel =
                meal.price === 0 ? "Free" : formatINR(meal.price);

              return (
                <button
                  key={meal.id}
                  type="button"
                  onClick={() => onToggleMeal(activePassenger.id, meal.id)}
                  aria-pressed={isSelected}
                  className={`flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    isSelected
                      ? "border-sky-600 bg-sky-50/70 ring-1 ring-sky-600 dark:border-sky-500 dark:bg-sky-950/40"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-700 dark:hover:bg-slate-800"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {meal.name}
                      </span>
                      <span
                        className={`inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold tabular-nums ${
                          isSelected
                            ? "bg-sky-600 text-white"
                            : meal.price === 0
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
                        }`}
                      >
                        {isSelected && (
                          <Check className="h-3 w-3 stroke-[2.5]" />
                        )}
                        {priceLabel}
                      </span>
                    </div>

                    <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                      {meal.description}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 dark:border-slate-800">
                    <span className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase dark:text-slate-500">
                      {meal.dietaryTag}
                    </span>
                    <span className="text-[11px] font-semibold text-sky-700 dark:text-sky-400">
                      {isSelected ? "Selected" : "Select"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/40">
            <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
              Passenger Meal Selections
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {mealBreakdown.map(({ passenger, meal }) => (
                <div
                  key={passenger.id}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                >
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {passenger.code}:
                  </span>
                  <span className="text-slate-600 dark:text-slate-300">
                    {meal
                      ? `${meal.name} (${meal.price === 0 ? "Free" : formatINR(meal.price)})`
                      : "No meal"}
                  </span>
                  {meal && (
                    <button
                      type="button"
                      onClick={() => onRemoveMeal(passenger.id)}
                      aria-label={`Remove ${meal.name} for ${passenger.name}`}
                      className="ml-0.5 rounded p-0.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 focus:outline-none dark:hover:bg-rose-950/60 dark:hover:text-rose-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
