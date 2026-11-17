import { Compass } from "lucide-react";
import type {
  AircraftConfig,
  Passenger,
  SeatStatus,
} from "../../types/booking";
import { SeatButton } from "./SeatButton";
import { SeatLegend } from "./SeatLegend";

interface SeatMapProps {
  aircraft: AircraftConfig;
  activePassenger: Passenger | null;
  seatToPassengerMap: Record<string, string>;
  passengersById: Record<string, Passenger>;
  availableSeatsCount: number;
  onSelectSeat: (seatId: string) => void;
}

export function SeatMap({
  aircraft,
  activePassenger,
  seatToPassengerMap,
  passengersById,
  availableSeatsCount,
  onSelectSeat,
}: SeatMapProps) {
  const resolveSeatStatus = (
    seatId: string,
    isOccupied: boolean,
  ): { status: SeatStatus; owner?: Passenger } => {
    if (isOccupied) {
      return { status: "occupied" };
    }

    const ownerId = seatToPassengerMap[seatId];
    if (!ownerId) {
      return { status: "available" };
    }

    const owner = passengersById[ownerId];
    if (activePassenger && ownerId === activePassenger.id) {
      return { status: "selected-current", owner };
    }

    return { status: "assigned-other", owner };
  };

  return (
    <section
      aria-labelledby="seat-map-heading"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <h2
            id="seat-map-heading"
            className="text-sm font-semibold text-slate-900 dark:text-white"
          >
            Cabin Seat Map · {aircraft.label}
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {activePassenger
              ? `Assigning seat for ${activePassenger.name} (${activePassenger.code})`
              : "Add a passenger to assign seats"}
          </p>
        </div>

        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {availableSeatsCount} seats available
        </span>
      </div>

      <div className="mt-4">
        <SeatLegend />
      </div>

      <div className="mt-5 overflow-x-auto pb-2">
        <div className="mx-auto min-w-max max-w-fit">
          <div className="rounded-t-[3.5rem] border-x-2 border-t-2 border-slate-200 bg-gradient-to-b from-slate-100/90 to-slate-50/40 px-6 pt-5 pb-4 text-center dark:border-slate-800 dark:from-slate-800/80 dark:to-slate-900/40">
            <div className="mx-auto flex h-8 w-24 items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white text-[11px] font-bold tracking-wider text-slate-600 uppercase shadow-2xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              <Compass className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
              Front
            </div>
            <p className="mt-2 text-[11px] font-medium text-slate-400 dark:text-slate-500">
              {aircraft.aircraftModel} · Main Cabin
            </p>
          </div>

          <div className="rounded-b-3xl border-x-2 border-b-2 border-slate-200 bg-slate-50/50 px-4 py-4 sm:px-6 dark:border-slate-800 dark:bg-slate-950/40">
            <div className="mb-3 flex items-center justify-center gap-2">
              <span className="w-6 text-center text-[10px] font-bold text-slate-400 dark:text-slate-500">
                ROW
              </span>
              <div className="flex items-center gap-4 sm:gap-6">
                {aircraft.sections.map((section, sectionIndex) => (
                  <div
                    key={sectionIndex}
                    className="flex items-center gap-1.5 sm:gap-2"
                  >
                    {section.columns.map((column) => (
                      <span
                        key={column}
                        className="w-12 text-center text-xs font-bold text-slate-500 sm:w-13 dark:text-slate-400"
                      >
                        {column}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
              <span className="w-6 text-center text-[10px] font-bold text-slate-400 dark:text-slate-500">
                ROW
              </span>
            </div>

            <div className="space-y-2">
              {aircraft.rows.map((rowSeats) => {
                const rowNumber = rowSeats[0].row;
                const isExitRow = rowSeats[0].isExitRow;
                const seatsByColumn: Record<string, (typeof rowSeats)[number]> =
                  {};
                for (const seat of rowSeats) {
                  seatsByColumn[seat.column] = seat;
                }

                return (
                  <div key={rowNumber}>
                    {isExitRow && (
                      <div className="my-2.5 flex items-center gap-2">
                        <div className="h-px flex-1 bg-amber-300/80 dark:bg-amber-600/40" />
                        <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-amber-800 uppercase dark:bg-amber-950/70 dark:text-amber-300">
                          Exit Row · Extra Legroom
                        </span>
                        <div className="h-px flex-1 bg-amber-300/80 dark:bg-amber-600/40" />
                      </div>
                    )}

                    <div className="flex items-center justify-center gap-2">
                      <span className="w-6 text-center text-xs font-bold tabular-nums text-slate-400 dark:text-slate-500">
                        {rowNumber}
                      </span>

                      <div className="flex items-center gap-4 sm:gap-6">
                        {aircraft.sections.map((section, sectionIndex) => (
                          <div
                            key={sectionIndex}
                            className="flex items-center gap-1.5 sm:gap-2"
                          >
                            {section.columns.map((column) => {
                              const seat = seatsByColumn[column];
                              const { status, owner } = resolveSeatStatus(
                                seat.id,
                                seat.isOccupied,
                              );

                              return (
                                <SeatButton
                                  key={seat.id}
                                  seat={seat}
                                  status={status}
                                  assignedPassenger={owner}
                                  onSelect={onSelectSeat}
                                />
                              );
                            })}
                          </div>
                        ))}
                      </div>

                      <span className="w-6 text-center text-xs font-bold tabular-nums text-slate-400 dark:text-slate-500">
                        {rowNumber}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
