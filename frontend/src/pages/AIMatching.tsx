import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { Brain, Search, Loader2 } from 'lucide-react'
import { ComparisonTable } from '../components/ComparisonTable'
import { StandardizationPanel } from '../components/StandardizationPanel'
import { MatchResultCard } from '../components/MatchResultCard'
import { StepIndicator } from '../components/StepIndicator'
import { ApprovalDialog } from '../components/ApprovalDialog'
import { EmptyState } from '../components/EmptyState'
import { useAppContext } from '../context/AppContext'
import { MATCH_STEPS, RECOMMENDATION_GROUPS } from '../data/materials'
import type { Material, MatchResult, AIFlowStep, StandardizationRecommendation } from '../types'

const WORKFLOW_STEPS = [
  { label: 'Input', description: 'Select source material' },
  { label: 'Analyze', description: 'Run AI matching analysis' },
  { label: 'Compare', description: 'Technical comparison' },
  { label: 'Standardize', description: 'Generate recommendation' },
  { label: 'Validate', description: 'Send for expert validation' },
]

export function AIMatching() {
  const { materials, recommendations, approveRecommendation, showToast } = useAppContext()
  const [inputMaterial, setInputMaterial] = useState<Material | null>(() =>
    materials.find((m) => m.materialCode === 'BOLT101') || null,
  )
  const [flowStep, setFlowStep] = useState<AIFlowStep>('idle')
  const [processingSteps, setProcessingSteps] = useState<{ label: string; completed: boolean; sublabel?: string }[]>([])
  const [processingComplete, setProcessingComplete] = useState(false)
  const [matchResults, setMatchResults] = useState<MatchResult[]>([])
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null)
  const [recommendation, setRecommendation] = useState<StandardizationRecommendation | null>(null)
  const [validationGroupKey, setValidationGroupKey] = useState<string | null>(null)
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [modifiedRec, setModifiedRec] = useState<Partial<StandardizationRecommendation>>({})
  const intervalRef = useRef<number | null>(null)

  const materialGroups = useMemo(() => RECOMMENDATION_GROUPS, [])

  const sampleMaterials = [
    { code: 'BOLT101', cpse: 'CPSE-A', label: 'BOLT101 (CPSE-A)' },
    { code: 'MAT1025', cpse: 'CPSE-A', label: 'MAT1025 (CPSE-A)' },
    { code: 'VAL201', cpse: 'CPSE-A', label: 'VAL201 (CPSE-A)' },
    { code: 'PUMP301', cpse: 'CPSE-A', label: 'PUMP301 (CPSE-A)' },
    { code: 'MTR100', cpse: 'CPSE-B', label: 'MTR100 (CPSE-B)' },
  ]

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const findGroupKey = useCallback(
    (materialId: string): string | null => {
      for (const [key, group] of Object.entries(materialGroups)) {
        if (group.some((m) => m.id === materialId)) {
          return key
        }
      }
      return null
    },
    [materialGroups],
  )

  const currentWorkflowStep = useMemo(() => {
    switch (flowStep) {
      case 'idle':
        return 1
      case 'processing':
        return 2
      case 'results':
      case 'comparison':
        return inputMaterial && !selectedMatch ? 3 : selectedMatch ? 3 : 3
      case 'recommendation':
        return 4
      case 'validation':
        return 5
      default:
        return 1
    }
  }, [flowStep, inputMaterial, selectedMatch])

  const handleFindSimilar = () => {
    if (!inputMaterial) return

    setFlowStep('processing')
    setProcessingComplete(false)
    setMatchResults([])
    setSelectedMatch(null)
    setRecommendation(null)
    setValidationGroupKey(null)

    const steps = MATCH_STEPS.map((s) => ({
      label: s.label,
      sublabel: s.sublabel,
      completed: false,
    }))
    setProcessingSteps(steps)

    let stepIndex = 0
    intervalRef.current = window.setInterval(() => {
      setProcessingSteps((prev) => {
        if (stepIndex < prev.length) {
          const updated = [...prev]
          updated[stepIndex].completed = true
          stepIndex++

          if (stepIndex === prev.length) {
            if (intervalRef.current) clearInterval(intervalRef.current)
            setProcessingComplete(true)
            setTimeout(() => {
              generateMatchResults(inputMaterial)
            }, 500)
          }
        }
        return prev
      })
    }, 400)
  }

  const generateMatchResults = useCallback(
    (material: Material) => {
      const groupKey = findGroupKey(material.id)
      const matches: MatchResult[] = []

      if (groupKey) {
        const group = materialGroups[groupKey]
        group
          .filter((m) => m.id !== material.id)
          .forEach((m) => {
            matches.push({
              material: m,
              score: m.similarity || 96,
              descriptionSimilarity: 95,
              specificationMatch: 100,
              technicalAttributes: 92,
              uomCompatibility: 100,
              matchType: m.matchType || 'near-duplicate',
              recommendation: 'Potential Match',
            })
          })

        setMatchResults(matches)
        setFlowStep('results')

        if (recommendations[groupKey.toUpperCase()]) {
          setRecommendation(recommendations[groupKey.toUpperCase()])
          setValidationGroupKey(groupKey)
        }
      } else {
        const potentialMatches = materials
          .filter((m) => m.id !== material.id && m.category === material.category)
          .slice(0, 3)
          .map((m) => ({
            material: m,
            score: m.similarity || 85,
            descriptionSimilarity: 88,
            specificationMatch: 92,
            technicalAttributes: 85,
            uomCompatibility: 100,
            matchType: m.matchType || 'near-duplicate',
            recommendation: 'Potential Match',
          }))
        setMatchResults(potentialMatches)
        setFlowStep('results')
      }
    },
    [findGroupKey, materialGroups, materials, recommendations],
  )

  const handleCompare = (match: MatchResult) => {
    setSelectedMatch(match)
    setFlowStep('comparison')
  }

  const handleBackToResults = () => {
    setSelectedMatch(null)
    setFlowStep('results')
  }

  const handleGenerateRecommendation = () => {
    setFlowStep('recommendation')
  }

  const handleSendForValidation = () => {
    setShowApprovalDialog(true)
  }

  const handleConfirmApproval = () => {
    setShowApprovalDialog(false)
    if (validationGroupKey) {
      approveRecommendation(
        inputMaterial?.cpse || 'CPSE-A',
        inputMaterial?.materialCode || '',
        validationGroupKey,
      )
      showToast('Material successfully standardized.', 'success')
      setFlowStep('validation')
    }
  }

  const handleEditRecommendation = () => {
    setShowEditDialog(true)
  }

  const handleSaveEdit = () => {
    setShowEditDialog(false)
    if (recommendation) {
      setRecommendation({
        ...recommendation,
        ...modifiedRec,
      })
    }
  }

  const handleMaterialChange = (material: Material) => {
    setInputMaterial(material)
    setFlowStep('idle')
    setProcessingComplete(false)
    setMatchResults([])
    setSelectedMatch(null)
    setRecommendation(null)
    setValidationGroupKey(null)
    setModifiedRec({})
  }

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-semibold text-grey-800">AI Material Matching</h1>
        <p className="mt-1 text-sm text-grey-500">
          Identify identical, duplicate and functionally equivalent materials using AI-powered semantic and
          technical matching.
        </p>
      </div>

      <div className="rounded-lg border border-grey-200 bg-white p-5 shadow-card">
        <div className="mb-4 flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary-600" />
          <h3 className="text-sm font-semibold text-grey-800">Step 1: Input Material</h3>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {sampleMaterials.map((s) => {
            const mat = materials.find((m) => m.materialCode === s.code && m.cpse === s.cpse)
            return (
              <button
                key={s.code}
                onClick={() => mat && handleMaterialChange(mat)}
                className="rounded-md border border-grey-300 bg-white px-3 py-1 text-xs font-medium text-grey-700 hover:bg-grey-50"
              >
                {s.label}
              </button>
            )
          })}
        </div>

        {inputMaterial && (
          <div className="rounded-md border border-grey-200 p-4">
            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
              <div>
                <span className="text-xs font-medium text-grey-500">Material Code</span>
                <p className="mt-0.5 font-medium text-grey-800">{inputMaterial.materialCode}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-grey-500">CPSE</span>
                <p className="mt-0.5 font-medium text-grey-800">{inputMaterial.cpse}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-grey-500">Description</span>
                <p className="mt-0.5 font-medium text-grey-800">{inputMaterial.description}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-grey-500">Category</span>
                <p className="mt-0.5 font-medium text-grey-800">{inputMaterial.category}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-grey-500">Specification</span>
                <p className="mt-0.5 font-medium text-grey-800">{inputMaterial.specification}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-grey-500">UOM</span>
                <p className="mt-0.5 font-medium text-grey-800">{inputMaterial.uom}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4">
          <button
            onClick={handleFindSimilar}
            disabled={!inputMaterial || flowStep === 'processing'}
            className="flex items-center gap-2 rounded-md bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {flowStep === 'processing' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span>Find Similar Materials</span>
              </>
            )}
          </button>
        </div>
      </div>

      {flowStep !== 'idle' && currentWorkflowStep > 1 && (
        <div className="rounded-lg border border-grey-200 bg-white p-5 shadow-card">
          <StepIndicator steps={WORKFLOW_STEPS} currentStep={currentWorkflowStep} />
        </div>
      )}

      {flowStep === 'processing' && (
        <div className="rounded-lg border border-grey-200 bg-white p-6 shadow-card">
          <div className="mx-auto max-w-2xl">
            <div className="mb-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary-600" />
                </div>
                <span className="text-sm font-medium text-grey-600">Analyzing Material...</span>
              </div>
              <p className="mt-1 text-xs text-grey-500">
                Running AI analysis to identify potential matches across CPSEs...
              </p>
            </div>

            <div className="space-y-2.5">
              {processingSteps.map((step) => (
                <div
                  key={step.label}
                  className="flex items-center gap-3 transition-all duration-300"
                >
                  <div
                    className="flex h-5 w-5 items-center justify-center rounded-full text-xs"
                    style={{
                      backgroundColor: step.completed ? '#d1fae5' : '#f3f4f6',
                      color: step.completed ? '#16a34a' : '#9ca3af',
                    }}
                  >
                    {step.completed ? '✓' : ''}
                  </div>
                  <div className="flex flex-col">
                    <span
                      style={{ color: step.completed ? '#16a34a' : '#6b7280' }}
                      className="text-sm"
                    >
                      {step.label}
                    </span>
                    {step.sublabel && (
                      <span className="text-xs text-grey-500">{step.sublabel}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {processingComplete && !selectedMatch && (
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 rounded-md bg-success-50 px-4 py-2 text-sm font-medium text-success-700">
                  <span>✓</span> Analysis Complete
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {flowStep === 'results' && matchResults.length > 0 && !selectedMatch && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-grey-800">Step 3: Match Results</h3>
            <span className="text-xs text-grey-500">
              {matchResults.length} potential matches found
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {matchResults.map((result) => (
              <MatchResultCard
                key={result.material.id}
                result={result}
                onSelect={(r) => setSelectedMatch(r)}
                onViewComparison={handleCompare}
              />
            ))}
          </div>
        </div>
      )}

      {flowStep === 'results' && matchResults.length === 0 && (
        <div className="rounded-lg border border-grey-200 bg-white p-6 shadow-card">
          <EmptyState
            title="No matches found"
            description="No similar materials detected. Try selecting a different input material."
            fullHeight={false}
          />
        </div>
      )}

      {flowStep === 'comparison' && selectedMatch && inputMaterial && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-grey-800">Step 4: Technical Comparison</h3>
            <button
              onClick={handleBackToResults}
              className="text-xs font-medium text-primary-600 hover:text-primary-800"
            >
              Back to Results
            </button>
          </div>

          <ComparisonTable
            inputMaterial={inputMaterial}
            matchedMaterial={selectedMatch.material}
            matchResult={selectedMatch}
            recommendation={recommendation || undefined}
          />

          <div className="flex justify-center gap-3">
            <button
              onClick={handleBackToResults}
              className="rounded-md border border-grey-300 bg-white px-4 py-2 text-sm font-medium text-grey-700 hover:bg-grey-50"
            >
              Back to Results
            </button>
            <button
              onClick={handleGenerateRecommendation}
              className="rounded-md bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800"
              disabled={!recommendation}
            >
              Generate Standardization Recommendation
            </button>
          </div>
        </div>
      )}

      {flowStep === 'recommendation' && recommendation && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-grey-800">Step 5: Standardization</h3>
          <StandardizationPanel
            recommendation={recommendation}
            matchScore={selectedMatch?.score || 96}
            onSendForValidation={handleSendForValidation}
            onEdit={handleEditRecommendation}
          />
          <div className="flex justify-center">
            <button
              onClick={() => setFlowStep('comparison')}
              className="rounded-md border border-grey-300 bg-white px-4 py-2 text-sm font-medium text-grey-700 hover:bg-grey-50"
            >
              Back to Comparison
            </button>
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

      {showEditDialog && recommendation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-grey-200 bg-white shadow-xl">
            <div className="border-b border-grey-200 p-5">
              <h2 className="text-lg font-semibold text-grey-800">Edit Recommendation</h2>
              <p className="text-sm text-grey-500">Modify the standardization recommendation</p>
            </div>
            <div className="p-5">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-grey-600">Standard Description</label>
                  <input
                    type="text"
                    defaultValue={recommendation.standardizedDescription}
                    onChange={(e) =>
                      setModifiedRec({ ...modifiedRec, standardizedDescription: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border border-grey-300 px-3 py-1 text-sm text-grey-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-grey-600">Category</label>
                  <input
                    type="text"
                    defaultValue={recommendation.standardCategory}
                    onChange={(e) => setModifiedRec({ ...modifiedRec, standardCategory: e.target.value.toUpperCase() })}
                    className="mt-1 w-full rounded-md border border-grey-300 px-3 py-1 text-sm text-grey-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-grey-600">Proposed Code</label>
                  <input
                    type="text"
                    defaultValue={recommendation.proposedCommonNationalCode}
                    onChange={(e) =>
                      setModifiedRec({ ...modifiedRec, proposedCommonNationalCode: e.target.value.toUpperCase() })
                    }
                    className="mt-1 w-full rounded-md border border-grey-300 px-3 py-1 text-sm font-mono text-grey-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
            <div className="border-t border-grey-200 p-4">
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowEditDialog(false)}
                  className="rounded-md border border-grey-300 bg-white px-4 py-2 text-sm font-medium text-grey-700 hover:bg-grey-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleSaveEdit()
                  }}
                  className="rounded-md bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
