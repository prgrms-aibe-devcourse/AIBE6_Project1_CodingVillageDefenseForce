import PlaceCard, { Place } from './PlaceCard'

interface PlaceListProps {
  places: Place[]
  searchQuery: string
  currentUserId: string | null
  onToggleFavorite: (placeId: number) => void
}

export default function PlaceList({
  places,
  searchQuery,
  currentUserId,
  onToggleFavorite,
}: PlaceListProps) {
  return (
    <div className="flex-1 px-7 py-5">
      <p className="text-[13px] text-[#888] mb-4">
        {searchQuery && (
          <span className="mr-1">
            <strong className="text-[#2c2c2a]">"{searchQuery}"</strong> 검색
            결과 ·{' '}
          </span>
        )}
        <strong className="text-[#2c2c2a] font-medium">
          {places.length}개
        </strong>
        의 장소
      </p>
      <ul className="flex flex-col gap-4">
        {places.length === 0 ? (
          <li className="text-center text-gray-400 py-10">
            해당하는 장소가 없어요
          </li>
        ) : (
          places.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              isLiked={place.favorite.some((l) => l.user_id === currentUserId)}
              onToggleFavorite={onToggleFavorite}
            />
          ))
        )}
      </ul>
    </div>
  )
}
