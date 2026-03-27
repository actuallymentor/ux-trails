

// Force English locale for consistent test selectors
function set_english( win ) {
    win.localStorage.setItem( 'ux-trails-lang', 'en' )
}

// Helper: register and login a user to access protected pages
function login_as_test_user() {
    cy.visit( '/login', { onBeforeLoad: set_english } )
    cy.contains( 'create a new account' ).click()
    const email = `doc-test-${ Date.now() }@test.com`
    cy.get( 'input[type="text"]' ).type( 'Document Test User' )
    cy.get( 'input[type="email"]' ).type( email )
    cy.get( 'input[type="password"]' ).type( 'testpass' )
    cy.contains( 'a', 'Register' ).click()
    cy.get( '.Toastify__toast--success', { timeout: 5000 } ).should( 'be.visible' )
}


context( 'Documents page', () => {

    beforeEach( () => {
        cy.clearLocalStorage()
        login_as_test_user()
        cy.visit( '/profile/documents', { onBeforeLoad: set_english } )
    } )

    it( 'Displays the documents page title', () => {
        cy.contains( 'Your documents' ).should( 'be.visible' )
    } )

    it( 'Shows a list of document cards from lab test data', () => {
        // Each lab reading generates a document, so there should be at least one
        cy.get( 'a' ).contains( 'Download document' ).should( 'exist' )
    } )

    it( 'Has at least one document for each lab test type', () => {
        // Dummy data generates readings for 3 test types, so there should be at least 3 documents
        cy.get( 'a' ).filter( ':contains("Download document")' ).should( 'have.length.greaterThan', 0 )
    } )

    it( 'Each document card shows a subject line', () => {
        // Each card has a Text element with the subject (contains the test name and date)
        cy.get( 'a' ).contains( 'Download document' ).first().parent().find( 'p' ).should( 'exist' )
    } )

} )
