'use client'

declare global {
  interface Window {
    kakao: any
  }
}

import { useEffect, useRef } from 'react'

interface KakaoMapProps {
  searchTerm: string
  onAddressFound?: (address: string) => void
}

export default function KakaoMap({ searchTerm }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services`
    script.async = true
    script.onload = () => {
      window.kakao.maps.load(() => {
        const ps = new window.kakao.maps.services.Places()

        const showMap = (result: any) => {
          const lat = parseFloat(result[0].y)
          const lng = parseFloat(result[0].x)
          const map = new window.kakao.maps.Map(mapRef.current, {
            center: new window.kakao.maps.LatLng(lat, lng),
            level: 3,
          })
          new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(lat, lng),
            map: map,
          })
        }

        ps.keywordSearch(searchTerm, (result: any, status: any) => {
          if (status === window.kakao.maps.services.Status.OK) {
            showMap(result)
          } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
            ps.keywordSearch(searchTerm, (result2: any, status2: any) => {
              if (status2 === window.kakao.maps.services.Status.OK) {
                showMap(result2)
              }
            })
          }
        })
      })
    }
    document.head.appendChild(script)
  }, [])

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
}
