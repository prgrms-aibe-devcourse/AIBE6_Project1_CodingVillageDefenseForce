'use client'

import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'

type Message = {
  role: 'user' | 'ai'
  text: string
}

function ChatIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

type Props = {
  place?: string
  tag?: string
}

export default function AIChatModal({ place, tag }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: '안녕하세요! 무엇이든 물어보세요 😊' },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const suggestions =
    place && tag
      ? [
          `${place}의 ${tag}를 추천해줘`,
          `${place} 근처 숙소 알려줘`,
          `${place} 여행 꿀팁 알려줘`,
        ]
      : null

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(text?: string) {
    const trimmed = (text ?? input).trim()
    if (!trimmed || isLoading) return

    setMessages((prev) => [...prev, { role: 'user', text: trimmed }])
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput: trimmed }),
      })
      const data = (await res.json()) as { answer: string }
      setMessages((prev) => [...prev, { role: 'ai', text: data.answer }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: '오류가 발생했습니다. 다시 시도해주세요.' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  return (
    <>
      {/* 채팅창 */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex w-80 flex-col rounded-2xl border border-[#e2ddd1] bg-white shadow-[0_20px_60px_rgba(19,41,75,0.15)] sm:w-96">
          {/* 헤더 */}
          <div className="flex items-center justify-between rounded-t-2xl bg-[#37d2c6] px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <ChatIcon />
              </div>
              <span className="font-semibold text-white">AI 추천</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-white transition hover:bg-white/20"
              aria-label="닫기"
            >
              <CloseIcon />
            </button>
          </div>

          {/* 추천 질문 버튼 영역 */}
          <div className="border-b border-[#e7e1d6] px-4 py-3">
            {suggestions ? (
              <div className="flex flex-col gap-2">
                <p className="text-[0.78rem] text-[#888f9e]">추천 질문</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => void handleSend(q)}
                      disabled={isLoading}
                      className="rounded-full border border-[#37d2c6] px-3 py-1 text-[0.78rem] text-[#37d2c6] transition hover:bg-[#37d2c6] hover:text-white disabled:opacity-40"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center text-[0.82rem] text-[#aab0be]">
                여행지를 선택하면 맞춤 추천을 받을 수 있어요
              </p>
            )}
          </div>

          {/* 메시지 영역 */}
          <div className="flex h-64 flex-col gap-3 overflow-y-auto p-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 text-[0.88rem] leading-none whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-[#37d2c6] text-white'
                        : 'bg-[#f4f6fa] text-[#13294b]'
                    }`}
                  >
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                }
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-[#f4f6fa] px-4 py-2 text-[0.88rem] text-[#888f9e]">
                  답변 생성 중...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* 추천 질문 칩 */}
          {suggestions && (
            <div className="flex gap-2 overflow-x-auto border-t border-[#e7e1d6] px-3 py-2 scrollbar-hide">
              {suggestions.map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="shrink-0 rounded-full border border-[#37d2c6] px-3 py-1 text-[0.75rem] text-[#37d2c6] transition hover:bg-[#37d2c6] hover:text-white"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* 입력창 */}
          <div className="flex items-center gap-2 border-t border-[#e7e1d6] p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="메시지를 입력하세요..."
              className="flex-1 rounded-full border border-[#e7e1d6] bg-[#f8f7f4] px-4 py-2 text-[0.88rem] text-[#13294b] placeholder:text-[#c6c9d2] outline-none focus:border-[#37d2c6]"
            />
            <button
              onClick={() => void handleSend()}
              disabled={!input.trim() || isLoading}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#37d2c6] text-white transition hover:bg-[#24c4b7] disabled:opacity-40"
              aria-label="전송"
            >
              <SendIcon />
            </button>
          </div>
        </div>
      )}

      {/* 플로팅 버튼 */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-18 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#37d2c6] text-white shadow-[0_8px_30px_rgba(55,210,198,0.45)] transition hover:-translate-y-0.5 hover:bg-[#24c4b7] hover:shadow-[0_12px_36px_rgba(55,210,198,0.5)]"
        aria-label="AI 채팅 열기"
      >
        <ChatIcon />
      </button>
    </>
  )
}
