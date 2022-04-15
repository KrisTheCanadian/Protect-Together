describe('Admin Authentication', () => {

    it('Login and Logout', () => {
        cy.logout()
        cy.get('body').then(body => {
            if (body.find('nav').length === 0) {
                cy.get('[name="email"]').type(Cypress.env('CYPRESS_ADMIN_EMAIL'), {log: false})
                cy.get('[name="password"]').type(Cypress.env('CYPRESS_ADMIN_PASSWORD'), {log: false})
                cy.get('button').click();
                cy.url().should("contain", '/dashboard')
                cy.contains('Welcome Admin')
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
        cy.contains('Welcome Admin')
        cy.get('[type="text"]').click().type('Cypress')
        cy.contains('Cypress Admin')
        cy.contains('Cypress Medical')
    })

    after(() => {
        cy.logout()
    })

})
describe('Sprint 4 Admin Suite', () => {

    before(() => {
        cy.adminLogin()
    })


    it('Admin dashboard', () => {
        cy.visit('/')
        cy.contains('Dashboard').click()
        cy.contains('Unassigned Patients').click()
        cy.contains('Add Account').click()
        cy.get('body').click(0,0);
        cy.contains('No new notifications')
        cy.get('body').click(0,0);
        cy.get('[data-testid="NotificationsNoneOutlinedIcon"]').eq(0).click()
        cy.contains('No notifications')
    })

    after(() => {
        cy.logout()
    })

})
