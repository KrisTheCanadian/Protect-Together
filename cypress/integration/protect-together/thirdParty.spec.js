describe.skip('Third Party Authentication', () => {

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

describe.skip('Third Party Suite', () => {

    before(() => {
        cy.thirdPartyLogin()
    })


    it('Admin dashboard', () => {
        cy.visit('/')
        cy.contains('Welcome Admin')
        cy.get('[type="text"]').click().type('Cypress')
        cy.contains('Cypress Admin')
        cy.contains('Cypress Medical')
    })

    it('Admin dashboard', () => {
        cy.visit('/')
        cy.contains('Dashboard').click()
        cy.contains('Unassigned Patients').click()
        cy.contains('Add Account').click()
        cy.get('body').click(0,0);
        cy.get('[data-testid="NotificationsNoneOutlinedIcon"]').eq(0).click()
        cy.contains('Title Test')
    })

    after(() => {
        cy.logout()
    })

})
