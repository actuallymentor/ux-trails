
// Force English locale for consistent test selectors
export function set_english( win ) {
    win.localStorage.setItem( 'ux-trails-lang', 'en' )
}

// Navigate to the registration form
export function visit_register() {
    cy.visit( '/login', { onBeforeLoad: set_english } )
    cy.contains( 'create a new account' ).click()
}

// Register and login a fresh test user with unique email
export function login_as_test_user( prefix = 'test' ) {
    cy.visit( '/login', { onBeforeLoad: set_english } )
    cy.contains( 'create a new account' ).click()
    const email = `${ prefix }-${ Date.now() }@test.com`
    cy.get( 'input[type="text"]' ).type( `${ prefix } Test User` )
    cy.get( 'input[type="email"]' ).type( email )
    cy.get( 'input[type="password"]' ).type( 'testpass' )
    cy.contains( 'a', 'Register' ).click()
    cy.get( '.Toastify__toast--success', { timeout: 5000 } ).should( 'be.visible' )
}

// Get tomorrow's date in YYYY-MM-DD format (local time, not UTC)
export function tomorrow_date() {
    const d = new Date()
    d.setDate( d.getDate() + 1 )
    const year = d.getFullYear()
    const month = String( d.getMonth() + 1 ).padStart( 2, '0' )
    const day = String( d.getDate() ).padStart( 2, '0' )
    return `${ year }-${ month }-${ day }`
}
