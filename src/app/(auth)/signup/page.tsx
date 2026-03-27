'use client'

import SignupForm from '@/components/auth/SignupForm'
import { createClient } from '@/lib/supabase/client'
import { FormEvent, useState } from 'react'

const SIGNUP_SUCCESS_MESSAGE = '가입이 완료되었습니다. 로그인해주세요.'

function getSignupErrorMessage(message: string) {
  const lowered = message.toLowerCase()
  if (
    lowered.includes('already registered') ||
    lowered.includes('already exists')
  ) {
    return '이미 가입된 이메일입니다.'
  }
  return message
}

export default function SignupPage() {
  const supabase = createClient()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (password.length < 8) {
      setErrorMessage('비밀번호는 8자 이상으로 입력해주세요.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('비밀번호 확인이 일치하지 않습니다.')
      return
    }

    if (!agreedToTerms) {
      setErrorMessage('약관 동의 후 회원가입이 가능합니다.')
      return
    }

    setIsSubmitting(true)

    const normalizedEmail = email.trim().toLowerCase()
    const trimmedName = name.trim()

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: { name: trimmedName },
      },
    })

    if (error) {
      setErrorMessage(getSignupErrorMessage(error.message))
      setIsSubmitting(false)
      return
    }

    // Supabase 보안 설정에서는 중복 이메일이 error 없이 반환될 수 있음
    if (data?.user?.identities && data.user.identities.length === 0) {
      setErrorMessage('이미 가입된 이메일입니다.')
      setIsSubmitting(false)
      return
    }

    if (data?.user) {
      // auth uid를 public.user.uid에 저장
      const metadata = data.user.user_metadata ?? {}
      // 구글: picture, 카카오: avatar_url
      const avatarUrl = metadata.picture || metadata.avatar_url || null
      const createdAt = data.user.created_at
        ? new Date(data.user.created_at).toISOString().slice(0, 10)
        : null

      const { error: insertError } = await supabase.from('user').upsert(
        {
          uid: data.user.id,
          display_name: trimmedName,
          email: normalizedEmail,
          avatar_url: avatarUrl,
          createat: createdAt,
        },
        // uid 기준 중복 가입/SSO 재로그인 시 실패를 방지합니다.
        { onConflict: 'uid' },
      )

      if (insertError) {
        setErrorMessage('가입 정보 저장 중 오류가 발생했습니다.')
        setIsSubmitting(false)
        return
      }
    }

    setIsSubmitting(false)
    setSuccessMessage(SIGNUP_SUCCESS_MESSAGE)
  }

  return (
    <SignupForm
      name={name}
      email={email}
      password={password}
      confirmPassword={confirmPassword}
      agreedToTerms={agreedToTerms}
      errorMessage={errorMessage}
      successMessage={successMessage}
      isSubmitting={isSubmitting}
      onNameChange={setName}
      onEmailChange={setEmail} //
      onPasswordChange={setPassword} // 비밀번호 변경
      onConfirmPasswordChange={setConfirmPassword} // 비밀번호 확인 변경
      onAgreeChange={setAgreedToTerms} // 약관 동의 체크
      onSubmit={handleSubmit} // 폼 제출
    />
  )
}
