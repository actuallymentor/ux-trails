import styled from "styled-components"
import Container from "../atoms/Container"
import Section from "../atoms/Section"
import { H1, Sidenote } from "../atoms/Text"
import LanguageSelector from "../molecules/LanguageDropdown"
import { useTranslation } from "react-i18next"

const FieldWrapper = styled.div`
    width: 100%;
    margin: 1rem 0;

    label {
        display: block;
        margin-bottom: 0.5rem;
        color: ${ ( { theme } ) => theme.colors.text };
    }

    select {
        width: 100%;
        padding: 1rem;
        border: 1px solid ${ ( { theme } ) => theme.colors.borders };
        border-radius: 5px;
        background: ${ ( { theme } ) => theme.colors.backdrop };
        color: ${ ( { theme } ) => theme.colors.text };
        font-size: 1rem;
    }
`

export default function AppSettings() {

    const { t } = useTranslation()

    return <Container $justify="center" $align="center" $padding="4rem 1rem">

        <Section $width='800px' $justify="center" $align="center">

            <H1>{ t( 'appSettings.pageTitle' ) }</H1>
            <Sidenote $align="left" $margin="0 0 2rem 0">{ t( 'appSettings.pageDescription' ) }</Sidenote>

            <FieldWrapper>
                <label>{ t( 'appSettings.languageLabel' ) }</label>
                <LanguageSelector />
            </FieldWrapper>

        </Section>

    </Container>

}
