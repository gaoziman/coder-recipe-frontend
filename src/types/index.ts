// src/types/index.ts
export interface IUser {
    id: number
    username: string
    email: string
    avatar?: string
}

export interface IMenuItem {
    key: string
    label: string
    icon?: string
    children?: IMenuItem[]
}