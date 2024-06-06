Cypress.Commands.add("login", () => {
  cy.intercept({
    method: "POST",
    url: "**/self/login",
  }).as("loginRequest");

  cy.intercept({
    method: "GET",
    url: "**/self",
  }).as("selfRequest");

  cy.visit("/login");

  cy.get(`[name='email']`).type("test@hireproof.io");
  cy.get(`[name='password']`).type(Cypress.env("password"));
  cy.get("button").click();
  cy.wait("@loginRequest");
  cy.wait("@selfRequest");
});
