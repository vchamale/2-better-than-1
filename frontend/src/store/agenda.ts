/**
 * Estado global de Agenda (Zustand). Mismo patrón que store/todos.ts:
 * el servidor es la fuente de verdad; cada acción llama a la API y refleja la
 * fila que devuelve el backend.
 */
import { create } from "zustand";

import {
  AgendaEvent,
  AgendaEventCreate,
  AgendaEventUpdate,
  AgendaRange,
  agendaApi,
} from "@/lib/api";

interface AgendaState {
  events: AgendaEvent[];
  loading: boolean;
  error: string | null;

  fetchEvents: (range?: AgendaRange) => Promise<void>;
  addEvent: (body: AgendaEventCreate) => Promise<void>;
  patchEvent: (id: string, body: AgendaEventUpdate) => Promise<void>;
  toggleCompleted: (event: AgendaEvent) => Promise<void>;
  removeEvent: (id: string) => Promise<void>;
}

export const useAgendaStore = create<AgendaState>((set, get) => ({
  events: [],
  loading: false,
  error: null,

  fetchEvents: async (range) => {
    set({ loading: true, error: null });
    try {
      const events = await agendaApi.list(range);
      set({ events, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  addEvent: async (body) => {
    set({ error: null });
    try {
      const created = await agendaApi.create(body);
      // Inserta y mantiene el orden por start_at ascendente (igual que el backend).
      set({
        events: [...get().events, created].sort((a, b) =>
          a.start_at.localeCompare(b.start_at),
        ),
      });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  patchEvent: async (id, body) => {
    set({ error: null });
    try {
      const updated = await agendaApi.update(id, body);
      set({
        events: get()
          .events.map((e) => (e.id === id ? updated : e))
          .sort((a, b) => a.start_at.localeCompare(b.start_at)),
      });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  toggleCompleted: async (event) => {
    await get().patchEvent(event.id, { is_completed: !event.is_completed });
  },

  removeEvent: async (id) => {
    set({ error: null });
    try {
      await agendaApi.remove(id);
      set({ events: get().events.filter((e) => e.id !== id) });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },
}));
