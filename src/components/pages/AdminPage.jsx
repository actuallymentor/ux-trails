import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"
import { QRCodeSVG } from "qrcode.react"
import styled from "styled-components"

import Container from "../atoms/Container"
import Section from "../atoms/Section"
import Card from "../atoms/Card"
import { H1, H2, Sidenote } from "../atoms/Text"
import Button from "../atoms/Button"
import Spacer from "../atoms/Spacer"
import { useUxSinsStore, SIN_CATEGORIES } from "../../stores/ux_sins_store"

// Toggle switch — styled checkbox used only on this page
const ToggleLabel = styled.label`
    position: relative;
    display: inline-block;
    width: 50px;
    height: 26px;
    flex-shrink: 0;

    input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    span {
        position: absolute;
        cursor: pointer;
        inset: 0;
        background: ${ ( { theme } ) => theme.colors.borders };
        border-radius: 26px;
        transition: background 0.2s;
    }

    span::before {
        content: "";
        position: absolute;
        height: 20px;
        width: 20px;
        left: 3px;
        bottom: 3px;
        background: white;
        border-radius: 50%;
        transition: transform 0.2s;
    }

    input:checked + span {
        background: ${ ( { theme } ) => theme.colors.accent };
    }

    input:checked + span::before {
        transform: translateX( 24px );
    }
`

const SinRow = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`

const UrlDisplay = styled.code`
    display: block;
    word-break: break-all;
    padding: 0.75rem 1rem;
    background: ${ ( { theme } ) => theme.colors.backdrop };
    border: 1px solid ${ ( { theme } ) => theme.colors.borders };
    border-radius: 5px;
    font-size: 0.85rem;
    color: ${ ( { theme } ) => theme.colors.text };
    margin: 0.5rem 0;
    user-select: all;
`

const QrWrapper = styled.div`
    display: flex;
    justify-content: center;
    padding: 1rem 0;
`

export default function AdminPage() {

    const { t } = useTranslation()
    const { toggle_sin, get_sin_catalog, get_shareable_url } = useUxSinsStore()

    const catalog = get_sin_catalog()
    const url = get_shareable_url()

    const zhang_sins = catalog.filter( sin => sin.category === SIN_CATEGORIES.zhang )
    const other_sins = catalog.filter( sin => sin.category === SIN_CATEGORIES.other )

    const copy_url = () => {
        navigator.clipboard.writeText( url )
            .then( () => toast.success( t( 'admin.toast.copied' ) ) )
            .catch( () => toast.error( t( 'admin.toast.copyError' ) ) )
    }

    const render_sin = sin => (
        <Card key={ sin.id } $width="100%">
            <SinRow>
                <ToggleLabel>
                    <input
                        type="checkbox"
                        checked={ sin.enabled }
                        onChange={ () => toggle_sin( sin.id ) }
                    />
                    <span />
                </ToggleLabel>
                <H2 $margin="0">{ sin.name }</H2>
            </SinRow>
            <Sidenote $align="left" $margin=".5rem 0 0 0">{ sin.description }</Sidenote>
        </Card>
    )

    return <Container>

        <Section $width="800px" $padding="2rem 1rem">

            <H1>{ t( 'admin.pageTitle' ) }</H1>
            <Sidenote $align="left" $margin="0 0 2rem 0">{ t( 'admin.pageDescription' ) }</Sidenote>

            { /* Zhang et al. heuristics */ }
            <H2 $margin="0 0 .5rem 0">{ t( 'admin.sectionZhang' ) }</H2>
            { zhang_sins.map( render_sin ) }

            <Spacer />

            { /* Other UX sins */ }
            <H2 $margin="0 0 .5rem 0">{ t( 'admin.sectionOther' ) }</H2>
            { other_sins.map( render_sin ) }

            <Spacer />

            { /* Share section */ }
            <Card $width="100%">
                <H2 $margin="0 0 .5rem 0">{ t( 'admin.shareTitle' ) }</H2>
                <Sidenote $align="left" $margin="0 0 .5rem 0">{ t( 'admin.shareDescription' ) }</Sidenote>

                <UrlDisplay>{ url }</UrlDisplay>

                <QrWrapper>
                    <QRCodeSVG value={ url } size={ 200 } />
                </QrWrapper>

                <Button onClick={ copy_url } $width="100%" $align="center">
                    { t( 'admin.copyUrl' ) }
                </Button>
            </Card>

        </Section>

    </Container>

}
