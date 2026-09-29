import { useState, type ReactNode } from 'react'
import { Sidebar } from '../components/Sidebar'
import { Header } from '../components/Header'
import { GlobalSearch } from '../components/GlobalSearch'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-grey-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onOpenGlobalSearch={() => setIsGlobalSearchOpen(true)} />
        <main className="flex-1 overflow-y-auto p-5">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
      <GlobalSearch isOpen={isGlobalSearchOpen} onClose={() => setIsGlobalSearchOpen(false)} />
    </div>
  )
}
