'use client'

import type { PlanFormData } from '../lib/plannerAPI'
import { CalendarIcon, UsersIcon, WalletIcon } from './Icons'

interface Props {
  formData: PlanFormData
  onUpdate: <K extends keyof PlanFormData>(
    key: K,
    value: PlanFormData[K],
  ) => void
  isDatePickerOpen: boolean
  onToggleDatePicker: () => void
}

export default function PlannerWriteForm({
  formData,
  onUpdate,
  isDatePickerOpen,
  onToggleDatePicker,
}: Props) {
  return (
    <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100">
      <div className="w-10 h-1 bg-[#38D4BA] rounded-full mb-8" />

      <div className="space-y-6">
        {/* 플랜 제목 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            플랜 제목
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => onUpdate('title', e.target.value)}
            placeholder="예: 서울 여행 계획"
            className="w-full bg-[#F4F5F7] rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#38D4BA]/50 transition-all placeholder-gray-400"
          />
        </div>

        {/* 상세 설명 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            상세 설명
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => onUpdate('content', e.target.value)}
            placeholder="이번 여행의 기분, 목표, 영감을 설명해주세요..."
            className="w-full bg-[#F4F5F7] rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#38D4BA]/50 transition-all placeholder-gray-400 min-h-[140px] resize-none"
          />
        </div>

        {/* 날짜 / 인원 / 예산 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* 여행 일정 */}
          <div className="relative">
            <div
              className="bg-[#F4F5F7] rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-200 transition"
              onClick={onToggleDatePicker}
            >
              <CalendarIcon className="w-6 h-6 text-[#38D4BA]" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">여행 일정</p>
                <p className="text-sm font-medium">
                  {formData.startDate && formData.endDate
                    ? `${formData.startDate} ~ ${formData.endDate}`
                    : '날짜 선택'}
                </p>
              </div>
            </div>
            {isDatePickerOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-xl p-4 z-10 flex gap-2 border border-gray-100">
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => onUpdate('startDate', e.target.value)}
                  className="border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-[#38D4BA]"
                />
                <span className="self-center text-gray-400">~</span>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => onUpdate('endDate', e.target.value)}
                  className="border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-[#38D4BA]"
                />
              </div>
            )}
          </div>

          {/* 여행 인원 */}
          <div className="bg-[#F4F5F7] rounded-2xl p-4 flex items-center gap-3">
            <UsersIcon className="w-6 h-6 text-[#38D4BA]" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">여행 인원</p>
              <select
                value={formData.people ?? ''}
                onChange={(e) => onUpdate('people', Number(e.target.value))}
                className="w-full bg-transparent text-sm font-medium outline-none appearance-none cursor-pointer"
              >
                <option value="">인원 선택</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>
                    {n}명
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
                value={formData.budget ?? ''}
                onChange={(e) => onUpdate('budget', Number(e.target.value))}
                className="w-full bg-transparent text-sm font-medium outline-none placeholder-gray-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
