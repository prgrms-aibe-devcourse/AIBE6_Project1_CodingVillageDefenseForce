import { createBrowserClient } from '@supabase/ssr'

// 브라우저 탭당 하나의 클라이언트를 유지해 중복 GoTrue 인스턴스를 방지합니다.
let browserClient:
  | ReturnType<typeof createBrowserClient>
  | null = null

export function createClient() {
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }

  return browserClient
}
