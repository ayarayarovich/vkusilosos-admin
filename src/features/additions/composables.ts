import { axiosPrivate } from '@/network'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { useToast } from 'primevue/usetoast'
import type { IAddition } from './interfaces'
import type { MaybeRef } from 'vue'
import type { ITag } from '@/features/tags'
import { useAdditionsCategory } from '@/features/categories'

interface GetAdditionsResponse {
    list: IAddition[]
    total: number
}

interface QueryConfig {
    offset: MaybeRef<number>
    limit: MaybeRef<number>
    search: MaybeRef<string>
}

export const useAdditions = <SData>(
    queryConfig: QueryConfig,
    selector?: (response: GetAdditionsResponse) => SData
) => {
    const { offset, limit, search } = queryConfig
    return useQuery({
        queryKey: ['additions', { offset, limit, search }] as any,
        queryFn: async ({ queryKey }) => {
            const response = await axiosPrivate.get<GetAdditionsResponse>('admin/adds', {
                params: {
                    offset: (queryKey[1] as any).offset as number,
                    limit: (queryKey[1] as any).limit as number,
                    search: (queryKey[1] as any).search as string
                }
            })
            return response.data
        },
        select: selector,
        keepPreviousData: true
    })
}

interface GetAdditionResponse {
    category: number
    count: number
    created_at: string
    deleted_at: string | null
    id: number
    img: string
    name: string
    price: number
    updated_at: string
    weight: number
}

export const useAddition = <SData>(
    id: MaybeRef<number>,
    selector?: (response: IAddition) => SData
) => {
    return useQuery({
        queryKey: ['additions', { id }] as any,
        queryFn: async ({ queryKey }) => {
            const response = await axiosPrivate.get<GetAdditionResponse>('admin/dish', {
                params: {
                    id: (queryKey[1] as any).id as number
                }
            })

            return response.data
        },
        select: selector,
        keepPreviousData: true
    })
}

export const useCreateAddition = () => {
    const toast = useToast()
    const queryClient = useQueryClient()
    const { data: additionsCategory } = useAdditionsCategory()

    return useMutation({
        mutationFn: async (vars: any) => {
            const response = await axiosPrivate.post('admin/dish', {
                iiko_id: 'null',
                from_hour: 1,
                to_hour: 1,
                description: 'null',
                vars: [],
                pich_cen: 1,
                belki: 1,
                ziri: 1,
                uglevodi: 1,
                color: 1,
                size: 1,
                category: additionsCategory.value?.id,
                ...vars
            })
            return response
        },
        onSuccess(_, vars) {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Добавлена добавка ${vars.name}`
            })
            queryClient.invalidateQueries(['additions'])
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось создать добавку',
                detail: error
            })
        }
    })
}

export const useUpdateAddition = () => {
    const toast = useToast()
    const queryClient = useQueryClient()
    const { data: additionsCategory } = useAdditionsCategory()

    return useMutation({
        mutationFn: async (vars: any) => {
            const response = await axiosPrivate.put('admin/dish', {
                iiko_id: 'null',
                from_hour: 1,
                to_hour: 1,
                description: 'null',
                vars: [],
                pich_cen: 1,
                belki: 1,
                ziri: 1,
                uglevodi: 1,
                color: 1,
                size: 1,
                category: additionsCategory.value?.id,
                ...vars
            })
            return response
        },
        onSuccess(_, vars) {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Обновлена добавка ${vars.name}`
            })
            queryClient.invalidateQueries(['additions'])
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось обновить добавку',
                detail: error
            })
        }
    })
}
