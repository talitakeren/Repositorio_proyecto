describe("E2E — Unhappy Path", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit("/login");
  });

  it("login incorrecto", () => {
    cy.intercept("POST", "**/auth/login", {
      statusCode: 401,
      body: { success: false, message: "Credenciales incorrectas" },
    });
    cy.get("#email").type("admin@sgoha.edu");
    cy.get("#password").type("bad");
    cy.get('button[type="submit"]').click();
    cy.contains(/credenciales incorrectas/i);
    cy.url().should("include", "/login");
  });

  it("ruta protegida sin auth", () => {
    cy.visit("/users");
    cy.url().should("include", "/login");
  });
});
