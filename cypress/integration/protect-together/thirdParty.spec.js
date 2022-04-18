describe('Third Party Authentication', () => {

    it.skip('Login and Logout', () => {
        indexedDB.deleteDatabase('firebaseLocalStorageDb')
        cy.visit('/')
        cy.get('body').then(body => {
            if (body.find('nav').length === 0) {
                cy.get('[name="email"]').type(Cypress.env('CYPRESS_THIRDPARTY_EMAIL'), {log: false})
                cy.get('[name="password"]').type(Cypress.env('CYPRESS_THIRDPARTY_PASSWORD'), {log: false})
                cy.get('button').click();
                cy.url().should("contain", '/dashboard')
                cy.contains('Welcome Party1')
                cy.get('nav').find('button').should("contain", 'Logout').click()
            }
        })
    })
})

describe('Third Party Suite', () => {

    before(() => {
        cy.thirdPartyLogin()
    })


    it('Third Party', () => {
        cy.visit('/dashboard')
        cy.wait(6000)
        cy.contains('Welcome Party1')
        cy.contains('Patient Test Results Distribution').parent().find('canvas').click()
        cy.contains('Assignment of Patients Distribution').parent().find('canvas').click()
        cy.contains('Patient Sex Distribution').parent().find('canvas').click()
        cy.contains('Patients Age Distribution').parent().find('canvas').click()
    })


    after(() => {
        cy.logout()
    })

})
