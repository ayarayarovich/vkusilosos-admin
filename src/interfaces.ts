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
  name: string | undefined
  description: string | undefined
  price: number | undefined
  sale_price: number | undefined
  img: string | undefined
  category_id: number | undefined
  iiko_id: number | undefined
  count: number | undefined
  weight: number | undefined
  energy: number | undefined
  belki: number | undefined
  ziri: number | undefined
  uglevodi: number | undefined
  color: string | undefined
  size: number | undefined
  have: boolean | undefined
  can_deliver: boolean | undefined
  active: boolean | undefined
}

export interface UpdateDish extends CreateDish {
  id: number
}

export interface CreateCategory {
  name: string
}

export interface Category {
  id: number
  name: string
  count_dishes: number
}

export interface UpdateCategory {
  id: number
  name: string
}

export interface CreateRestaurant {
    name: string,
    address: string,
    lat: number,
    lon: number,
    geojson: string
}

export interface Restaurant {
  id: number
  name: string
  address: string
}

export interface UpdateRestaurant {
  name: string,
  address: string,
  lat: number,
  lon: number,
  geojson: string
}


export interface CreateTag {
  name: string;
  dishes: number[];
}

export interface UpdateTag {
  id: number;
  name: string;
  dishes: number[];
}

export interface Tag {
  id: number;
  name: string;
  count_dishes: number;
  dishes: Category[];
}
