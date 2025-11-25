import type { ITypePocket } from './type-pocket'

/**
 * Pocket - Individual gold savings accounts
 */
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

export interface IPocketCreate {
    typePocketId: string
    name: string
    description?: string
    targetWeight?: number
}

export interface IPocketUpdate extends Partial<IPocketCreate> {
    id: string
}

/**
 * Extended pocket with relations
 */
export interface IPocketWithRelations extends IPocket {
    typePocket: ITypePocket
    transactionCount: number
}

/**
 * Pocket statistics
 */
export interface IPocketStats {
    totalWeight: number
    totalValue: number
    averagePricePerGram: number
    currentValue: number
    profitLoss: number
    profitLossPercentage: number
}
