

// Force English locale for consistent test selectors
function set_english( win ) {
    win.localStorage.setItem( 'ux-trails-lang', 'en' )
}

// Helper: register and login a user to access protected pages
function login_as_test_user() {
    cy.visit( '/login', { onBeforeLoad: set_english } )
    cy.contains( 'create a new account' ).click()
    const email = `msg-test-${ Date.now() }@test.com`
    cy.get( 'input[type="text"]' ).type( 'Message Test User' )
    cy.get( 'input[type="email"]' ).type( email )
    cy.get( 'input[type="password"]' ).type( 'testpass' )
    cy.contains( 'a', 'Register' ).click()
    cy.get( '.Toastify__toast--success', { timeout: 5000 } ).should( 'be.visible' )
}


context( 'Messages page', () => {

    beforeEach( () => {
        cy.clearLocalStorage()
        login_as_test_user()
        cy.visit( '/profile/inbox', { onBeforeLoad: set_english } )
    } )

    it( 'Displays the inbox page title', () => {
        cy.contains( 'Your inbox' ).should( 'be.visible' )
    } )

    it( 'Shows a list of message cards from lab test data', () => {
        // Each lab reading generates a message, so there should be at least one card
        cy.get( 'a' ).contains( 'View message' ).should( 'exist' )
    } )

    it( 'Opens a message modal when clicking View', () => {
        cy.get( 'a' ).contains( 'View message' ).first().click()

        // Modal should show subject and message body
        cy.get( 'a' ).contains( 'Close message' ).should( 'be.visible' )
    } )

    it( 'Closes the message modal when clicking Close', () => {
        cy.get( 'a' ).contains( 'View message' ).first().click()
        cy.get( 'a' ).contains( 'Close message' ).should( 'be.visible' )

        cy.get( 'a' ).contains( 'Close message' ).click()

        // Modal should be gone
        cy.get( 'a' ).contains( 'Close message' ).should( 'not.exist' )
    } )

    it( 'Modal displays message content with subject and body', () => {
        cy.get( 'a' ).contains( 'View message' ).first().click()

        // The modal should contain readable text (subject + body paragraphs)
        cy.get( 'a' ).contains( 'Close message' ).should( 'be.visible' )
        // Subject and body are rendered as <p> elements inside the modal card
        cy.get( 'a' ).contains( 'Close message' ).parents( 'div' ).first().find( 'p' ).should( 'have.length.greaterThan', 0 )
    } )

} )
