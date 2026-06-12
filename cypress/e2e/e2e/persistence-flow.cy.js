describe("E2E — Persistencia (mock)", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.mockSession("ADMIN");
  });

  it("dato persiste tras reload", () => {
    cy.intercept("GET", "**/courses**", {
      body: {
        success: true,
        data: [{ _id: "p1", code: "PERS01", name: "Persistente", credits: 4, active: true }],
      },
    }).as("courses");
    cy.visit("/courses");
    cy.wait("@courses");
    cy.contains("PERS01").should("be.visible");
    cy.reload();
    cy.wait("@courses");
    cy.contains("PERS01").should("be.visible");
  });
});
