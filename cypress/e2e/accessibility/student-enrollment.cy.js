const AXE_OPTIONS = {
  runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
};

function loginAsStudent() {
  cy.intercept("POST", "**/auth/login", {
    statusCode: 200,
    body: {
      success: true,
      data: {
        token: "a11y-student",
        user: { id: "3", name: "Alumno", email: "alumno@sgoha.edu", role: "STUDENT" },
      },
    },
  });
  cy.intercept("GET", "**/auth/me", {
    statusCode: 200,
    body: { success: true, data: { id: "3", name: "Alumno", email: "alumno@sgoha.edu", role: "STUDENT" } },
  });
  cy.intercept("GET", "**/student/**", {
    statusCode: 200,
    body: { success: true, data: { courses: [], enrollment: null } },
  });
  cy.visit("/login");
  cy.get("#email").type("alumno@sgoha.edu");
  cy.get("#password").type("123456");
  cy.get('button[type="submit"]').click();
}

describe("Accesibilidad — Matrícula alumno", () => {
  beforeEach(() => {
    loginAsStudent();
    cy.visit("/student/enrollment");
    cy.injectAxe();
  });

  it("axe WCAG en flujo de matrícula", () => {
    cy.checkA11y(null, AXE_OPTIONS, (violations) => {
      expect(violations.filter((v) => v.impact === "critical")).to.have.length(0);
    });
  });
});
