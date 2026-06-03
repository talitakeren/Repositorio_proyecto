export const PAGE_TITLES = {
  "/dashboard": "Dashboard general",
  "/users": "Gestión de usuarios",
  "/courses": "Gestión de cursos",
  "/teachers": "Gestión de docentes",
  "/classrooms": "Gestión de aulas",
  "/students": "Gestión de estudiantes",
  "/timeslots": "Franjas horarias",
  "/enrollments": "Matrícula",
  "/schedules": "Horarios académicos",
  "/schedules/generate": "Horarios académicos",
  "/schedules/results": "Horarios académicos",
  "/restrictions": "Restricciones",
  "/settings": "Configuración",
  "/account": "Mi cuenta",

  "/teacher/home": "Inicio docente",
  "/teacher/availability": "Mi disponibilidad",
  "/teacher/courses": "Mis cursos",
  "/teacher/schedule": "Mi horario",
  "/teacher/profile": "Mi perfil docente",
  "/teacher/account": "Mi cuenta",

  "/student/home": "Inicio alumno",
  "/student/enrollment": "Mi matrícula",
  "/student/enrollment-validation": "Validación de matrícula",
  "/student/schedule": "Mi horario",
  "/student/profile": "Mi perfil académico",
  "/student/account": "Mi cuenta",
};

export function getPageTitle(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  const match = Object.keys(PAGE_TITLES)
    .filter((p) => p !== "/dashboard")
    .sort((a, b) => b.length - a.length)
    .find((p) => pathname.startsWith(p));
  return match ? PAGE_TITLES[match] : "SGOHA";
}
