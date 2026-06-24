/**
 * Cliente HTTP del backend FastAPI.
 *
 * Los tipos reflejan los schemas Pydantic (app/schemas/todo.py). Mantenerlos en
 * sync con el contrato: si cambia el schema, cambia aquí.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type Priority = "low" | "medium" | "high";

/** Espejo de TodoRead. */
export interface Todo {
  id: string;
  family_id: string;
  created_by: string;
  completed_by: string | null;
  title: string;
  description: string | null;
  priority: Priority;
  is_done: boolean;
  completed_at: string | null;
}

/** Espejo de TodoCreate. */
export interface TodoCreate {
  title: string;
  description?: string | null;
  priority?: Priority;
}

/** Espejo de TodoUpdate (edición parcial). */
export interface TodoUpdate {
  title?: string;
  description?: string | null;
  priority?: Priority;
  is_done?: boolean;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${detail}`);
  }

  // 204 No Content (DELETE) no trae body.
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const todosApi = {
  list: () => request<Todo[]>("/todos"),

  create: (body: TodoCreate) =>
    request<Todo>("/todos", { method: "POST", body: JSON.stringify(body) }),

  update: (id: string, body: TodoUpdate) =>
    request<Todo>(`/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  remove: (id: string) =>
    request<void>(`/todos/${id}`, { method: "DELETE" }),
};

// ── Agenda ──────────────────────────────────────────────────────────────────
// Espejan los schemas de app/schemas/agenda.py. Las fechas viajan como string
// ISO-8601 con offset (tz-aware), p. ej. "2026-06-24T18:00:00-06:00".

export type EventType = "task" | "note" | "reminder";

/** Espejo de AgendaEventRead. */
export interface AgendaEvent {
  id: string;
  family_id: string;
  created_by: string;
  title: string;
  description: string | null;
  event_type: EventType;
  start_at: string;
  end_at: string | null;
  remind_at: string | null;
  is_completed: boolean;
}

/** Espejo de AgendaEventCreate. */
export interface AgendaEventCreate {
  title: string;
  description?: string | null;
  event_type?: EventType;
  start_at: string;
  end_at?: string | null;
  remind_at?: string | null;
}

/** Espejo de AgendaEventUpdate (edición parcial). */
export interface AgendaEventUpdate {
  title?: string;
  description?: string | null;
  event_type?: EventType;
  start_at?: string;
  end_at?: string | null;
  remind_at?: string | null;
  is_completed?: boolean;
}

/** Filtro opcional de rango para el listado (lo usa Home para "hoy"). */
export interface AgendaRange {
  start?: string;
  end?: string;
}

export const agendaApi = {
  list: (range?: AgendaRange) => {
    const qs = new URLSearchParams();
    if (range?.start) qs.set("start", range.start);
    if (range?.end) qs.set("end", range.end);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return request<AgendaEvent[]>(`/agenda${suffix}`);
  },

  create: (body: AgendaEventCreate) =>
    request<AgendaEvent>("/agenda", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  update: (id: string, body: AgendaEventUpdate) =>
    request<AgendaEvent>(`/agenda/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  remove: (id: string) =>
    request<void>(`/agenda/${id}`, { method: "DELETE" }),
};
