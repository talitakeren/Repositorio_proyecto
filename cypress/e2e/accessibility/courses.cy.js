const AXE_OPTIONS = {
  runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
};

function loginAsAdmin() {
  cy.intercept("POST", "**/auth/login", {
    statusCode: 200,
    body: {
      success: true,
      data: {
        token: "a11y-admin",
        user: { id: "1", name: "Admin", email: "admin@sgoha.edu", role: "ADMIN" },
      },
    },
  });
  cy.intercept("GET", "**/auth/me", {
    statusCode: 200,
    body: { success: true, data: { id: "1", name: "Admin", email: "admin@sgoha.edu", role: "ADMIN" } },
  });
  cy.visit("/login");
  cy.get("#email").type("admin@sgoha.edu");
  cy.get("#password").type("123456");
  cy.get('button[type="submit"]').click();
}

describe("Accesibilidad — Cursos", () => {
  beforeEach(() => {
    loginAsAdmin();
    cy.intercept("GET", "**/courses**", { statusCode: 200, body: { success: true, data: [] } });
    cy.visit("/courses");
    cy.injectAxe();
  });

  it("axe WCAG en listado de cursos", () => {
    cy.checkA11y(null, AXE_OPTIONS, (violations) => {
      expect(violations.filter((v) => v.impact === "critical")).to.have.length(0);
    });
  });
});
