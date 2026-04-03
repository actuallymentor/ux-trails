import { useMemo, useState } from "react"
import { useLabTestScoreStore } from "../../stores/labtest_score"
import Container from "../atoms/Container"
import Section from "../atoms/Section"
import { measurements_to_letters } from "../../modules/letters"
import { useUserStore } from "../../stores/user_store"
import Card from "../atoms/Card"
import { H1, Sidenote, Text } from "../atoms/Text"
import Button from "../atoms/Button"
import Modal from "../molecules/Modal"
import Column from "../atoms/Column"
import Badge from "../molecules/Badge"
import { MailIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useMessagesStore } from "../../stores/messages_store"

export default function Berichten() {

    const { user } = useUserStore()
    const { labtest_scores } = useLabTestScoreStore()
    const { t, i18n: { language } } = useTranslation()
    const letters = useMemo( () => measurements_to_letters( { patient_name: user?.name, labtest_scores } ), [ user?.name, labtest_scores, language ] )
    const [ letter_index, set_letter_index ] = useState( null )
    const { mark_read, is_read, get_unread_count } = useMessagesStore()
    const unread_count = get_unread_count( letters )

    return <Container $align='center' $justify='center'>

        <Column $direction='row' $justify='space-between' $align='center' $width='100%' $padding='0' $margin='0'>
            <H1 $margin='0'><MailIcon size='2.2rem' />{ t( 'messages.pageTitle' ) }</H1>
        </Column>
        <Sidenote $align='left' $margin='0 0 2rem' $width='100%'>{ t( 'messages.unreadCount', { unread: unread_count, total: letters.length } ) }</Sidenote>

        <Section $overflow='scroll' $height='80vh' $wrap='nowrap' $padding='0'>
            { letters.map( ( { subject, message, day }, index ) => {

                const read = is_read( subject )

                return <Card $width="700px" $padding=".25rem .5rem" key={ subject }>
                    <Section $padding="0" $margin="0" $direction="row" $align="center" $justify="space-between" $wrap="nowrap" >

                        <Column $direction="row" $align="center" $gap=".75rem" $padding="0" $margin="0" $width="auto" $wrap="nowrap">
                            <Badge $position="static" $background={ read ? 'hint' : 'accent' }>
                                { read ? t( 'messages.read' ) : t( 'messages.unread' ) }
                            </Badge>
                            <Text $margin="0"><MailIcon />{ subject }</Text>
                        </Column>

                        <Button $variant='outline' onClick={ () => { mark_read( subject ); set_letter_index( index ) } }>
                            { t( 'messages.viewShort' ) }
                        </Button>

                    </Section>
                </Card>

            } ) }
        </Section>

        { letter_index !== null && <Modal onClose={ () => set_letter_index( null ) }>
            <Card $padding='2rem 3rem'>
                <Text $size='1.5rem' $margin='1rem 0 2rem'>{ letters[ letter_index ].subject }</Text>
                <Text>{ letters[ letter_index ].message }</Text>
                <Button $variant='outline' onClick={ f => set_letter_index( null ) } >
                    { t( 'messages.close' ) }
                </Button>
            </Card>
        </Modal> }

    </Container>
}
