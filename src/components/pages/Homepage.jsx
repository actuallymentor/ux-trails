import Container from "../atoms/Container"
import Hero from "../molecules/Hero"
import { H1, H2 } from "../atoms/Text"
import Button from "../atoms/Button"
import { useUserStore } from "../../stores/user_store"
import Card from "../atoms/Card"
import { CalendarIcon, FileTextIcon, FlaskConicalIcon, MailIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Tile from "../molecules/Tile"
import Grid from "../atoms/Grid"
import { useTranslation } from "react-i18next"

export default function Homepage() {

    const { user } = useUserStore()
    const navigate = useNavigate()
    const { t } = useTranslation()

    const tiles = [
        { icon: FlaskConicalIcon, title: t( 'homepage.tiles.labs.title' ), nav: '/profile/labs', text: t( 'homepage.tiles.labs.body' ) },
        { icon: CalendarIcon, title: t( 'homepage.tiles.appointments.title' ), nav: '/profile/appointments', text: t( 'homepage.tiles.appointments.body' ) },
        { icon: FileTextIcon, title: t( 'homepage.tiles.documents.title' ), nav: '/profile/documents', text: t( 'homepage.tiles.documents.body' ) },
        { icon: MailIcon, title: t( 'homepage.tiles.messages.title' ), nav: '/profile/inbox', text: t( 'homepage.tiles.messages.body' ) },
    ]

    if( user ) return <Container>

        <Card $width="100%">
            <H1 $margin=".5rem 0">{ t( 'homepage.patientArea' ) }</H1>
            <H2>{ t( 'homepage.welcomeUser', { name: user.name } ) }</H2>
        </Card>

        { /* <Section $direction="row" $flexwrap="wrap" $justify="space-between" $align="center" $margin="2rem 0" $padding='0' >
            { tiles.map( ( tile, index ) => <Tile { ...tile } key={ index } onClick={ () => navigate( tile.nav ) } /> ) }
        </Section> */ }

        <Grid>
            { tiles.map( ( tile, index ) => <Tile { ...tile } key={ index } onClick={ () => navigate( tile.nav ) } /> ) }
        </Grid>

    </Container>

    return <Container $padding='0'>

        <Hero>
            <H1 $margin="0">{ t( 'homepage.heroTitle' ) }</H1>
            <H2>{ t( 'homepage.heroSubtitle' ) }</H2>
            <Button navigate="/login" $color="primary" $variant="solid">{ t( 'homepage.loginButton' ) }</Button>
        </Hero>

    </Container>

}