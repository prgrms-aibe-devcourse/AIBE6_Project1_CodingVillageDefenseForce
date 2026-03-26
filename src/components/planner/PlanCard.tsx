interface Plan {
  id: number
  title: string
  date: string
  tags: string[]
  count: string
}

interface PlanCardProps {
  plan: Plan
  isSelected: boolean
  onSelect: (id: number) => void
}

export default function PlanCard({
  plan,
  isSelected,
  onSelect,
}: PlanCardProps) {
  return (
    <div
      onClick={() => onSelect(plan.id)}
      className={`mb-2.5 cursor-pointer rounded-[12px] border p-3.5 transition-all
        ${
          isSelected
            ? 'border-[#1D9E75] bg-[#f0fdf8]'
            : 'border-[#e8e6e0] hover:border-[#1D9E75] hover:bg-[#f9fffe]'
        }`}
    >
      <div className="mb-1.5 flex items-start justify-between">
        <span className="text-[14px] font-medium text-[#2c2c2a]">
          {plan.title}
        </span>
        <span className="rounded-full bg-[#1D9E75] px-2 py-0.5 text-[11px] text-white">
          {plan.count}
        </span>
      </div>
      <p className="mb-2 text-[12px] text-[#888]">{plan.date}</p>
      <div className="mb-2.5 flex flex-wrap gap-1.5">
        {plan.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-[#f7f6f3] px-2 py-0.5 text-[11px] text-[#5f5e5a]"
          >
            #{tag}
          </span>
        ))}
      </div>
      <span className="flex items-center gap-1 text-[12px] font-medium text-[#1D9E75]">
        플랜 상세보기 →
      </span>
    </div>
  )
}
