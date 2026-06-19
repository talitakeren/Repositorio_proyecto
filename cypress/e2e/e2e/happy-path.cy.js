describe("E2E — Happy Path", () => {
  it("docente accede a su portal", () => {
    cy.clearLocalStorage();
    cy.intercept("POST", "**/auth/login", {
      statusCode: 200,
      body: {
        success: true,
        data: {
          token: "happy",
          user: { id: "1", name: "Doc", email: "docente@sgoha.edu", role: "TEACHER" },
        },
      },
    });
    cy.intercept("GET", "**/auth/me", {
      body: {
        success: true,
        data: { id: "1", name: "Doc", email: "docente@sgoha.edu", role: "TEACHER" },
      },
    });
    cy.visit("/login");
    cy.get("#email").type("docente@sgoha.edu");
    cy.get("#password").type("123456");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/teacher");
  });
});
