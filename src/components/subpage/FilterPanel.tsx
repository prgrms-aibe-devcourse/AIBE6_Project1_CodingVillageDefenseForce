interface Tag {
  id: number
  category: string
}

interface Location {
  id: number
  title: string
}

interface FilterPanelProps {
  tags: Tag[]
  locations: Location[]
  selectedTags: string[]
  selectedRegion: string
  selectedSort: string
  onToggleTag: (category: string) => void
  onSelectRegion: (region: string) => void
  onSelectSort: (sort: string) => void
}

const SORT_OPTIONS = ['평점순', '리뷰 많은 순']

export default function FilterPanel({
  tags,
  locations,
  selectedTags,
  selectedRegion,
  selectedSort,
  onToggleTag,
  onSelectRegion,
  onSelectSort,
}: FilterPanelProps) {
  return (
    <div className="bg-white border-b border-[#e8e6e0] px-7 py-5">
      {/* 테마 */}
      <div className="mb-4">
        <p className="text-[12px] font-medium text-[#888] mb-2 uppercase tracking-wider">
          테마
        </p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => onToggleTag(tag.category)}
              className={`rounded-full px-3 py-1.5 text-[13px] transition ${
                selectedTags.includes(tag.category)
                  ? 'bg-[#1D9E75] text-white'
                  : 'bg-[#f5f5f4] text-[#5f5e5a] hover:bg-[#e8e6e0]'
              }`}
            >
              #{tag.category}
            </button>
          ))}
        </div>
      </div>

      {/* 지역 */}
      <div className="mb-4">
        <p className="text-[12px] font-medium text-[#888] mb-2 uppercase tracking-wider">
          지역
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onSelectRegion('전체')}
            className={`rounded-lg px-3 py-1.5 text-[13px] transition ${
              selectedRegion === '전체'
                ? 'bg-[#1D9E75] text-white'
                : 'bg-[#f5f5f4] text-[#44403c] hover:bg-[#e8e6e0]'
            }`}
          >
            전체
          </button>
          {locations.map((loca) => (
            <button
              key={loca.id}
              onClick={() => onSelectRegion(loca.title)}
              className={`rounded-lg px-3 py-1.5 text-[13px] transition ${
                selectedRegion === loca.title
                  ? 'bg-[#1D9E75] text-white'
                  : 'bg-[#f5f5f4] text-[#44403c] hover:bg-[#e8e6e0]'
              }`}
            >
              {loca.title}
            </button>
          ))}
        </div>
      </div>

      {/* 정렬 */}
      <div>
        <p className="text-[12px] font-medium text-[#888] mb-2 uppercase tracking-wider">
          정렬
        </p>
        <div className="flex flex-wrap gap-2">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => onSelectSort(option)}
              className={`rounded-lg px-3 py-1.5 text-[13px] transition ${
                selectedSort === option
                  ? 'font-semibold text-[#00BFA5]'
                  : 'text-[#888] hover:text-[#2c2c2a]'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
