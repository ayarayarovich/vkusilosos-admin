export interface ICreateCategory {
  name: string
}

export interface ICategory {
  ID: number,
  CreatedAt: string,
  UpdatedAt: string,
  DeletedAt: string | null,
  name: string,
  active: boolean
}

export interface IUpdateCategory {
  id: number
  name: string
}