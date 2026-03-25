"use client"; // Next.js에서 이 파일이 클라이언트 컴포넌트임을 명시 (useState 등 사용 가능)

import SignupForm from "@/components/auth/SignupForm"; // 회원가입 UI 컴포넌트
import { supabase } from "@/lib/supabase"; // Supabase 클라이언트
import { FormEvent, useState } from "react"; // React 상태관리 + 폼 이벤트 타입

export default function SignupPage() {
  // 입력값 상태 관리
  const [name, setName] = useState(""); // 사용자 이름
  const [email, setEmail] = useState(""); // 이메일
  const [password, setPassword] = useState(""); // 비밀번호
  const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 확인

  // 약관 동의 체크 상태
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // 에러 및 성공 메시지 상태
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // 회원가입 요청 진행 상태 (버튼 중복 클릭 방지용)
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 회원가입 폼 제출 이벤트
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // 폼 기본 새로고침 방지
    setErrorMessage(""); // 기존 에러 메시지 초기화
    setSuccessMessage(""); // 기존 성공 메시지 초기화

    // 비밀번호 길이 검증
    if (password.length < 8) {
      setErrorMessage("비밀번호는 8자 이상으로 입력해주세요.");
      return;
    }

    // 비밀번호와 비밀번호 확인 일치 여부 확인
    if (password !== confirmPassword) {
      setErrorMessage("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    // 약관 동의 여부 확인
    if (!agreedToTerms) {
      setErrorMessage("약관 동의 후 회원가입이 가능합니다.");
      return;
    }

    // 회원가입 요청 시작
    setIsSubmitting(true);

    // 이메일 공백 제거 + 소문자 변환
    const normalizedEmail = email.trim().toLowerCase();

    // 이름 공백 제거
    const trimmedName = name.trim();

    // Supabase 회원가입 
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        // 사용자 메타데이터에 이름 저장
        data: { name: trimmedName },
      },
    });

    // 에러 발생
    if (error) {
      const lowered = error.message.toLowerCase();

      // 이미 가입된 이메일일 경우
      if (
        lowered.includes("already registered") ||
        lowered.includes("already exists")
      ) {
        setErrorMessage("이미 가입된 이메일입니다.");
      } else {
        // 기타 에러 
        setErrorMessage(error.message);
      }

      setIsSubmitting(false);
      return;
    }

    // Supabase에서 이미 가입된 이메일임에도 identities가 비어있는 경우 있음
    if (data?.user?.identities && data.user.identities.length === 0) {
      setErrorMessage("이미 가입된 이메일입니다.");
      setIsSubmitting(false);
      return;
    }

    // 회원가입 성공
    setIsSubmitting(false);
    setSuccessMessage("가입이 완료되었습니다. 로그인해주세요.");
  };

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
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onConfirmPasswordChange={setConfirmPassword}

      // 약관 동의 체크 
      onAgreeChange={setAgreedToTerms}

      // 폼 제출 
      onSubmit={handleSubmit}
    />
  );
}