import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/",                label: "Cursos" },
  { to: "/create-course",   label: "Nuevo Curso" },
  { to: "/teachers",        label: "Docentes" },
  { to: "/create-teacher",  label: "Nuevo Docente" },
  { to: "/classrooms",      label: "Aulas" },
  { to: "/students",        label: "Estudiantes" },
  { to: "/schedule",        label: "Generar Horario" },
  { to: "/student-schedule",label: "Ver Horario" },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          🎓 <span>EduSchedule</span>
        </Link>
        <div className="navbar-links">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={pathname === to ? "active" : ""}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}