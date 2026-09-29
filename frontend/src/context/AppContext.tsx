import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  Material,
  AuditEntry,
  ValidationStatus,
  StandardizationRecommendation,
  CNMCGroup,
  NationalCodeEntry,
  ValidationQueueItem,
  DemoStep,
} from '../types'
import {
  ALL_MATERIALS,
  INITIAL_AUDIT_ENTRIES,
  RECOMMENDATIONS,
  RECOMMENDATION_GROUPS,
  CNMC_GROUPS,
  VALIDATION_QUEUE_ITEMS,
  DEMO_STEPS,
} from '../data/materials'

type ToastState = {
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  id: string
} | null

interface AppContextType {
  materials: Material[]
  approvedMaterials: Material[]
  nationalCodes: NationalCodeEntry[]
  cnmcGroups: Record<string, CNMCGroup>
  auditTrail: AuditEntry[]
  recommendations: Record<string, StandardizationRecommendation>
  validationQueue: ValidationQueueItem[]
  demoSteps: DemoStep[]
  demoMode: boolean
  toast: ToastState
  updateMaterialStatus: (id: string, status: Material['status']) => void
  approveRecommendation: (cpse: string, materialCode: string, groupKey: string) => void
  modifyRecommendation: (materialId: string, newRecommendation: Partial<StandardizationRecommendation>) => void
  addAuditEntry: (entry: Omit<AuditEntry, 'id' | 'dateTime'>) => void
  updateValidationQueueStatus: (id: string, status: ValidationStatus, comment?: string) => void
  setMaterials: (materials: Material[]) => void
  getGroupByMaterialId: (id: string) => string | null
  toggleDemoMode: () => void
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void
  hideToast: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [materials, setMaterials] = useState<Material[]>([...ALL_MATERIALS])
  const [approvedMaterials, setApprovedMaterials] = useState<Material[]>([])
  const [nationalCodes, setNationalCodes] = useState<NationalCodeEntry[]>([])
  const [cnmcGroups, setCnmcGroups] = useState<Record<string, CNMCGroup>>({
    ...CNMC_GROUPS,
  })
  const [validationQueue, setValidationQueue] = useState<ValidationQueueItem[]>([
    ...VALIDATION_QUEUE_ITEMS,
  ])
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([...INITIAL_AUDIT_ENTRIES])
  const [recommendations] = useState<Record<string, StandardizationRecommendation>>({ ...RECOMMENDATIONS })
  const [toast, setToast] = useState<ToastState>(null)
  const [demoMode, setDemoMode] = useState(false)

  const updateMaterialStatus = useCallback((id: string, status: Material['status']) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m)),
    )
  }, [])

  const getGroupByMaterialId = useCallback((id: string): string | null => {
    for (const [key, group] of Object.entries(RECOMMENDATION_GROUPS)) {
      if (group.some((m) => m.id === id)) {
        return key
      }
    }
    return null
  }, [])

  const addAuditEntry = useCallback((entry: Omit<AuditEntry, 'id' | 'dateTime'>) => {
    const newEntry: AuditEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      dateTime: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    }
    setAuditTrail((prev) => [newEntry, ...prev])
  }, [])

  const approveRecommendation = useCallback(
    (cpse: string, materialCode: string, groupKey: string) => {
      const rec = recommendations[groupKey.toUpperCase()]
      if (!rec) return

      const group = RECOMMENDATION_GROUPS[groupKey.toUpperCase()]
      if (!group) return

      const groupMaterials = group
        .map((gm) => materials.find((m) => m.id === gm.id))
        .filter(Boolean) as Material[]

      const updatedMaterials = groupMaterials.map((m) => ({
        ...m,
        status: 'approved' as const,
        commonNationalCode: rec.proposedCommonNationalCode,
      }))

      setMaterials((prev) =>
        prev.map((m) => {
          const updated = updatedMaterials.find((um) => um.id === m.id)
          return updated || m
        }),
      )

      setApprovedMaterials((prev) => {
        const existing = new Set(prev.map((m) => m.id))
        const filtered = updatedMaterials.filter((m) => !existing.has(m.id))
        return [...prev, ...filtered]
      })

      setCnmcGroups((prev) => ({
        ...prev,
        [groupKey]: {
          ...prev[groupKey],
          status: 'active' as const,
        },
      }))

      const nationalCode: NationalCodeEntry = {
        code: rec.proposedCommonNationalCode,
        description: rec.standardizedDescription,
        category: rec.standardCategory,
        specification: `${rec.standardSpecification.material} | ${rec.standardSpecification.diameter} | ${rec.standardSpecification.length}`,
        uom: groupMaterials[0]?.uom || '',
        mappedCPSEs: groupMaterials.length,
        existingCodes: rec.mappedCodes.map((mc) => mc.code),
        approvalStatus: 'Approved',
        materialIds: groupMaterials.map((m) => m.id),
        groupKey: groupKey,
        createdBy: 'Technical Reviewer',
        createdAt: new Date().toISOString(),
      }

      setNationalCodes((prev) => {
        if (prev.some((nc) => nc.code === nationalCode.code)) {
          return prev
        }
        return [...prev, nationalCode]
      })

      setValidationQueue((prev) =>
        prev.map((item) =>
          item.groupKey === groupKey
            ? { ...item, status: 'approved' }
            : item,
        ),
      )

      addAuditEntry({
        user: 'Technical Reviewer',
        cpse,
        materialCode,
        action: 'Recommendation Approved',
        previousValue: 'Pending Review',
        newValue: `Approved - ${rec.proposedCommonNationalCode}`,
        status: 'approved' as ValidationStatus,
      })

      setToast({
        message: `Material successfully standardized. CNMC ${rec.proposedCommonNationalCode} created.`,
        type: 'success',
        id: `toast-${Date.now()}`,
      })
    },
    [recommendations, materials, addAuditEntry],
  )

  const modifyRecommendation = useCallback(
    (materialId: string, _newRec: Partial<StandardizationRecommendation>) => {
      const key = getGroupByMaterialId(materialId)
      if (!key || !recommendations[key.toUpperCase()]) return

      const mat = materials.find((m) => m.id === materialId)
      if (!mat) return

      addAuditEntry({
        user: 'Technical Reviewer',
        cpse: mat.cpse,
        materialCode: mat.materialCode,
        action: 'Recommendation Modified',
        previousValue: '',
        newValue: 'Modified',
        status: 'modified' as ValidationStatus,
      })

      setToast({
        message: 'Recommendation updated successfully.',
        type: 'info',
        id: `toast-${Date.now()}`,
      })
    },
    [recommendations, materials, addAuditEntry, getGroupByMaterialId],
  )

  const updateValidationQueueStatus = useCallback(
    (id: string, status: ValidationStatus, comment?: string) => {
      setValidationQueue((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status, reviewerComment: comment || item.reviewerComment } : item,
        ),
      )
    },
    [],
  )

  const toggleDemoMode = useCallback(() => {
    setDemoMode((prev) => !prev)
    setToast({
      message: 'Demo mode toggled',
      type: 'info',
      id: `toast-${Date.now()}`,
    })
  }, [])

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setToast({ message, type, id: `toast-${Date.now()}` })
  }, [])

  const hideToast = useCallback(() => {
    setToast(null)
  }, [])

  const value = useMemo(
    () => ({
      materials,
      approvedMaterials,
      nationalCodes,
      cnmcGroups,
      auditTrail,
      recommendations,
      validationQueue,
      demoSteps: DEMO_STEPS,
      demoMode,
      toast,
      updateMaterialStatus,
      approveRecommendation,
      modifyRecommendation,
      addAuditEntry,
      updateValidationQueueStatus,
      setMaterials,
      getGroupByMaterialId,
      toggleDemoMode,
      showToast,
      hideToast,
    }),
    [
      materials,
      approvedMaterials,
      nationalCodes,
      cnmcGroups,
      auditTrail,
      recommendations,
      validationQueue,
      demoMode,
      toast,
      updateMaterialStatus,
      approveRecommendation,
      modifyRecommendation,
      addAuditEntry,
      updateValidationQueueStatus,
      getGroupByMaterialId,
      toggleDemoMode,
      showToast,
      hideToast,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
