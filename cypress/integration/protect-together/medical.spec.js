describe('Medical Authentication', () => {

    it('Login and Logout', () => {
        cy.logout()
        cy.get('body').then(body => {
            if (body.find('nav').length === 0) {
                cy.get('[name="email"]').type(Cypress.env('CYPRESS_MEDICAL_EMAIL'), {log: false})
                cy.get('[name="password"]').type(Cypress.env('CYPRESS_MEDICAL_PASSWORD'), {log: false})
                cy.get('button').click();
                cy.url().should("contain", '/dashboard')
                cy.contains('Welcome Dr. Demo')
                cy.get('nav').find('button').should("contain", 'Logout').click()
            }
        })
    })
})

describe('Sprint 3 Medical Suite', () => {

    before(() => {
        cy.medicalLogin()
    })

    it('Medical dashboard', () => {
        cy.visit('/')
        cy.contains('Welcome Dr. Demo')
        cy.get('button').contains('View Appointments')
        cy.get('[type="text"]').click().type('Cypress')
        // cy.contains('Cypress System Tests')
    })

    after(() => {
        cy.logout()
    })

})
