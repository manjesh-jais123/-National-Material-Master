export interface Material {
  id: string
  cpse: string
  materialCode: string
  description: string
  category: string
  specification: string
  uom: string
  matchType?: MatchType
  similarity?: number
  commonNationalCode?: string
  status: MaterialStatus
  brand?: string
  size?: string
  grade?: string
  dimension?: string
  standard?: string
  technicalParams?: string
}

export type MatchType =
  | 'identical'
  | 'near-duplicate'
  | 'duplicate'
  | 'potential-duplicate'
  | 'equivalent'
  | 'unique'

export type MaterialStatus =
  | 'pending'
  | 'approved'
  | 'modified'
  | 'rejected'
  | 'standardized'

export type ValidationStatus =
  | 'pending'
  | 'approved'
  | 'modified'
  | 'rejected'

export interface MatchResult {
  material: Material
  score: number
  descriptionSimilarity: number
  specificationMatch: number
  technicalAttributes: number
  uomCompatibility: number
  matchType: MatchType
  recommendation: string
}

export interface ComparisonAttribute {
  label: string
  inputValue: string
  matchedValue: string
  isMatch: boolean
}

export interface StandardizationRecommendation {
  standardizedDescription: string
  standardCategory: string
  standardSpecification: {
    material: string
    diameter: string
    length: string
  }
  proposedCommonNationalCode: string
  mappedCodes: Array<{
    cpse: string
    code: string
  }>
  aiAssessment?: string
  aiAssessmentReason?: string
}

export interface CNMCGroup {
  groupKey: string
  commonNationalCode: string
  standardizedDescription: string
  standardCategory: string
  specification: {
    material: string
    diameter: string
    length: string
  }
  mappedMaterials: Material[]
  mappedCodes: Array<{
    cpse: string
    code: string
  }>
  status: 'pending' | 'active' | 'draft'
  aiAssessment: string
  aiAssessmentReason: string
}

export interface AuditEntry {
  id: string
  dateTime: string
  user: string
  cpse: string
  materialCode: string
  action: string
  previousValue: string
  newValue: string
  status: ValidationStatus
  comment?: string
}

export interface CPSE {
  id: string
  name: string
  code: string
}

export interface Category {
  id: string
  name: string
}

export interface ToastMessage {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

export type AIFlowStep =
  | 'idle'
  | 'processing'
  | 'results'
  | 'comparison'
  | 'recommendation'
  | 'validation'

export interface MatchSession {
  id: string
  inputMaterialId: string
  matchResults: MatchResult[]
  selectedMatchId: string | null
  recommendation: StandardizationRecommendation | null
  groupKey: string | null
  createdAt: string
}

export interface ValidationQueueItem {
  id: string
  material: Material
  recommendation: StandardizationRecommendation
  matchType: string
  confidence: number
  date: string
  status: ValidationStatus
  groupKey: string
  reviewerComment?: string
}

export interface NationalCodeEntry {
  code: string
  description: string
  category: string
  specification: string
  uom: string
  mappedCPSEs: number
  existingCodes: string[]
  approvalStatus: string
  materialIds: string[]
  groupKey: string
  createdBy: string
  createdAt: string
}

export interface DemoStep {
  step: number
  title: string
  description: string
  targetPage: string
  hint?: string
}
