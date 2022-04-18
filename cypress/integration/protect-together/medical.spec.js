describe('Medical Authentication', () => {

    it.skip('Login and Logout', () => {
        indexedDB.deleteDatabase('firebaseLocalStorageDb')
        cy.visit('/')
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

describe('Medical Suite', () => {

    before(() => {
        cy.medicalLogin()
    })

    it('Medical dashboard', () => {
        cy.visit('/')
        cy.contains('Welcome Dr. Demo')
        cy.get('span').contains('View Appointments')
        cy.get('[type="text"]').click().type('Cypress')
        cy.contains('Dashboard').click()
        cy.contains('5').click()
        // cy.contains('10').click()
        cy.contains('Name').click()
        cy.contains('Age').click()
        cy.contains('Appointment Dates').click()
        cy.contains('Status').click()
        cy.contains('Severity').click()
        cy.contains('Latest Symptoms').click()
        cy.contains('View Appointments').click()
        cy.get('body').click(0,0);
        cy.get('[data-testid="NotificationsNoneOutlinedIcon"]').eq(0).click()
        cy.contains('Patient1 Demo has updated their test results')
        cy.get('body').click(0,0);
        cy.contains('alex test').parent().find('td').eq(1).click()
        cy.contains('Dashboard').click()
        cy.contains('alex test').parent().find('td').eq(2).click()
        cy.contains('Dashboard').click()
        cy.contains('alex test').parent().find('td').eq(3).click()
        cy.contains('Dashboard').click()
        cy.contains('alex test').parent().find('td').eq(4).click()
        cy.contains('Dashboard').click()
        cy.contains('alex test').parent().find('[data-testid="OpenInNewOutlinedIcon"]').eq(0).click()
        cy.contains('Latest Symptoms (2022-04-13 10:20:57 PM)')
        cy.contains('Moderate Headache')
        cy.contains('Moderate Nausea or vomiting')
        cy.contains('Moderate Body or muscle aches')
        cy.get('body').click(0,0);
    })

    it('Patient Profile', () => {
        cy.visit('/')
        cy.contains('alex test').click()
        cy.contains('alex test')
        cy.contains('RAMQ 4dcfgvhbn6')
        cy.contains('Patient\'s Info')
        cy.contains('Latest Symptoms')
        cy.contains('Messages')
        cy.contains('History')
        cy.get('body').click(0,0);
        cy.get('[data-testid="ExpandMoreOutlinedIcon"]').click()
        cy.contains('Fully vaccinated against COVID-19')
        cy.contains('Yes')
        cy.get('[data-testid="ExpandLessOutlinedIcon"]').click()
    })

    it('Medical Chat', () => {
        cy.visit('/')
        cy.contains('alex test').click()
        cy.get('[class="message-input"]').click().type("Hi Patient")
        cy.get('[data-testid="SendIcon"]').click()
        cy.get('.message.sent').should('contain','Hi Patient')
    })

    it('View Appointments', () => {
        cy.visit('/')
        cy.contains('alex test').click()
        cy.contains('View Appointments').click()
        cy.get('[aria-haspopup="listbox"]').click()
        cy.get('[data-value="alex test"]').click()
        cy.contains('Upcoming Appointments')
        cy.contains('Previous Appointments')
    })

    it('Close Patient\'s File', () => {
        cy.visit('/')
        cy.contains('alex test').click()
        cy.contains('Close Patient\'s File').click()
        cy.contains('Keep Patient\'s File').click()
        cy.contains('Close Patient\'s File').click()
        cy.contains('Are you sure you to discharge alex test and close this patient\'s file?').parent().find('div').eq(0).find('div').eq(1).find('button').click()
    })

    after(() => {
        cy.logout()
    })

})
