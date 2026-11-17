import type {
  Passenger,
  PassengerCostItem,
  SeatDefinition,
} from "../types/booking";

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatINR(amount: number): string {
  return inrFormatter.format(Math.round(amount));
}

export function buildPassengerCostBreakdown(
  passengers: Passenger[],
  assignments: Record<string, string>,
  seatsById: Record<string, SeatDefinition>,
): PassengerCostItem[] {
  return passengers.map((passenger) => {
    const assignedSeatId = assignments[passenger.id];
    const seat = assignedSeatId ? (seatsById[assignedSeatId] ?? null) : null;
    const price = seat ? seat.price : 0;

    return {
      passenger,
      seat,
      price,
    };
  });
}

export function calculateTotalSeatCost(breakdown: PassengerCostItem[]): number {
  return breakdown.reduce((sum, item) => sum + item.price, 0);
}
