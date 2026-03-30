import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { DBUser } from '../types/planner_type'

const supabase = createClient()

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<DBUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: authUser, error: authError } =
          await supabase.auth.getUser()

        if (authError || !authUser?.user) {
          alert('로그인이 필요합니다')
          router.push('/login')
          return
        }

        const { data: dbUser, error: userError } = await supabase
          .from('user')
          .select('id')
          .eq('uid', authUser.user.id)
          .single()

        if (userError || !dbUser) {
          console.error('유저 매핑 실패:', userError)
          alert('유저 정보를 불러오는 데 실패했습니다.')
          return
        }

        setUser(dbUser)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { user, isLoading }
}
