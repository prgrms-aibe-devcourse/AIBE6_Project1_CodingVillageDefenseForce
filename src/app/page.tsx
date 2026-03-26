'use client'

import AIChatModal from '@/components/ai/AIChatModal'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f0e8]">
      {/* 4분할 배경 그리드 */}
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1.5 p-1.5 z-0">
        {[
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=70',
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=70',
          'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=70',
          'https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=600&q=70',
        ].map((src, i) => (
          <div
            key={i}
            className="rounded-2xl bg-cover bg-center opacity-55"
            style={{ backgroundImage: `url('${src}')` }}
          />
        ))}
      </div>

      {/* 오버레이 */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#f5f0e8]/30 via-[#f5f0e8]/55 to-[#f5f0e8]/30" />

      {/* 중앙 콘텐츠 */}
      <div className="relative z-20 flex min-h-screen flex-col items-center justify-center px-8 text-center pb-24">
        {/* 로고 */}
        <div className="flex items-center gap-2 mb-6">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path
              d="M14 2C9.6 2 6 5.6 6 10C6 16 14 26 14 26C14 26 22 16 22 10C22 5.6 18.4 2 14 2Z"
              fill="#1D9E75"
            />
            <circle cx="14" cy="10" r="3.5" fill="white" />
          </svg>
          <span
            className="text-3xl font-bold text-[#2c2c2a] tracking-tight"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Tripick
          </span>
        </div>

        <p className="text-[17px] text-[#5f5e5a] font-light tracking-wide mb-10">
          어떤 느낌의 여행을 원하세요?
        </p>

        <Link
          href={'/login' as any}
          className="rounded-full bg-[#1D9E75] px-14 py-4 text-base font-medium text-white shadow-[0_4px_20px_rgba(29,158,117,0.25)] transition-all hover:bg-[#0F6E56] hover:-translate-y-0.5 active:scale-95"
        >
          시작하기
        </Link>
      </div>

      {/* 하단 네비바 */}
      <nav className="absolute bottom-0 left-0 right-0 z-20 flex justify-center gap-12 py-4 bg-[#f5f0e8]/85 backdrop-blur-sm border-t border-[#5f5e5a]/15">
        {[
          {
            label: 'DISCOVER',
            icon: (
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="11" cy="11" r="8" />
                <circle cx="11" cy="11" r="3" />
              </svg>
            ),
            active: true,
          },
          {
            label: 'CURATE',
            icon: (
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M11 2l1.5 4.5H17l-3.8 2.8 1.5 4.5L11 11l-3.8 2.8 1.5-4.5L4.9 6.5H9.5z" />
              </svg>
            ),
            active: false,
          },
          {
            label: 'DEPART',
            icon: (
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M3 11h16M13 5l6 6-6 6" />
              </svg>
            ),
            active: false,
          },
        ].map(({ label, icon, active }) => (
          <Link
            key={label}
            href={'/login' as any}
            className={`flex flex-col items-center gap-1 transition-opacity ${active ? 'opacity-100' : 'opacity-40 hover:opacity-80'}`}
          >
            <span className="text-[#2c2c2a]">{icon}</span>
            <span className="text-[10px] font-medium tracking-[1.5px] text-[#2c2c2a]">
              {label}
            </span>
          </Link>
        ))}
      </nav>
      <AIChatModal />
    </div>
  )
}
