"use client";

import SignupForm from "@/components/auth/SignupForm";
import { supabase } from "@/lib/supabase";
import { FormEvent, useState } from "react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (password.length < 8) {
      setErrorMessage("비밀번호는 8자 이상으로 입력해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage("약관 동의 후 회원가입이 가능합니다.");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      setErrorMessage("회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.");
      setIsSubmitting(false);
      return;
    }

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
      onAgreeChange={setAgreedToTerms}
      onSubmit={handleSubmit}
    />
  );
}
