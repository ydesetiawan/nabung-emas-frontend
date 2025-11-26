/**
 * Transaction API Composable
 * Handles all transaction-related API calls
 */

import type { ITransaction, ITransactionCreate, ITransactionWithPocket } from '~/types/transaction'
import type { IAPIResponse } from '~/types/api'
import { API_ENDPOINTS } from '~/utils/constants'

export const useTransactionApi = () => {
    const { $api } = useNuxtApp()

    /**
     * Fetch all transactions, optionally filtered by pocket
     */
    const fetchTransactions = async (pocketId?: string): Promise<ITransaction[]> => {
        const url = pocketId
            ? `${API_ENDPOINTS.transactions.list}?pocket_id=${pocketId}`
            : API_ENDPOINTS.transactions.list

        const response = await $api<IAPIResponse<ITransaction[]>>(url)
        return response.data
    }

    /**
     * Fetch a single transaction by ID
     */
    const fetchTransactionById = async (id: string): Promise<ITransactionWithPocket> => {
        const response = await $api<IAPIResponse<ITransactionWithPocket>>(
            API_ENDPOINTS.transactions.getById(id)
        )
        return response.data
    }

    /**
     * Create a new transaction
     */
    const createTransaction = async (data: ITransactionCreate): Promise<ITransaction> => {
        const response = await $api<IAPIResponse<ITransaction>>(
            API_ENDPOINTS.transactions.create,
            {
                method: 'POST',
                body: data,
            }
        )
        return response.data
    }

    /**
     * Update an existing transaction
     */
    const updateTransaction = async (
        id: string,
        data: Partial<ITransactionCreate>
    ): Promise<ITransaction> => {
        const response = await $api<IAPIResponse<ITransaction>>(
            API_ENDPOINTS.transactions.update(id),
            {
                method: 'PATCH',
                body: data,
            }
        )
        return response.data
    }

    /**
     * Delete a transaction
     */
    const deleteTransaction = async (id: string): Promise<void> => {
        await $api(API_ENDPOINTS.transactions.delete(id), {
            method: 'DELETE',
        })
    }

    return {
        fetchTransactions,
        fetchTransactionById,
        createTransaction,
        updateTransaction,
        deleteTransaction,
    }
}
