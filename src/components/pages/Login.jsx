import { useState } from "react"
import { useUserStore } from "../../stores/user_store"
import Button from "../atoms/Button"
import Container from "../atoms/Container"
import Section from "../atoms/Section"
import { H1, Sidenote } from "../atoms/Text"
import Input from "../molecules/Input"
import { toast } from "react-toastify"
import { capitalise } from "mentie"
import Card from "../atoms/Card"
import A from "../atoms/Link"
import Spacer from "../atoms/Spacer"

export default function LoginPage() {

    const [ mode, set_mode ] = useState( 'login' )
    const { user, set_user, users_by_email } = useUserStore()
    const [ email, set_email ] = useState( '' )
    const [ password, set_password ] = useState( '' )
    const [ name, set_name ] = useState( '' )

    // Helpers
    const toggle_mode = () => set_mode( mode === 'login' ? 'register' : 'login' )
    const login = () => {


        // Check if user exists, toast error if not
        const existing_user = users_by_email[ email ]
        if( !existing_user ) {
            toast.error( 'Gebruiker niet gevonden' )
            return
        }

        // Check if password matches, toast error if not
        if( existing_user.password !== password ) {
            toast.error( 'Wachtwoord is onjuist' )
            return
        }

        // Otherwise, log in with toast
        set_user( { ...existing_user } )
        toast.success( 'Ingelogd' )

    }
    const register = () => {

        // Check if user already exists, toast error if so
        const existing_user = users_by_email[ email ]
        if( existing_user ) {
            toast.error( 'Gebruiker bestaat al' )
            return
        }

        // Create new user
        const new_user = { name, email, password }
        set_user( new_user )
        toast.success( 'Geregistreerd en ingelogd' )

    }

    return <Container $justify="center" $align="center" $padding="4rem 1rem" >

        <Section $width='800px' $justify="center" $align="center">

            <Card>
                <H1>{ mode === 'login' ? 'Inloggen' : 'Registreren' }</H1>
                <Sidenote $align="left" $margin='2rem 0'>{
                    mode === 'login' ? <>Log in met uw inloggegevens of <A onClick={ toggle_mode }>creëer een nieuw account.</A> </>
                        : <>Registreer een nieuw account of <A onClick={ toggle_mode }>log in met uw bestaande gegevens.</A></>
                }</Sidenote>
                { mode === 'register' && <Input value={ name } onChange={ e => set_name( e.target.value ) } label="Volledige naam" info='Uw volledige naam' type="text" placeholder="Jan Jansen" /> }
                <Input value={ email } onChange={ e => set_email( e.target.value ) } label="Email of gebruikersnaam" info='Uw email adres' type="email" placeholder="uw@email.com" />
                <Input value={ password } onChange={ e => set_password( e.target.value ) } label="Wachtwoord" info='Uw wachtwoord' type="password" placeholder="wachtwoord" />
                <Spacer />
                <Button $align="center" $width='100%' onClick={ mode === 'login' ? login : register }>{ capitalise( mode ) }</Button>
                <Spacer />

            </Card>

        </Section>

    </Container>
}