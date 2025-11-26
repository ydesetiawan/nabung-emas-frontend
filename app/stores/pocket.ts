/**
 * Pocket Store - Following Pinia setup store pattern
 * Manages pocket state and operations
 */

import type { IPocket, IPocketCreate, IPocketUpdate, IPocketWithRelations } from '~/types/pocket'
import type { IAPIResponse } from '~/types/api'
import { STORAGE_KEYS, API_ENDPOINTS } from '~/utils/constants'

export const usePocketStore = defineStore('pocket', () => {
    const { $api } = useNuxtApp()

    // State with localStorage persistence
    const pockets = useLocalStorage<IPocket[]>(STORAGE_KEYS.pockets, [])
    const selectedPocketId = useLocalStorage<string | null>(STORAGE_KEYS.selectedPocketId, null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // Computed properties
    const selectedPocket = computed(() => {
        return pockets.value.find(p => p.id === selectedPocketId.value) ?? null
    })

    const totalGoldWeight = computed(() => {
        return pockets.value.reduce((sum, p) => sum + p.aggregateTotalWeight, 0)
    })

    const totalInvestedValue = computed(() => {
        return pockets.value.reduce((sum, p) => sum + p.aggregateTotalPrice, 0)
    })

    const pocketCount = computed(() => pockets.value.length)

    // Actions
    async function fetchPockets() {
        isLoading.value = true
        error.value = null

        try {
            const response = await $api<IAPIResponse<IPocket[]>>(API_ENDPOINTS.pockets.list)
            pockets.value = response.data
        } catch (err: any) {
            error.value = err.message || 'Failed to fetch pockets'
            console.error('Failed to fetch pockets:', err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    async function fetchPocketById(id: string): Promise<IPocketWithRelations | null> {
        try {
            const response = await $api<IAPIResponse<IPocketWithRelations>>(
                API_ENDPOINTS.pockets.getById(id)
            )
            return response.data
        } catch (err: any) {
            console.error('Failed to fetch pocket:', err)
            return null
        }
    }

    async function createPocket(data: IPocketCreate): Promise<IPocket | null> {
        try {
            const response = await $api<IAPIResponse<IPocket>>(API_ENDPOINTS.pockets.create, {
                method: 'POST',
                body: data,
            })

            pockets.value.push(response.data)
            return response.data
        } catch (err: any) {
            error.value = err.message || 'Failed to create pocket'
            console.error('Failed to create pocket:', err)
            throw err
        }
    }

    async function updatePocket(id: string, data: Partial<IPocketCreate>): Promise<IPocket | null> {
        try {
            const response = await $api<IAPIResponse<IPocket>>(
                API_ENDPOINTS.pockets.update(id),
                {
                    method: 'PATCH',
                    body: data,
                }
            )

            const index = pockets.value.findIndex(p => p.id === id)
            if (index !== -1) {
                pockets.value[index] = response.data
            }

            return response.data
        } catch (err: any) {
            error.value = err.message || 'Failed to update pocket'
            console.error('Failed to update pocket:', err)
            throw err
        }
    }

    async function deletePocket(id: string): Promise<boolean> {
        try {
            await $api(API_ENDPOINTS.pockets.delete(id), {
                method: 'DELETE',
            })

            pockets.value = pockets.value.filter(p => p.id !== id)

            if (selectedPocketId.value === id) {
                selectedPocketId.value = null
            }

            return true
        } catch (err: any) {
            error.value = err.message || 'Failed to delete pocket'
            console.error('Failed to delete pocket:', err)
            throw err
        }
    }

    function selectPocket(id: string | null) {
        selectedPocketId.value = id
    }

    function clear() {
        pockets.value = []
        selectedPocketId.value = null
        isLoading.value = false
        error.value = null
    }

    return {
        // State (readonly for external access)
        pockets: readonly(pockets),
        selectedPocketId: readonly(selectedPocketId),
        isLoading: readonly(isLoading),
        error: readonly(error),

        // Computed
        selectedPocket,
        totalGoldWeight,
        totalInvestedValue,
        pocketCount,

        // Actions
        fetchPockets,
        fetchPocketById,
        createPocket,
        updatePocket,
        deletePocket,
        selectPocket,
        clear,
    }
})
