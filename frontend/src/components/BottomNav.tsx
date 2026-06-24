"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Barra de navegación inferior (mobile-first), común a toda la app.
 * 5 ranuras: Home · Agenda · ➕ (FAB central) · To-Dos · Finanzas.
 * Finanzas llega en un release posterior, por eso va deshabilitado.
 */

type Tab = {
  href: string;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
};

const homeIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 11.5 12 4l9 7.5M5 10v10h14V10" />
  </svg>
);

const agendaIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h11a2 2 0 0 1 2 2v16l-4-2-4 2-4-2V5a2 2 0 0 1 2-2Z" />
  </svg>
);

const todosIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />
  </svg>
);

const moneyIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M16 7.5C16 6 14.2 5 12 5S8 6 8 7.5 9.8 10 12 10s4 1 4 2.5S14.2 15 12 15s-4-1-4-2.5" />
  </svg>
);

const TABS: Tab[] = [
  { href: "/", label: "Home", icon: homeIcon },
  { href: "/agenda", label: "Agenda", icon: agendaIcon },
  { href: "/todos", label: "To-Dos", icon: todosIcon },
  { href: "/finanzas", label: "Finanzas", icon: moneyIcon, disabled: true },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto grid max-w-md grid-cols-5 items-center px-2 py-2">
        {/* Home + Agenda */}
        {TABS.slice(0, 2).map((tab) => (
          <NavItem key={tab.href} tab={tab} active={pathname === tab.href} />
        ))}

        {/* FAB central: añadir (por ahora lleva a Agenda) */}
        <div className="flex justify-center">
          <Link
            href="/agenda"
            aria-label="Añadir"
            className="grid h-12 w-12 place-items-center rounded-full bg-orange-500 text-white shadow-lg transition active:scale-95"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" d="M12 5v14M5 12h14" />
            </svg>
          </Link>
        </div>

        {/* To-Dos + Finanzas */}
        {TABS.slice(2).map((tab) => (
          <NavItem key={tab.href} tab={tab} active={pathname === tab.href} />
        ))}
      </div>
    </nav>
  );
}

function NavItem({ tab, active }: { tab: Tab; active: boolean }) {
  const base = "flex flex-col items-center gap-0.5 text-[10px] font-medium";

  if (tab.disabled) {
    return (
      <span className={`${base} text-slate-300`} aria-disabled>
        {tab.icon}
        {tab.label}
      </span>
    );
  }

  return (
    <Link
      href={tab.href}
      className={`${base} transition ${
        active ? "text-orange-600" : "text-slate-500 hover:text-slate-800"
      }`}
    >
      {tab.icon}
      {tab.label}
    </Link>
  );
}
