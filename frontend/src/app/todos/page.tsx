"use client";

import { useEffect } from "react";

import { useTodosStore } from "@/store/todos";
import { TodoComposer } from "@/components/TodoComposer";
import { TodoRow } from "@/components/TodoRow";

export default function TodosPage() {
  const { todos, loading, error, fetchTodos } = useTodosStore();

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const pending = todos.filter((t) => !t.is_done);
  const done = todos.filter((t) => t.is_done);

  return (
    <main className="mx-auto w-full max-w-md px-4 py-6">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          To-Dos
        </h1>
        <p className="text-sm text-slate-500">
          {pending.length} pendiente{pending.length === 1 ? "" : "s"}
        </p>
      </header>

      <TodoComposer />

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading && todos.length === 0 ? (
        <p className="mt-8 text-center text-sm text-slate-400">Cargando…</p>
      ) : todos.length === 0 ? (
        <p className="mt-8 text-center text-sm text-slate-400">
          No hay nada pendiente. ¡A descansar! 🎉
        </p>
      ) : (
        <div className="mt-5 space-y-5">
          {pending.length > 0 && (
            <ul className="space-y-2">
              {pending.map((todo) => (
                <TodoRow key={todo.id} todo={todo} />
              ))}
            </ul>
          )}

          {done.length > 0 && (
            <section>
              <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Hechos ({done.length})
              </h2>
              <ul className="space-y-2">
                {done.map((todo) => (
                  <TodoRow key={todo.id} todo={todo} />
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
