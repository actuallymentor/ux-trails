import { useTranslation } from "react-i18next"
import styled from "styled-components"


const LanguageDropdownBase = styled.div`
    padding: 0!important;
    select {
        border: none;
        font-size: 1rem;
    }
`

export default function LanguageSelector( { ...props } ) {

    const { t, i18n } = useTranslation()
    const [ current_language ] = ( i18n.resolvedLanguage || i18n.language || 'nl' ).split( '-' )

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

    return <LanguageDropdownBase className='language_selector' { ...props }>
        <select name='language' value={ current_language } onChange={ handle_language_change }>
            { available_languages.map( ( { code, label } ) => <option value={ code } key={ code }>{ label }</option> ) }
        </select>
    </LanguageDropdownBase>

}