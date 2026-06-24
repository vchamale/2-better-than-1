"use client";

import { AgendaEvent } from "@/lib/api";
import { formatTime } from "@/lib/datetime";
import { useAgendaStore } from "@/store/agenda";
import { EventTypeBadge } from "@/components/EventTypeBadge";

export function AgendaRow({ event }: { event: AgendaEvent }) {
  const toggleCompleted = useAgendaStore((s) => s.toggleCompleted);
  const removeEvent = useAgendaStore((s) => s.removeEvent);

  return (
    <li className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <button
        onClick={() => toggleCompleted(event)}
        aria-label={
          event.is_completed ? "Marcar como pendiente" : "Marcar como hecho"
        }
        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition ${
          event.is_completed
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-slate-300"
        }`}
      >
        {event.is_completed && (
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path
              fillRule="evenodd"
              d="M16.7 5.3a1 1 0 0 1 0 1.4l-7 7a1 1 0 0 1-1.4 0l-3-3a1 1 0 1 1 1.4-1.4l2.3 2.29 6.3-6.3a1 1 0 0 1 1.4 0Z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-base ${
            event.is_completed
              ? "text-slate-400 line-through"
              : "text-slate-900"
          }`}
        >
          {event.title}
        </p>
        <p className="text-sm text-slate-500">
          {formatTime(event.start_at)}
          {event.end_at ? ` – ${formatTime(event.end_at)}` : ""}
        </p>
      </div>

      <EventTypeBadge type={event.event_type} />

      <button
        onClick={() => removeEvent(event.id)}
        aria-label="Eliminar"
        className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-red-600"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path
            fillRule="evenodd"
            d="M8.5 2a1 1 0 0 0-.95.68L7.2 4H4a1 1 0 0 0 0 2h.06l.66 9.24A2 2 0 0 0 6.71 17h6.58a2 2 0 0 0 1.99-1.76L15.94 6H16a1 1 0 1 0 0-2h-3.2l-.35-1.32A1 1 0 0 0 11.5 2h-3Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </li>
  );
}
