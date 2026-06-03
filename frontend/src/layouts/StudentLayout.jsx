import { Outlet } from "react-router-dom";
import {
  Home,
  ClipboardCheck,
  ShieldCheck,
  Clock,
  UserRound,
  UserCog,
} from "lucide-react";
import RoleSidebar from "../components/layout/RoleSidebar.jsx";
import RoleHeader from "../components/layout/RoleHeader.jsx";
import { useMobileNav } from "../hooks/useMobileNav.js";

const studentNav = [
  { to: "/student/home", label: "Inicio", icon: Home, end: true },
  { to: "/student/enrollment", label: "Mi matrícula", icon: ClipboardCheck },
  {
    to: "/student/enrollment-validation",
    label: "Validación de matrícula",
    icon: ShieldCheck,
  },
  { to: "/student/schedule", label: "Mi horario", icon: Clock },
  { to: "/student/profile", label: "Perfil académico", icon: UserRound },
  { to: "/student/account", label: "Mi cuenta", icon: UserCog },
];

export default function StudentLayout() {
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
        brandTitle="SGOHA Alumno"
        brandSubtitle="Portal del alumno"
        navItems={studentNav}
        mobileOpen={open}
        onNavigate={close}
      />

      <div className="flex min-h-screen flex-col lg:ml-[264px]">
        <RoleHeader onMenuClick={toggle} fallbackTitle="Portal del alumno" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
