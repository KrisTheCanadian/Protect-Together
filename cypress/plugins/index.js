/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

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
  
  return config
}
