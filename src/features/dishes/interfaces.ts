export interface IDish {
  id: number
  created_at: string
  updated_at: string
  deleted_at: string | null
  name: string
  img: string
  price: number
  have: boolean
  active: boolean

  vars: {
    id: number
    rest_id: number
    price: number
    iiko_id: string
  }[]
}
