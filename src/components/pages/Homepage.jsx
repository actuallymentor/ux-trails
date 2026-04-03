import { useState } from "react"
import styled from "styled-components"
import Container from "../atoms/Container"
import Hero from "../molecules/Hero"
import { H1, H2, Sidenote, Text } from "../atoms/Text"
import Button from "../atoms/Button"
import { useUserStore } from "../../stores/user_store"
import Card from "../atoms/Card"
import { BirdIcon, BookIcon, CalendarIcon, FileTextIcon, FlaskConicalIcon, GlobeIcon, HospitalIcon, MailIcon, MegaphoneIcon, PlusIcon, SyringeIcon, UserIcon, VanIcon, XIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Spacer from "../atoms/Spacer"
import Tile from "../molecules/Tile"
import Grid from "../atoms/Grid"
import { useTranslation } from "react-i18next"
import { useUxSinsStore } from "../../stores/ux_sins_store"

const Overlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba( 0, 0, 0, 0.45 );
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`

const ModalCard = styled( Card )`
    max-width: 480px;
    width: 90%;
    padding: 2rem 2.5rem;
    position: relative;
`

const CloseButton = styled.button`
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    cursor: pointer;
    color: ${ ( { theme } ) => theme.colors.hint };
    padding: 0.25rem;
    display: flex;

    &:hover { color: ${ ( { theme } ) => theme.colors.text }; }
`

const ActionRow = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.6rem 0;
    cursor: pointer;
    color: ${ ( { theme } ) => theme.colors.text };
    transition: color 0.15s;

    &:hover {
        color: ${ ( { theme } ) => theme.colors.accent };
    }

    svg {
        flex-shrink: 0;
        color: ${ ( { theme } ) => theme.colors.accent };
    }
`

export default function Homepage() {

    const { user } = useUserStore()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const { enabled_sins } = useUxSinsStore()
    const rename = enabled_sins.inconsistent_action_naming
    const ambiguous = !!enabled_sins?.ambiguous_icons
    const instruct = !!enabled_sins?.instruct_instead_of_do
    const [ instruction_text, set_instruction_text ] = useState( null )

    const tiles = [
        { icon: ambiguous ? SyringeIcon : FlaskConicalIcon, title: t( 'homepage.tiles.labs.title' ), nav: '/profile/labs', text: t( 'homepage.tiles.labs.body' ) },
        { icon: ambiguous ? HospitalIcon : CalendarIcon, title: t( 'homepage.tiles.appointments.title' ), nav: '/profile/appointments', text: t( 'homepage.tiles.appointments.body' ) },
        { icon: ambiguous ? VanIcon : FileTextIcon, title: t( 'homepage.tiles.documents.title' ), nav: '/profile/documents', text: t( 'homepage.tiles.documents.body' ) },
        { icon: ambiguous ? BirdIcon : MailIcon, title: t( 'homepage.tiles.messages.title' ), nav: '/profile/inbox', text: t( 'homepage.tiles.messages.body' ) },
    ]

    const quick_actions = [
        { icon: ambiguous ? HospitalIcon : PlusIcon, label: t( rename ? 'homepage.quickActions.alt.newAppointment' : 'homepage.quickActions.newAppointment' ), nav: '/profile/appointments', instruction: 'homepage.quickActions.instructions.newAppointment' },
        { icon: ambiguous ? BookIcon : UserIcon, label: t( rename ? 'homepage.quickActions.alt.editProfile' : 'homepage.quickActions.editProfile' ), nav: '/profile/settings', instruction: 'homepage.quickActions.instructions.editProfile' },
        { icon: ambiguous ? MegaphoneIcon : GlobeIcon, label: t( rename ? 'homepage.quickActions.alt.changeLanguage' : 'homepage.quickActions.changeLanguage' ), nav: '/profile/app-settings', instruction: 'homepage.quickActions.instructions.changeLanguage' },
    ]

    // When "instruct instead of do" sin is active, show a modal with instructions
    // instead of navigating to the target page
    const handle_action = ( { nav, instruction } ) => {
        if( instruct ) return set_instruction_text( t( instruction ) )
        navigate( nav )
    }

    if( user ) return <Container>

        <Card $width="100%">
            <H1 $margin=".5rem 0">{ t( 'homepage.patientArea' ) }</H1>
            <H2>{ t( 'homepage.welcomeUser', { name: user.name } ) }</H2>
            <Sidenote $align="left" $margin="0">{ t( 'homepage.welcomeSubtext' ) }</Sidenote>
        </Card>

        { /* <Section $direction="row" $flexwrap="wrap" $justify="space-between" $align="center" $margin="2rem 0" $padding='0' >
            { tiles.map( ( tile, index ) => <Tile { ...tile } key={ index } onClick={ () => navigate( tile.nav ) } /> ) }
        </Section> */ }

        <Grid>
            { tiles.map( ( tile, index ) => <Tile { ...tile } key={ index } onClick={ () => navigate( tile.nav ) } /> ) }
        </Grid>

        { /* Quick actions */ }
        <Card $width="100%">
            <H2 $margin="0 0 .5rem">{ t( 'homepage.quickActions.title' ) }</H2>
            { quick_actions.map( ( action ) =>
                <ActionRow key={ action.label } onClick={ () => handle_action( action ) }>
                    <action.icon size="1.1rem" />
                    <Text $margin="0">{ action.label }</Text>
                </ActionRow>
            ) }
        </Card>

        { /* Instruction modal — shown when "instruct instead of do" sin is active */ }
        { instruction_text && <Overlay onClick={ () => set_instruction_text( null ) }>
            <ModalCard onClick={ e => e.stopPropagation() }>
                <CloseButton onClick={ () => set_instruction_text( null ) }><XIcon size="1.2rem" /></CloseButton>
                <Text $margin="0">{ instruction_text }</Text>
            </ModalCard>
        </Overlay> }

    </Container>

    return <Container $padding='0'>

        <Hero>
            <H1 $margin="0">{ t( 'homepage.heroTitle' ) }</H1>
            <H2>{ t( 'homepage.heroSubtitle' ) }</H2>
            <Button navigate="/login" $color="primary" $variant="solid">{ t( 'homepage.loginButton' ) }</Button>
            <Spacer $padding=".5rem" />
            <Button navigate="/login?register=true" $color="primary" $variant="outline">{ t( 'homepage.registerButton' ) }</Button>
        </Hero>

    </Container>

}