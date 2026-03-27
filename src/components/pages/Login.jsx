import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useUserStore } from "../../stores/user_store"
import Button from "../atoms/Button"
import Container from "../atoms/Container"
import Section from "../atoms/Section"
import { H1, Sidenote } from "../atoms/Text"
import Input from "../molecules/Input"
import { toast } from "react-toastify"
import Card from "../atoms/Card"
import A from "../atoms/Link"
import Spacer from "../atoms/Spacer"
import { useTranslation } from "react-i18next"
import styled from "styled-components"

const LoginBackground = styled.div`
    width: 100%;
    min-height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: ${ ( { theme } ) => `linear-gradient( 135deg, ${ theme.colors.info } 0%, ${ theme.colors.backdrop } 100% )` };
`

export default function LoginPage() {

    const [ searchParams ] = useSearchParams()
    const [ mode, set_mode ] = useState( searchParams.get( 'register' ) ? 'register' : 'login' )
    const { user, set_user, users_by_email } = useUserStore()

    // Switch to register mode when navigated with ?register=true
    useEffect( () => {
        if( searchParams.get( 'register' ) ) set_mode( 'register' )
    }, [ searchParams ] )
    const [ email, set_email ] = useState( '' )
    const [ password, set_password ] = useState( '' )
    const [ name, set_name ] = useState( '' )
    const { t } = useTranslation()

    // Helpers
    const toggle_mode = () => set_mode( mode === 'login' ? 'register' : 'login' )
    const login = () => {


        // Check if user exists, toast error if not
        const existing_user = users_by_email[ email ]
        if( !existing_user ) {
            toast.error( t( 'login.toast.userNotFound' ) )
            return
        }

        // Check if password matches, toast error if not
        if( existing_user.password !== password ) {
            toast.error( t( 'login.toast.wrongPassword' ) )
            return
        }

        // Otherwise, log in with toast
        set_user( { ...existing_user } )
        toast.success( t( 'login.toast.loggedIn' ) )

    }
    const register = () => {

        // Check password meets minimum requirements
        if( password.length < 5 ) return toast.error( t( 'login.error.password' ) )

        // Check if user already exists, toast error if so
        const existing_user = users_by_email[ email ]
        if( existing_user ) {
            toast.error( t( 'login.toast.userExists' ) )
            return
        }

        // Create new user
        const new_user = { name, email, password }
        set_user( new_user )
        toast.success( t( 'login.toast.registered' ) )

    }

    return <Container $justify="center" $align="center" $padding="0" $width="100%" >

        <LoginBackground>
            <Section $width='800px' $justify="center" $align="center" $padding="4rem 1rem">

                <Card>
                    <H1>{ mode === 'login' ? t( 'login.login' ) : t( 'login.register' ) }</H1>
                    <Sidenote $align="left" $margin='2rem 0'>{
                        mode === 'login' ? <>
                            { t( 'login.loginDescription' ) } <A onClick={ toggle_mode }>{ t( 'login.createAccount' ) }</A>
                        </>
                            : <>
                                { t( 'login.registerDescription' ) } <A onClick={ toggle_mode }>{ t( 'login.loginExisting' ) }</A>
                            </>
                    }</Sidenote>
                    { mode === 'register' && <Input value={ name } onChange={ e => set_name( e.target.value ) } label={ t( 'login.labels.name' ) } info={ t( 'login.info.name' ) } type="text" placeholder={ t( 'login.placeholders.name' ) } /> }
                    <Input value={ email } onChange={ e => set_email( e.target.value ) } onEnter={ mode === 'login' ? login : undefined } label={ t( 'login.labels.email' ) } info={ t( 'login.info.email' ) } type="email" placeholder={ t( 'login.placeholders.email' ) } />
                    <Input value={ password } onChange={ e => set_password( e.target.value ) } onEnter={ mode === 'login' ? login : register } label={ t( 'login.labels.password' ) } info={ t( 'login.info.password' ) } type="password" placeholder={ t( 'login.placeholders.password' ) } validate={ value => value?.length >= 5 } error={ t( 'login.error.password' ) } hint={ mode === 'register' ? t( 'login.hint.password' ) : undefined } />
                    <Spacer />
                    <Button $align="center" $width='100%' onClick={ mode === 'login' ? login : register }>{ mode === 'login' ? t( 'login.button.login' ) : t( 'login.button.register' ) }</Button>
                    <Spacer />

                </Card>

            </Section>
        </LoginBackground>

    </Container>
}