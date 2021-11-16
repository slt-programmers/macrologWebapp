/// <reference types="cypress" />

describe('Login', () => {

  beforeEach(() => {
    const backendUrl = Cypress.env('backendUrl');

    cy.stubHealthcheck();
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
    cy.get('#loginButton').click();
    cy.get('#usernameRequired').should('be.visible');
    cy.get('#passwordRequired').should('be.visible');
    cy.get('#username').type('username');
    cy.get('#password').type('thisIsSecret');
    cy.get('#loginButton').click();
    cy.get('#menuDiary').should('be.visible');
  });

  it('should register user', () => {
    cy.get('#menuRegister').click();
    cy.get('#registerButton').click();
    cy.get('#usernameRegisterRequired').should('be.visible');
    cy.get('#emailRequired').should('be.visible');
    cy.get('#passwordRegisterRequired').should('be.visible');
    cy.get('#usernameRegister').type('username');
    cy.get('#email').type('email@email.com');
    cy.get('#passwordRegister').type('thisIsSecret');
    cy.get('#registerButton').click();
    cy.get('#menuDiary').should('be.visible');
    cy.get('#onboardingTitle').should('be.visible');
  });

});
