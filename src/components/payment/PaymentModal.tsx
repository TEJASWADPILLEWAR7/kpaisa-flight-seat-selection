import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CreditCard,
  KeyRound,
  Lock,
  Plane,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import type { AircraftConfig, PassengerCostItem } from "../../types/booking";
import type { PassengerMealCostItem } from "../../types/meals";
import { formatINR } from "../../utils/pricing";

interface PaymentModalProps {
  isOpen: boolean;
  aircraft: AircraftConfig;
  costBreakdown: PassengerCostItem[];
  mealBreakdown: PassengerMealCostItem[];
  totalAmount: number;
  onClose: () => void;
  onPaymentComplete: () => void;
}

type PaymentStep = "card" | "otp" | "success";

const DEMO_OTP = "482910";

export function PaymentModal(props: PaymentModalProps) {
  if (!props.isOpen) {
    return null;
  }

  return <PaymentModalContent {...props} />;
}

function PaymentModalContent({
  aircraft,
  costBreakdown,
  mealBreakdown,
  totalAmount,
  onClose,
  onPaymentComplete,
}: PaymentModalProps) {
  const [step, setStep] = useState<PaymentStep>("card");
  const [cardHolder, setCardHolder] = useState("Tejas Wadpillewar");
  const [cardNumber, setCardNumber] = useState("4532 8910 3412 8842");
  const [expiry, setExpiry] = useState("09/29");
  const [cvv, setCvv] = useState("742");
  const [cardError, setCardError] = useState<string | null>(null);

  const [otpDigits, setOtpDigits] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingRef] = useState(
    () => `KPA-${Math.floor(1000 + Math.random() * 9000)}`,
  );

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === "otp") {
      const timer = setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const assignedSeats = costBreakdown.filter((item) => item.seat !== null);
  const selectedMeals = mealBreakdown.filter((item) => item.meal !== null);

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const digitsOnly = cardNumber.replace(/\s+/g, "");
    if (cardHolder.trim().length < 2) {
      setCardError("Please enter the cardholder name.");
      return;
    }
    if (digitsOnly.length < 12) {
      setCardError("Please enter a valid 16-digit mock card number.");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry.trim())) {
      setCardError("Enter expiry in MM/YY format.");
      return;
    }
    if (!/^\d{3,4}$/.test(cvv.trim())) {
      setCardError("Enter a 3-digit CVV.");
      return;
    }

    setCardError(null);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep("otp");
    }, 350);
  };

  const handleOtpChange = (index: number, rawValue: string) => {
    const digit = rawValue.replace(/\D/g, "").slice(-1);
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);
    setOtpError(null);

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    const next = ["", "", "", "", "", ""];
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i];
    }
    setOtpDigits(next);
    setOtpError(null);
    const focusIndex = Math.min(pasted.length, 5);
    otpRefs.current[focusIndex]?.focus();
  };

  const handleAutoFillOtp = () => {
    setOtpDigits(DEMO_OTP.split(""));
    setOtpError(null);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpDigits.join("");
    if (entered !== DEMO_OTP) {
      setOtpError(`Incorrect OTP. Enter ${DEMO_OTP} or click "Fill OTP".`);
      return;
    }

    setOtpError(null);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep("success");
    }, 500);
  };

  if (step === "success") {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-success-title"
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 px-4 py-8 text-white"
      >
        <div className="mx-auto flex w-full max-w-md flex-col items-center text-center">
          <div className="relative flex h-28 w-28 items-center justify-center">
            <span className="animate-pulse-ring absolute inset-0 rounded-full bg-white/30" />
            <span
              style={{ animationDelay: "0.5s" }}
              className="animate-pulse-ring absolute inset-0 rounded-full bg-white/20"
            />
            <div className="animate-pop-circle relative flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-xl">
              <svg
                viewBox="0 0 52 52"
                className="h-12 w-12 text-emerald-600"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M14 27.2L22.2 35.4L38.5 18"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-draw-check"
                />
              </svg>
            </div>
          </div>

          <p className="mt-6 text-xs font-bold tracking-widest text-emerald-100 uppercase">
            KPaisa Air · E-Ticket Confirmed
          </p>
          <h2
            id="payment-success-title"
            className="mt-1.5 text-2xl font-extrabold tracking-tight sm:text-3xl"
          >
            {totalAmount === 0 ? "Selection Confirmed!" : "Payment Successful!"}
          </h2>
          <p className="mt-2 text-3xl font-black tabular-nums tracking-tight text-white">
            {formatINR(totalAmount)}
          </p>

          <div className="mt-6 w-full rounded-2xl border border-white/25 bg-white/15 p-4 text-left backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/20 pb-3">
              <div>
                <p className="text-[11px] font-medium text-emerald-100">
                  Booking Reference
                </p>
                <p className="text-sm font-extrabold tracking-wider text-white">
                  {bookingRef}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-medium text-emerald-100">
                  {aircraft.flightNumber}
                </p>
                <p className="inline-flex items-center gap-1 text-xs font-bold text-white">
                  <Plane className="h-3.5 w-3.5" />
                  {aircraft.route}
                </p>
              </div>
            </div>

            <div className="mt-3 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-emerald-100">Seats Confirmed</span>
                <span className="font-bold text-white">
                  {assignedSeats
                    .map((item) => `${item.passenger.code}: ${item.seat?.id}`)
                    .join(", ")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-emerald-100">In-Flight Meals</span>
                <span className="font-bold text-white">
                  {selectedMeals.length > 0
                    ? `${selectedMeals.length} selected`
                    : "None"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-emerald-100">Paid via</span>
                <span className="font-semibold text-white">
                  Card •••• {cardNumber.slice(-4)}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onPaymentComplete}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-emerald-700 shadow-lg transition-transform hover:scale-[1.01] hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-600"
          >
            <span>Done & Reset Booking</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-xs"
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="payment-modal-title"
                className="text-sm font-bold text-slate-900 dark:text-white"
              >
                KPaisa Secure Checkout
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {aircraft.flightNumber} · {aircraft.route}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close payment window"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-200/70 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between border-b border-slate-100 bg-sky-50/60 px-5 py-3 dark:border-slate-800 dark:bg-sky-950/30">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Payable Amount ({assignedSeats.length} seat
            {assignedSeats.length > 1 ? "s" : ""})
          </span>
          <span className="text-lg font-extrabold tabular-nums text-slate-900 dark:text-white">
            {formatINR(totalAmount)}
          </span>
        </div>

        {step === "card" ? (
          <form onSubmit={handleCardSubmit} className="space-y-4 p-5">
            <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-2 text-xs text-amber-900 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-200">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                Demo test card pre-filled for instant testing
              </span>
            </div>

            <div>
              <label
                htmlFor="card-number"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Card Number
              </label>
              <div className="relative mt-1.5">
                <input
                  id="card-number"
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  maxLength={19}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pr-10 pl-3.5 text-sm font-semibold tabular-nums text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <CreditCard className="absolute top-3 right-3 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label
                htmlFor="card-holder"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Cardholder Name
              </label>
              <input
                id="card-holder"
                type="text"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="card-expiry"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Expiry (MM/YY)
                </label>
                <input
                  id="card-expiry"
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  maxLength={5}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold tabular-nums text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="card-cvv"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  CVV
                </label>
                <input
                  id="card-cvv"
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  maxLength={4}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold tabular-nums text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            {cardError && (
              <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
                {cardError}
              </p>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-xs transition-colors hover:bg-slate-800 disabled:opacity-60 dark:bg-sky-600 dark:hover:bg-sky-500"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>
                {isProcessing
                  ? "Sending OTP..."
                  : "Proceed to OTP Verification"}
              </span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4 p-5">
            <div className="flex items-center justify-between rounded-xl border border-sky-200 bg-sky-50 px-3.5 py-2.5 dark:border-sky-800/70 dark:bg-sky-950/50">
              <div className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                <div>
                  <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                    Test Verification OTP
                  </p>
                  <p className="font-mono text-sm font-extrabold tracking-widest text-sky-700 dark:text-sky-300">
                    {DEMO_OTP}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAutoFillOtp}
                className="rounded-lg bg-sky-600 px-2.5 py-1.5 text-xs font-bold text-white shadow-2xs transition-colors hover:bg-sky-700"
              >
                Fill OTP
              </button>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Enter 6-Digit One-Time Password
              </p>
              <div className="mt-2.5 grid grid-cols-6 gap-2">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onPaste={handleOtpPaste}
                    aria-label={`OTP digit ${idx + 1}`}
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white text-center text-base font-extrabold tabular-nums text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                ))}
              </div>
            </div>

            {otpError && (
              <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
                {otpError}
              </p>
            )}

            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setStep("card")}
                className="rounded-xl border border-slate-200 px-4 py-3 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isProcessing}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-xs transition-colors hover:bg-emerald-700 disabled:opacity-60"
              >
                <span>
                  {isProcessing
                    ? "Verifying Payment..."
                    : `Verify & Pay ${formatINR(totalAmount)}`}
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
