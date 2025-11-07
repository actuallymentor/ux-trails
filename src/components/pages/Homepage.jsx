import Container from "../atoms/Container"
import Hero from "../molecules/Hero"
import { H1, H2 } from "../atoms/Text"
import Button from "../atoms/Button"
import { useUserStore } from "../../stores/user_store"
import Card from "../atoms/Card"
import Section from "../atoms/Section"
import { CalendarIcon, FileTextIcon, FlaskConicalIcon, MailIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Tile from "../molecules/Tile"

export default function Homepage() {

    const { user } = useUserStore()
    const navigate = useNavigate()

    const tiles = [
        { icon: FlaskConicalIcon, title: 'Uitslagen', nav: '/profile/labs', text: 'Klik hier om uw testuitslagen te belijken.' },
        { icon: CalendarIcon, title: 'Afspraken', nav: '/profile/appointments', text: 'Klik hier om uw afspraken te beheren.' },
        { icon: FileTextIcon, title: 'Documenten', nav: '/profile/documents', text: 'Klik hier om uw documenten te bekijken.' },
        { icon: MailIcon, title: 'Berichten', nav: '/profile/inbox', text: 'Klik hier om uw berichten te lezen.' },
    ]

    if( user ) return <Container>

        <Card $width="100%">
            <H1 $margin=".5rem 0">Patientomgeving</H1>
            <H2>Welkom { user.name }</H2>
        </Card>

        <Section $direction="row" $flexwrap="wrap" $justify="center" $align="center" $margin="2rem 0" >
            { tiles.map( ( tile, index ) => <Tile { ...tile } key={ index } onClick={ () => navigate( tile.nav ) } /> ) }
        </Section>

    </Container>

    return <Container $padding='0'>

        <Hero>
            <H1 $margin="0">Welkom bij de patiëntenomgeving</H1>
            <H2>Log in om uw gegevens te bekijken</H2>
            <Button navigate="/login" $color="primary" $variant="solid">Inloggen</Button>
        </Hero>

    </Container>

}