/**
 * Pocket API Composable
 * Handles all pocket-related API calls
 */

import type { IPocket, IPocketCreate, IPocketWithRelations } from '~/types/pocket'
import type { IAPIResponse } from '~/types/api'
import { API_ENDPOINTS } from '~/utils/constants'

export const usePocketApi = () => {
    const { $api } = useNuxtApp()

    /**
     * Fetch all pockets
     */
    const fetchPockets = async (): Promise<IPocket[]> => {
        const response = await $api<IAPIResponse<IPocket[]>>(API_ENDPOINTS.pockets.list)
        return response.data
    }

    /**
     * Fetch a single pocket by ID
     */
    const fetchPocketById = async (id: string): Promise<IPocketWithRelations> => {
        const response = await $api<IAPIResponse<IPocketWithRelations>>(
            API_ENDPOINTS.pockets.getById(id)
        )
        return response.data
    }

    /**
     * Create a new pocket
     */
    const createPocket = async (data: IPocketCreate): Promise<IPocket> => {
        const response = await $api<IAPIResponse<IPocket>>(API_ENDPOINTS.pockets.create, {
            method: 'POST',
            body: data,
        })
        return response.data
    }

    /**
     * Update an existing pocket
     */
    const updatePocket = async (id: string, data: Partial<IPocketCreate>): Promise<IPocket> => {
        const response = await $api<IAPIResponse<IPocket>>(
            API_ENDPOINTS.pockets.update(id),
            {
                method: 'PATCH',
                body: data,
            }
        )
        return response.data
    }

    /**
     * Delete a pocket
     */
    const deletePocket = async (id: string): Promise<void> => {
        await $api(API_ENDPOINTS.pockets.delete(id), {
            method: 'DELETE',
        })
    }

    return {
        fetchPockets,
        fetchPocketById,
        createPocket,
        updatePocket,
        deletePocket,
    }
}
