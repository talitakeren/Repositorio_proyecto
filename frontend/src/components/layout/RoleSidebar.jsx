import { NavLink } from "react-router-dom";
import { GraduationCap, X } from "lucide-react";

/**
 * Sidebar institucional reutilizable por rol.
 * Acepta una lista de navItems con { to, label, icon, end, badge }.
 * Renderiza un footer opcional.
 */
export default function RoleSidebar({
  brandTitle = "SGOHA",
  brandSubtitle,
  navItems = [],
  footer,
  mobileOpen = false,
  onNavigate,
}) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-[min(264px,86vw)] flex-col bg-gradient-to-b from-sgoha-sidebar-from to-sgoha-sidebar-to text-white shadow-xl transition-transform duration-300 ease-out lg:translate-x-0 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-5 sm:px-5 sm:py-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 ring-2 ring-white/20 sm:h-11 sm:w-11">
            <GraduationCap className="h-5 w-5 text-white sm:h-6 sm:w-6" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-bold leading-tight tracking-tight sm:text-lg">
              {brandTitle}
            </p>
            {brandSubtitle && (
              <p className="truncate text-xs font-medium text-blue-200/90">
                {brandSubtitle}
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onNavigate}
          className="rounded-lg p-2 text-white/80 transition hover:bg-white/10 lg:hidden"
          aria-label="Cerrar menú"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {navItems.map(({ to, label, icon: Icon, end, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sgoha-secondary text-white shadow-md shadow-blue-900/30"
                  : "text-blue-100/90 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            {Icon && (
              <Icon
                className="h-[18px] w-[18px] shrink-0 opacity-90"
                strokeWidth={2}
              />
            )}
            <span className="truncate">{label}</span>
            {badge && (
              <span className="ml-auto rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold">
                {badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {footer && (
        <div className="border-t border-white/10 p-3 sm:p-4">{footer}</div>
      )}
    </aside>
  );
}
