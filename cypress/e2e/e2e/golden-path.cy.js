describe("E2E — Golden Path", () => {
  it("login → dashboard → cursos → logout", () => {
    cy.clearLocalStorage();
    cy.intercept("POST", "**/auth/login", {
      statusCode: 200,
      body: {
        success: true,
        data: {
          token: "golden",
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
    cy.intercept("GET", "**/dashboard/**", { body: { success: true, data: {} } });
    cy.intercept("GET", "**/courses**", {
      body: {
        success: true,
        data: [{ _id: "1", code: "CS101", name: "Prog", credits: 4, active: true }],
      },
    });

    cy.visit("/login");
    cy.get("#email").type("admin@sgoha.edu");
    cy.get("#password").type("123456");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/dashboard");

    cy.visit("/courses");
    cy.contains("CS101").should("be.visible");

    cy.clearLocalStorage();
    cy.visit("/login");
  });
});
