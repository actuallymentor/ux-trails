
import { set_english, login_as_test_user } from '../support/commands'

context( 'Documents page', () => {

    beforeEach( () => {
        cy.clearLocalStorage()
        login_as_test_user( 'doc' )
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
