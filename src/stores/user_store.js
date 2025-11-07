import { log } from "mentie"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export const useUserStore = create()( persist(  

    // Store definition
    ( set, get ) => ( {
        user: null,
        users: [],
        users_by_email: {},
        set_user: user => {
            log.info( 'Setting user in store:', user )
            set( {
                users: [ ...get().users.filter( u => u.email !== user.email ), user ],
                user: { ...get().user, ...user },
                users_by_email: { ...get().users_by_email, [ user.email ]: user },
            } )
            log.info( `Users in store after setting:`, get() )
        },
        clear_user: () => {
            log.info( 'Clearing current user' )
            set( { user: null } )
            log.info( `Users in store after clearing:`, get() )
        }
    } ),

    // Persistence store
    {
        name: 'user-storage',
        storage: createJSONStorage( () => localStorage )
    }

) )