import { useState, useMemo } from 'react'
import { useAppContext } from '../context/AppContext'
import { ApprovalDialog } from '../components/ApprovalDialog'
import { EmptyState } from '../components/EmptyState'
import { StatusBadge } from '../components/StatusBadge'
import { ProgressCircle } from '../components/ProgressBar'
import { ComparisonTable } from '../components/ComparisonTable'
import type { ValidationStatus, ValidationQueueItem } from '../types'

export function Validation() {
  const {
    materials,
    approveRecommendation,
    showToast,
    addAuditEntry,
    updateValidationQueueStatus,
    validationQueue,
  } = useAppContext()
  const [statusFilter, setStatusFilter] = useState<string>('pending')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItem, setSelectedItem] = useState<ValidationQueueItem | null>(null)
  const [reviewComment, setReviewComment] = useState('')
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [activeTab, setActiveTab] = useState<'ai-recommendation' | 'existing-codes' | 'comparison'>('ai-recommendation')

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'modified', label: 'Modified' },
  ]

  const filteredItems = useMemo(() => {
    return validationQueue.filter((item) => {
      const matchesSearch =
        !searchTerm ||
        item.material.materialCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.material.cpse.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.recommendation.proposedCommonNationalCode.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = !statusFilter || item.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [validationQueue, searchTerm, statusFilter])

  const handleApprove = (item: ValidationQueueItem) => {
    approveRecommendation(item.material.cpse, item.material.materialCode, item.groupKey)
    addAuditEntry({
      user: 'Technical Reviewer',
      cpse: item.material.cpse,
      materialCode: item.material.materialCode,
      action: 'Validation Queue - Approved',
      previousValue: 'Pending',
      newValue: `Approved - ${item.recommendation.proposedCommonNationalCode}`,
      status: 'approved',
    })
    showToast(`Recommendation approved. CNMC ${item.recommendation.proposedCommonNationalCode} created.`, 'success')
    setSelectedItem(null)
    setReviewComment('')
  }

  const handleReject = (item: ValidationQueueItem) => {
    updateValidationQueueStatus(item.id, 'rejected', reviewComment)
    addAuditEntry({
      user: 'Technical Reviewer',
      cpse: item.material.cpse,
      materialCode: item.material.materialCode,
      action: 'Validation Queue - Rejected',
      previousValue: item.recommendation.standardizedDescription,
      newValue: 'Rejected',
      status: 'rejected',
      comment: reviewComment,
    })
    showToast('Recommendation rejected.', 'warning')
    setSelectedItem(null)
    setReviewComment('')
  }

  const handleConfirmApproval = () => {
    if (selectedItem) {
      setShowApprovalDialog(false)
      handleApprove(selectedItem)
    }
  }

  const matchTypeConfig: Record<string, string> = {
    identical: 'match-badge-identical',
    'near-duplicate': 'match-badge-near-duplicate',
    duplicate: 'match-badge-duplicate',
    'potential-duplicate': 'match-badge-potential',
    equivalent: 'match-badge-equivalent',
    unique: 'match-badge-identical',
  }

  const statusBadgeConfig: Record<string, string> = {
    pending: 'status-badge-pending',
    approved: 'status-badge-approved',
    rejected: 'status-badge-rejected',
    modified: 'status-badge-modified',
  }

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-semibold text-grey-800">Expert Validation Queue</h1>
        <p className="mt-1 text-sm text-grey-500">
          Review and approve AI-generated material standardization recommendations.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Search by material code, description, or CPSE..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-64 rounded-md border border-grey-300 px-3 py-1 text-sm text-grey-800 placeholder-grey-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
        <select
          value={statusFilter || ''}
          onChange={(e) => setStatusFilter(e.target.value || '')}
          className="rounded-md border border-grey-300 bg-white px-2 py-1 text-sm text-grey-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="">All Statuses</option>
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-md border border-grey-200 bg-white">
        <table className="w-full table-fixed border-collapse text-sm">
          <thead>
            <tr className="border-b border-grey-200 bg-grey-50">
              <th className="table-header-cell">Material</th>
              <th className="table-header-cell">CPSE</th>
              <th className="table-header-cell">AI Recommendation</th>
              <th className="table-header-cell">Match Type</th>
              <th className="table-header-cell">Confidence</th>
              <th className="table-header-cell">Date</th>
              <th className="table-header-cell">Status</th>
              <th className="table-header-cell text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-sm text-grey-500">
                  {searchTerm || statusFilter ? 'No matching items found' : 'No validation items found'}
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-grey-100 last:border-0 transition-colors hover:bg-grey-25"
                >
                  <td className="table-cell font-medium text-grey-800">
                    {item.material.materialCode}
                    <div className="text-xs text-grey-500">{item.material.description}</div>
                  </td>
                  <td className="table-cell">{item.material.cpse}</td>
                  <td className="table-cell">
                    <span className="font-medium text-grey-800">{item.recommendation.standardizedDescription}</span>
                    <div className="text-xs text-grey-500">{item.recommendation.proposedCommonNationalCode}</div>
                  </td>
                  <td className="table-cell">
                    <span
                      className={`match-badge ${matchTypeConfig[item.matchType] || 'match-badge-near-duplicate'}`}
                    >
                      {item.matchType.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1.5">
                      <ProgressCircle value={item.confidence} size={24} strokeWidth={3} />
                      <span className="text-xs text-grey-600">{item.confidence}%</span>
                    </div>
                  </td>
                  <td className="table-cell">{item.date}</td>
                  <td className="table-cell">
                    <span
                      className={`status-badge ${statusBadgeConfig[item.status] || 'status-badge-pending'}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="table-cell text-center">
                    <button
                      onClick={() => {
                        setSelectedItem(item)
                        setReviewComment('')
                        setActiveTab('ai-recommendation')
                      }}
                      disabled={item.status === 'approved'}
                      className="rounded-md bg-primary-700 px-3 py-1 text-xs font-medium text-white hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-grey-200 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-grey-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-grey-800">Validation Review</h2>
                  <p className="text-sm text-grey-500">
                    {selectedItem.material.materialCode} — {selectedItem.material.description}
                  </p>
                </div>
                <div>
                  <StatusBadge status={selectedItem.status as ValidationStatus} />
                </div>
              </div>

              <div className="mt-3 flex gap-1">
                <button
                  onClick={() => setActiveTab('ai-recommendation')}
                  className={`px-3 py-1 text-xs font-medium ${
                    activeTab === 'ai-recommendation'
                      ? 'border-b-2 border-primary-600 text-primary-700'
                      : 'text-grey-600 hover:text-grey-800'
                  }`}
                >
                  AI Recommendation
                </button>
                <button
                  onClick={() => setActiveTab('existing-codes')}
                  className={`px-3 py-1 text-xs font-medium ${
                    activeTab === 'existing-codes'
                      ? 'border-b-2 border-primary-600 text-primary-700'
                      : 'text-grey-600 hover:text-grey-800'
                  }`}
                >
                  Existing CPSE Materials
                </button>
                <button
                  onClick={() => setActiveTab('comparison')}
                  className={`px-3 py-1 text-xs font-medium ${
                    activeTab === 'comparison'
                      ? 'border-b-2 border-primary-600 text-primary-700'
                      : 'text-grey-600 hover:text-grey-800'
                  }`}
                >
                  Technical Comparison
                </button>
              </div>
            </div>

            <div className="p-5">
              {activeTab === 'ai-recommendation' && (
                <div className="space-y-4">
                  <div className="rounded-md bg-grey-50 p-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-grey-500">
                      Standard Description
                    </h3>
                    <p className="mt-2 text-sm font-medium text-grey-800">
                      {selectedItem.recommendation.standardizedDescription}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-md bg-grey-50 p-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-grey-500">
                        Category
                      </h4>
                      <p className="mt-1 text-sm font-medium text-grey-800">
                        {selectedItem.recommendation.standardCategory}
                      </p>
                    </div>
                    <div className="rounded-md bg-grey-50 p-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-grey-500">
                        Common National Code
                      </h4>
                      <p className="mt-1 font-mono text-sm font-medium text-primary-600">
                        {selectedItem.recommendation.proposedCommonNationalCode}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-md bg-grey-50 p-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-grey-500">
                      Standard Specification
                    </h4>
                    <div className="mt-2 space-y-1.5 text-sm">
                      <div className="flex">
                        <span className="w-1/3 text-grey-600">Material:</span>
                        <span className="w-2/3 font-medium text-grey-800">
                          {selectedItem.recommendation.standardSpecification.material}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="w-1/3 text-grey-600">Diameter / Size:</span>
                        <span className="w-2/3 font-medium text-grey-800">
                          {selectedItem.recommendation.standardSpecification.diameter}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="w-1/3 text-grey-600">Length:</span>
                        <span className="w-2/3 font-medium text-grey-800">
                          {selectedItem.recommendation.standardSpecification.length || '-'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedItem.recommendation.aiAssessment && (
                    <div className="rounded-md bg-warning-50 p-3 border border-warning-200">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-warning-800">
                        AI Assessment
                      </h4>
                      <p className="mt-1 text-sm font-medium text-warning-800">
                        {selectedItem.recommendation.aiAssessment}
                      </p>
                      <p className="mt-1 text-xs text-warning-700">
                        {selectedItem.recommendation.aiAssessmentReason}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'existing-codes' && (
                <div className="space-y-3">
                  {selectedItem.recommendation.mappedCodes.map((mc) => {
                    const mat = materials.find((m) => m.materialCode === mc.code && m.cpse === mc.cpse)
                    return (
                      <div
                        key={mc.cpse}
                        className="rounded-md border border-grey-200 p-3"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-medium text-grey-500">{mc.cpse}</span>
                            <p className="text-sm font-medium text-grey-800">{mc.code}</p>
                          </div>
                          {mat && <StatusBadge status={mat.status} dot />}
                        </div>
                        {mat && (
                          <p className="mt-1 text-xs text-grey-600">{mat.description}</p>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {activeTab === 'comparison' && selectedItem.material && (
                <div className="space-y-4">
                  {(() => {
                    const matchedMaterial = materials.find(
                      (m) =>
                        m.cpse !== selectedItem.material.cpse &&
                        m.category === selectedItem.material.category,
                    )
                    if (matchedMaterial) {
                      return (
                        <ComparisonTable
                          inputMaterial={selectedItem.material}
                          matchedMaterial={matchedMaterial}
                          matchResult={{
                            material: matchedMaterial,
                            score: selectedItem.confidence,
                            descriptionSimilarity: selectedItem.confidence - 1,
                            specificationMatch: 100,
                            technicalAttributes: selectedItem.confidence - 2,
                            uomCompatibility: 100,
                            matchType: selectedItem.matchType as any,
                            recommendation: 'Potential Match',
                          }}
                          recommendation={selectedItem.recommendation}
                        />
                      )
                    }
                    return <EmptyState title="No comparison data" description="Select a matched material to view comparison." fullHeight={false} />
                  })()}
                </div>
              )}

              <div className="mt-4 rounded-md bg-grey-50 p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-grey-500">
                  Reviewer Comment
                </h3>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Add a comment about this validation decision (optional)..."
                  className="mt-2 w-full rounded-md border border-grey-300 px-3 py-2 text-sm text-grey-800 placeholder-grey-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  rows={3}
                />
              </div>
            </div>

            <div className="sticky bottom-0 border-t border-grey-200 p-4">
              <div className="flex justify-end gap-2">
                <button
                   onClick={() => {
                     setSelectedItem(null)
                     setReviewComment('')
                   }}
                  className="rounded-md border border-grey-300 bg-white px-4 py-2 text-sm font-medium text-grey-700 hover:bg-grey-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(selectedItem)}
                  disabled={selectedItem.status === 'approved'}
                  className="rounded-md border border-danger-200 bg-white px-4 py-2 text-sm font-medium text-danger-600 hover:bg-danger-50"
                >
                  Reject
                </button>
                <button
                  onClick={() => setShowApprovalDialog(true)}
                  disabled={selectedItem.status === 'approved'}
                  className="rounded-md bg-success-600 px-4 py-2 text-sm font-medium text-white hover:bg-success-700"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ApprovalDialog
        isOpen={showApprovalDialog}
        onClose={() => setShowApprovalDialog(false)}
        onConfirm={handleConfirmApproval}
        title="Approve Material Standardization?"
        description="This will create the Common National Material Code and finalize the CPSE material mapping."
        confirmLabel="Confirm Approval"
        cancelLabel="Cancel"
      />

      {filteredItems.length === 0 && !selectedItem && (
        <EmptyState
          title="No validation items found"
          description={searchTerm || statusFilter
            ? 'Try changing your filters or search query.'
            : 'All recommendations have been processed.'}
          fullHeight={false}
        />
      )}
    </div>
  )
}