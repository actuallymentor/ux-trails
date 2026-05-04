
import { set_english } from '../support/commands'

context( 'Admin page (/admin)', () => {

    const expected_checkbox_count = 42
    const shared_sin_names = [ 'Hidden password requirements', 'No input feedback' ]
    const row_toggle = label => cy.contains( 'h2', label ).parent().find( 'input[type="checkbox"]' )
    const group_toggle = label => cy.contains( 'p', label ).parent().find( 'input[type="checkbox"]' )

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
        cy.contains( 'Slightly too small text' ).should( 'be.visible' )
        cy.contains( 'base font size is set to 10px' ).should( 'be.visible' )
        cy.contains( 'Buttons disguised as text' ).should( 'be.visible' )
        cy.contains( 'no background, no border' ).should( 'be.visible' )
        cy.get( 'input[type="checkbox"]' ).should( 'have.length', expected_checkbox_count )
    } )

    it( 'Renders shared sin names only once', () => {
        shared_sin_names.forEach( sin_name => {
            cy.get( 'h2' ).filter( ( _index, el ) => el.textContent.trim() === sin_name ).should( 'have.length', 1 )
        } )
    } )

    it( 'Toggles start unchecked by default', () => {
        cy.get( 'input[type="checkbox"]' ).each( $el => {
            cy.wrap( $el ).should( 'not.be.checked' )
        } )
    } )

    it( 'Toggle can be checked and unchecked', () => {
        row_toggle( 'Hidden password requirements' ).check( { force: true } )
        row_toggle( 'Hidden password requirements' ).should( 'be.checked' )

        row_toggle( 'Hidden password requirements' ).uncheck( { force: true } )
        row_toggle( 'Hidden password requirements' ).should( 'not.be.checked' )
    } )

    it( 'Group toggles apply one stable checked state', () => {
        group_toggle( 'Good error messages' ).check( { force: true } )
        row_toggle( 'Hidden password requirements' ).should( 'be.checked' )
        cy.get( 'code' ).invoke( 'text' ).should( 'include', 'sins=hidden_password_requirements' )

        group_toggle( 'Good error messages' ).uncheck( { force: true } )
        row_toggle( 'Hidden password requirements' ).should( 'not.be.checked' )
        cy.get( 'code' ).invoke( 'text' ).should( 'not.include', 'hidden_password_requirements' )
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

        // Toggle a specific sin on
        row_toggle( 'Hidden password requirements' ).check( { force: true } )

        // URL should now include the sin ID
        cy.get( 'code' ).invoke( 'text' ).should( 'include', 'sins=hidden_password_requirements' )
    } )

    it( 'Persists toggle state across page reloads', () => {
        row_toggle( 'Hidden password requirements' ).check( { force: true } )
        row_toggle( 'Hidden password requirements' ).should( 'be.checked' )

        // Reload and verify persistence
        cy.visit( '/admin', { onBeforeLoad: set_english } )
        row_toggle( 'Hidden password requirements' ).should( 'be.checked' )
    } )

} )
