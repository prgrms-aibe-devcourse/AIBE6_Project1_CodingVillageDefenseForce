import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const origin = requestUrl.origin
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      // SSO 제공자별로 가능한 표시 이름을 우선순위로 선택합니다.
      const metadata = user.user_metadata ?? {}
      const displayName =
        metadata.name ||
        metadata.full_name ||
        metadata.preferred_username ||
        user.email?.split('@')[0] ||
        ''
      // 구글: picture, 카카오: avatar_url
      const avatarUrl = metadata.picture || metadata.avatar_url || null
      const createdAt = user.created_at
        ? new Date(user.created_at).toISOString().slice(0, 10)
        : null

      // uid 기준 재로그인 시 중복 레코드를 방지합니다.
      await supabase.from('user').upsert(
        {
          uid: user.id,
          display_name: displayName,
          email: user.email ?? '',
          avatar_url: avatarUrl,
          createat: createdAt,
        },
        { onConflict: 'uid' },
      )
    }
  }

  return NextResponse.redirect(`${origin}/main`)
}
