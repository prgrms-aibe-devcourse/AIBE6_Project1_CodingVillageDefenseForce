import Link from 'next/link'

interface SearchHeaderProps {
  showFilter: boolean
  onToggleFilter: () => void
}

export default function SearchHeader({
  showFilter,
  onToggleFilter,
}: SearchHeaderProps) {
  return (
    <div className="flex items-center justify-between px-7 py-4 border-b border-[#e8e6e0] bg-white">
      <div className="flex items-center gap-3">
        <Link
          href="/main"
          className="flex items-center justify-center w-9 h-9 rounded-full bg-[#f7f6f3] border border-[#e8e6e0] hover:bg-[#e8e6e0] transition"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 18 18"
            fill="none"
            stroke="#2c2c2a"
            strokeWidth="2"
          >
            <path d="M11 3L5 9l6 6" />
          </svg>
        </Link>
        <h2 className="text-[20px] font-medium text-[#2c2c2a]">검색 결과</h2>
      </div>
      <button
        onClick={onToggleFilter}
        className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-medium transition
          ${showFilter ? 'bg-[#1D9E75] text-white' : 'bg-[#f5f5f4] text-[#292524] hover:bg-[#e8e6e0]'}`}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M1 3h12M3 7h8M5 11h4" />
        </svg>
        필터
      </button>
    </div>
  )
}
