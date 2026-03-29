'use client'

import type { Place } from '../types/planner_type'

interface Props {
  place: Place
  onRemove: () => void
}

export default function PlaceListItem({ place, onRemove }: Props) {
  return (
    <div className="mb-2.5 flex items-center gap-3.5 rounded-[12px] border border-[#e8e6e0] bg-white px-4 py-3.5 transition hover:shadow-md">
      {/* 썸네일 */}
      <div
        className="h-[54px] w-[54px] flex-shrink-0 rounded-lg bg-cover bg-center"
        style={{ backgroundImage: `url('${place.image}')` }}
      />
      {/* 정보 */}
      <div className="flex-1">
        <p className="text-[14px] font-medium text-[#2c2c2a]">{place.title}</p>
        <p className="text-[12px] text-[#888]">{place.location}</p>
        {place.content && (
          <p className="mt-0.5 text-[11px] italic text-[#aaa]">
            {place.content}
          </p>
        )}
      </div>
      {/* 삭제 버튼 */}
      <button
        onClick={onRemove}
        className="cursor-pointer p-1 text-[#ccc] hover:text-[#888]"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          width={16}
          height={16}
        >
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  )
}
