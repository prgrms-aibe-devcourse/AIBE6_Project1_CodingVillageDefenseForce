'use client'

import type { WritePlace } from '../types/planner_type'
import { MapPinIcon, MinusIcon, PlusIcon } from './Icons'

interface Props {
  selectedPlaces: WritePlace[]
  onOpenModal: () => void
  onRemove: (placeId: number) => void
}

export default function SelectedPlaceGrid({
  selectedPlaces,
  onOpenModal,
  onRemove,
}: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">여행지</h2>
      <p className="text-gray-500 mb-6">일자별 경로를 구축하기 시작하세요.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* 장소 추가 버튼 카드 */}
        <button
          type="button"
          onClick={onOpenModal}
          className="flex flex-col items-center justify-center h-80 rounded-3xl border-2 border-dashed border-gray-300 bg-[#F8F9FA] hover:bg-gray-50 transition-colors group"
        >
          <div className="w-12 h-12 bg-[#004D40] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <PlusIcon className="w-6 h-6 text-white" />
          </div>
          <span className="font-medium text-gray-800 mb-1">
            일정에 장소 추가
          </span>
          <span className="text-xs text-gray-400">
            지도를 검색하거나 지점을 드롭하세요
          </span>
        </button>

        {/* 선택된 장소 카드 */}
        {selectedPlaces.map((place) => (
          <div
            key={place.id}
            className="relative h-80 rounded-3xl overflow-hidden group shadow-sm"
          >
            <img
              src={place.image || 'https://via.placeholder.com/400x500'}
              alt={place.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6">
              <span className="inline-block px-2 py-1 bg-[#38D4BA] text-white text-[10px] font-bold rounded mb-2">
                선택됨
              </span>
              <h3 className="text-white font-bold text-lg mb-1">
                {place.title}
              </h3>
              <div className="flex items-center text-gray-300 text-xs">
                <MapPinIcon className="w-3 h-3 mr-1" />
                {place.location}
              </div>
            </div>

            {/* 제거 버튼 */}
            <button
              type="button"
              onClick={() => onRemove(place.id)}
              className="absolute bottom-6 right-6 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
            >
              <MinusIcon className="w-4 h-4 text-white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
