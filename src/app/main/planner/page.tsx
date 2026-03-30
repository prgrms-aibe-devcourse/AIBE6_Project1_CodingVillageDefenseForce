'use client'

import KakaoMapModal from './components/KaKaoMapModal'
import PlannerDetail from './components/PlannerDetail'
import PlannerList from './components/PlannerList'
import { useAuth } from './hooks/useAuth'
import { usePlace } from './hooks/usePlace'
import { usePlanner } from './hooks/usePlanner'

export default function PlannerPage() {
  const { user, isLoading: authLoading } = useAuth()
  const {
    planners,
    selectedPlanId,
    selectedPlan,
    setSelectedPlanId,
    handleDelete,
    handleAddPlace,
    handleRemovePlace,
    handleEdit,
    isMapModalOpen,
    setIsMapModalOpen,
  } = usePlanner(user?.id ?? null)

  const currentPlaceIds =
    selectedPlan?.place_planners?.map((pp) => pp.place?.id).filter(Boolean) ??
    []
  const { availablePlaces } = usePlace(currentPlaceIds as number[])

  const selectedPlaces =
    selectedPlan?.place_planners.map((pp) => pp.place).filter(Boolean) ?? []

  if (authLoading)
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <p>로딩중...</p>
      </div>
    )

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* 검색바 */}
      <Header />

      {/* 2컬럼 레이아웃 */}
      <div className="flex flex-1 overflow-hidden">
        '{/* 플랜 목록 */}
        <PlannerList
          planners={planners}
          selectedPlanId={selectedPlanId}
          onSelect={setSelectedPlanId}
        />
        {/* 플랜 상세 */}
        <PlannerDetail
          selectedPlan={selectedPlan}
          availablePlaces={availablePlaces}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddPlace={handleAddPlace}
          onRemovePlace={handleRemovePlace}
          onOpenMap={() => setIsMapModalOpen(true)}
        />
      </div>
      {/* 카카오맵 모달 */}
      <KakaoMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        places={selectedPlaces}
      />
    </div>
  )
}
