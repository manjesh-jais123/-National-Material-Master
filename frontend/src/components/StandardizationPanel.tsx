import type { StandardizationRecommendation } from '../types'
import { cn } from '../utils/cn'
import { Edit3, Send } from 'lucide-react'

interface StandardizationPanelProps {
  recommendation: StandardizationRecommendation
  matchScore?: number
  onSendForValidation?: () => void
  onEdit?: () => void
}

export function StandardizationPanel({
  recommendation,
  matchScore = 96,
  onSendForValidation,
  onEdit,
}: StandardizationPanelProps) {
  const scoreColor = matchScore >= 95 ? 'text-success-600' : matchScore >= 80 ? 'text-primary-600' : 'text-warning-600'

  return (
    <div className="rounded-lg border border-grey-200 bg-white p-6 shadow-card">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-grey-800">AI-Generated Standardization Recommendation</h2>
        <div className={cn('text-right', scoreColor)}>
          <div className="text-2xl font-bold">{matchScore}% Match Confidence</div>
        </div>
      </div>

      <div className="mb-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-grey-500">
          Standard Description
        </span>
        <p className="mt-2 text-lg font-semibold text-grey-800">
          {recommendation.standardizedDescription}
        </p>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-md bg-grey-50 p-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-grey-500">
            Category
          </span>
          <p className="mt-1 text-sm font-medium text-grey-800">
            {recommendation.standardCategory}
          </p>
        </div>
        <div className="rounded-md bg-grey-50 p-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-grey-500">
            Standard Specification
          </span>
          <div className="mt-1 space-y-1 text-sm">
            <div>
              <span className="text-grey-600">Material:</span>{' '}
              <span className="font-medium text-grey-800">
                {recommendation.standardSpecification.material}
              </span>
            </div>
            <div>
              <span className="text-grey-600">Diameter:</span>{' '}
              <span className="font-medium text-grey-800">
                {recommendation.standardSpecification.diameter}
              </span>
            </div>
            <div>
              <span className="text-grey-600">Length:</span>{' '}
              <span className="font-medium text-grey-800">
                {recommendation.standardSpecification.length || '-'}
              </span>
            </div>
          </div>
        </div>
        <div className="rounded-md bg-grey-50 p-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-grey-500">
            Proposed Common National Code
          </span>
          <p className="mt-1 font-mono text-xl font-bold text-primary-600">
            {recommendation.proposedCommonNationalCode}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-grey-500">
          Mapped Existing Codes
        </span>
        <div className="mt-2 space-y-1.5">
          {recommendation.mappedCodes.map((mc) => (
            <div
              key={`${mc.cpse}-${mc.code}`}
              className="flex items-center justify-between rounded-md bg-grey-50 px-3 py-2"
            >
              <span className="text-sm text-grey-600">{mc.cpse}</span>
              <span className="font-mono text-sm font-medium text-grey-800">
                {mc.code}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-grey-200 pt-5">
        <div className="flex gap-3">
          {onSendForValidation && (
            <button
              onClick={onSendForValidation}
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-800"
            >
              <Send className="h-4 w-4" />
              Send for Expert Validation
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center justify-center gap-2 rounded-md border border-grey-300 bg-white px-4 py-2 text-sm font-medium text-grey-700 hover:bg-grey-50"
            >
              <Edit3 className="h-4 w-4" />
              Edit Recommendation
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
