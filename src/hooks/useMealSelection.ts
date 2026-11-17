import { useCallback, useMemo, useState } from "react";
import { MEALS_BY_ID } from "../data/meals";
import { MAX_PASSENGERS, MIN_PASSENGERS } from "../data/passengers";
import type { Passenger } from "../types/booking";
import type { PassengerMealCostItem } from "../types/meals";

export function useMealSelection(passengers: Passenger[]) {
  const [mealAssignments, setMealAssignments] = useState<
    Record<string, string>
  >({});

  const toggleMeal = useCallback((passengerId: string, mealId: string) => {
    if (!MEALS_BY_ID[mealId]) {
      return;
    }

    setMealAssignments((prev) => {
      const next = { ...prev };
      if (next[passengerId] === mealId) {
        delete next[passengerId];
      } else {
        next[passengerId] = mealId;
      }
      return next;
    });
  }, []);

  const removeMeal = useCallback((passengerId: string) => {
    setMealAssignments((prev) => {
      if (!prev[passengerId]) {
        return prev;
      }
      const next = { ...prev };
      delete next[passengerId];
      return next;
    });
  }, []);

  const resetMeals = useCallback(() => {
    setMealAssignments({});
  }, []);

  const pruneMealsForCount = useCallback((count: number) => {
    const safeCount = Math.max(MIN_PASSENGERS, Math.min(MAX_PASSENGERS, count));
    const allowedIds = new Set(
      Array.from({ length: safeCount }, (_, index) => `passenger-${index + 1}`),
    );

    setMealAssignments((prev) => {
      const next: Record<string, string> = {};
      for (const [passengerId, mealId] of Object.entries(prev)) {
        if (allowedIds.has(passengerId)) {
          next[passengerId] = mealId;
        }
      }
      return next;
    });
  }, []);

  const mealBreakdown: PassengerMealCostItem[] = useMemo(
    () =>
      passengers.map((passenger) => {
        const mealId = mealAssignments[passenger.id];
        const meal = mealId ? (MEALS_BY_ID[mealId] ?? null) : null;
        return {
          passenger,
          meal,
          price: meal ? meal.price : 0,
        };
      }),
    [passengers, mealAssignments],
  );

  const totalMealCost = useMemo(
    () => mealBreakdown.reduce((sum, item) => sum + item.price, 0),
    [mealBreakdown],
  );

  const selectedMealsCount = useMemo(
    () => mealBreakdown.filter((item) => item.meal !== null).length,
    [mealBreakdown],
  );

  return {
    mealAssignments,
    mealBreakdown,
    totalMealCost,
    selectedMealsCount,
    toggleMeal,
    removeMeal,
    resetMeals,
    pruneMealsForCount,
  };
}
