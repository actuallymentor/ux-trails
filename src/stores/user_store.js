import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export const useUserStore = create()( persist(  

    // Store definition
    ( set, get ) => ( {
        user: null,
        users: [],
        users_by_email: {},
        set_user: user => set( {
            user: { ...get().user, ...user },
            users_by_email: { ...get().users_by_email, [ user.email ]: user },
        } ),
        clear_user: () => set( { user: null } )
    } ),

    // Persistence store
    {
        name: 'user-storage',
        storage: createJSONStorage( () => localStorage )
    }

) )