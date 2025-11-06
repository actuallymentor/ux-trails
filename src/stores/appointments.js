import { log, random_number_between } from "mentie"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

function generate_random_slots( date ) {
    const slots = []
    const start_hour = 9
    const end_hour = 17
    const slot_duration = 30 // in minutes
    const amount_of_slots = random_number_between( 5 )

    // For the amount of slots, generate random times, make sure there is no overlap
    const used_times = new Set()
    while( slots.length < amount_of_slots ) {
        const hour = random_number_between( start_hour, end_hour - 1 )
        const minute = random_number_between( 0, 1 ) * slot_duration
        const time_key = `${ hour }:${ minute === 0 ? '00' : minute }`
        if( used_times.has( time_key ) ) continue
        used_times.add( time_key )
        slots.push( {
            date,
            time: time_key,
            available: true
        } )
    }

    // Sort slots by time
    slots.sort( ( a, b ) => {
        const [ a_hour, a_minute ] = a.time.split( ':' ).map( Number )
        const [ b_hour, b_minute ] = b.time.split( ':' ).map( Number )
        return a_hour === b_hour ? a_minute - b_minute : a_hour - b_hour
    } )

    return slots
}

export const useAppointmentsStore = create()( persist(

    // Store definition
    ( set, get ) => ( {
        appointments: [],
        available_slots: {},
        get_slots_for_date: ( date ) => {

            // If date is not set, return empty array
            if( !date ) return []

            // If slot is available, return it
            const slots = get().available_slots[ date ]
            if( Array.isArray( slots ) ) return slots

            // If no slot is found for this date, generate a random slot list
            const generated_slots = generate_random_slots( date )
            log.info( `Generated ${ generated_slots.length } slots for date ${ date }:`, generated_slots )

            // Save generated slots to store
            set( {
                available_slots: {
                    ...get().available_slots,
                    [ date ]: generated_slots
                }
            } )

            return generated_slots
        },
        add_appointment: ( appointment ) => set( {
            appointments: [ ...get().appointments, appointment ]
        } ),
        clear_appointment: ( index ) => {
            const new_appointments = get().appointments.filter( ( _, i ) => i !== index )
            set( { appointments: new_appointments } )
        },
        clear_appointments: () => set( { appointments: [] } )
    } ),

    // Persistence store
    {
        name: 'appointments-storage',
        storage: createJSONStorage( () => localStorage )
    }

) )