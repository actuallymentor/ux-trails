import { log } from "mentie"

/**
 * Formats a Date object as a local YYYY-MM-DD string.
 * Using local time avoids UTC-offset bugs where midnight UTC
 * falls on a different calendar day than the user's local date.
 * @param {Date} date - Date object to format
 * @returns {String} - Date in yyyy-mm-dd format
 */
export function local_date_string( date = new Date() ) {
    const year = date.getFullYear()
    const month = String( date.getMonth() + 1 ).padStart( 2, '0' )
    const day = String( date.getDate() ).padStart( 2, '0' )
    return `${ year }-${ month }-${ day }`
}

// Today and tomorrow as YYYY-MM-DD in local time
export const today_yyyy_mm_dd = local_date_string()
const tomorrow = new Date()
tomorrow.setDate( tomorrow.getDate() + 1 )
export const tomorrow_yyyy_mm_dd = local_date_string( tomorrow )

// Get the day, month, and year of a timestamp
export function get_day_month_year( timestamp ) {

    const date = new Date( timestamp )
    const day = `${ date.getDate() }`.padStart( 2, '0' )
    const month = `${ date.getMonth() + 1 }`.padStart( 2, '0' )
    const year = date.getFullYear()

    return { day, month, year }

}


/**
 * Validator function that checks if input date string is today or later.
 * Compares YYYY-MM-DD strings in local time to avoid UTC-offset issues.
 * @param {String} date_string - Date in yyyy-mm-dd format
 * @returns {Boolean} - True if input date is today or in the future, false otherwise
 */
export function date_after_timestamp_validator( date_string, { verbose = false } = {} ) {

    const today = local_date_string()
    const valid = date_string >= today
    if( verbose ) log.info( 'Date validation result:', { date_string, today, valid } )
    return valid

}

/**
 * Converts a date string to a localized date string
 * @param {String} date - Date string
 * @param {String} locale - Locale string, defaults to browser locale 
 * @param {Object} options - toLocaleDateString options
 * @returns {String} - Localized date string
 */
export function date_to_locale_string( date, locale=navigator.language || 'nl-NL', options={ year: 'numeric', month: 'long', day: 'numeric' } ) {
    return new Date( date ).toLocaleDateString( locale, options )
}

/**
 * Checks if a given date string represents today or a future date.
 * Compares YYYY-MM-DD strings in local time to avoid UTC-offset issues
 * where midnight UTC can fall on a different calendar day.
 * @param {String} date_string - Date string in yyyy-mm-dd format
 * @returns {Boolean} - True if the date is today or in the future, false otherwise
 */
export function is_future( date_string ) {
    return date_string >= local_date_string()
}