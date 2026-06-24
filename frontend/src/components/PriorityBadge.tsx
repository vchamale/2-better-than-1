import { Priority } from "@/lib/api";

const STYLES: Record<Priority, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-slate-100 text-slate-600",
};

const LABELS: Record<Priority, string> = {
  high: "Alta",
  medium: "Media",
  low: "Baja",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${STYLES[priority]}`}
    >
      {LABELS[priority]}
    </span>
  );
}
