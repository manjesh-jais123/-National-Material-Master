import { useEffect } from 'react'
import { useAppContext } from '../context/AppContext'

export function useToast() {
  const ctx = useAppContext()
  return { showToast: ctx.showToast, hideToast: ctx.hideToast, toast: ctx.toast }
}

export function useAutoHideToast(delay = 4000) {
  const { toast, hideToast } = useToast()

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(hideToast, delay)
      return () => clearTimeout(timer)
    }
  }, [toast, hideToast, delay])

  return toast
}
