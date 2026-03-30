'use client'

import ReviewCard from './ReviewCard'

interface Props {
  object: Review[]
  handleOnDelete: (id: number) => void
  formatDate: (dateStr: string) => string
}

interface Review {
  id: number
  content: string
  rating: number
  place: Place
  created_at: string
}

interface Place {
  title: string
  image: string
}

export default function ReviewList({
  object,
  handleOnDelete,
  formatDate,
}: Props) {
  return (
    <div>
      {/* 오브젝트 출력 */}
      <ul className="flex flex-col gap-5">
        {object.map((obj) => (
          <ReviewCard
            key={obj.id}
            obj={obj}
            handleOnDelete={handleOnDelete}
            formatDate={formatDate}
          />
        ))}
      </ul>
    </div>
  )
}
