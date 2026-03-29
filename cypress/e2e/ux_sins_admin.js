
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

    it( 'Shows all sins with toggle, name, and description', () => {
        cy.contains( 'Hidden password requirements' ).should( 'be.visible' )
        cy.contains( 'Password requirements are not shown' ).should( 'be.visible' )
        cy.contains( 'Toast notifications in center of screen' ).should( 'be.visible' )
        cy.contains( 'blocking content' ).should( 'be.visible' )
        cy.contains( 'Forced small hamburger menu' ).should( 'be.visible' )
        cy.contains( 'harder to find and tap' ).should( 'be.visible' )
        cy.contains( 'No informative icons' ).should( 'be.visible' )
        cy.contains( 'decorative icons are hidden' ).should( 'be.visible' )
        cy.get( 'input[type="checkbox"]' ).should( 'have.length', 4 )
    } )

    it( 'Toggles start unchecked by default', () => {
        cy.get( 'input[type="checkbox"]' ).each( $el => {
            cy.wrap( $el ).should( 'not.be.checked' )
        } )
    } )

    it( 'Toggle can be checked and unchecked', () => {
        cy.get( 'input[type="checkbox"]' ).first().check( { force: true } )
        cy.get( 'input[type="checkbox"]' ).first().should( 'be.checked' )

        cy.get( 'input[type="checkbox"]' ).first().uncheck( { force: true } )
        cy.get( 'input[type="checkbox"]' ).first().should( 'not.be.checked' )
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

        // Toggle first sin on
        cy.get( 'input[type="checkbox"]' ).first().check( { force: true } )

        // URL should now include the sin ID
        cy.get( 'code' ).invoke( 'text' ).should( 'include', 'sins=hidden_password_requirements' )
    } )

    it( 'Persists toggle state across page reloads', () => {
        cy.get( 'input[type="checkbox"]' ).first().check( { force: true } )
        cy.get( 'input[type="checkbox"]' ).first().should( 'be.checked' )

        // Reload and verify persistence
        cy.visit( '/admin', { onBeforeLoad: set_english } )
        cy.get( 'input[type="checkbox"]' ).first().should( 'be.checked' )
    } )

} )
