export type AircraftLayoutType = "3-2" | "2-3-2";

export type SeatCategory = "standard" | "premium" | "extra-legroom";

export type SeatStatus =
  | "available"
  | "occupied"
  | "selected-current"
  | "assigned-other";

export interface SeatCategoryMeta {
  category: SeatCategory;
  label: string;
  price: number;
  description: string;
}

export interface SeatDefinition {
  id: string;
  row: number;
  column: string;
  category: SeatCategory;
  price: number;
  isOccupied: boolean;
  isExitRow: boolean;
}

export interface CabinSection {
  columns: string[];
}

export interface AircraftConfig {
  type: AircraftLayoutType;
  label: string;
  aircraftModel: string;
  flightNumber: string;
  route: string;
  departureTime: string;
  totalRows: number;
  sections: CabinSection[];
  seatsById: Record<string, SeatDefinition>;
  rows: SeatDefinition[][];
}

export interface Passenger {
  id: string;
  code: string;
  name: string;
}

export type FeedbackType = "info" | "warning" | "error" | "success";

export interface FeedbackMessage {
  type: FeedbackType;
  text: string;
}

export interface PassengerCostItem {
  passenger: Passenger;
  seat: SeatDefinition | null;
  price: number;
}

export interface BookingState {
  passengers: Passenger[];
  activePassengerId: string | null;
  layoutType: AircraftLayoutType;
  assignments: Record<string, string>;
  feedback: FeedbackMessage | null;
}

export type BookingAction =
  | { type: "SET_PASSENGER_COUNT"; count: number }
  | { type: "SELECT_PASSENGER"; passengerId: string }
  | { type: "TOGGLE_SEAT"; seatId: string }
  | { type: "REMOVE_ASSIGNMENT"; passengerId: string }
  | { type: "RESET_ASSIGNMENTS" }
  | { type: "SET_LAYOUT_TYPE"; layoutType: AircraftLayoutType }
  | { type: "CLEAR_FEEDBACK" };
