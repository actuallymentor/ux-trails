import Container from "../atoms/Container"
import Hero from "../molecules/Hero"
import { H1, H2 } from "../atoms/Text"
import Button from "../atoms/Button"
import { useUserStore } from "../../stores/user_store"

export default function Homepage() {

    const { user } = useUserStore()

    return <Container>

        <Hero>
            <H1>Patientomgeving</H1>
            <H2>Bekijk hier uw medische gegevens</H2>
            { !user && <Button navigate="/login" $color="primary" $variant="solid">Inloggen</Button> }
        </Hero>

    </Container>
}