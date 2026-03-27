
// Force English locale for consistent test selectors
function set_english() {
    localStorage.setItem( 'ux-trails-lang', 'en' )
}

context( 'Registration password requirements', () => {

    beforeEach( () => {
        cy.clearLocalStorage()
        cy.visit( '/login?register=true', { onBeforeLoad: set_english } )
    } )

    it( 'Shows password hint text on the registration form', () => {
        cy.get( 'p.input-hint' ).should( 'be.visible' )
        cy.get( 'p.input-hint' ).invoke( 'text' ).should( 'have.length.greaterThan', 0 )
    } )

    it( 'Does not show password hint on the login form', () => {
        cy.visit( '/login', { onBeforeLoad: set_english } )
        cy.get( 'p.input-hint' ).should( 'not.exist' )
    } )

    it( 'Shows error for password shorter than 5 characters', () => {
        cy.get( 'input[type="password"]' ).type( 'abc' )

        // Wait for debounce to finish and error to appear
        cy.get( 'p.input-error', { timeout: 3000 } ).should( 'be.visible' )
    } )

    it( 'Shows valid state for password with 5 or more characters', () => {
        cy.get( 'input[type="password"]' ).type( 'abcde' )

        // Error should not appear after debounce
        cy.wait( 1000 )
        cy.get( 'p.input-error' ).should( 'not.exist' )
    } )

    it( 'Shows toast error when registering with short password', () => {
        cy.get( 'input[type="text"]' ).type( 'Test User' )
        cy.get( 'input[type="email"]' ).type( 'short-pass@test.com' )
        cy.get( 'input[type="password"]' ).type( 'abc' )
        cy.contains( 'Register' ).click()

        // Toast error should appear
        cy.get( '.Toastify__toast--error', { timeout: 5000 } ).should( 'be.visible' )
    } )

    it( 'Allows registration with valid password', () => {
        const email = `valid-${ Date.now() }@test.com`
        cy.get( 'input[type="text"]' ).type( 'Test User' )
        cy.get( 'input[type="email"]' ).type( email )
        cy.get( 'input[type="password"]' ).type( 'validpass' )
        cy.contains( 'Register' ).click()

        // Toast success should appear
        cy.get( '.Toastify__toast--success', { timeout: 5000 } ).should( 'be.visible' )
    } )

} )


context( 'Enter key triggers login/register', () => {

    beforeEach( () => {
        cy.clearLocalStorage()
    } )

    it( 'Pressing Enter on the password field triggers login', () => {
        cy.visit( '/login', { onBeforeLoad: set_english } )
        cy.get( 'input[type="email"]' ).type( 'nonexistent@test.com' )
        cy.get( 'input[type="password"]' ).type( 'somepass{enter}' )

        // Should show a toast (user not found)
        cy.get( '.Toastify__toast--error', { timeout: 5000 } ).should( 'be.visible' )
    } )

    it( 'Pressing Enter on the email field triggers login', () => {
        cy.visit( '/login', { onBeforeLoad: set_english } )
        cy.get( 'input[type="email"]' ).type( 'nonexistent@test.com{enter}' )

        // Should show a toast (user not found)
        cy.get( '.Toastify__toast--error', { timeout: 5000 } ).should( 'be.visible' )
    } )

    it( 'Pressing Enter on the password field triggers registration', () => {
        cy.visit( '/login?register=true', { onBeforeLoad: set_english } )
        const email = `enter-reg-${ Date.now() }@test.com`
        cy.get( 'input[type="text"]' ).type( 'Test User' )
        cy.get( 'input[type="email"]' ).type( email )
        cy.get( 'input[type="password"]' ).type( 'validpass{enter}' )

        // Should show a success toast
        cy.get( '.Toastify__toast--success', { timeout: 5000 } ).should( 'be.visible' )
    } )

} )
