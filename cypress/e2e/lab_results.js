
import { login_as_test_user } from '../support/commands'

context( 'Lab results sorting and date validation', () => {

    beforeEach( () => {
        cy.clearLocalStorage()
        login_as_test_user( 'lab' )
    } )

    it( 'No reading dates are in the future', () => {
        cy.visit( '/profile/labs', { onBeforeLoad: win => win.localStorage.setItem( 'ux-trails-lang', 'en' ) } )

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
        cy.visit( '/profile/labs', { onBeforeLoad: win => win.localStorage.setItem( 'ux-trails-lang', 'en' ) } )

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
