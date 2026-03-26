'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import AIChatModal from '../ai/AIChatModal'

const NAV_ITEMS = [
  {
    id: 'home',
    label: 'Home',
    href: '/main',
    icon: (
      <svg
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        width="18"
        height="18"
      >
        <path d="M3 9L9 3l6 6" />
        <path d="M5 7v7h3v-4h2v4h3V7" />
      </svg>
    ),
  },
  {
    id: 'favorites',
    label: 'Favorites',
    href: '/main/favorites',
    icon: (
      <svg
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        width="18"
        height="18"
      >
        <path d="M3 5.5A2.5 2.5 0 018 4a2.5 2.5 0 015 1.5c0 4-5 8-5 8s-5-4-5-8z" />
      </svg>
    ),
  },
  {
    id: 'planner',
    label: 'Travel Planner',
    href: '/main/planner',
    icon: (
      <svg
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        width="18"
        height="18"
      >
        <rect x="2" y="3" width="14" height="13" rx="2" />
        <path d="M6 1v4M12 1v4M2 8h14" />
      </svg>
    ),
  },
  {
    id: 'mypage',
    label: 'My Page',
    href: '/main/mypage',
    icon: (
      <svg
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        width="18"
        height="18"
      >
        <circle cx="9" cy="6" r="3" />
        <path d="M3 16c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      </svg>
    ),
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex w-[220px] flex-shrink-0 flex-col border-r border-[#e8e6e0] bg-white py-6">
      {/* 로고 */}
      <div className="flex items-center gap-2 px-5 pb-7">
        <img src="/mark.png" alt="Tripick" width={30} height={30} />
        <div>
          <span
            className="block text-[18px] font-bold text-[#2c2c2a]"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Tripick
          </span>
          <span className="block text-[9px] uppercase tracking-[2px] text-[#aaa]">
            Curated Voyages
          </span>
        </div>
      </div>
      {/* 네비 */}
      <nav className="flex flex-col gap-0.5 px-2">
        {NAV_ITEMS.map(({ id, label, href, icon }) => {
          const isActive = pathname === href
          return (
            <React.Fragment key={id}>
              <Link
                key={id}
                href={href as any}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[14px] transition-all
                ${
                  isActive
                    ? 'bg-[#E1F5EE] text-[#0F6E56] font-medium'
                    : 'text-[#888] hover:bg-[#f7f6f3] hover:text-[#2c2c2a]'
                }`}
              >
                {icon}
                {label}
              </Link>
              {id !== 'mypage' && <AIChatModal />}
            </React.Fragment>
          )
        })}
      </nav>

      <div className="flex-1" />
      {/* 유저 */}
      <div className="mx-2 flex cursor-pointer items-center gap-2.5 rounded-lg border border-[#e8e6e0] px-3 py-2.5 hover:bg-[#f7f6f3]">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#1D9E75] text-[13px] font-medium text-white">
          A
        </div>
        <div>
          <p className="text-[13px] font-medium text-[#2c2c2a]">Alex Kim</p>
          <p className="text-[11px] text-[#aaa]">Premium Member</p>
        </div>
      </div>
    </aside>
  )
}
