const API = Cypress.env("API_URL") || "http://localhost:5001/api";

Cypress.Commands.add("loginByApi", (email, password) => {
  cy.request({
    method: "POST",
    url: `${API}/auth/login`,
    body: { email, password },
    failOnStatusCode: false,
  }).then((res) => {
    if (res.status === 200 && res.body?.data?.token) {
      window.localStorage.setItem("sgoha_token", res.body.data.token);
    }
    return res;
  });
});

Cypress.Commands.add("mockSession", (role = "ADMIN") => {
  const users = {
    ADMIN: { token: "cy-admin", home: "/dashboard", email: "admin@sgoha.edu" },
    TEACHER: { token: "cy-teacher", home: "/teacher/home", email: "docente@sgoha.edu" },
    STUDENT: { token: "cy-student", home: "/student/home", email: "alumno@sgoha.edu" },
  };
  const cfg = users[role];
  cy.intercept("GET", "**/auth/me", {
    statusCode: 200,
    body: {
      success: true,
      data: { id: "1", name: role, email: cfg.email, role },
    },
  }).as("getMe");
  window.localStorage.setItem("sgoha_token", cfg.token);
  return cy.wrap(cfg);
});
