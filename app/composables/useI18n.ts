import { translations } from '~/utils/translations'

export type Locale = 'en' | 'id'

export const useI18n = () => {
    const locale = useLocalStorage<Locale>('locale', 'en')

    const t = computed(() => translations[locale.value])

    const setLocale = (newLocale: Locale) => {
        locale.value = newLocale
    }

    return {
        locale,
        setLocale,
        t
    }
}
