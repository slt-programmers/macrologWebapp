/// <reference types="cypress" />


describe('Food', () => {

  beforeEach(() => {
    const backendUrl = Cypress.env('backendUrl');

    cy.stubHealthcheck();
    
    cy.intercept('GET', `${backendUrl}/food`,
      (req) => { req.reply({ statusCode: 200, fixture: 'food.json' }) }).as('food');

    cy.visit('localhost:4200/dashboard/food', {
      onBeforeLoad: function (window) {
        window.localStorage.setItem('currentUser',
          JSON.stringify(
            {
              admin: false,
              email: "c.scholte.lubberink@gmail.com",
              id: 1,
              token: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2Vycy9Uek1Vb2NNRjRwIiwiZXhwIjoxNjM3NzQwNDQ3LCJuYW1lIjoiQ2FybWVuU2Nob2x0ZSIsInVzZXJJZCI6MX0.3OH3uLQPMgnb8hpYJCy2mapZqiHJil7--6R_V353NkY",
              userName: "CarmenScholte"
            })
        )
      }
    });
  });

  it('Search for food', () => {
    cy.get('#search').type('Ei');
  });

});
