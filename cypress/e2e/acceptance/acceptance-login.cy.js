describe("Aceptación — Login SGOHA", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit("/login");
  });

  it("muestra formulario de inicio de sesión", () => {
    cy.contains(/iniciar sesión/i).should("be.visible");
    cy.get("#email").should("exist");
    cy.get("#password").should("exist");
  });

  it("valida campos vacíos", () => {
    cy.get('button[type="submit"]').click();
    cy.contains(/ingresa tu correo/i).should("be.visible");
  });

  it("login exitoso con mock API", () => {
    cy.intercept("POST", "**/auth/login", {
      statusCode: 200,
      body: {
        success: true,
        data: {
          token: "acc-token",
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
    cy.get("#email").type("admin@sgoha.edu");
    cy.get("#password").type("123456");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/dashboard");
  });

  it("credenciales incorrectas", () => {
    cy.intercept("POST", "**/auth/login", {
      statusCode: 401,
      body: { success: false, message: "Credenciales incorrectas" },
    });
    cy.get("#email").type("admin@sgoha.edu");
    cy.get("#password").type("wrong");
    cy.get('button[type="submit"]').click();
    cy.contains(/credenciales incorrectas/i).should("be.visible");
  });
});
