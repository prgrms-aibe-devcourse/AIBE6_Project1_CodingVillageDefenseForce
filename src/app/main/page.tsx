'use client'

import { useState } from 'react'

const THEMES = [
  {
    id: 'healing',
    emoji: '🌿',
    label: '힐링',
    bg: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=60',
  },
  {
    id: 'activity',
    emoji: '🧗',
    label: '액티비티',
    bg: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=60',
  },
  {
    id: 'cafe',
    emoji: '☕',
    label: '감성 카페',
    bg: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&q=60',
  },
  {
    id: 'food',
    emoji: '🍜',
    label: '맛집',
    bg: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=60',
  },
  {
    id: 'night',
    emoji: '🌃',
    label: '야경',
    bg: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=60',
  },
  {
    id: 'nature',
    emoji: '🏔',
    label: '자연',
    bg: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=60',
  },
  {
    id: 'shopping',
    emoji: '🛍',
    label: '쇼핑',
    bg: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&q=60',
  },
  {
    id: 'culture',
    emoji: '🏛',
    label: '문화',
    bg: 'https://images.unsplash.com/photo-1481833761820-0509d3217039?w=400&q=60',
  },
]

const NAV_ITEMS = [
  {
    id: 'home',
    label: 'Home',
    icon: (
      <svg
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        width="18"
        height="18"
      >
        <path d="M3 9L9 3l6 6" />
        <path d="M5 7v7h3v-4h2v4h3V7" />
      </svg>
    ),
  },
  {
    id: 'favorites',
    label: 'Favorites',
    icon: (
      <svg
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        width="18"
        height="18"
      >
        <path d="M3 5.5A2.5 2.5 0 018 4a2.5 2.5 0 015 1.5c0 4-5 8-5 8s-5-4-5-8z" />
      </svg>
    ),
  },
  {
    id: 'planner',
    label: 'Travel Planner',
    icon: (
      <svg
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        width="18"
        height="18"
      >
        <rect x="2" y="3" width="14" height="13" rx="2" />
        <path d="M6 1v4M12 1v4M2 8h14" />
      </svg>
    ),
  },
  {
    id: 'mypage',
    label: 'My Page',
    icon: (
      <svg
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        width="18"
        height="18"
      >
        <circle cx="9" cy="6" r="3" />
        <path d="M3 16c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      </svg>
    ),
  },
]

export default function HomePage() {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [activeNav, setActiveNav] = useState('home')

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f6f3]">
      {/* ── Sidebar ── */}
      <aside className="flex w-[220px] flex-shrink-0 flex-col border-r border-[#e8e6e0] bg-white py-6">
        {/* 로고 */}
        <div className="flex items-center gap-2 px-5 pb-7">
          <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
            <path
              d="M14 2C9.6 2 6 5.6 6 10C6 16 14 26 14 26C14 26 22 16 22 10C22 5.6 18.4 2 14 2Z"
              fill="#1D9E75"
            />
            <circle cx="14" cy="10" r="3.5" fill="white" />
          </svg>
          <div>
            <span
              className="block text-[18px] font-bold text-[#2c2c2a]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Tripick
            </span>
            <span className="block text-[9px] tracking-[2px] text-[#aaa] uppercase">
              Curated Voyages
            </span>
          </div>
        </div>

        {/* 네비 */}
        <nav className="flex flex-col gap-0.5 px-2">
          {NAV_ITEMS.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveNav(id)}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[14px] transition-all text-left
                ${
                  activeNav === id
                    ? 'bg-[#E1F5EE] text-[#0F6E56] font-medium'
                    : 'text-[#888] hover:bg-[#f7f6f3] hover:text-[#2c2c2a]'
                }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </nav>

        <div className="flex-1" />

        {/* 유저 */}
        <div className="mx-2 flex items-center gap-2.5 rounded-lg border border-[#e8e6e0] px-3 py-2.5 cursor-pointer hover:bg-[#f7f6f3]">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#1D9E75] text-[13px] font-medium text-white">
            A
          </div>
          <div>
            <p className="text-[13px] font-medium text-[#2c2c2a]">Alex Kim</p>
            <p className="text-[11px] text-[#aaa]">Premium Member</p>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 검색바 */}
        <div className="flex items-center gap-3 border-b border-[#e8e6e0] bg-white px-7 py-3">
          <div className="flex flex-1 items-center gap-2 rounded-[10px] border border-[#e8e6e0] bg-[#f7f6f3] px-3.5 py-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="#aaa"
              strokeWidth="1.5"
            >
              <circle cx="7" cy="7" r="4.5" />
              <path d="M10.5 10.5L14 14" />
            </svg>
            <input
              type="text"
              placeholder="여행지 또는 태그를 검색하세요"
              className="flex-1 bg-transparent text-[13px] text-[#2c2c2a] placeholder-[#bbb] outline-none"
            />
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="flex-1 overflow-y-auto px-7 py-7">
          <h1 className="text-[22px] font-medium text-[#2c2c2a] mb-1.5">
            어떤 여행을 원하세요?
          </h1>
          <p className="text-[13px] text-[#888] mb-6">
            테마를 선택하면 딱 맞는 여행지를 추천해드려요
          </p>

          {/* 선택된 테마 칩 */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="text-[12px] text-[#888] mr-1">선택된 테마</span>
            {[...selected].map((id) => {
              const theme = THEMES.find((t) => t.id === id)!
              return (
                <span
                  key={id}
                  onClick={() => toggle(id)}
                  className="flex cursor-pointer items-center gap-1.5 rounded-full bg-[#1D9E75] px-3 py-1.5
                    text-[12px] text-white transition-colors hover:bg-[#0F6E56]"
                >
                  {theme.emoji} {theme.label}
                  <span className="text-[13px] opacity-80">×</span>
                </span>
              )
            })}
            <span
              className="flex cursor-pointer items-center gap-1 rounded-full border border-dashed border-[#ccc]
              px-3 py-1.5 text-[12px] text-[#aaa] transition-all hover:border-[#1D9E75] hover:text-[#1D9E75]"
            >
              + 더 추가하기
            </span>
          </div>

          {/* 테마 그리드 */}
          <div className="grid grid-cols-4 gap-3.5">
            {THEMES.map((theme) => {
              const isSelected = selected.has(theme.id)
              return (
                <div
                  key={theme.id}
                  onClick={() => toggle(theme.id)}
                  className={`relative aspect-square cursor-pointer overflow-hidden rounded-[14px] transition-all
                    hover:-translate-y-0.5 hover:shadow-xl
                    ${
                      isSelected
                        ? 'ring-2 ring-[#1D9E75] ring-offset-2 shadow-lg'
                        : 'ring-2 ring-transparent'
                    }`}
                >
                  {/* 배경 이미지 */}
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${theme.bg}')` }}
                  />
                  {/* 오버레이 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  {/* 라벨 */}
                  <span className="absolute bottom-3 left-3 text-[14px] font-medium text-white">
                    {theme.emoji} {theme.label}
                  </span>
                  {/* 체크 */}
                  {isSelected && (
                    <div
                      className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center
                      rounded-full bg-[#1D9E75]"
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 13 13"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                      >
                        <path d="M2 6.5l3.5 3.5 5.5-6" />
                      </svg>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* 하단 바 */}
        <div className="flex items-center justify-between border-t border-[#e8e6e0] bg-white px-7 py-3.5">
          <span className="text-[13px] text-[#888]">
            {selected.size === 0 ? (
              '테마를 선택해주세요'
            ) : (
              <>
                <strong className="font-medium text-[#2c2c2a]">
                  {selected.size}개
                </strong>
                의 테마가 선택되었습니다
              </>
            )}
          </span>
          <button
            disabled={selected.size === 0}
            className="flex items-center gap-1.5 rounded-full bg-[#1D9E75] px-7 py-3 text-[14px]
              font-medium text-white transition-all hover:bg-[#0F6E56] hover:-translate-y-0.5
              disabled:cursor-not-allowed disabled:bg-[#ccc] disabled:translate-y-0"
          >
            추천받기
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
