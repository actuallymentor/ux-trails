import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export const useMessagesStore = create()( persist(

    // Store definition
    ( set, get ) => ( {

        // Set of message subjects that have been read
        read_subjects: {},

        // Mark a message as read by its subject
        mark_read: subject => {
            const updated = { ...get().read_subjects, [ subject ]: true }
            set( { read_subjects: updated } )
        },

        // Check if a message has been read
        is_read: subject => !!get().read_subjects[ subject ],

        // Count unread messages from a list of letters
        get_unread_count: letters => {
            const { read_subjects } = get()
            return letters.filter( l => !read_subjects[ l.subject ] ).length
        },

        // Clear all read state
        clear_messages: () => set( { read_subjects: {} } ),

    } ),

    // Persistence config
    {
        name: 'messages-storage',
        storage: createJSONStorage( () => localStorage ),
    }

) )
