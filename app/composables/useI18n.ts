/**
 * i18n Composable
 * Provides reactive translations based on current locale from settings store
 */

import { translations, type Locale, type TranslationKeys } from '../utils/i18n'

export const useI18n = () => {
    const settingsStore = useSettingsStore()

    // Reactive translation object based on current locale
    const t = computed<TranslationKeys>(() => {
        return translations[settingsStore.currentLocale as Locale]
    })

    // Get current locale
    const locale = computed(() => settingsStore.currentLocale)

    // Set locale
    const setLocale = (newLocale: Locale) => {
        settingsStore.setLocale(newLocale)
    }

    // Toggle between en and id
    const toggleLocale = () => {
        settingsStore.toggleLocale()
    }

    return {
        t,
        locale,
        setLocale,
        toggleLocale,
    }
}
