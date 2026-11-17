import type {
  AircraftConfig,
  AircraftLayoutType,
  CabinSection,
  SeatDefinition,
} from "../types/booking";
import { getSeatPrice, resolveSeatCategory } from "./seats";

const TOTAL_CABIN_ROWS = 10;

const OCCUPIED_SEATS_BY_LAYOUT: Record<
  AircraftLayoutType,
  ReadonlySet<string>
> = {
  "3-2": new Set(["2D", "3B", "4A", "4E", "6C", "7B", "8D", "9A"]),
  "2-3-2": new Set(["2D", "3B", "3F", "4A", "5G", "6C", "7E", "8B", "9F"]),
};

function buildAircraftConfig(
  type: AircraftLayoutType,
  label: string,
  aircraftModel: string,
  flightNumber: string,
  route: string,
  departureTime: string,
  sections: CabinSection[],
): AircraftConfig {
  const occupiedSet = OCCUPIED_SEATS_BY_LAYOUT[type];
  const orderedColumns = sections.flatMap((section) => section.columns);
  const seatsById: Record<string, SeatDefinition> = {};
  const rows: SeatDefinition[][] = [];

  for (let row = 1; row <= TOTAL_CABIN_ROWS; row += 1) {
    const rowSeats: SeatDefinition[] = [];

    for (const column of orderedColumns) {
      const id = `${row}${column}`;
      const category = resolveSeatCategory(type, row, column);
      const seat: SeatDefinition = {
        id,
        row,
        column,
        category,
        price: getSeatPrice(category),
        isOccupied: occupiedSet.has(id),
        isExitRow: row === 5,
      };

      seatsById[id] = seat;
      rowSeats.push(seat);
    }

    rows.push(rowSeats);
  }

  return {
    type,
    label,
    aircraftModel,
    flightNumber,
    route,
    departureTime,
    totalRows: TOTAL_CABIN_ROWS,
    sections,
    seatsById,
    rows,
  };
}

export const AIRCRAFT_CONFIGS: Record<AircraftLayoutType, AircraftConfig> = {
  "3-2": buildAircraftConfig(
    "3-2",
    "3–2 Narrowbody",
    "Airbus A220-300",
    "KP-204",
    "BOM → BLR",
    "14:30 IST",
    [{ columns: ["A", "B", "C"] }, { columns: ["D", "E"] }],
  ),
  "2-3-2": buildAircraftConfig(
    "2-3-2",
    "2–3–2 Widebody",
    "Boeing 767-300ER",
    "KP-518",
    "DEL → BOM",
    "18:15 IST",
    [
      { columns: ["A", "B"] },
      { columns: ["C", "D", "E"] },
      { columns: ["F", "G"] },
    ],
  ),
};
