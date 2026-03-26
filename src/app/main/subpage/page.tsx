'use client'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

interface Place {
  id: number
  title: string
  content: string
  review: Review[]
  place_tag: PlaceTag[]
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

export default function SubPage() {
  const supabase = createClient()
  // State 로 관리
  const [tags, setTags] = useState<Tag[]>([])
  const [object, setObject] = useState<Place[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // 하드코딩
  const regions = ['전체', '서울', '부산', '제주', '강원', '경주', '전주']
  const sortOptions = ['거리순', '평점순', '리뷰 많은 순']
  const [selectedRegion, setSelectedRegion] = useState('전체')
  const [selectedSort, setSelectedSort] = useState('거리순')

  // 데이터 fetch 함수_Place

  const fetchObject = async () => {
    try {
      const { data: place, error } = await supabase
        .from('place')
        .select(
          `id, title, content, review(id, rating), place_tag(tag(id, category))`,
        )
      setObject(place)
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

  // 태그 생성, 삭제

  const tagDelete = (id: number) => {
    const del = tags.find((e) => e.id === id)
    setTags((prev) => prev.filter((e) => e.id !== id))
    setSelectedTags((prev) => prev.filter((t) => t !== del?.category))
  }

  const filteedObject = object.filter((obj) =>
    obj.place_tag.some((pt) => selectedTags.includes(pt.tag.category)),
  )
  // 화면 렌더링
  useEffect(() => {
    fetchObject()
    fetchTag()
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
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`rounded-lg px-3 py-1.5 text-sm ${
                    selectedRegion === region
                      ? 'bg-sky-300 text-white'
                      : 'text-[#44403c]'
                  }`}
                >
                  {region}
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
          {filteedObject.map((obj) => {
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
                  <div className="h-28 w-28 rounded-2xl bg-gray-300" />

                  {/* 텍스트 정보 */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs text-orange-400">
                      <span className="rounded bg-gray-100 px-2 py-1 text-gray-600">
                        제주
                      </span>
                      {/* 얘네들은 태그로 받아서 들어가야함 */}
                      <span>#바다뷰</span>
                      <span>#힐링</span>
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
                <button className="text-xl">♡</button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
