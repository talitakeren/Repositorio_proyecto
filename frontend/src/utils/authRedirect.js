/** Ruta de inicio según rol tras login. */
export function getHomePathForRole(role) {
  switch (role) {
    case "ADMIN":
      return "/dashboard";
    case "TEACHER":
      return "/teacher/home";
    case "STUDENT":
      return "/student/home";
    default:
      return "/login";
  }
}
