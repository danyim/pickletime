/// <reference types="cypress" />

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
      cy.get("input[type='email']").type(Cypress.env("SPOTERY_USERNAME"));
      cy.get("input[type='password']").type(Cypress.env("SPOTERY_PASSWORD"));
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

describe("spotery", () => {
  beforeEach(() => {
    console.log("ENV VARS", Cypress.env());
    // Turn off exception handling
    Cypress.on("uncaught:exception", (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      return false;
    });
  });

  it("logs in (first time)", () => {
    cy.visit("https://www.spotery.com/");
    cy.get("a").contains("login / sign up").click();
    cy.get("div.auth0-lock-name").should("exist");
    cy.get("input[type='email']").type(Cypress.env("SPOTERY_USERNAME"));
    cy.get("input[type='password']").type("SPOTERY_PASSWORD");
    cy.get("span.auth0-label-submit").contains("Log In").click();
    verifyLoggedIn();
  });

  it("logs in (nth time)", () => {
    cy.visit("https://www.spotery.com/");
    cy.get("a").contains("login / sign up").click();
    cy.get("div.auth0-lock-name").should("exist");
    cy.get(".auth0-lock-social-button-text").click();

    verifyLoggedIn();
  });

  it.only("logs in using sessions API", () => {
    const username = Cypress.env("SPOTERY_USERNAME");
    const password = Cypress.env("SPOTERY_PASSWORD");

    cy.session(
      [username, password],
      () => {
        cy.visit("https://www.spotery.com/");
        cy.get("a").contains("login / sign up").click();
        cy.get("div.auth0-lock-name").should("exist");
        cy.get("input[type='email']").type(username);
        cy.get("input[type='password']").type(password);
        cy.get("span.auth0-label-submit").contains("Log In").click();

        // Verify we're logged in
        verifyLoggedIn();

        // // Homepage: select city
        // cy.get("select").select("San Francisco");
        // cy.get("a").contains("search").click();

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

  it("check if logged in", () => {
    cy.visit("https://www.spotery.com/");
    verifyLoggedIn();
  });

  // Needs work. We can use jQuery to determine the AppState and make assertions/actions from there
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
