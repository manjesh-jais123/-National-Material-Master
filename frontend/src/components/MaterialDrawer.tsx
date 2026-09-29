import { X } from 'lucide-react'
import { cn } from '../utils/cn'
import { MatchBadge, StatusBadge } from './StatusBadge'
import type { Material } from '../types'
import { getMatchResults } from '../data/materials'

interface MaterialDrawerProps {
  material: Material | null
  isOpen: boolean
  onClose: () => void
  onCompare?: (material: Material) => void
}

export function MaterialDrawer({ material, isOpen, onClose, onCompare }: MaterialDrawerProps) {
  if (!isOpen || !material) return null

  const matchResults = getMatchResults(material)

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-full max-w-3xl transform border-l border-grey-200 bg-white shadow-xl transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-grey-200 p-5">
          <h2 className="text-lg font-semibold text-grey-800">Material Details</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-grey-400 hover:bg-grey-100 hover:text-grey-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-2 gap-6">
            {/* Existing Material */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-grey-500">
                Existing Material
              </h3>
              <div className="mt-3 space-y-3">
                <div>
                  <span className="text-xs text-grey-500">CPSE</span>
                  <p className="mt-0.5 text-sm font-medium text-grey-800">{material.cpse}</p>
                </div>
                <div>
                  <span className="text-xs text-grey-500">Material Code</span>
                  <p className="mt-0.5 text-sm font-medium text-grey-800">{material.materialCode}</p>
                </div>
                <div>
                  <span className="text-xs text-grey-500">Description</span>
                  <p className="mt-0.5 text-sm font-medium text-grey-800">{material.description}</p>
                </div>
                <div>
                  <span className="text-xs text-grey-500">Category</span>
                  <p className="mt-0.5 text-sm font-medium text-grey-800">{material.category}</p>
                </div>
                <div>
                  <span className="text-xs text-grey-500">UOM</span>
                  <p className="mt-0.5 text-sm font-medium text-grey-800">{material.uom}</p>
                </div>
                <div>
                  <span className="text-xs text-grey-500">Specification</span>
                  <p className="mt-0.5 text-sm font-medium text-grey-800">{material.specification}</p>
                </div>
                <div>
                  <span className="text-xs text-grey-500">Status</span>
                  <div className="mt-0.5">
                    <StatusBadge status={material.status} dot />
                  </div>
                </div>
              </div>
            </div>

            {/* AI Analysis */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-grey-500">
                AI Analysis
              </h3>
              <div className="mt-3 space-y-3">
                {material.similarity !== undefined && (
                  <div>
                    <span className="text-xs text-grey-500">Match Confidence</span>
                    <p className="mt-0.5 text-sm font-medium text-grey-800">{material.similarity}%</p>
                  </div>
                )}
                <div>
                  <span className="text-xs text-grey-500">Match Type</span>
                  <div className="mt-0.5">
                    <MatchBadge matchType={material.matchType} dot />
                  </div>
                </div>
                <div>
                  <span className="text-xs text-grey-500">Matched Materials</span>
                  <div className="mt-2 space-y-2">
                    {matchResults.length > 0 ? (
                      matchResults.map((result) => (
                        <div
                          key={result.material.id}
                          className="rounded-md border border-grey-200 p-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xs font-medium text-primary-600">
                                {result.material.cpse}
                              </span>
                              <p className="text-xs text-grey-600">{result.material.materialCode}</p>
                              <p className="text-xs text-grey-700">{result.material.description}</p>
                            </div>
                            <span className="text-xs font-bold text-primary-600">
                              {result.score}%
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-grey-500">No matches found for this material.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {onCompare && (
            <div className="mt-6 flex justify-end gap-2 border-t border-grey-200 pt-4">
              <button
                onClick={onClose}
                className="rounded-md border border-grey-300 bg-white px-4 py-2 text-sm font-medium text-grey-700 hover:bg-grey-50"
              >
                Close
              </button>
              <button
                onClick={() => onCompare(material)}
                className="rounded-md bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800"
              >
                Compare in AI Matching
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
