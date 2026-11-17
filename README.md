# KPaisa Air — Flight Seat Selection & Passenger Management

A responsive, type-safe flight seat-selection application built with **React 19, TypeScript, and Tailwind CSS v4** for the **KPaisa Frontend Developer Technical Assessment**.

The application simulates a complete flight seat-selection and passenger-management experience, featuring dynamic passenger allocation, multiple aircraft cabin configurations, real-time INR pricing, optional in-flight meals, and a mock payment checkout with OTP verification.

## ✨ Key Features

### 1. Dynamic Passenger Management (0–9 Travelers)

- Dynamically increase or decrease the passenger count between `0` and `9`.
- Select individual passengers (`P1`, `P2`, etc.) to assign seats and meals.
- Automatically remove seat and meal assignments when passengers are removed.
- Keep passenger information synchronized across the seat map and booking summary.

### 2. Dual Aircraft Cabin Configurations

Supports two aircraft layouts with different seating arrangements:

**3–2 Narrowbody — KP-204 (BOM → BLR)**

- Columns: `A B C | D E`
- 10 seating rows.
- Exit row divider.

**2–3–2 Widebody — KP-518 (DEL → BOM)**

- Columns: `A B | C D E | F G`
- 10 seating rows.

Switching between aircraft configurations automatically reconciles existing seat assignments, retaining valid selections and releasing unavailable or pre-occupied seats with a feedback notification.

### 3. Strict Seat Assignment Invariants

- **One seat per passenger:** Selecting a new seat automatically releases the passenger's previous seat.
- **One passenger per seat:** Prevents multiple passengers from selecting the same seat.
- **Occupied seat protection:** Pre-occupied seats cannot be selected.
- **One-click removal:** Remove assignments from the seat map, passenger cards, or booking summary.
- **Clear all:** Reset all passenger seat selections at once.

### 4. Real-Time INR Pricing

Seat pricing is calculated dynamically using integer INR values.

| Seat Category | Price |
| ------------- | ----: |
| Standard      |    ₹0 |
| Premium       |  ₹250 |
| Extra Legroom |  ₹350 |

**Optional In-Flight Meals**

Each passenger can independently select an in-flight meal.

| Meal                     | Price |
| ------------------------ | ----: |
| Classic Veg Thali        |    ₹0 |
| Fruit & Nut Platter      |  ₹200 |
| Asian Stir-Fry Bowl      |  ₹250 |
| Smoked Paneer Tikka Wrap |  ₹350 |

**Live Booking Summary**

- Individual passenger seat and meal breakdown.
- Separate seat and meal subtotals.
- Automatically updated combined booking total.
- Integer-based pricing calculations to avoid floating-point currency errors.

### 5. Mock Checkout & OTP Verification

- Interactive mock card payment checkout.
- Pre-filled test payment credentials.
- Six-digit OTP verification.
- Test OTP: `482910`.
- One-click OTP autofill.
- Animated full-screen booking confirmation.
- Clean booking reset after successful confirmation.

> This is a frontend checkout simulation. No real payment is processed.

### 6. Light & Dark Theme

- Light and dark theme support.
- Tailwind CSS v4 class-based theme switching.
- Theme preference persisted using `localStorage`.

### 7. Responsive & Accessible UI

- Responsive layout for different screen sizes.
- Reusable seat components.
- Accessible seat-selection controls.
- ARIA live feedback notifications.
- Visual seat-status indicators and pricing legends.

---

## 🏗️ Architecture & State Management

The application follows a modular, component-based architecture with centralized state management and separated business logic.

### Reducer-Based State Management

`src/hooks/useSeatBooking.ts`

- Uses React's `useReducer` for deterministic state transitions.
- Centralizes passenger, aircraft-layout, and seat-assignment mutations.
- Keeps the cabin map, passenger list, and pricing summary synchronized.
- Makes state transitions predictable and easier to maintain.

### Domain Validation & Pricing

`src/utils/`

**`validation.ts`**

- Prevents duplicate seat assignments.
- Enforces occupied-seat restrictions.
- Handles passenger removal and assignment pruning.
- Reconciles seat assignments when switching aircraft layouts.

**`pricing.ts`**

- Calculates seat and meal line items.
- Computes individual subtotals and combined totals.
- Uses integer-based INR calculations.
- Formats currency using `Intl.NumberFormat('en-IN')`.

### Decoupled Meal Management

`src/hooks/useMealSelection.ts`

- Maintains independent meal-selection state.
- Tracks meals per passenger.
- Handles passenger removal and associated meal cleanup.
- Keeps meal logic separate from core seat-inventory management.

### Optimized Seat Lookups

Uses React's `useMemo` to derive lookup maps:

- `seatToPassengerMap`
- `passengersById`
- `seatsById`

These maps enable efficient seat-status resolution during cabin rendering.

---

## 🛠️ Tech Stack

| Technology        | Purpose                           |
| ----------------- | --------------------------------- |
| React 19          | UI development                    |
| TypeScript        | Type safety                       |
| Vite              | Development server and build tool |
| Tailwind CSS v4   | Styling and responsive design     |
| Lucide React      | Icons                             |
| React Hooks       | State management and optimization |
| Intl.NumberFormat | INR currency formatting           |
| localStorage      | Theme persistence                 |

---

## 📁 Project Structure

```text
src/
├── components/
│   ├── layout/
│   │   └── Header.tsx
│   ├── meals/
│   │   └── MealSelector.tsx
│   ├── passengers/
│   │   └── PassengerPanel.tsx
│   ├── payment/
│   │   └── PaymentModal.tsx
│   ├── pricing/
│   │   └── BookingSummary.tsx
│   ├── seats/
│   │   ├── SeatButton.tsx
│   │   ├── SeatLegend.tsx
│   │   └── SeatMap.tsx
│   └── ui/
│       └── FeedbackBanner.tsx
├── data/
│   ├── aircraft.ts
│   ├── meals.ts
│   ├── passengers.ts
│   └── seats.ts
├── hooks/
│   ├── useMealSelection.ts
│   └── useSeatBooking.ts
├── types/
│   ├── booking.ts
│   └── meals.ts
├── utils/
│   ├── pricing.ts
│   └── validation.ts
├── App.tsx
├── index.css
└── main.tsx
```

---

## 🚀 Local Setup & Installation

### Prerequisites

- Node.js (LTS recommended)
- npm

### 1. Clone the Repository

```bash
git clone git clone https://github.com/TEJASWADPILLEWAR7/kpaisa-flight-seat-selection.git
cd kpaisa-air
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Run Quality Checks

```bash
# ESLint
npm run lint

# TypeScript validation
npx tsc --noEmit

# Production build
npm run build
```

---

## 🧪 Test Checkout

Use the following mock OTP to complete the checkout simulation:

| Field | Test Value |
| ----- | ---------- |
| OTP   | `482910`   |

The checkout flow is for demonstration purposes only and does not involve real payment processing.

---

## 👨‍💻 Developer

**Tejas Wadpillewar**

Frontend Developer | React | TypeScript | JavaScript

I'm interested in building practical, scalable web applications with clean architecture, maintainable code, and thoughtful user experiences.

- **GitHub:** [TEJASWADPILLEWAR7](https://github.com/TEJASWADPILLEWAR7)
- **Portfolio:** [tejaswadpillewar.site](https://tejaswadpillewar.site/)
- **LinkedIn:** [Tejas Wadpillewar](https://www.linkedin.com/in/tejas-wadpillewar7/)
- **Email:** [tejaswadpillewar2@gmail.com](mailto:tejaswadpillewar2@gmail.com)

---

_Built with React, TypeScript, and attention to detail._
