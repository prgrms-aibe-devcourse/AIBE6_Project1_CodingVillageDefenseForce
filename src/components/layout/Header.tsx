'use client'

interface HeaderProps {
  placeholder?: string
}

export default function Header({
  placeholder = '여행지 또는 태그를 검색하세요',
}: HeaderProps) {
  return (
    <div className="flex items-center gap-2.5 border-b border-[#e8e6e0] bg-white px-7 py-3">
      {/* 검색바 */}
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
          placeholder={placeholder}
          className="flex-1 bg-transparent text-[13px] text-[#2c2c2a] placeholder-[#bbb] outline-none"
        />
      </div>

      {/* 알림 */}
      <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e8e6e0] bg-white text-[#888] transition hover:bg-[#f7f6f3] hover:text-[#2c2c2a]">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M8 2a4 4 0 014 4c0 3 1 4 1 4H3s1-1 1-4a4 4 0 014-4z" />
          <path d="M7 14h2" />
        </svg>
      </button>

      {/* 설정 */}
      <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e8e6e0] bg-white text-[#888] transition hover:bg-[#f7f6f3] hover:text-[#2c2c2a]">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="8" cy="8" r="2.5" />
          <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.2 3.2l1.4 1.4M11.4 11.4l1.4 1.4M3.2 12.8l1.4-1.4M11.4 4.6l1.4-1.4" />
        </svg>
      </button>
    </div>
  )
}
