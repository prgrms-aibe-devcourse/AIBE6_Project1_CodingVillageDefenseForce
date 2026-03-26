import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: Request) {
  const { userInput } = await req.json()

  const prompt = `
  당신은 여행 전문 AI 어시스턴트입니다.
  여행지, 맛집, 숙소, 관광지, 여행 팁 관련 질문만 답변하세요.
  여행과 관련 없는 질문이 오면 "죄송합니다. 저는 여행 관련 질문만 답변할 수 있어요 😊" 라고만 답변하세요.

  사용자 질문: ${userInput}
  `

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })
  const result = await model.generateContent(prompt)
  return Response.json({ answer: result.response.text() })
}
