'use client'

import { supabase } from '@/lib/supabase'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import React, { useEffect, useState } from 'react'
import styles from './review.module.css'

export default function DetailReview({
  searchTerm,
  placeId,
  userId,
}: {
  searchTerm: string
  placeId: number
  userId: number
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isWrite, setIsWrite] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [comment, setComment] = useState<string>('')
  const [review, setReview] = useState<any[]>([])
  const [authUser, setAuthUser] = useState<User | null>(null)
  const itemPage = 5

  const startIdx = (currentPage - 1) * itemPage

  function formatDate(dateStr: string) {
    const diff = Math.floor(
      (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24),
    )
    if (diff < 1) return '오늘'
    if (diff < 7) return `${diff} 일 전`
    if (diff < 30) return `${Math.floor(diff / 7)} 주 전`
    return dateStr
  }

  function mouseRatingHalf(e: React.MouseEvent<HTMLSpanElement>, i: number) {
    const half = e.currentTarget.offsetWidth / 2
    setRating(e.nativeEvent.offsetX < half ? i + 0.5 : i + 1)
  }

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { error } = await supabase.from('review').insert({
      place_id: placeId,
      user_id: userId,
      location: searchTerm,
      content: comment,
      rating: rating,
    })

    if (error) {
      console.error(error)
      alert('리뷰 작성이 안되었습니다.')
    } else {
      setIsWrite(false)
      setComment('')
      setRating(0)
      fetchReview()
    }
  }

  const handleRemoveData = async (id: number) => {
    const { error } = await supabase.from('review').delete().eq('id', id)
    if (error) {
      console.error(error)
    } else {
      alert('정상 처리 되었습니다.')
      fetchReview()
    }
  }

  const fetchReview = async () => {
    const { data, error } = await supabase
      .from('review')
      .select('*, user(display_name, email)')
      .eq('place_id', placeId)
    if (!error) setReview(data || [])
  }

  // 🔥 에러가 발생하던 useEffect 구간 수정
  useEffect(() => {
    fetchReview()

    async function loadUser() {
      const client = createClient() // 클라이언트 생성
      const { data, error } = await client.auth.getUser()

      if (error) {
        console.error('유저 정보를 가져오는데 실패했습니다:', error.message)
        return
      }

      if (data?.user) {
        setAuthUser(data.user)
      }
    }

    loadUser()
  }, [])

  const currentReviews = review.slice(startIdx, startIdx + itemPage)
  const totalPages = Math.ceil(review.length / itemPage)

  return (
    <>
      <button
        className="text-[#007A6B] font-bold text-sm hover:underline"
        onClick={() => setIsOpen(true)}
      >
        모두 보기
      </button>

      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-[#222]">방문자 리뷰</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#999] hover:text-[#333]"
              >
                ✕
              </button>
            </div>

            {isWrite ? (
              <form className="flex flex-col gap-3" onSubmit={handleOnSubmit}>
                <input
                  placeholder="이름"
                  className="border border-[#e8e6e0] rounded-lg px-4 py-2.5 text-sm outline-none text-black"
                  value={
                    authUser?.user_metadata?.display_name ||
                    authUser?.user_metadata?.name ||
                    ''
                  }
                  readOnly
                />
                <div
                  className="flex gap-1 items-center"
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <h3 className="text-sm mr-2 text-black">리뷰 별점</h3>
                  {Array.from({ length: 5 }, (_, i) => {
                    const activeRating = hoverRating || rating
                    const full = i + 1 <= activeRating
                    const half = i < activeRating && activeRating < i + 1
                    return (
                      <span
                        key={i}
                        onMouseMove={(e) => mouseRatingHalf(e, i)}
                        onClick={() => setRating(hoverRating || rating)}
                        className="relative cursor-pointer text-2xl"
                      >
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
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="리뷰 내용을 입력해주세요"
                  rows={5}
                  className="border border-[#e8e6e0] rounded-lg px-4 py-2.5 text-sm resize-none text-black"
                />
                <div className="flex gap-2 justify-end mt-1">
                  <button
                    type="button"
                    onClick={() => setIsWrite(false)}
                    className="px-4 py-2 text-sm border rounded-lg"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm bg-[#007A6B] text-white rounded-lg"
                  >
                    제출
                  </button>
                </div>
              </form>
            ) : (
              <>
                <ul className="flex flex-col gap-3 overflow-y-auto max-h-[400px]">
                  {currentReviews.map((item) => (
                    <li key={item.id} className="bg-[#F4F6F6] rounded-2xl p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 bg-gray-300 rounded-full" />
                        <div>
                          <p className="text-sm font-bold text-black">
                            {item.user?.display_name || '익명'}
                          </p>
                          <div className="flex">
                            {Array.from({ length: 5 }, (_, i) => (
                              <span key={i} className="relative text-sm">
                                <span className="text-[#ddd]">★</span>
                                {i + 1 <= item.rating && (
                                  <span className="absolute inset-0 text-[#E74C3C]">
                                    ★
                                  </span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                        <span className="ml-auto text-xs text-[#999]">
                          {formatDate(item.created_at)}
                        </span>
                      </div>
                      <div className="flex justify-between items-end">
                        <p className="text-sm text-[#666]">{item.content}</p>
                        {item.user.email === authUser?.email && (
                          <button
                            onClick={() => handleRemoveData(item.id)}
                            className="text-xs text-[#999] border rounded-lg px-2 py-1"
                          >
                            삭제
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-center gap-2 mt-4">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-lg ${currentPage === i + 1 ? 'bg-[#007A6B] text-white' : 'text-[#666]'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  className="mt-4 w-full py-2.5 rounded-xl font-bold text-white bg-[#007A6B]"
                  onClick={() => setIsWrite(true)}
                >
                  리뷰 작성하기
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
