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
    const { data, error } = await supabase.from('review').insert({
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
      fetchReview()
    }
  }

  const handleRemoveData = async (id: number) => {
    const { data, error } = await supabase.from('review').delete().eq('id', id)

    try {
      alert('정상 처리 되었습니다.')
      fetchReview()
    } catch (error) {
      console.error(error)
    }
  }

  const fetchReview = async () => {
    const { data: review, error } = await supabase
      .from('review')
      .select('*, user(display_name)')
    setReview(review || [])
  }

  useEffect(() => {
    fetchReview()
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setAuthUser(user)
    })
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
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-[#222]">방문자 리뷰</h2>
              <button
                className="text-[#999] hover:text-[#333] text-lg font-medium"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>

            {isWrite ? (
              /* 리뷰 작성 폼 */
              <form className="flex flex-col gap-3" onSubmit={handleOnSubmit}>
                <input
                  placeholder="이름"
                  className="border border-[#e8e6e0] rounded-lg px-4 py-2.5 text-sm text-[#333] outline-none focus:border-[#007A6B]"
                  value={authUser?.user_metadata?.name}
                  readOnly
                />

                <div
                  className="flex gap-1"
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <h3 className="text-black">리뷰 별점 </h3>
                  {Array.from({ length: 5 }, (_, i) => {
                    const activeRating = hoverRating || rating
                    const full = i + 1 <= activeRating
                    const half = i < activeRating && activeRating < i + 1
                    return (
                      <span
                        onMouseMove={(e) => {
                          mouseRatingHalf(e, i)
                        }}
                        key={i}
                        className={'relative cursor-pointer text-xl'}
                        onClick={() => setRating(hoverRating)}
                      >
                        <span className="text=[#ddd]"> ★</span>
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
                  className="border border-[#e8e6e0] rounded-lg px-4 py-2.5 text-sm text-[#333] outline-none focus:border-[#007A6B] resize-none"
                />
                <div className="flex gap-2 justify-end mt-1">
                  <button
                    type="button"
                    onClick={() => setIsWrite(false)}
                    className="px-4 py-2 rounded-lg text-sm text-[#666] border border-[#e8e6e0] hover:bg-[#f7f6f3]"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg text-sm text-white bg-[#007A6B] hover:bg-[#005f54]"
                  >
                    제출
                  </button>
                </div>
              </form>
            ) : (
              <>
                {/* 리뷰 목록 */}
                <ul className="flex flex-col gap-3 pr-1">
                  {currentReviews.map((item) => (
                    <li key={item.id} className="bg-[#F4F6F6] rounded-2xl p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 bg-gray-300 rounded-full" />
                        <div>
                          <p className="text-sm font-bold text-[#333]">
                            {item.user.display_name}
                          </p>
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
                        <span className="ml-auto text-xs text-[#999]">
                          {formatDate(item.created_at)}
                        </span>
                      </div>
                      <div className="flex justify-between items-end">
                        <p className="text-sm text-[#666] leading-relaxed">
                          {item.content}
                        </p>
                        <button
                          onClick={() => handleRemoveData(item.id)}
                          className="text-xs text-[#999] hover:text-[#E74C3C] border border-[#e8e6e0] hover:border-[#E74C3C] rounded-lg px-2 py-1 transition"
                        >
                          삭제
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* 페이지네이션 */}
                <div className="flex items-center justify-center gap-2 mt-4">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="px-3 py-1.5 rounded-lg text-sm border border-[#e8e6e0] text-[#666] hover:bg-[#f7f6f3] disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ‹ 이전
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-sm ${
                        currentPage === i + 1
                          ? 'bg-[#007A6B] text-white font-bold'
                          : 'text-[#666] hover:bg-[#f7f6f3]'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="px-3 py-1.5 rounded-lg text-sm border border-[#e8e6e0] text-[#666] hover:bg-[#f7f6f3] disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    다음 ›
                  </button>
                </div>

                {/* 리뷰 작성 버튼 */}
                <button
                  className="mt-4 w-full py-2.5 rounded-xl text-sm font-bold text-white bg-[#007A6B] hover:bg-[#005f54] transition"
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
