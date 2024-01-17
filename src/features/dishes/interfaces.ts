import type { ITag } from '@/features/tags'

export interface IDish {
    active: boolean
    belki: number
    can_deliver: boolean
    category: number
    color: number
    count: number
    created_at: string
    deleted_at: string | null
    description: string
    energ_cen: number
    from_hour: number
    have: boolean
    id: number
    iiko_id: string
    img: string
    name: string
    pich_cen: number
    price: number
    size: number
    to_hour: number
    uglevodi: number
    updated_at: string
    weight: number
    ziri: number

    tags: ITag[]

    variations: {
        id: number
        rest_id: number
        rest_name: string
        rest_address: string
        price: number
        active: boolean
        can_deliver: boolean
        have: boolean
    }[]
}
