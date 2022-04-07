/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
require('dotenv').config()

module.exports = (on, config) => {
    config.env.CYPRESS_PATIENT_EMAIL = process.env.CYPRESS_PATIENT_EMAIL
    config.env.CYPRESS_PATIENT_PASSWORD = process.env.CYPRESS_PATIENT_PASSWORD
    config.env.CYPRESS_MEDICAL_EMAIL = process.env.CYPRESS_MEDICAL_EMAIL
    config.env.CYPRESS_MEDICAL_PASSWORD = process.env.CYPRESS_MEDICAL_PASSWORD
    config.env.CYPRESS_ADMIN_EMAIL = process.env.CYPRESS_ADMIN_EMAIL
    config.env.CYPRESS_ADMIN_PASSWORD = process.env.CYPRESS_ADMIN_PASSWORD

    on('file:preprocessor', require('@cypress/code-coverage/use-browserify-istanbul'))
    require('@cypress/code-coverage/task')(on, config)

    return config
}
