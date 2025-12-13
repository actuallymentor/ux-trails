import { multiline_trim } from "mentie"
import i18n from "../i18n"


export function measurements_to_letters( { patient_name=i18n.t( 'letters.defaultPatientName' ), labtest_scores } ) {

    const readings = labtest_scores.reduce( ( acc, test ) => {
        const { name, readings } = test
        const formatted_readings = readings.map( r => ( { ...r, name } ) )
        return [ ...acc, ...formatted_readings ]
    }, [] )

    return readings.map( ( { name, value, unit, day } ) => ( {
        day,
        subject: i18n.t( 'letters.subject', { testName: name, day } ),
        message: multiline_trim( i18n.t( 'letters.message', { patientName: patient_name, testName: name, value, unit, day } ) )
    } ) )

}