const AXE_OPTIONS = {
  runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
};

function loginAsTeacher() {
  cy.intercept("POST", "**/auth/login", {
    statusCode: 200,
    body: {
      success: true,
      data: {
        token: "a11y-teacher",
        user: { id: "2", name: "Docente", email: "docente@sgoha.edu", role: "TEACHER" },
      },
    },
  });
  cy.intercept("GET", "**/auth/me", {
    statusCode: 200,
    body: { success: true, data: { id: "2", name: "Docente", email: "docente@sgoha.edu", role: "TEACHER" } },
  });
  cy.intercept("GET", "**/teachers/me**", {
    statusCode: 200,
    body: {
      success: true,
      data: { _id: "t1", name: "Docente", availability: [] },
    },
  });
  cy.visit("/login");
  cy.get("#email").type("docente@sgoha.edu");
  cy.get("#password").type("123456");
  cy.get('button[type="submit"]').click();
}

describe("Accesibilidad — Disponibilidad docente", () => {
  beforeEach(() => {
    loginAsTeacher();
    cy.visit("/teacher/availability");
    cy.injectAxe();
  });

  it("axe WCAG en grilla de disponibilidad", () => {
    cy.checkA11y(null, AXE_OPTIONS, (violations) => {
      expect(violations.filter((v) => v.impact === "critical")).to.have.length(0);
    });
  });
});
