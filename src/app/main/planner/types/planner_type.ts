export interface WritePlace {
  id: number
  title: string
  location: string
  image: string
}

export interface Place extends WritePlace {
  content: string
  location_id: number
}

export interface PlacePlanner {
  id: number
  place: Place
}

export interface Planner {
  id: number
  user_id: number
  title: string
  content: string
  start_date: string
  end_date: string
  budget: number
  people: number
  place_planners: PlacePlanner[]
}

export interface DBUser {
  id: number
}
