import '@cypress/code-coverage/support';
import './commands'
// ignore uncaught exceptions
Cypress.on('uncaught:exception', (err) => {
    return false
})