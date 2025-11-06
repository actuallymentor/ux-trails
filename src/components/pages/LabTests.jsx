import { Suspense, lazy } from "react"
import { prefetch } from 'less-lazy'
import { useQueryParam } from "use-query-params"
import { FlaskConicalIcon, ArrowLeftIcon, BarChart3Icon } from "lucide-react"
import { useLabTestScoreStore } from "../../stores/labtest_score"
import Container from "../atoms/Container"
import Section from "../atoms/Section"
import Card from "../atoms/Card"
import Column from "../atoms/Column"
import Grid from "../atoms/Grid"
import { Spinner } from "../molecules/Loading"
import { H1, H2, Text } from '../atoms/Text'
import Button from "../atoms/Button"
import Badge from "../molecules/Badge"
const LabChart = lazy( prefetch( () => import( "../molecules/LabChart" ) ) )


export default function LabTests() {

    const { labtest_scores } = useLabTestScoreStore()
    const [ current_test, set_current_test ] = useQueryParam( 'name' )
    const current_data = labtest_scores.find( t => t.name == current_test )

    if( current_test && !current_data ) {
        return <Container $align='center' $justify='center'>
            <Card $width='600px' $padding='3rem 3.5rem'>
                <H2 $margin='0 0 1rem'>Onbekende uitslag</H2>
                <Text $color='hint' $margin='0 0 2rem'>We konden deze laboratoriumuitslag niet vinden. Probeer het opnieuw vanuit het overzicht.</Text>
                <Button $variant='outline' onClick={ () => set_current_test( undefined ) }>
                    <ArrowLeftIcon size='1.2rem' />Terug naar overzicht
                </Button>
            </Card>
        </Container>
    }

    // Return overview if no test is selected
    if( !current_test ) return <Container $align='center' $justify='center'>

        <Column $direction='row' $justify='space-between' $align='center' $width='100%' $max-width='1100px' $margin='0 0 2rem'>
            <H1 $margin='0'><FlaskConicalIcon size='2.2rem' />Labuitslagen</H1>
            <Text $color='hint'>Selecteer een uitslag om details te bekijken.</Text>
        </Column>

        <Grid $columns={ Math.min( labtest_scores.length, 3 ) || 1 } $width='100%' $max-width='1500px' $gap='2rem'>

            { labtest_scores.map( ( { name, average, unit, readings } ) => {

                const latest_reading = readings?.[ readings.length - 1 ]

                return <Card key={ name } $width='100%' $min-width='320px' $padding='2rem 2.5rem'>
                    <H2 $margin='0 0 1rem'><FlaskConicalIcon size='1.2rem' />{ name }</H2>
                    <Badge $position='absolute' $right='2rem' $top='2rem'>Metingen: { readings.length }</Badge>
                    <Text $color='hint'>Gemiddelde waarde: { average } { unit }</Text>
                    { latest_reading && <Text $color='hint'>Laatste meting (dag { latest_reading.day }): { latest_reading.value } { latest_reading.unit }</Text> }
                    <Button $variant='outline' $margin='2rem 0 0' onClick={ () => set_current_test( name ) }>
                        Bekijk uitslagen
                    </Button>
                </Card>
            } ) }
            { labtest_scores.length == 0 && <Text $margin='2rem 0'>Er zijn nog geen labuitslagen beschikbaar.</Text> }
        </Grid>

    </Container>

    // Display a pretty overview of the test values
    return <Container $align='center' $justify='center'>

        <Column $direction='row' $justify='space-between' $align='center' $width='100%' $max-width='1100px' $margin='0 0 2rem'>
            <H1 $margin='0'>
                <FlaskConicalIcon size='2.2rem' />{ current_data?.name }
            </H1>
            <Button $variant='outline' onClick={ () => set_current_test( undefined ) }>
                <ArrowLeftIcon size='1.2rem' />Terug naar overzicht
            </Button>
        </Column>

        <Section $direction='row' $width='100%' $align='center' $justify='center' $max-width='1100px' $gap='2rem'>
            <Card $width='50%' $justify='center' $min-width='450px' $padding='2rem 2.5rem'>
                <H2 $align='center' $margin='0'><BarChart3Icon size='1.6rem' /> Trend</H2>
                <Suspense fallback={ <Spinner /> }>
                    <LabChart data={ current_data } width={ 600 } />
                </Suspense>
            </Card>

            <Card $width='40%' $min-width='450px' $padding='2rem 2.5rem'>
                <Badge $position='absolute' $right='2rem' $top='2rem'>Gemiddelde: { current_data?.average } { current_data?.unit }</Badge>
                <H2 $margin='0 0 1rem'>Overzicht</H2>
                <Text $color='hint'>Er zijn { current_data?.readings.length } metingen beschikbaar.</Text>
                <Column $width='100%' $margin='1.5rem 0 0' $gap='0.5rem'>
                    { current_data?.readings.map( ( { day, value, unit }, index ) => <Text key={ `${ current_data.name }-${ index }` } $margin='.2rem 0' $color='hint'>Meting { day }: { value } { unit }</Text> ) }
                </Column>
            </Card>
        </Section>

    </Container>

}