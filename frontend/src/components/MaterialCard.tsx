import type { Material } from '../types'
import { cn } from '../utils/cn'
import { MatchBadge, SimilarityScore } from './StatusBadge'

interface MaterialCardProps {
  material: Material
  isSelected?: boolean
  showMatch?: boolean
  onSelect?: (material: Material) => void
  onClick?: () => void
}

export function MaterialCard({
  material,
  isSelected = false,
  showMatch = false,
  onSelect,
  onClick,
}: MaterialCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'cursor-pointer rounded-lg border border-grey-200 bg-white p-4 shadow-card transition-all duration-200',
        isSelected && 'border-primary-500 ring-2 ring-primary-200',
        'hover:border-grey-300 hover:shadow-panel',
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xs font-medium text-grey-500">{material.cpse}</span>
            <MatchBadge matchType={material.matchType} dot />
          </div>
          <h4 className="text-sm font-semibold text-grey-800">{material.materialCode}</h4>
          <p className="mt-1 text-sm text-grey-700">{material.description}</p>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-grey-500">
            <span><span className="font-medium">Category:</span> {material.category}</span>
            <span><span className="font-medium">UOM:</span> {material.uom}</span>
            {material.commonNationalCode && (
              <span><span className="font-medium">CNMC:</span> {material.commonNationalCode}</span>
            )}
          </div>
        </div>
        {showMatch && material.similarity !== undefined && (
          <SimilarityScore score={material.similarity} />
        )}
      </div>

      {onSelect && (
        <div className="mt-3 flex justify-end border-t border-grey-100 pt-3">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onSelect(material)
            }}
            className="text-xs font-medium text-primary-600 hover:text-primary-800"
          >
            Select
          </button>
        </div>
      )}
    </div>
  )
}
