'use client'

declare global {
  interface Window {
    kakao: any
  }
}

import { useEffect, useRef } from 'react'

interface Place {
  id: number
  title: string
  location: string
}

interface PlannerMapModalProps {
  isOpen: boolean
  onClose: () => void
  places: Place[]
}

export default function PlannerMapModal({
  isOpen,
  onClose,
  places,
}: PlannerMapModalProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen || places.length === 0) return

    const initMap = () => {
      window.kakao.maps.load(() => {
        const mapOption = {
          center: new window.kakao.maps.LatLng(37.566826, 126.9786567), // 기본 서울 좌표
          level: 3,
        }
        const map = new window.kakao.maps.Map(mapRef.current, mapOption)
        const ps = new window.kakao.maps.services.Places()
        const bounds = new window.kakao.maps.LatLngBounds()

        places.forEach((place) => {
          ps.keywordSearch(place.title, (result: any, status: any) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const lat = parseFloat(result[0].y)
              const lng = parseFloat(result[0].x)
              const coords = new window.kakao.maps.LatLng(lat, lng)

              new window.kakao.maps.Marker({
                position: coords,
                map: map,
              })
              bounds.extend(coords)
              map.setBounds(bounds)
            }
          })
        })
      })
    }

    if (window.kakao && window.kakao.maps) {
      initMap()
    } else {
      const script = document.createElement('script')
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services`
      script.async = true
      script.onload = initMap
      document.head.appendChild(script)
    }
  }, [isOpen, places])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex h-[80vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-xl font-bold text-[#2c2c2a]">
            플랜 경로 한눈에 보기
          </h2>
          <button
            onClick={onClose}
            className="rounded-full bg-gray-100 p-2 transition hover:bg-gray-200"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width="20"
              height="20"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* 지도 영역 */}
        <div className="flex-1 bg-gray-100">
          <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    </div>
  )
}
