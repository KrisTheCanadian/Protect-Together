Cypress.Commands.add('patientLogin', () => {
    indexedDB.deleteDatabase('firebaseLocalStorageDb')
    cy.visit('/')
    cy.get('body').then(body => {
        if (body.find('nav').length === 0) {
            cy.get('[name="email"]').type(Cypress.env('CYPRESS_PATIENT_EMAIL'), {log: false})
            cy.get('[name="password"]').type(Cypress.env('CYPRESS_PATIENT_PASSWORD'), {log: false})
            cy.get('button').click();
            cy.location('pathname').should('eq', '/dashboard')
        }
    })
})

Cypress.Commands.add('patient1Login', () => {
    indexedDB.deleteDatabase('firebaseLocalStorageDb')
    cy.visit('/')
    cy.get('body').then(body => {
        if (body.find('nav').length === 0) {
            cy.get('[name="email"]').type(Cypress.env('CYPRESS_PATIENT1_EMAIL'), {log: false})
            cy.get('[name="password"]').type(Cypress.env('CYPRESS_PATIENT1_PASSWORD'), {log: false})
            cy.get('button').click();
            cy.location('pathname').should('eq', '/dashboard')
        }
    })
})


Cypress.Commands.add('adminLogin', () => {
    indexedDB.deleteDatabase('firebaseLocalStorageDb')
    cy.visit('/')
    cy.get('body').then(body => {
        if (body.find('nav').length === 0) {
            cy.get('[name="email"]').type(Cypress.env('CYPRESS_ADMIN_EMAIL'), {log: false})
            cy.get('[name="password"]').type(Cypress.env('CYPRESS_ADMIN_PASSWORD'), {log: false})
            cy.get('button').click();
            cy.location('pathname').should('eq', '/dashboard')
        }
    })

})


Cypress.Commands.add('medicalLogin', () => {
    indexedDB.deleteDatabase('firebaseLocalStorageDb')
    cy.visit('/')
    cy.get('body').then(body => {
        if (body.find('nav').length === 0) {
            cy.get('[name="email"]').type(Cypress.env('CYPRESS_MEDICAL_EMAIL'), {log: false})
            cy.get('[name="password"]').type(Cypress.env('CYPRESS_MEDICAL_PASSWORD'), {log: false})
            cy.get('button').click();
            cy.location('pathname').should('eq', '/dashboard')
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
