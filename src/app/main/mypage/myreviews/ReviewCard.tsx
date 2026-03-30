'use client'

import Link from 'next/link'

interface Props {
  obj: Review
  handleOnDelete: (id: number) => void
  formatDate: (formatStr: string) => string
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

export default function ReviewCard({ obj, handleOnDelete, formatDate }: Props) {
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
}
