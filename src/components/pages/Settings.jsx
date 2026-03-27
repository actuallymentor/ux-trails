import { useState } from "react"
import { useUserStore } from "../../stores/user_store"
import Button from "../atoms/Button"
import Container from "../atoms/Container"
import Section from "../atoms/Section"
import { H1 } from "../atoms/Text"
import Input from "../molecules/Input"
import { toast } from "react-toastify"
import { email_regex, log } from "mentie"
import { useTranslation } from "react-i18next"

// Dutch postcode: 4 digits, optional space, 2 letters (e.g. 1234 AB, 1234ab)
const postcode_regex = /^\d{4}\s?[a-zA-Z]{2}$/

export default function Settings() {

    const { user, set_user, users_by_email } = useUserStore()
    const [ profile, set_profile ] = useState( { ...user } )
    const { t } = useTranslation()
    const known_error_keys = new Set( [ 'missingRequired', 'duplicateEmail', 'invalidEmail', 'invalidPostcode' ] )

    const save = () => {

        try {

            // Validations
            log.info( 'Saving profile:', profile )
            const { email, password } = profile

            // Required fields
            if( !email?.length || !password?.length ) throw new Error( 'missingRequired' )

            // Unique email
            const existing_user = users_by_email[ email ]
            if( existing_user && existing_user.id !== profile.id ) throw new Error( 'duplicateEmail' )

            // Email validity
            if( !email.match( email_regex ) ) throw new Error( 'invalidEmail' )

            // Normalize and validate postcode (trim whitespace, uppercase)
            const updated_profile = {
                ...profile,
                postcode: profile.postcode?.trim().toUpperCase()
            }
            if( updated_profile.postcode?.length && !postcode_regex.test( updated_profile.postcode ) ) throw new Error( 'invalidPostcode' )

            // All good, save profile
            set_user( updated_profile )
            toast.success( t( 'settings.toast.success' ) )

        } catch ( e ) {

            const message_key = e.message
            if( known_error_keys.has( message_key ) ) {
                toast.error( t( `settings.toast.${ message_key }` ) )
            } else {
                toast.error( t( 'settings.toast.genericError', { message: message_key } ) )
            }

        }

    }


    return <Container $justify="center" $align="center" $padding="4rem 1rem" >

        <Section $width='800px' $justify="center" $align="center">

            <H1>{ t( 'settings.pageTitle' ) }</H1>
            <Input value={ profile?.name } onChange={ e => set_profile( { ...profile, name: e.target.value } ) } label={ t( 'settings.labels.name' ) } info={ t( 'settings.info.name' ) } type="text" placeholder={ t( 'settings.placeholders.name' ) } />
            <Input value={ profile?.phone } onChange={ e => set_profile( { ...profile, phone: e.target.value } ) } label={ t( 'settings.labels.phone' ) } info={ t( 'settings.info.phone' ) } type="tel" placeholder={ t( 'settings.placeholders.phone' ) } />
            <Input value={ profile?.postcode } onChange={ e => set_profile( { ...profile, postcode: e.target.value } ) } label={ t( 'settings.labels.postcode' ) } info={ t( 'settings.info.postcode' ) } type="text" placeholder={ t( 'settings.placeholders.postcode' ) } validate={ val => { const v = ( val || `` ).trim().toUpperCase(); return !v.length || postcode_regex.test( v ) } } error={ t( 'settings.toast.invalidPostcode' ) } />
            <Input value={ profile?.doctor } onChange={ e => set_profile( { ...profile, doctor: e.target.value } ) } label={ t( 'settings.labels.doctor' ) } info={ t( 'settings.info.doctor' ) } type="text" placeholder={ t( 'settings.placeholders.doctor' ) } />
            <Input value={ profile?.email } onChange={ e => set_profile( { ...profile, email: e.target.value } ) } label={ t( 'settings.labels.email' ) } info={ t( 'settings.info.email' ) } type="email" placeholder={ t( 'settings.placeholders.email' ) } />
            <Input value={ profile?.password } onChange={ e => set_profile( { ...profile, password: e.target.value } ) } label={ t( 'settings.labels.password' ) } info={ t( 'settings.info.password' ) } type="password" placeholder={ t( 'settings.placeholders.password' ) } />
            <Button onClick={ save }>{ t( 'common.save' ) }</Button>
        </Section>

    </Container>
}