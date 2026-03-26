import TagCard from './TagCard'

interface Theme {
  id: string
  emoji: string
  label: string
  bg: string
}

interface TagGridProps {
  themes: Theme[]
  selected: Set<string>
  onToggle: (id: string) => void
}

export default function TagGrid({ themes, selected, onToggle }: TagGridProps) {
  return (
    <div className="grid grid-cols-4 gap-3.5">
      {themes.map((theme) => (
        <TagCard
          key={theme.id}
          theme={theme}
          isSelected={selected.has(theme.id)}
          onToggle={onToggle}
        />
      ))}
    </div>
  )
}
