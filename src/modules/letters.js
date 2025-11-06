import { multiline_trim } from "mentie"


export function measurements_to_letters( { patient_name='heer/mevrouw', labtest_scores } ) {

    const readings = labtest_scores.reduce( ( acc, test ) => {
        const { name, readings } = test
        const formatted_readings = readings.map( r => ( { ...r, name } ) )
        return [ ...acc, ...formatted_readings ]
    }, [] )

    return readings.map( ( { name, value, unit, day } ) => ( {
        day,
        subject: `Uitslag ${ name } onderzoek ${ day }`,
        message: multiline_trim( `

        Geachte ${ patient_name },

        U bent recent bij ons geweest voor een ${ name } onderzoek.
        
        Zie bijgesloten de uitslag van uw onderzoek.

        De waarde van uw ${ name } is ${ value } ${ unit } gemeten op ${ day }.

        Met vriendelijke groet,

        Uw zorgverlener

    ` )
    } ) )

}