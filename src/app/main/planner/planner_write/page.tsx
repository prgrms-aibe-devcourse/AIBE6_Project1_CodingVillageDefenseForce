'use client'

import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Place {
  id: number
  title: string
  location: string
  image: string
}

function PlannerWritePage() {
  const router = useRouter()
  // 기본 정보
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [people, setPeople] = useState<number | null>(null)
  const [budget, setBudget] = useState<number | null>(null)
  // UI 상태 관리 (날짜 선택 창 열림/닫힘)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  // 장소 정보
  const [allPlaces, setAllPlaces] = useState<Place[]>([]) // DB의 모든 장소
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]) // 선택된 장소
  const [isModalOpen, setIsModalOpen] = useState(false) // 장소 선택 모달 열림/닫힘

  const fetchPlaces = async () => {
    const { data, error } = await supabase
      .from('place')
      .select('id, title, location, image')
    if (error) {
      console.error('장소 불러오기 실패:', error)
      return
    }
    setAllPlaces(data ?? [])
  }

  useEffect(() => {
    fetchPlaces()
  }, [])

  // 선택 안된 장소 필터링
  const availablePlaces = allPlaces.filter((place) => {
    return !selectedPlaces.some((selected) => selected.id === place.id)
  })

  // 장소 추가 핸들러
  const handleAddPlace = (place: Place) => {
    if (selectedPlaces.some((p) => p.id === place.id)) return
    setSelectedPlaces([...selectedPlaces, place])
    setIsModalOpen(false)
  }

  // 장소 삭제 핸들러
  const handleRemovePlace = (placeId: number) => {
    setSelectedPlaces(selectedPlaces.filter((p) => p.id !== placeId))
  }

  // 폼 제출 핸들러(DB 저장)
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!title) {
      alert('플랜 제목을 입력해주세요')
      return
    }
    if (startDate && endDate && startDate > endDate) {
      alert('종료일이 시작일보다 빠릅니다')
      return
    }

    // 로그인 체크(user 가져오기)
    const { data: userData, error: userError } = await supabase.auth.getUser()

    console.log('현재 유저 데이터:', userData)

    if (userError || !userData?.user) {
      alert('로그인이 필요합니다')
      return
    }

    try {
      const { data: user, error: userError } = await supabase
        .from('user')
        .select('id')
        .eq('uid', userData.user.id)
        .single()

      if (userError || !user) {
        console.error('유저 매핑 실패:', userError)
        alert('유저 정보를 불러오는 데 실패했습니다.')
        return
      }
      // 플래너 저장
      const { data: plannerData, error: plannerError } = await supabase
        .from('planner')
        .insert([
          {
            user_id: user.id,
            title,
            content,
            start_date: startDate,
            end_date: endDate,
            people,
            budget,
          },
        ])
        .select()
        .single()

      if (plannerError) throw plannerError

      // 장소를 골랐다면 place_planner 테이블에 저장
      if (selectedPlaces.length > 0) {
        const placeIds = selectedPlaces.map((place) => ({
          planner_id: plannerData.id,
          place_id: place.id,
        }))
        const { error: placePlannersError } = await supabase
          .from('place_planner')
          .insert(placeIds)
        if (placePlannersError) throw placePlannersError
      }

      alert('플랜이 성공적으로 저장되었습니다!')
      router.push('/main/planner')
    } catch (error) {
      console.error('플랜 저장 실패:', error)
      alert('플랜 저장 중 오류가 발생했습니다.')
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* 1. 플랜 제목 & 내용 (Input & Textarea) */}
        <div>
          <label>제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="플랜 제목"
          />
        </div>
        <div>
          <label>내용: </label>
          <textarea
            placeholder="플래 내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        {/* 2. 날짜 선택 (버튼 클릭 시 달력 input 표시) */}
        <div>
          <label>여행 일정: </label>
          <button
            type="button"
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
          >
            {startDate && endDate
              ? `${startDate} ~ ${endDate}`
              : '날짜 선택하기'}
          </button>
          {isDatePickerOpen && (
            <div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          )}
        </div>
        {/* 3. 인원 (드롭다운/Select) */}
        <div>
          <label>인원: </label>
          <select onChange={(e) => setPeople(Number(e.target.value))}>
            <option value="">인원 선택</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={String(num)}>
                {num}명
              </option>
            ))}
            <option value="10+">10명 이상</option>
          </select>
        </div>
        {/* 4. 예산 (Input) */}
        <div>
          <label>예산: </label>
          <input
            type="number"
            placeholder="예산 입력 (원)"
            onChange={(e) => setBudget(Number(e.target.value))}
          />
        </div>
        {/* 5. 장소 선택 (모달) */}
        <div>
          <button type="button" onClick={() => setIsModalOpen(true)}>
            장소 추가 리스트 열기
          </button>
          {/* 선택한 장소 목록 보여주기 */}
          <ul>
            {selectedPlaces.map((place) => (
              <li key={place.id}>
                {place.title}
                <button
                  type="button"
                  onClick={() => handleRemovePlace(place.id)}
                >
                  빼기
                </button>
              </li>
            ))}
          </ul>
        </div>
        <button type="submit">플랜 저장</button>
      </form>
      {/* 6. 아직 고르지 않은 장소 리스트 (모달 역할) */}
      {isModalOpen && (
        <div>
          <hr />
          <h3>추가할 장소를 선택하세요</h3>
          <button type="button" onClick={() => setIsModalOpen(false)}>
            닫기
          </button>
          <ul>
            {availablePlaces.length === 0 ? (
              <li>더 이상 추가할 장소가 없습니다.</li>
            ) : (
              availablePlaces.map((place) => (
                <li key={place.id}>
                  {place.title}
                  <button type="button" onClick={() => handleAddPlace(place)}>
                    선택
                  </button>
                </li>
              ))
            )}
          </ul>
          <hr />
        </div>
      )}
    </div>
  )
}

export default PlannerWritePage
