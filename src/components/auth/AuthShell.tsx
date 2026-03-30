import Link from 'next/link'
import { ReactNode } from 'react'

type AuthShellProps = {
  activeTab: 'login' | 'signup'
  children: ReactNode
  footer: ReactNode
}

function CompassLogo() {
  return (
    <div className="flex items-center gap-3 text-white">
      <span className="text-[2.15rem] font-semibold tracking-[-0.04em]">
        Tripick
      </span>
    </div>
  )
}

export default function AuthShell({
  activeTab,
  children,
  footer,
}: AuthShellProps) {
  const tabs = [
    { href: '/login', label: '로그인', key: 'login' },
    { href: '/signup', label: '회원가입', key: 'signup' },
  ] as const

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f0e8] px-6 py-10 text-[#13294b] sm:px-10 lg:px-12 lg:py-14">
      {/* 온보딩 배경과 통일 */}
      <div className="absolute inset-0 z-0 grid grid-cols-2 grid-rows-2 gap-1.5 p-1.5">
        {[
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=70',
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=70',
          'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=70',
          'https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=600&q=70',
        ].map((src) => (
          <div
            key={src}
            className="rounded-2xl bg-cover bg-center opacity-55"
            style={{ backgroundImage: `url('${src}')` }}
          />
        ))}
      </div>

      {/* 배경 오버레이 */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#f5f0e8]/30 via-[#f5f0e8]/55 to-[#f5f0e8]/30" />

      <div className="relative z-20 grid w-full max-w-[840px] overflow-hidden rounded-[22px] border border-[#e9e4da] bg-[#f7f3ec] shadow-[0_14px_26px_rgba(15,23,42,0.07),0_30px_72px_rgba(15,23,42,0.16)] lg:min-h-[520px] lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative overflow-hidden bg-[#13244a]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(85,255,237,0.12),_transparent_32%),linear-gradient(180deg,rgba(14,28,61,0.84),rgba(12,22,48,0.96))]" />
          <div className="absolute inset-0 opacity-25">
            <div className="absolute -left-12 top-20 h-[36rem] w-[36rem] rounded-full border border-white/10" />
            <div className="absolute -left-6 top-28 h-[32rem] w-[32rem] rounded-full border border-white/6" />
            <div className="absolute left-10 top-32 h-[28rem] w-[18rem] rotate-[28deg] rounded-[999px] border border-[#4f6ba8]/30" />
            <div className="absolute left-16 top-44 h-[28rem] w-[18rem] rotate-[28deg] rounded-[999px] border border-[#36538b]/20" />
            <div className="absolute bottom-[-8rem] left-[-4rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,_rgba(56,83,139,0.28),_transparent_62%)]" />
          </div>

          <div className="relative flex min-h-[17rem] flex-col px-6 py-7 sm:px-8 sm:py-8 lg:h-full lg:min-h-[520px] lg:px-9 lg:py-8">
            <CompassLogo />

            <div className="mt-auto max-w-[14rem] pb-5 pt-9 sm:max-w-[16rem] lg:max-w-[14rem]">
              <p className="text-[1.45rem] leading-[1.18] font-semibold tracking-[-0.05em] text-white sm:text-[1.9rem]">
                나만을 위한
                <br />
                특별한 여행의 시작.
              </p>
              <p className="mt-3 text-[0.8rem] leading-5 text-[#a6b4d8] sm:text-[0.9rem]">
                테마 별 여행지들을 찾아보고
                <br />
                나만의 여행 일정을 만들어보세요.
              </p>
            </div>

            <p className="text-[0.78rem] text-[#7586af]">
              &copy; 2026 Tripick.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="flex min-h-[26.5rem] w-full max-w-[21.5rem] flex-col justify-between">
            {/* 로그인 / 회원가입 화면을 전환하는 상단 탭 */}
            <nav className="flex gap-6 border-b border-[#e8e1d5]">
              {tabs.map((tab) => {
                const isActive = tab.key === activeTab

                return (
                  <Link
                    key={tab.key}
                    href={tab.href}
                    className={`relative pb-3 text-[0.92rem] tracking-[-0.02em] transition-colors ${
                      isActive
                        ? 'font-semibold text-[#13294b]'
                        : 'font-medium text-[#7f8697] hover:text-[#13294b]'
                    }`}
                  >
                    {tab.label}
                    {isActive ? (
                      <span className="absolute inset-x-0 bottom-[-1px] h-[3px] rounded-full bg-[#13294b]" />
                    ) : null}
                  </Link>
                )
              })}
            </nav>

            {/* 각 페이지별 폼 본문 */}
            <div className="flex-1 pt-5">{children}</div>
            {/* 폼 아래 보조 링크/문구 */}
            <div className="pt-5">{footer}</div>
          </div>
        </section>
      </div>
    </main>
  )
}
