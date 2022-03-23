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
Cypress.Commands.add('patientLogin', () => {
    cy.logout()
    cy.get('body').then(body => {
        if (body.find('nav').length === 0) {
            cy.get('[name="email"]').type(Cypress.env('CYPRESS_PATIENT_EMAIL'), {log: false})
            cy.get('[name="password"]').type(Cypress.env('CYPRESS_PATIENT_PASSWORD'), {log: false})
            cy.get('button').click();
            cy.wait(2000)
        }
    })

})


Cypress.Commands.add('adminLogin', () => {
    cy.logout()
    cy.get('body').then(body => {
        if (body.find('nav').length === 0) {
            cy.get('[name="email"]').type(Cypress.env('CYPRESS_ADMIN_EMAIL'), {log: false})
            cy.get('[name="password"]').type(Cypress.env('CYPRESS_ADMIN_PASSWORD'), {log: false})
            cy.get('button').click();
            cy.wait(2000)
        }
    })

})


Cypress.Commands.add('medicalLogin', () => {
    cy.logout()
    cy.get('body').then(body => {
        if (body.find('nav').length === 0) {
            cy.get('[name="email"]').type(Cypress.env('CYPRESS_MEDICAL_EMAIL'), {log: false})
            cy.get('[name="password"]').type(Cypress.env('CYPRESS_MEDICAL_PASSWORD'), {log: false})
            cy.get('button').click();
            cy.wait(2000)
        }
    })

})


Cypress.Commands.add('logout', () => {
    cy.visit('/')
    cy.wait(2000)
    cy.get('body').then(body => {
        if (body.find('nav').length === 1) {
            cy.get('nav').find('button').should("contain", 'Logout').click()
        }
    })
})
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
