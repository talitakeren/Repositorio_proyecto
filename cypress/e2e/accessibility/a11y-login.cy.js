/** Comprueba accesibilidad WCAG 2.x con reglas axe-core. */
const AXE_OPTIONS = {
  runOnly: {
    type: "tag",
    values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
  },
};

describe("Accesibilidad — Login", () => {
  beforeEach(() => {
    cy.visit("/login");
    cy.injectAxe();
  });

  it("cumple reglas axe WCAG 2.x en pantalla de login", () => {
    cy.checkA11y(null, AXE_OPTIONS);
  });
});

describe("Accesibilidad — Login autenticado (mock)", () => {
  beforeEach(() => {
    cy.intercept("POST", "**/auth/login", {
      statusCode: 200,
      body: {
        success: true,
        data: {
          token: "a11y-token",
          user: { id: "1", name: "Admin", email: "admin@sgoha.edu", role: "ADMIN" },
        },
      },
    });
    cy.intercept("GET", "**/auth/me", {
      statusCode: 200,
      body: {
        success: true,
        data: { id: "1", name: "Admin", email: "admin@sgoha.edu", role: "ADMIN" },
      },
    });
    cy.intercept("GET", "**/dashboard/summary", {
      statusCode: 200,
      body: { success: true, data: { courses: 0, teachers: 0, students: 0 } },
    });
    cy.visit("/login");
    cy.get("#email").type("admin@sgoha.edu");
    cy.get("#password").type("123456");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/dashboard");
    cy.injectAxe();
  });

  it("dashboard admin sin violaciones axe críticas", () => {
    cy.checkA11y(null, AXE_OPTIONS, (violations) => {
      const critical = violations.filter((v) => v.impact === "critical");
      expect(critical, JSON.stringify(critical, null, 2)).to.have.length(0);
    });
  });
});
