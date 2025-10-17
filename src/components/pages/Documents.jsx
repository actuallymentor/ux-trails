import { useMemo } from "react"
import { useLabTestScoreStore } from "../../stores/labtest_score"
import Container from "../atoms/Container"
import Section from "../atoms/Section"
import { measurements_to_letters } from "../../modules/letters"
import { useUserStore } from "../../stores/user_store"
import { H2, Text } from "../atoms/Text"
import A from "../atoms/Link"

export default function Documents() {

    const { user } = useUserStore()
    const { labtest_scores } = useLabTestScoreStore()
    const letters = useMemo( () => measurements_to_letters( { patient_name: user?.name, labtest_scores } ), [ labtest_scores ] )

    async function download_pdf( index ) {

        const jspdf = await import( 'jspdf' )
        const doc = new jspdf.jsPDF( {
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        }  )

        doc.text( letters[ index ].message, 10, 10 )
        doc.save( `document-${ letters[ index ].subject }-${ letters[ index ].day }.pdf` )

    }

    return <Container $align='center' $justify='center'>
        <H2 $margin='2rem 0 1rem'>Uw Documenten</H2>
        <Text>Hieronder vindt u al uw medische documenten in PDF-formaat. Klik op een document om het te downloaden.</Text>
        <Section $height='80vh' $wrap='nowrap'>
            { letters.map( ( { subject, message, day }, index ) => <A key={ subject } $margin='.25rem 0' onClick={ () => download_pdf( index ) }>document-{ subject }-{ day }.pdf</A> ) }
        </Section>

    </Container>
}