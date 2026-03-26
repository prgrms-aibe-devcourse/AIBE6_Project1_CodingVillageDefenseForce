import KakaoMap from './KakaoMap'

import { getDescription, getImages } from '@/lib/api/detailSearch'

export default async function DetailPage() {
  // TODO: 실제 서비스 시 하드 코딩 제거 -> 검색어 받아와서 처리
  const searchTerm = '서울 한강공원' // test 검색어

  // 검색 정보 가져오기
  const description = await getDescription(searchTerm)
  const images = await getImages(searchTerm)

  // 첫 장을 메인 이미지로 표현
  const heroImage = images.length > 0 ? images[0].url : 'images/default.jpg'
  // 나머지는 갤러리 이미지로 표현
  const galleryImages = images.slice(1, 4)

  // 화면에 검색 결과 표시
  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      {/* 1. 상단 메인 이미지 + 요약 영역 */}
      <div className="relative h-[450px] w-full">
        {/* 넓은 배경 이미지 */}
        <img
          src={heroImage}
          alt={`${searchTerm} 배경`}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* 우측 상단 버튼 */}
        <div className="absolute top-8 right-8 flex gap-3 z-10">
          <button className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/50 transition">
            🤍
          </button>
          <button className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/50 transition">
            🔗
          </button>
        </div>

        {/* 요약 정보 카드(추후 정보 연동) */}
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 z-20">
          <div className="flex items-center gap-4 mb-3">
            <span className="bg-[#EDF2FA] text-[#4A72B2] text-xs font-extrabold px-3 py-1 rounded-full tracking-wider uppercase">
              Nature Sanctuary
            </span>
            <span className="text-[#E74C3C] text-sm font-bold">
              ★ 4.9 (1,240 Reviews)
            </span>
          </div>

          <h1 className="text-4xl font-extrabold text-[#222] mb-2">
            {searchTerm}
          </h1>
          <p className="text-[#777] text-sm mb-6">📍 주소 데이터 연동 예정</p>

          <hr className="border-[#EAEAEA] mb-6" />

          {/* 하단 아이콘 정보(추후 정보 연동) */}
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center justify-center gap-1">
              <span className="text-2xl">🕒</span>
              <span className="text-[10px] text-[#999] tracking-widest uppercase font-bold">
                Best Time
              </span>
              <span className="text-sm font-semibold text-[#333]">
                06:00 - 08:00
              </span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
              <span className="text-2xl">🚶‍♂️</span>
              <span className="text-[10px] text-[#999] tracking-widest uppercase font-bold">
                Difficulty
              </span>
              <span className="text-sm font-semibold text-[#333]">
                Easy Walk
              </span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
              <span className="text-2xl">☀️</span>
              <span className="text-[10px] text-[#999] tracking-widest uppercase font-bold">
                Weather
              </span>
              <span className="text-sm font-semibold text-[#333]">
                Sunny 18°C
              </span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
              <span className="text-2xl">💰</span>
              <span className="text-[10px] text-[#999] tracking-widest uppercase font-bold">
                Entry Fee
              </span>
              <span className="text-sm font-semibold text-[#333]">Free</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 하단 컨텐츠 영역 */}
      <div className="max-w-5xl mx-auto mt-36 px-4 flex flex-col lg:flex-row gap-12">
        {/* 좌측 메인 영역 */}
        <div className="lg:w-[65%] flex flex-col gap-12">
          {/* 장소 설명 텍스트 */}
          <section>
            <h2 className="text-2xl font-bold text-[#222] mb-4">
              {searchTerm}
            </h2>
            <p className="text-[#555] text-base leading-relaxed">
              {description}
            </p>
          </section>

          {/* 방문자 리뷰(추후 리뷰 연동) */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-[#222]">방문자 리뷰</h2>
              <button className="text-[#007A6B] font-bold text-sm hover:underline">
                모두 보기
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {/* 리뷰 플레이스홀더 1 */}
              <div className="bg-[#F4F6F6] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <div className="text-sm font-bold text-[#333]">김지은</div>
                    <div className="text-[#E74C3C] text-xs">★★★★★</div>
                  </div>
                  <div className="ml-auto text-xs text-[#999]">2 days ago</div>
                </div>
                <p className="text-[#666] text-sm leading-relaxed">
                  리뷰 데이터 연동 예정...
                </p>
              </div>

              {/* 리뷰 플레이스홀더 2 */}
              <div className="bg-[#F4F6F6] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <div className="text-sm font-bold text-[#333]">김민준</div>
                    <div className="text-[#E74C3C] text-xs">★★★★☆</div>
                  </div>
                  <div className="ml-auto text-xs text-[#999]">1 week ago</div>
                </div>
                <p className="text-[#666] text-sm leading-relaxed">
                  리뷰 데이터 연동 예정...
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* 우측 사이드바 영역 */}
        <div className="lg:w-[35%] flex flex-col gap-10">
          {/* 지도 영역 (추후 카카오/구글 맵 연동 공간) -> (카카오 맵 추가 완료) */}
          <section className="relative w-full h-[240px] bg-[#BCE0D7] rounded-[24px]  overflow-hidden border-[6px] border-white shadow-sm">
            <KakaoMap searchTerm={`${searchTerm}`} />
          </section>

          {/* 갤러리 영역 */}
          <section>
            <h3 className="text-xs font-bold text-[#888] tracking-[0.15em] uppercase mb-4">
              관련 이미지
            </h3>

            {galleryImages.length > 0 ? (
              <div className="grid grid-cols-2 grid-rows-2 gap-3 h-[320px]">
                {galleryImages[0] && (
                  <img
                    src={galleryImages[0].url}
                    alt={galleryImages[0].alt}
                    className="row-span-2 w-full h-full object-cover rounded-[20px]"
                  />
                )}
                {galleryImages[1] && (
                  <img
                    src={galleryImages[1].url}
                    alt={galleryImages[1].alt}
                    className="w-full h-full object-cover rounded-[20px]"
                  />
                )}
                {galleryImages[2] && (
                  <img
                    src={galleryImages[2].url}
                    alt={galleryImages[2].alt}
                    className="w-full h-full object-cover rounded-[20px]"
                  />
                )}
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center bg-gray-100 rounded-[20px] text-[#999]">
                이미지가 없습니다.
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
