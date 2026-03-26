"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect, useState } from "react";

export default function MainAuthGate({
  children,
}: PropsWithChildren) {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    // 클라이언트에서 세션을 확인해서,
    // - 로그인 상태면 그대로 /main 화면을 보여주고
    // - 미로그인 상태면 /login으로 즉시 이동.
    let cancelled = false;

    (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();

        if (cancelled) return;
        if (data.user) {
          setIsAuthed(true);
        } else {
          setIsAuthed(false);
          router.replace("/login");
        }
      } catch {
        if (cancelled) return;
        setIsAuthed(false);
        router.replace("/login");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  // 세션 체크(초기 null) 동안에도 children을 일단 렌더해서
  // 로그인된 사용자가 /login을 거쳤다가 바로 /main으로 튀는 "깜빡임"을 줄입니다.
  // 실제로 미로그인으로 판정된 경우에만(= false) 화면을 막고 redirect가 수행됩니다.
  if (isAuthed === false) return null;
  return <>{children}</>;
}

