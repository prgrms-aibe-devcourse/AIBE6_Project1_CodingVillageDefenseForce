'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react' // 1. Suspense 임포트
import AddPlaceModal from '../components/AddPlaceModal'
import PlannerFormSection from '../components/PlannerWriteForm'
import SelectedPlaceGrid from '../components/SelectedPlaceGrid'
import { usePlace } from '../hooks/usePlace'
import { usePlannerWrite } from '../hooks/usePlannerWrite'

// 기존 로직을 별도의 내부 컴포넌트로 분리
function PlannerWriteContent() {
  const searchParams = useSearchParams()

  const editId = searchParams.get('id') as string | null
  const placeIds = searchParams.get('placeIds') as string | null

  const {
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
  } = usePlannerWrite(editId, placeIds)

  const { allPlaces } = usePlace()
  const availablePlaces = getAvailablePlaces(allPlaces)

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-800 font-sans pb-24">
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-8">
        <h1 className="text-4xl font-bold mb-4 tracking-tight">
          당신의 다음{' '}
          <span className="text-[#38D4BA]">걸작을 디자인하세요</span>
        </h1>
        <p className="text-gray-500 max-w-2xl leading-relaxed">
          맞춤형 여행 경험을 디자인하세요. 아래 캔버스를 채워 세계에서 가장
          숨겨진 보석들을 통한 선별된 여정을 시작하세요.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto px-6 space-y-12"
      >
        <PlannerFormSection
          formData={formData}
          onUpdate={updateField}
          isDatePickerOpen={isDatePickerOpen}
          onToggleDatePicker={() => setIsDatePickerOpen((prev) => !prev)}
        />

        <SelectedPlaceGrid
          selectedPlaces={selectedPlaces}
          onOpenModal={() => setIsModalOpen(true)}
          onRemove={handleRemovePlace}
        />

        <div className="pt-10 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#38D4BA] hover:bg-[#2ebfa6] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-8 py-4 rounded-full shadow-lg shadow-[#38D4BA]/30 transition-all transform hover:-translate-y-1"
          >
            {isSubmitting
              ? '저장 중...'
              : editId
                ? '플랜 수정하기'
                : '플랜 시작하기'}
          </button>
        </div>
      </form>

      <AddPlaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        availablePlaces={availablePlaces}
        onAdd={handleAddPlace}
      />
    </div>
  )
}

// 최종 export 단계에서 Suspense Boundary 적용
export default function PlannerWritePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          플래너 로딩 중...
        </div>
      }
    >
      <PlannerWriteContent />
    </Suspense>
  )
}
