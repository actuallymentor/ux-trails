import { log } from "mentie"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

// Categories for grouping sins in the admin UI
export const SIN_CATEGORIES = {
    zhang: 'zhang',
    other: 'other',
}

// Static catalog of all UX sins available in the system.
// Each sin has an id (used as key), a human-readable name, a description
// of the anti-pattern it introduces, and a category for UI grouping.
// This array is the single source of truth for what sins exist — the admin
// and config pages derive their UI from it.
export const SIN_CATALOG = [
    {
        id: 'hidden_password_requirements',
        category: SIN_CATEGORIES.zhang,
        subcategory: 'visibility_of_system_state',
        name: 'Hidden password requirements',
        description: 'Password requirements are not shown during registration. When validation fails, the error message says the password doesn\'t meet requirements but doesn\'t explain what those requirements are.',
    },
    {
        id: 'opaque_lab_counts',
        category: SIN_CATEGORIES.zhang,
        subcategory: 'visibility_of_system_state',
        name: 'Opaque lab measurement counts',
        description: 'The lab results page no longer shows the exact number of measurements, displaying "1+" instead of the actual count.',
    },
    {
        id: 'no_input_feedback',
        category: SIN_CATEGORIES.zhang,
        subcategory: 'visibility_of_system_state',
        name: 'No input feedback',
        description: 'Input fields no longer show visual feedback on validation — no green/red borders and no error messages beneath inputs.',
    },
    {
        id: 'opaque_message_counts',
        category: SIN_CATEGORIES.zhang,
        subcategory: 'visibility_of_system_state',
        name: 'Opaque messages count',
        description: 'The unread messages pill in the menu no longer shows the exact count, displaying "1+" instead of the actual number.',
    },
    {
        id: 'ambiguous_icons',
        category: SIN_CATEGORIES.zhang,
        subcategory: 'match_between_system_and_real_world',
        name: 'Ambiguous icons',
        description: 'Navigation and action icons are replaced with unrelated alternatives, making it harder to identify functions by their visual cues.',
    },
    {
        id: 'buttons_as_text',
        category: SIN_CATEGORIES.zhang,
        subcategory: 'match_between_system_and_real_world',
        name: 'Buttons disguised as text',
        description: 'Buttons lose all visual distinction — no background, no border, no color difference. They look like regular text and only reveal themselves with an underline on hover.',
    },
    {
        id: 'hidden_dropdown_icon',
        category: SIN_CATEGORIES.zhang,
        subcategory: 'match_between_system_and_real_world',
        name: 'Dropdown icon from language select is missing',
        description: 'The dropdown chevron on the language selector is hidden, making it unclear that the element is interactive.',
    },
    {
        id: 'locale_code_languages',
        category: SIN_CATEGORIES.zhang,
        subcategory: 'match_between_system_and_real_world',
        name: 'Languages use locale codes',
        description: 'The language selector shows POSIX locale codes (nl_NL, en_US, de_DE…) instead of human-readable language names.',
    },
    {
        id: 'chaotic_item_management',
        category: SIN_CATEGORIES.zhang,
        subcategory: 'minimalist',
        name: 'Chaotic item management',
        description: 'Messages and documents are sized to fit their content and packed onto lines instead of listed vertically, creating an uneven, hard-to-scan layout.',
    },
    {
        id: 'acronym_lab_names',
        category: SIN_CATEGORIES.zhang,
        subcategory: 'minimize_memory_load',
        name: 'Call lab results by acronyms',
        description: 'Lab result names are replaced with clinical acronyms (BP, TC, GLU, HR) that most patients won\'t recognise.',
    },
    {
        id: 'instruct_instead_of_do',
        category: SIN_CATEGORIES.zhang,
        subcategory: 'minimize_memory_load',
        name: 'Instruct instead of do',
        description: 'Quick actions on the home screen open a modal with instructions on where to click in the menu, instead of navigating directly.',
    },
    {
        id: 'force_chatbot_appointments',
        category: SIN_CATEGORIES.zhang,
        subcategory: 'flexibility_and_efficiency',
        name: 'Force chatbot on user for appointments',
        description: 'The normal appointment form is replaced by a rigid chatbot that asks superfluous questions and requires exact text input, making a simple task painfully slow.',
    },
    {
        id: 'hidden_password_requirements',
        category: SIN_CATEGORIES.zhang,
        subcategory: 'good_error_messages',
        name: 'Hidden password requirements',
        description: 'Password requirements are not shown during registration. When validation fails, the error message says the password doesn\'t meet requirements but doesn\'t explain what those requirements are.',
    },
    {
        id: 'disable_toasts',
        category: SIN_CATEGORIES.zhang,
        subcategory: 'clear_closure',
        name: 'Disable all toasts',
        description: 'All toast notification messages are blocked. No feedback toasts appear for any action — success, error, or informational.',
    },
    {
        id: 'appointment_redirect_home',
        category: SIN_CATEGORIES.zhang,
        subcategory: 'clear_closure',
        name: 'New appointment button refers straight to home',
        description: 'After successfully creating a new appointment, the user is redirected to the home page instead of staying on the appointments page where they could see their new appointment.',
    },
    {
        id: 'external_appointment_times',
        category: SIN_CATEGORIES.zhang,
        subcategory: 'give_users_control',
        name: 'Appointment times are externally determined',
        description: 'Users can select a day but have no control over the time. A random time is assigned and they are told to check their email for the scheduled time.',
    },
    {
        id: 'chatbot_cancel_appointment',
        category: SIN_CATEGORIES.zhang,
        subcategory: 'give_users_control',
        name: 'Appointment cancellation uses chatbot',
        description: 'Instead of a simple cancel button, users must go through a rigid chatbot that asks them to type the appointment details, their name, email, postal code, and reason for cancellation before confirming.',
    },
    {
        id: 'broken_help_button',
        category: SIN_CATEGORIES.zhang,
        subcategory: 'help_and_documentation',
        name: 'Floating contact button doesn\'t work',
        description: 'The floating help button in the bottom-right corner does nothing when clicked — no modal appears and no feedback is given.',
    },
    {
        id: 'jargon_lab_names',
        category: SIN_CATEGORIES.zhang,
        subcategory: 'use_users_language',
        name: 'Use extreme jargon for results',
        description: 'Lab result names are replaced with obscure medical jargon that most patients would never understand.',
    },
    {
        id: 'remove_cancel_appointment',
        category: SIN_CATEGORIES.zhang,
        subcategory: 'reversible_actions',
        name: 'Remove cancel appointment button',
        description: 'The cancel button on appointment cards is removed, leaving users with no way to remove or undo a booked appointment.',
    },
    {
        id: 'remove_tooltips',
        category: SIN_CATEGORIES.zhang,
        subcategory: 'error_prevention',
        name: 'Remove all tooltips from input fields',
        description: 'The informational tooltip icons next to input labels are removed, so users can no longer tap the "?" to learn what a field expects.',
    },
    {
        id: 'remove_placeholders',
        category: SIN_CATEGORIES.zhang,
        subcategory: 'error_prevention',
        name: 'Remove placeholders from input fields',
        description: 'Placeholder text inside input fields is removed, leaving blank fields with no hint of the expected format or value.',
    },
    {
        id: 'no_input_feedback',
        category: SIN_CATEGORIES.zhang,
        subcategory: 'informative_feedback',
        name: 'No input feedback',
        description: 'Input fields no longer show visual feedback on validation — no green/red borders and no error messages beneath inputs.',
    },
    {
        id: 'forced_small_hamburger',
        category: SIN_CATEGORIES.zhang,
        subcategory: 'informative_feedback',
        name: 'Forced small hamburger menu',
        description: 'The navigation is always collapsed into a small hamburger icon in the top-right corner, even on desktop. The icon is smaller than normal, making it harder to find and tap.',
    },
    {
        id: 'confusing_synonym',
        category: SIN_CATEGORIES.zhang,
        subcategory: 'consistency_and_standards',
        name: 'Confusing synonym use',
        description: 'Heart rate is referred to as "Pulse rate" on detail views, documents, and messages, while the overview still calls it "Heart rate".',
    },
    {
        id: 'inconsistent_action_naming',
        category: SIN_CATEGORIES.zhang,
        subcategory: 'consistency_and_standards',
        name: 'Inconsistent action naming',
        description: 'Quick actions on the home screen use different wording than the rest of the app, making it harder to recognise familiar actions.',
    },
    {
        id: 'centered_toast',
        category: SIN_CATEGORIES.other,
        name: 'Toast notifications in center of screen',
        description: 'Toast notifications appear in the center of the screen, blocking content and requiring the user to wait for them to disappear.',
    },
    {
        id: 'no_icons',
        category: SIN_CATEGORIES.other,
        name: 'No informative icons',
        description: 'All informative and decorative icons are hidden. Functional icons like the hamburger menu, modal close buttons, and password visibility toggles are preserved.',
    },
    {
        id: 'small_text',
        category: SIN_CATEGORIES.other,
        name: 'Slightly too small text',
        description: 'The base font size is set to 10px, making all text uncomfortably small to read.',
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

// Cross-tab sync: when another tab/window modifies the persisted sins,
// update this tab's store so changes activate without a page refresh.
if( typeof window !== 'undefined' ) {
    window.addEventListener( 'storage', event => {

        if( event.key !== 'ux-sins-storage' ) return

        try {
            const { state } = JSON.parse( event.newValue )
            if( state?.enabled_sins ) {
                useUxSinsStore.setState( { enabled_sins: state.enabled_sins } )
            }
        } catch {
            useUxSinsStore.persist.rehydrate()
        }

    } )
}
