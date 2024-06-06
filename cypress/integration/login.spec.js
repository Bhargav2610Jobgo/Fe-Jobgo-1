describe("login", () => {
  it("Visits the login page", () => {
    cy.visit("/login");
  });

  it("Can log in", () => {
    cy.intercept({
      method: "POST",
      url: "**/self/login",
    }).as("selfRequest");

    cy.visit("/login");

    cy.get(`[name='email']`).type("test@hireproof.io");
    cy.get(`[name='password']`).type(Cypress.env("password"));
    cy.get("button").click();
    cy.wait("@selfRequest");
    cy.window()
      .its("localStorage")
      .invoke("getItem", "hireproof_token")
      .should("exist");
  });
});
