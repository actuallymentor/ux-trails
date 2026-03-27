

// Force English locale for consistent test selectors
function set_english( win ) {
    win.localStorage.setItem( 'ux-trails-lang', 'en' )
}

// Helper: register and login a user to access protected pages
function login_as_test_user() {
    cy.visit( '/login', { onBeforeLoad: set_english } )
    cy.contains( 'create a new account' ).click()
    const email = `settings-test-${ Date.now() }@test.com`
    cy.get( 'input[type="text"]' ).type( 'Settings Test User' )
    cy.get( 'input[type="email"]' ).type( email )
    cy.get( 'input[type="password"]' ).type( 'testpass' )
    cy.contains( 'a', 'Register' ).click()
    cy.get( '.Toastify__toast--success', { timeout: 5000 } ).should( 'be.visible' )
}


context( 'Settings page display', () => {

    beforeEach( () => {
        cy.clearLocalStorage()
        login_as_test_user()
        cy.visit( '/profile/settings', { onBeforeLoad: set_english } )
    } )

    it( 'Displays the settings page title', () => {
        cy.contains( 'Settings' ).should( 'be.visible' )
    } )

    it( 'Shows all profile input fields', () => {
        cy.get( 'input[type="text"]' ).should( 'have.length.greaterThan', 0 )
        cy.get( 'input[type="email"]' ).should( 'exist' )
        cy.get( 'input[type="password"]' ).should( 'exist' )
        cy.get( 'input[type="tel"]' ).should( 'exist' )
    } )

    it( 'Pre-fills name and email from registration', () => {
        cy.get( 'input[type="email"]' ).should( 'not.have.value', '' )
        // Name field should have the registered name
        cy.get( 'input[type="text"]' ).first().should( 'have.value', 'Settings Test User' )
    } )

} )


context( 'Settings form validation', () => {

    beforeEach( () => {
        cy.clearLocalStorage()
        login_as_test_user()
        cy.visit( '/profile/settings', { onBeforeLoad: set_english } )
    } )

    it( 'Shows error toast when email is cleared and saved', () => {
        cy.get( 'input[type="email"]' ).clear()
        cy.contains( 'a', 'Save' ).click()

        cy.get( '.Toastify__toast--error', { timeout: 5000 } ).should( 'be.visible' )
    } )

    it( 'Shows error toast for invalid postcode format', () => {
        // Type an invalid postcode (not matching Dutch format 1234 AB)
        cy.get( 'input[type="text"]' ).eq( 1 ).clear().type( 'invalid' )
        cy.contains( 'a', 'Save' ).click()

        cy.get( '.Toastify__toast--error', { timeout: 5000 } ).should( 'be.visible' )
    } )

    it( 'Shows success toast when saving with valid data', () => {
        cy.contains( 'a', 'Save' ).click()

        cy.get( '.Toastify__toast--success', { timeout: 5000 } ).should( 'be.visible' )
    } )

    it( 'Accepts a valid Dutch postcode', () => {
        // Find the postcode field (third text input: name, postcode, doctor)
        cy.get( 'input[type="text"]' ).eq( 1 ).clear().type( '1234 AB' )
        cy.contains( 'a', 'Save' ).click()

        cy.get( '.Toastify__toast--success', { timeout: 5000 } ).should( 'be.visible' )
    } )

    it( 'Allows saving with empty optional fields', () => {
        // Clear optional fields (name, phone, postcode, doctor)
        cy.get( 'input[type="text"]' ).each( $el => cy.wrap( $el ).clear() )
        cy.get( 'input[type="tel"]' ).clear()
        cy.contains( 'a', 'Save' ).click()

        cy.get( '.Toastify__toast--success', { timeout: 5000 } ).should( 'be.visible' )
    } )

} )
