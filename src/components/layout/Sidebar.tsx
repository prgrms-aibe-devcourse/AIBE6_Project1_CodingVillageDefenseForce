'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import AIChatModal from '../ai/AIChatModal'
import { createClient } from '@/lib/supabase/client'

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
  const router = useRouter()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  // 초기에는 로딩 문구를 표시하고, 이후 DB에서 불러옵니다.
  const [displayName, setDisplayName] = useState('불러오는 중')
  // 이미지 url 없는 경우 기본 이미지 설정
  const [avatarUrl, setAvatarUrl] = useState(
    'https://img.icons8.com/material-sharp/48/user.png',
  )
  const userMenuRef = useRef<HTMLDivElement | null>(null)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const myPageRe = async () => {
    router.push('/main/mypage')
  }

  useEffect(() => {
    // 로그인된 유저 프로필 정보를 한 번에 불러옵니다.
    const fetchProfile = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data, error } = await supabase
        .from('user')
        .select('display_name, avatar_url')
        .eq('uid', user.id)
        .single()

      if (!error) {
        if (data?.display_name) {
          setDisplayName(data.display_name)
        }
        if (data?.avatar_url) {
          setAvatarUrl(data.avatar_url)
        }
      }
    }

    fetchProfile()

    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

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
      <div className="relative mx-2" ref={userMenuRef}>
        {isUserMenuOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-full rounded-xl border border-[#e8e6e0] bg-white py-2 shadow-[0_12px_30px_rgba(15,14,11,0.12)]">
            <Link
              href="/main/mypage"
              className="block px-3 py-2 text-[13px] text-[#2c2c2a] hover:bg-[#f7f6f3]"
              onClick={myPageRe}
            >
              내 정보
            </Link>
            <button
              type="button"
              className="block w-full px-3 py-2 text-left text-[13px] text-[#2c2c2a] hover:bg-[#f7f6f3]"
              onClick={handleLogout}
            >
              로그아웃
            </button>
          </div>
        )}
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-lg border border-[#e8e6e0] px-3 py-2.5 hover:bg-[#f7f6f3]"
          aria-haspopup="menu"
          aria-expanded={isUserMenuOpen}
          onClick={() => setIsUserMenuOpen((prev) => !prev)}
        >
          <img
            src={avatarUrl}
            alt="프로필 이미지"
            className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
          />
          <div className="text-left">
            <p className="text-[13px] font-medium text-[#2c2c2a]">
              {displayName}
            </p>
            <p className="text-[11px] text-[#aaa]">Tripick Member</p>
          </div>
        </button>
      </div>
    </aside>
  )
}
