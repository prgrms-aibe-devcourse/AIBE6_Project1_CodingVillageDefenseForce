interface Theme {
  id: string
  emoji: string
  label: string
  bg: string
}

interface TagCardProps {
  theme: Theme
  isSelected: boolean
  onToggle: (id: string) => void
}

export default function TagCard({ theme, isSelected, onToggle }: TagCardProps) {
  return (
    <div
      onClick={() => onToggle(theme.id)}
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
        <div className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#1D9E75]">
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
}
