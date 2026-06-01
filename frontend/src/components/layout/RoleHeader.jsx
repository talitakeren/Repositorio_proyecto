import { useLocation, useNavigate } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { getInitials } from "../../utils/getInitials.js";
import { getPageTitle } from "../../utils/pageTitles.js";

const ROLE_LABEL = {
  ADMIN: "Administrador",
  TEACHER: "Docente",
  STUDENT: "Alumno",
};

const ROLE_BADGE = {
  ADMIN: "bg-blue-100 text-blue-700",
  TEACHER: "bg-green-100 text-green-700",
  STUDENT: "bg-amber-100 text-amber-700",
};

export default function RoleHeader({ onMenuClick, fallbackTitle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const title = getPageTitle(pathname) || fallbackTitle || "SGOHA";
  const initials = getInitials(user?.name || "U");
  const roleLabel = ROLE_LABEL[user?.role] || "Usuario";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-2 border-b border-gray-200 bg-white px-4 shadow-sm sm:h-16 sm:gap-3 sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="shrink-0 rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 lg:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold text-gray-800 sm:text-base">
            {title}
          </h1>
          <p className="hidden text-[11px] uppercase tracking-wide text-slate-400 sm:block">
            {roleLabel} · SGOHA
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <div className="hidden text-right sm:block">
          <p className="max-w-[180px] truncate text-sm font-medium text-slate-700">
            {user?.name}
          </p>
          <p className="text-[11px] text-slate-400">{user?.email}</p>
        </div>
        <span
          className={`hidden rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide sm:inline-block ${
            ROLE_BADGE[user?.role] || "bg-slate-100 text-slate-600"
          }`}
          title={`Rol activo: ${roleLabel}`}
        >
          {roleLabel}
        </span>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full bg-sgoha-primary text-xs font-bold text-white"
          title={`${user?.name} · ${roleLabel}`}
        >
          {initials}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
