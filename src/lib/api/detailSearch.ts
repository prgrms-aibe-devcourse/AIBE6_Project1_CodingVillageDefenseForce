// 이미지 타입 선언
export type StandardImage = {
  id: string
  url: string
  alt: string
}

// 텍스트 반환 함수
export async function getDescription(keyword: string): Promise<string> {
  // 네이버 텍스트 검색
  try {
    const naverUrl = `https://openapi.naver.com/v1/search/encyc.json?query=${encodeURIComponent(keyword)}&display=1`
    const naverRes = await fetch(naverUrl, {
      headers: {
        // API 키를 이용하여 검색
        'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID || '',
        'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET || '',
      },
    })

    const naverData = await naverRes.json()
    if (naverData.items && naverData.items.length > 0) {
      // HTML 태그 제거
      let text = naverData.items[0].description.replace(/(<([^>]+)>)/gi, '')
      // [ ] 제거
      text = text.replace(/^\s*\[.*?\]\s*/g, '')
      // 마지막 .까지 문장으로 자르기
      const lastDotIndex = text.lastIndexOf('.')
      if (lastDotIndex !== -1) text = text.substring(0, lastDotIndex + 1)
      // 빈 문자열이 아니면 반환
      if (text.length > 0) return text
    }
  } catch (error) {
    console.log('네이버 텍스트 검색 실패, 위키백과로 넘어갑니다.')
  }

  // 네이버 검색이 비었으면 위키백과 검색
  try {
    const wikiUrl = `https://ko.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(keyword)}`
    const wikiRes = await fetch(wikiUrl)
    if (wikiRes.ok) {
      const wikiData = await wikiRes.json()
      if (wikiData.extract) return wikiData.extract
    }
  } catch (error) {
    console.log('위키백과 검색 실패')
  }

  // 모두 검색 결과가 없을 시 처리
  return '해당 장소에 대한 자세한 설명을 찾을 수 없습니다.'
}

// 이미지 반환 함수
export async function getImages(keyword: string): Promise<StandardImage[]> {
  // 네이버 이미지 검색
  try {
    const naverUrl = `https://openapi.naver.com/v1/search/image?query=${encodeURIComponent(keyword)}&display=4&sort=sim`
    const naverRes = await fetch(naverUrl, {
      headers: {
        // API 키를 이용하여 검색
        'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID || '',
        'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET || '',
      },
    })

    const naverData = await naverRes.json()
    // items가 있으면 반환
    if (naverData.items && naverData.items.length > 0) {
      // 타입 변환
      return naverData.items.map((img: any, index: number) => ({
        id: `naver-${index}`,
        // link는 핫링크 방지로 안뜨는 경우도 있어 thumbnail 사용
        url: img.link || img.thumbnail,
        // HTML 태그 제거
        alt: img.title.replace(/(<([^>]+)>)/gi, ''),
      }))
    }
  } catch (error) {
    console.log('네이버 이미지 검색 실패, Unsplash로 넘어갑니다.')
  }

  // 네이버 검색이 비었으면 Unsplash 검색
  try {
    const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword)}&per_page=4`
    const unsplashRes = await fetch(unsplashUrl, {
      headers: {
        // API 키를 이용하여 검색
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    })

    const unsplashData = await unsplashRes.json()
    // results가 있으면 반환
    if (unsplashData.results && unsplashData.results.length > 0) {
      // 타입 변환
      return unsplashData.results.map((img: any) => ({
        id: img.id,
        url: img.urls.small,
        alt: img.alt_description || `${keyword} 이미지`,
      }))
    }
  } catch (error) {
    console.log('Unsplash 이미지 검색 실패')
  }

  // 모두 검색 결과가 없을 시 처리
  return []
}
