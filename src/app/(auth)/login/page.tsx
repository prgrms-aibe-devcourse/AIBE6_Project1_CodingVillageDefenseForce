'use client'

import LoginForm from "@/components/auth/LoginForm";
import { createClient } from "@/lib/supabase/client";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [infoMessage, setInfoMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)
  const [isKakaoSubmitting, setIsKakaoSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setErrorMessage('')
    setInfoMessage('')
    setIsSubmitting(true)

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    if (error) {
      setErrorMessage('아이디 또는 비밀번호가 일치하지 않습니다.')
      setIsSubmitting(false)
      return
    }

    // 로그인 완료 후 메인으로 이동
    router.push("/main");
    router.refresh();
  };

  const signInWithOAuth = async (
    provider: 'google' | 'kakao',
    onSubmittingChange: (value: boolean) => void,
    failureMessage: string,
  ) => {
    setErrorMessage('')
    setInfoMessage('')
    onSubmittingChange(true)

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        // OAuth 완료 후 callback에서 code 교환 후 /main으로 이동
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErrorMessage(failureMessage)
      onSubmittingChange(false)
    }
  }

  const handleGoogleLogin = async () => {
    await signInWithOAuth(
      'google',
      setIsGoogleSubmitting,
      '구글 로그인에 실패했습니다. 잠시 후 다시 시도해주세요.',
    )
  }

  const handleKakaoLogin = async () => {
    await signInWithOAuth(
      'kakao',
      setIsKakaoSubmitting,
      '카카오 로그인에 실패했습니다. 잠시 후 다시 시도해주세요.',
    )
  }

  // 이미 로그인된 사용자는 로그인 페이지 접근 시 /main으로 보냄
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        if (!cancelled && data.user) router.replace("/main");
      } catch {
        // 세션이 없거나 네트워크 문제면 그냥 로그인 화면 유지
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleForgotPassword = async () => {
    const normalizedEmail = email.trim().toLowerCase()
    const supabase = createClient()

    setErrorMessage('')
    setInfoMessage('')

    if (!normalizedEmail) {
      setErrorMessage('이메일 주소를 먼저 입력해주세요.')
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(
      normalizedEmail,
      {
        redirectTo: `${window.location.origin}/login`,
      },
    )


    if (error) {
      setErrorMessage('비밀번호 재설정 메일 발송에 실패했습니다.')
      return
    }

    setInfoMessage('비밀번호 재설정 메일을 보냈습니다. 메일함을 확인해주세요.')
  }

  return (
    <LoginForm
      email={email}
      password={password}
      errorMessage={errorMessage}
      infoMessage={infoMessage}
      isSubmitting={isSubmitting}
      isGoogleSubmitting={isGoogleSubmitting}
      isKakaoSubmitting={isKakaoSubmitting}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
      onForgotPassword={handleForgotPassword}
      onGoogleLogin={handleGoogleLogin}
      onKakaoLogin={handleKakaoLogin}
    />
  )
}
