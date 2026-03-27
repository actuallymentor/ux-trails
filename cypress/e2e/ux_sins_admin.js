
import { set_english } from '../support/commands'

context( 'Admin page (/admin)', () => {

    beforeEach( () => {
        cy.clearLocalStorage()
        cy.visit( '/admin', { onBeforeLoad: set_english } )
    } )

    it( 'Renders the admin page with title and description', () => {
        cy.contains( 'UX Sins Configuration' ).should( 'be.visible' )
        cy.contains( 'Toggle UX anti-patterns' ).should( 'be.visible' )
    } )

    it( 'Shows the first sin with toggle, name, and description', () => {
        cy.contains( 'Hidden password requirements' ).should( 'be.visible' )
        cy.contains( 'Password requirements are not shown' ).should( 'be.visible' )
        cy.get( 'input[type="checkbox"]' ).should( 'exist' )
    } )

    it( 'Toggle starts unchecked by default', () => {
        cy.get( 'input[type="checkbox"]' ).should( 'not.be.checked' )
    } )

    it( 'Toggle can be checked and unchecked', () => {
        cy.get( 'input[type="checkbox"]' ).check( { force: true } )
        cy.get( 'input[type="checkbox"]' ).should( 'be.checked' )

        cy.get( 'input[type="checkbox"]' ).uncheck( { force: true } )
        cy.get( 'input[type="checkbox"]' ).should( 'not.be.checked' )
    } )

    it( 'Shows share section with URL and QR code', () => {
        cy.contains( 'Share Configuration' ).should( 'be.visible' )
        cy.get( 'svg' ).should( 'exist' ) // QR code renders as SVG
        cy.contains( 'Copy URL' ).should( 'be.visible' )
    } )

    it( 'Shareable URL updates when a sin is toggled on', () => {

        // URL without sins should point to /config without params
        cy.get( 'code' ).invoke( 'text' ).should( 'include', '/config' )
        cy.get( 'code' ).invoke( 'text' ).should( 'not.include', 'sins=' )

        // Toggle sin on
        cy.get( 'input[type="checkbox"]' ).check( { force: true } )

        // URL should now include the sin ID
        cy.get( 'code' ).invoke( 'text' ).should( 'include', 'sins=hidden_password_requirements' )
    } )

    it( 'Persists toggle state across page reloads', () => {
        cy.get( 'input[type="checkbox"]' ).check( { force: true } )
        cy.get( 'input[type="checkbox"]' ).should( 'be.checked' )

        // Reload and verify persistence
        cy.visit( '/admin', { onBeforeLoad: set_english } )
        cy.get( 'input[type="checkbox"]' ).should( 'be.checked' )
    } )

} )
