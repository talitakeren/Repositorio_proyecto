describe("E2E — Seguridad", () => {
  it("rutas admin bloqueadas sin token", () => {
    cy.clearLocalStorage();
    ["/dashboard", "/users", "/settings"].forEach((r) => {
      cy.visit(r);
      cy.url().should("include", "/login");
    });
  });

  it("token inválido limpia sesión", () => {
    cy.clearLocalStorage();
    window.localStorage.setItem("sgoha_token", "invalid");
    cy.intercept("GET", "**/auth/me", { statusCode: 401, body: { success: false } });
    cy.visit("/dashboard");
    cy.url().should("include", "/login");
  });
});
