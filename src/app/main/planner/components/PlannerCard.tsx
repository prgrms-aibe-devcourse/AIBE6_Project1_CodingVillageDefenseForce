'use client'

import type { Planner } from '../types/planner_type'

interface Props {
  plan: Planner
  isSelected: boolean
  onClick: () => void
}

export default function PlannerCard({ plan, isSelected, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`mb-2.5 cursor-pointer rounded-[12px] border p-3.5 transition-all ${
        isSelected
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
        플랜 상세보기
      </span>
    </div>
  )
}
