'use client'

import Header from '@/components/layout/Header'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const activityItems = [
  { id: 'views', label: '내 위시리스트', icon: 'heart' },
  { id: 'reviews', label: '작성한 리뷰', icon: 'edit' },
]

const settingItems = [
  {
    id: 'profile',
    title: '이메일 변경',
    desc: '이메일을 변경합니다.',
  },
  {
    id: 'password',
    title: '비밀번호 재설정',
    desc: '주기적인 변경으로 계정을 보호하세요.',
  },
  {
    id: 'nickname',
    title: '닉네임 변경',
    desc: '트리픽에서 사용할 이름을 변경합니다.',
  },
]

const helpItems = [
  { id: 'faq', label: '이용 안내 (FAQ)' },
  { id: 'support', label: '고객 센터 문의' },
]

function ActivityIcon({ type }: { type: string }) {
  if (type === 'eye') {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  }
  if (type === 'edit') {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 20h9" />
        <path d="M4 16l8-8 4 4-8 8H4z" />
      </svg>
    )
  }
  if (type === 'heart') {
    return (
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M3.5 8.5A4.5 4.5 0 0112 7a4.5 4.5 0 018.5 1.5C20.5 13.5 12 19 12 19S3.5 13.5 3.5 8.5z" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 6h18" />
      <path d="M7 6v14" />
      <path d="M17 6v14" />
      <path d="M7 10h10" />
      <path d="M7 14h10" />
    </svg>
  )
}

export default function MyPage() {
  const router = useRouter()
  const [displayName, setDisplayName] = useState('불러오는 중')
  // 이미지 url 없는 경우 기본 이미지 설정
  const [avatarUrl, setAvatarUrl] = useState(
    'https://img.icons8.com/material-sharp/48/user.png',
  )
  const [email, setEmail] = useState('loading. .')
  const [userId, setUserId] = useState<string | null>(null)
  // 닉네임 변경 모달 상태
  const [isNicknameOpen, setIsNicknameOpen] = useState(false)
  const [nicknameInput, setNicknameInput] = useState('')
  const [isSavingNickname, setIsSavingNickname] = useState(false)
  const [nicknameError, setNicknameError] = useState('')

  // 활동 항목 클릭 시 이동 경로 처리
  const handleActivityClick = (id: string) => {
    if (id === 'views') {
      router.push('/main/favorites')
      return
    }
  }

  useEffect(() => {
    // 로그인된 유저 프로필 정보를 한 번에 불러옵니다.
    const fetchProfile = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return
      setUserId(user.id)

      const { data, error } = await supabase
        .from('user')
        .select('email, display_name, avatar_url')
        .eq('uid', user.id)
        .single()

      if (!error) {
        if (data?.display_name) {
          setDisplayName(data.display_name)
        }
        if (data?.avatar_url) {
          setAvatarUrl(data.avatar_url)
        } else {
          setAvatarUrl('https://img.icons8.com/material-sharp/48/user.png')
        }
        if (data?.email) {
          setEmail(data.email)
        }
      }
    }

    fetchProfile()
  }, [])


  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleSettingClick = async (id: string) => {
    if (id === 'password') {
      // 이메일이 세션에 있다면 그걸 사용
      if (!email) {
        alert('이메일 정보를 불러오지 못했습니다.')
        return
      }

      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset`,
      })

      if (error) {
        alert('재설정 메일 전송 실패: ' + error.message)
        return
      }

      alert('비밀번호 재설정 메일을 보냈어요.')
      return
    }

    if (id === 'nickname') {
      // 닉네임 변경 모달 열기
      setNicknameError('')
      setNicknameInput(displayName === '불러오는 중' ? '' : displayName)
      setIsNicknameOpen(true)
      return
    }
    return
  }

  // 닉네임 저장 
  const handleNicknameSave = async () => {
    const nextName = nicknameInput.trim()
    if (!nextName) {
      setNicknameError('닉네임을 입력해주세요.')
      return
    }
    if (!userId) {
      setNicknameError('유저 정보를 불러오지 못했습니다.')
      return
    }

    setIsSavingNickname(true)
    setNicknameError('')

    const supabase = createClient()
    const { error } = await supabase
      .from('user')
      .update({ display_name: nextName })
      .eq('uid', userId)

    if (error) {
      setNicknameError('닉네임 변경에 실패했습니다.')
      setIsSavingNickname(false)
      return
    }
  

    const { error: authError } = await supabase.auth.updateUser({
      data: { name: nextName, full_name: nextName },
    })

    if (authError) {
      setNicknameError('프로필 업데이트에 실패했습니다.')
      setIsSavingNickname(false)
      return
    }

    setDisplayName(nextName)
    setIsSavingNickname(false)
    setIsNicknameOpen(false)
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* 공통 레이아웃 헤더 사용, 마이페이지에선 검색바 숨김 */}
      <Header title="My Page" showSearch={false} />
      <main className="flex-1 overflow-y-auto bg-[#f7f6f3] px-7 py-7">
        {/* 상단 카드 영역 */}
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl bg-white p-6 shadow-[0_12px_30px_rgba(15,14,11,0.05)]">
            <div className="flex flex-wrap items-center gap-5">
              <div className="relative">
                <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full border-[3px] border-[#2fb9b1]">
                  <div className="flex h-[76px] w-[76px] items-center justify-center overflow-hidden rounded-full bg-[#f0f0f0] text-[26px] font-semibold text-[#2c2c2a]">
                    <img
                      src={avatarUrl}
                      alt="프로필 이미지"
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.src =
                          'https://img.icons8.com/material-sharp/48/user.png'
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-[22px] font-semibold text-[#18202a]">
                  {displayName}
                </div>
                <div className="mt-1 text-[13px] text-[#8a8a87]">{email}</div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#e6f7f6] px-3 py-1 text-[11px] font-medium text-[#2fb9b1]">
                    Tripick User
                  </span>
                  <span className="rounded-full bg-[#e7f4ff] px-3 py-1 text-[11px] font-medium text-[#2a7bdc]">
                    Korea
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="h-5 w-1 rounded-full bg-[#2fb9b1]" />
              <span className="text-[15px] font-semibold text-[#2c2c2a]">내 활동</span>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-[0_12px_30px_rgba(15,14,11,0.05)]">
              <div className="flex flex-col gap-2">
                {activityItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-left transition hover:bg-[#f7f6f3]"
                    onClick={() => handleActivityClick(item.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e6f7f6] text-[#12a7a0]">
                        <ActivityIcon type={item.icon} />
                      </div>
                      <span className="text-[14px] font-medium text-[#2c2c2a]">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-[#c0beb8]">›</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="h-5 w-1 rounded-full bg-[#22355d]" />
              <span className="text-[15px] font-semibold text-[#2c2c2a]">계정 설정</span>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-[0_12px_30px_rgba(15,14,11,0.05)]">
              <div className="flex flex-col gap-3">
                {settingItems.map((item) => (
                  <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl px-4 py-3 transition hover:bg-[#f7f6f3]"
                  onClick={() => handleSettingClick(item.id)}                  >
                    <div>
                      <div className="text-[14px] font-medium text-[#2c2c2a]">
                        {item.title}
                      </div>
                      <div className="mt-1 text-[12px] text-[#9a9893]">
                        {item.desc}
                      </div>
                    </div>
                    <span className="text-[#c0beb8]">›</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-2xl bg-[#0f1c3f] p-6 text-white shadow-[0_20px_40px_rgba(15,28,63,0.25)]">
            <div className="text-[12px] uppercase tracking-[1.5px] text-[#c7d3ea]">
              내가 떠나본 여행지 수
            </div>
            <div className="mt-3 text-[36px] font-semibold">24</div>
            <div className="mt-4 border-t border-white/20 pt-3 text-[12px] text-[#c7d3ea]">
              Tripick과 함께한 이후로.
            </div>
          </div>


          <div className="rounded-2xl bg-white p-5 text-[#2c2c2a] shadow-[0_12px_30px_rgba(15,14,11,0.05)]">
            <div className="text-[13px] font-semibold">지원 및 기타</div>
            <div className="mt-4 flex flex-col gap-3 text-[12px] text-[#7f7d78]">
              {helpItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <span>{item.label}</span>
                  <span className="text-[#c0beb8]">↗</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-4 flex items-center gap-2 text-[12px] font-semibold text-[#1fb7ad]"
              onClick={handleLogout}
            >
              <span>로그아웃</span>
            </button>
          </div>

          <div className="text-center text-[10px] uppercase tracking-[2px] text-[#b7b4ae]">
            Tripick v1.0 
          </div>
        </div>
        </div>
      </main>

      {/* 닉네임 변경 모달 */}
      {isNicknameOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
            <div className="text-[16px] font-semibold text-[#2c2c2a]">
              닉네임 변경
            </div>
            <p className="mt-2 text-[12px] text-[#8a8a87]">
              트리픽에서 사용할 닉네임을 입력해주세요.
            </p>
            <input
              type="text"
              value={nicknameInput}
              onChange={(event) => setNicknameInput(event.target.value)}
              className="mt-4 w-full rounded-xl border border-[#e8e6e0] bg-[#f7f6f3] px-3 py-2 text-[13px] text-[#2c2c2a] outline-none"
              placeholder="새 닉네임"
            />
            {nicknameError ? (
              <p className="mt-2 text-[12px] text-[#d14c3f]">
                {nicknameError}
              </p>
            ) : null}
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-xl border border-[#e8e6e0] px-3 py-2 text-[13px] text-[#2c2c2a]"
                onClick={() => setIsNicknameOpen(false)}
                disabled={isSavingNickname}
              >
                취소
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl bg-[#1D9E75] px-3 py-2 text-[13px] font-semibold text-white disabled:opacity-60"
                onClick={handleNicknameSave}
                disabled={isSavingNickname}
              >
                {isSavingNickname ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

