// components/layout/Header.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'

interface HeaderProps {
  placeholder?: string
  title?: string
  showSearch?: boolean
}

function HeaderContent({
  placeholder = '어디로 떠나고 싶으신가요?',
}: HeaderProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('query') ?? '')

  const handleSearch = () => {
    if (!query.trim()) return
    const params = new URLSearchParams(searchParams.toString())
    params.set('query', query.trim())
    router.push(`/main/subpage?${params.toString()}`)
  }

  return (
    <header className="flex items-center gap-3 px-7 py-4 border-b border-[#e8e6e0] bg-white">
      <div className="flex flex-1 items-center gap-2 rounded-xl bg-[#f7f6f3] border border-[#e8e6e0] px-4 py-2.5">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="#888"
          strokeWidth="1.8"
        >
          <circle cx="6.5" cy="6.5" r="4.5" />
          <path d="M10.5 10.5L14 14" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-[14px] text-[#2c2c2a] outline-none placeholder:text-[#aaa]"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="text-[#aaa] hover:text-[#888]"
          >
            ×
          </button>
        )}
      </div>
      <button
        onClick={handleSearch}
        className="rounded-xl bg-[#00BFA5] px-4 py-2.5 text-[13px] font-medium text-white hover:bg-[#0F6E56] transition"
      >
        검색
      </button>
    </header>
  )
}

export default function Header({ placeholder }: HeaderProps) {
  return (
    <Suspense
      fallback={<div className="h-[65px] border-b border-[#e8e6e0] bg-white" />}
    >
      <HeaderContent placeholder={placeholder} />
    </Suspense>
  )
}
