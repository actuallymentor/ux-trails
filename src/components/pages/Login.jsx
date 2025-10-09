import { useState } from "react"
import { useUserStore } from "../../stores/user_store"
import Button from "../atoms/Button"
import Container from "../atoms/Container"
import Section from "../atoms/Section"
import { H1, Sidenote } from "../atoms/Text"
import Input from "../molecules/Input"
import { toast } from "react-toastify"

export default function LoginPage() {

    const [ mode, set_mode ] = useState( 'login' )
    const { user, set_user, users_by_email } = useUserStore()
    const [ email, set_email ] = useState( '' )
    const [ password, set_password ] = useState( '' )

    // Helpers
    const toggle_mode = () => set_mode( mode === 'login' ? 'register' : 'login' )
    const login = () => {


        // Check if user exists, toast error if not
        const user = users_by_email[ email ]
        if( !user ) {
            toast.error( 'Gebruiker niet gevonden' )
            return
        }

        // Check if password matches, toast error if not
        if( user.password !== password ) {
            toast.error( 'Wachtwoord is onjuist' )
            return
        }

        // Otherwise, log in with toast
        set_user( { email, password } )
        toast.success( 'Ingelogd' )

    }
    const register = () => set_user( { email, password } )

    return <Container $justify="center" $align="center" $padding="4rem 1rem" >

        <Section $width='800px' $justify="center" $align="center">

            <H1>Inloggen</H1>
            <Input value={ email } onChange={ e => set_email( e.target.value ) } label="Email of gebruikersnaam" info='Uw email adres' type="email" placeholder="uw@email.com" />
            <Input value={ password } onChange={ e => set_password( e.target.value ) } label="Wachtwoord" info='Uw wachtwoord' type="password" placeholder="wachtwoord" />
            <Button onClick={ mode === 'login' ? login : register }>{ mode }</Button>
            <Sidenote>Of <span onClick={ toggle_mode }>{ mode === 'login' ? 'registreer' : 'log in' }</span></Sidenote>
        </Section>

    </Container>
}