import { Suspense, lazy } from "react"
import { prefetch } from 'less-lazy'
import { useLabTestScoreStore } from "../../stores/labtest_score"
import Container from "../atoms/Container"
import Section from "../atoms/Section"
import Card from "../atoms/Card"
import { Spinner } from "../molecules/Loading"
import { H2, Text } from '../atoms/Text'
import Button from "../atoms/Button"
import { useQueryParam } from "use-query-params"
const LabChart = lazy( prefetch( () => import( "../molecules/LabChart" ) ) )


export default function LabTests() {

    const { labtest_scores } = useLabTestScoreStore()
    const [ current_test, set_current_test ] = useQueryParam( 'name' )
    const current_data = labtest_scores.find( t => t.name == current_test )

    // Return overview if no test is selected
    if( !current_test ) return <Container $align='center' $justify='center'>

        <Section>
            <H2>Uitslagen</H2>
            { labtest_scores.map( ( { name, average, unit, readings } ) => <Card key={ name }>
                <Text>{ name }</Text>
                <Text>Er zijn { readings.length } metingen beschikbaar.</Text>
                <Button $variant='outline' onClick={ () => set_current_test( name ) } >
                    Bekijk uitslagen
                </Button>
            </Card> ) }
        </Section>

    </Container>

    // Display a pretty overview of the test values
    return <Container $align='center' $justify='center'>
        
        <Section>
            <Button $variant='outline' onClick={ () => set_current_test( undefined ) } >
                Terug naar overzicht
            </Button>

            <Suspense fallback={ <Spinner /> }>
                <LabChart data={ current_data } />
            </Suspense>
            { labtest_scores?.filter( t => t.name == current_test ).map( ( { name, average, unit, readings } ) => <Card $margin='5rem 0 0' key={ name }>
                <H2>{ name }</H2>
                <Text>Er zijn { readings.length } metingen beschikbaar.</Text>
                <Text>Gemiddelde waarde: { average } { unit }</Text>
                { readings.map( ( { day, value, unit }, i ) => <Text key={ i }>Meting { day }: { value } { unit }</Text> ) }
            </Card> ) }
        </Section>

    </Container>

}