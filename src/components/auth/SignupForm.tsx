import Link from "next/link";

import AuthShell from "./AuthShell";

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
  );
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
  );
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
  );
}

export default function SignupForm() {
  return (
    <AuthShell
      activeTab="signup"
      footer={
        <p className="text-center text-[0.86rem] text-[#6f7687]">
          이미 계정이 있으신가요?{" "}
          {/* 로그인 페이지로 이동 */}
          <Link
            href="/login"
            className="font-semibold text-[#31d5c8] transition hover:text-[#18bdae]"
          >
            로그인
          </Link>
        </p>
      }
    >
      <form className="space-y-6">
        <div className="space-y-3">
          <label
            htmlFor="signup-name"
            className="block text-[0.9rem] font-medium text-[#535c71]"
          >
            이름
          </label>
          <div className="flex h-15 items-center gap-3 rounded-2xl border border-[#e7e1d6] bg-white px-4 shadow-[0_8px_24px_rgba(19,41,75,0.04)]">
            <UserIcon />
            <input
              id="signup-name"
              type="text"
              placeholder="트리픽 사용자"
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
                type="password"
                placeholder="8자 이상"
                className="w-full bg-transparent text-[0.9rem] text-[#13294b] placeholder:text-[#c6c9d2] outline-none"
              />
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
                type="password"
                placeholder="비밀번호 확인"
                className="w-full bg-transparent text-[0.9rem] text-[#13294b] placeholder:text-[#c6c9d2] outline-none"
              />
            </div>
          </div>
        </div>

        {/* 약관 동의 체크 영역 */}
        <label className="flex items-start gap-3 rounded-2xl border border-[#e8e1d5] bg-white/80 px-4 py-4 text-[0.82rem] leading-5 text-[#5f6679]">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-[#d3d6dd] text-[#37d2c6] focus:ring-[#37d2c6]"
          />
          <span>
            서비스 이용약관 및 개인정보 처리방침에 동의합니다.
          </span>
        </label>

        {/* 기본 회원가입 버튼 */}
        <button
          type="button"
          className="mt-2 h-15 w-full rounded-full bg-[#37d2c6] text-[1rem] font-semibold text-white shadow-[0_18px_36px_rgba(55,210,198,0.34)] transition hover:-translate-y-0.5 hover:bg-[#24c4b7]"
        >
          회원가입
        </button>
      </form>
    </AuthShell>
  );
}
