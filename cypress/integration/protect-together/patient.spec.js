describe('Patient Authentication', () => {

    it('Register', () => {
        indexedDB.deleteDatabase('firebaseLocalStorageDb')
        cy.visit('/')
        // cy.wait(5000)
        // indexedDB.deleteDatabase('firebaseLocalStorageDb')
        // cy.visit('/')
        cy.contains('Dont have an account? Sign Up').click()
        cy.contains('Already have an account? Sign in').click()
        cy.contains('Dont have an account? Sign Up').click()
        cy.get('[data-testid="first-name"]').click().type('Patient')
        cy.get('[data-testid="last-name"]').click().type('Test')
        cy.get('[data-testid="email"]').click().type('cypresspatient@systemtests.com')
        cy.get('[data-testid="phone-number"]').click().type('(514) 848-2424')
        cy.get('[data-testid="password"]').click().type('1')
        cy.get('[data-testid="confirm-password"]').click().type('1')
        cy.contains('Next').click()
        cy.get('[data-testid="height"]').type("err").clear().type("150")
        cy.get('[data-testid="weight"]').type("err").clear().type("120")
        cy.get('[data-testid="healthcare-number"]').click().type("MAID14561457")
        cy.get('[data-testid="medical-conditions"]').click().type("N/A")
        cy.get('[data-testid="additional-notes"]').click().type("N/A")
        cy.get('.PrivateSwitchBase-input').click()
        cy.get('.MuiOutlinedInput-root > #sex').click()
        cy.get('[data-value="Female"]').click()
        // cy.get('[data-testid="cy-date"]').click({force: true}).type('04/01/2000')
        // cy.contains('Register').click()
        // // cy.wait(5000)
        // cy.contains('Back').click()
        // cy.get('[data-testid="VisibilityOffIcon"]').eq(0).click()
        // cy.get('[data-testid="VisibilityOffIcon"]').eq(0).click()
        // cy.get('[data-testid="password"]').clear().click().type('I\'m_str0ng')
        // cy.get('[data-testid="confirm-password"]').clear().click().type('I\'m_str0ng')
        // cy.contains('Next').click()
        // cy.contains('Register').click()
        // // cy.wait(5000)
        // cy.contains('Back').click()
        // cy.get('[data-testid="email"]').clear().click().type('tbd@systemtests.com')
        // cy.contains('Next').click()
        // cy.contains('Register').click()
        // cy.location('pathname').should('eq', '/dashboard')
    });

    it.skip('Login and Logout', () => {
        indexedDB.deleteDatabase('firebaseLocalStorageDb')
        cy.visit('/')
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

describe('Patient Suite', () => {

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
        cy.get('body').click(0, 0);
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
        cy.contains('Symptoms Update').click()
        cy.contains('None of the above').click()
        cy.contains('Continue').click()
        cy.get('button').contains('Back to Home').click()
    })

    it('Main Settings', () => {
        cy.visit('/')
        cy.contains('Main Settings').click()
        cy.get('[id="phoneNumber"]').click().clear().type("5145125478")
        cy.get('[id="height"]').click().type("err").clear().type("120")
        cy.get('[id="weight"]').click().type("err").clear().type("100")
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
    })
    it('Book Appointment', () => {
        cy.visit('/')
        cy.contains('Book Appointment').click()
        cy.get('button').contains('Cancel').click()
    })

    it('Add Covid-19 Test', () => {
        cy.visit('/')
        cy.contains('Add Covid-19 Test').click()
        cy.get('[data-testid="cy-date"]').click({force: true}).type('04/01/2022')
        cy.contains('Test Date')
        cy.contains('PCR Test').click({force: true})
        cy.contains('Test Result')
        cy.contains('Covid-19 Positive').click({force: true})
        cy.get('button').contains('Submit').click({force: true})
    })

    after(() => {
        cy.logout()
    })

})


describe('Patient 2 Suite', () => {

    before(() => {
        cy.patient2Login()
    })

    it('Book Appointment', () => {
        cy.visit('/')
        cy.contains('Book Appointment').click()
        cy.get('[data-testid="cy-date"]').click({force: true}).type('04/20/2022')
        cy.contains('9:00').click({force: true})
        cy.get('button').contains('Submit').click({force: true})
    })

    it('Next Appointment', () => {
        cy.wait(20000)
        cy.visit('/')
        cy.contains('Next Appointment').click()
        cy.get('button').contains('Cancel').click()
        cy.get('button').contains('Keep').click()
        cy.get('button').contains('Cancel').click()
        cy.get('[style="display: flex; flex-direction: column; align-items: center;"] > :nth-child(2) > .MuiButton-root').click()
        cy.get('button').contains('Cancel').click()
    })


    after(() => {
        cy.logout()
    })

})

