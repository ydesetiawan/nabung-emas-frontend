import type { ITypePocket, IPocket, IPocketTransaction } from '~/types/gold'

export const typePockets: ITypePocket[] = [
    {
        id: "1",
        name: "Emergency Fund",
        description: "Gold savings for emergencies",
        icon: "shield",
        color: "blue",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
    },
    {
        id: "2",
        name: "Investment",
        description: "Long-term gold investment",
        icon: "trending-up",
        color: "gold",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
    },
    {
        id: "3",
        name: "Wedding Savings",
        description: "Saving for wedding expenses",
        icon: "heart",
        color: "pink",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
    },
    {
        id: "4",
        name: "Education",
        description: "Children education fund",
        icon: "graduation-cap",
        color: "green",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
    },
]

export const pockets: IPocket[] = [
    {
        id: "1",
        typePocketId: "1",
        name: "My Emergency Stash",
        description: "Quick access emergency gold",
        aggregateTotalPrice: 45000000,
        aggregateTotalWeight: 45.5,
        targetWeight: 100,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-11-20"),
    },
    {
        id: "2",
        typePocketId: "2",
        name: "Long Term Gold",
        description: "Buy and hold strategy",
        aggregateTotalPrice: 120000000,
        aggregateTotalWeight: 125.3,
        targetWeight: 200,
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date("2024-11-18"),
    },
    {
        id: "3",
        typePocketId: "3",
        name: "Wedding Fund",
        description: "For the big day",
        aggregateTotalPrice: 25000000,
        aggregateTotalWeight: 25.0,
        targetWeight: 50,
        createdAt: new Date("2024-03-10"),
        updatedAt: new Date("2024-11-15"),
    },
]

export const transactions: IPocketTransaction[] = [
    {
        id: "1",
        pocketId: "1",
        transactionDate: new Date("2024-11-20"),
        brand: "Antam",
        weight: 5,
        pricePerGram: 1050000,
        totalPrice: 5250000,
        description: "Monthly purchase",
        createdAt: new Date("2024-11-20"),
        updatedAt: new Date("2024-11-20"),
    },
    {
        id: "2",
        pocketId: "2",
        transactionDate: new Date("2024-11-18"),
        brand: "UBS",
        weight: 10,
        pricePerGram: 1045000,
        totalPrice: 10450000,
        description: "Price dip opportunity",
        createdAt: new Date("2024-11-18"),
        updatedAt: new Date("2024-11-18"),
    },
    {
        id: "3",
        pocketId: "1",
        transactionDate: new Date("2024-11-15"),
        brand: "Antam",
        weight: 2.5,
        pricePerGram: 1048000,
        totalPrice: 2620000,
        description: "Small addition",
        createdAt: new Date("2024-11-15"),
        updatedAt: new Date("2024-11-15"),
    },
    {
        id: "4",
        pocketId: "3",
        transactionDate: new Date("2024-11-10"),
        brand: "Pegadaian",
        weight: 5,
        pricePerGram: 1040000,
        totalPrice: 5200000,
        description: "Wedding fund addition",
        createdAt: new Date("2024-11-10"),
        updatedAt: new Date("2024-11-10"),
    },
    {
        id: "5",
        pocketId: "2",
        transactionDate: new Date("2024-10-25"),
        brand: "Antam",
        weight: 25,
        pricePerGram: 1035000,
        totalPrice: 25875000,
        description: "Major investment",
        createdAt: new Date("2024-10-25"),
        updatedAt: new Date("2024-10-25"),
    },
]

export const goldBrands = ["Antam", "UBS", "Pegadaian", "King Halim", "Other"]

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

export function formatWeight(weight: number): string {
    return `${weight.toFixed(2)}g`
}

export function formatNumber(num: number): string {
    return new Intl.NumberFormat("id-ID").format(num)
}

export function getTypePocket(id: string): ITypePocket | undefined {
    return typePockets.find((t) => t.id === id)
}

export function getPocketTransactions(pocketId: string): IPocketTransaction[] {
    return transactions.filter((t) => t.pocketId === pocketId)
}

export function calculatePortfolioStats() {
    const totalWeight = pockets.reduce((sum, p) => sum + p.aggregateTotalWeight, 0)
    const totalInvested = pockets.reduce((sum, p) => sum + p.aggregateTotalPrice, 0)
    const avgPricePerGram = totalWeight > 0 ? totalInvested / totalWeight : 0
    const currentPricePerGram = 1055000 // This would come from API in real app
    const currentValue = totalWeight * currentPricePerGram
    const profitLoss = currentValue - totalInvested
    const profitLossPercent = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0

    return {
        totalWeight,
        totalInvested,
        avgPricePerGram,
        currentPricePerGram,
        currentValue,
        profitLoss,
        profitLossPercent,
        pocketCount: pockets.length,
        transactionCount: transactions.length,
    }
}
