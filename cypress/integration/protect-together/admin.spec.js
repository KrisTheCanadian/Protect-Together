describe('Admin Authentication', () => {

    it.skip('Login and Logout', () => {
        indexedDB.deleteDatabase('firebaseLocalStorageDb')
        cy.visit('/')
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

describe('Admin Suite', () => {

    before(() => {
        cy.adminLogin()
    })


    it('Admin Dashboard', () => {
        cy.visit('/')
        cy.contains('Welcome Admin')
        cy.get('[type="text"]').click().type('Cypress')
        cy.contains('Cypress Admin')
        cy.contains('Cypress Medical')
        cy.contains('Dashboard').click()
        cy.contains('Unassigned Patients').click()
        cy.get('[data-testid="NotificationsNoneOutlinedIcon"]').eq(0).click()
        cy.contains('Title Test')
    })

    it('Add Admin Account', () => {
        cy.visit('/')
        cy.contains('Add Account').click()
        cy.get('[aria-labelledby="role role"]').click()
        cy.get('[data-value="admin"]').click()
        cy.get('[data-testid="first-name"]').click().type('New')
        cy.get('[data-testid="last-name"]').click().type('Admin')
        cy.get('[data-testid="email"]').click().type('admin@test.com')
        cy.get('[data-testid="phone-number"]').click().type('(514) 848-2424')
        cy.contains('Send Activation Link to Email').click()
    })


    it('Add Medical Account', () => {
        cy.visit('/')
        cy.contains('Add Account').click()
        cy.get('[aria-labelledby="role role"]').click()
        cy.get('[data-value="medical"]').click()
        cy.get('[data-testid="first-name"]').click().type('New')
        cy.get('[data-testid="last-name"]').click().type('Medical')
        cy.get('[data-testid="email"]').click().type('medical@test.com')
        cy.get('[data-testid="phone-number"]').click().type('(514) 848-2424')
        cy.contains('Send Activation Link to Email').click()
    })

    it('Add Third Party Account', () => {
        cy.visit('/')
        cy.contains('Add Account').click()
        cy.get('[aria-labelledby="role role"]').click()
        cy.get('[data-value="thirdParty"]').click()
        cy.get('[data-testid="first-name"]').click().type('Third')
        cy.get('[data-testid="last-name"]').click().type('Party')
        cy.get('[data-testid="email"]').click().type('thirdparty@test.com')
        cy.get('[data-testid="phone-number"]').click().type('(514) 848-2424')
        cy.contains( 'Send Activation Link to Email').click()
    })

    it('Edit Patient Slots', () => {
        cy.visit('/')
        cy.get('[data-testid="EditOutlinedIcon"]').eq(1).click()
        cy.get('[value="21"]').click().clear().click().type('33')
        cy.contains('Save').click()
    })

    it.skip('Add Medical Availabilities', () => {
        cy.visit('/')
        cy.get('[data-testid="InsertInvitationIcon"]').eq(1).click()
        cy.contains('Sun').click()
        cy.contains('Fri').click()
        cy.contains('Sat').click()
        cy.get('[value="09:05 am"]').click({force: true}).clear().click({force: true}).type("08:50 am")
        cy.contains('Save').click({force: true})
        cy.get('body').click(0, 0,{force: true});
    })

    it('Admin Table', () => {
        cy.visit('/')
        cy.contains('5').click()
        cy.contains('25').click()
        cy.contains('Name').click()
        cy.contains('Role').click()
        cy.contains('Patient Slots').click()
        cy.contains('Appointment Slots').click()
        cy.contains('Status').click()
        cy.contains('Modify').click()
        cy.get('[data-testid="DeleteOutlinedIcon"]').eq(0).click()
        cy.get('body').click(0,0);
    })



    after(() => {
        cy.logout()
    })

})
