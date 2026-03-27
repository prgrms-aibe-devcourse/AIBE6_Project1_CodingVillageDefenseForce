'use client'

import Header from '@/components/layout/Header'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Place {
  id: number
  title: string
  content: string
  location: string
  image: string // url 정보
  location_id: number // 지역 id
}

interface Place_Planner {
  id: number
  place: Place
}

interface Planner {
  id: number
  user_id: number
  title: string
  content: string
  start_date: string
  end_date: string
  budget: number
  people: number
  place_planners: Place_Planner[]
}

export default function PlannerPage() {
  const router = useRouter()
  const [planners, setPlanners] = useState<Planner[]>([])
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null)

  const fetchPlanner = async () => {
    const { data: Planner, error } = await supabase
      .from('planner')
      .select(
        `
      *, place_planners:place_planner(id, place(id, title, content, location, image, location_id))`,
      )
      .order('id', { ascending: false })
    if (error) {
      console.error('플래너 에러:', error)
      return
    }
    setPlanners(Planner ?? [])
  }

  useEffect(() => {
    fetchPlanner()
  }, [])

  const selectedPlan = planners.find((plan) => plan.id === selectedPlanId)

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* 검색바 */}
      <Header placeholder="플랜이나 장소 검색..." />

      {/* 2컬럼 레이아웃 */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── 왼쪽: 플랜 목록 ── */}
        <div className="flex w-[300px] flex-shrink-0 flex-col overflow-hidden border-r border-[#e8e6e0] bg-white">
          {/* 헤더 */}
          <div className="border-b border-[#e8e6e0] px-5 py-5">
            <h2 className="text-[16px] font-medium text-[#2c2c2a] mb-0.5">
              내 여행 플랜
            </h2>
            <p className="text-[12px] text-[#888]">
              당신만의 특별한 여정을 관리하세요.
            </p>
          </div>

          {/* 플랜 카드 목록 */}
          {planners.length === 0 ? (
            <div className="flex flex-1 items-center justify-center p-5">
              <p className="text-[12px] text-[#888]">생성된 플랜이 없습니다.</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-3">
                <p className="mb-2 px-1 text-[12px] font-medium text-[#888]">
                  진행 중인 플랜
                </p>
                {planners.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`mb-2.5 cursor-pointer rounded-[12px] border p-3.5 transition-all
                  ${
                    selectedPlanId === plan.id
                      ? 'border-[#1D9E75] bg-[#f0fdf8]'
                      : 'border-[#e8e6e0] hover:border-[#1D9E75] hover:bg-[#f9fffe]'
                  }`}
                  >
                    <div className="mb-1.5 flex items-start justify-between">
                      <span className="text-[14px] font-medium text-[#2c2c2a]">
                        {plan.title}
                      </span>
                      <span className="rounded-full bg-[#1D9E75] px-2 py-0.5 text-[11px] text-white">
                        장소 {plan.place_planners?.length || 0}곳
                      </span>
                    </div>
                    <p className="mb-2 text-[12px] text-[#888]">
                      {plan.start_date} ~ {plan.end_date}
                    </p>
                    <span className="flex items-center gap-1 text-[12px] font-medium text-[#1D9E75]">
                      플랜 상세보기 →
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* 새 플랜 버튼 */}
          <div className="border-t border-[#e8e6e0] p-3">
            <Link href={'/main/planner/planner_write'}>
              <button className="flex w-full items-center justify-center gap-1.5 rounded-full bg-[#1D9E75] py-2.5 text-[13px] font-medium text-white transition hover:bg-[#0F6E56]">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M7 2v10M2 7h10" />
                </svg>
                새 플랜 만들기
              </button>
            </Link>
          </div>
        </div>

        {/* ── 오른쪽: 플랜 상세 ── */}
        <div className="flex flex-1 flex-col overflow-hidden bg-[#f7f6f3]">
          {/* 상세 헤더 */}
          {!selectedPlanId ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8e6e0]">
                🗺️
              </div>
              <h3 className="mb-2 text-lg font-medium text-[#2c2c2a]">
                아직 선택된 플랜이 없어요
              </h3>
              <p className="text-sm text-[#888]">
                왼쪽에서 플랜을 선택하거나
                <br />
                <span className="text-[#1D9E75] font-medium">
                  새 플랜 만들기
                </span>
                를 눌러 여러분만의 여행계획을 세워주세요!
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-[#e8e6e0] bg-white px-6 py-4">
                <div>
                  <p className="mb-1 text-[10px] font-medium uppercase tracking-[2px] text-[#1D9E75]">
                    Detail View
                  </p>
                  <h2 className="text-[18px] font-medium text-[#2c2c2a]">
                    {selectedPlan?.title}
                  </h2>
                </div>
                <div className="flex gap-2">
                  {/* 편집 */}
                  <button
                    onClick={
                      () =>
                        router.push(
                          `/main/planner/planner_write?id=${selectedPlanId}`,
                        ) /* 수정 페이지로 이동 */
                    }
                    className="flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-[#e8e6e0] bg-white text-[#888] transition hover:bg-[#f7f6f3] hover:text-[#2c2c2a]"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M10.5 2.5l2 2-7 7H3.5v-2l7-7z" />
                    </svg>
                  </button>
                  {/* 공유 */}
                  <button className="flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-[#e8e6e0] bg-white text-[#888] transition hover:bg-[#f7f6f3] hover:text-[#2c2c2a]">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <circle cx="11" cy="3" r="1.5" />
                      <circle cx="11" cy="12" r="1.5" />
                      <circle cx="3" cy="7.5" r="1.5" />
                      <path d="M9.5 3.7L4.5 6.8M9.5 11.3L4.5 8.2" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 상세 바디 */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                {/* 장소 목록 */}
                <div className="mb-3">
                  {selectedPlan?.place_planners?.map((place_planner) => {
                    const machedPlace = place_planner.place
                    if (!machedPlace) return null
                    return (
                      <div
                        key={place_planner.id}
                        className="mb-2.5 flex items-center gap-3.5 rounded-[12px] border border-[#e8e6e0] bg-white px-4 py-3.5 transition hover:shadow-md"
                      >
                        {/* 썸네일 */}
                        <div
                          className="h-[54px] w-[54px] flex-shrink-0 rounded-lg bg-cover bg-center"
                          style={{
                            backgroundImage: `url('${machedPlace.image}')`,
                          }}
                        />
                        {/* 정보 */}
                        <div className="flex-1">
                          <p className="text-[14px] font-medium text-[#2c2c2a]">
                            {machedPlace.title}
                          </p>
                          <p className="text-[12px] text-[#888]">
                            {machedPlace.location}
                          </p>
                          {machedPlace.content && (
                            <p className="mt-0.5 text-[11px] italic text-[#aaa]">
                              {machedPlace.content}
                            </p>
                          )}
                        </div>
                        {/* 드래그 핸들 */}
                        <div className="cursor-grab text-[#ccc] hover:text-[#888] p-1">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path d="M4 5h8M4 8h8M4 11h8" />
                          </svg>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* 장소 추가 버튼 */}
                <button className="mb-4 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-[12px] border-[1.5px] border-dashed border-[#d0d0d0] bg-transparent py-3.5 text-[13px] text-[#aaa] transition hover:border-[#1D9E75] hover:bg-[#f0fdf8] hover:text-[#1D9E75]">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M7 2v10M2 7h10" />
                  </svg>
                  장소 추가하기
                </button>

                {/* 지도 영역 */}
                <div className="relative flex h-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-[12px] bg-[#e8e6e0]">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#d4e8d4] via-[#c8dfc8] to-[#b8d4b8]" />
                  <svg
                    className="absolute inset-0 opacity-30"
                    viewBox="0 0 300 200"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <pattern
                        id="grid"
                        width="30"
                        height="30"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 30 0 L 0 0 0 30"
                          fill="none"
                          stroke="#5f5e5a"
                          strokeWidth="0.5"
                        />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    <line
                      x1="0"
                      y1="60"
                      x2="300"
                      y2="60"
                      stroke="#5f5e5a"
                      strokeWidth="1.5"
                      opacity="0.5"
                    />
                    <line
                      x1="0"
                      y1="130"
                      x2="300"
                      y2="130"
                      stroke="#5f5e5a"
                      strokeWidth="1.5"
                      opacity="0.5"
                    />
                    <line
                      x1="80"
                      y1="0"
                      x2="80"
                      y2="200"
                      stroke="#5f5e5a"
                      strokeWidth="1.5"
                      opacity="0.5"
                    />
                    <line
                      x1="200"
                      y1="0"
                      x2="200"
                      y2="200"
                      stroke="#5f5e5a"
                      strokeWidth="1.5"
                      opacity="0.5"
                    />
                    <circle
                      cx="130"
                      cy="90"
                      r="8"
                      fill="#1D9E75"
                      opacity="0.9"
                    />
                    <circle
                      cx="180"
                      cy="70"
                      r="6"
                      fill="#1D9E75"
                      opacity="0.7"
                    />
                    <circle
                      cx="100"
                      cy="120"
                      r="6"
                      fill="#1D9E75"
                      opacity="0.7"
                    />
                  </svg>
                  <button className="relative z-10 flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-[13px] font-medium text-[#2c2c2a] shadow-md transition hover:shadow-lg">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M7 1C4.8 1 3 2.8 3 5c0 3.5 4 8 4 8s4-4.5 4-8c0-2.2-1.8-4-4-4z" />
                      <circle cx="7" cy="5" r="1.5" />
                    </svg>
                    지도에서 보기
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
