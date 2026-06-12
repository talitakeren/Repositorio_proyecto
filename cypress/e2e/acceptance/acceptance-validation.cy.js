describe("Aceptación — Validaciones", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit("/login");
  });

  it("correo con formato inválido", () => {
    cy.get("#email").type("mal-correo");
    cy.get("#password").type("123456");
    cy.get('button[type="submit"]').click();
    cy.contains(/correo válido/i).should("be.visible");
  });

  it("error servidor 500", () => {
    cy.intercept("POST", "**/auth/login", {
      statusCode: 500,
      body: { success: false, message: "Error interno" },
    });
    cy.get("#email").type("admin@sgoha.edu");
    cy.get("#password").type("123456");
    cy.get('button[type="submit"]').click();
    cy.get('[role="alert"]').should("exist");
  });
});
