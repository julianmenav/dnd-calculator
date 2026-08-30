import 'i18next'
import type en from './locales/en'

/** Makes every t() key checked against the English locale at compile time. */
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: typeof en
    }
  }
}
