describe("Aceptación — Navegación admin", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.mockSession("ADMIN");
    cy.intercept("GET", "**/dashboard/**", { statusCode: 200, body: { success: true, data: {} } });
  });

  it("accede al dashboard", () => {
    cy.visit("/dashboard");
    cy.url().should("include", "/dashboard");
  });

  it("sin sesión redirige a login", () => {
    cy.clearLocalStorage();
    cy.visit("/dashboard");
    cy.url().should("include", "/login");
  });

  it("lista cursos mock", () => {
    cy.intercept("GET", "**/courses**", {
      statusCode: 200,
      body: {
        success: true,
        data: [{ _id: "1", code: "CS101", name: "Programación", credits: 4, active: true }],
      },
    });
    cy.visit("/courses");
    cy.contains("CS101").should("be.visible");
  });
});
