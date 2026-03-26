"use client";

import LoginForm from "@/components/auth/LoginForm";
import { supabase } from "@/lib/supabase";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [isKakaoSubmitting, setIsKakaoSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");
    setInfoMessage("");
    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      setErrorMessage("아이디 또는 비밀번호가 일치하지 않습니다.");
      setIsSubmitting(false);
      return;
    }

    // 로그인 완료 후 메인으로 이동
    router.push("/");
    router.refresh();
  };

  const signInWithOAuth = async (
    provider: "google" | "kakao",
    onSubmittingChange: (value: boolean) => void,
    failureMessage: string,
  ) => {
    setErrorMessage("");
    setInfoMessage("");
    onSubmittingChange(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
    });

    if (error) {
      setErrorMessage(failureMessage);
      onSubmittingChange(false);
    }
  };

  const handleGoogleLogin = async () => {
    await signInWithOAuth(
      "google",
      setIsGoogleSubmitting,
      "구글 로그인에 실패했습니다. 잠시 후 다시 시도해주세요.",
    );
  };

  const handleKakaoLogin = async () => {
    await signInWithOAuth(
      "kakao",
      setIsKakaoSubmitting,
      "카카오 로그인에 실패했습니다. 잠시 후 다시 시도해주세요.",
    );
  };

  const handleForgotPassword = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    setErrorMessage("");
    setInfoMessage("");

    if (!normalizedEmail) {
      setErrorMessage("이메일 주소를 먼저 입력해주세요.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: `${window.location.origin}/login`,
    });

    if (error) {
      setErrorMessage("비밀번호 재설정 메일 발송에 실패했습니다.");
      return;
    }

    setInfoMessage("비밀번호 재설정 메일을 보냈습니다. 메일함을 확인해주세요.");
  };

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
  );
}
