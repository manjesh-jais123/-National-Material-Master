import { cn } from '../utils/cn'

interface LoadingStateProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
}

export function LoadingState({ message = 'Loading...', size = 'md', fullScreen = false }: LoadingStateProps) {
  const sizeConfig = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative">
        <div
          className={cn(
            'animate-spin rounded-full border-2 border-grey-200 border-t-primary-600',
            sizeConfig[size],
          )}
        />
        <div
          className={cn(
            'absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary-400',
            size === 'sm' && 'h-4 w-4 -translate-x-0.5 -translate-y-0.5',
            size === 'md' && 'h-8 w-8 translate-x-0.5 translate-y-0.5 opacity-40',
          )}
          style={{ animationDuration: '1.5s' }}
        />
      </div>
      <p className="text-sm text-grey-500">{message}</p>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-12">
      {content}
    </div>
  )
}
