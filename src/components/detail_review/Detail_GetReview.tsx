'use client'

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function DetailGetReview() {
  const [review, setReview] = useState<any[]>([])

  const fetchReview = async () => {
    const { data: review, error } = await supabase
      .from('review')
      .select('*, user(display_name)')
      .order('created_at', { ascending: false })
      .limit(3)
    setReview(review || [])
  }
  function formatDate(dateStr: string) {
    const diff = Math.floor(
      (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24),
    )

    if (diff < 1) return '오늘'
    if (diff < 7) return `${diff} 일 전`
    if (diff < 30) return `${Math.floor(diff / 7)} 주 전`

    return dateStr
  }

  useEffect(() => {
    fetchReview()
  })

  return (
    <>
      {review.map((item) => (
        <div className="bg-[#F4F6F6] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div>
              <div className="text-sm font-bold text-[#333]">
                {item.user.display_name}
              </div>
              <div className="text-[#E74C3C] text-xs">
                {Array.from({ length: 5 }, (_, i) => {
                  const full = i + 1 <= item.rating
                  const half = i < item.rating && item.rating < i + 1
                  return (
                    <span key={i} className="relative inline-block">
                      <span className="text-[#ddd]">★</span>
                      {(full || half) && (
                        <span
                          className="absolute inset-0 overflow-hidden text-[#E74C3C]"
                          style={{ width: full ? '100%' : '50%' }}
                        >
                          ★
                        </span>
                      )}
                    </span>
                  )
                })}
              </div>
            </div>
            <div className="ml-auto text-xs text-[#999]">
              {formatDate(item.created_at)}
            </div>
          </div>
          <p className="text-[#666] text-sm leading-relaxed">{item.content}</p>
        </div>
      ))}
    </>
  )
}
