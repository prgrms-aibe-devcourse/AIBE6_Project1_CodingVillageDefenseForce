'use client'

import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import ReviewList from './ReviewList'

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
      const { error } = await supabase.from('review').delete().eq('id', id)
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
      <ReviewList
        object={object}
        handleOnDelete={handleOnDelete}
        formatDate={formatDate}
      />
    </div>
  )
}
