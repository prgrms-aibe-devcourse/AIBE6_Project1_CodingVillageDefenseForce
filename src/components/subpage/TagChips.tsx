interface Tag {
  id: number
  category: string
}

interface TagChipsProps {
  tags: Tag[]
  selectedTags: string[]
  onToggle: (category: string) => void
}

export default function TagChips({
  tags,
  selectedTags,
  onToggle,
}: TagChipsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 px-7 py-3 border-b border-[#e8e6e0] bg-white">
      {selectedTags.map((category) => {
        const tag = tags.find((t) => t.category === category)
        if (!tag) return null
        return (
          <span
            key={tag.id}
            onClick={() => onToggle(category)}
            className="flex cursor-pointer items-center gap-1 rounded-full bg-[#00BFA5] px-3 py-1 text-[12px] text-white hover:bg-[#0F6E56] transition"
          >
            #{category}
            <span className="opacity-80">×</span>
          </span>
        )
      })}
    </div>
  )
}
