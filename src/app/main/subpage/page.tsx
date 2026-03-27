'use client'

import { createClient } from '@/lib/supabase/client'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

interface Review {
  id: number
  rating: number
}

interface Tag {
  id: number
  category: string
}

interface Place {
  id: number
  title: string
  content: string
  location: string
  image: string
  review: Review[]
  place_tag: { tag: Tag }[]
}

function SubPageContent() {
  const searchParams = useSearchParams()
  const tagParams = searchParams.get('tags')?.split(',') ?? []

  const [tags, setTags] = useState<Tag[]>([])
  const [object, setObject] = useState<Place[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [favorites, setFavorites] = useState<Set<number>>(new Set()) // 즐겨찾기된 place_id 목록
  const [userId, setUserId] = useState<string | null>(null)

  const supabase = createClient()

  const regions = ['전체', '서울', '부산', '제주', '강원', '경주', '전주']
  const sortOptions = ['거리순', '평점순', '리뷰 많은 순']
  const [selectedRegion, setSelectedRegion] = useState('전체')
  const [selectedSort, setSelectedSort] = useState('거리순')

  const fetchObject = async () => {
    try {
      const { data: place } = await supabase
        .from('place')
        .select(
          `id, title, content, location, image, review(id, rating), place_tag(tag(id, category))`,
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

  const fetchFavorites = async (uid: string) => {
    const { data } = await supabase
      .from('favorite')
      .select('place_id')
      .eq('user_id', uid)
    if (data) {
      setFavorites(new Set(data.map((f) => f.place_id)))
    }
  }

  const toggleFavorite = async (placeId: number) => {
    console.log('userId:', userId)

    if (!userId) return

    if (favorites.has(placeId)) {
      // 이미 즐겨찾기 → 삭제
      await supabase
        .from('favorite')
        .delete()
        .eq('user_id', userId)
        .eq('place_id', placeId)
      setFavorites((prev) => {
        const next = new Set(prev)
        next.delete(placeId)
        return next
      })
    } else {
      // 즐겨찾기 추가
      await supabase
        .from('favorite')
        .insert({ user_id: userId, place_id: placeId })
      setFavorites((prev) => new Set(prev).add(placeId))
    }
  }

  const tagDelete = (id: number) => {
    const del = tags.find((e) => e.id === id)
    setTags((prev) => prev.filter((e) => e.id !== id))
    setSelectedTags((prev) => prev.filter((t) => t !== del?.category))
  }

  const filteredObject = object.filter((obj) =>
    obj.place_tag.some((pt) => selectedTags.includes(pt.tag.category)),
  )

  useEffect(() => {
    const init = async () => {
      // getUser 대신 getSession으로 변경
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        setUserId(session.user.id)
        await fetchFavorites(session.user.id)
      }
      await fetchObject()
      await fetchTag()
    }
    init()
  }, [])

  return (
    <div className="min-h-screen bg-[#fafaf9] px-8 py-8">
      {/* 검색 바 */}
      <div>
        <input
          className="h-12 w-full max-w-md rounded-2xl text-[#dfe2e6] bg-[#f5f5f4] px-4 outline-none m-[1rem]"
          type="text"
          placeholder="어디로 떠나고 싶으신가요?"
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between m-[1rem]">
        <div className="flex items-center gap-3 px-[2rem]">
          <button className="text-[#292524] text-sm">⃪</button>
          <h2 className="text-3xl text-[#292524] py-[1rem]">검색 결과</h2>
        </div>
        <button className="rounded-xl text-[#292524] bg-[#f5f5f4] px-4 py-2 text-sm">
          필터
        </button>
      </div>

      {/* 태그 리스트 */}
      <div>
        <ul className="flex flex-wrap gap-3 mx-[1rem] my-[2rem]">
          {tags.map((tag) => (
            <li
              key={tag.id}
              className={`rounded-full px-4 py-2 text-sm cursor-pointer ${
                selectedTags.includes(tag.category)
                  ? 'bg-[#a7f3d0] text-[#0f766e]'
                  : 'bg-[#f5f5f4] text-[#888]'
              }`}
            >
              #{tag.category}
              <button onClick={() => tagDelete(tag.id)}> [x]</button>
            </li>
          ))}
        </ul>
      </div>

      {/* 필터 */}
      <div className="rounded-3xl bg-[#f4f3f0] px-6 py-5 mx-[1rem] my-[3rem]">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-6">
            <span className="min-w-[40px] text-sm text-gray-500">지역</span>
            <div className="flex flex-wrap gap-3">
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`rounded-lg px-3 py-1.5 text-sm ${selectedRegion === region ? 'bg-sky-300 text-white' : 'text-[#44403c]'}`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <span className="min-w-[40px] text-sm text-gray-500">정렬</span>
            <div className="flex flex-wrap gap-3">
              {sortOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedSort(option)}
                  className={`rounded-lg px-3 py-1.5 text-sm ${selectedSort === option ? 'font-semibold text-sky-600' : 'text-gray-400'}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 장소 리스트 */}
      <div>
        <ul className="flex flex-col gap-5 m-[1rem]">
          {filteredObject.length === 0 ? (
            <li className="text-center text-gray-400 py-10">
              해당하는 장소가 없어요
            </li>
          ) : (
            filteredObject.map((obj) => {
              const avg =
                obj.review.length === 0
                  ? 0
                  : obj.review.reduce((sum, r) => sum + r.rating, 0) /
                    obj.review.length
              const isFavorite = favorites.has(obj.id)
              return (
                <li
                  key={obj.id}
                  className="flex items-center justify-between rounded-3xl bg-white px-6 py-5"
                >
                  <div className="flex items-center gap-5">
                    <div
                      className="h-28 w-28 flex-shrink-0 rounded-2xl bg-gray-300 bg-cover bg-center"
                      style={{
                        backgroundImage: obj.image
                          ? `url('${obj.image}')`
                          : undefined,
                      }}
                    />
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-xs text-orange-400">
                        <span className="rounded bg-gray-100 px-2 py-1 text-gray-600">
                          {obj.location}
                        </span>
                        {obj.place_tag.map((pt) => (
                          <span key={pt.tag.id}>#{pt.tag.category}</span>
                        ))}
                      </div>
                      <h3 className="text-2xl font-semibold text-[#292524]">
                        {obj.title}
                      </h3>
                      <p className="text-sm text-gray-500">{obj.content}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>⭐{avg.toFixed(1)}</span>
                        <span>리뷰 {obj.review.length}개</span>
                      </div>
                    </div>
                  </div>
                  {/* 즐겨찾기 버튼 */}
                  <button
                    onClick={() => toggleFavorite(obj.id)}
                    className="text-2xl transition-transform hover:scale-110"
                  >
                    {isFavorite ? '❤️' : '🤍'}
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
