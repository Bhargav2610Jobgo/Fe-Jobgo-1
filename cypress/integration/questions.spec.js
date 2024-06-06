describe("questions", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Can view questions", () => {
    cy.contains("PERMANENT_OPENING").click();
    cy.get("a.candidate-list__header__button-group__edit-button").click();
    cy.contains("DONT_DELETE")
      .parents(".hp-interview-card")
      .find("a")
      .contains("Edit interview")
      .click();
    cy.contains("Search questions").click();
    cy.contains("TEST_QUESTION_DO_NOT_DELETE").should(
      "contain",
      "TEST_QUESTION_DO_NOT_DELETE"
    );
  });

  it("Can add a new question", () => {
    cy.contains("PERMANENT_OPENING").click();
    cy.get("a.candidate-list__header__button-group__edit-button").click();
    cy.contains("DONT_DELETE")
      .parents(".hp-interview-card")
      .find("a")
      .contains("Edit interview")
      .click();
    cy.contains("Create question").click();
    cy.get(".edit-question")
      .get(`[name='content']`)
      .type("THIS_IS_A_FAKE_QUESTION");
    cy.get(`[name='skillSearch']`).type("Pepper");
    cy.get(".hp-skill-search__flyout__option--value").click({ force: true });
    cy.get(`[name='guideline-0']`).type("TESTING_GUIDELINE_0");
    cy.contains("Add evaluation criteria").click();
    cy.get(`[name='guideline-1']`).type("TESTING_GUIDELINE_1");
    cy.get(".edit-question__actions").find("button").click();
    cy.contains("THIS_IS_A_FAKE_QUESTION").should("exist");
  });

  it("Can delete a question", () => {
    cy.contains("PERMANENT_OPENING").click();
    cy.get("a.candidate-list__header__button-group__edit-button").click();
    cy.contains("DONT_DELETE")
      .parents(".hp-interview-card")
      .find("a")
      .contains("Edit interview")
      .click();
    cy.get(".hp-options-dropdown__flyout").eq(1).click();
    cy.contains("Edit question").click();
    cy.contains("Delete question template").click();
    cy.get(`[name='confirmation']`).type("DELETE");
    cy.get(`form > .hp-button > .hp-button__button`).click();
    cy.contains("Oh my!").should("exist");
  });
});
