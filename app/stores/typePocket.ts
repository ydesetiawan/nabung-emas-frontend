/**
 * Type Pocket Store - Following Pinia setup store pattern
 * Manages pocket type/category state and operations
 */

import type { ITypePocket } from '~/types/type-pocket'
import type { IAPIResponse } from '~/types/api'
import { API_ENDPOINTS } from '~/utils/constants'

export const useTypePocketStore = defineStore('typePocket', () => {
    const { $publicApi } = useNuxtApp()

    // State with localStorage persistence for caching
    const typePockets = useLocalStorage<ITypePocket[]>('gold.typePockets', [])
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const lastFetched = useLocalStorage<number | null>('gold.typePockets.lastFetched', null)

    // Cache duration: 1 hour
    const CACHE_DURATION = 60 * 60 * 1000

    // Computed
    const typePocketList = computed(() => typePockets.value)

    const typePocketById = computed(() => {
        return (id: string) => typePockets.value.find(tp => tp.id === id)
    })

    const isCacheValid = computed(() => {
        if (!lastFetched.value) return false
        return Date.now() - lastFetched.value < CACHE_DURATION
    })

    // Actions

    /**
     * Fetch all type pockets (categories)
     * Uses cache if valid, otherwise fetches from API
     */
    async function fetchTypePockets(forceRefresh = false): Promise<void> {
        // Return cached data if valid and not forcing refresh
        if (!forceRefresh && isCacheValid.value && typePockets.value.length > 0) {
            return
        }

        isLoading.value = true
        error.value = null

        try {
            const response = await $publicApi<IAPIResponse<ITypePocket[]>>(
                API_ENDPOINTS.typePockets.list
            )

            typePockets.value = response.data
            lastFetched.value = Date.now()
        } catch (err: any) {
            error.value = err.message || 'Failed to fetch pocket types'
            console.error('Failed to fetch type pockets:', err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Fetch a specific type pocket by ID
     */
    async function fetchTypePocketById(id: string): Promise<ITypePocket | null> {
        // Check cache first
        const cached = typePocketById.value(id)
        if (cached) {
            return cached
        }

        try {
            const response = await $publicApi<IAPIResponse<ITypePocket>>(
                API_ENDPOINTS.typePockets.getById(id)
            )

            // Add to cache if not already present
            const index = typePockets.value.findIndex(tp => tp.id === id)
            if (index === -1) {
                typePockets.value.push(response.data)
            }

            return response.data
        } catch (err: any) {
            console.error('Failed to fetch type pocket:', err)
            return null
        }
    }

    /**
     * Get type pocket by ID from cache (synchronous)
     */
    function getTypePocketById(id: string): ITypePocket | undefined {
        return typePockets.value.find(tp => tp.id === id)
    }

    /**
     * Clear cache and force refresh on next fetch
     */
    function clearCache() {
        lastFetched.value = null
    }

    /**
     * Clear all state
     */
    function clear() {
        typePockets.value = []
        lastFetched.value = null
        isLoading.value = false
        error.value = null
    }

    return {
        // State (readonly for external access)
        typePockets: readonly(typePockets),
        isLoading: readonly(isLoading),
        error: readonly(error),

        // Computed
        typePocketList,
        typePocketById,
        isCacheValid,

        // Actions
        fetchTypePockets,
        fetchTypePocketById,
        getTypePocketById,
        clearCache,
        clear,
    }
})
