import { useMemo, useState } from "react"
import { useLabTestScoreStore } from "../../stores/labtest_score"
import Container from "../atoms/Container"
import Section from "../atoms/Section"
import { measurements_to_letters } from "../../modules/letters"
import { useUserStore } from "../../stores/user_store"
import Card from "../atoms/Card"
import { H1, Text } from "../atoms/Text"
import Button from "../atoms/Button"
import Modal from "../molecules/Modal"
import Column from "../atoms/Column"
import { MailIcon } from "lucide-react"

export default function Berichten() {

    const { user } = useUserStore()
    const { labtest_scores } = useLabTestScoreStore()
    const letters = useMemo( () => measurements_to_letters( { patient_name: user?.name, labtest_scores } ), [ labtest_scores ] )
    const [ letter_index, set_letter_index ] = useState( null )

    return <Container $align='center' $justify='center'>

        <Column $direction='row' $justify='space-between' $width='100%' $align='center' $margin='0 0 2rem' >
            <H1 $margin='0'><MailIcon size='2.2rem' />Uw Berichtenbox</H1>
        </Column>
        
        <Section $overflow='scroll' $height='80vh' $wrap='nowrap'>
            { letters.map( ( { subject, message, day }, index ) => <Card $width="700px" $padding=".25rem .5rem" key={ subject }>
                <Section $padding="0" $margin="0" $direction="row" $align="center" $justify="space-between" >
                    <Text><MailIcon />{ subject }</Text>
                    <Button $variant='outline' onClick={ () => set_letter_index( index ) } >
                        Bekijk bericht
                    </Button>
                </Section>
            </Card> ) }

        </Section>

        { letter_index !== null && <Modal onClose={ () => set_letter_index( null ) }>
            <Card $padding='2rem 3rem'>
                <Text $size='1.5rem' $margin='1rem 0 2rem'>{ letters[ letter_index ].subject }</Text>
                <Text>{ letters[ letter_index ].message }</Text>
                <Button $variant='outline' onClick={ f => set_letter_index( null ) } >
                    Sluit bericht
                </Button>
            </Card>
        </Modal> }

    </Container>
}