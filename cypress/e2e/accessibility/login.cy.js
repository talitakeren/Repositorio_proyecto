const AXE_OPTIONS = {
  runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
};

describe("Accesibilidad — Login", () => {
  beforeEach(() => {
    cy.visit("/login");
    cy.injectAxe();
  });

  it("cumple reglas axe WCAG en /login", () => {
    cy.checkA11y(null, AXE_OPTIONS);
  });
});
