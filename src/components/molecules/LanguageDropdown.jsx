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
        { code: 'nl', label: use_locale_codes ? 'nl_NL.UTF-8' : 'Nederlands' },
        { code: 'en', label: use_locale_codes ? 'en_US.UTF-8' : 'English' },
        { code: 'es', label: use_locale_codes ? 'es_ES.UTF-8' : 'Español' },
        { code: 'fr', label: use_locale_codes ? 'fr_FR.UTF-8' : 'Français' },
        { code: 'de', label: use_locale_codes ? 'de_DE.UTF-8' : 'Deutsch' },
        { code: 'it', label: use_locale_codes ? 'it_IT.UTF-8' : 'Italiano' },
        { code: 'pt', label: use_locale_codes ? 'pt_PT.UTF-8' : 'Português' },
        { code: 'pl', label: use_locale_codes ? 'pl_PL.UTF-8' : 'Polski' },
        { code: 'ru', label: use_locale_codes ? 'ru_RU.UTF-8' : 'Русский' },
        { code: 'zh', label: use_locale_codes ? 'zh_CN.UTF-8' : '中文' },
        { code: 'ja', label: use_locale_codes ? 'ja_JP.UTF-8' : '日本語' }
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