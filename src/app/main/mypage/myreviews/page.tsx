'use client'

import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Review {
  id: number
  content: string
  rating: number
  user: User
  place: Place
  created_at: string
}

interface User {
  user_id: number
}

interface Place {
  title: string
  content: string
  image: string
  location: string
}

export default function MyReviewPage() {
  const [object, setObject] = useState<Review[]>([])

  const fetchObject = async () => {
    try {
      const { data: obj, error } = await supabase
        .from('review')
        .select(
          `id, content, rating, created_at, user(id), place(title, content, location, image)`,
        )
      if (error) throw error
      setObject(obj ?? [])
    } catch (error) {
      console.error('리뷰 데이터를 불러오는 중 오류가 발생하였습니다.', error)
    }
  }

  //   날짜 포맷 함수
  const formatDate = (dateStr: string) => {
    return new Date(dateStr)
      .toLocaleDateString('en-US', {
        month: 'long', // OCTOBER
        day: '2-digit', // 14
        year: 'numeric', // 2023
      })
      .toUpperCase() // 전체 대문자
  }

  //  삭제 함수
  const handleOnDelete = async (id: number) => {
    try {
      const { data, error } = await supabase
        .from('review')
        .delete()
        .eq('id', id)
      if (error) throw error
      fetchObject()
    } catch (e) {
      console.error('삭제처리 중 오류가 발생했습니다.', e)
    }
  }

  useEffect(() => {
    fetchObject()
  }, [])

  return (
    <div className="min-h-screen bg-[#fafaf9] px-8 py-6">
      {/* Back to Profile */}
      <div>
        <button>
          <Link
            href="/main/mypage"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ⬅️ back to profile
          </Link>
        </button>
      </div>

      {/* Header */}
      <div className="mt-4 mb-6">
        <h2 className="text-4xl font-bold text-[#1a1a1a]">My Reviews</h2>
        <p className="text-sm text-gray-500 mt-1">
          당신이 다녀온 {object.length}곳의 여행 이야기.
        </p>
      </div>

      {/* 카드 목록 */}
      <div>
        <ul className="flex flex-col gap-5">
          {object.map((obj) => {
            return (
              <li
                key={obj.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex gap-5">
                  {/* 이미지 */}
                  <div className="flex-shrink-0">
                    <img
                      src={obj.place?.image}
                      className="w-36 h-36 object-cover rounded-xl bg-gray-200"
                    />
                  </div>

                  {/* 텍스트 */}
                  <div className="flex-1 flex flex-col gap-2">
                    {/* 제목 + 수정/삭제 */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-[#1a1a1a]"></h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400">
                            {formatDate(obj.created_at)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 rounded-full bg-gray-100 hover:bg-red-100 text-sm text-gray-600"
                          onClick={() => handleOnDelete(obj.id)}
                        >
                          삭제
                        </button>
                      </div>
                    </div>

                    {/* 리뷰 내용 */}
                    <div>
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                        {obj.content}
                      </p>
                    </div>

                    {/* 하단 좋아요/댓글/상세 */}
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>
                          내가 남긴 평점: <b>{obj.rating}</b>점
                        </span>
                      </div>
                      <Link
                        href="/main/detail/"
                        className="text-xs font-semibold text-gray-700 uppercase tracking-widest hover:text-[#1D9E75]"
                      >
                        View Place
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
