import type { Passenger } from "../types/booking";

export const MIN_PASSENGERS = 0;
export const MAX_PASSENGERS = 9;
export const DEFAULT_PASSENGER_COUNT = 2;

export function generatePassengers(count: number): Passenger[] {
  const safeCount = Math.max(MIN_PASSENGERS, Math.min(MAX_PASSENGERS, count));

  return Array.from({ length: safeCount }, (_, index) => {
    const number = index + 1;
    return {
      id: `passenger-${number}`,
      code: `P${number}`,
      name: `Passenger ${number}`,
    };
  });
}
