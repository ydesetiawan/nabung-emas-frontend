/**
 * Transaction Store - Following Pinia setup store pattern
 * Manages transaction state and operations
 */

import type { ITransaction, ITransactionCreate, ITransactionWithPocket } from '~/types/transaction'

export const useTransactionStore = defineStore('transaction', () => {
    const transactionApi = useTransactionApi()
    const pocketStore = usePocketStore()

    // State - no localStorage persistence
    const transactions = ref<ITransaction[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // Computed - filter by selected pocket
    const pocketTransactions = computed(() => {
        if (!pocketStore.selectedPocketId) return []
        return transactions.value.filter(
            t => t.pocketId === pocketStore.selectedPocketId
        )
    })

    const sortedTransactions = computed(() => {
        return [...transactions.value].sort(
            (a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
        )
    })

    const recentTransactions = computed(() => {
        return sortedTransactions.value.slice(0, 5)
    })

    const transactionCount = computed(() => transactions.value.length)

    // Actions
    async function fetchTransactions(pocketId?: string) {
        isLoading.value = true
        error.value = null

        try {
            transactions.value = await transactionApi.fetchTransactions(pocketId)
        } catch (err: any) {
            error.value = err.message || 'Failed to fetch transactions'
            console.error('Failed to fetch transactions:', err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    async function fetchTransactionById(id: string): Promise<ITransactionWithPocket | null> {
        try {
            return await transactionApi.fetchTransactionById(id)
        } catch (err: any) {
            console.error('Failed to fetch transaction:', err)
            return null
        }
    }

    async function createTransaction(data: ITransactionCreate): Promise<ITransaction | null> {
        try {
            const newTransaction = await transactionApi.createTransaction(data)
            transactions.value.push(newTransaction)

            // Refresh pocket to update aggregates
            await pocketStore.fetchPockets()

            return newTransaction
        } catch (err: any) {
            error.value = err.message || 'Failed to create transaction'
            console.error('Failed to create transaction:', err)
            throw err
        }
    }

    async function updateTransaction(
        id: string,
        data: Partial<ITransactionCreate>
    ): Promise<ITransaction | null> {
        try {
            const updatedTransaction = await transactionApi.updateTransaction(id, data)

            const index = transactions.value.findIndex(t => t.id === id)
            if (index !== -1) {
                transactions.value[index] = updatedTransaction
            }

            // Refresh pocket aggregates
            await pocketStore.fetchPockets()

            return updatedTransaction
        } catch (err: any) {
            error.value = err.message || 'Failed to update transaction'
            console.error('Failed to update transaction:', err)
            throw err
        }
    }

    async function deleteTransaction(id: string): Promise<boolean> {
        try {
            await transactionApi.deleteTransaction(id)
            transactions.value = transactions.value.filter(t => t.id !== id)

            // Refresh pocket aggregates
            await pocketStore.fetchPockets()

            return true
        } catch (err: any) {
            error.value = err.message || 'Failed to delete transaction'
            console.error('Failed to delete transaction:', err)
            throw err
        }
    }

    function clear() {
        transactions.value = []
        isLoading.value = false
        error.value = null
    }

    return {
        // State
        transactions: readonly(transactions),
        isLoading: readonly(isLoading),
        error: readonly(error),

        // Computed
        pocketTransactions,
        sortedTransactions,
        recentTransactions,
        transactionCount,

        // Actions
        fetchTransactions,
        fetchTransactionById,
        createTransaction,
        updateTransaction,
        deleteTransaction,
        clear,
    }
})
