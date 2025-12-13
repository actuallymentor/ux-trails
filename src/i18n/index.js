import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enTranslations from './locales/en.canonical.json'
import nlTranslations from './locales/nl.translation.json'
import esTranslations from './locales/es.translation.json'
import zhTranslations from './locales/zh.translation.json'

const STORAGE_KEY = 'ux-trails-lang'
const storedLanguage = typeof window !== 'undefined' ? window.localStorage.getItem( STORAGE_KEY ) : null

const resources = {
    en: { translation: enTranslations },
    nl: { translation: nlTranslations },
    es: { translation: esTranslations },
    zh: { translation: zhTranslations }
}

i18n
    .use( initReactI18next )
    .init( {
        resources,
        lng: storedLanguage || 'nl',
        fallbackLng: 'en',
        supportedLngs: Object.keys( resources ),
        defaultNS: 'translation',
        interpolation: {
            escapeValue: false
        }
    } )

// Persist language changes for future sessions
i18n.on( 'languageChanged', language => {
    if( typeof window === 'undefined' ) return
    window.localStorage.setItem( STORAGE_KEY, language )
} )

export default i18n
