export interface IDish {
  ID: number
  CreatedAt: string
  UpdatedAt: string
  DeletedAt: string | null
  name: string
  img: string
  price: number
  have: boolean
  active: boolean

  vars: {
    ID: number
    rest_id: number
    price: number
    iiko_id: number
  }[]
}
