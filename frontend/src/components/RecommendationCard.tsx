import type { StandardizationRecommendation } from '../types'
import { ProgressBar } from './ProgressBar'

interface RecommendationCardProps {
  recommendation: StandardizationRecommendation
  matchScore?: number
  onActionClick?: () => void
  actionLabel?: string
  showScoreBreakdown?: boolean
}

export function RecommendationCard({
  recommendation,
  matchScore = 96,
  onActionClick,
  actionLabel = 'Send for Expert Validation',
  showScoreBreakdown = true,
}: RecommendationCardProps) {
  return (
    <div className="rounded-lg border border-grey-200 bg-white p-5 shadow-card">
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-sm font-semibold text-grey-800">Standardization Recommendation</h3>
        {showScoreBreakdown && (
          <div className="flex items-center gap-3">
            <ProgressBar
              value={matchScore}
              color={matchScore >= 90 ? 'success' : matchScore >= 80 ? 'primary' : 'warning'}
              showValue={false}
              className="w-24"
            />
            <span className="text-lg font-bold text-primary-600">{matchScore}%</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="rounded-md bg-grey-50 p-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-grey-500">
            Standardized Description
          </span>
          <p className="mt-1 text-sm font-medium text-grey-800">
            {recommendation.standardizedDescription}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-md bg-grey-50 p-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-grey-500">
              Standard Category
            </span>
            <p className="mt-1 text-sm font-medium text-grey-800">
              {recommendation.standardCategory}
            </p>
          </div>
          <div className="rounded-md bg-grey-50 p-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-grey-500">
              Common National Code
            </span>
            <p className="mt-1 text-sm font-medium font-mono text-primary-600">
              {recommendation.proposedCommonNationalCode}
            </p>
          </div>
        </div>

        <div className="rounded-md bg-grey-50 p-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-grey-500">
            Standard Specification
          </span>
          <div className="mt-2 space-y-1.5 text-sm">
            <div className="flex">
              <span className="w-1/3 text-grey-600">Material:</span>
              <span className="w-2/3 font-medium text-grey-800">{recommendation.standardSpecification.material}</span>
            </div>
            <div className="flex">
              <span className="w-1/3 text-grey-600">Diameter / Size:</span>
              <span className="w-2/3 font-medium text-grey-800">{recommendation.standardSpecification.diameter}</span>
            </div>
            <div className="flex">
              <span className="w-1/3 text-grey-600">Length:</span>
              <span className="w-2/3 font-medium text-grey-800">{recommendation.standardSpecification.length || '-'}</span>
            </div>
          </div>
        </div>

        <div className="rounded-md bg-grey-50 p-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-grey-500">
            Mapped CPSE Codes
          </span>
          <div className="mt-2 space-y-1">
            {recommendation.mappedCodes.map((mc) => (
              <div key={mc.cpse} className="flex justify-between text-sm">
                <span className="text-grey-600">{mc.cpse} →</span>
                <span className="font-medium text-grey-800">{mc.code}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {actionLabel && onActionClick && (
        <div className="mt-5 border-t border-grey-200 pt-4">
          <button
            onClick={onActionClick}
            className="w-full rounded-md bg-primary-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-800"
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  )
}
