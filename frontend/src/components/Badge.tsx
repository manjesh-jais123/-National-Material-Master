import { cn } from '../utils/cn'

interface BadgeProps {
  text: string
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({ text, variant = 'default', size = 'md', className }: BadgeProps) {
  const variantClasses = {
    default: 'bg-grey-100 text-grey-800',
    primary: 'bg-primary-100 text-primary-800',
    success: 'bg-success-100 text-success-800',
    warning: 'bg-warning-100 text-warning-800',
    danger: 'bg-danger-100 text-danger-800',
    info: 'bg-primary-50 text-primary-800',
  }

  const sizeClasses = {
    sm: 'px-1.5 py-0.25 text-xs',
    md: 'px-2 py-[3px] text-xs',
  }

  return (
    <span className={cn('inline-flex items-center rounded-full font-medium', variantClasses[variant], sizeClasses[size], className)}>
      {text}
    </span>
  )
}
