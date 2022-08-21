/// <reference types="cypress" />

const USERNAME = Cypress.env("SPOTERY_USERNAME");
const PASSWORD = Cypress.env("SPOTERY_PASSWORD");
const FIRST_NAME = Cypress.env("SPOTERY_USER_FIRST_NAME");

enum AppState {
  NotLoggedIn,
  LoginPromptFirstTime,
  LoginPromptSecondTime,
}

const login = (name: string) => {
  cy.session(
    name,
    () => {
      cy.visit("https://www.spotery.com/");
      cy.get("a").contains("login / sign up").click();
      cy.get("div.auth0-lock-name").should("exist");
      cy.get("input[type='email']").type(USERNAME);
      cy.get("input[type='password']").type(PASSWORD);
      cy.get("span.auth0-label-submit").contains("Log In").click();

      // Verify we're logged in
      verifyLoggedIn();
    },
    {
      validate() {},
    }
  );
};

const verifyLoggedIn = () => {
  cy.contains("Daniel").should("exist");
};

describe("Spotery Login", () => {
  beforeEach(() => {
    // Turn off exception handling
    Cypress.on("uncaught:exception", () => {
      // returning false here prevents Cypress from failing the test
      return false;
    });
  });

  it("logs in (first time)", () => {
    cy.visit("https://www.spotery.com/");
    cy.get("a").contains("login / sign up").click();
    cy.get("div.auth0-lock-name").should("exist");
    cy.get("input[type='email']").type(USERNAME);
    cy.get("input[type='password']").type(PASSWORD);
    cy.get("span.auth0-label-submit").contains("Log In").click();
    verifyLoggedIn();
  });

  /**
   * When logging in for the nth time, Auth0 recognizes your cookie/auth token and will simply
   * present you with a username to click on.
   */
  it("logs in (nth time)", () => {
    cy.visit("https://www.spotery.com/");
    cy.get("a").contains("login / sign up").click();
    cy.get("div.auth0-lock-name").should("exist");
    cy.get(".auth0-lock-social-button-text").click();

    verifyLoggedIn();
  });

  it.only("logs in using sessions API", () => {
    cy.session(
      [USERNAME, PASSWORD],
      () => {
        cy.visit("https://www.spotery.com/");
        cy.get("a").contains("login / sign up").click();
        cy.get("div.auth0-lock-name").should("exist");
        cy.get("input[type='email']").type(USERNAME);
        cy.get("input[type='password']").type(PASSWORD);
        cy.get("span.auth0-label-submit").contains("Log In").click();

        // Verify we're logged in
        verifyLoggedIn();

        const dateStr = "08/21/2022";
        cy.visit(
          `https://www.spotery.com/spot/3333270?psReservationDateStr=${dateStr}`
        );

        cy.get('a[data-afr-fcs="true"][class="xfp"]').then(($body) => {
          console.log(
            "elements!",
            $body.map((v) => v.innerHTML)
          );
        });
      },
      {
        validate() {},
      }
    );
  });

  xit("check if logged in", () => {
    cy.visit("https://www.spotery.com/");
    verifyLoggedIn();
  });

  // Needs work. We can use jQuery to determine the AppState and make conditional assertions/actions from there
  xit("check if logged in", () => {
    cy.visit("https://www.spotery.com/");
    cy.get("body")
      .then(($body) => {
        if ($body.find("input").length) {
          // input was found, do something else here
          return "input";
        }

        // else assume it was textarea
        return "textarea";
      })
      .then((selector) => {
        // selector is a string that represents
        // the selector we could use to find it
        cy.get(selector).type(`found the element by selector ${selector}`);
      });
  });
});
