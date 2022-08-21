/// <reference types="cypress" />

const USERNAME = Cypress.env("SPOTERY_USERNAME");
const PASSWORD = Cypress.env("SPOTERY_PASSWORD");
const FIRST_NAME = Cypress.env("SPOTERY_USER_FIRST_NAME");

/** On the login page, enters and submits the user login details */
const enterAndSubmitUserDetails = () => {
  cy.get("input[type='email']").type(USERNAME);
  cy.get("input[type='password']").type(PASSWORD);
  cy.get("span.auth0-label-submit").contains("Log In").click();
};

/** Clicks the Login button on the home page */
const clickLogin = () => {
  cy.get("a").contains("login / sign up").click();
  cy.get("div.auth0-lock-name").should("exist");
};

/** Assertions to verify that the user is logged in */
const verifyLoggedIn = () => {
  cy.contains(FIRST_NAME).should("exist");
};

describe("Spotery Login", () => {
  beforeEach(() => {
    // Turn off exception handling
    Cypress.on("uncaught:exception", () => {
      // returning false here prevents Cypress from failing the test
      return false;
    });
  });

  xit("[DEBUG] logs in (first time)", () => {
    cy.visit("https://www.spotery.com/");
    clickLogin();
    enterAndSubmitUserDetails();
    verifyLoggedIn();
  });

  /**
   * When logging in for the nth time, Auth0 recognizes your cookie/auth token and will simply
   * present you with a username to click on.
   */
  xit("[DEBUG] logs in (nth time)", () => {
    cy.visit("https://www.spotery.com/");
    clickLogin();
    cy.get(".auth0-lock-social-button-text").click();

    verifyLoggedIn();
  });

  /**
   * This is the only test case that seems to work. Auth0 requires a cookie to be set upon
   * redirection and Cypress' session wrapper is the only way to for Spotery to get the context
   */
  it.only("logs in using Cypress' sessions API", () => {
    cy.session(
      [USERNAME, PASSWORD],
      () => {
        cy.visit("https://www.spotery.com/");
        clickLogin();
        enterAndSubmitUserDetails();

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
