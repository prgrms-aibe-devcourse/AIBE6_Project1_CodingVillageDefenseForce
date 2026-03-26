'use client'

import TagGrid from '@/components/home/TagGrid'
import Header from '@/components/layout/Header'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

// emoji 매핑 (category 이름으로 매핑)
const EMOJI_MAP: Record<string, string> = {
  힐링: '🌿',
  액티비티: '🧗',
  '감성 카페': '☕',
  맛집: '🍜',
  야경: '🌃',
  자연: '🏔',
  쇼핑: '🛍',
  문화: '🏛',
}

// 이미지 매핑
const IMAGE_MAP: Record<string, string> = {
  힐링: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=60',
  액티비티:
    'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=60',
  '감성 카페':
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&q=60',
  맛집: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=60',
  야경: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=60',
  자연: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=60',
  쇼핑: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&q=60',
  문화: 'https://images.unsplash.com/photo-1481833761820-0509d3217039?w=400&q=60',
}

export default function HomePage() {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [themes, setThemes] = useState<
    { id: string; emoji: string; label: string; bg: string }[]
  >([])

  useEffect(() => {
    const fetchTags = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.from('tag').select('*')
      if (error) {
        console.error('태그 에러:', error)
        return
      }

      // DB 데이터를 테마 카드 형식으로 변환
      const formatted = data.map((tag) => ({
        id: String(tag.id),
        emoji: EMOJI_MAP[tag.category] ?? '📍',
        label: tag.category,
        bg: IMAGE_MAP[tag.category] ?? '',
      }))
      setThemes(formatted)
    }
    fetchTags()
  }, [])

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header placeholder="여행지 또는 태그를 검색하세요" />
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
            const theme = themes.find((t) => t.id === id)!
            return (
              <span
                key={id}
                onClick={() => toggle(id)}
                className="flex cursor-pointer items-center gap-1.5 rounded-full bg-[#1D9E75] px-3 py-1.5 text-[12px] text-white transition-colors hover:bg-[#0F6E56]"
              >
                {theme?.emoji} {theme?.label}
                <span className="text-[13px] opacity-80">×</span>
              </span>
            )
          })}
          <span className="flex cursor-pointer items-center gap-1 rounded-full border border-dashed border-[#ccc] px-3 py-1.5 text-[12px] text-[#aaa] transition-all hover:border-[#1D9E75] hover:text-[#1D9E75]">
            + 더 추가하기
          </span>
        </div>

        {/* 테마 그리드 */}
        {themes.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-[#bbb] text-[14px]">
            로딩 중...
          </div>
        ) : (
          <TagGrid themes={themes} selected={selected} onToggle={toggle} />
        )}
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
          className="flex items-center gap-1.5 rounded-full bg-[#1D9E75] px-7 py-3 text-[14px] font-medium text-white transition-all hover:bg-[#0F6E56] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-[#ccc] disabled:translate-y-0"
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
  )
}
