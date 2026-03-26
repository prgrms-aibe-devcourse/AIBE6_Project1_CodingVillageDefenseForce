import Link from 'next/link'
import { FormEventHandler } from 'react'

import AuthShell from './AuthShell'

type LoginFormProps = {
  email: string
  password: string
  errorMessage: string
  infoMessage: string
  isSubmitting: boolean
  isGoogleSubmitting: boolean
  isKakaoSubmitting: boolean
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSubmit: FormEventHandler<HTMLFormElement>
  onForgotPassword: () => Promise<void>
  onGoogleLogin: () => Promise<void>
  onKakaoLogin: () => Promise<void>
}

type SocialButtonsProps = {
  onGoogleLogin: () => Promise<void>
  isGoogleSubmitting: boolean
  onKakaoLogin: () => Promise<void>
  isKakaoSubmitting: boolean
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-[#bcc2ce]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-[#bcc2ce]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 118 0v3" />
      <circle cx="12" cy="16" r="1" />
    </svg>
  )
}

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M21.6 12.23c0-.68-.06-1.33-.17-1.96H12v3.7h5.39a4.6 4.6 0 01-2 3.02v2.5h3.24c1.9-1.75 2.97-4.33 2.97-7.26z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.24-2.5c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.58-4.12H3.07v2.58A10 10 0 0012 22z"
        fill="#34A853"
      />
      <path
        d="M6.42 13.91A5.98 5.98 0 016.1 12c0-.66.11-1.3.32-1.91V7.51H3.07A10 10 0 002 12c0 1.61.39 3.13 1.07 4.49l3.35-2.58z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.97c1.47 0 2.79.5 3.83 1.47l2.87-2.87C16.95 2.94 14.7 2 12 2A10 10 0 003.07 7.51l3.35 2.58C7.2 7.73 9.4 5.97 12 5.97z"
        fill="#EA4335"
      />
    </svg>
  )
}

function KakaoLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M12 4c-4.97 0-9 3.13-9 6.98 0 2.49 1.69 4.67 4.22 5.9l-1.06 3.88a.35.35 0 00.54.38l4.64-3.08c.22.02.44.03.66.03 4.97 0 9-3.13 9-6.98S16.97 4 12 4z"
        fill="#191600"
      />
    </svg>
  )
}

function SocialButtons({
  onGoogleLogin,
  isGoogleSubmitting,
  onKakaoLogin,
  isKakaoSubmitting,
}: SocialButtonsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* 구글 로그인 버튼 */}
      <button
        type="button"
        onClick={() => void onGoogleLogin()}
        disabled={isGoogleSubmitting}
        className="flex h-14 items-center justify-center gap-3 rounded-full border border-[#e2ddcf] bg-white text-[0.88rem] font-medium text-[#2b3550] transition hover:border-[#cfd7e8] hover:shadow-[0_14px_34px_rgba(19,41,75,0.08)]"
      >
        <GoogleLogo />
        {isGoogleSubmitting ? 'Google 이동 중...' : 'Google 로그인'}
      </button>

      {/* 카카오 로그인 버튼*/}
      <button
        type="button"
        onClick={() => void onKakaoLogin()}
        disabled={isKakaoSubmitting}
        className="flex h-14 items-center justify-center gap-3 rounded-full bg-[#ffd600] text-[0.86rem] font-semibold text-[#2e2200] transition hover:brightness-[0.98] hover:shadow-[0_16px_34px_rgba(255,214,0,0.28)]"
      >
        <KakaoLogo />
        {isKakaoSubmitting ? '카카오 이동 중...' : '카카오 로그인'}
      </button>
    </div>
  )
}

export default function LoginForm({
  email,
  password,
  errorMessage,
  infoMessage,
  isSubmitting,
  isGoogleSubmitting,
  isKakaoSubmitting,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onForgotPassword,
  onGoogleLogin,
  onKakaoLogin,
}: LoginFormProps) {
  return (
    <AuthShell
      activeTab="login"
      footer={
        <p className="text-center text-[0.86rem] text-[#6f7687]">
          아직 계정이 없으신가요? {/* 회원가입 페이지로 이동 */}
          <Link
            href="/signup"
            className="font-semibold text-[#31d5c8] transition hover:text-[#18bdae]"
          >
            회원가입
          </Link>
        </p>
      }
    >
      {/* 이메일/비밀번호 기본 로그인 폼 */}
      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="space-y-3">
          <label
            htmlFor="login-email"
            className="block text-[0.9rem] font-medium text-[#535c71]"
          >
            이메일 주소
          </label>
          <div className="flex h-15 items-center gap-3 rounded-2xl border border-[#e7e1d6] bg-white px-4 shadow-[0_8px_24px_rgba(19,41,75,0.04)]">
            <MailIcon />
            <input
              id="login-email"
              type="email"
              placeholder="example@tripick.com"
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              required
              autoComplete="email"
              className="w-full bg-transparent text-[0.9rem] text-[#13294b] placeholder:text-[#c6c9d2] outline-none"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label
            htmlFor="login-password"
            className="block text-[0.9rem] font-medium text-[#535c71]"
          >
            비밀번호
          </label>
          <div className="flex h-15 items-center gap-3 rounded-2xl border border-[#e7e1d6] bg-white px-4 shadow-[0_8px_24px_rgba(19,41,75,0.04)]">
            <LockIcon />
            <input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-transparent text-[0.9rem] text-[#13294b] placeholder:text-[#c6c9d2] outline-none"
            />
          </div>
          <div className="flex justify-end gap-6 text-[0.82rem] text-[#707789]">
            {/* 비밀번호 찾기 버튼 */}
            <button
              type="button"
              onClick={() => void onForgotPassword()}
              className="transition hover:text-[#13294b]"
            >
              비밀번호 재설정
            </button>
          </div>
        </div>

        {/* 기본 로그인 버튼 */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 h-15 w-full rounded-full bg-[#37d2c6] text-[1rem] font-semibold text-white shadow-[0_18px_36px_rgba(55,210,198,0.34)] transition hover:-translate-y-0.5 hover:bg-[#24c4b7] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? '로그인 중...' : '로그인'}
        </button>

        {errorMessage ? (
          <p className="text-center text-[0.82rem] text-[#d64545]">
            {errorMessage}
          </p>
        ) : null}
        {infoMessage ? (
          <p className="text-center text-[0.82rem] text-[#2b8f66]">
            {infoMessage}
          </p>
        ) : null}
      </form>

      {/* 소셜 로그인 버튼 영역 */}
      <div className="mt-11">
        <div className="flex items-center gap-4 text-[0.82rem] text-[#888f9e]">
          <div className="h-px flex-1 bg-[#e2ddd1]" />
          또는
          <div className="h-px flex-1 bg-[#e2ddd1]" />
        </div>
        <div className="mt-8">
          <SocialButtons
            onGoogleLogin={onGoogleLogin}
            isGoogleSubmitting={isGoogleSubmitting}
            onKakaoLogin={onKakaoLogin}
            isKakaoSubmitting={isKakaoSubmitting}
          />
        </div>
      </div>
    </AuthShell>
  )
}
