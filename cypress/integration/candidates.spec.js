describe("candidates", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Can view and search for candidates", () => {
    cy.intercept({
      method: "GET",
      url: "**/candidates?limit=15&offset=0&search=TEST_CANDIDATE_1_DONT_LET_ME_DIE&state=active",
    }).as("candidateSearch");
    cy.visit("/openings");
    cy.contains("PERMANENT_OPENING").click();
    cy.get(`[name='search']`).type("TEST_CANDIDATE_1_DONT_LET_ME_DIE");
    cy.wait("@candidateSearch");
    cy.contains("TEST_CANDIDATE_1_DONT_LET_ME_DIE").click();
    cy.contains("Current score");
  });

  it("Can add candidate", () => {
    cy.visit("/openings");
    cy.contains("PERMANENT_OPENING").click();
    cy.contains("Add candidate").click();
    cy.get(`[name='name']`).type("Testing person");
    cy.get(`[name='email']`).type("email@wowow.com");
    cy.contains("Create candidate").click();
    cy.contains("Current score");
  });

  it("Can archive candidate", () => {
    cy.visit("/openings");
    cy.contains("PERMANENT_OPENING").click();
    cy.contains("Testing person").click();
    cy.contains("Edit details").click();
    cy.get("button.candidate-modal__archive").click();
  });
});
