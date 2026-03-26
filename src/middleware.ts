import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = ["/login", "/signup"];
const PROTECTED_ROUTES = ["/main", ""]; // 로그인 안하고 접속시 로그인 페이지로 넘길 페이지들

function hasSupabaseAuthCookie(request: NextRequest) {
  const cookies = request.cookies.getAll();

  // Supabase가 저장하는 auth-token 쿠키 키 패턴을 기준으로 로그인 여부 판단
  return cookies.some(({ name }) => {
    return (
      name.includes("-auth-token") ||
      name === "sb-access-token" ||
      name === "sb-refresh-token"
    );
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoggedIn = hasSupabaseAuthCookie(request);

  const isProtectedRoute = PROTECTED_ROUTES.includes(pathname);
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/main", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
