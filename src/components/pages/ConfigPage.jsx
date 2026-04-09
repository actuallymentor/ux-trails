import { useEffect, useRef } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

import Container from "../atoms/Container"
import Section from "../atoms/Section"
import Card from "../atoms/Card"
import { H1, H2, Sidenote } from "../atoms/Text"
import Button from "../atoms/Button"
import Spacer from "../atoms/Spacer"
import { useUxSinsStore } from "../../stores/ux_sins_store"

export default function ConfigPage() {

    const { t } = useTranslation()
    const [ searchParams ] = useSearchParams()
    const navigate = useNavigate()
    const { set_sins_from_params, get_sin_catalog } = useUxSinsStore()
    const applied = useRef( false )

    // On mount, hydrate sins from URL params and persist to localStorage
    // When sins param is present, apply and redirect straight to homepage
    useEffect( () => {

        if ( applied.current ) return
        applied.current = true

        const sins_param = searchParams.get( 'sins' )
        if ( sins_param ) {
            const ids = sins_param.split( ',' ).filter( Boolean )
            set_sins_from_params( ids )
            toast.success( t( 'config.toast.applied' ) )
            navigate( '/', { replace: true } )
        }

    }, [ searchParams, t, set_sins_from_params, navigate ] )

    // Show the current state of all sins (reflecting what was just applied)
    const catalog = get_sin_catalog()
    const enabled_sins = catalog.filter( sin => sin.enabled )

    return <Container>

        <Section $width="800px" $padding="2rem 1rem">

            <H1>{ t( 'config.pageTitle' ) }</H1>
            <Sidenote $align="left" $margin="0 0 2rem 0">{ t( 'config.pageDescription' ) }</Sidenote>

            { enabled_sins.length > 0
                ? enabled_sins.map( sin => (
                    <Card key={ sin.id } $width="100%">
                        <H2 $margin="0">{ sin.name }</H2>
                        <Sidenote $align="left" $margin=".5rem 0 0 0">{ sin.description }</Sidenote>
                    </Card>
                ) )
                : <Card $width="100%">
                    <Sidenote $align="left" $margin="0">{ t( 'config.noSins' ) }</Sidenote>
                </Card>
            }

            <Spacer />

            <Button navigate="/" $width="100%" $align="center">
                { t( 'config.goHome' ) }
            </Button>

        </Section>

    </Container>

}
