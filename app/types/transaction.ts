/**
 * Transaction - Gold purchase transactions
 */
export interface ITransaction {
    id: string
    pocketId: string
    transactionDate: Date
    brand: string
    weight: number
    pricePerGram: number
    totalPrice: number
    description?: string
    receiptImage?: string
    createdAt: Date
    updatedAt: Date
}

export interface ITransactionCreate {
    pocketId: string
    transactionDate: string | Date
    brand: string
    weight: number
    pricePerGram: number
    totalPrice: number
    description?: string
    receiptImage?: string
}

export interface ITransactionUpdate extends Partial<ITransactionCreate> {
    id: string
}

/**
 * Transaction with pocket info
 */
export interface ITransactionWithPocket extends ITransaction {
    pocket: {
        id: string
        name: string
        typePocketId: string
    }
}
