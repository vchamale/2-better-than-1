/**
 * Helpers de fecha/hora. El backend trabaja en tz-aware (ISO-8601 con offset);
 * aquí convertimos entre eso y lo que necesitan los inputs/labels del front.
 */

/**
 * Convierte el valor de un <input type="datetime-local"> (string local sin
 * offset, p. ej. "2026-06-24T18:00") a ISO-8601 UTC con "Z", que el backend
 * acepta como tz-aware.
 */
export function localInputToIso(value: string): string {
  return new Date(value).toISOString();
}

/**
 * Convierte un ISO del backend al formato que espera <input type="datetime-local">
 * (hora local, sin segundos ni offset). Útil para pre-llenar al editar.
 */
export function isoToLocalInput(iso: string): string {
  const d = new Date(iso);
  // Compensa el offset local para que el string represente la hora local.
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

/** Hora local "18:00" a partir de un ISO. */
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Rango [inicio, fin) del día local indicado, como ISO UTC para el filtro. */
export function dayRangeIso(day: Date): { start: string; end: string } {
  const start = new Date(day.getFullYear(), day.getMonth(), day.getDate());
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start: start.toISOString(), end: end.toISOString() };
}
