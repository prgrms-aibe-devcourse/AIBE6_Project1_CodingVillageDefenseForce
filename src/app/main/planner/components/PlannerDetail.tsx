'use client'

import { useState } from 'react'
import type { Place, Planner } from '../types/planner_type'
import AddPlaceModal from './AddPlaceModal'
import MapPreview from './MapPreview'
import PlaceListItem from './PlaceListItem'

interface Props {
  selectedPlan: Planner | null
  availablePlaces: Place[]
  onEdit: () => void
  onDelete: () => void
  onAddPlace: (place: Place) => void
  onRemovePlace: (placePlannerId: number) => void
  onOpenMap: () => void
}

export default function PlannerDetail({
  selectedPlan,
  availablePlaces,
  onEdit,
  onDelete,
  onAddPlace,
  onRemovePlace,
  onOpenMap,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 플랜 미선택 상태
  if (!selectedPlan) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-center bg-[#f7f6f3]">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8e6e0]">
          🗺️
        </div>
        <h3 className="mb-2 text-lg font-medium text-[#2c2c2a]">
          아직 선택된 플랜이 없어요
        </h3>
        <p className="text-sm text-[#888]">
          왼쪽에서 플랜을 선택하거나
          <br />
          <span className="font-medium text-[#1D9E75]">새 플랜 만들기</span>를
          눌러 여행계획을 세워주세요!
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-[#f7f6f3]">
      {/* 상세 헤더 */}
      <div className="flex items-center justify-between border-b border-[#e8e6e0] bg-white px-6 py-4">
        <div>
          <p className="mb-1 text-[10px] font-medium uppercase tracking-[2px] text-[#1D9E75]">
            Detail View
          </p>
          <h2 className="text-[18px] font-medium text-[#2c2c2a]">
            {selectedPlan.title}
          </h2>
        </div>
        <div className="flex gap-2">
          {/* 편집 */}
          <button
            onClick={onEdit}
            className="flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-[#e8e6e0] bg-white text-[#888] transition hover:bg-[#f7f6f3] hover:text-[#2c2c2a]"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M10.5 2.5l2 2-7 7H3.5v-2l7-7z" />
            </svg>
          </button>
          {/* 삭제 */}
          <button
            onClick={onDelete}
            className="flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-[#e8e6e0] bg-white text-red-400/80 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M2.5 4h11M6.5 4V2.5a1 1 0 011-1h1a1 1 0 011 1V4m3 0v10a1.5 1.5 0 01-1.5 1.5h-8A1.5 1.5 0 012.5 14V4h11zM5.5 7v5M10.5 7v5" />
            </svg>
          </button>
        </div>
      </div>

      {/* 상세 바디 */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {/* 장소 목록 */}
        <div className="mb-3">
          {selectedPlan.place_planners?.map((pp) => {
            if (!pp.place) return null
            return (
              <PlaceListItem
                key={pp.id}
                place={pp.place}
                onRemove={() => onRemovePlace(pp.id)}
              />
            )
          })}
        </div>

        {/* 장소 추가 버튼 */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-4 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-[12px] border-[1.5px] border-dashed border-[#d0d0d0] bg-transparent py-3.5 text-[13px] text-[#aaa] transition hover:border-[#1D9E75] hover:bg-[#f0fdf8] hover:text-[#1D9E75]"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M7 2v10M2 7h10" />
          </svg>
          장소 추가하기
        </button>

        {/* 지도 미리보기 */}
        <MapPreview onOpen={onOpenMap} />
      </div>

      {/* 장소 추가 모달 */}
      <AddPlaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        availablePlaces={availablePlaces}
        onAdd={(place) => {
          onAddPlace(place)
          setIsModalOpen(false)
        }}
      />
    </div>
  )
}
