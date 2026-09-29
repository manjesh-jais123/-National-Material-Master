import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: ReactNode
  action?: {
    label: string
    onClick: () => void
  }
  fullHeight?: boolean
}

export function EmptyState({
  title = 'No results found',
  description = 'Try adjusting your search or filter criteria.',
  icon,
  action,
  fullHeight = true,
}: EmptyStateProps) {
  const defaultIcon = (
    <svg
      className="h-12 w-12 text-grey-300"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.172 16.172a4 4 0 015.656 0l-.037.037-8.063-.037a1 1 0 01-.037-1.999l7.96-.001a4 4 0 01.074 0l-.037-.037a4 4 0 01-.074 0l-8.063.037a1 1 0 01-.037 1.999l7.96-.001a4 4 0 01-.074 0"
      />
    </svg>
  )

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        fullHeight ? 'py-16' : 'py-8',
      )}
    >
      {icon || defaultIcon}
      <h3 className="mt-4 text-lg font-medium text-grey-800">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-grey-500">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 rounded-md bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
