describe('Patient Authentication', () => {

    it('Login and Logout', () => {
        cy.logout()
        cy.get('body').then(body => {
            if (body.find('nav').length === 0) {
                cy.get('[name="email"]').type(Cypress.env('CYPRESS_PATIENT_EMAIL'), {log: false})
                cy.get('[name="password"]').type(Cypress.env('CYPRESS_PATIENT_PASSWORD'), {log: false})
                cy.get('button').click();
                cy.url().should("contain", '/dashboard')
                cy.contains('Welcome Patient')
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
        cy.contains('Yes').click()
        cy.contains('You have been added to our waitlist.')
        })

    it('Covid-19 Statistics iframe API', () => {
        cy.visit('/')
        cy.contains('Do not forget to follow the safety policies and stay safe!')
    })

    it('Basic Protective Measures Against Coronavirus', () => {
        cy.visit('/')
        cy.contains('Basic Protective Measures Against Coronavirus')
        cy.contains('Clean your hands')
        cy.contains('Avoid touching your face')

    })

    after(() => {
        cy.logout()
    })

})

describe('Sprint 4 Patient Suite', () => {

    before(() => {
        cy.patientLogin()
    })

    it('COVID-19 Statistics Per Country', () => {
        cy.visit('/')
        cy.get('[id="outlined-basic"]').click().type('usa{enter}')
        cy.get('td').should("contain", 'USA')
    });

    it('Covid-19 Statistics iframe API', () => {
        cy.visit('/')
        cy.get('iframe').its('0.contentDocument.body').should('not.be.empty').then(cy.wrap).find('.ChoroplethMap').should('be.visible')
        cy.contains('Do not forget to follow the safety policies and stay safe!')
    })

    it('Test Results', () => {
        cy.visit('/')
        cy.contains('Add Covid-19 Test').click()
        cy.get('body').click(0,0);
        cy.contains('Test Results').click()
        cy.contains('PCRTest: positive')
    })

    it('Symptoms Update', () => {
        cy.visit('/')
        cy.contains('Symptoms Update').click()
        cy.contains('Cough').click()
        cy.contains('Continue').click()
        cy.get('button').contains('Mild').click()
        cy.contains('Continue').click()
        cy.contains('Your symptoms have been updated.')
        cy.get('button').contains('Back to Home').click()
    })

    it('Main Settings', () => {
        cy.visit('/')
        cy.contains('Main Settings').click()
        cy.get('[id="phoneNumber"]').click().clear().type("5145125478")
        cy.get('[id="height"]').click().clear().type("120")
        cy.get('[id="weight"]').click().clear().type("100")
        cy.get('[id="healthCardNumber"]').click().clear().type("sprint4444")
        cy.get('[id="medicalConditions"]').click().clear().type("Alzheimer")
        cy.get('[id="additionalNotes"]').click().clear().type("Cannot Remember")
        cy.get('button').contains('Submit').click()
        cy.wait(2000)
        cy.contains('Main Settings').click()
        cy.contains('Alzheimer')
    })
    it('Book Appointment', () => {
        cy.visit('/')
        cy.contains('Book Appointment').click()
        cy.get('button').contains('Cancel').click()

    })
    it('Add Covid-19 Test', () => {
        cy.visit('/')
        cy.contains('Add Covid-19 Test').click()
        cy.contains('Test Date')
        cy.contains('Test Type').parent().find('[type="radio"]').then(radioButtons => {
                    cy.wrap(radioButtons).first().check().should('be.checked')
        })
        cy.contains('Test Result')
        cy.get('button').contains('Cancel').click()
    })

    after(() => {
        cy.logout()
    })

})


