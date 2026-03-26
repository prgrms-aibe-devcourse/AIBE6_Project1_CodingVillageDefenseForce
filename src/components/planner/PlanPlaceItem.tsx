interface Place {
  num: number
  name: string
  desc: string
  memo: string
  bg: string
}

interface PlanPlaceItemProps {
  place: Place
}

export default function PlanPlaceItem({ place }: PlanPlaceItemProps) {
  return (
    <div className="mb-2.5 flex items-center gap-3.5 rounded-[12px] border border-[#e8e6e0] bg-white px-4 py-3.5 transition hover:shadow-md">
      {/* 번호 */}
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#1D9E75] text-[13px] font-medium text-white">
        {place.num}
      </div>
      {/* 썸네일 */}
      <div
        className="h-[54px] w-[54px] flex-shrink-0 rounded-lg bg-cover bg-center"
        style={{ backgroundImage: `url('${place.bg}')` }}
      />
      {/* 정보 */}
      <div className="flex-1">
        <p className="text-[14px] font-medium text-[#2c2c2a]">{place.name}</p>
        <p className="text-[12px] text-[#888]">{place.desc}</p>
        {place.memo && (
          <p className="mt-0.5 text-[11px] italic text-[#aaa]">{place.memo}</p>
        )}
      </div>
      {/* 드래그 핸들 */}
      <div className="cursor-grab p-1 text-[#ccc] hover:text-[#888]">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M4 5h8M4 8h8M4 11h8" />
        </svg>
      </div>
    </div>
  )
}
