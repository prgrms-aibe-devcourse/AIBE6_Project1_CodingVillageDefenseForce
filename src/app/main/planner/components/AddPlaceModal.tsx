'use client'

import type { WritePlace } from '../types/planner_type'

interface Props {
  isOpen: boolean
  onClose: () => void
  availablePlaces: WritePlace[]
  onAdd: (place: WritePlace) => void
}

export default function AddPlaceModal({
  isOpen,
  onClose,
  availablePlaces,
  onAdd,
}: Props) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl max-h-[85vh] overflow-y-auto rounded-[2rem] bg-white p-8 shadow-2xl">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full bg-gray-100 p-2 transition hover:bg-gray-200"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-gray-600"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h3 className="mb-2 text-2xl font-bold">추가할 장소를 선택하세요</h3>
        <p className="mb-8 text-gray-500">
          일정에 추가하고 싶은 장소의 + 버튼을 클릭하세요.
        </p>

        {availablePlaces.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            더 이상 추가할 장소가 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {availablePlaces.map((place) => (
              <div
                key={place.id}
                className="group relative h-80 overflow-hidden rounded-3xl shadow-sm"
              >
                <img
                  src={place.image || 'https://via.placeholder.com/400x500'}
                  alt={place.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6">
                  <span className="mb-2 inline-block rounded bg-[#38D4BA] px-2 py-1 text-[10px] font-bold text-white">
                    여행 일정
                  </span>
                  <h3 className="mb-1 text-lg font-bold text-white">
                    {place.title}
                  </h3>
                  <div className="flex items-center text-xs text-gray-300">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1 h-3 w-3"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {place.location}
                  </div>
                </div>

                {/* 추가 버튼 */}
                <button
                  type="button"
                  onClick={() => onAdd(place)}
                  className="absolute bottom-6 right-6 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-colors hover:bg-[#38D4BA]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-white"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
