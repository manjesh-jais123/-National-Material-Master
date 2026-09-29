import type { MatchType, MaterialStatus } from '../types'
import type { ReactNode } from 'react'

const statusConfig: Record<MaterialStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'status-badge-pending' },
  approved: { label: 'Approved', className: 'status-badge-approved' },
  rejected: { label: 'Rejected', className: 'status-badge-rejected' },
  modified: { label: 'Modified', className: 'status-badge-modified' },
  standardized: { label: 'Standardized', className: 'status-badge-approved' },
}

const matchTypeConfig: Record<string, { label: string; className: string }> = {
  identical: { label: 'Identical', className: 'match-badge-identical' },
  'near-duplicate': { label: 'Near-Duplicate', className: 'match-badge-near-duplicate' },
  duplicate: { label: 'Duplicate', className: 'match-badge-duplicate' },
  'potential-duplicate': { label: 'Potential Duplicate', className: 'match-badge-potential' },
  equivalent: { label: 'Equivalent', className: 'match-badge-equivalent' },
  unique: { label: 'Unique', className: 'match-badge-identical' },
}

interface StatusBadgeProps {
  status?: MaterialStatus
  dot?: boolean
  children?: ReactNode
}

export function StatusBadge({ status = 'pending', dot = false, children }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending
  return (
    <span className={`status-badge ${config.className}`}>
      {dot && <span className="mr-1 h-1 w-1 rounded-full bg-current" />}
      {children || config.label}
    </span>
  )
}

interface MatchBadgeProps {
  matchType?: MatchType
  dot?: boolean
}

export function MatchBadge({ matchType = 'unique', dot = false }: MatchBadgeProps) {
  const config = matchTypeConfig[matchType] || matchTypeConfig.unique
  return (
    <span className={`match-badge ${config.className}`}>
      {dot && <span className="mr-1 h-1 w-1 rounded-full bg-current" />}
      {config.label}
    </span>
  )
}

interface SimilarityScoreProps {
  score?: number
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function SimilarityScore({ score = 0, showLabel = true, size = 'md' }: SimilarityScoreProps) {
  const getScoreColor = (s: number) => {
    if (s >= 90) return 'text-success-600'
    if (s >= 80) return 'text-primary-600'
    if (s >= 70) return 'text-warning-600'
    return 'text-danger-600'
  }

  const getBgColor = (s: number) => {
    if (s >= 90) return 'bg-success-100'
    if (s >= 80) return 'bg-primary-100'
    if (s >= 70) return 'bg-warning-100'
    return 'bg-danger-100'
  }

  const sizeClasses = {
    sm: 'h-5 px-1.5 text-xs',
    md: 'h-6 px-2 text-xs',
    lg: 'h-7 px-2 text-sm',
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className={`inline-flex items-center justify-center rounded-full font-medium ${getScoreColor(score)} ${getBgColor(score)} ${sizeClasses[size]}`}
      >
        {showLabel && 'Match:'} {score}%
      </span>
    </div>
  )
}
