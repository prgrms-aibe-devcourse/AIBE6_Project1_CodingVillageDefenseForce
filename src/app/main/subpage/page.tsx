'use client'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

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

interface favorite {}

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

interface Location {
  title: string
}

export default function SubPage() {
  // State 로 관리
  const [tags, setTags] = useState<Tag[]>([])
  const [object, setObject] = useState<Place[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  // wishList 등록을 위한 유저 정보
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  // 전체 지역 필터 출력용 State
  const [location, setLocation] = useState<Location[]>([])
  // filter 를 위한(값 비교 등) State
  const [selectedRegion, setSelectedRegion] = useState('전체')

  const sortOptions = ['거리순', '평점순', '리뷰 많은 순']
  const [selectedSort, setSelectedSort] = useState('거리순')

  // 데이터 fetch 함수_Place

  const fetchObject = async () => {
    try {
      const { data: place, error } = await supabase
        .from('place')
        .select(
          `id, title, content,image, review(id, rating) ,place_tag(tag(id, category)), location(id, title), favorite(user_id)`,
        )
      setObject(place ?? [])
    } catch (error) {
      console.error('PLACE 로딩 중 오류가 발생하였습니다.', error)
    }
  }

  // 데이터 fetch 함수_Tag
  const fetchTag = async () => {
    try {
      const { data: tag, error } = await supabase.from('tag').select('*')
      setTags(tag ?? [])
      setSelectedTags(tag?.map((t) => t.category) ?? [])
    } catch (error) {
      console.error('Tag 로딩 중 오류가 발생하였습니다.', error)
    }
  }

  // 로그인 정보

  const fetchUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setCurrentUserId(user?.id ?? null)
  }

  const fetchFilter = async () => {
    try {
      const { data: loca } = await supabase.from('location').select('*')
      setLocation(loca ?? [])
    } catch (error) {
      console.error('지역별 데이터를 불러오는 중 오류가 발생하였습니다.', error)
    }
  }

  // 태그 생성, 삭제

  const tagDelete = (id: number) => {
    const del = tags.find((e) => e.id === id)
    setTags((prev) => prev.filter((e) => e.id !== id))
    setSelectedTags((prev) => prev.filter((t) => t !== del?.category))
  }

  // favorite 버튼 구현

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

  // 태그에 해당하는 Place만 남기는 필터
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
      if (selectedSort === '리뷰 많은 순') {
        return b.review.length - a.review.length
      }
      return 0
    })

  // 화면 렌더링
  useEffect(() => {
    fetchObject()
    fetchTag()
    fetchFilter()
    fetchUser()
  }, [])

  return (
    <div className="min-h-screen bg-[#fafaf9] px-8 py-8">
      {/* 검색 바 */}
      <div>
        <input
          className="h-12 w-full max-w-md rounded-2xl text-gray-700 bg-[#f5f5f4] px-4 outline-none m-[1rem]"
          type="text"
          placeholder="어디로 떠나고 싶으신가요?"
        />
      </div>
      {/* Header */}
      <div className="flex items-center justify-between m-[1rem]">
        <div className="flex items-center gap-3 px-[2rem]">
          <button className="text-[#292524] text-sm">
            <Link href="/main">⬅️</Link>
          </button>
          <h2 className="text-3xl text-[#292524]  py-[1rem]">검색 결과</h2>
        </div>

        <button className="rounded-xl text-[#292524] bg-[#f5f5f4] px-4 py-2 text-sm">
          필터
        </button>
      </div>

      {/* 태그 리스트 */}
      <div>
        <ul className="flex flex-wrap gap-3 mx-[1rem] my-[2rem]">
          {tags.map((tag) => {
            const isSelected = selectedTags.includes(tag.category)

            return (
              <li
                key={tag.id}
                className="rounded-full px-4 py-2 text-sm bg-[#a7f3d0] text-[#0f766e]"
              >
                #{tag.category}
                <button onClick={() => tagDelete(tag.id)}> [x]</button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* 필터 */}
      <div className="rounded-3xl bg-[#f4f3f0] px-6 py-5 mx-[1rem] my-[3rem]">
        <div className="flex flex-col gap-5">
          {/* 지역 필터 행 */}
          <div className="flex items-center gap-6">
            <span className="min-w-[40px] text-sm text-gray-500">지역</span>

            <div className="flex flex-wrap gap-3">
              {location.map((loca) => (
                <button
                  key={loca.id}
                  onClick={() => setSelectedRegion(loca.title)}
                  className={`rounded-lg px-3 py-1.5 text-sm ${
                    selectedRegion === loca.title
                      ? 'bg-sky-300 text-white'
                      : 'text-[#44403c]'
                  }`}
                >
                  {loca.title}
                </button>
              ))}
            </div>
          </div>

          {/* 정렬 필터 행 */}
          <div className="flex items-center gap-6">
            <span className="min-w-[40px] text-sm text-gray-500">정렬</span>

            <div className="flex flex-wrap gap-3">
              {sortOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedSort(option)}
                  className={`rounded-lg px-3 py-1.5 text-sm ${
                    selectedSort === option
                      ? 'font-semibold text-sky-600'
                      : 'text-gray-400'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 객체 배열 */}
      <div>
        <ul className="flex flex-col gap-5 m-[1rem]">
          {filtedObject.map((obj) => {
            const avg =
              obj.review.length === 0
                ? 0
                : obj.review.reduce((sum, r) => sum + r.rating, 0) /
                  obj.review.length
            return (
              <li
                key={obj.id}
                className="flex items-center justify-between rounded-3xl bg-white px-6 py-5"
              >
                <div className="flex items-center gap-5">
                  {/* 썸네일 */}
                  <div className="h-28 w-28 rounded-2xl bg-gray-300 overflow-hidden">
                    <img
                      src={obj.image}
                      alt={obj.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* 텍스트 정보 */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs text-orange-400">
                      <span className="rounded bg-gray-100 px-2 py-1 text-gray-600">
                        {obj.location.title}
                      </span>
                      {/* 각 테마별 태그 */}
                      {obj.place_tag.map((e) => (
                        <span key={e.tag.id}>#{e.tag.category}</span>
                      ))}
                    </div>

                    <h3 className="text-2xl font-semibold text-[#292524]">
                      {obj.title}
                    </h3>

                    <p className="text-sm text-gray-500">{obj.content}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>⭐{avg.toFixed(1)}</span>
                      <span>{obj.review.length}</span>
                      <span>1.2km</span>
                    </div>
                  </div>
                </div>

                {/* 좋아요 버튼 */}
                <button
                  className="text-xl"
                  onClick={() => toggleFavorite(obj.id)}
                >
                  {obj.favorite.some((l) => l.user_id === currentUserId)
                    ? '❤️'
                    : '♡'}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
