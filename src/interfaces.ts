export interface User {
  id: number
  name: string
  surname: string
  phone: string
  role: string
  status: string
  tolal_order: number
  bonuses: number
  last_update: string
}

export interface Dish {
  id: number
  name: string
  img: string
  price: number
  sale_price: number
}

export interface Review {
  id: number
  user: {
    id: number
    name: string
  }
  text: string
  status: string
  create_date: string
}

export interface Feedback {
  id: number
  user: {
    id: number
    name: string
  }
  text: string
  status: string
  create_date: string
}

export interface CreateDish {
  name: string
  description: string
  price: number
  sale_price: number
  img: string
  category: {
    name: string
    img: string
  }
  iiko_id: number
  count: number
  weight: number
  energy: number
  belki: number
  ziri: number
  uglevodi: number
  color: string
  size: number
  have: true
  can_deliver: true
  active: true
}

export interface UpdateDish extends CreateDish {
  id: number
}