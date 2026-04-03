import { useTranslation } from "react-i18next"
import styled from "styled-components"
import { GlobeIcon, MegaphoneIcon } from "lucide-react"
import { useUxSinsStore } from "../../stores/ux_sins_store"


const LanguageDropdownBase = styled.div`
    padding: 0!important;
    display: flex;
    align-items: center;
    gap: 0.4rem;

    svg {
        flex-shrink: 0;
        stroke: ${ ( { theme } ) => theme.colors.accent };
    }

    select {
        border: none;
        font-size: 1rem;
        ${ ( { $hide_chevron } ) => $hide_chevron ? `
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
        ` : '' }
    }
`

export default function LanguageSelector( { ...props } ) {

    const { t, i18n } = useTranslation()
    const [ current_language ] = ( i18n.resolvedLanguage || i18n.language || 'nl' ).split( '-' )
    const { enabled_sins } = useUxSinsStore()
    const ambiguous = !!enabled_sins?.ambiguous_icons
    const hide_chevron = !!enabled_sins?.hidden_dropdown_icon
    const LangIcon = ambiguous ? MegaphoneIcon : GlobeIcon

    const available_languages = [
        { code: 'nl', label: `Nederlands` },
        { code: 'en', label: `English` },
        { code: 'es', label: `Español` },
        { code: 'fr', label: `Français` },
        { code: 'de', label: `Deutsch` },
        { code: 'it', label: `Italiano` },
        { code: 'pt', label: `Português` },
        { code: 'pl', label: `Polski` },
        { code: 'ru', label: `Русский` },
        { code: 'zh', label: `中文` },
        { code: 'ja', label: `日本語` }
    ]



    function handle_language_change( event ) {
        const next_language = event.target.value
        if( next_language === current_language ) return
        i18n.changeLanguage( next_language )
    }

    return <LanguageDropdownBase className='language_selector' $hide_chevron={ hide_chevron } { ...props }>
        <LangIcon size='1rem' />
        <select name='language' value={ current_language } onChange={ handle_language_change }>
            { available_languages.map( ( { code, label } ) => <option value={ code } key={ code }>{ label }</option> ) }
        </select>
    </LanguageDropdownBase>

}