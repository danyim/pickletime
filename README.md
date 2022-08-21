# Pickleball Court Reservations

Leveraging Cypress to automate the booking of a tennis/pickleball court at Glen Park's recreation center. The booking system is through Spotery, which uses Auth0 for authentication.

## Setup
- Create a `cypress.env.json` at the root of the project with the keys `SPOTERY_USERNAME` and `SPOTERY_PASSWORD`
    ```json
    {
      "SPOTERY_USERNAME": "test@email.com",
      "SPOTERY_PASSWORD": "password"
    }
    ```
- Run `yarn cy:open`

## TODO
- [ ] Configurable preference for dates and times (e.g. Fri-Sat 3-8pm)
- [ ] Parsing available dates and times on [the reservation page](https://www.spotery.com/spot/3333270?psReservationDateStr=08/21/2022)
- [ ] Accepting the reCaptcha "I am not a robot" checkbox
- [ ] Confirming the booking
