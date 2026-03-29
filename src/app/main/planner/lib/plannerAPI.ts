import { createClient } from '@/lib/supabase/client'
import type { Planner, WritePlace } from '../types/planner_type'

const supabase = createClient()

/** 특정 유저의 플래너 목록 (장소 포함) 조회 */
export async function fetchPlannersByUserId(
  userId: number,
): Promise<Planner[]> {
  const { data, error } = await supabase
    .from('planner')
    .select(
      `*, place_planners:place_planner(
        id,
        place(id, title, content, location, image, location_id)
      )`,
    )
    .eq('user_id', userId)
    .order('id', { ascending: false })

  if (error) throw error
  return data ?? []
}

/** 플래너 삭제 (place_planner는 cascade로 자동 삭제) */
export async function deletePlanner(plannerId: number): Promise<void> {
  const { error } = await supabase.from('planner').delete().eq('id', plannerId)

  if (error) throw error
}

/** 플래너에 장소 추가 */
export async function addPlaceToPlanner(
  plannerId: number,
  placeId: number,
): Promise<void> {
  const { error } = await supabase
    .from('place_planner')
    .insert([{ planner_id: plannerId, place_id: placeId }])

  if (error) throw error
}

/** 플래너에서 장소 제거 (place_planner row 삭제) */
export async function removePlaceFromPlanner(
  placePlannerId: number,
): Promise<void> {
  const { error } = await supabase
    .from('place_planner')
    .delete()
    .eq('id', placePlannerId)

  if (error) throw error
}

export interface PlanFormData {
  title: string
  content: string
  startDate: string
  endDate: string
  people: number | null
  budget: number | null
}

/** 편집 시 기존 플래너 데이터 + 연결된 장소 조회 */
export async function fetchPlannerForEdit(editId: string): Promise<{
  formData: PlanFormData
  places: WritePlace[]
}> {
  const { data, error } = await supabase
    .from('planner')
    .select(
      `*, place_planners:place_planner(place:place_id(id, title, location, image))`,
    )
    .eq('id', editId)
    .single()

  if (error) throw error

  const places = (data.place_planners ?? [])
    .map((pp: any) => pp.place)
    .filter(Boolean)

  return {
    formData: {
      title: data.title ?? '',
      content: data.content ?? '',
      startDate: data.start_date ?? '',
      endDate: data.end_date ?? '',
      people: data.people ?? null,
      budget: data.budget ?? null,
    },
    places,
  }
}

/** 플래너 생성 또는 수정 후 연결 장소까지 한 번에 저장 */
export async function upsertPlanner(
  userId: number,
  formData: PlanFormData,
  selectedPlaces: WritePlace[],
  editId?: string,
): Promise<void> {
  const planData = {
    user_id: userId,
    title: formData.title,
    content: formData.content || null,
    start_date: formData.startDate || null,
    end_date: formData.endDate || null,
    people: formData.people,
    budget: formData.budget,
  }

  let currentPlannerId: string | number | undefined = editId

  if (editId) {
    const { error } = await supabase
      .from('planner')
      .update(planData)
      .eq('id', editId)
    if (error) throw error

    // 기존 장소 연결 초기화 후 재삽입
    await supabase.from('place_planner').delete().eq('planner_id', editId)
  } else {
    const { data: newPlanner, error } = await supabase
      .from('planner')
      .insert([planData])
      .select()
      .single()
    if (error) throw error
    currentPlannerId = newPlanner.id
  }

  if (selectedPlaces.length > 0) {
    const rows = selectedPlaces.map((p) => ({
      planner_id: currentPlannerId,
      place_id: p.id,
    }))
    const { error } = await supabase.from('place_planner').insert(rows)
    if (error) throw error
  }
}
