'use client'

import { useState } from 'react'

type Category = 'LANDMARK' | 'CULTURE' | 'CITY' | 'NATURE'

interface Place {
  id: number
  cat: Category
  title: string
  rating: string
  desc: string
  price: string
  bg: string
}

const INITIAL_PLACES: Place[] = [
  {
    id: 1,
    cat: 'LANDMARK',
    title: '타지마할, 아그라',
    rating: '4.9',
    desc: '무굴 제국의 건축 예술의 정점이며 유네스코 세계문화유산인 대리석 묘당입니다.',
    price: '₩24,000 ~',
    bg: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&q=60',
  },
  {
    id: 2,
    cat: 'CULTURE',
    title: '기요미즈데라, 교토',
    rating: '4.8',
    desc: '교토 시내를 한눈에 내려다볼 수 있는 절벽 위의 목조 테라스가 유명한 사찰입니다.',
    price: '₩5,000 ~',
    bg: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&q=60',
  },
  {
    id: 3,
    cat: 'CITY',
    title: '에펠탑, 파리',
    rating: '4.7',
    desc: '프랑스의 상징적인 랜드마크로 야경이 특히 아름다운 낭만적인 장소입니다.',
    price: '₩32,000 ~',
    bg: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400&q=60',
  },
  {
    id: 4,
    cat: 'NATURE',
    title: '성산일출봉, 제주',
    rating: '4.9',
    desc: '유네스코 세계자연유산으로 등재된 제주의 대표 명소입니다.',
    price: '무료',
    bg: 'https://images.unsplash.com/photo-1570366583862-f91883984fde?w=400&q=60',
  },
]

const CAT_STYLES: Record<Category, string> = {
  LANDMARK: 'bg-[#E1F5EE] text-[#0F6E56]',
  CULTURE: 'bg-[#E6F1FB] text-[#185FA5]',
  CITY: 'bg-[#FAEEDA] text-[#854F0B]',
  NATURE: 'bg-[#EAF3DE] text-[#3B6D11]',
}

export default function FavoritesPage() {
  const [places, setPlaces] = useState<Place[]>(INITIAL_PLACES)

  const remove = (id: number) => {
    setPlaces((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* 상단 검색바 */}
      <div className="flex items-center gap-2.5 border-b border-[#e8e6e0] bg-white px-7 py-3">
        <div className="flex flex-1 items-center gap-2 rounded-[10px] border border-[#e8e6e0] bg-[#f7f6f3] px-3.5 py-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="#aaa"
            strokeWidth="1.5"
          >
            <circle cx="7" cy="7" r="4.5" />
            <path d="M10.5 10.5L14 14" />
          </svg>
          <input
            type="text"
            placeholder="장소, 도시, 호텔 검색"
            className="flex-1 bg-transparent text-[13px] text-[#2c2c2a] placeholder-[#bbb] outline-none"
          />
        </div>
        {/* 알림 */}
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e8e6e0] bg-white text-[#888] transition hover:bg-[#f7f6f3]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M8 2a4 4 0 014 4c0 3 1 4 1 4H3s1-1 1-4a4 4 0 014-4z" />
            <path d="M7 14h2" />
          </svg>
        </button>
        {/* 설정 */}
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e8e6e0] bg-white text-[#888] transition hover:bg-[#f7f6f3]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="8" cy="8" r="2.5" />
            <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.2 3.2l1.4 1.4M11.4 11.4l1.4 1.4M3.2 12.8l1.4-1.4M11.4 4.6l1.4-1.4" />
          </svg>
        </button>
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto px-7 py-7">
        {/* 헤더 */}
        <div className="mb-6 flex items-flex-end justify-between">
          <div>
            <p className="mb-1 text-[11px] font-medium uppercase tracking-[2px] text-[#1D9E75]">
              My Collection
            </p>
            <h1 className="text-[26px] font-medium text-[#2c2c2a]">즐겨찾기</h1>
          </div>
          <span className="rounded-full border border-[#e8e6e0] bg-[#f7f6f3] px-4 py-1.5 text-[13px] text-[#888]">
            전체 {places.length}개
          </span>
        </div>

        {/* 카드 그리드 */}
        {places.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-[#bbb] gap-3">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="opacity-40"
            >
              <path d="M3 5.5A2.5 2.5 0 018 4a2.5 2.5 0 015 1.5c0 4-5 8-5 8s-5-4-5-8z" />
            </svg>
            <p className="text-[14px]">저장된 장소가 없어요</p>
          </div>
        ) : (
          <div className="mb-8 grid grid-cols-3 gap-[18px]">
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} onRemove={remove} />
            ))}
          </div>
        )}

        {/* AI 플래너 배너 */}
        <div className="flex items-center justify-between gap-4 rounded-[14px] bg-[#0f1d35] px-6 py-5">
          <div>
            <h3 className="mb-1.5 text-[16px] font-medium text-white">
              완벽한 여행 계획이 필요하신가요?
            </h3>
            <p className="text-[13px] leading-relaxed text-white/55">
              저장한 장소들을 바탕으로 최적의 동선을 AI가 추천해 드립니다.
              <br />
              지금 바로 플래너를 시작해보세요.
            </p>
          </div>
          <button className="flex-shrink-0 rounded-full bg-[#1D9E75] px-6 py-2.5 text-[13px] font-medium text-white transition hover:bg-[#0F6E56] whitespace-nowrap">
            플래너로 보내기
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Place Card ── */
function PlaceCard({
  place,
  onRemove,
}: {
  place: Place
  onRemove: (id: number) => void
}) {
  return (
    <div className="group cursor-pointer overflow-hidden rounded-[14px] border border-[#e8e6e0] bg-white transition-all hover:-translate-y-0.5 hover:shadow-2xl">
      {/* 이미지 */}
      <div className="relative h-[180px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundImage: `url('${place.bg}')` }}
        />
        {/* 삭제 버튼 */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove(place.id)
          }}
          className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#666] text-sm transition hover:bg-white hover:text-[#e24b4a]"
        >
          ×
        </button>
        {/* 카테고리 배지 */}
        <span
          className={`absolute bottom-2.5 left-2.5 rounded px-2 py-0.5 text-[10px] font-medium uppercase tracking-[1px] ${CAT_STYLES[place.cat]}`}
        >
          {place.cat}
        </span>
      </div>

      {/* 카드 바디 */}
      <div className="px-4 py-3.5">
        <div className="mb-1.5 flex items-start justify-between gap-2">
          <span className="text-[15px] font-medium leading-snug text-[#2c2c2a]">
            {place.title}
          </span>
          <span className="flex flex-shrink-0 items-center gap-1 text-[13px] font-medium text-[#2c2c2a]">
            <span className="text-[#1D9E75]">★</span>
            {place.rating}
          </span>
        </div>
        <p className="mb-3 line-clamp-2 text-[12px] leading-relaxed text-[#888]">
          {place.desc}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-[#2c2c2a]">
            {place.price}
          </span>
          <span className="flex items-center gap-1 text-[12px] font-medium uppercase tracking-wide text-[#1D9E75]">
            DETAILS
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M2 6h8M7 3l3 3-3 3" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  )
}
