import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enTranslations from './locales/en.canonical.json'
import nlTranslations from './locales/nl.translation.json'
import esTranslations from './locales/es.translation.json'
import frTranslations from './locales/fr.translation.json'
import deTranslations from './locales/de.translation.json'
import itTranslations from './locales/it.translation.json'
import ptTranslations from './locales/pt.translation.json'
import plTranslations from './locales/pl.translation.json'
import ruTranslations from './locales/ru.translation.json'
import zhTranslations from './locales/zh.translation.json'
import jaTranslations from './locales/ja.translation.json'

const STORAGE_KEY = 'ux-trails-lang'
const storedLanguage = typeof window !== 'undefined' ? window.localStorage.getItem( STORAGE_KEY ) : null

const resources = {
    en: { translation: enTranslations },
    nl: { translation: nlTranslations },
    es: { translation: esTranslations },
    fr: { translation: frTranslations },
    de: { translation: deTranslations },
    it: { translation: itTranslations },
    pt: { translation: ptTranslations },
    pl: { translation: plTranslations },
    ru: { translation: ruTranslations },
    zh: { translation: zhTranslations },
    ja: { translation: jaTranslations }
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
