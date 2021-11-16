/// <reference types="cypress" />

describe('Login', () => {
  
  beforeEach(() => {
    const backendUrl = Cypress.env('backendUrl');

    cy.stubHealthcheck();
    cy.intercept('POST', `${backendUrl}/api/authenticate`, (req) => {
      req.reply({ statusCode: 200, fixture: 'authenticate.json' })
    }).as('authenticate');

    cy.visit('localhost:4200');
  });

  it('should log in', () => {
    cy.get('#menuLogin').click();
    cy.get('#loginButton').click();
    cy.get('#usernameRequired').should('be.visible');
    cy.get('#passwordRequired').should('be.visible');
    cy.get('#username').type('username');
    cy.get('#password').type('thisIsSecret');
    cy.get('#loginButton').click();
    cy.get('#menuDiary').should('be.visible');
  });

});
