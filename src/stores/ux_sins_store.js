import { log } from "mentie"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

// Static catalog of all UX sins available in the system.
// Each sin has an id (used as key), a human-readable name, and a description
// of the anti-pattern it introduces. This array is the single source of truth
// for what sins exist — the admin and config pages derive their UI from it.
export const SIN_CATALOG = [
    {
        id: 'hidden_password_requirements',
        name: 'Hidden password requirements',
        description: 'Password requirements are not shown during registration. When validation fails, the error message says the password doesn\'t meet requirements but doesn\'t explain what those requirements are.',
    },
    {
        id: 'centered_toast',
        name: 'Toast notifications in center of screen',
        description: 'Toast notifications appear in the center of the screen, blocking content and requiring the user to wait for them to disappear.',
    },
    {
        id: 'forced_small_hamburger',
        name: 'Forced small hamburger menu',
        description: 'The navigation is always collapsed into a small hamburger icon in the top-right corner, even on desktop. The icon is smaller than normal, making it harder to find and tap.',
    },
    {
        id: 'no_icons',
        name: 'No informative icons',
        description: 'All informative and decorative icons are hidden. Functional icons like the hamburger menu, modal close buttons, and password visibility toggles are preserved.',
    },
    {
        id: 'small_text',
        name: 'Slightly too small text',
        description: 'The base font size is set to 10px, making all text uncomfortably small to read.',
    },
    {
        id: 'buttons_as_text',
        name: 'Buttons disguised as text',
        description: 'Buttons lose all visual distinction — no background, no border, no color difference. They look like regular text and only reveal themselves with an underline on hover.',
    },
]

// Build the default enabled_sins map from the catalog (all disabled)
const default_enabled_sins = Object.fromEntries(
    SIN_CATALOG.map( sin => [ sin.id, false ] )
)

export const useUxSinsStore = create()( persist(

    // Store definition
    ( set, get ) => ( {

        // Map of sin ID → boolean (persisted to localStorage)
        enabled_sins: { ...default_enabled_sins },

        // Toggle a sin on/off
        toggle_sin: id => {
            const current = get().enabled_sins
            const updated = { ...current, [ id ]: !current[ id ] }
            log.info( `Toggling sin "${ id }":`, !current[ id ] )
            set( { enabled_sins: updated } )
        },

        // Explicitly enable a sin
        enable_sin: id => {
            const updated = { ...get().enabled_sins, [ id ]: true }
            log.info( `Enabling sin "${ id }"` )
            set( { enabled_sins: updated } )
        },

        // Explicitly disable a sin
        disable_sin: id => {
            const updated = { ...get().enabled_sins, [ id ]: false }
            log.info( `Disabling sin "${ id }"` )
            set( { enabled_sins: updated } )
        },

        // Reset all sins then enable only the ones in the provided array.
        // Used when hydrating from a shared URL's query params.
        set_sins_from_params: ids_array => {
            const fresh = { ...default_enabled_sins }
            for( const id of ids_array ) {
                if( id in fresh ) fresh[ id ] = true
            }
            log.info( 'Setting sins from params:', fresh )
            set( { enabled_sins: fresh } )
        },

        // Return an array of sin IDs that are currently enabled
        get_enabled_sin_ids: () => {
            return Object.entries( get().enabled_sins )
                .filter( ( [ , enabled ] ) => enabled )
                .map( ( [ id ] ) => id )
        },

        // Return the full catalog enriched with each sin's current enabled state
        get_sin_catalog: () => {
            const current = get().enabled_sins
            return SIN_CATALOG.map( sin => ( {
                ...sin,
                enabled: !!current[ sin.id ],
            } ) )
        },

        // Build a shareable URL that points to /config with the enabled sins encoded
        get_shareable_url: () => {
            const enabled_ids = Object.entries( get().enabled_sins )
                .filter( ( [ , enabled ] ) => enabled )
                .map( ( [ id ] ) => id )
            const params = enabled_ids.length ? `?sins=${ enabled_ids.join( ',' ) }` : ''
            return `${ window.location.origin }/config${ params }`
        },

    } ),

    // Persistence config
    {
        name: 'ux-sins-storage',
        storage: createJSONStorage( () => localStorage ),
    }

) )
