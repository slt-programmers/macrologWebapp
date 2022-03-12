/// <reference types="cypress" />

describe('Login', () => {

  beforeEach(() => {
    const backendUrl = Cypress.env('backendUrl');

    cy.stubHealthcheck();
    cy.stubGoals();
    cy.stubFood();
    cy.stubDishes();
    cy.intercept('POST', `${backendUrl}/api/authenticate`, (req) => {
      req.reply({ statusCode: 200, fixture: 'authenticate.json' })
    }).as('authenticate');
    cy.intercept('POST', `${backendUrl}/api/signup`, (req) => {
      req.reply({ statusCode: 200, fixture: 'register.json' })
    }).as('register');

    cy.visit('localhost:4200');
  });

  it('should log in', () => {
    cy.get('#menuLogin').click();
    cy.get('#menuAbout').should('be.visible');
    cy.get('#menuDiary').should('not.exist');
    cy.get('#loginButton').click();
    cy.get('#usernameRequired').should('be.visible');
    cy.get('#passwordRequired').should('be.visible');
    cy.get('#username').type('username');
    cy.get('#password').type('thisIsSecret');
    cy.get('#loginButton').click();
    cy.get('#menuDiary').should('be.visible');
    cy.get('#stackdonuts').should('be.visible');
    cy.get('#diaryPage').should('be.visible');
  });

});
