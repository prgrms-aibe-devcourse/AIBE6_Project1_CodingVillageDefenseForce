'use client'

import Link from 'next/link'
import { useState } from 'react'

import AuthShell from './AuthShell'

type SignupFormProps = {
  name: string
  email: string
  password: string
  confirmPassword: string
  agreedToTerms: boolean
  errorMessage: string
  successMessage: string
  isSubmitting: boolean
  onNameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onConfirmPasswordChange: (value: string) => void
  onAgreeChange: (checked: boolean) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

function UserIcon() {
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
      <path d="M20 21a8 8 0 00-16 0" />
      <circle cx="12" cy="8" r="4" />
    </svg>
  )
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

function EyeIcon({ show }: { show: boolean }) {
  if (show) {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 text-[#bcc2ce] transition hover:text-[#6f7687]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    )
  }
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-[#bcc2ce] transition hover:text-[#6f7687]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export default function SignupForm({
  name,
  email,
  password,
  confirmPassword,
  agreedToTerms,
  errorMessage,
  successMessage,
  isSubmitting,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onAgreeChange,
  onSubmit,
}: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <AuthShell
      activeTab="signup"
      footer={
        <p className="text-center text-[0.86rem] text-[#6f7687]">
          이미 계정이 있으신가요? {/* 로그인 페이지로 이동 */}
          <Link
            href="/login"
            className="font-semibold text-[#31d5c8] transition hover:text-[#18bdae]"
          >
            로그인
          </Link>
        </p>
      }
    >
      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="space-y-3">
          <label
            htmlFor="signup-name"
            className="block text-[0.9rem] font-medium text-[#535c71]"
          >
            사용하실 닉네임
          </label>
          <div className="flex h-15 items-center gap-3 rounded-2xl border border-[#e7e1d6] bg-white px-4 shadow-[0_8px_24px_rgba(19,41,75,0.04)]">
            <UserIcon />
            <input
              id="signup-name"
              type="text"
              placeholder="트리픽 닉네임"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              required
              autoComplete="name" /* 이름 자동완성 */
              className="w-full bg-transparent text-[0.9rem] text-[#13294b] placeholder:text-[#c6c9d2] outline-none"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label
            htmlFor="signup-email"
            className="block text-[0.9rem] font-medium text-[#535c71]"
          >
            이메일 주소
          </label>
          <div className="flex h-15 items-center gap-3 rounded-2xl border border-[#e7e1d6] bg-white px-4 shadow-[0_8px_24px_rgba(19,41,75,0.04)]">
            <MailIcon />
            <input
              id="signup-email"
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

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-3">
            <label
              htmlFor="signup-password"
              className="block text-[0.9rem] font-medium text-[#535c71]"
            >
              비밀번호
            </label>
            <div className="flex h-15 items-center gap-3 rounded-2xl border border-[#e7e1d6] bg-white px-4 shadow-[0_8px_24px_rgba(19,41,75,0.04)]">
              <LockIcon />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="8자 이상"
                value={password}
                onChange={(event) => onPasswordChange(event.target.value)}
                required
                autoComplete="new-password"
                className="w-full bg-transparent text-[0.9rem] text-[#13294b] placeholder:text-[#c6c9d2] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                <EyeIcon show={showPassword} />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label
              htmlFor="signup-password-confirm"
              className="block text-[0.9rem] font-medium text-[#535c71]"
            >
              비밀번호 확인
            </label>
            <div className="flex h-15 items-center gap-3 rounded-2xl border border-[#e7e1d6] bg-white px-4 shadow-[0_8px_24px_rgba(19,41,75,0.04)]">
              <LockIcon />
              <input
                id="signup-password-confirm"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="비밀번호 확인"
                value={confirmPassword}
                onChange={(event) =>
                  onConfirmPasswordChange(event.target.value)
                }
                required
                autoComplete="new-password"
                className="w-full bg-transparent text-[0.9rem] text-[#13294b] placeholder:text-[#c6c9d2] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                <EyeIcon show={showConfirmPassword} />
              </button>
            </div>
          </div>
        </div>

        {/* 약관 동의 체크 영역 */}
        <label className="flex items-start gap-3 rounded-2xl border border-[#e8e1d5] bg-white/80 px-4 py-4 text-[0.82rem] leading-5 text-[#5f6679]">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(event) => onAgreeChange(event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-[#d3d6dd] text-[#37d2c6] focus:ring-[#37d2c6]"
          />
          <span>서비스 이용약관 및 개인정보 처리방침에 동의합니다.</span>
        </label>

        {/* 기본 회원가입 버튼 */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 h-15 w-full rounded-full bg-[#37d2c6] text-[1rem] font-semibold text-white shadow-[0_18px_36px_rgba(55,210,198,0.34)] transition hover:-translate-y-0.5 hover:bg-[#24c4b7] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? '가입 중...' : '회원가입'}
        </button>

        {errorMessage ? (
          <p className="text-center text-[0.82rem] text-[#d64545]">
            {errorMessage}
          </p>
        ) : null}
        {successMessage ? (
          <p className="text-center text-[0.82rem] text-[#2b8f66]">
            {successMessage}
          </p>
        ) : null}
      </form>
    </AuthShell>
  )
}