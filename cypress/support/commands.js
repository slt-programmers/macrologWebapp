// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add('stubHealthcheck', () => {
  const backendUrl = Cypress.env('backendUrl');
  cy.intercept('GET', `${backendUrl}/healthcheck`, (req) => {
    req.reply({ statusCode: 200, body: true })
  }).as('healthcheck');
});

Cypress.Commands.add('stubGoals', () => {
  cy.intercept('GET', '**/goalProtein?date=*', (req) => {
    req.reply({ statusCode: 200, body: 120 })
  }).as('goalProtein');
  cy.intercept('GET', '**/goalFat?date=*', (req) => {
    req.reply({ statusCode: 200, body: 130 })
  }).as('goalFat');
  cy.intercept('GET', '**/goalCarbs?date=*', (req) => {
    req.reply({ statusCode: 200, body: 50 })
  }).as('goalCarbs');
});

Cypress.Commands.add('stubFood', () => {
  const backendUrl = Cypress.env('backendUrl')
  cy.intercept('GET', `${backendUrl}/food`, (req) => {
    req.reply({ statusCode: 200, fixture: 'food.json' })
  }).as('food')
});
Cypress.Commands.add('stubEmptyFood', () => {
  const backendUrl = Cypress.env('backendUrl')
  cy.intercept('GET', `${backendUrl}/food`, (req) => {
    req.reply({ statusCode: 200, body: [] })
  }).as('food')
});

Cypress.Commands.add('stubDishes', () => {
  const backendUrl = Cypress.env('backendUrl')
  cy.intercept('GET', `${backendUrl}/dishes`, (req) => {
    req.reply({ statusCode: 200, fixture: 'dishes.json' })
  }).as('dishes')
});
Cypress.Commands.add('stubEmptyDishes', () => {
  const backendUrl = Cypress.env('backendUrl')
  cy.intercept('GET', `${backendUrl}/dishes`, (req) => {
    req.reply({ statusCode: 200, body: [] })
  }).as('dishes')
});
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
