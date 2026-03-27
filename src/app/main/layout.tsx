import Sidebar from '@/components/layout/Sidebar'
import MainAuthGate from '../../components/auth/MainAuthGate'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MainAuthGate>
      <div className="flex h-screen overflow-hidden bg-[#f7f6f3]">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-auto">{children}</div>
      </div>
    </MainAuthGate>
  )
}
