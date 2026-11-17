import type {
  AircraftConfig,
  FeedbackMessage,
  Passenger,
} from "../types/booking";

export interface SeatValidationResult {
  valid: boolean;
  feedback?: FeedbackMessage;
}

export function validateSeatSelection(
  seatId: string,
  activePassenger: Passenger | null,
  aircraft: AircraftConfig,
  seatToPassengerMap: Record<string, string>,
  passengersById: Record<string, Passenger>,
): SeatValidationResult {
  if (!activePassenger) {
    return {
      valid: false,
      feedback: {
        type: "warning",
        text: "Add at least one passenger before selecting a seat.",
      },
    };
  }

  const seat = aircraft.seatsById[seatId];
  if (!seat) {
    return {
      valid: false,
      feedback: {
        type: "error",
        text: `Seat ${seatId} does not exist in this aircraft configuration.`,
      },
    };
  }

  if (seat.isOccupied) {
    return {
      valid: false,
      feedback: {
        type: "error",
        text: `Seat ${seatId} is already occupied and cannot be selected.`,
      },
    };
  }

  const assignedPassengerId = seatToPassengerMap[seatId];
  if (assignedPassengerId && assignedPassengerId !== activePassenger.id) {
    const owner = passengersById[assignedPassengerId];
    const ownerLabel = owner ? owner.name : "another passenger";
    return {
      valid: false,
      feedback: {
        type: "warning",
        text: `Seat ${seatId} is already assigned to ${ownerLabel}.`,
      },
    };
  }

  return { valid: true };
}

export function pruneAssignmentsForPassengers(
  assignments: Record<string, string>,
  passengers: Passenger[],
): {
  nextAssignments: Record<string, string>;
  removedCount: number;
} {
  const validPassengerIds = new Set(passengers.map((p) => p.id));
  const nextAssignments: Record<string, string> = {};
  let removedCount = 0;

  for (const [passengerId, seatId] of Object.entries(assignments)) {
    if (validPassengerIds.has(passengerId)) {
      nextAssignments[passengerId] = seatId;
    } else {
      removedCount += 1;
    }
  }

  return { nextAssignments, removedCount };
}

export function reconcileAssignmentsForLayout(
  assignments: Record<string, string>,
  targetAircraft: AircraftConfig,
): {
  nextAssignments: Record<string, string>;
  releasedSeats: string[];
} {
  const nextAssignments: Record<string, string> = {};
  const releasedSeats: string[] = [];

  for (const [passengerId, seatId] of Object.entries(assignments)) {
    const targetSeat = targetAircraft.seatsById[seatId];
    if (targetSeat && !targetSeat.isOccupied) {
      nextAssignments[passengerId] = seatId;
    } else {
      releasedSeats.push(seatId);
    }
  }

  return { nextAssignments, releasedSeats };
}
