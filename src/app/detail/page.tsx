import { getDescription, getImages } from '@/lib/api/detailSearch'

export default async function DetailPage() {
  const searchTerm = '서울 한강' // test 검색어

  // 검색 정보 가져오기
  const description = await getDescription(searchTerm)
  const images = await getImages(searchTerm)

  // 화면에 검색 결과 표시
  return (
    <div>
      <h1>{searchTerm} 검색 결과</h1>
      <hr />

      <section>
        <h2>About the Destination</h2>
        <p>{description}</p>
      </section>

      <section>
        <h2>Gallery</h2>
        <div>
          {images.map((img, index) => (
            <img
              key={index}
              src={img.url}
              alt={img.alt}
              width={200}
              height={200}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
