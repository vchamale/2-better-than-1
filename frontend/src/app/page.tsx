"use client";

import { useEffect, useMemo } from "react";

import { EventLineRow, LINE_ROW_CLASS } from "@/components/EventLineRow";
import { dayRangeIso } from "@/lib/datetime";
import { useAgendaStore } from "@/store/agenda";

/** Capitaliza la primera letra (los locales devuelven minúscula). */
function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Renglones mínimos para que la hoja se vea "llena" aunque haya pocos eventos. */
const MIN_ROWS = 9;

export default function HomePage() {
  const { events, error, fetchEvents } = useAgendaStore();

  // Home solo LEE los eventos de hoy (rango [00:00, 24:00) local).
  const today = useMemo(() => new Date(), []);
  useEffect(() => {
    fetchEvents(dayRangeIso(today));
  }, [fetchEvents, today]);

  const monthLabel = cap(today.toLocaleDateString("es-MX", { month: "long" }));
  const weekdayLabel = cap(today.toLocaleDateString("es-MX", { weekday: "long" }));
  const dayNumber = today.getDate();

  return (
    <main className="mx-auto w-full max-w-md px-6 py-6">
      <h1 className="mb-4 text-center text-2xl font-bold tracking-tight text-slate-900">
        {monthLabel}
      </h1>

      {/* Tarjeta tipo libreta: cada renglón es un div con borde inferior. */}
      <section className="rounded-2xl border border-amber-100 bg-amber-50 px-6 py-5 shadow-xl">
        <p className="text-sm font-medium text-slate-500">{weekdayLabel}</p>
        <p className="mb-2 text-6xl font-extrabold leading-none text-slate-800">
          {dayNumber}
        </p>

        {error && (
          <p className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {/* Renglones con eventos */}
        {events.map((ev) => (
          <EventLineRow key={ev.id} event={ev} />
        ))}

        {/* Renglones vacíos para completar la hoja */}
        {Array.from({ length: Math.max(0, MIN_ROWS - events.length) }).map(
          (_, i) => (
            <div key={`empty-${i}`} aria-hidden="true" className={LINE_ROW_CLASS} />
          ),
        )}
      </section>
    </main>
  );
}
