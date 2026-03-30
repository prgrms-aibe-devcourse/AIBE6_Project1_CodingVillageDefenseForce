import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import {
  fetchPlannerForEdit,
  upsertPlanner,
  type PlanFormData,
} from '../lib/plannerAPI'
import type { WritePlace } from '../types/planner_type'

const supabase = createClient()

export function usePlannerWrite(
  editId: string | null,
  placeIds: string | null,
) {
  const router = useRouter()

  // 폼 필드 상태
  const [formData, setFormData] = useState<PlanFormData>({
    title: '',
    content: '',
    startDate: '',
    endDate: '',
    people: null,
    budget: null,
  })

  // 장소 상태
  const [selectedPlaces, setSelectedPlaces] = useState<WritePlace[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [allPlaces, setAllPlaces] = useState<WritePlace[]>([])

  useEffect(() => {
    const fetchPlaces = async () => {
      const { data } = await supabase
        .from('place')
        .select('id, title, location, image')
      setAllPlaces(data ?? [])
    }
    fetchPlaces()
  }, [])

  useEffect(() => {
    if (!placeIds || allPlaces.length === 0) return
    const ids = placeIds.split(',').map(Number)
    const preSelected = allPlaces.filter((p) => ids.includes(p.id))
    setSelectedPlaces(preSelected)
  }, [placeIds, allPlaces])

  // 수정 모드일 때 기존 데이터 불러오기
  useEffect(() => {
    if (!editId) return
    const load = async () => {
      try {
        const { formData: existing, places } = await fetchPlannerForEdit(editId)
        setFormData(existing)
        setSelectedPlaces(places)
      } catch {
        alert('데이터를 불러오는데 실패했습니다.')
      }
    }
    load()
  }, [editId])

  // 개별 필드 업데이트 헬퍼
  const updateField = <K extends keyof PlanFormData>(
    key: K,
    value: PlanFormData[K],
  ) => setFormData((prev) => ({ ...prev, [key]: value }))

  // 장소 핸들러
  const handleAddPlace = (place: WritePlace) => {
    if (selectedPlaces.some((p) => p.id === place.id)) return
    setSelectedPlaces((prev) => [...prev, place])
    setIsModalOpen(false)
  }

  const handleRemovePlace = (placeId: number) => {
    setSelectedPlaces((prev) => prev.filter((p) => p.id !== placeId))
  }

  // 폼 제출
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formData.title) {
      alert('플랜 제목을 입력해주세요')
      return
    }
    if (
      formData.startDate &&
      formData.endDate &&
      formData.startDate > formData.endDate
    ) {
      alert('종료일이 시작일보다 빠릅니다')
      return
    }

    setIsSubmitting(true)
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser()
      if (authError || !authData?.user) {
        alert('로그인이 필요합니다')
        return
      }

      const { data: dbUser, error: userError } = await supabase
        .from('user')
        .select('id')
        .eq('uid', authData.user.id)
        .single()

      if (userError || !dbUser) {
        alert('유저 정보를 불러오는 데 실패했습니다.')
        return
      }

      await upsertPlanner(
        dbUser.id,
        formData,
        selectedPlaces,
        editId ?? undefined,
      )

      alert(
        editId
          ? '플랜이 성공적으로 수정되었습니다!'
          : '플랜이 성공적으로 저장되었습니다!',
      )
      router.push('/main/planner')
    } catch (err) {
      console.error('플랜 저장/수정 실패:', err)
      alert('오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 선택되지 않은 장소 필터링 (allPlaces는 usePlace 훅에서 받아 page에서 내려줌)
  const getAvailablePlaces = useMemo(
    () => (allPlaces: WritePlace[]) =>
      allPlaces.filter((p) => !selectedPlaces.some((s) => s.id === p.id)),
    [selectedPlaces],
  )

  return {
    formData,
    updateField,
    selectedPlaces,
    handleAddPlace,
    handleRemovePlace,
    handleSubmit,
    isSubmitting,
    isDatePickerOpen,
    setIsDatePickerOpen,
    isModalOpen,
    setIsModalOpen,
    getAvailablePlaces,
  }
}
