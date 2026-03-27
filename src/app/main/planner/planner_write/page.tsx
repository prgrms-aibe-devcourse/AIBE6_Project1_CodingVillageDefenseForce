'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Place {
  id: number
  title: string
  location: string
  image: string
}

function PlannerWritePage() {
  const supabase = createClient()
  const router = useRouter()
  // 기본 정보
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [people, setPeople] = useState<number | null>(null)
  const [budget, setBudget] = useState<number | null>(null)
  // UI 상태 관리
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false) // 날짜 선택 창 열림/닫힘
  const [isModalOpen, setIsModalOpen] = useState(false) // 장소 선택 모달 열림/닫힘
  // 장소 정보
  const [allPlaces, setAllPlaces] = useState<Place[]>([]) // DB의 모든 장소
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]) // 선택된 장소

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
            content: content || null,
            start_date: startDate || null,
            end_date: endDate || null,
            people: people,
            budget: budget,
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
    <div className="min-h-screen bg-[#F9FAFB] text-gray-800 font-sans pb-24">
      {/* 상단 헤더 영역 */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-8">
        <h1 className="text-4xl font-bold mb-4 tracking-tight">
          당신의 다음{' '}
          <span className="text-[#38D4BA]">걸작을 디자인하세요</span>
        </h1>
        <p className="text-gray-500 max-w-2xl leading-relaxed">
          맞춤형 여행 경험을 디자인하세요. 아래 캔버스를 채워 세계에서 가장
          숨겨진 보석들을 통한 선별된 여정을 시작하세요.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto px-6 space-y-12"
      >
        {/* 1. 기본 정보 입력 폼 */}
        <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100">
          <div className="w-10 h-1 bg-[#38D4BA] rounded-full mb-8"></div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                플랜 제목
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 서울 여행 계획"
                className="w-full bg-[#F4F5F7] rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#38D4BA]/50 transition-all placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                상세 설명
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="이번 여행의 기분, 목표, 영감을 설명해주세요..."
                className="w-full bg-[#F4F5F7] rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#38D4BA]/50 transition-all placeholder-gray-400 min-h-[140px] resize-none"
              />
            </div>

            {/* 날짜, 인원, 예산 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* 여행 일정 */}
              <div className="relative">
                <div
                  className="bg-[#F4F5F7] rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-200 transition"
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                >
                  <CalendarIcon className="w-6 h-6 text-[#38D4BA]" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">여행 일정</p>
                    <p className="text-sm font-medium">
                      {startDate && endDate
                        ? `${startDate} ~ ${endDate}`
                        : '날짜 선택'}
                    </p>
                  </div>
                </div>
                {isDatePickerOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-xl p-4 z-10 flex gap-2 border border-gray-100">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-[#38D4BA]"
                    />
                    <span className="self-center text-gray-400">~</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-[#38D4BA]"
                    />
                  </div>
                )}
              </div>

              {/* 여행 인원 */}
              <div className="bg-[#F4F5F7] rounded-2xl p-4 flex items-center gap-3 relative">
                <UsersIcon className="w-6 h-6 text-[#38D4BA]" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">여행 인원</p>
                  <select
                    onChange={(e) => setPeople(Number(e.target.value))}
                    className="w-full bg-transparent text-sm font-medium outline-none appearance-none cursor-pointer"
                  >
                    <option value="">인원 선택</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num}명
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 총 예산 */}
              <div className="bg-[#F4F5F7] rounded-2xl p-4 flex items-center gap-3">
                <WalletIcon className="w-6 h-6 text-[#38D4BA]" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">총 예산 (원)</p>
                  <input
                    type="number"
                    placeholder="예산 입력"
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full bg-transparent text-sm font-medium outline-none placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. 여행지 섹션 */}
        <div>
          <h2 className="text-2xl font-bold mb-2">여행지</h2>
          <p className="text-gray-500 mb-6">
            일자별 경로를 구축하기 시작하세요.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* 기본 장소 추가 버튼 */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex flex-col items-center justify-center h-80 rounded-3xl border-2 border-dashed border-gray-300 bg-[#F8F9FA] hover:bg-gray-50 transition-colors group"
            >
              <div className="w-12 h-12 bg-[#004D40] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <PlusIcon className="w-6 h-6 text-white" />
              </div>
              <span className="font-medium text-gray-800 mb-1">
                일정에 장소 추가
              </span>
              <span className="text-xs text-gray-400">
                지도를 검색하거나 지점을 드롭하세요
              </span>
            </button>

            {/* 선택된 장소 카드 리스트 */}
            {selectedPlaces.map((place) => (
              <div
                key={place.id}
                className="relative h-80 rounded-3xl overflow-hidden group shadow-sm"
              >
                <img
                  src={place.image || 'https://via.placeholder.com/400x500'}
                  alt={place.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                <div className="absolute bottom-6 left-6 right-6">
                  <span className="inline-block px-2 py-1 bg-[#38D4BA] text-white text-[10px] font-bold rounded mb-2">
                    선택됨
                  </span>
                  <h3 className="text-white font-bold text-lg mb-1">
                    {place.title}
                  </h3>
                  <div className="flex items-center text-gray-300 text-xs">
                    <MapPinIcon className="w-3 h-3 mr-1" />
                    {place.location}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemovePlace(place.id)}
                  className="absolute bottom-6 right-6 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                >
                  <MinusIcon className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 3. 하단 제출 버튼 영역 */}
        <div className="pt-10 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            className="bg-[#38D4BA] hover:bg-[#2ebfa6] text-white font-medium px-8 py-4 rounded-full shadow-lg shadow-[#38D4BA]/30 transition-all transform hover:-translate-y-1"
          >
            플랜 시작하기
          </button>
        </div>
      </form>

      {/* 4. 장소 선택 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-5xl max-h-[85vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
            >
              <CloseIcon className="w-5 h-5 text-gray-600" />
            </button>

            <h3 className="text-2xl font-bold mb-2">
              추가할 장소를 선택하세요
            </h3>
            <p className="text-gray-500 mb-8">
              일정에 추가하고 싶은 장소의 + 버튼을 클릭하세요.
            </p>

            {availablePlaces.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                더 이상 추가할 장소가 없습니다.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {availablePlaces.map((place) => (
                  <div
                    key={place.id}
                    className="relative h-80 rounded-3xl overflow-hidden group shadow-sm"
                  >
                    <img
                      src={place.image || 'https://via.placeholder.com/400x500'}
                      alt={place.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    <div className="absolute bottom-6 left-6 right-6">
                      <span className="inline-block px-2 py-1 bg-[#38D4BA] text-white text-[10px] font-bold rounded mb-2">
                        여행 일정
                      </span>
                      <h3 className="text-white font-bold text-lg mb-1">
                        {place.title}
                      </h3>
                      <div className="flex items-center text-gray-300 text-xs">
                        <MapPinIcon className="w-3 h-3 mr-1" />
                        {place.location}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddPlace(place)}
                      className="absolute bottom-6 right-6 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-[#38D4BA] transition-colors"
                    >
                      <PlusIcon className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  )
}
function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  )
}
function WalletIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
      <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path>
      <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path>
    </svg>
  )
}
function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  )
}
function MinusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  )
}
function MapPinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  )
}
function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  )
}

export default PlannerWritePage
