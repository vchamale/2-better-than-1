/**
 * Estado global de To-Dos (Zustand).
 *
 * El servidor es la fuente de verdad: cada acción llama a la API y luego refleja
 * la fila que devuelve el backend en el estado local. Sencillo y sin sorpresas;
 * más adelante se puede añadir optimismo si hace falta.
 */
import { create } from "zustand";

import { Todo, TodoCreate, TodoUpdate, todosApi } from "@/lib/api";

interface TodosState {
  todos: Todo[];
  loading: boolean;
  error: string | null;

  fetchTodos: () => Promise<void>;
  addTodo: (body: TodoCreate) => Promise<void>;
  patchTodo: (id: string, body: TodoUpdate) => Promise<void>;
  toggleDone: (todo: Todo) => Promise<void>;
  removeTodo: (id: string) => Promise<void>;
}

export const useTodosStore = create<TodosState>((set, get) => ({
  todos: [],
  loading: false,
  error: null,

  fetchTodos: async () => {
    set({ loading: true, error: null });
    try {
      const todos = await todosApi.list();
      set({ todos, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  addTodo: async (body) => {
    set({ error: null });
    try {
      const created = await todosApi.create(body);
      set({ todos: [created, ...get().todos] });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  patchTodo: async (id, body) => {
    set({ error: null });
    try {
      const updated = await todosApi.update(id, body);
      set({ todos: get().todos.map((t) => (t.id === id ? updated : t)) });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  toggleDone: async (todo) => {
    await get().patchTodo(todo.id, { is_done: !todo.is_done });
  },

  removeTodo: async (id) => {
    set({ error: null });
    try {
      await todosApi.remove(id);
      set({ todos: get().todos.filter((t) => t.id !== id) });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },
}));
