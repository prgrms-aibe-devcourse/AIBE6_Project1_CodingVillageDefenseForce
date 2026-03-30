'use client'

import Link from 'next/link'

interface Review {
  id: number
  rating: number
}

interface Tag {
  id: number
  category: string
}

interface PlaceTag {
  tag: Tag
}

interface Location {
  id: number
  title: string
}

export interface Place {
  id: number
  title: string
  content: string
  image: string
  location: Location
  review: Review[]
  place_tag: PlaceTag[]
  favorite: { user_id: string }[]
}

interface PlaceCardProps {
  place: Place
  isLiked: boolean
  onToggleFavorite: (placeId: number) => void
}

export default function PlaceCard({
  place,
  isLiked,
  onToggleFavorite,
}: PlaceCardProps) {
  const avg =
    place.review.length === 0
      ? 0
      : place.review.reduce((sum, r) => sum + r.rating, 0) / place.review.length

  return (
    <li className="flex items-center justify-between rounded-2xl bg-white border border-[#e8e6e0] px-5 py-4 hover:shadow-md transition">
      <div className="flex items-center gap-4">
        <div className="h-24 w-24 rounded-xl bg-gray-300 overflow-hidden flex-shrink-0">
          <img
            src={place.image}
            alt={place.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-md bg-[#f5f5f4] px-2 py-0.5 text-[#5f5e5a]">
              {place.location?.title}
            </span>
            {place.place_tag.map((e, index) => (
              <span key={`${e.tag.id}-${index}`} className="text-[#1D9E75]">
                #{e.tag.category}
              </span>
            ))}
          </div>
          <Link
            href={`/main/detail?id=${place.id}&placeName=${encodeURIComponent(place.title)}&location=${encodeURIComponent(String(place.location))}`}
            className="text-[17px] font-medium text-[#292524]"
          >
            {place.title}
          </Link>

          <p className="text-[13px] text-gray-500 line-clamp-1">
            {place.content}
          </p>
          <div className="flex items-center gap-3 text-[13px] text-gray-500">
            <span>⭐ {avg.toFixed(1)}</span>
            <span>리뷰 {place.review.length}개</span>
          </div>
        </div>
      </div>
      <button
        className="ml-4 flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full transition-all hover:scale-110"
        onClick={() => onToggleFavorite(place.id)}
      >
        {isLiked ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="#1D9E75"
            stroke="#1D9E75"
            strokeWidth="1.5"
          >
            <path d="M12 21C12 21 3 14 3 8a5 5 0 0110 0 5 5 0 0110 0c0 6-9 13-9 13z" />
          </svg>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1D9E75"
            strokeWidth="1.8"
          >
            <path d="M12 21C12 21 3 14 3 8a5 5 0 0110 0 5 5 0 0110 0c0 6-9 13-9 13z" />
          </svg>
        )}
      </button>
    </li>
  )
}
