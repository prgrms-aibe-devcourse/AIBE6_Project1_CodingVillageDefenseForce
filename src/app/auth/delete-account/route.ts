import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function DELETE() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 })
  }

  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  // user 테이블 데이터 삭제
  const { error: dbError } = await adminSupabase
    .from('user')
    .delete()
    .eq('uid', user.id)

  if (dbError) {
    return NextResponse.json({ error: '데이터 삭제 실패: ' + dbError.message }, { status: 500 })
  }

  // Auth 계정 삭제
  const { error: authError } = await adminSupabase.auth.admin.deleteUser(user.id)

  if (authError) {
    return NextResponse.json({ error: '계정 삭제 실패: ' + authError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}