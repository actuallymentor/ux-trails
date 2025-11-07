import { useMemo } from "react"
import { useLabTestScoreStore } from "../../stores/labtest_score"
import Container from "../atoms/Container"
import Section from "../atoms/Section"
import { measurements_to_letters } from "../../modules/letters"
import { useUserStore } from "../../stores/user_store"
import { H1, Text } from "../atoms/Text"
import Column from "../atoms/Column"
import { FileTextIcon } from "lucide-react"
import Card from "../atoms/Card"
import Button from "../atoms/Button"

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

        doc.setFontSize( 14 )
        doc.text( letters[ index ].message, 10, 10 )
        doc.save( `document-${ letters[ index ].subject }-${ letters[ index ].day }.pdf` )

    }

    return <Container $align='center' $justify='center'>
        <Column $direction='row' $justify='space-between' $width='100%' $align='center' $margin='0 0 2rem' >
            <H1 $margin='0'><FileTextIcon size='2.2rem' />Uw Documenten</H1>
        </Column>


        <Section $overflow='scroll' $height='80vh' $wrap='nowrap'>

            { letters.map( ( { subject, message, day }, index ) => <Card $width="700px" $padding=".25rem .5rem" key={ subject }>
                <Section $padding="0" $margin="0" $direction="row" $align="center" $justify="space-between" >
                    <Text><FileTextIcon />{ subject }</Text>
                    <Button $variant='outline' onClick={ () => download_pdf( index ) } >
                        Download document
                    </Button>
                </Section>
            </Card> ) }

        </Section>

    </Container>
}