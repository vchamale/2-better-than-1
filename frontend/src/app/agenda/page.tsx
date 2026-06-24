"use client";

import { useEffect, useMemo } from "react";

import { AgendaEvent } from "@/lib/api";
import { useAgendaStore } from "@/store/agenda";
import { AgendaComposer } from "@/components/AgendaComposer";
import { AgendaRow } from "@/components/AgendaRow";

/** Etiqueta de día tipo "jueves, 24 jun" a partir de un ISO. */
function dayLabel(iso: string): string {
  return new Date(iso).toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
}

/** Agrupa los eventos (ya ordenados por start_at) por día. */
function groupByDay(events: AgendaEvent[]): [string, AgendaEvent[]][] {
  const groups = new Map<string, AgendaEvent[]>();
  for (const ev of events) {
    const key = new Date(ev.start_at).toDateString();
    const bucket = groups.get(key);
    if (bucket) bucket.push(ev);
    else groups.set(key, [ev]);
  }
  return [...groups.entries()];
}

export default function AgendaPage() {
  const { events, loading, error, fetchEvents } = useAgendaStore();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const grouped = useMemo(() => groupByDay(events), [events]);

  return (
    <main className="mx-auto w-full max-w-md px-4 py-6">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Agenda
        </h1>
        <p className="text-sm text-slate-500">
          {events.length} evento{events.length === 1 ? "" : "s"}
        </p>
      </header>

      <AgendaComposer />

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading && events.length === 0 ? (
        <p className="mt-8 text-center text-sm text-slate-400">Cargando…</p>
      ) : events.length === 0 ? (
        <p className="mt-8 text-center text-sm text-slate-400">
          Nada en la agenda todavía.
        </p>
      ) : (
        <div className="mt-5 space-y-5">
          {grouped.map(([day, dayEvents]) => (
            <section key={day}>
              <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {dayLabel(dayEvents[0].start_at)}
              </h2>
              <ul className="space-y-2">
                {dayEvents.map((ev) => (
                  <AgendaRow key={ev.id} event={ev} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
