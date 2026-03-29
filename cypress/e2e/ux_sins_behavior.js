
import { set_english, visit_register } from '../support/commands'

// Helper to enable a UX sin via localStorage before visiting a page
function enable_sin( win, sin_id ) {
    set_english( win )
    const state = { state: { enabled_sins: { [ sin_id ]: true } }, version: 0 }
    win.localStorage.setItem( 'ux-sins-storage', JSON.stringify( state ) )
}

context( 'UX Sin: Hidden password requirements', () => {

    context( 'When sin is disabled (default)', () => {

        beforeEach( () => {
            cy.clearLocalStorage()
            visit_register()
        } )

        it( 'Does NOT show password hint text (details are in the tooltip)', () => {
            cy.get( 'p.input-hint' ).should( 'not.exist' )
        } )

        it( 'Shows info tooltip on password field', () => {
            // The "?" info icon should be present in the password label
            cy.get( 'label' ).contains( 'Password' ).parent().find( 'span' ).last().should( 'contain', '?' )
        } )

        it( 'Shows specific error message for short password', () => {
            cy.get( 'input[type="password"]' ).type( 'abc' )
            cy.get( 'p.input-error', { timeout: 3000 } ).should( 'be.visible' )
            cy.get( 'p.input-error' ).should( 'contain', 'Password must be at least 5 characters' )
        } )

        it( 'Shows specific toast error when registering with short password', () => {
            cy.get( 'input[type="text"]' ).type( 'Test User' )
            cy.get( 'input[type="email"]' ).type( `sin-off-${ Date.now() }@test.com` )
            cy.get( 'input[type="password"]' ).type( 'abc' )
            cy.contains( 'a', 'Register' ).click()

            cy.get( '.Toastify__toast--error', { timeout: 5000 } ).should( 'be.visible' )
            cy.get( '.Toastify__toast--error' ).should( 'contain', 'Password must be at least 5 characters' )
        } )

    } )

    context( 'When sin is enabled', () => {

        beforeEach( () => {
            cy.clearLocalStorage()
            cy.visit( '/login', {
                onBeforeLoad: win => enable_sin( win, 'hidden_password_requirements' ),
            } )
            cy.contains( 'create a new account' ).click()
        } )

        it( 'Does NOT show password hint text', () => {
            cy.get( 'p.input-hint' ).should( 'not.exist' )
        } )

        it( 'Does NOT show info tooltip on password field', () => {
            // The password label should not have a "?" info icon
            cy.contains( 'label', 'Password' ).find( 'span' ).should( 'have.length', 1 )
        } )

        it( 'Shows vague error message for short password', () => {
            cy.get( 'input[type="password"]' ).type( 'abc' )
            cy.get( 'p.input-error', { timeout: 3000 } ).should( 'be.visible' )
            cy.get( 'p.input-error' ).should( 'contain', 'Password does not meet the requirements' )

            // Should NOT mention specific requirements
            cy.get( 'p.input-error' ).should( 'not.contain', '5 characters' )
        } )

        it( 'Shows vague toast error when registering with short password', () => {
            cy.get( 'input[type="text"]' ).type( 'Test User' )
            cy.get( 'input[type="email"]' ).type( `sin-on-${ Date.now() }@test.com` )
            cy.get( 'input[type="password"]' ).type( 'abc' )
            cy.contains( 'a', 'Register' ).click()

            cy.get( '.Toastify__toast--error', { timeout: 5000 } ).should( 'be.visible' )
            cy.get( '.Toastify__toast--error' ).should( 'contain', 'Password does not meet the requirements' )
            cy.get( '.Toastify__toast--error' ).should( 'not.contain', '5 characters' )
        } )

        it( 'Still validates password (rejects short passwords)', () => {
            cy.get( 'input[type="password"]' ).type( 'abc' )

            // Error should still appear — the validation itself still works
            cy.get( 'p.input-error', { timeout: 3000 } ).should( 'be.visible' )
        } )

        it( 'Still allows registration with valid password', () => {
            cy.get( 'input[type="text"]' ).type( 'Test User' )
            cy.get( 'input[type="email"]' ).type( `sin-valid-${ Date.now() }@test.com` )
            cy.get( 'input[type="password"]' ).type( 'validpass' )
            cy.contains( 'a', 'Register' ).click()

            cy.get( '.Toastify__toast--success', { timeout: 5000 } ).should( 'be.visible' )
        } )

    } )

} )

context( 'UX Sin: Centered toast notifications', () => {

    // Trigger a toast by attempting to log in with a nonexistent user
    function trigger_toast() {
        cy.get( 'input[type="email"]' ).type( `nonexistent-${ Date.now() }@test.com` )
        cy.get( 'input[type="password"]' ).type( 'somepass{enter}' )
        cy.get( '.Toastify__toast', { timeout: 5000 } ).should( 'be.visible' )
    }

    context( 'When sin is disabled (default)', () => {

        beforeEach( () => {
            cy.clearLocalStorage()
            cy.visit( '/login', { onBeforeLoad: set_english } )
        } )

        it( 'Toast container is NOT centered on screen', () => {
            trigger_toast()

            // The toast container should be near the top, not vertically centered
            cy.window().then( win => {
                cy.get( '.Toastify__toast-container' ).then( $el => {
                    const rect = $el[0].getBoundingClientRect()
                    const viewport_mid = win.innerHeight / 2

                    // Top of toast should be well above the viewport midpoint
                    expect( rect.top ).to.be.lessThan( viewport_mid - 100 )
                } )
            } )
        } )

    } )

    context( 'When sin is enabled', () => {

        beforeEach( () => {
            cy.clearLocalStorage()
            cy.visit( '/login', {
                onBeforeLoad: win => enable_sin( win, 'centered_toast' ),
            } )
        } )

        it( 'Toast container is centered on screen', () => {
            trigger_toast()

            // The toast container should be roughly centered in the viewport
            cy.window().then( win => {
                cy.get( '.Toastify__toast-container' ).then( $el => {
                    const rect = $el[0].getBoundingClientRect()
                    const viewport_mid_y = win.innerHeight / 2
                    const el_center_y = rect.top + rect.height / 2

                    // Center should be within 150px of viewport center vertically
                    expect( Math.abs( el_center_y - viewport_mid_y ) ).to.be.lessThan( 150 )
                } )
            } )
        } )

        it( 'Toast still functions normally (shows messages)', () => {
            trigger_toast()
            cy.get( '.Toastify__toast--error' ).should( 'be.visible' )
        } )

    } )

} )
