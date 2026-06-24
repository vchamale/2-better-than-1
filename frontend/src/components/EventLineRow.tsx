import { AgendaEvent } from "@/lib/api";
import { formatTime } from "@/lib/datetime";

/** Clases compartidas por los renglones de la libreta (con y sin evento). */
export const LINE_ROW_CLASS =
  "h-10 border-b border-[rgba(148,163,184,0.35)]";

/** Un renglón de la libreta que muestra un evento, centrado sobre la línea. */
export function EventLineRow({ event }: { event: AgendaEvent }) {
  return (
    <div className={`flex items-center gap-2 text-slate-700 ${LINE_ROW_CLASS}`}>
      <span className="text-slate-400">•</span>
      <span
        className={`flex-1 ${
          event.is_completed ? "text-slate-400 line-through" : ""
        }`}
      >
        {event.title}
      </span>
      <span className="text-xs text-slate-400">
        {formatTime(event.start_at)}
      </span>
    </div>
  );
}
