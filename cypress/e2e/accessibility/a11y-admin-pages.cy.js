const AXE_OPTIONS = {
  runOnly: {
    type: "tag",
    values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
  },
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
    body: {
      success: true,
      data: { id: "1", name: "Admin", email: "admin@sgoha.edu", role: "ADMIN" },
    },
  });
  cy.visit("/login");
  cy.get("#email").type("admin@sgoha.edu");
  cy.get("#password").type("123456");
  cy.get('button[type="submit"]').click();
}

describe("Accesibilidad — Módulos administrativos", () => {
  beforeEach(() => {
    loginAsAdmin();
  });

  it("cursos — axe WCAG", () => {
    cy.intercept("GET", "**/courses**", {
      statusCode: 200,
      body: { success: true, data: [] },
    });
    cy.visit("/courses");
    cy.injectAxe();
    cy.checkA11y(null, AXE_OPTIONS, (violations) => {
      const critical = violations.filter((v) => v.impact === "critical");
      expect(critical).to.have.length(0);
    });
  });

  it("docentes — axe WCAG", () => {
    cy.intercept("GET", "**/teachers**", {
      statusCode: 200,
      body: { success: true, data: [] },
    });
    cy.visit("/teachers");
    cy.injectAxe();
    cy.checkA11y(null, AXE_OPTIONS, (violations) => {
      const critical = violations.filter((v) => v.impact === "critical");
      expect(critical).to.have.length(0);
    });
  });

  it("matrícula — axe WCAG", () => {
    cy.intercept("GET", "**/enrollments**", {
      statusCode: 200,
      body: { success: true, data: [] },
    });
    cy.visit("/enrollments");
    cy.injectAxe();
    cy.checkA11y(null, AXE_OPTIONS, (violations) => {
      const critical = violations.filter((v) => v.impact === "critical");
      expect(critical).to.have.length(0);
    });
  });

  it("horarios — axe WCAG", () => {
    cy.intercept("GET", "**/schedules/precheck**", {
      statusCode: 200,
      body: {
        success: true,
        data: { canGenerate: false, checks: [], warnings: [], summary: {} },
      },
    });
    cy.visit("/schedules");
    cy.injectAxe();
    cy.checkA11y(null, AXE_OPTIONS, (violations) => {
      const critical = violations.filter((v) => v.impact === "critical");
      expect(critical).to.have.length(0);
    });
  });
});
