
import { set_english } from '../support/commands'

context( 'Config page (/config)', () => {

    beforeEach( () => {
        cy.clearLocalStorage()
    } )

    it( 'Shows empty state when no sins are in the URL', () => {
        cy.visit( '/config', { onBeforeLoad: set_english } )
        cy.contains( 'Configuration Applied' ).should( 'be.visible' )
        cy.contains( 'No UX patterns are currently active' ).should( 'be.visible' )
    } )

    it( 'Hydrates sins from URL params and shows them', () => {
        cy.visit( '/config?sins=hidden_password_requirements', { onBeforeLoad: set_english } )

        // Should show success toast
        cy.get( '.Toastify__toast--success', { timeout: 5000 } ).should( 'be.visible' )

        // Should display the enabled sin
        cy.contains( 'Hidden password requirements' ).should( 'be.visible' )
        cy.contains( 'Password requirements are not shown' ).should( 'be.visible' )

        // Should NOT show the empty state
        cy.contains( 'No UX patterns are currently active' ).should( 'not.exist' )
    } )

    it( 'Has a "Go to homepage" button that navigates to /', () => {
        cy.visit( '/config', { onBeforeLoad: set_english } )
        cy.contains( 'Go to homepage' ).should( 'be.visible' )
        cy.contains( 'Go to homepage' ).click()
        cy.url().should( 'eq', Cypress.config().baseUrl + '/' )
    } )

    it( 'Persists sins to localStorage after hydration', () => {

        // Visit config with sin param
        cy.visit( '/config?sins=hidden_password_requirements', { onBeforeLoad: set_english } )
        cy.get( '.Toastify__toast--success', { timeout: 5000 } ).should( 'be.visible' )

        // Revisit config without params — sins should still be active from localStorage
        cy.visit( '/config', { onBeforeLoad: set_english } )
        cy.contains( 'Hidden password requirements' ).should( 'be.visible' )
    } )

    it( 'Ignores unknown sin IDs in query params', () => {
        cy.visit( '/config?sins=nonexistent_sin,hidden_password_requirements', { onBeforeLoad: set_english } )
        cy.get( '.Toastify__toast--success', { timeout: 5000 } ).should( 'be.visible' )

        // Only the valid sin should appear
        cy.contains( 'Hidden password requirements' ).should( 'be.visible' )
    } )

} )
