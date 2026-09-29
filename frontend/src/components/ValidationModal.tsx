import { useState } from 'react'
import { cn } from '../utils/cn'
import type { StandardizationRecommendation } from '../types'
import { useAppContext } from '../context/AppContext'

interface ValidationModalProps {
  isOpen: boolean
  onClose: () => void
  materialId?: string
  groupKey?: string
  onCloseAfterAction?: () => void
}

export function ValidationModal({ isOpen, onClose, materialId, groupKey, onCloseAfterAction }: ValidationModalProps) {
  const [isModifying, setIsModifying] = useState(false)
  const [modifiedValues, setModifiedValues] = useState<Partial<StandardizationRecommendation>>({})

  const { materials, recommendations, approveRecommendation, modifyRecommendation, showToast, addAuditEntry } = useAppContext()

  if (!isOpen || !groupKey) return null

  const material = materialId ? materials.find((m) => m.id === materialId) : undefined
  const rec = recommendations[groupKey.toUpperCase()]

  if (!rec) return null

  const handleApprove = () => {
    const cpse = material?.cpse || 'CPSE'
    const materialCode = material?.materialCode || ''
    approveRecommendation(cpse, materialCode, groupKey)
    addAuditEntry({
      user: 'Technical Reviewer',
      cpse,
      materialCode,
      action: 'Validation Completed',
      previousValue: 'Pending Review',
      newValue: 'Approved - Recommendation Accepted',
      status: 'approved',
    })
    showToast(`Material ${material?.materialCode} approved. CNMC ${rec.proposedCommonNationalCode} created.`, 'success')
    onClose()
    onCloseAfterAction?.()
  }

  const handleModify = () => {
    if (isModifying) {
      modifyRecommendation(materialId!, {
        standardizedDescription: modifiedValues.standardizedDescription || rec.standardizedDescription,
        standardCategory: modifiedValues.standardCategory || rec.standardCategory,
      })
      addAuditEntry({
        user: 'Technical Reviewer',
        cpse: material?.cpse || '',
        materialCode: material?.materialCode || '',
        action: 'Standardization Description Modified',
        previousValue: rec.standardizedDescription,
        newValue: modifiedValues.standardizedDescription || rec.standardizedDescription,
        status: 'modified',
      })
      showToast('Recommendation modified and saved.', 'info')
      setIsModifying(false)
      onClose()
      onCloseAfterAction?.()
    } else {
      setIsModifying(true)
    }
  }

  const handleReject = () => {
    addAuditEntry({
      user: 'Technical Reviewer',
      cpse: material?.cpse || '',
      materialCode: material?.materialCode || '',
      action: 'Recommendation Rejected',
      previousValue: rec.standardizedDescription,
      newValue: 'Rejected',
      status: 'rejected',
    })
    showToast('Recommendation rejected. Material remains unstandardized.', 'warning')
    onClose()
    onCloseAfterAction?.()
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full max-w-3xl rounded-lg border border-grey-200 bg-white shadow-xl">
          <div className="border-b border-grey-200 p-5">
            <h2 className="text-lg font-semibold text-grey-800">Human Validation</h2>
            <p className="text-sm text-grey-500">Review and approve AI-generated standardization recommendations.</p>
          </div>

          <div className="max-h-[70vh] overflow-y-auto p-5">
            <div className="space-y-5">
              <div className="rounded-md bg-grey-50 p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-grey-500">
                  AI Recommendation
                </h3>

                <div className="mt-3 space-y-4">
                  <div>
                    <label className="text-xs font-medium text-grey-600">Standard Description</label>
                    {isModifying ? (
                      <input
                        type="text"
                        className="mt-1 w-full rounded-md border border-grey-300 px-3 py-1 text-sm text-grey-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        value={modifiedValues.standardizedDescription ?? rec.standardizedDescription}
                        onChange={(e) => setModifiedValues({ ...modifiedValues, standardizedDescription: e.target.value })}
                      />
                    ) : (
                      <p className="mt-1 text-sm font-medium text-grey-800">{rec.standardizedDescription}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-medium text-grey-600">Category</label>
                    {isModifying ? (
                      <input
                        type="text"
                        className="mt-1 w-full rounded-md border border-grey-300 px-3 py-1 text-sm text-grey-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        value={modifiedValues.standardCategory ?? rec.standardCategory}
                        onChange={(e) => setModifiedValues({ ...modifiedValues, standardCategory: e.target.value.toUpperCase() })}
                      />
                    ) : (
                      <p className="mt-1 text-sm font-medium text-grey-800">{rec.standardCategory}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-medium text-grey-600">Specification</label>
                    <p className="mt-1 text-sm font-medium text-grey-800">
                      {rec.standardSpecification.material} | {rec.standardSpecification.diameter} | {rec.standardSpecification.length || '-'}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-grey-600">Proposed Code</label>
                    <p className="mt-1 font-mono text-sm font-medium text-primary-600">
                      {rec.proposedCommonNationalCode}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-md bg-grey-50 p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-grey-500">
                  Existing CPSE Codes
                </h3>
                <div className="mt-3 space-y-1.5">
                  {rec.mappedCodes.map((mc) => (
                    <div key={mc.cpse} className="flex justify-between text-sm">
                      <span className="text-grey-600">{mc.cpse} →</span>
                      <span className="font-medium text-grey-800">{mc.code}</span>
                    </div>
                  ))}
                </div>
              </div>

              {material && (
                <div className="rounded-md bg-grey-50 p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-grey-500">
                    Reviewer Comment
                  </h3>
                  <textarea
                    placeholder="Add a comment about this validation decision (optional)..."
                    className="mt-2 w-full rounded-md border border-grey-300 px-3 py-2 text-sm text-grey-800 placeholder-grey-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    rows={3}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-grey-200 p-4">
            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="rounded-md border border-grey-300 bg-white px-4 py-2 text-sm font-medium text-grey-700 hover:bg-grey-50"
              >
                Cancel
              </button>
              <button
                onClick={handleModify}
                className={cn(
                  'rounded-md border px-4 py-2 text-sm font-medium transition-colors',
                  isModifying
                    ? 'border-primary-700 bg-white text-primary-700 hover:bg-grey-50'
                    : 'border-grey-300 bg-white text-grey-700 hover:bg-grey-50',
                )}
              >
                {isModifying ? 'Save Changes' : 'Modify'}
              </button>
              <button
                onClick={handleReject}
                className="rounded-md border border-danger-200 bg-white px-4 py-2 text-sm font-medium text-danger-600 hover:bg-danger-50"
              >
                Reject
              </button>
              <button
                onClick={handleApprove}
                className="rounded-md bg-success-600 px-4 py-2 text-sm font-medium text-white hover:bg-success-700"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
