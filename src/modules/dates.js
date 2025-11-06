import { log } from "mentie"

export const [ tomorrow_yyyy_mm_dd ] = new Date( Date.now() + 60_000 * 60 * 24 ).toISOString().split( 'T' )

// Get the day, month, and year of a timestamp
export function get_day_month_year( timestamp ) {

    const date = new Date( timestamp )
    const day = `${ date.getDate() }`.padStart( 2, '0' )
    const month = `${ date.getMonth() + 1 }`.padStart( 2, '0' )
    const year = date.getFullYear()

    return { day, month, year }

}


/**
 * Validator function that checks if input date string is after a given timestamp
 * @param {String} date_string - Date in yyyy-mm-dd format
 * @param {Number} timestamp - Timestamp to compare against, defaults to 24 hours from now
 * @returns {Boolean} - True if input date is after timestamp, false otherwise
 */
export function date_after_timestamp_validator( date_string, timestamp=Date.now() + 60_000 * 60 * 24 ) {

    const input_date = new Date( date_string )
    const compare_date = new Date( timestamp )
    const valid = input_date.getTime() > compare_date.getTime() 
    log.info( 'Date after timestamp validation result:', { date_string, input_date, compare_date, valid } )
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
 * Checks if a given date string represents a future date
 * @param {String} date_string - Date string
 * @returns {Boolean} - True if the date is in the future, false otherwise
 */
export function is_future( date_string ) {
    const input_date = new Date( date_string )
    return input_date.getTime() > Date.now()
}