import { Outlet } from "react-router-dom";
import {
  Home,
  CalendarClock,
  BookOpen,
  Clock,
  UserRound,
  UserCog,
} from "lucide-react";
import RoleSidebar from "../components/layout/RoleSidebar.jsx";
import RoleHeader from "../components/layout/RoleHeader.jsx";
import { useMobileNav } from "../hooks/useMobileNav.js";

const teacherNav = [
  { to: "/teacher/home", label: "Inicio", icon: Home, end: true },
  { to: "/teacher/availability", label: "Mi disponibilidad", icon: CalendarClock },
  { to: "/teacher/courses", label: "Mis cursos", icon: BookOpen },
  { to: "/teacher/schedule", label: "Mi horario", icon: Clock },
  { to: "/teacher/profile", label: "Perfil", icon: UserRound },
  { to: "/teacher/account", label: "Mi cuenta", icon: UserCog },
];

export default function TeacherLayout() {
  const { open, toggle, close } = useMobileNav();

  return (
    <div className="min-h-screen bg-sgoha-bg">
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={close}
          aria-label="Cerrar menú"
        />
      )}

      <RoleSidebar
        brandTitle="SGOHA Docente"
        brandSubtitle="Portal del docente"
        navItems={teacherNav}
        mobileOpen={open}
        onNavigate={close}
      />

      <div className="flex min-h-screen flex-col lg:ml-[264px]">
        <RoleHeader onMenuClick={toggle} fallbackTitle="Portal del docente" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
