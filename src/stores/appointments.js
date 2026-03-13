import { log, random_number_between } from "mentie"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { is_future, local_date_string } from "../modules/dates"

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

            // If date is not set or is in the past, return empty array
            if( !date ) return []
            if( !is_future( date ) ) return []

            // Resolve slots from cache or generate new ones
            let slots = get().available_slots[ date ]
            if( !Array.isArray( slots ) ) {
                slots = generate_random_slots( date )
                log.info( `Generated ${ slots.length } slots for date ${ date }:`, slots )
                set( { available_slots: { ...get().available_slots, [ date ]: slots } } )
            }

            // For today, only show time slots that are still in the future
            if( date === local_date_string() ) {
                const now = new Date()
                return slots.filter( slot => {
                    const [ hour, minute ] = slot.time.split( ':' ).map( Number )
                    return hour > now.getHours() ||  hour === now.getHours() && minute > now.getMinutes() 
                } )
            }

            return slots
        },
        add_appointment: ( appointment ) => set( {
            appointments: [ ...get().appointments, appointment ]
        } ),
        clear_appointment: ( index ) => {
            const new_appointments = get().appointments.filter( ( _, i ) => i !== index )
            set( { appointments: new_appointments } )
        },
        clear_appointments: () => set( { appointments: [], available_slots: {} } )
    } ),

    // Persistence store
    {
        name: 'appointments-storage',
        storage: createJSONStorage( () => localStorage )
    }

) )