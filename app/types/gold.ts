export interface ITypePocket {
    id: string
    name: string
    description: string
    icon: string
    color: string
    createdAt: Date
    updatedAt: Date
}

export interface IPocket {
    id: string
    typePocketId: string
    name: string
    description: string
    aggregateTotalPrice: number
    aggregateTotalWeight: number
    targetWeight?: number
    createdAt: Date
    updatedAt: Date
}

export interface IPocketTransaction {
    id: string
    pocketId: string
    transactionDate: Date
    brand: string
    weight: number
    pricePerGram: number
    totalPrice: number
    description: string
    receiptImage?: string
    createdAt: Date
    updatedAt: Date
}
