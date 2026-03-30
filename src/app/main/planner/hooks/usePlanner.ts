import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import {
  addPlaceToPlanner,
  deletePlanner,
  fetchPlannersByUserId,
  removePlaceFromPlanner,
} from '../lib/plannerAPI'
import type { Place, Planner } from '../types/planner_type'

export function usePlanner(userId: number | null) {
  const router = useRouter()
  const [planners, setPlanners] = useState<Planner[]>([])
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMapModalOpen, setIsMapModalOpen] = useState(false)

  const loadPlanners = useCallback(async () => {
    if (!userId) return
    setIsLoading(true)
    try {
      const data = await fetchPlannersByUserId(userId)
      setPlanners(data)
    } catch (e) {
      console.error('플래너 로드 실패:', e)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    loadPlanners()
  }, [loadPlanners])

  const handleDelete = async () => {
    if (!selectedPlanId || !window.confirm('정말 삭제하시겠습니까?')) return
    try {
      await deletePlanner(selectedPlanId)
      setSelectedPlanId(null)
      await loadPlanners()
    } catch {
      alert('삭제에 실패했습니다.')
    }
  }

  const handleAddPlace = async (place: Place) => {
    if (!selectedPlanId) return
    try {
      await addPlaceToPlanner(selectedPlanId, place.id)
      await loadPlanners()
    } catch {
      alert('장소 추가에 실패했습니다.')
    }
  }

  const handleRemovePlace = async (placePlannerId: number) => {
    if (!selectedPlanId) return
    try {
      await removePlaceFromPlanner(placePlannerId)
      await loadPlanners()
    } catch {
      alert('장소 삭제에 실패했습니다.')
    }
  }

  const handleEdit = () => {
    if (!selectedPlanId) return
    router.push(`/main/planner/planner_write?id=${selectedPlanId}`)
  }

  // 선택된 플랜 + 파생 데이터
  const selectedPlan = planners.find((p) => p.id === selectedPlanId) ?? null

  return {
    // 상태
    planners,
    selectedPlanId,
    selectedPlan,
    isLoading,
    // 액션
    setSelectedPlanId,
    handleDelete,
    handleAddPlace,
    handleRemovePlace,
    handleEdit,
    isMapModalOpen,
    setIsMapModalOpen,
  }
}
