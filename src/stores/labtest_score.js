import { dev, log, random_number_between } from "mentie"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

// Generic value generator
function random_values( { amount_of_readings, min_value, max_value, unit } ) {

    // Set up readings
    const readings = []
    let average = 0
    const now = Date.now()
    let day_offset = random_number_between( 30 )

    log.info( `Generating ${ amount_of_readings } random readings between ${ min_value } and ${ max_value } ${ unit }` )
    for( let i=0; i<amount_of_readings; i++ ) {
        const value = random_number_between( max_value, min_value )
        const day =  new Date( now -  day_offset * 24 * 60 * 60 * 1000  ) .toLocaleDateString( 'nl-NL' )
        day_offset -= random_number_between( 30 )
        readings.push( { value, unit, day } )
        average += value
    }
    average = Math.round( average / amount_of_readings )

    return { readings, average, unit }
}

const dummy_value_spec = [
    { name: 'Bloeddruk', amount_of_readings: random_number_between( 12, 3 ), min_value: 90, max_value: 140, unit: 'mmHg' },
    { name: 'Cholesterol', amount_of_readings: random_number_between( 12, 3 ), min_value: 150, max_value: 250, unit: 'mg/dL' },
    { name: 'Bloedsuiker', amount_of_readings: random_number_between( 12, 3 ), min_value: 70, max_value: 130, unit: 'mg/dL' },
]


export const useLabTestScoreStore = create()( persist(  

    // Store definition
    ( set, get ) => ( {
        labtest_scores: [],
        init_dummy_scores: () => {

            // If we are in dev mode, trash readings every time
            if( dev ) set( { labtest_scores: [] } )

            // First check if already initialised
            const { labtest_scores } = get()
            if( labtest_scores.length > 0 ) {
                log.info( 'Lab test scores already initialised, skipping:', labtest_scores )
                return
            }

            // Initialise with dummy data
            log.info( 'Initialising dummy lab test scores' )
            const dummy_data = dummy_value_spec.reduce( ( acc, spec ) => {
                const values = random_values( spec )
                acc.push( { ...spec, ...values } )
                return acc
            }, [] )
            log.info( 'Dummy lab test scores', dummy_data )
            set( { labtest_scores: dummy_data } )

        },
        clear_labs: () => set( { labtest_scores: [] } )
    } ),

    // Persistence store
    {
        name: 'labtest-score-storage',
        storage: createJSONStorage( () => localStorage )
    }

) )