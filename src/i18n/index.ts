import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en'
import es from './locales/es'

export const LANGUAGES = ['es', 'en'] as const
export type Language = (typeof LANGUAGES)[number]

const STORAGE_KEY = 'dnd-language'

/** localStorage can throw (private mode, blocked storage); never fatal. */
const storedLanguage = (): Language | null => {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return LANGUAGES.find((language) => language === value) ?? null
  } catch {
    return null
  }
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
  lng: storedLanguage() ?? 'es',
  fallbackLng: 'es',
  // React already escapes interpolated values.
  interpolation: { escapeValue: false },
})

/** Keep what lives outside the React tree — tab title, <html lang> — in step. */
const syncDocument = () => {
  document.documentElement.lang = i18n.language
  document.title = i18n.t('app.docTitle')
}

i18n.on('languageChanged', (language) => {
  try {
    localStorage.setItem(STORAGE_KEY, language)
  } catch {
    // The choice just won't survive a reload.
  }
  syncDocument()
})

syncDocument()

export default i18n
