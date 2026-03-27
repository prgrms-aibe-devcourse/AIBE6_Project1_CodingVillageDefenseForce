'use client'


interface HeaderProps {
  placeholder?: string
  title?: string
  showSearch?: boolean
}

export default function Header({
  placeholder = '여행지 또는 태그를 검색하세요',
  title,
  showSearch = true,
}: HeaderProps) {
  return (
    <div className="flex items-center gap-2.5 border-b border-[#e8e6e0] bg-white px-7 py-3">
      {/* 페이지 타이틀 표시 (필요한 경우만) */}
      {title && (
        <div className="text-[18px] font-medium text-[#2c2c2a]">
          {title}
        </div>
      )}

      {/* 검색바 */}
      {/* 특정 페이지에서는 검색바를 숨길 수 있도록 옵션 제공 */}
      {showSearch ? (
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
      ) : (
        <div className="flex-1" />
      )}

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
