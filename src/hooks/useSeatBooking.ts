import { useCallback, useMemo, useReducer } from "react";
import { AIRCRAFT_CONFIGS } from "../data/aircraft";
import {
  DEFAULT_PASSENGER_COUNT,
  generatePassengers,
} from "../data/passengers";
import type {
  AircraftLayoutType,
  BookingAction,
  BookingState,
  Passenger,
} from "../types/booking";
import {
  buildPassengerCostBreakdown,
  calculateTotalSeatCost,
} from "../utils/pricing";
import {
  pruneAssignmentsForPassengers,
  reconcileAssignmentsForLayout,
  validateSeatSelection,
} from "../utils/validation";

function createInitialState(): BookingState {
  const initialPassengers = generatePassengers(DEFAULT_PASSENGER_COUNT);
  return {
    passengers: initialPassengers,
    activePassengerId: initialPassengers[0]?.id ?? null,
    layoutType: "3-2",
    assignments: {},
    feedback: null,
  };
}

function bookingReducer(
  state: BookingState,
  action: BookingAction,
): BookingState {
  switch (action.type) {
    case "SET_PASSENGER_COUNT": {
      const nextPassengers = generatePassengers(action.count);
      const { nextAssignments, removedCount } = pruneAssignmentsForPassengers(
        state.assignments,
        nextPassengers,
      );

      let nextActiveId: string | null = null;
      if (nextPassengers.length > 0) {
        const stillExists = nextPassengers.some(
          (p) => p.id === state.activePassengerId,
        );
        nextActiveId = stillExists
          ? state.activePassengerId
          : nextPassengers[nextPassengers.length - 1].id;
      }

      return {
        ...state,
        passengers: nextPassengers,
        activePassengerId: nextActiveId,
        assignments: nextAssignments,
        feedback:
          removedCount > 0
            ? {
                type: "info",
                text: `Released ${removedCount} seat assignment${
                  removedCount > 1 ? "s" : ""
                } after reducing passengers.`,
              }
            : null,
      };
    }

    case "SELECT_PASSENGER": {
      const exists = state.passengers.some((p) => p.id === action.passengerId);
      if (!exists) {
        return state;
      }
      return {
        ...state,
        activePassengerId: action.passengerId,
        feedback: null,
      };
    }

    case "TOGGLE_SEAT": {
      const aircraft = AIRCRAFT_CONFIGS[state.layoutType];
      const activePassenger =
        state.passengers.find((p) => p.id === state.activePassengerId) ?? null;

      const passengersById: Record<string, Passenger> = {};
      for (const passenger of state.passengers) {
        passengersById[passenger.id] = passenger;
      }

      const seatToPassengerMap: Record<string, string> = {};
      for (const [passengerId, seatId] of Object.entries(state.assignments)) {
        seatToPassengerMap[seatId] = passengerId;
      }

      const validation = validateSeatSelection(
        action.seatId,
        activePassenger,
        aircraft,
        seatToPassengerMap,
        passengersById,
      );

      if (!validation.valid || !activePassenger) {
        return {
          ...state,
          feedback: validation.feedback ?? null,
        };
      }

      const currentSeatId = state.assignments[activePassenger.id];
      const nextAssignments = { ...state.assignments };

      if (currentSeatId === action.seatId) {
        delete nextAssignments[activePassenger.id];
        return {
          ...state,
          assignments: nextAssignments,
          feedback: {
            type: "info",
            text: `Removed seat ${action.seatId} from ${activePassenger.name}.`,
          },
        };
      }

      nextAssignments[activePassenger.id] = action.seatId;
      return {
        ...state,
        assignments: nextAssignments,
        feedback: {
          type: "success",
          text: currentSeatId
            ? `Changed ${activePassenger.name} from ${currentSeatId} to ${action.seatId}.`
            : `Assigned seat ${action.seatId} to ${activePassenger.name}.`,
        },
      };
    }

    case "REMOVE_ASSIGNMENT": {
      const existingSeat = state.assignments[action.passengerId];
      if (!existingSeat) {
        return state;
      }

      const passenger = state.passengers.find(
        (p) => p.id === action.passengerId,
      );
      const nextAssignments = { ...state.assignments };
      delete nextAssignments[action.passengerId];

      return {
        ...state,
        assignments: nextAssignments,
        feedback: {
          type: "info",
          text: `Removed seat ${existingSeat}${
            passenger ? ` from ${passenger.name}` : ""
          }.`,
        },
      };
    }

    case "RESET_ASSIGNMENTS": {
      if (Object.keys(state.assignments).length === 0) {
        return state;
      }

      return {
        ...state,
        assignments: {},
        feedback: {
          type: "info",
          text: "Cleared all seat assignments.",
        },
      };
    }

    case "SET_LAYOUT_TYPE": {
      if (state.layoutType === action.layoutType) {
        return state;
      }

      const targetAircraft = AIRCRAFT_CONFIGS[action.layoutType];
      const { nextAssignments, releasedSeats } = reconcileAssignmentsForLayout(
        state.assignments,
        targetAircraft,
      );

      return {
        ...state,
        layoutType: action.layoutType,
        assignments: nextAssignments,
        feedback:
          releasedSeats.length > 0
            ? {
                type: "warning",
                text: `Switched cabin layout. Released unavailable seat${
                  releasedSeats.length > 1 ? "s" : ""
                }: ${releasedSeats.join(", ")}.`,
              }
            : null,
      };
    }

    case "CLEAR_FEEDBACK": {
      return {
        ...state,
        feedback: null,
      };
    }

    default:
      return state;
  }
}

export function useSeatBooking() {
  const [state, dispatch] = useReducer(
    bookingReducer,
    undefined,
    createInitialState,
  );

  const aircraft = AIRCRAFT_CONFIGS[state.layoutType];

  const activePassenger = useMemo(
    () =>
      state.passengers.find((p) => p.id === state.activePassengerId) ?? null,
    [state.passengers, state.activePassengerId],
  );

  const seatToPassengerMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const [passengerId, seatId] of Object.entries(state.assignments)) {
      map[seatId] = passengerId;
    }
    return map;
  }, [state.assignments]);

  const passengersById = useMemo(() => {
    const map: Record<string, Passenger> = {};
    for (const passenger of state.passengers) {
      map[passenger.id] = passenger;
    }
    return map;
  }, [state.passengers]);

  const costBreakdown = useMemo(
    () =>
      buildPassengerCostBreakdown(
        state.passengers,
        state.assignments,
        aircraft.seatsById,
      ),
    [state.passengers, state.assignments, aircraft.seatsById],
  );

  const totalCost = useMemo(
    () => calculateTotalSeatCost(costBreakdown),
    [costBreakdown],
  );

  const assignedCount = useMemo(
    () => Object.keys(state.assignments).length,
    [state.assignments],
  );

  const availableSeatsCount = useMemo(() => {
    const totalSeats = Object.keys(aircraft.seatsById).length;
    const occupiedSeats = Object.values(aircraft.seatsById).filter(
      (s) => s.isOccupied,
    ).length;
    return totalSeats - occupiedSeats - assignedCount;
  }, [aircraft.seatsById, assignedCount]);

  const setPassengerCount = useCallback((count: number) => {
    dispatch({ type: "SET_PASSENGER_COUNT", count });
  }, []);

  const selectPassenger = useCallback((passengerId: string) => {
    dispatch({ type: "SELECT_PASSENGER", passengerId });
  }, []);

  const toggleSeat = useCallback((seatId: string) => {
    dispatch({ type: "TOGGLE_SEAT", seatId });
  }, []);

  const removeAssignment = useCallback((passengerId: string) => {
    dispatch({ type: "REMOVE_ASSIGNMENT", passengerId });
  }, []);

  const resetAssignments = useCallback(() => {
    dispatch({ type: "RESET_ASSIGNMENTS" });
  }, []);

  const setLayoutType = useCallback((layoutType: AircraftLayoutType) => {
    dispatch({ type: "SET_LAYOUT_TYPE", layoutType });
  }, []);

  const clearFeedback = useCallback(() => {
    dispatch({ type: "CLEAR_FEEDBACK" });
  }, []);

  return {
    state,
    aircraft,
    activePassenger,
    seatToPassengerMap,
    passengersById,
    costBreakdown,
    totalCost,
    assignedCount,
    availableSeatsCount,
    setPassengerCount,
    selectPassenger,
    toggleSeat,
    removeAssignment,
    resetAssignments,
    setLayoutType,
    clearFeedback,
  };
}
