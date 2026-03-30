'use client'

import Header from '@/components/layout/Header'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

interface Place {
  id: number
  title: string
  content: string
  location: string
  image: string
}

interface Favorite {
  id: number
  place_id: number
  place: Place
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchFavorites = async () => {
      // 로그인한 유저 가져오기
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      // 내 즐겨찾기만 가져오기 (place 정보도 같이)
      const { data, error } = await supabase
        .from('favorite')
        .select('id, place_id, place(*)')
        .eq('user_id', user.id)

      if (error) {
        console.error('즐겨찾기 에러:', error)
        setLoading(false)
        return
      }

      setFavorites(data as unknown as Favorite[])
      setLoading(false)
    }
    fetchFavorites()
  }, [])

  const remove = async (favoriteId: number) => {
    // DB에서 삭제
    const { error } = await supabase
      .from('favorite')
      .delete()
      .eq('id', favoriteId)

    if (error) {
      console.error('삭제 에러:', error)
      return
    }
    // 화면에서도 삭제
    setFavorites((prev) => prev.filter((f) => f.id !== favoriteId))
  }

  const places = favorites.map((f) => ({ ...f.place, favoriteId: f.id }))

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header />

      <div className="flex-1 overflow-y-auto px-7 py-7">
        {/* 헤더 */}
        <div className="mb-6 flex items-center justify-between">
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
        {loading ? (
          <div className="flex items-center justify-center py-24 text-[#bbb] text-[14px]">
            로딩 중...
          </div>
        ) : places.length === 0 ? (
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
              <PlaceCard
                key={place.id}
                place={place}
                onRemove={() => remove(place.favoriteId)}
              />
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
  place: Place & { favoriteId: number }
  onRemove: () => void
}) {
  return (
    <div className="group cursor-pointer overflow-hidden rounded-[14px] border border-[#e8e6e0] bg-white transition-all hover:-translate-y-0.5 hover:shadow-2xl">
      <div className="relative h-[180px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundImage: `url('${place.image}')` }}
        />
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#666] text-sm transition hover:bg-white hover:text-[#e24b4a]"
        >
          ×
        </button>
        <span className="absolute bottom-2.5 left-2.5 rounded px-2 py-0.5 text-[10px] font-medium bg-[#E1F5EE] text-[#0F6E56] tracking-[1px]">
          {place.location}
        </span>
      </div>

      <div className="px-4 py-3.5">
        <div className="mb-1.5">
          <span className="text-[15px] font-medium leading-snug text-[#2c2c2a]">
            {place.title}
          </span>
        </div>
        <p className="mb-3 line-clamp-2 text-[12px] leading-relaxed text-[#888]">
          {place.content}
        </p>
        <div className="flex items-center justify-end">
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
