import { useEffect, useState } from 'react'
import { fetchAllPlaces } from '../lib/placeAPI'
import type { Place } from '../types/planner_type'

export function usePlace(currentPlaceIds: number[] = []) {
  const [allPlaces, setAllPlaces] = useState<Place[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAllPlaces()
        setAllPlaces(data)
      } catch (e) {
        console.error('장소 불러오기 실패:', e)
      }
    }
    load()
  }, [])

  // 이미 플랜에 추가된 장소는 제외
  const availablePlaces = allPlaces.filter(
    (place) => !currentPlaceIds.includes(place.id),
  )

  return { allPlaces, availablePlaces }
}
