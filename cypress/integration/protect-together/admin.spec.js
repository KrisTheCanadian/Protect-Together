describe('Admin Authentication', () => {

    it('Login and Logout', () => {
        cy.logout()
        cy.get('body').then(body => {
            if (body.find('nav').length === 0) {
                cy.get('[name="email"]').type(Cypress.env('CYPRESS_ADMIN_EMAIL'), {log: false})
                cy.get('[name="password"]').type(Cypress.env('CYPRESS_ADMIN_PASSWORD'), {log: false})
                cy.get('button').click();
                cy.url().should("contain", '/dashboard')
                cy.contains('Welcome admin')
                cy.get('nav').find('button').should("contain", 'Logout').click()
            }
        })
    })
})

describe('Sprint 3 Admin Suite', () => {

    before(() => {
        cy.adminLogin()
    })


    it('Admin dashboard', () => {
        cy.visit('/')
        cy.contains('Welcome admin')
        cy.get('button').contains('Add Account')
        cy.get('[type="text"]').click().type('Cypress')
        cy.contains('Cypress Admin')
        cy.contains('Cypress Medical')
    })

    after(() => {
        cy.logout()
    })

})