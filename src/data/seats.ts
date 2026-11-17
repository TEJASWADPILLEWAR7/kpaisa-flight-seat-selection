import type {
  AircraftLayoutType,
  SeatCategory,
  SeatCategoryMeta,
} from "../types/booking";

export const SEAT_CATEGORY_META: Record<SeatCategory, SeatCategoryMeta> = {
  standard: {
    category: "standard",
    label: "Standard",
    price: 0,
    description: "Complimentary standard cabin seat",
  },
  premium: {
    category: "premium",
    label: "Premium",
    price: 250,
    description: "Preferred forward and window/aisle seating",
  },
  "extra-legroom": {
    category: "extra-legroom",
    label: "Extra Legroom",
    price: 350,
    description: "Extended legroom at bulkhead and exit rows",
  },
};

const EXPLICIT_SEAT_CATEGORIES: Record<string, SeatCategory> = {
  "1A": "standard",
  "1B": "standard",
  "1C": "extra-legroom",
  "1D": "standard",
  "1E": "premium",
  "2A": "extra-legroom",
  "2B": "standard",
};

export function resolveSeatCategory(
  layoutType: AircraftLayoutType,
  row: number,
  column: string,
): SeatCategory {
  const seatId = `${row}${column}`;

  if (layoutType === "3-2" && EXPLICIT_SEAT_CATEGORIES[seatId]) {
    return EXPLICIT_SEAT_CATEGORIES[seatId];
  }

  if (row === 1 || row === 5) {
    return "extra-legroom";
  }

  if (row === 2 || row === 3) {
    return "premium";
  }

  return "standard";
}

export function getSeatPrice(category: SeatCategory): number {
  return SEAT_CATEGORY_META[category].price;
}
