'use client'
import Header from '@/components/layout/Header'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

interface Place {
  id: number
  title: string
  content: string
  image: string
  location: Location
  review: Review[]
  place_tag: PlaceTag[]
  favorite: { user_id: string }[]
}

interface Location {
  id: number
  title: string
}

interface Review {
  id: number
  rating: number
}

interface Tag {
  id: number
  category: string
}

interface PlaceTag {
  tag: Tag
}

function SubPageContent() {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const tagParams = searchParams.get('tags')?.split(',') ?? []

  const [tags, setTags] = useState<Tag[]>([])
  const [object, setObject] = useState<Place[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [location, setLocation] = useState<Location[]>([])
  const [selectedRegion, setSelectedRegion] = useState('전체')
  const [showFilter, setShowFilter] = useState(false) // 필터 패널 토글

  const sortOptions = ['거리순', '평점순', '리뷰 많은 순']
  const [selectedSort, setSelectedSort] = useState('거리순')

  const fetchObject = async () => {
    try {
      const { data: place } = await supabase
        .from('place')
        .select(
          `id, title, content, image, review(id, rating), place_tag(tag(id, category)), location(id, title), favorite(user_id)`,
        )
      setObject((place as unknown as Place[]) ?? [])
    } catch (error) {
      console.error('PLACE 로딩 중 오류가 발생하였습니다.', error)
    }
  }

  const fetchTag = async () => {
    try {
      const { data: tag } = await supabase.from('tag').select('*')
      setTags(tag ?? [])
      if (tagParams.length > 0) {
        const filtered =
          tag
            ?.filter((t) => tagParams.includes(String(t.id)))
            .map((t) => t.category) ?? []
        setSelectedTags(filtered)
      } else {
        setSelectedTags(tag?.map((t) => t.category) ?? [])
      }
    } catch (error) {
      console.error('Tag 로딩 중 오류가 발생하였습니다.', error)
    }
  }

  const fetchUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    setCurrentUserId(session?.user?.id ?? null)
  }

  const fetchFilter = async () => {
    try {
      const { data: loca } = await supabase.from('location').select('*')
      setLocation(loca ?? [])
    } catch (error) {
      console.error('지역별 데이터를 불러오는 중 오류가 발생하였습니다.', error)
    }
  }

  // 태그 선택/해제
  const toggleTag = (category: string) => {
    setSelectedTags((prev) =>
      prev.includes(category)
        ? prev.filter((t) => t !== category)
        : [...prev, category],
    )
  }

  const toggleFavorite = async (placeId: number) => {
    if (!currentUserId) return
    const isLiked = object
      .find((obj) => obj.id === placeId)
      ?.favorite.some((l) => l.user_id === currentUserId)
    if (isLiked) {
      await supabase
        .from('favorite')
        .delete()
        .eq('user_id', currentUserId)
        .eq('place_id', placeId)
    } else {
      await supabase
        .from('favorite')
        .insert({ place_id: placeId, user_id: currentUserId })
    }
    fetchObject()
  }

  const filtedObject = object
    .filter((obj) =>
      selectedRegion === '전체' ? true : obj.location.title === selectedRegion,
    )
    .filter((obj) =>
      obj.place_tag.some((pt) => selectedTags.includes(pt.tag.category)),
    )
    .sort((a, b) => {
      if (selectedSort === '평점순') {
        const avgA =
          a.review.reduce((sum, r) => sum + r.rating, 0) /
          (a.review.length || 1)
        const avgB =
          b.review.reduce((sum, r) => sum + r.rating, 0) /
          (b.review.length || 1)
        return avgB - avgA
      }
      if (selectedSort === '리뷰 많은 순')
        return b.review.length - a.review.length
      return 0
    })

  useEffect(() => {
    fetchObject()
    fetchTag()
    fetchFilter()
    fetchUser()
  }, [])

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <Header placeholder="어디로 떠나고 싶으신가요?" />

      {/* 상단 헤더 */}
      <div className="flex items-center justify-between px-7 py-4 border-b border-[#e8e6e0] bg-white">
        <div className="flex items-center gap-3">
          <Link
            href="/main"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-[#f7f6f3] border border-[#e8e6e0] hover:bg-[#e8e6e0] transition"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 18 18"
              fill="none"
              stroke="#2c2c2a"
              strokeWidth="2"
            >
              <path d="M11 3L5 9l6 6" />
            </svg>
          </Link>
          <h2 className="text-[20px] font-medium text-[#2c2c2a]">검색 결과</h2>
        </div>
        {/* 필터 버튼 */}
        <button
          onClick={() => setShowFilter((prev) => !prev)}
          className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-medium transition
            ${showFilter ? 'bg-[#1D9E75] text-white' : 'bg-[#f5f5f4] text-[#292524] hover:bg-[#e8e6e0]'}`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M1 3h12M3 7h8M5 11h4" />
          </svg>
          필터
        </button>
      </div>

      {/* 선택된 태그 칩 */}
      <div className="flex flex-wrap items-center gap-2 px-7 py-3 border-b border-[#e8e6e0] bg-white">
        {selectedTags.map((category) => {
          const tag = tags.find((t) => t.category === category)
          if (!tag) return null
          return (
            <span
              key={tag.id}
              onClick={() => toggleTag(category)}
              className="flex cursor-pointer items-center gap-1 rounded-full bg-[#1D9E75] px-3 py-1 text-[12px] text-white hover:bg-[#0F6E56] transition"
            >
              #{category}
              <span className="opacity-80">×</span>
            </span>
          )
        })}
      </div>

      {/* 필터 패널 */}
      {showFilter && (
        <div className="bg-white border-b border-[#e8e6e0] px-7 py-5">
          {/* 태그 선택 */}
          <div className="mb-4">
            <p className="text-[12px] font-medium text-[#888] mb-2 uppercase tracking-wider">
              테마
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.category)}
                  className={`rounded-full px-3 py-1.5 text-[13px] transition ${
                    selectedTags.includes(tag.category)
                      ? 'bg-[#1D9E75] text-white'
                      : 'bg-[#f5f5f4] text-[#5f5e5a] hover:bg-[#e8e6e0]'
                  }`}
                >
                  #{tag.category}
                </button>
              ))}
            </div>
          </div>

          {/* 지역 필터 */}
          <div className="mb-4">
            <p className="text-[12px] font-medium text-[#888] mb-2 uppercase tracking-wider">
              지역
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedRegion('전체')}
                className={`rounded-lg px-3 py-1.5 text-[13px] transition ${selectedRegion === '전체' ? 'bg-[#1D9E75] text-white' : 'bg-[#f5f5f4] text-[#44403c] hover:bg-[#e8e6e0]'}`}
              >
                전체
              </button>
              {location.map((loca) => (
                <button
                  key={loca.id}
                  onClick={() => setSelectedRegion(loca.title)}
                  className={`rounded-lg px-3 py-1.5 text-[13px] transition ${selectedRegion === loca.title ? 'bg-[#1D9E75] text-white' : 'bg-[#f5f5f4] text-[#44403c] hover:bg-[#e8e6e0]'}`}
                >
                  {loca.title}
                </button>
              ))}
            </div>
          </div>

          {/* 정렬 */}
          <div>
            <p className="text-[12px] font-medium text-[#888] mb-2 uppercase tracking-wider">
              정렬
            </p>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedSort(option)}
                  className={`rounded-lg px-3 py-1.5 text-[13px] transition ${selectedSort === option ? 'font-semibold text-[#1D9E75]' : 'text-[#888] hover:text-[#2c2c2a]'}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 장소 리스트 */}
      <div className="flex-1 px-7 py-5">
        <p className="text-[13px] text-[#888] mb-4">
          <strong className="text-[#2c2c2a] font-medium">
            {filtedObject.length}개
          </strong>
          의 장소
        </p>
        <ul className="flex flex-col gap-4">
          {filtedObject.length === 0 ? (
            <li className="text-center text-gray-400 py-10">
              해당하는 장소가 없어요
            </li>
          ) : (
            filtedObject.map((obj) => {
              const avg =
                obj.review.length === 0
                  ? 0
                  : obj.review.reduce((sum, r) => sum + r.rating, 0) /
                    obj.review.length
              return (
                <li
                  key={obj.id}
                  className="flex items-center justify-between rounded-2xl bg-white border border-[#e8e6e0] px-5 py-4 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-24 w-24 rounded-xl bg-gray-300 overflow-hidden flex-shrink-0">
                      <img
                        src={obj.image}
                        alt={obj.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="rounded-md bg-[#f5f5f4] px-2 py-0.5 text-[#5f5e5a]">
                          {obj.location.title}
                        </span>
                        {obj.place_tag.map((e) => (
                          <span key={e.tag.id} className="text-[#1D9E75]">
                            #{e.tag.category}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-[17px] font-medium text-[#292524]">
                        {obj.title}
                      </h3>
                      <p className="text-[13px] text-gray-500 line-clamp-1">
                        {obj.content}
                      </p>
                      <div className="flex items-center gap-3 text-[13px] text-gray-500">
                        <span>⭐ {avg.toFixed(1)}</span>
                        <span>리뷰 {obj.review.length}개</span>
                      </div>
                    </div>
                  </div>
                  <button
                    className="ml-4 flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full transition-all hover:scale-110"
                    onClick={() => toggleFavorite(obj.id)}
                  >
                    {obj.favorite.some((l) => l.user_id === currentUserId) ? (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="#1D9E75"
                        stroke="#1D9E75"
                        strokeWidth="1.5"
                      >
                        <path d="M12 21C12 21 3 14 3 8a5 5 0 0110 0 5 5 0 0110 0c0 6-9 13-9 13z" />
                      </svg>
                    ) : (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#1D9E75"
                        strokeWidth="1.8"
                      >
                        <path d="M12 21C12 21 3 14 3 8a5 5 0 0110 0 5 5 0 0110 0c0 6-9 13-9 13z" />
                      </svg>
                    )}
                  </button>
                </li>
              )
            })
          )}
        </ul>
      </div>
    </div>
  )
}

export default function SubPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen text-gray-400">
          로딩 중...
        </div>
      }
    >
      <SubPageContent />
    </Suspense>
  )
}
