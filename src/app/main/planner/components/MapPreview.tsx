'use client'

interface Props {
  onOpen: () => void
}

export default function MapPreview({ onOpen }: Props) {
  return (
    <div className="relative flex h-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-[12px] bg-[#e8e6e0]">
      {/* 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#d4e8d4] via-[#c8dfc8] to-[#b8d4b8]" />
      {/* 격자 */}
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
        <circle cx="130" cy="90" r="8" fill="#1D9E75" opacity="0.9" />
        <circle cx="180" cy="70" r="6" fill="#1D9E75" opacity="0.7" />
        <circle cx="100" cy="120" r="6" fill="#1D9E75" opacity="0.7" />
      </svg>
      {/* 버튼 */}
      <button
        onClick={onOpen}
        className="relative z-10 flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-[13px] font-medium text-[#2c2c2a] shadow-md transition hover:shadow-lg"
      >
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
  )
}
