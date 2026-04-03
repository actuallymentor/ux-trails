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
    const use_locale_codes = !!enabled_sins?.locale_code_languages
    const LangIcon = ambiguous ? MegaphoneIcon : GlobeIcon

    const available_languages = [
        { code: 'nl', label: use_locale_codes ? 'nl' : 'Nederlands' },
        { code: 'en', label: use_locale_codes ? 'en' : 'English' },
        { code: 'es', label: use_locale_codes ? 'es' : 'Español' },
        { code: 'fr', label: use_locale_codes ? 'fr' : 'Français' },
        { code: 'de', label: use_locale_codes ? 'de' : 'Deutsch' },
        { code: 'it', label: use_locale_codes ? 'it' : 'Italiano' },
        { code: 'pt', label: use_locale_codes ? 'pt' : 'Português' },
        { code: 'pl', label: use_locale_codes ? 'pl' : 'Polski' },
        { code: 'ru', label: use_locale_codes ? 'ru' : 'Русский' },
        { code: 'zh', label: use_locale_codes ? 'zh' : '中文' },
        { code: 'ja', label: use_locale_codes ? 'ja' : '日本語' }
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