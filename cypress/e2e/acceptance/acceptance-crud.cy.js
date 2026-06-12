describe("Aceptación — CRUD cursos", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.mockSession("ADMIN");
    cy.intercept("GET", "**/courses**", {
      statusCode: 200,
      body: {
        success: true,
        data: [
          { _id: "1", code: "CS101", name: "Programación I", credits: 4, active: true },
        ],
      },
    }).as("courses");
  });

  it("visualiza listado de cursos", () => {
    cy.visit("/courses");
    cy.wait("@courses");
    cy.contains("CS101").should("be.visible");
  });
});
