
// Force English locale for consistent test selectors
function set_english() {
    localStorage.setItem( 'ux-trails-lang', 'en' )
}

// Helper: register and login a user to access protected pages
function login_as_test_user() {
    cy.visit( '/login?register=true', { onBeforeLoad: set_english } )
    const email = `lab-test-${ Date.now() }@test.com`
    cy.get( 'input[type="text"]' ).type( 'Lab Test User' )
    cy.get( 'input[type="email"]' ).type( email )
    cy.get( 'input[type="password"]' ).type( 'testpass' )
    cy.contains( 'Register' ).click()
    cy.get( '.Toastify__toast--success', { timeout: 5000 } ).should( 'be.visible' )
}

// Parse a nl-NL date string (D-M-YYYY) into a Date object
function parse_nl_date( date_string ) {
    const [ day, month, year ] = date_string.split( '-' ).map( Number )
    return new Date( year, month - 1, day )
}


context( 'Lab results sorting and date validation', () => {

    beforeEach( () => {
        cy.clearLocalStorage()
        login_as_test_user()
    } )

    it( 'No reading dates are in the future', () => {
        cy.visit( '/profile/labs', { onBeforeLoad: set_english } )

        // Click on the first lab test to see its readings
        cy.contains( 'View results' ).first().click()

        // Get all reading text items and check their dates
        const today = new Date()
        today.setHours( 23, 59, 59, 999 )

        cy.get( 'p' ).then( $elements => {

            // Filter for reading items that match the pattern "Reading D-M-YYYY: value unit"
            // or the localized variant "Meting D-M-YYYY: value unit"
            const reading_pattern = /(\d{1,2})-(\d{1,2})-(\d{4})/
            const readings = [ ...$elements ].filter( el => reading_pattern.test( el.textContent ) )

            readings.forEach( el => {
                const match = el.textContent.match( reading_pattern )
                if( match ) {
                    const date = new Date( Number( match[ 3 ] ), Number( match[ 2 ] ) - 1, Number( match[ 1 ] ) )
                    expect( date.getTime() ).to.be.at.most( today.getTime() )
                }
            } )

        } )

    } )

    it( 'Readings are sorted from newest to oldest', () => {
        cy.visit( '/profile/labs', { onBeforeLoad: set_english } )

        // Click on the first lab test to see its readings
        cy.contains( 'View results' ).first().click()

        // Collect all dates from reading items
        const reading_pattern = /(\d{1,2})-(\d{1,2})-(\d{4})/

        cy.get( 'p' ).then( $elements => {

            const dates = [ ...$elements ]
                .map( el => {
                    const match = el.textContent.match( reading_pattern )
                    if( match ) return new Date( Number( match[ 3 ] ), Number( match[ 2 ] ) - 1, Number( match[ 1 ] ) ).getTime()
                    return null
                } )
                .filter( d => d !== null )

            // Verify descending order (newest first)
            for( let i = 0; i < dates.length - 1; i++ ) {
                expect( dates[ i ] ).to.be.at.least( dates[ i + 1 ] )
            }

        } )

    } )

} )
