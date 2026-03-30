import { getImages } from '@/lib/api/detailSearch'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = await createClient()

  const { data: places, error } = await supabase
    .from('place')
    .select('id, title')

  if (error) return Response.json({ error: error.message }, { status: 500 })

  const results = []

  for (const place of places ?? []) {
    const images = await getImages(place.title)
    if (images.length > 0) {
      const { error: updateError } = await supabase
        .from('place')
        .update({ image: images[0].url })
        .eq('id', place.id)

      results.push({
        id: place.id,
        title: place.title,
        success: !updateError,
        image: images[0].url,
      })
    } else {
      results.push({ id: place.id, title: place.title, success: false })
    }

    // 네이버 API 요청 제한 방지
    await new Promise((resolve) => setTimeout(resolve, 300))
  }

  return Response.json({ results })
}
