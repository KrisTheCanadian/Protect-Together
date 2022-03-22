// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/firestore";
import { attachCustomCommands } from "cypress-firebase";

const fbConfig = {
    apiKey: "AIzaSyD0r8VtI_bEtw0h92MwWdSpOPw37SpoVMY",
    authDomain: "soen-390-ba781.firebaseapp.com",
    databaseURL: "https://soen-390-ba781-default-rtdb.firebaseio.com",
    projectId: "soen-390-ba781",
    storageBucket: "soen-390-ba781.appspot.com",
    messagingSenderId: "524325710222",
    appId: "1:524325710222:web:044c491f4dc57b7d371cdf",
    measurementId: "G-G9XJ9M9SJ0"
};

firebase.initializeApp(fbConfig);

attachCustomCommands({ Cypress, cy, firebase });

Cypress.Commands.add('patientLogin', () => {
    cy.logout()
    cy.get('body').then(body => {
        if (body.find('nav').length === 0) {
            cy.get('[name="email"]').type(Cypress.env('CYPRESS_PATIENT_EMAIL'), {log: false})
            cy.get('[name="password"]').type(Cypress.env('CYPRESS_PATIENT_PASSWORD'), {log: false})
            cy.get('button').click();
            cy.wait(1000)
        }
    })

})


Cypress.Commands.add('adminLogin', () => {
    cy.logout()
    cy.get('body').then(body => {
        if (body.find('nav').length === 0) {
            cy.get('[name="email"]').type(Cypress.env('CYPRESS_ADMIN_EMAIL'), {log: false})
            cy.get('[name="password"]').type(Cypress.env('CYPRESS_ADMIN_PASSWORD'), {log: false})
            cy.get('button').click();
            cy.wait(1000)
        }
    })

})


Cypress.Commands.add('medicalLogin', () => {
    cy.logout()
    cy.get('body').then(body => {
        if (body.find('nav').length === 0) {
            cy.get('[name="email"]').type(Cypress.env('CYPRESS_MEDICAL_EMAIL'), {log: false})
            cy.get('[name="password"]').type(Cypress.env('CYPRESS_MEDICAL_PASSWORD'), {log: false})
            cy.get('button').click();
            cy.wait(1000)
        }
    })

})


Cypress.Commands.add('logout', () => {
    cy.visit('/')
    cy.wait(1000)
    cy.get('body').then(body => {
        if (body.find('nav').length === 1) {
            cy.get('nav').find('button').should("contain", 'Logout').click()
        }
    })
})

//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
