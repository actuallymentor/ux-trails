import { useTranslation } from "react-i18next"
import styled from "styled-components"


const LanguageDropdownBase = styled.div`
    padding: 0!important;
    select {
        border: none;
        font-size: 1.5rem;
    }
`

export default function LanguageSelector( { ...props } ) {

    const { t, i18n } = useTranslation()
    const [ current_language ] = ( i18n.resolvedLanguage || i18n.language || 'nl' ).split( '-' )

    const available_languages = [
        { code: 'nl', label: `🇳🇱` },
        { code: 'en', label: `🇬🇧` },
        { code: 'es', label: `🇪🇸` },
        { code: 'fr', label: `🇫🇷` },
        { code: 'de', label: `🇩🇪` },
        { code: 'it', label: `🇮🇹` },
        { code: 'pt', label: `🇵🇹` },
        { code: 'pl', label: `🇵🇱` },
        { code: 'ru', label: `🇷🇺` },
        { code: 'zh', label: `🇨🇳` },
        { code: 'ja', label: `🇯🇵` }
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