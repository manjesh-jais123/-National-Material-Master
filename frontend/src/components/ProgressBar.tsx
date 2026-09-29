import { cn } from '../utils/cn'

interface ProgressBarProps {
  label?: string
  value: number
  max?: number
  color?: 'primary' | 'success' | 'warning' | 'danger'
  showValue?: boolean
  className?: string
}

export function ProgressBar({
  label,
  value,
  max = 100,
  color = 'primary',
  showValue = true,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  const colorClasses = {
    primary: 'bg-primary-600',
    success: 'bg-success-600',
    warning: 'bg-warning-600',
    danger: 'bg-danger-600',
  }

  const trackColor = {
    primary: 'bg-primary-100',
    success: 'bg-success-100',
    warning: 'bg-warning-100',
    danger: 'bg-danger-100',
  }

  const valueColors = {
    primary: 'text-primary-600',
    success: 'text-success-600',
    warning: 'text-warning-600',
    danger: 'text-danger-600',
  }

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-medium text-grey-600">{label}</span>
          {showValue && <span className={cn('text-xs font-medium', valueColors[color])}>{value}%</span>}
        </div>
      )}
      <div className={cn('h-2 w-full rounded-full', trackColor[color])}>
        <div
          className={cn('h-full rounded-full transition-all duration-300', colorClasses[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export function ProgressCircle({
  value,
  size = 80,
  strokeWidth = 6,
  className,
}: {
  value: number
  size?: number
  strokeWidth?: number
  className?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  const getColor = (v: number) => {
    if (v >= 90) return '#16a34a'
    if (v >= 80) return '#4f46e5'
    if (v >= 70) return '#d97706'
    return '#ef4444'
  }

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(value)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="transition-all duration-500"
        />
      </svg>
      <span className="absolute text-xs font-semibold text-grey-800">{value}%</span>
    </div>
  )
}
