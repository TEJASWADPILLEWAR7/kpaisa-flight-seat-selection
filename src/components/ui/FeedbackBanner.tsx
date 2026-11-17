import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";
import type { FeedbackMessage, FeedbackType } from "../../types/booking";

interface FeedbackBannerProps {
  feedback: FeedbackMessage | null;
  onDismiss: () => void;
}

const STYLE_BY_TYPE: Record<
  FeedbackType,
  {
    container: string;
    iconColor: string;
    Icon: typeof Info;
  }
> = {
  info: {
    container:
      "bg-sky-50 border-sky-200 text-sky-900 dark:bg-sky-950/50 dark:border-sky-800/70 dark:text-sky-200",
    iconColor: "text-sky-600 dark:text-sky-400",
    Icon: Info,
  },
  success: {
    container:
      "bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/50 dark:border-emerald-800/70 dark:text-emerald-200",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    Icon: CheckCircle2,
  },
  warning: {
    container:
      "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/50 dark:border-amber-800/70 dark:text-amber-200",
    iconColor: "text-amber-600 dark:text-amber-400",
    Icon: AlertTriangle,
  },
  error: {
    container:
      "bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/50 dark:border-rose-800/70 dark:text-rose-200",
    iconColor: "text-rose-600 dark:text-rose-400",
    Icon: AlertCircle,
  },
};

export function FeedbackBanner({ feedback, onDismiss }: FeedbackBannerProps) {
  if (!feedback) {
    return null;
  }

  const { container, iconColor, Icon } = STYLE_BY_TYPE[feedback.type];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${container}`}
    >
      <div className="flex items-center gap-2.5">
        <Icon className={`h-4 w-4 shrink-0 ${iconColor}`} />
        <span className="font-medium">{feedback.text}</span>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="rounded-lg p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
