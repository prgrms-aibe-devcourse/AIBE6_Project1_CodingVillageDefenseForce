import { createClient } from '@/lib/supabase/client'
import type { Place } from '../types/planner_type'

const supabase = createClient()

/** 전체 장소 목록 조회 */
export async function fetchAllPlaces(): Promise<Place[]> {
  const { data, error } = await supabase
    .from('place')
    .select('id, title, content, location, image, location_id')

  if (error) throw error
  return data ?? []
}
