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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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

  return (
    <LoginForm
      email={email}
      password={password}
      errorMessage={errorMessage}
      isSubmitting={isSubmitting}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
    />
  );
}

