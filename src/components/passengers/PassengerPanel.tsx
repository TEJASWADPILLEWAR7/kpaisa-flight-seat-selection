import { Minus, Plus, UserCheck, Users, X } from "lucide-react";
import { MAX_PASSENGERS, MIN_PASSENGERS } from "../../data/passengers";
import { SEAT_CATEGORY_META } from "../../data/seats";
import type { Passenger, SeatDefinition } from "../../types/booking";
import { formatINR } from "../../utils/pricing";

interface PassengerPanelProps {
  passengers: Passenger[];
  activePassengerId: string | null;
  assignments: Record<string, string>;
  seatsById: Record<string, SeatDefinition>;
  onChangeCount: (count: number) => void;
  onSelectPassenger: (passengerId: string) => void;
  onRemoveAssignment: (passengerId: string) => void;
}

export function PassengerPanel({
  passengers,
  activePassengerId,
  assignments,
  seatsById,
  onChangeCount,
  onSelectPassenger,
  onRemoveAssignment,
}: PassengerPanelProps) {
  const count = passengers.length;

  return (
    <section
      aria-labelledby="passenger-panel-heading"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <h2
            id="passenger-panel-heading"
            className="text-sm font-semibold text-slate-900 dark:text-white"
          >
            Passengers
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Select a traveler, then choose a seat
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-800/80">
          <button
            type="button"
            onClick={() => onChangeCount(count - 1)}
            disabled={count <= MIN_PASSENGERS}
            aria-label="Decrease passenger count"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-700 shadow-2xs transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span
            aria-live="polite"
            className="min-w-7 text-center text-sm font-bold tabular-nums text-slate-900 dark:text-white"
          >
            {count}
          </span>
          <button
            type="button"
            onClick={() => onChangeCount(count + 1)}
            disabled={count >= MAX_PASSENGERS}
            aria-label="Increase passenger count"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-700 shadow-2xs transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {count === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-8 text-center dark:border-slate-800 dark:bg-slate-800/40">
          <Users className="mx-auto h-6 w-6 text-slate-400" />
          <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            No passengers added
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Use the + button above to add up to {MAX_PASSENGERS} passengers.
          </p>
        </div>
      ) : (
        <ul className="mt-4 space-y-2.5" role="list">
          {passengers.map((passenger) => {
            const isActive = passenger.id === activePassengerId;
            const seatId = assignments[passenger.id];
            const seat = seatId ? seatsById[seatId] : undefined;

            return (
              <li key={passenger.id}>
                <div
                  className={`flex items-center justify-between gap-2 rounded-xl border p-3 transition-all ${
                    isActive
                      ? "border-sky-500 bg-sky-50/70 ring-1 ring-sky-500 dark:border-sky-500 dark:bg-sky-950/40"
                      : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-700"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelectPassenger(passenger.id)}
                    aria-pressed={isActive}
                    className="flex flex-1 items-center gap-3 text-left focus:outline-none"
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        isActive
                          ? "bg-sky-600 text-white"
                          : seat
                            ? "bg-slate-800 text-white dark:bg-slate-700"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {passenger.code}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                          {passenger.name}
                        </span>
                        {isActive && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-sky-100 px-1.5 py-0.5 text-[10px] font-semibold text-sky-800 dark:bg-sky-900/70 dark:text-sky-200">
                            <UserCheck className="h-3 w-3" />
                            Active
                          </span>
                        )}
                      </div>

                      {seat ? (
                        <p className="mt-0.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                          Seat{" "}
                          <span className="font-bold text-slate-900 dark:text-white">
                            {seat.id}
                          </span>{" "}
                          · {SEAT_CATEGORY_META[seat.category].label} (
                          {seat.price === 0 ? "Free" : formatINR(seat.price)})
                        </p>
                      ) : (
                        <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                          No seat assigned
                        </p>
                      )}
                    </div>
                  </button>

                  {seat && (
                    <button
                      type="button"
                      onClick={() => onRemoveAssignment(passenger.id)}
                      aria-label={`Remove seat ${seat.id} from ${passenger.name}`}
                      title={`Remove seat ${seat.id}`}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-rose-800 dark:hover:bg-rose-950/60 dark:hover:text-rose-400"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
