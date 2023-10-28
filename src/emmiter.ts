import mitt, { type Emitter } from 'mitt'

type Events = {
  'Dishes.Edit': {
    id: number
    name: string
  }

  'Dishes.Delete': {
    id: number
    name: string
  }

  'Categories.Edit': {
    id: number
    name: string
  }
}

const emitter: Emitter<Events> = mitt<Events>()

export default emitter
