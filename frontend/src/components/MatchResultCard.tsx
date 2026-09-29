import type { MatchResult } from '../types'
import { cn } from '../utils/cn'
import { MatchBadge } from './StatusBadge'
import { Eye } from 'lucide-react'

interface MatchResultCardProps {
  result: MatchResult
  isSelected?: boolean
  onSelect?: (result: MatchResult) => void
  onViewComparison?: (result: MatchResult) => void
}

const scoreColorMap = (value: number) => {
  if (value >= 95) return 'text-success-600'
  if (value >= 80) return 'text-primary-600'
  if (value >= 70) return 'text-warning-600'
  return 'text-danger-600'
}

const barColorMap = (value: number) => {
  if (value >= 95) return 'bg-success-500'
  if (value >= 80) return 'bg-primary-600'
  if (value >= 70) return 'bg-warning-500'
  return 'bg-danger-500'
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-40 text-xs text-grey-600">{label}</span>
      <div className="flex-1">
        <div className="h-1.5 w-full rounded-full bg-grey-200">
          <div
            className={cn('h-full rounded-full transition-all duration-500', barColorMap(value))}
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
      <span className={cn('w-10 text-right text-xs font-medium', scoreColorMap(value))}>
        {value}%
      </span>
    </div>
  )
}

export function MatchResultCard({
  result,
  isSelected = false,
  onSelect,
  onViewComparison,
}: MatchResultCardProps) {
  const scoreColor = result.score >= 95 ? 'success' : result.score >= 80 ? 'primary' : 'warning'

  return (
    <div
      className={cn(
        'group relative cursor-pointer rounded-lg border-2 bg-white p-5 shadow-card transition-all duration-200 hover:shadow-panel',
        isSelected ? 'border-primary-500 ring-2 ring-primary-200' : 'border-grey-200 hover:border-grey-300',
      )}
      onClick={() => onSelect?.(result)}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <MatchBadge matchType={result.matchType} />
          <span className="text-xs text-grey-500">{result.material.cpse}</span>
        </div>
        <div
          className={cn(
            'rounded-md px-3 py-1 text-xs font-bold',
            scoreColor === 'success'
              ? 'bg-success-100 text-success-700'
              : scoreColor === 'primary'
              ? 'bg-primary-100 text-primary-700'
              : 'bg-warning-100 text-warning-700',
          )}
        >
          {result.score}% Match
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-grey-500">Material Code</p>
        <p className="font-mono text-lg font-semibold text-grey-800">
          {result.material.materialCode}
        </p>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-grey-700">{result.material.description}</p>
        <p className="mt-1 text-xs text-grey-500">{result.material.specification}</p>
      </div>

      <div className="mb-4 space-y-2.5">
        <ScoreRow label="Description Similarity" value={result.descriptionSimilarity} />
        <ScoreRow label="Specification Match" value={result.specificationMatch} />
        <ScoreRow label="Technical Attributes" value={result.technicalAttributes} />
        <ScoreRow label="UOM Compatibility" value={result.uomCompatibility} />
      </div>

      {onViewComparison && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onViewComparison(result)
          }}
          className="w-full rounded-md border border-grey-200 bg-white px-3 py-2 text-xs font-medium text-grey-700 opacity-0 transition-all group-hover:opacity-100 hover:bg-grey-50"
        >
          <div className="flex items-center justify-center gap-1.5">
            <Eye className="h-3.5 w-3.5" />
            View Comparison
          </div>
        </button>
      )}
    </div>
  )
}
