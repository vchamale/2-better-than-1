import { EventType } from "@/lib/api";

const STYLES: Record<EventType, string> = {
  task: "bg-sky-100 text-sky-700",
  note: "bg-violet-100 text-violet-700",
  reminder: "bg-amber-100 text-amber-700",
};

const LABELS: Record<EventType, string> = {
  task: "Tarea",
  note: "Nota",
  reminder: "Recordatorio",
};

export function EventTypeBadge({ type }: { type: EventType }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${STYLES[type]}`}
    >
      {LABELS[type]}
    </span>
  );
}
