
// Force English locale for consistent test selectors
function set_english() {
    localStorage.setItem( 'ux-trails-lang', 'en' )
}

// Helper: register and login a user to access protected pages
function login_as_test_user() {
    cy.visit( '/login?register=true', { onBeforeLoad: set_english } )
    const email = `appt-test-${ Date.now() }@test.com`
    cy.get( 'input[type="text"]' ).type( 'Appt Test User' )
    cy.get( 'input[type="email"]' ).type( email )
    cy.get( 'input[type="password"]' ).type( 'testpass' )
    cy.contains( 'Register' ).click()
    cy.get( '.Toastify__toast--success', { timeout: 5000 } ).should( 'be.visible' )
}

// Get tomorrow's date in YYYY-MM-DD format
function tomorrow_date() {
    const d = new Date()
    d.setDate( d.getDate() + 1 )
    return d.toISOString().split( 'T' )[ 0 ]
}


context( 'New appointment modal close button', () => {

    beforeEach( () => {
        cy.clearLocalStorage()
        login_as_test_user()
        cy.visit( '/profile/appointments', { onBeforeLoad: set_english } )
    } )

    it( 'X button is visible and closes the new appointment modal', () => {

        // Open the new appointment modal
        cy.contains( 'New appointment' ).click()

        // The X button should be visible
        cy.get( '[data-testid="close-new-appointment-modal"]' ).should( 'be.visible' )

        // Clicking the X should close the modal
        cy.get( '[data-testid="close-new-appointment-modal"]' ).click()

        // Modal should no longer be visible
        cy.get( '[data-testid="close-new-appointment-modal"]' ).should( 'not.exist' )
    } )

    it( 'Backdrop click still closes the modal', () => {

        // Open the new appointment modal
        cy.contains( 'New appointment' ).click()

        // Click the backdrop (top-left corner, far from modal content)
        cy.get( '[data-testid="close-new-appointment-modal"]' ).should( 'be.visible' )
        cy.get( 'body' ).click( 5, 5 )

        // Modal should close
        cy.get( '[data-testid="close-new-appointment-modal"]' ).should( 'not.exist' )
    } )

} )


context( 'New appointment form validation', () => {

    beforeEach( () => {
        cy.clearLocalStorage()
        login_as_test_user()
        cy.visit( '/profile/appointments', { onBeforeLoad: set_english } )
        cy.contains( 'New appointment' ).click()
    } )

    it( 'Confirm button is disabled when reason is too short', () => {

        // Fill in the date
        cy.get( 'input[type="date"]' ).type( tomorrow_date() )

        // Select a time slot (wait for slots to load)
        cy.get( 'a' ).contains( /^\d{2}:\d{2}$/ ).first().click()

        // Type a short reason (under 10 chars)
        cy.get( 'textarea' ).type( 'Short' )

        // Confirm button should be disabled
        cy.contains( 'Confirm appointment' ).should( 'have.attr', 'disabled' )
    } )

    it( 'Confirm button is enabled when all fields are valid', () => {

        // Fill in the date
        cy.get( 'input[type="date"]' ).type( tomorrow_date() )

        // Select a time slot
        cy.get( 'a' ).contains( /^\d{2}:\d{2}$/ ).first().click()

        // Type a valid reason (10+ chars)
        cy.get( 'textarea' ).type( 'Routine health checkup appointment' )

        // Confirm button should be enabled
        cy.contains( 'Confirm appointment' ).should( 'not.have.attr', 'disabled' )
    } )

    it( 'Confirm button is disabled when no date is selected', () => {

        // Type a valid reason without selecting date
        cy.get( 'textarea' ).type( 'Routine health checkup appointment' )

        // Confirm button should be disabled
        cy.contains( 'Confirm appointment' ).should( 'have.attr', 'disabled' )
    } )

} )
