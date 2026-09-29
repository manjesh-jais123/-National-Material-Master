import type { ReactNode } from 'react'
import { cn } from '../utils/cn'
import type { Material, MatchResult } from '../types'
import { ProgressBar } from './ProgressBar'
import { MatchBadge, StatusBadge } from './StatusBadge'

interface ComparisonRowProps {
  label: string
  inputValue: ReactNode
  matchedValue: ReactNode
  isMatch?: boolean
}

function ComparisonRow({ label, inputValue, matchedValue, isMatch = false }: ComparisonRowProps) {
  const matchClass = isMatch ? 'bg-success-50' : ''
  return (
    <tr className="border-b border-grey-200">
      <td className="table-cell">{label}</td>
      <td className={cn('table-cell transition-colors', matchClass)}>{inputValue}</td>
      <td className={cn('table-cell transition-colors', matchClass)}>{matchedValue}</td>
    </tr>
  )
}

interface ComparisonTableProps {
  inputMaterial: Material
  matchedMaterial: Material
  matchResult?: MatchResult
  recommendation?: {
    aiAssessment?: string
    aiAssessmentReason?: string
  }
}

export function ComparisonTable({ inputMaterial, matchedMaterial, matchResult, recommendation }: ComparisonTableProps) {
  const attributes = [
    { label: 'Material', input: inputMaterial.materialCode, matched: matchedMaterial.materialCode },
    { label: 'Description', input: inputMaterial.description, matched: matchedMaterial.description },
    { label: 'Grade', input: inputMaterial.grade || '-', matched: matchedMaterial.grade || '-' },
    { label: 'Diameter', input: inputMaterial.size || '-', matched: matchedMaterial.size || '-' },
    { label: 'Length', input: inputMaterial.dimension || '-', matched: matchedMaterial.dimension || '-' },
    { label: 'Standard', input: inputMaterial.standard || '-', matched: matchedMaterial.standard || '-' },
    { label: 'UOM', input: inputMaterial.uom, matched: matchedMaterial.uom },
    { label: 'Brand', input: inputMaterial.brand || '-', matched: matchedMaterial.brand || '-' },
    {
      label: 'Technical Parameters',
      input: inputMaterial.technicalParams || '-',
      matched: matchedMaterial.technicalParams || '-',
    },
  ]

  return (
    <div className="rounded-lg border border-grey-200 bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-grey-800">Technical Comparison</h3>
        <div className="flex items-center gap-2">
          <MatchBadge matchType={inputMaterial.matchType} />
          <span className="text-sm font-medium text-grey-600">
            {matchResult?.score || inputMaterial.similarity || 0}% Match
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse text-sm">
          <thead>
            <tr className="border-b border-grey-200 bg-grey-50">
              <th className="table-header-cell w-1/4">Attribute</th>
              <th className="table-header-cell w-3/8">Input Material</th>
              <th className="table-header-cell w-3/8">Matched Material</th>
            </tr>
          </thead>
          <tbody>
            {attributes.map((attr) => {
              const isMatch =
                attr.input.toString().toLowerCase().trim() ===
                attr.matched.toString().toLowerCase().trim()
              return (
                <ComparisonRow
                  key={attr.label}
                  label={attr.label}
                  inputValue={
                    <div className="flex items-center justify-between">
                      <span>{attr.input}</span>
                      {isMatch && (
                        <StatusBadge status="approved" dot={false}>
                          <span className="text-xs font-medium text-success-700">Match</span>
                        </StatusBadge>
                      )}
                    </div>
                  }
                  matchedValue={
                    <div className="flex items-center justify-between">
                      <span>{attr.matched}</span>
                      {isMatch ? (
                        <StatusBadge status="approved" dot={false}>
                          <span className="text-xs font-medium text-success-700">Match</span>
                        </StatusBadge>
                      ) : (
                        <StatusBadge status="modified" dot={false}>
                          <span className="text-xs font-medium text-warning-700">Difference</span>
                        </StatusBadge>
                      )}
                    </div>
                  }
                  isMatch={isMatch}
                />
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-5 border-t border-grey-200 pt-4">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-grey-500">
          Match Score Breakdown
        </h4>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {matchResult ? (
            <>
              <ProgressBar label="Description Similarity" value={matchResult.descriptionSimilarity} color="success" />
              <ProgressBar label="Specification Match" value={matchResult.specificationMatch} color="success" />
              <ProgressBar label="Technical Attributes" value={matchResult.technicalAttributes} color="primary" />
              <ProgressBar label="UOM Compatibility" value={matchResult.uomCompatibility} color="success" />
            </>
          ) : (
            <>
              <ProgressBar label="Description Similarity" value={inputMaterial.similarity || 0} color="success" showValue={false} />
              <ProgressBar label="Specification Match" value={100} color="success" showValue={false} />
              <ProgressBar label="Technical Attributes" value={inputMaterial.similarity ? inputMaterial.similarity - 1 : 95} color="primary" showValue={false} />
              <ProgressBar label="UOM Compatibility" value={100} color="success" showValue={false} />
            </>
          )}
        </div>
      </div>

      {recommendation?.aiAssessment && (
        <div className="mt-5 border-t border-grey-200 pt-5">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-grey-500">
            AI Assessment
          </h4>
          <div className="rounded-lg border border-grey-200 bg-grey-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-2 w-2 rounded-full bg-warning-500" />
              <span className="text-sm font-semibold text-grey-800">
                {recommendation.aiAssessment}
              </span>
            </div>
            <p className="text-sm text-grey-700">{recommendation.aiAssessmentReason}</p>
          </div>
        </div>
      )}
    </div>
  )
}
