/**
 * Dark Mode Composable
 * Provides reactive dark mode state and controls
 */

export const useDarkMode = () => {
    const settingsStore = useSettingsStore()

    // Reactive dark mode state
    const isDark = computed(() => settingsStore.isDark)

    // Set dark mode
    const setDarkMode = (dark: boolean) => {
        settingsStore.setDarkMode(dark)
    }

    // Toggle dark mode
    const toggleDarkMode = () => {
        settingsStore.toggleDarkMode()
    }

    return {
        isDark,
        setDarkMode,
        toggleDarkMode,
    }
}
