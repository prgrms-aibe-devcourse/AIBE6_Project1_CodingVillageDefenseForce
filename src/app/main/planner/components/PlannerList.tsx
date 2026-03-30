'use client'

import Link from 'next/link'
import type { Planner } from '../types/planner_type'
import PlannerCard from './PlannerCard'

interface Props {
  planners: Planner[]
  selectedPlanId: number | null
  onSelect: (id: number) => void
}

export default function PlannerList({
  planners,
  selectedPlanId,
  onSelect,
}: Props) {
  return (
    <div className="flex w-[300px] flex-shrink-0 flex-col overflow-hidden border-r border-[#e8e6e0] bg-white">
      {/* 헤더 */}
      <div className="border-b border-[#e8e6e0] px-5 py-5">
        <h2 className="mb-0.5 text-[16px] font-medium text-[#2c2c2a]">
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
        <div className="flex-1 overflow-y-auto p-3">
          <p className="mb-2 px-1 text-[12px] font-medium text-[#888]">
            진행 중인 플랜
          </p>
          {planners.map((plan) => (
            <PlannerCard
              key={plan.id}
              plan={plan}
              isSelected={selectedPlanId === plan.id}
              onClick={() => onSelect(plan.id)}
            />
          ))}
        </div>
      )}

      {/* 새 플랜 버튼 */}
      <div className="border-t border-[#e8e6e0] p-3">
        <Link href="/main/planner/planner_write">
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
  )
}
