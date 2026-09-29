import { Bell, HelpCircle, Search, User, Play, X } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import { useState } from 'react'

interface HeaderProps {
  onOpenGlobalSearch: () => void
}

export function Header({ onOpenGlobalSearch }: HeaderProps) {
  const { demoMode, toggleDemoMode, demoSteps, nationalCodes } = useAppContext()
  const [showDemoGuide, setShowDemoGuide] = useState(false)

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-grey-200 bg-white px-5 shadow-card">
      <div className="flex items-center gap-4">
        <span className="text-xs text-grey-400">
          National Material Master Platform
        </span>
        <span className="inline-flex items-center rounded-md bg-primary-100 px-2 py-[3px] text-xs font-medium text-primary-800">
          Enterprise Prototype
        </span>
        {nationalCodes.length > 0 && (
          <span className="inline-flex items-center gap-1 rounded-md bg-success-100 px-2 py-[3px] text-xs font-medium text-success-800">
            <span className="h-1.5 w-1.5 rounded-full bg-success-500" />
            {nationalCodes.length} CNMCs Active
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search materials, codes..."
            onFocus={onOpenGlobalSearch}
            className="w-64 rounded-md border border-grey-300 pl-9 pr-3 py-1 text-sm text-grey-800 placeholder-grey-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-grey-400" />
        </div>

        <button
          onClick={onOpenGlobalSearch}
          className="rounded-md border border-grey-300 bg-white p-2 text-grey-600 hover:bg-grey-50 md:hidden"
        >
          <Search className="h-4 w-4" />
        </button>

        <div className="h-5 w-px bg-grey-200" />

        <button
          onClick={toggleDemoMode}
          className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
            demoMode
              ? 'border-primary-600 bg-primary-50 text-primary-700'
              : 'border-grey-300 bg-white text-grey-700 hover:bg-grey-50'
          }`}
        >
          <Play className="h-3.5 w-3.5" />
          Demo Mode
        </button>

        <button
          onClick={() => setShowDemoGuide(!showDemoGuide)}
          className="rounded-md border border-grey-300 bg-white p-2 text-grey-600 hover:bg-grey-50"
        >
          <HelpCircle className="h-4 w-4" />
        </button>

        <button className="rounded-md border border-grey-300 bg-white p-2 text-grey-600 hover:bg-grey-50">
          <Bell className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2.5 border-l border-grey-200 pl-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-primary-700">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-grey-800">Admin User</p>
            <p className="text-xs text-grey-500">CPSE Administration</p>
          </div>
        </div>
      </div>

      {showDemoGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-lg border border-grey-200 bg-white shadow-xl">
            <div className="border-b border-grey-200 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-grey-800">Guided Demo</h3>
                <button
                  onClick={() => setShowDemoGuide(false)}
                  className="rounded p-1 text-grey-400 hover:bg-grey-100 hover:text-grey-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <p className="text-xs text-grey-500 mb-3">
                Recommended demo sequence to showcase the full material harmonization journey:
              </p>
              <div className="space-y-2">
                {demoSteps.map((step) => (
                  <div
                    key={step.step}
                    className="flex gap-3 rounded-md border border-grey-200 p-3 transition-colors hover:bg-grey-50"
                  >
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-grey-800">{step.title}</p>
                      <p className="text-xs text-grey-500">{step.description}</p>
                      {step.hint && (
                        <p className="mt-1 text-xs text-grey-400">Hint: {step.hint}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
