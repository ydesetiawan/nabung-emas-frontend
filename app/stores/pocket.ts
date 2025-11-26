/**
 * Pocket Store - Following Pinia setup store pattern
 * Manages pocket state and operations
 */

import type { IPocket, IPocketCreate, IPocketUpdate, IPocketWithRelations } from '~/types/pocket'

export const usePocketStore = defineStore('pocket', () => {
    const pocketApi = usePocketApi()

    // State - no localStorage persistence
    const pockets = ref<IPocket[]>([])
    const selectedPocketId = ref<string | null>(null)
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
            pockets.value = await pocketApi.fetchPockets()
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
            return await pocketApi.fetchPocketById(id)
        } catch (err: any) {
            console.error('Failed to fetch pocket:', err)
            return null
        }
    }

    async function createPocket(data: IPocketCreate): Promise<IPocket | null> {
        try {
            const newPocket = await pocketApi.createPocket(data)
            pockets.value.push(newPocket)
            return newPocket
        } catch (err: any) {
            error.value = err.message || 'Failed to create pocket'
            console.error('Failed to create pocket:', err)
            throw err
        }
    }

    async function updatePocket(id: string, data: Partial<IPocketCreate>): Promise<IPocket | null> {
        try {
            const updatedPocket = await pocketApi.updatePocket(id, data)

            const index = pockets.value.findIndex(p => p.id === id)
            if (index !== -1) {
                pockets.value[index] = updatedPocket
            }

            return updatedPocket
        } catch (err: any) {
            error.value = err.message || 'Failed to update pocket'
            console.error('Failed to update pocket:', err)
            throw err
        }
    }

    async function deletePocket(id: string): Promise<boolean> {
        try {
            await pocketApi.deletePocket(id)
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
