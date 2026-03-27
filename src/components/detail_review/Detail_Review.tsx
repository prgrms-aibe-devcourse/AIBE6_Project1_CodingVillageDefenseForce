'use client'

import { useState } from 'react'
import { MOCK_REVIEWS } from './MockData'
import styles from './review.module.css'

export default function DetailReview() {
  const [isOpen, setIsOpen] = useState(false)
  const [isWrite, setIsWrite] = useState(false)
  const [rating, setRating] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const itemPage = 5

  const startIdx = (currentPage - 1) * itemPage
  const currentReviews = MOCK_REVIEWS.slice(startIdx, startIdx + itemPage)
  const totalPages = Math.ceil(MOCK_REVIEWS.length / itemPage)

  function formatDate(dateStr: string) {
    const diff = Math.floor(
      (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24),
    )

    if (diff < 1) return 'today'
    if (diff < 7) return `${diff} days ago`
    if (diff < 30) return `${Math.floor(diff / 7)} week ago`

    return dateStr
  }

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
              <form className="flex flex-col gap-3">
                <input
                  placeholder="이름"
                  className="border border-[#e8e6e0] rounded-lg px-4 py-2.5 text-sm text-[#333] outline-none focus:border-[#007A6B]"
                />

                <div className="flex gap-1">
                  <h3 className="text-black">리뷰 별점 </h3>
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className={
                        i < rating
                          ? 'text-[#E74C3C] cursor-pointer text-xl'
                          : 'text-[#ddd] cursor-pointer text-xl'
                      }
                      onClick={() => setRating(i + 1)}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <textarea
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
                            {item.name}
                          </p>
                          <p className="text-[#E74C3C] text-xs">
                            {'★'.repeat(item.rating)}
                            {'☆'.repeat(5 - item.rating)}
                          </p>
                        </div>
                        <span className="ml-auto text-xs text-[#999]">
                          {formatDate(item.date)}
                        </span>
                      </div>
                      <p className="text-sm text-[#666] leading-relaxed">
                        {item.content}
                      </p>
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
