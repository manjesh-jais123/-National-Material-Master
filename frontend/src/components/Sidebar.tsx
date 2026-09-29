import { useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Brain,
  ClipboardCheck,
  Hash,
  GitMerge,
  BarChart3,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '../utils/cn'
import { useState, useEffect } from 'react'

interface NavItem {
  name: string
  path: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Material Master', path: '/material-master', icon: Package },
  { name: 'AI Matching', path: '/ai-matching', icon: Brain },
  { name: 'Validation Queue', path: '/validation', icon: ClipboardCheck },
  { name: 'National Code', path: '/national-code', icon: Hash },
  { name: 'Code Mapping', path: '/code-mapping', icon: GitMerge },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Audit Trail', path: '/audit-trail', icon: FileText },
]

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed))
  }, [isCollapsed])

  return (
    <div
      className={cn(
        'flex h-full flex-col overflow-y-auto border-r border-grey-200 bg-white transition-all duration-300',
        isCollapsed ? 'w-14' : 'w-64',
      )}
    >
      <div className="flex items-center justify-between p-3">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-700 text-white">
              <span className="text-xl font-bold">NMM</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-grey-800">National Material Master</h1>
              <p className="text-xs text-grey-500">AI-Powered Platform</p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="w-full flex justify-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-700 text-white">
              <span className="text-xl font-bold">NMM</span>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-md p-1 text-grey-500 hover:bg-grey-100 hover:text-grey-700"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200',
                isCollapsed ? 'justify-center' : '',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-grey-600 hover:bg-grey-50 hover:text-grey-800',
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className="h-4 w-4" />
              {!isCollapsed && item.name}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-grey-200 p-3">
        {!isCollapsed && (
          <div className="text-xs text-grey-400">CPSE Administration</div>
        )}
        {!isCollapsed && (
          <div className="mt-1 text-sm font-medium text-grey-700">
            Material Master Administrator
          </div>
        )}
      </div>
    </div>
  )
}
