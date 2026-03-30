'use client'

import Header from '@/components/layout/Header'
import FilterPanel from '@/components/subpage/FilterPanel'
import { Place } from '@/components/subpage/PlaceCard'
import PlaceList from '@/components/subpage/PlaceList'
import SearchHeader from '@/components/subpage/SearchHeader'
import TagChips from '@/components/subpage/TagChips'
import { createClient } from '@/lib/supabase/client'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

interface Tag {
  id: number
  category: string
}

interface Location {
  id: number
  title: string
}

function SubPageContent() {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const tagParams = searchParams.get('tags')?.split(',') ?? []

  const [tags, setTags] = useState<Tag[]>([])
  const [places, setPlaces] = useState<Place[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  // wishList 등록을 위한 유저 정보
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  // 전체 지역 필터 출력용 State
  const [locations, setLocations] = useState<Location[]>([])
  // filter 를 위한(값 비교 등) State
  const [selectedRegion, setSelectedRegion] = useState('전체')

  const sortOptions = ['거리순', '평점순', '리뷰 많은 순']
  const [selectedSort, setSelectedSort] = useState('거리순')
  const [showFilter, setShowFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('query') ?? '',
  )

  const fetchPlaces = async (query: string) => {
    try {
      let req = supabase
        .from('place')
        .select(
          `id, title, content, image, review(id, rating), place_tag(tag(id, category)), location(id, title), favorite(user_id)`,
        )

      if (query.trim()) req = req.ilike('title', `%${query}%`)

      const { data } = await req
      setPlaces((data as unknown as Place[]) ?? [])
    } catch (error) {
      console.error('PLACE 로딩 중 오류가 발생하였습니다.', error)
    }
  }

  const fetchTags = async () => {
    try {
      const { data: tag } = await supabase.from('tag').select('*')
      setTags(tag ?? [])
      if (tagParams.length > 0) {
        setSelectedTags(
          tag
            ?.filter((t: Tag) => tagParams.includes(String(t.id)))
            .map((t: Tag) => t.category) ?? [],
        )
      } else {
        setSelectedTags(tag?.map((t: Tag) => t.category) ?? [])
      }
    } catch (error) {
      console.error('Tag 로딩 중 오류가 발생하였습니다.', error)
    }
  }

  const fetchLocations = async () => {
    try {
      const { data } = await supabase.from('location').select('*')
      setLocations(data ?? [])
    } catch (error) {
      console.error('지역 데이터 로딩 중 오류가 발생하였습니다.', error)
    }
  }

  const fetchUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    setCurrentUserId(session?.user?.id ?? null)
  }

  const toggleTag = (category: string) => {
    setSelectedTags((prev) =>
      prev.includes(category)
        ? prev.filter((t) => t !== category)
        : [...prev, category],
    )
  }

  const toggleFavorite = async (placeId: number) => {
    if (!currentUserId) return
    const isLiked = places
      .find((p) => p.id === placeId)
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
    fetchPlaces(searchQuery)
  }

  const filteredPlaces = places
    .filter(
      (p) => selectedRegion === '전체' || p.location.title === selectedRegion,
    )
    .filter((p) =>
      p.place_tag.some((pt) => selectedTags.includes(pt.tag.category)),
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
    const query = searchParams.get('query') ?? ''
    setSearchQuery(query)
    fetchPlaces(query)
    fetchTags()
    fetchLocations()
    fetchUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <Header />
      <SearchHeader
        showFilter={showFilter}
        onToggleFilter={() => setShowFilter((prev) => !prev)}
      />
      <TagChips tags={tags} selectedTags={selectedTags} onToggle={toggleTag} />
      {showFilter && (
        <FilterPanel
          tags={tags}
          locations={locations}
          selectedTags={selectedTags}
          selectedRegion={selectedRegion}
          selectedSort={selectedSort}
          onToggleTag={toggleTag}
          onSelectRegion={setSelectedRegion}
          onSelectSort={setSelectedSort}
        />
      )}
      <PlaceList
        places={filteredPlaces}
        searchQuery={searchQuery}
        currentUserId={currentUserId}
        onToggleFavorite={toggleFavorite}
      />
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
