import { multiline_trim } from "mentie"
import i18n from "../i18n"
import { useUxSinsStore } from "../stores/ux_sins_store"


export function measurements_to_letters( { patient_name=i18n.t( 'letters.defaultPatientName' ), labtest_scores } ) {

    const { enabled_sins } = useUxSinsStore.getState()

    // Flatten all readings, carrying the test type key for translation at render time
    const readings = labtest_scores.reduce( ( acc, test ) => {
        const { type, readings } = test
        const formatted_readings = readings.map( r => ( { ...r, type } ) )
        return [ ...acc, ...formatted_readings ]
    }, [] )

    return readings.map( ( { type, value, unit, day } ) => {

        // When confusing synonym sin is active, use "Pulse rate" for heart rate
        const test_name = enabled_sins.confusing_synonym && type === 'heartrate'
            ? i18n.t( 'labs.synonyms.heartrate', { defaultValue: type } )
            : i18n.t( `labs.types.${ type }`, { defaultValue: type } )
        return {
            day,
            subject: i18n.t( 'letters.subject', { testName: test_name, day } ),
            message: multiline_trim( i18n.t( 'letters.message', { patientName: patient_name, testName: test_name, value, unit, day } ) )
        }
    } )

}