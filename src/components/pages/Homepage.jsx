import styled from "styled-components"
import Container from "../atoms/Container"
import Hero from "../molecules/Hero"
import { H1, H2, Sidenote, Text } from "../atoms/Text"
import Button from "../atoms/Button"
import { useUserStore } from "../../stores/user_store"
import Card from "../atoms/Card"
import { BirdIcon, BookIcon, CalendarIcon, FileTextIcon, GlobeIcon, HospitalIcon, MailIcon, MegaphoneIcon, PlusIcon, SyringeIcon, TestTubesIcon, UserIcon, VanIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Spacer from "../atoms/Spacer"
import Tile from "../molecules/Tile"
import Grid from "../atoms/Grid"
import { useTranslation } from "react-i18next"
import { useUxSinsStore } from "../../stores/ux_sins_store"

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

    const tiles = [
        { icon: ambiguous ? SyringeIcon : TestTubesIcon, title: t( 'homepage.tiles.labs.title' ), nav: '/profile/labs', text: t( 'homepage.tiles.labs.body' ) },
        { icon: ambiguous ? HospitalIcon : CalendarIcon, title: t( 'homepage.tiles.appointments.title' ), nav: '/profile/appointments', text: t( 'homepage.tiles.appointments.body' ) },
        { icon: ambiguous ? VanIcon : FileTextIcon, title: t( 'homepage.tiles.documents.title' ), nav: '/profile/documents', text: t( 'homepage.tiles.documents.body' ) },
        { icon: ambiguous ? BirdIcon : MailIcon, title: t( 'homepage.tiles.messages.title' ), nav: '/profile/inbox', text: t( 'homepage.tiles.messages.body' ) },
    ]

    const quick_actions = [
        { icon: ambiguous ? HospitalIcon : PlusIcon, label: t( rename ? 'homepage.quickActions.alt.newAppointment' : 'homepage.quickActions.newAppointment' ), nav: '/profile/appointments' },
        { icon: ambiguous ? BookIcon : UserIcon, label: t( rename ? 'homepage.quickActions.alt.editProfile' : 'homepage.quickActions.editProfile' ), nav: '/profile/settings' },
        { icon: ambiguous ? MegaphoneIcon : GlobeIcon, label: t( rename ? 'homepage.quickActions.alt.changeLanguage' : 'homepage.quickActions.changeLanguage' ), nav: '/profile/app-settings' },
    ]

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
            { quick_actions.map( ( { icon: Icon, label, nav } ) =>
                <ActionRow key={ label } onClick={ () => navigate( nav ) }>
                    <Icon size="1.1rem" />
                    <Text $margin="0">{ label }</Text>
                </ActionRow>
            ) }
        </Card>

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