import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '../utils/cn'
import { useEffect } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  id: string
  onClose: () => void
}

const toastConfig: Record<ToastProps['type'], { bg: string; icon: ReactNode }> = {
  success: {
    bg: 'bg-success-50 border-success-200 text-success-800',
    icon: '✓',
  },
  error: {
    bg: 'bg-danger-50 border-danger-200 text-danger-800',
    icon: '✕',
  },
  info: {
    bg: 'bg-primary-50 border-primary-200 text-primary-800',
    icon: 'ℹ',
  },
  warning: {
    bg: 'bg-warning-50 border-warning-200 text-warning-800',
    icon: '⚠',
  },
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  const config = toastConfig[type]
  return (
    <div
      className={cn(
        'pointer-events-auto flex items-center gap-3 rounded-md border px-4 py-2.5 text-sm font-medium shadow-panel',
        config.bg,
      )}
    >
      <span className="flex h-5 w-5 items-center justify-center">{config.icon}</span>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 rounded p-0.5 opacity-60 hover:opacity-100"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Array<{ message: string; type: 'success' | 'error' | 'info' | 'warning'; id: string }>
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <Toast
          key={t.id}
          message={t.message}
          type={t.type}
          id={t.id}
          onClose={() => onClose(t.id)}
        />
      ))}
    </div>
  )
}
