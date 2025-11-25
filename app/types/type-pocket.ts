/**
 * Type Pocket - Categories for gold savings pockets
 */
export interface ITypePocket {
    id: string
    name: string
    description: string
    icon: string
    color: string
    createdAt: Date
    updatedAt: Date
}

export interface ITypePocketCreate {
    name: string
    description: string
    icon?: string
    color?: string
}

export interface ITypePocketUpdate extends Partial<ITypePocketCreate> {
    id: string
}
