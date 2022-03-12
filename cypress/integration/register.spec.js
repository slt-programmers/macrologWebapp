/// <reference types="cypress" />

describe('Register', () => {

  beforeEach(() => {
    const backendUrl = Cypress.env('backendUrl');

    cy.stubHealthcheck();
    cy.stubEmptyFood();
    cy.stubEmptyDishes();
    cy.intercept('POST', `${backendUrl}/api/authenticate`, (req) => {
      req.reply({ statusCode: 200, fixture: 'authenticate.json' })
    }).as('authenticate');
    cy.intercept('POST', `${backendUrl}/api/signup`, (req) => {
      req.reply({ statusCode: 200, fixture: 'signup.json' })
    }).as('signup');

    cy.visit('localhost:4200');
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

  // TODO
  // it('should go through onboarding', () => {
  //   cy.get('#menuRegister').click();
  //   cy.get('#registerButton').click();
  //   cy.get('#usernameRegister').type('username');
  //   cy.get('#email').type('email@email.com');
  //   cy.get('#passwordRegister').type('thisIsSecret');
  //   cy.get('#registerButton').click();
  // });
});
