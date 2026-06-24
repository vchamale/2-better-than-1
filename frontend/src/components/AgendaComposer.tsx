"use client";

import { useState } from "react";

import { EventType } from "@/lib/api";
import { localInputToIso } from "@/lib/datetime";
import { useAgendaStore } from "@/store/agenda";

const TYPES: { value: EventType; label: string }[] = [
  { value: "task", label: "Tarea" },
  { value: "note", label: "Nota" },
  { value: "reminder", label: "Recordatorio" },
];

export function AgendaComposer() {
  const addEvent = useAgendaStore((s) => s.addEvent);
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState<EventType>("task");
  const [startAt, setStartAt] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const trimmed = title.trim();
  const canSubmit = trimmed && startAt && !submitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    await addEvent({
      title: trimmed,
      event_type: eventType,
      start_at: localInputToIso(startAt),
    });
    setSubmitting(false);
    setTitle("");
    setEventType("task");
    setStartAt("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="¿Qué hay que agendar?"
        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-base outline-none focus:border-slate-400"
      />
      <input
        type="datetime-local"
        value={startAt}
        onChange={(e) => setStartAt(e.target.value)}
        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-base outline-none focus:border-slate-400"
      />
      <div className="flex items-center gap-2">
        <select
          value={eventType}
          onChange={(e) => setEventType(e.target.value as EventType)}
          className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
        >
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={!canSubmit}
          className="ml-auto rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition active:scale-95 disabled:opacity-40"
        >
          Añadir
        </button>
      </div>
    </form>
  );
}
