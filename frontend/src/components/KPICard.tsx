import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

interface KPICardProps {
  title: string
  value: string | number
  icon?: ReactNode
  subtitle?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
}

export function KPICard({
  title,
  value,
  icon,
  subtitle,
  trend,
  trendValue,
  variant = 'default',
}: KPICardProps) {
  const iconColors: Record<typeof variant, string> = {
    default: 'text-grey-400',
    primary: 'text-primary-600',
    success: 'text-success-600',
    warning: 'text-warning-600',
    danger: 'text-danger-600',
  }

  const trendColors = {
    up: 'text-success-600',
    down: 'text-danger-600',
    neutral: 'text-grey-500',
  }

  return (
    <div className="rounded-lg border border-grey-200 bg-white p-5 shadow-card transition-shadow hover:shadow-panel">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && <div className={cn('flex h-8 w-8 items-center justify-center', iconColors[variant])}>{icon}</div>}
          <div>
            <p className="text-sm font-medium text-grey-500">{title}</p>
            <p className="text-2xl font-semibold text-grey-800">{value}</p>
          </div>
        </div>
        {trend && trendValue && (
          <div className="flex items-center gap-1">
            <span className={cn('text-xs font-medium', trendColors[trend])}>{trendValue}</span>
          </div>
        )}
      </div>
      {subtitle && <p className="mt-2 text-xs text-grey-400">{subtitle}</p>}
    </div>
  )
}
