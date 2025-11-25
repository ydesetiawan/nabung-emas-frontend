/**
 * Mock data for development
 * This will be replaced with real API calls
 */

import type { ITypePocket } from '~/types/type-pocket'
import type { IPocket } from '~/types/pocket'
import type { ITransaction } from '~/types/transaction'
import { POCKET_TYPES } from './constants'

export const mockTypePockets: ITypePocket[] = [
    {
        id: '1',
        name: POCKET_TYPES.emergency.name,
        description: 'Gold savings for emergencies',
        icon: POCKET_TYPES.emergency.icon,
        color: POCKET_TYPES.emergency.color,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    },
    {
        id: '2',
        name: POCKET_TYPES.investment.name,
        description: 'Long-term gold investment',
        icon: POCKET_TYPES.investment.icon,
        color: POCKET_TYPES.investment.color,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    },
    {
        id: '3',
        name: POCKET_TYPES.wedding.name,
        description: 'Saving for wedding expenses',
        icon: POCKET_TYPES.wedding.icon,
        color: POCKET_TYPES.wedding.color,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    },
]

export const mockPockets: IPocket[] = [
    {
        id: '1',
        typePocketId: '1',
        name: 'My Emergency Stash',
        description: 'Quick access emergency gold',
        aggregateTotalPrice: 45000000,
        aggregateTotalWeight: 45.5,
        targetWeight: 100,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-11-20'),
    },
    {
        id: '2',
        typePocketId: '2',
        name: 'Long Term Gold',
        description: 'Buy and hold strategy',
        aggregateTotalPrice: 120000000,
        aggregateTotalWeight: 125.3,
        targetWeight: 200,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-11-18'),
    },
    {
        id: '3',
        typePocketId: '3',
        name: 'Wedding Fund',
        description: 'For the big day',
        aggregateTotalPrice: 25000000,
        aggregateTotalWeight: 25.0,
        targetWeight: 50,
        createdAt: new Date('2024-03-10'),
        updatedAt: new Date('2024-11-15'),
    },
]

export const mockTransactions: ITransaction[] = [
    {
        id: '1',
        pocketId: '1',
        transactionDate: new Date('2024-11-20'),
        brand: 'Antam',
        weight: 5,
        pricePerGram: 1050000,
        totalPrice: 5250000,
        description: 'Monthly purchase',
        createdAt: new Date('2024-11-20'),
        updatedAt: new Date('2024-11-20'),
    },
    {
        id: '2',
        pocketId: '2',
        transactionDate: new Date('2024-11-18'),
        brand: 'UBS',
        weight: 10,
        pricePerGram: 1045000,
        totalPrice: 10450000,
        description: 'Price dip opportunity',
        createdAt: new Date('2024-11-18'),
        updatedAt: new Date('2024-11-18'),
    },
    {
        id: '3',
        pocketId: '1',
        transactionDate: new Date('2024-11-15'),
        brand: 'Antam',
        weight: 2.5,
        pricePerGram: 1048000,
        totalPrice: 2620000,
        description: 'Small addition',
        createdAt: new Date('2024-11-15'),
        updatedAt: new Date('2024-11-15'),
    },
    {
        id: '4',
        pocketId: '3',
        transactionDate: new Date('2024-11-10'),
        brand: 'Pegadaian',
        weight: 5,
        pricePerGram: 1040000,
        totalPrice: 5200000,
        description: 'Wedding fund addition',
        createdAt: new Date('2024-11-10'),
        updatedAt: new Date('2024-11-10'),
    },
]
