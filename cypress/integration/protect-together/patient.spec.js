describe('Patient Authentication', () => {

    it('Login and Logout', () => {
        cy.logout()
        cy.get('body').then(body => {
            if (body.find('nav').length === 0) {
                cy.get('[name="email"]').type(Cypress.env('CYPRESS_PATIENT_EMAIL'), {log: false})
                cy.get('[name="password"]').type(Cypress.env('CYPRESS_PATIENT_PASSWORD'), {log: false})
                cy.get('button').click();
                cy.url().should("contain", '/dashboard')
                cy.contains('Welcome Cypress')
                cy.get('nav').find('button').should("contain", 'Logout').click()
            }
        })
    })
})

describe('Sprint 3 Patient Suite', () => {

    before(() => {
        cy.patientLogin()
    })

    it('Ask for help - Call 911', () => {
        cy.visit('/')
        cy.contains('Ask for Help').click()
        cy.contains('No')
        cy.contains('Yes').click()
        cy.contains('Continue').click()
        cy.contains('9-1-1')
        cy.contains('Back to Home').click()
    });

    it('Ask for help - You will be contacted by a doctor', () => {
        cy.visit('/');
        cy.contains('Ask for Help').click()
        cy.contains('Yes')
        cy.contains('No').click()
        cy.contains('Continue').click()
        cy.contains('I have tested positive for COVID-19').click()
        cy.contains('Continue').click()
        cy.contains('Cough').click()
        cy.contains('Headache').click()
        cy.contains('Sore throat').click()
        cy.contains('Continue').click()
        cy.contains('Cough').click()
        cy.contains('Mild').click()
        cy.contains('Continue').click()
        cy.contains('Headache').click()
        cy.contains('Moderate').click()
        cy.contains('Continue').click()
        cy.contains('Sore throat').click()
        cy.contains('Severe').click()
        cy.contains('Continue').click()
        cy.contains('Yes').click()
        cy.contains('Continue').click()
        cy.contains('No').click()
        cy.contains('Continue').click()
        cy.contains('Yes').click()
        cy.contains('Continue').click()
        cy.contains('You will be contacted by one of our doctors shortly.')
        cy.contains('Back to Home').click()
    })

    it('Ask for help - Monitor your symptoms', () => {
        cy.visit('/');
        cy.contains('Ask for Help').click()
        cy.contains('Yes')
        cy.contains('No').click()
        cy.contains('Continue').click()
        cy.contains('I have been in contact with a person who has COVID-19.').click()
        cy.contains('Continue').click()
        cy.contains('None of the above').click()
        cy.contains('Continue').click()
        cy.contains('No').click()
        cy.contains('Continue').click()
        cy.contains('Yes').click()
        cy.contains('Continue').click()
        cy.contains('No').click()
        cy.contains('Continue').click()
        cy.contains('Monitor your symptoms')
        cy.contains('Back to Home').click()
    })
    
    // To be fixed
    // it('Add Covid-19 Test', () => {
    //     cy.visit('/')
    //     cy.contains('Add Covid-19 Test').click()
    //     cy.get('[placeholder="mm/dd/yyyy"]').click().type('03/09/2022')
    //     cy.get('[placeholder="mm/dd/yyyy"]').invoke("prop", 'defaultValue').should('contain', '03/09/2022')
    //     cy.contains('Which test did you take?').parent().find('[type="radio"]').then(radioButtons => {
    //         cy.wrap(radioButtons).first().check().should('be.checked')
    //     })
    //     cy.contains('What was your test result?').parent().find('[type="radio"]').then(radioButtons => {
    //         cy.wrap(radioButtons).first().check().should('be.checked')
    //     })
    //     cy.contains('Submit').click()
    // })

    it('COVID-19 Statistics Per Country', () => {
        cy.visit('/')
        cy.get('[placeholder="Enter Country Name"]').click().type('Canada')
        cy.get('[placeholder="Enter Country Name"]').parents('form').find('button').should("contain", 'Search').click()
        cy.contains('Country Name : Canada')
    });

    it('Covid-19 Statistics iframe API', () => {
        cy.visit('/')
        cy.get('iframe').its('0.contentDocument.body').should('not.be.empty').then(cy.wrap).find('[role="main"]').should('be.visible')
        cy.contains('Do not forget to follow the safety policies and stay safe!')
    })

    after(() => {
        cy.logout()
    })

})
