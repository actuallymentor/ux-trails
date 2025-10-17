import { useMemo, useState } from "react"
import { useLabTestScoreStore } from "../../stores/labtest_score"
import Container from "../atoms/Container"
import Section from "../atoms/Section"
import { measurements_to_letters } from "../../modules/letters"
import { useUserStore } from "../../stores/user_store"
import Card from "../atoms/Card"
import { H2, Text } from "../atoms/Text"
import Button from "../atoms/Button"
import Modal from "../molecules/Modal"

export default function Berichten() {

    const { user } = useUserStore()
    const { labtest_scores } = useLabTestScoreStore()
    const letters = useMemo( () => measurements_to_letters( { patient_name: user?.name, labtest_scores } ), [ labtest_scores ] )
    const [ letter_index, set_letter_index ] = useState( null )

    return <Container $align='center' $justify='center'>
        <H2 $margin='2rem 0 1rem'>Uw Berichtenbox</H2>
        
        <Section $overflow='scroll' $height='80vh' $wrap='nowrap'>
            { letters.map( ( { subject, message, day }, index ) => <Card key={ subject }>
                <Text>{ subject }</Text>
                <Button $variant='outline' onClick={ () => set_letter_index( index ) } >
                    Bekijk bericht
                </Button>
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