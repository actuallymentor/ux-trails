
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

context( 'UX Sin: Forced small hamburger menu', () => {

    context( 'When sin is disabled (default)', () => {

        beforeEach( () => {
            cy.clearLocalStorage()
            cy.viewport( 1200, 800 )
            cy.visit( '/', { onBeforeLoad: set_english } )
        } )

        it( 'Shows full navigation on desktop width', () => {
            cy.get( '.menu_links.fullscreen' ).should( 'be.visible' )
            cy.get( '.menu_burger' ).should( 'not.exist' )
        } )

    } )

    context( 'When sin is enabled', () => {

        beforeEach( () => {
            cy.clearLocalStorage()
            cy.viewport( 1200, 800 )
            cy.visit( '/', {
                onBeforeLoad: win => enable_sin( win, 'forced_small_hamburger' ),
            } )
        } )

        it( 'Shows hamburger menu instead of full navigation on desktop', () => {
            cy.get( '.menu_links.fullscreen' ).should( 'not.exist' )
            cy.get( '.menu_burger' ).should( 'be.visible' )
        } )

        it( 'Hamburger icon is smaller than default', () => {
            // The forced hamburger uses size 32 instead of default 50
            cy.get( '.menu_burger' ).first().then( $el => {
                const svg = $el.find( 'svg' )[0] || $el[0]
                const size = parseInt( svg.getAttribute( 'width' ) || svg.getAttribute( 'height' ) )
                expect( size ).to.be.lessThan( 40 )
            } )
        } )

        it( 'Hamburger icon is positioned on the right side', () => {
            cy.window().then( win => {
                cy.get( '.menu_burger' ).first().then( $el => {
                    const rect = $el[0].getBoundingClientRect()
                    const viewport_mid_x = win.innerWidth / 2

                    // The burger should be on the right half of the screen
                    expect( rect.left ).to.be.greaterThan( viewport_mid_x )
                } )
            } )
        } )

        it( 'Hamburger menu still opens and shows navigation links', () => {
            cy.get( '.menu_burger' ).first().click()
            cy.get( '.menu_links.burger' ).should( 'be.visible' )
            cy.contains( 'Dashboard' ).should( 'be.visible' )
        } )

    } )

} )

context( 'UX Sin: No informative icons', () => {

    context( 'When sin is disabled (default)', () => {

        beforeEach( () => {
            cy.clearLocalStorage()
            cy.visit( '/', { onBeforeLoad: set_english } )
        } )

        it( 'Shows informative icons in navigation links', () => {
            // Menu links should contain SVG icons
            cy.get( '.menu_links a svg' ).should( 'have.length.at.least', 1 )
        } )

    } )

    context( 'When sin is enabled', () => {

        beforeEach( () => {
            cy.clearLocalStorage()
            cy.visit( '/', {
                onBeforeLoad: win => enable_sin( win, 'no_icons' ),
            } )
        } )

        it( 'Hides informative icons in navigation links', () => {
            // SVGs inside nav links should be hidden (display: none)
            cy.get( '.menu_links a svg' ).should( 'exist' )
            cy.get( '.menu_links a svg' ).first().should( 'not.be.visible' )
        } )

        it( 'Navigation text is still visible without icons', () => {
            cy.contains( 'Dashboard' ).should( 'be.visible' )
            cy.contains( 'Log in' ).should( 'be.visible' )
        } )

        it( 'Preserves functional hamburger icon on mobile', () => {
            cy.viewport( 400, 800 )
            cy.visit( '/', {
                onBeforeLoad: win => enable_sin( win, 'no_icons' ),
            } )
            // Hamburger menu icon (the SVG itself has class menu_burger)
            cy.get( 'svg.menu_burger' ).should( 'be.visible' )
        } )

    } )

} )

context( 'UX Sin: Slightly too small text', () => {

    context( 'When sin is disabled (default)', () => {

        beforeEach( () => {
            cy.clearLocalStorage()
            cy.visit( '/', { onBeforeLoad: set_english } )
        } )

        it( 'Root font size is at the browser default', () => {
            cy.window().then( win => {
                const size = parseFloat( win.getComputedStyle( win.document.documentElement ).fontSize )
                // Browser default is 16px
                expect( size ).to.be.at.least( 15 )
            } )
        } )

    } )

    context( 'When sin is enabled', () => {

        beforeEach( () => {
            cy.clearLocalStorage()
            cy.visit( '/', {
                onBeforeLoad: win => enable_sin( win, 'small_text' ),
            } )
        } )

        it( 'Root font size is reduced below the default', () => {
            // Wait for Zustand to hydrate and inject the global style
            cy.contains( 'Welcome' ).should( 'be.visible' )
            cy.window().then( win => {
                const size = parseFloat( win.getComputedStyle( win.document.documentElement ).fontSize )
                // 85% of 16px = ~13.6px
                expect( size ).to.be.lessThan( 15 )
                expect( size ).to.be.greaterThan( 10 )
            } )
        } )

        it( 'Text content is still readable', () => {
            cy.contains( 'Welcome' ).should( 'be.visible' )
        } )

    } )

} )

context( 'UX Sin: Buttons disguised as text', () => {

    context( 'When sin is disabled (default)', () => {

        beforeEach( () => {
            cy.clearLocalStorage()
            cy.visit( '/', { onBeforeLoad: set_english } )
        } )

        it( 'Buttons have visible border and background', () => {
            cy.get( '[data-ux-button]' ).first().then( $el => {
                const styles = window.getComputedStyle( $el[0] )
                // Default buttons should have a non-transparent background or a visible border
                expect( styles.borderStyle ).to.not.equal( 'none' )
            } )
        } )

    } )

    context( 'When sin is enabled', () => {

        beforeEach( () => {
            cy.clearLocalStorage()
            cy.visit( '/', {
                onBeforeLoad: win => enable_sin( win, 'buttons_as_text' ),
            } )
        } )

        it( 'Buttons have no border or background', () => {
            cy.get( '[data-ux-button]' ).first().then( $el => {
                const styles = window.getComputedStyle( $el[0] )
                expect( styles.borderStyle ).to.equal( 'none' )
                expect( styles.backgroundColor ).to.equal( 'rgba(0, 0, 0, 0)' )
            } )
        } )

        it( 'Button text uses the same color as surrounding text', () => {
            cy.window().then( win => {
                cy.get( '[data-ux-button]' ).first().then( $btn => {
                    const btn_color = win.getComputedStyle( $btn[0] ).color

                    // Compare against a heading/paragraph — themed text, not body default
                    cy.get( 'h1, h2, p' ).first().then( $text => {
                        const text_color = win.getComputedStyle( $text[0] ).color
                        expect( btn_color ).to.equal( text_color )
                    } )
                } )
            } )
        } )

        it( 'Buttons are still clickable', () => {
            // The "Log in" button on homepage should still navigate
            cy.contains( '[data-ux-button]', 'Log in' ).click()
            cy.url().should( 'include', '/login' )
        } )

    } )

} )
