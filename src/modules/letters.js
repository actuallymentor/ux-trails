import { multiline_trim } from "mentie"
import i18n from "../i18n"


export function measurements_to_letters( { patient_name=i18n.t( 'letters.defaultPatientName' ), labtest_scores } ) {

    // Flatten all readings, carrying the test type key for translation at render time
    const readings = labtest_scores.reduce( ( acc, test ) => {
        const { type, readings } = test
        const formatted_readings = readings.map( r => ( { ...r, type } ) )
        return [ ...acc, ...formatted_readings ]
    }, [] )

    return readings.map( ( { type, value, unit, day } ) => {
        const test_name = i18n.t( `labs.types.${ type }`, { defaultValue: type } )
        return {
            day,
            subject: i18n.t( 'letters.subject', { testName: test_name, day } ),
            message: multiline_trim( i18n.t( 'letters.message', { patientName: patient_name, testName: test_name, value, unit, day } ) )
        }
    } )

}