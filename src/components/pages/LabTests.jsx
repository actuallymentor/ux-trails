import { Suspense, lazy } from "react"
import { prefetch } from 'less-lazy'
import { useQueryParam } from "use-query-params"
import { FlaskConicalIcon, ArrowLeftIcon, BarChart3Icon, SyringeIcon } from "lucide-react"
import { useLabTestScoreStore } from "../../stores/labtest_score"
import { useUxSinsStore } from "../../stores/ux_sins_store"
import Container from "../atoms/Container"
import Section from "../atoms/Section"
import Card from "../atoms/Card"
import Column from "../atoms/Column"
import { Spinner } from "../molecules/Loading"
import { H1, H2, Text } from '../atoms/Text'
import Button from "../atoms/Button"
import Badge from "../molecules/Badge"
import { useTheme } from "styled-components"
import Grid from "../atoms/Grid"
import { useTranslation } from "react-i18next"
const LabChart = lazy( prefetch( () => import( "../molecules/LabChart" ) ) )


// Parse nl-NL date format (D-M-YYYY) into a timestamp for sorting
// Returns 0 for unparseable dates so they sort to the end
function parse_nl_date( date_string ) {
    const [ day, month, year ] = ( date_string || '' ).split( '-' ).map( Number )
    const ts = new Date( year, month - 1, day ).getTime()
    return Number.isNaN( ts ) ? 0 : ts
}

function sort_readings_newest_first( readings ) {
    return [ ...readings ].sort( ( a, b ) => parse_nl_date( b.day ) - parse_nl_date( a.day ) )
}

export default function LabTests() {

    const { labtest_scores } = useLabTestScoreStore()
    const [ current_test, set_current_test ] = useQueryParam( 'name' )
    const current_data = labtest_scores.find( t => t.type == current_test )
    const theme = useTheme()
    const { t } = useTranslation()
    const { enabled_sins } = useUxSinsStore()

    const opaque_counts = !!enabled_sins.opaque_lab_counts
    const ambiguous = !!enabled_sins?.ambiguous_icons
    const LabIcon = ambiguous ? SyringeIcon : FlaskConicalIcon

    // When the confusing synonym sin is active, use "Pulse rate" instead of
    // "Heart rate" on the detail view (overview keeps the original name)
    const detail_name = type => {
        if( enabled_sins.confusing_synonym && type === 'heartrate' ) return t( 'labs.synonyms.heartrate', { defaultValue: type } )
        return t( `labs.types.${ type }`, { defaultValue: type } )
    }

    if( current_test && !current_data ) {
        return <Container $align='center' $justify='center'>
            <Card $width='600px' $padding='3rem 3.5rem'>
                <H2 $margin='0 0 1rem'>{ t( 'labTests.unknownTitle' ) }</H2>
                <Text $color='hint' $margin='0 0 2rem'>{ t( 'labTests.unknownDescription' ) }</Text>
                <Button $variant='outline' onClick={ () => set_current_test( undefined ) }>
                    <ArrowLeftIcon size='1.2rem' />{ t( 'common.backToOverview' ) }
                </Button>
            </Card>
        </Container>
    }

    // Return overview if no test is selected
    if( !current_test ) return <Container $align='center' $justify='center'>

        <Column $direction='row' $justify='space-between' $align='center' $width='100%' $padding='0' $margin='0 0 2rem'>
            <H1 $margin='0'><LabIcon size='2.2rem' />{ t( 'labTests.pageTitle' ) }</H1>
        </Column>


        <Section $align='center' $justify='center' $padding='0' $margin='0' >
            <Grid>
                { labtest_scores.map( ( { type, average, unit, readings } ) => {

                    const latest_reading = sort_readings_newest_first( readings || [] )[ 0 ]
                    const display_name = t( `labs.types.${ type }`, { defaultValue: type } )

                    return <Card key={ type } $padding='1rem 1.5rem' $width={ `${ theme.container /2 }px` } $max-width='48%' >
                        <H2 $margin='0 0 1rem'><LabIcon size='1.2rem' />{ display_name }</H2>
                        <Badge $position='absolute' $right='1.5rem' $top='1rem'>{ t( 'labTests.metrics', { count: opaque_counts ? '1+' : readings.length } ) }</Badge>
                        <Text $margin='0' $color='hint'>{ t( 'labTests.average', { value: average, unit } ) }</Text>
                        { latest_reading && <Text $margin='0' $color='hint'>{ t( 'labTests.latestReading', { day: latest_reading.day, value: latest_reading.value, unit: latest_reading.unit } ) }</Text> }
                        <Button $scale='.9' $variant='outline' $margin='1rem 0 0' onClick={ () => set_current_test( type ) }>
                            { t( 'labTests.view' ) }
                        </Button>
                    </Card>
                } ) }
                { labtest_scores.length == 0 && <Text $margin='2rem 0'>{ t( 'labTests.emptyState' ) }</Text> }
            </Grid>
        </Section>

    </Container>

    // Display a pretty overview of the test values
    return <Container $align='center' $justify='center'>

        <Column $direction='row' $justify='space-between' $align='center' $width='100%' $max-width='1100px' $margin='0 0 2rem'>
            <H1 $margin='0'>
                <LabIcon size='2.2rem' />{ detail_name( current_data?.type ) }
            </H1>
            <Button $variant='outline' onClick={ () => set_current_test( undefined ) }>
                <ArrowLeftIcon size='1.2rem' />{ t( 'common.backToOverview' ) }
            </Button>
        </Column>

        <Section $direction='row' $width='100%' $align='center' $justify='center' $max-width='100%' $gap='2rem'>
            <Card $width='50%' $justify='center' $min-width='min(450px, 100%)' $padding='2rem 2.5rem'>
                <H2 $align='center' $margin='0'><BarChart3Icon size='1.6rem' /> { t( 'labTests.trend' ) }</H2>
                <Suspense fallback={ <Spinner /> }>
                    <LabChart data={ current_data } display_name={ detail_name( current_data?.type ) } width={ 600 } />
                </Suspense>
            </Card>

            <Card $width='40%' $min-width='min(450px, 100%)' $padding='2rem 2.5rem'>
                <Badge $position='absolute' $right='2rem' $top='2rem'>{ t( 'labTests.averageBadge', { value: current_data?.average, unit: current_data?.unit } ) }</Badge>
                <H2 $margin='0 0 1rem'>{ t( 'labTests.overview' ) }</H2>
                <Text $color='hint'>{ t( 'labTests.readingsCount', { count: opaque_counts ? '1+' : current_data?.readings.length } ) }</Text>
                <Column $width='100%' $margin='1.5rem 0 0' $gap='0.5rem'>
                    { sort_readings_newest_first( current_data?.readings || [] ).map( ( { day, value, unit }, index ) => <Text key={ `${ current_data.type }-${ index }` } $margin='.2rem 0' $color='hint'>{ t( 'labTests.readingItem', { day, value, unit } ) }</Text> ) }
                </Column>
            </Card>
        </Section>

    </Container>

}