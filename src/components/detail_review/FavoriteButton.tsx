'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

interface FavoriteButtonProps {
  placeId: number
}

export default function FavoriteButton({ placeId }: FavoriteButtonProps) {
  const supabase = createClient()
  const [isLiked, setIsLiked] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const userId = session?.user?.id ?? null
      setCurrentUserId(userId)

      if (!userId) return

      const { data } = await supabase
        .from('favorite')
        .select('id')
        .eq('user_id', userId)
        .eq('place_id', placeId)
        .single()

      setIsLiked(!!data)
    }
    init()
  }, [placeId])

  const toggleFavorite = async () => {
    if (!currentUserId) return
    if (isLiked) {
      await supabase
        .from('favorite')
        .delete()
        .eq('user_id', currentUserId)
        .eq('place_id', placeId)
    } else {
      await supabase
        .from('favorite')
        .insert({ place_id: placeId, user_id: currentUserId })
    }
    setIsLiked((prev) => !prev)
  }

  return (
    <button
      onClick={toggleFavorite}
      className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/50 transition"
    >
      {isLiked ? (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="#00BFA5"
          stroke="#00BFA5"
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
          stroke="white"
          strokeWidth="1.8"
        >
          <path d="M12 21C12 21 3 14 3 8a5 5 0 0110 0 5 5 0 0110 0c0 6-9 13-9 13z" />
        </svg>
      )}
    </button>
  )
}
