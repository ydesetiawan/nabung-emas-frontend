/**
 * Settings Store - Following Pinia setup store pattern
 * Manages application settings including locale and dark mode
 */

import type { Locale } from '~/utils/i18n'
import { STORAGE_KEYS } from '~/utils/constants'

export const useSettingsStore = defineStore('settings', () => {
    // State with localStorage persistence
    const locale = useLocalStorage<Locale>(STORAGE_KEYS.locale, 'en')
    const isDarkMode = useLocalStorage<boolean>(STORAGE_KEYS.darkMode, false)

    // Computed
    const currentLocale = computed(() => locale.value)
    const isDark = computed(() => isDarkMode.value)

    // Actions
    function setLocale(newLocale: Locale) {
        locale.value = newLocale
    }

    function toggleLocale() {
        locale.value = locale.value === 'en' ? 'id' : 'en'
    }

    function setDarkMode(dark: boolean) {
        isDarkMode.value = dark
        applyDarkMode(dark)
    }

    function toggleDarkMode() {
        isDarkMode.value = !isDarkMode.value
        applyDarkMode(isDarkMode.value)
    }

    function applyDarkMode(dark: boolean) {
        if (typeof document !== 'undefined') {
            if (dark) {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }
        }
    }

    // Initialize dark mode on store creation
    function initialize() {
        applyDarkMode(isDarkMode.value)
    }

    return {
        // State (readonly for external access)
        locale: readonly(locale),
        isDarkMode: readonly(isDarkMode),

        // Computed
        currentLocale,
        isDark,

        // Actions
        setLocale,
        toggleLocale,
        setDarkMode,
        toggleDarkMode,
        initialize,
    }
})
