import { useEffect, useState } from "react";
import { Header } from "./components/layout/Header";
import { MealSelector } from "./components/meals/MealSelector";
import { PassengerPanel } from "./components/passengers/PassengerPanel";
import { PaymentModal } from "./components/payment/PaymentModal";
import { BookingSummary } from "./components/pricing/BookingSummary";
import { SeatMap } from "./components/seats/SeatMap";
import { FeedbackBanner } from "./components/ui/FeedbackBanner";
import { useMealSelection } from "./hooks/useMealSelection";
import { useSeatBooking } from "./hooks/useSeatBooking";

export function App() {
  const {
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
  } = useSeatBooking();

  const {
    mealAssignments,
    mealBreakdown,
    totalMealCost,
    selectedMealsCount,
    toggleMeal,
    removeMeal,
    resetMeals,
    pruneMealsForCount,
  } = useMealSelection(state.passengers);

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("kpaisa-theme");
      if (saved === "dark" || saved === "light") {
        return saved;
      }
    }
    return "light";
  });

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("kpaisa-theme", theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handlePassengerCountChange = (count: number) => {
    setPassengerCount(count);
    pruneMealsForCount(count);
  };

  const handleResetAll = () => {
    resetAssignments();
    resetMeals();
  };

  const handlePaymentComplete = () => {
    setIsPaymentOpen(false);
    handleResetAll();
  };

  const combinedTotal = totalCost + totalMealCost;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <Header
        aircraft={aircraft}
        layoutType={state.layoutType}
        passengerCount={state.passengers.length}
        assignedCount={assignedCount}
        theme={theme}
        onSelectLayout={setLayoutType}
        onToggleTheme={handleToggleTheme}
      />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {state.feedback && (
          <div className="mb-5">
            <FeedbackBanner
              feedback={state.feedback}
              onDismiss={clearFeedback}
            />
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="lg:sticky lg:top-24 lg:col-span-3">
            <PassengerPanel
              passengers={state.passengers}
              activePassengerId={state.activePassengerId}
              assignments={state.assignments}
              seatsById={aircraft.seatsById}
              onChangeCount={handlePassengerCountChange}
              onSelectPassenger={selectPassenger}
              onRemoveAssignment={removeAssignment}
            />
          </div>

          <div className="space-y-6 lg:col-span-6">
            <SeatMap
              aircraft={aircraft}
              activePassenger={activePassenger}
              seatToPassengerMap={seatToPassengerMap}
              passengersById={passengersById}
              availableSeatsCount={availableSeatsCount}
              onSelectSeat={toggleSeat}
            />

            <MealSelector
              activePassenger={activePassenger}
              mealAssignments={mealAssignments}
              mealBreakdown={mealBreakdown}
              selectedMealsCount={selectedMealsCount}
              onToggleMeal={toggleMeal}
              onRemoveMeal={removeMeal}
            />
          </div>

          <div className="lg:sticky lg:top-24 lg:col-span-3">
            <BookingSummary
              costBreakdown={costBreakdown}
              mealBreakdown={mealBreakdown}
              totalSeatCost={totalCost}
              totalMealCost={totalMealCost}
              assignedCount={assignedCount}
              selectedMealsCount={selectedMealsCount}
              onRemoveAssignment={removeAssignment}
              onRemoveMeal={removeMeal}
              onResetAll={handleResetAll}
              onProceedToPayment={() => setIsPaymentOpen(true)}
            />
          </div>
        </div>
      </main>

      <PaymentModal
        isOpen={isPaymentOpen}
        aircraft={aircraft}
        costBreakdown={costBreakdown}
        mealBreakdown={mealBreakdown}
        totalAmount={combinedTotal}
        onClose={() => setIsPaymentOpen(false)}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );
}

export default App;
