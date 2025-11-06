import { useState } from "react"
import { useUserStore } from "../../stores/user_store"
import Button from "../atoms/Button"
import Container from "../atoms/Container"
import Section from "../atoms/Section"
import { H1 } from "../atoms/Text"
import Input from "../molecules/Input"
import { toast } from "react-toastify"
import { email_regex, log } from "mentie"

export default function Settings() {

    const [ mode, set_mode ] = useState( 'login' )
    const { user, set_user, users_by_email } = useUserStore()
    const [ profile, set_profile ] = useState( { ...user } )

    const save = () => {

        try {

            // Validations
            log.info( 'Saving profile:', profile )
            const { email, password } = profile

            // Required fields
            if( !email?.length || !password?.length ) throw new Error( 'Email en wachtwoord zijn verplicht' )

            // Unique email
            const existing_user = users_by_email[ email ]
            if( existing_user && existing_user.id !== profile.id ) throw new Error( 'Er bestaat al een gebruiker met dit email adres' )

            // Email validity
            if( !email.match( email_regex ) ) throw new Error( 'Ongeldig email adres' )

            // All good, save profile
            set_user( profile )
            toast.success( 'Profiel opgeslagen' )

        } catch ( e ) {

            toast.error( `Fout bij opslaan profiel: ${ e.message }` )

        }

    }


    return <Container $justify="center" $align="center" $padding="4rem 1rem" >

        <Section $width='800px' $justify="center" $align="center">

            <H1>Instellingen</H1>
            <Input value={ profile?.name } onChange={ e => set_profile( { ...profile, name: e.target.value } ) } label="Volledige naam" info='Uw volledige naam zoals deze in het systeem wordt weergegeven' type="text" placeholder="Jan Jansen" />
            <Input value={ profile?.phone } onChange={ e => set_profile( { ...profile, phone: e.target.value } ) } label="Telefoonnummer" info='Uw telefoonnummer' type="tel" placeholder="+31 6 12345678" />
            <Input value={ profile?.address } onChange={ e => set_profile( { ...profile, address: e.target.value } ) } label="Adres" info='Uw woonadres' type="text" placeholder="Straatnaam 1, 1234 AB, Plaats" />
            <Input value={ profile?.doctor } onChange={ e => set_profile( { ...profile, doctor: e.target.value } ) } label="Huisarts" info='Naam van uw huisarts' type="text" placeholder="Dr. Pietersen" />
            <Input value={ profile?.email } onChange={ e => set_profile( { ...profile, email: e.target.value } ) } label="Email of gebruikersnaam" info='Uw email adres' type="email" placeholder="uw@email.com" />
            <Input value={ profile?.password } onChange={ e => set_profile( { ...profile, password: e.target.value } ) } label="Wachtwoord" info='Uw wachtwoord' type="password" placeholder="wachtwoord" />
            <Button onClick={ save }>Opslaan</Button>
        </Section>

    </Container>
}