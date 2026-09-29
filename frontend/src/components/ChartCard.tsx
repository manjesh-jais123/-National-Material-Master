import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

interface ChartCardProps {
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
  action?: ReactNode
}

export function ChartCard({ title, subtitle, children, className, action }: ChartCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-grey-200 bg-white p-5 shadow-card',
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-grey-800">{title}</h3>
          {subtitle && <p className="text-xs text-grey-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}
