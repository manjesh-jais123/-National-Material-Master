import type {
  Material,
  MatchResult,
  StandardizationRecommendation,
  AuditEntry,
  CPSE,
  Category,
  MatchType,
  CNMCGroup,
  ValidationQueueItem,
  DemoStep,
} from '../types'

export const CPS_ES: CPSE[] = [
  { id: 'cpse-a', name: 'CPSE-A (Heavy Engineering)', code: 'CPSE-A' },
  { id: 'cpse-b', name: 'CPSE-B (Power Generation)', code: 'CPSE-B' },
  { id: 'cpse-c', name: 'CPSE-C (Mining)', code: 'CPSE-C' },
  { id: 'cpse-d', name: 'CPSE-D (Chemicals)', code: 'CPSE-D' },
  { id: 'cpse-e', name: 'CPSE-E (Infrastructure)', code: 'CPSE-E' },
]

export const CATEGORIES: Category[] = [
  { id: 'bearings', name: 'Bearings' },
  { id: 'bolts', name: 'Bolts' },
  { id: 'nuts', name: 'Nuts' },
  { id: 'valves', name: 'Valves' },
  { id: 'pumps', name: 'Pumps' },
  { id: 'cables', name: 'Cables' },
  { id: 'motors', name: 'Motors' },
  { id: 'gaskets', name: 'Gaskets' },
  { id: 'pipes', name: 'Pipes' },
  { id: 'electrical-components', name: 'Electrical Components' },
]

// Group 1: SS Bolt M10x50 — same material across CPSEs
export const BOLT_MATERIALS: Material[] = [
  {
    id: 'mat-bolt-a',
    cpse: 'CPSE-A',
    materialCode: 'BOLT101',
    description: 'SS Bolt M10x50',
    category: 'Fastener',
    specification: 'Stainless Steel, M10, 50 mm',
    uom: 'NOS',
    matchType: 'potential-duplicate',
    similarity: 96,
    status: 'pending',
    brand: 'Generic',
    size: 'M10',
    grade: 'SS304',
    dimension: '50 mm',
    standard: 'ISO 3506',
    technicalParams: 'Tensile Strength: 800 MPa, Hardness: 25 HRC',
  },
  {
    id: 'mat-bolt-b',
    cpse: 'CPSE-B',
    materialCode: '45678',
    description: 'Stainless Steel Bolt 10mm x 50mm',
    category: 'Fastener',
    specification: 'SS 304, M10 x 50mm, Full Thread',
    uom: 'NOS',
    matchType: 'potential-duplicate',
    similarity: 95,
    status: 'pending',
    brand: 'Generic',
    size: 'M10',
    grade: 'SS304',
    dimension: '50 mm',
    standard: 'ISO 3506',
    technicalParams: 'Tensile Strength: 800 MPa, Hardness: 25 HRC',
  },
  {
    id: 'mat-bolt-c',
    cpse: 'CPSE-C',
    materialCode: 'B55',
    description: 'SS Bolt M10 X 50 MM',
    category: 'Fastener',
    specification: 'Stainless Steel Grade 304, M10 x 50',
    uom: 'NOS',
    matchType: 'potential-duplicate',
    similarity: 94,
    status: 'pending',
    brand: 'Generic',
    size: 'M10',
    grade: 'SS304',
    dimension: '50 mm',
    standard: 'ISO 3506',
    technicalParams: 'Tensile Strength: 800 MPa, Hardness: 25 HRC',
  },
]

// Group 2: Ball Bearing 6205
export const BEARING_MATERIALS: Material[] = [
  {
    id: 'mat-bearing-a',
    cpse: 'CPSE-A',
    materialCode: 'MAT1025',
    description: 'SS BALL BEARING 6205',
    category: 'Bearing',
    specification: 'Deep Groove, 25mm Bore',
    uom: 'NOS',
    matchType: 'potential-duplicate',
    similarity: 97,
    status: 'pending',
    brand: 'SKF',
    size: '6205',
    grade: 'Chrome Steel',
    dimension: '25mm bore, 52mm OD, 15mm width',
    standard: 'ISO 15:2017',
    technicalParams: 'C3 Clearance, Double Shield',
  },
  {
    id: 'mat-bearing-b',
    cpse: 'CPSE-B',
    materialCode: 'BRG-458',
    description: 'Deep Groove Ball Bearing 6205',
    category: 'Bearing',
    specification: 'Deep Groove, 25mm Bore, C3',
    uom: 'NOS',
    matchType: 'near-duplicate',
    similarity: 93,
    status: 'pending',
    brand: 'NTN',
    size: '6205',
    grade: 'Chrome Steel',
    dimension: '25mm bore, 52mm OD, 15mm width',
    standard: 'ISO 15:2017',
    technicalParams: 'C3 Clearance, Double Shield',
  },
  {
    id: 'mat-bearing-c',
    cpse: 'CPSE-C',
    materialCode: '78921',
    description: 'Ball Bearing 6205',
    category: 'Bearing',
    specification: '25mm Bore, Deep Groove',
    uom: 'NOS',
    matchType: 'near-duplicate',
    similarity: 91,
    status: 'pending',
    brand: 'NSK',
    size: '6205',
    grade: 'Chrome Steel',
    dimension: '25mm bore, 52mm OD, 15mm width',
    standard: 'ISO 15:2017',
    technicalParams: 'C3 Clearance, Double Shield',
  },
]

// Group 3: Gate Valve 100mm
export const VALVE_MATERIALS: Material[] = [
  {
    id: 'mat-valve-a',
    cpse: 'CPSE-A',
    materialCode: 'VAL201',
    description: 'GATE VALVE 100MM',
    category: 'Valve',
    specification: 'Cast Iron, 100mm, Rising Stem',
    uom: 'NOS',
    matchType: 'potential-duplicate',
    similarity: 94,
    status: 'pending',
    brand: 'Generic',
    size: '100mm',
    grade: 'Cast Iron',
    dimension: '100 mm NB',
    standard: 'IS 7262',
    technicalParams: 'Class 150, PN16, Handwheel Operated',
  },
  {
    id: 'mat-valve-b',
    cpse: 'CPSE-B',
    materialCode: 'GV-100-22',
    description: '100mm Cast Iron Gate Valve',
    category: 'Valve',
    specification: '100mm NB, Rising Stem, CI',
    uom: 'NOS',
    matchType: 'near-duplicate',
    similarity: 92,
    status: 'pending',
    brand: 'Generic',
    size: '100mm',
    grade: 'Cast Iron',
    dimension: '100 mm NB',
    standard: 'IS 7262',
    technicalParams: 'Class 150, PN16, Handwheel Operated',
  },
]

// Group 4: Centrifugal Pump 5HP
export const PUMP_MATERIALS: Material[] = [
  {
    id: 'mat-pump-a',
    cpse: 'CPSE-A',
    materialCode: 'PUMP301',
    description: 'CENTRIFUGAL PUMP 5HP',
    category: 'Pump',
    specification: '5HP, 2900 RPM, SS 304',
    uom: 'NOS',
    matchType: 'potential-duplicate',
    similarity: 95,
    status: 'pending',
    brand: 'Grundfos',
    size: '5 HP',
    grade: 'SS304',
    dimension: '1.5 kW motor',
    standard: 'ISO 2858',
    technicalParams: 'Single Phase, 2900 RPM, 50 Hz',
  },
  {
    id: 'mat-pump-b',
    cpse: 'CPSE-D',
    materialCode: 'CP-5250',
    description: '5 HP Centrifugal Pump',
    category: 'Pump',
    specification: '2900 RPM, 5 HP, Stainless Steel',
    uom: 'NOS',
    matchType: 'near-duplicate',
    similarity: 90,
    status: 'pending',
    brand: 'Grundfos',
    size: '5 HP',
    grade: 'SS304',
    dimension: '1.5 kW motor',
    standard: 'ISO 2858',
    technicalParams: 'Single Phase, 2900 RPM, 50 Hz',
  },
]

// Group 5: Cable 4-Core 2.5Sq.mm
export const CABLE_MATERIALS: Material[] = [
  {
    id: 'mat-cable-a',
    cpse: 'CPSE-A',
    materialCode: 'CABLE501',
    description: '4-CORE 2.5SQ.MM CABLE',
    category: 'Cable',
    specification: '4 Core, 2.5 sq.mm, Copper, PVC',
    uom: 'MTR',
    matchType: 'potential-duplicate',
    similarity: 93,
    status: 'pending',
    brand: 'Generic',
    size: '2.5 sq.mm',
    grade: 'Copper',
    dimension: '4 Core',
    standard: 'IS 16515',
    technicalParams: 'PVC Insulated, 1.1 kV Rating',
  },
  {
    id: 'mat-cable-b',
    cpse: 'CPSE-E',
    materialCode: '456-CABLE',
    description: '2.5SQ.MM 4 CORE CABLE',
    category: 'Cable',
    specification: 'Copper, 2.5 sq.mm, 4 core, PVC',
    uom: 'MTR',
    matchType: 'near-duplicate',
    similarity: 91,
    status: 'pending',
    brand: 'Generic',
    size: '2.5 sq.mm',
    grade: 'Copper',
    dimension: '4 Core',
    standard: 'IS 16515',
    technicalParams: 'PVC Insulated, 1.1 kV Rating',
  },
]

// Group 6: Motor 1HP
export const MOTOR_MATERIALS: Material[] = [
  {
    id: 'mat-motor-a',
    cpse: 'CPSE-B',
    materialCode: 'MTR100',
    description: '1HP MOTOR 1400 RPM',
    category: 'Motor',
    specification: '1 HP, 1400 RPM, 3 Phase, TEFC',
    uom: 'NOS',
    matchType: 'potential-duplicate',
    similarity: 94,
    status: 'pending',
    brand: 'ABB',
    size: '1 HP',
    grade: 'Aluminium',
    dimension: '1400 RPM',
    standard: 'IS 325',
    technicalParams: '3 Phase, 415V, TEFC, IE1',
  },
  {
    id: 'mat-motor-b',
    cpse: 'CPSE-C',
    materialCode: 'MT-01HP',
    description: '1 HP 3-Phase Induction Motor',
    category: 'Motor',
    specification: '1HP, 1400 RPM, 3 Phase',
    uom: 'NOS',
    matchType: 'near-duplicate',
    similarity: 90,
    status: 'pending',
    brand: 'ABB',
    size: '1 HP',
    grade: 'Aluminium',
    dimension: '1400 RPM',
    standard: 'IS 325',
    technicalParams: '3 Phase, 415V, TEFC, IE1',
  },
]

// Group 7: Gasket 50mm
export const GASKET_MATERIALS: Material[] = [
  {
    id: 'mat-gasket-a',
    cpse: 'CPSE-A',
    materialCode: 'GASKET201',
    description: 'SPIRAL GASKT 50MM',
    category: 'Gasket',
    specification: 'Spiral Wound, 50mm ID, SS316',
    uom: 'NOS',
    matchType: 'potential-duplicate',
    similarity: 92,
    status: 'pending',
    brand: 'Generic',
    size: '50 mm',
    grade: 'SS316',
    dimension: '50mm ID',
    standard: 'ASME B16.20',
    technicalParams: 'Spiral Wound, Internal Guide',
  },
  {
    id: 'mat-gasket-b',
    cpse: 'CPSE-D',
    materialCode: 'SG-50-SS',
    description: 'Spiral Wound Gasket 50mm',
    category: 'Gasket',
    specification: '50mm ID, SS 316, Spiral Wound',
    uom: 'NOS',
    matchType: 'near-duplicate',
    similarity: 90,
    status: 'pending',
    brand: 'Generic',
    size: '50 mm',
    grade: 'SS316',
    dimension: '50mm ID',
    standard: 'ASME B16.20',
    technicalParams: 'Spiral Wound, Internal Guide',
  },
]

// Group 8: Pipes — unique / standardized
export const PIPE_MATERIALS: Material[] = [
  {
    id: 'mat-pipe-a',
    cpse: 'CPSE-A',
    materialCode: 'PIPE100',
    description: 'SEAMLESS PIPE 50NB',
    category: 'Pipe',
    specification: '50 NB, 2mm, MS, Black',
    uom: 'MTR',
    matchType: 'unique',
    similarity: 100,
    status: 'standardized',
    brand: 'Generic',
    size: '50 NB',
    grade: 'MS',
    dimension: '2mm wall',
    standard: 'IS 1239',
    technicalParams: 'Black, Seamless, SCH 40',
  },
  {
    id: 'mat-pipe-b',
    cpse: 'CPSE-E',
    materialCode: 'SP-50NB',
    description: '50NB MS Black Pipe',
    category: 'Pipe',
    specification: '50 NB, MS, Black, Seamless',
    uom: 'MTR',
    matchType: 'equivalent',
    similarity: 88,
    status: 'standardized',
    brand: 'Generic',
    size: '50 NB',
    grade: 'MS',
    dimension: '2mm wall',
    standard: 'IS 1239',
    technicalParams: 'Black, Seamless, SCH 40',
  },
]

// Group 9: Electrical Component — Switchgear
export const ELECTRICAL_MATERIALS: Material[] = [
  {
    id: 'mat-elec-a',
    cpse: 'CPSE-B',
    materialCode: 'EL-001',
    description: 'CONTACTOR 3RT2015',
    category: 'Electrical Components',
    specification: '3RT2015, 3 Phase, 14A, 24V DC',
    uom: 'NOS',
    matchType: 'potential-duplicate',
    similarity: 91,
    status: 'pending',
    brand: 'Siemens',
    size: '3RT2015',
    grade: '14A',
    dimension: '3 Phase',
    standard: 'IEC 60947',
    technicalParams: '24V DC Coil, AC-3 Rating',
  },
  {
    id: 'mat-elec-b',
    cpse: 'CPSE-E',
    materialCode: 'CON-3RT',
    description: '3-Phase Contactor 3RT2015',
    category: 'Electrical Components',
    specification: '3RT2015, 14A, 3 Phase, 24V DC',
    uom: 'NOS',
    matchType: 'near-duplicate',
    similarity: 89,
    status: 'pending',
    brand: 'Siemens',
    size: '3RT2015',
    grade: '14A',
    dimension: '3 Phase',
    standard: 'IEC 60947',
    technicalParams: '24V DC Coil, AC-3 Rating',
  },
]

// Group 10: Nuts — unique
export const NUT_MATERIALS: Material[] = [
  {
    id: 'mat-nut-a',
    cpse: 'CPSE-C',
    materialCode: 'NUT123',
    description: 'HEX NUT M12',
    category: 'Nut',
    specification: 'M12, SS304, Hex Nut',
    uom: 'NOS',
    matchType: 'unique',
    similarity: 100,
    status: 'approved',
    brand: 'Generic',
    size: 'M12',
    grade: 'SS304',
    dimension: '12mm',
    standard: 'ISO 4035',
    technicalParams: 'Thread Pitch: 1.75mm',
  },
]

// Additional individual materials to reach 25+
export const ADDITIONAL_MATERIALS: Material[] = [
  {
    id: 'mat-add-1',
    cpse: 'CPSE-A',
    materialCode: 'MTR-DEL-01',
    description: 'DIGITAL MULTIMETER',
    category: 'Electrical Components',
    specification: 'Digital, 3.5 digit, Auto Range',
    uom: 'NOS',
    matchType: 'unique',
    similarity: 100,
    status: 'approved',
    brand: 'Fluke',
    size: '3.5 digit',
    grade: '',
    dimension: '',
    standard: 'IEC 61010',
    technicalParams: 'Basic Accuracy: 0.5%',
  },
  {
    id: 'mat-add-2',
    cpse: 'CPSE-B',
    materialCode: 'INSTR-45',
    description: 'DMM 3.5 DIGIT',
    category: 'Electrical Components',
    specification: '3.5 digit, Auto range, Digital',
    uom: 'NOS',
    matchType: 'equivalent',
    similarity: 85,
    status: 'pending',
    brand: 'Fluke',
    size: '3.5 digit',
    grade: '',
    dimension: '',
    standard: 'IEC 61010',
    technicalParams: 'Basic Accuracy: 0.5%',
  },
  {
    id: 'mat-add-3',
    cpse: 'CPSE-A',
    materialCode: 'WRENCH-24',
    description: 'OPEN WRENCH 24MM',
    category: 'Fastener',
    specification: '24mm, Open End, Carbon Steel',
    uom: 'NOS',
    matchType: 'unique',
    similarity: 100,
    status: 'approved',
    brand: 'Generic',
    size: '24mm',
    grade: 'Carbon Steel',
    dimension: 'Open End',
    standard: 'IS 751',
    technicalParams: '',
  },
]

export const ALL_MATERIALS: Material[] = [
  ...BOLT_MATERIALS,
  ...BEARING_MATERIALS,
  ...VALVE_MATERIALS,
  ...PUMP_MATERIALS,
  ...CABLE_MATERIALS,
  ...MOTOR_MATERIALS,
  ...GASKET_MATERIALS,
  ...PIPE_MATERIALS,
  ...ELECTRICAL_MATERIALS,
  ...NUT_MATERIALS,
  ...ADDITIONAL_MATERIALS,
]

// KPI Data
export const KPI_DATA = {
  totalMaterials: 125430,
  potentialDuplicates: 8642,
  nearDuplicates: 4210,
  pendingValidation: 527,
  standardizedMaterials: 9820,
  connectedCPSEs: 12,
}

export const DUPLICATE_BY_CPSE = [
  { cpse: 'CPSE-A', count: 1540, fill: '#4f46e5' },
  { cpse: 'CPSE-B', count: 1280, fill: '#10b981' },
  { cpse: 'CPSE-C', count: 1120, fill: '#f59e0b' },
  { cpse: 'CPSE-D', count: 980, fill: '#ef4444' },
  { cpse: 'CPSE-E', count: 850, fill: '#3b82f6' },
]

export const CATEGORY_DATA = [
  { category: 'Mechanical', count: 42500 },
  { category: 'Electrical', count: 31200 },
  { category: 'Instrumentation', count: 18500 },
  { category: 'Bearings', count: 8900 },
  { category: 'Fasteners', count: 12300 },
  { category: 'Valves', count: 5600 },
  { category: 'Pumps', count: 3200 },
  { category: 'Cables', count: 3400 },
]

export const STANDARDIZATION_PROGRESS = [
  { name: 'Total', value: 125430, color: '#9ca3af' },
  { name: 'Standardized', value: 9820, color: '#10b981' },
  { name: 'Pending Validation', value: 527, color: '#f59e0b' },
]

export const MATCH_CONFIDENCE_DISTRIBUTION = [
  { range: '90-100%', count: 3200, fill: '#10b981' },
  { range: '80-89%', count: 1800, fill: '#3b82f6' },
  { range: '70-79%', count: 950, fill: '#f59e0b' },
  { range: '60-69%', count: 420, fill: '#ef4444' },
  { range: '<60%', count: 180, fill: '#9ca3af' },
]

export const VALIDATION_TREND = [
  { day: 'Mon', approved: 45, rejected: 12 },
  { day: 'Tue', approved: 52, rejected: 8 },
  { day: 'Wed', approved: 38, rejected: 15 },
  { day: 'Thu', approved: 67, rejected: 5 },
  { day: 'Fri', approved: 84, rejected: 11 },
  { day: 'Sat', approved: 29, rejected: 3 },
  { day: 'Sun', approved: 18, rejected: 7 },
]

export const RECOMMENDATION_GROUPS: Record<string, Material[]> = {
  BOLT: [...BOLT_MATERIALS],
  BEARING: [...BEARING_MATERIALS],
  VALVE: [...VALVE_MATERIALS],
  PUMP: [...PUMP_MATERIALS],
  CABLE: [...CABLE_MATERIALS],
  MOTOR: [...MOTOR_MATERIALS],
  GASKET: [...GASKET_MATERIALS],
  PIPE: [...PIPE_MATERIALS],
  ELECTRICAL: [...ELECTRICAL_MATERIALS],
  NUT: [...NUT_MATERIALS],
}

// Recommendations by group key
export const RECOMMENDATIONS: Record<string, StandardizationRecommendation> = {
  BOLT: {
    standardizedDescription: 'STAINLESS STEEL HEX BOLT M10 X 50 MM',
    standardCategory: 'FASTENER',
    standardSpecification: {
      material: 'Stainless Steel',
      diameter: 'M10',
      length: '50 MM',
    },
    proposedCommonNationalCode: 'CNMC-FST-M10-050',
    mappedCodes: [
      { cpse: 'CPSE-A', code: 'BOLT101' },
      { cpse: 'CPSE-B', code: '45678' },
      { cpse: 'CPSE-C', code: 'B55' },
    ],
    aiAssessment: 'Potentially Equivalent',
    aiAssessmentReason:
      'Descriptions and technical attributes indicate a high degree of similarity across CPSE-A, CPSE-B and CPSE-C. Expert validation is recommended before standardization.',
  },
  BEARING: {
    standardizedDescription: 'DEEP GROOVE BALL BEARING 6205',
    standardCategory: 'BEARING',
    standardSpecification: {
      material: 'Chrome Steel',
      diameter: '6205',
      length: '25mm Bore',
    },
    proposedCommonNationalCode: 'CNMC-BRG-6205',
    mappedCodes: [
      { cpse: 'CPSE-A', code: 'MAT1025' },
      { cpse: 'CPSE-B', code: 'BRG-458' },
      { cpse: 'CPSE-C', code: '78921' },
    ],
    aiAssessment: 'Potentially Equivalent',
    aiAssessmentReason:
      'Descriptions and technical attributes indicate a high degree of similarity. Expert validation is recommended before standardization.',
  },
  VALVE: {
    standardizedDescription: 'CAST IRON GATE VALVE 100MM',
    standardCategory: 'VALVE',
    standardSpecification: {
      material: 'Cast Iron',
      diameter: '100mm',
      length: '',
    },
    proposedCommonNationalCode: 'CNMC-VLV-100',
    mappedCodes: [
      { cpse: 'CPSE-A', code: 'VAL201' },
      { cpse: 'CPSE-B', code: 'GV-100-22' },
    ],
    aiAssessment: 'Potentially Equivalent',
    aiAssessmentReason:
      'Descriptions and technical attributes indicate a high degree of similarity. Expert validation is recommended before standardization.',
  },
  PUMP: {
    standardizedDescription: 'CENTRIFUGAL PUMP 5 HP 2900 RPM',
    standardCategory: 'PUMP',
    standardSpecification: {
      material: 'Stainless Steel',
      diameter: '5 HP',
      length: '2900 RPM',
    },
    proposedCommonNationalCode: 'CNMC-PMG-5HP',
    mappedCodes: [
      { cpse: 'CPSE-A', code: 'PUMP301' },
      { cpse: 'CPSE-D', code: 'CP-5250' },
    ],
    aiAssessment: 'Potentially Equivalent',
    aiAssessmentReason:
      'Descriptions and technical attributes indicate a high degree of similarity. Expert validation is recommended before standardization.',
  },
  CABLE: {
    standardizedDescription: '4 CORE 2.5 SQ.MM COPPER CABLE',
    standardCategory: 'CABLE',
    standardSpecification: {
      material: 'Copper',
      diameter: '2.5 sq.mm',
      length: '4 Core',
    },
    proposedCommonNationalCode: 'CNMC-CBL-2.5-4C',
    mappedCodes: [
      { cpse: 'CPSE-A', code: 'CABLE501' },
      { cpse: 'CPSE-E', code: '456-CABLE' },
    ],
    aiAssessment: 'Potentially Equivalent',
    aiAssessmentReason:
      'Descriptions and technical attributes indicate a high degree of similarity. Expert validation is recommended before standardization.',
  },
  MOTOR: {
    standardizedDescription: '1 HP 3-PHASE INDUCTION MOTOR 1400 RPM',
    standardCategory: 'MOTOR',
    standardSpecification: {
      material: 'Aluminium',
      diameter: '1 HP',
      length: '1400 RPM',
    },
    proposedCommonNationalCode: 'CNMC-MTR-1HP',
    mappedCodes: [
      { cpse: 'CPSE-B', code: 'MTR100' },
      { cpse: 'CPSE-C', code: 'MT-01HP' },
    ],
    aiAssessment: 'Potentially Equivalent',
    aiAssessmentReason:
      'Descriptions and technical attributes indicate a high degree of similarity. Expert validation is recommended before standardization.',
  },
  GASKET: {
    standardizedDescription: 'SPIRAL WOUND GASKET 50MM SS316',
    standardCategory: 'GASKET',
    standardSpecification: {
      material: 'SS316',
      diameter: '50mm',
      length: '',
    },
    proposedCommonNationalCode: 'CNMC-GSK-50',
    mappedCodes: [
      { cpse: 'CPSE-A', code: 'GASKET201' },
      { cpse: 'CPSE-D', code: 'SG-50-SS' },
    ],
    aiAssessment: 'Potentially Equivalent',
    aiAssessmentReason:
      'Descriptions and technical attributes indicate a high degree of similarity. Expert validation is recommended before standardization.',
  },
  PIPE: {
    standardizedDescription: 'SEAMLESS MS BLACK PIPE 50NB',
    standardCategory: 'PIPE',
    standardSpecification: {
      material: 'MS',
      diameter: '50 NB',
      length: '2mm wall',
    },
    proposedCommonNationalCode: 'CNMC-PIP-50NB',
    mappedCodes: [
      { cpse: 'CPSE-A', code: 'PIPE100' },
      { cpse: 'CPSE-E', code: 'SP-50NB' },
    ],
    aiAssessment: 'Potentially Equivalent',
    aiAssessmentReason:
      'Descriptions and technical attributes indicate a high degree of similarity. Expert validation is recommended before standardization.',
  },
  ELECTRICAL: {
    standardizedDescription: 'CONTACTOR 3RT2015 3-PHASE 14A 24V DC',
    standardCategory: 'ELECTRICAL COMPONENTS',
    standardSpecification: {
      material: '3RT2015',
      diameter: '3 Phase',
      length: '14A',
    },
    proposedCommonNationalCode: 'CNMC-ELC-3RT2015',
    mappedCodes: [
      { cpse: 'CPSE-B', code: 'EL-001' },
      { cpse: 'CPSE-E', code: 'CON-3RT' },
    ],
    aiAssessment: 'Potentially Equivalent',
    aiAssessmentReason:
      'Descriptions and technical attributes indicate a high degree of similarity. Expert validation is recommended before standardization.',
  },
  NUT: {
    standardizedDescription: 'HEX NUT M12 SS304',
    standardCategory: 'NUT',
    standardSpecification: {
      material: 'SS304',
      diameter: 'M12',
      length: '',
    },
    proposedCommonNationalCode: 'CNMC-NUT-M12',
    mappedCodes: [{ cpse: 'CPSE-C', code: 'NUT123' }],
    aiAssessment: 'Potentially Equivalent',
    aiAssessmentReason:
      'Descriptions and technical attributes indicate a high degree of similarity. Expert validation is recommended before standardization.',
  },
}

export function getRecommendationForMaterial(material: Material): StandardizationRecommendation | null {
  if (!material.matchType || material.matchType === 'unique') return null

  for (const [key, group] of Object.entries(RECOMMENDATION_GROUPS)) {
    if (group.some((m) => m.id === material.id)) {
      return RECOMMENDATIONS[key] || null
    }
  }
  return null
}

export function getMatchResults(material: Material): MatchResult[] {
  const group = Object.values(RECOMMENDATION_GROUPS).find(
    (g) => material.matchType && g.some((m) => m.id === material.id),
  )
  if (!group) return []

  return group
    .filter((m) => m.id !== material.id)
    .map((m) => ({
      material: m,
      score: m.similarity || 0,
      descriptionSimilarity: m.similarity ? m.similarity - 1 : 95,
      specificationMatch: 100,
      technicalAttributes: m.similarity ? m.similarity - 1 : 93,
      uomCompatibility: 100,
      matchType: m.matchType || 'near-duplicate',
      recommendation: 'Potential Match',
    }))
}

export const MATCH_STEPS = [
  { label: 'Normalizing material description', sublabel: 'Parsing and cleaning input text...' },
  { label: 'Extracting technical attributes', sublabel: 'Identifying grade, size, dimensions...' },
  { label: 'Comparing semantic similarity', sublabel: 'Running vector-based similarity analysis...' },
  { label: 'Checking specification compatibility', sublabel: 'Verifying technical parameter alignment...' },
  { label: 'Detecting duplicates', sublabel: 'Cross-referencing existing material database...' },
  { label: 'Generating recommendations', sublabel: 'Scoring and ranking potential matches...' },
]

export const INITIAL_AUDIT_ENTRIES: AuditEntry[] = [
  {
    id: 'audit-1',
    dateTime: '17 Sep 2026, 09:30 AM',
    user: 'AI Engine',
    cpse: 'CPSE-A',
    materialCode: 'BOLT101',
    action: 'AI Recommendation Generated',
    previousValue: '-',
    newValue: 'CNMC-FST-M10-050 — STAINLESS STEEL HEX BOLT M10 X 50 MM',
    status: 'approved',
    comment: 'Semantic and technical attribute analysis completed',
  },
  {
    id: 'audit-2',
    dateTime: '17 Sep 2026, 09:32 AM',
    user: 'Admin User',
    cpse: 'CPSE-A',
    materialCode: 'BOLT101',
    action: 'Standardized Description',
    previousValue: 'SS Bolt M10x50',
    newValue: 'STAINLESS STEEL HEX BOLT M10 X 50 MM',
    status: 'approved',
  },
  {
    id: 'audit-3',
    dateTime: '17 Sep 2026, 09:35 AM',
    user: 'Admin User',
    cpse: 'CPSE-B',
    materialCode: '45678',
    action: 'Standardized Description',
    previousValue: 'Stainless Steel Bolt 10mm x 50mm',
    newValue: 'STAINLESS STEEL HEX BOLT M10 X 50 MM',
    status: 'approved',
  },
  {
    id: 'audit-4',
    dateTime: '17 Sep 2026, 09:31 AM',
    user: 'Admin User',
    cpse: 'CPSE-C',
    materialCode: 'B55',
    action: 'Standardized Description',
    previousValue: 'SS BOLT 10MM X 50MM',
    newValue: 'STAINLESS STEEL HEX BOLT M10 X 50 MM',
    status: 'approved',
  },
  {
    id: 'audit-5',
    dateTime: '17 Sep 2026, 14:30',
    user: 'AI Engine',
    cpse: 'CPSE-A',
    materialCode: 'BOLT101',
    action: 'Recommendation Generated',
    previousValue: 'Pending',
    newValue: 'Recommendation Generated - CNMC-FST-M10-050',
    status: 'approved',
  },
  {
    id: 'audit-6',
    dateTime: '17 Sep 2026, 14:31',
    user: 'Technical Reviewer',
    cpse: 'CPSE-A',
    materialCode: 'BOLT101',
    action: 'AI Recommendation Approved',
    previousValue: 'Pending Review',
    newValue: 'Approved - CNMC-FST-M10-050',
    status: 'approved',
  },
  {
    id: 'audit-7',
    dateTime: '17 Sep 2026, 14:32',
    user: 'Admin User',
    cpse: 'CPSE-A',
    materialCode: 'BOLT101',
    action: 'Material Standardized',
    previousValue: 'Pending',
    newValue: 'Standardized - CNMC-FST-M10-050',
    status: 'approved',
  },
]

export function getMatchTypeColor(matchType: MatchType | undefined): string {
  switch (matchType) {
    case 'identical':
      return 'success'
    case 'near-duplicate':
      return 'warning'
    case 'duplicate':
      return 'danger'
    case 'potential-duplicate':
      return 'primary'
    case 'equivalent':
      return 'primary'
    case 'unique':
      return 'grey'
    default:
      return 'grey'
  }
}

export const CNMC_GROUPS: Record<string, CNMCGroup> = Object.fromEntries(
  Object.entries(RECOMMENDATION_GROUPS).map(([key, group]) => {
    const rec = RECOMMENDATIONS[key.toUpperCase()]
    return [
      key,
      {
        groupKey: key,
        commonNationalCode: rec.proposedCommonNationalCode,
        standardizedDescription: rec.standardizedDescription,
        standardCategory: rec.standardCategory,
        specification: rec.standardSpecification,
        mappedMaterials: group,
        mappedCodes: rec.mappedCodes,
        status: 'pending' as const,
        aiAssessment: rec.aiAssessment!,
        aiAssessmentReason: rec.aiAssessmentReason!,
      } as CNMCGroup,
    ]
  }),
)

export const getCNMCByCode = (code: string): CNMCGroup | undefined => {
  const allGroups = Object.values(CNMC_GROUPS)
  if (allGroups.some((g) => g.commonNationalCode === code)) {
    return allGroups.find((g) => g.commonNationalCode === code)
  }
  const group = Object.values(RECOMMENDATION_GROUPS).find(
    (g) => g.some((m) => m.materialCode === code),
  )
  if (group) {
    const groupKey = Object.entries(RECOMMENDATION_GROUPS).find(([, g]) =>
      g.some((m) => m.materialCode === code),
    )?.[0]
    if (groupKey) return CNMC_GROUPS[groupKey]
  }
  return undefined
}

export const VALIDATION_QUEUE_ITEMS: ValidationQueueItem[] = Object.entries(
  RECOMMENDATION_GROUPS,
).map(([key, group]) => {
  const rec = RECOMMENDATIONS[key.toUpperCase()]
  const primaryMaterial = group.find((m) => m.matchType && m.matchType !== 'unique') || group[0]
  const avgConfidence = Math.round(
    group.reduce((sum, m) => sum + (m.similarity || 0), 0) / group.length,
  )
  return {
    id: `val-${key}-${primaryMaterial.id}`,
    material: primaryMaterial,
    recommendation: rec,
    matchType: primaryMaterial.matchType || 'potential-duplicate',
    confidence: avgConfidence,
    date: '17 Sep 2026',
    status: 'pending' as const,
    groupKey: key,
  }
})

export const DEMO_STEPS: DemoStep[] = [
  {
    step: 1,
    title: 'Open Material Master',
    description: 'Navigate to the Material Master page from the sidebar',
    targetPage: '/material-master',
    hint: 'Use the left sidebar to navigate to Material Master',
  },
  {
    step: 2,
    title: 'Search BOLT101',
    description: 'Search for "BOLT101" in the Material Master table',
    targetPage: '/material-master',
    hint: 'Use the search bar above the table and type "BOLT101"',
  },
  {
    step: 3,
    title: 'Select Material',
    description: 'Click "View" on the BOLT101 row to open material details',
    targetPage: '/material-master',
    hint: 'Click the "View" button in the Action column',
  },
  {
    step: 4,
    title: 'Run AI Matching',
    description: 'Click "Compare in AI Matching" to start the AI matching workflow',
    targetPage: '/ai-matching',
    hint: 'The AI matching page will auto-select the BOLT101 material',
  },
  {
    step: 5,
    title: 'Find Similar Materials',
    description: 'Click "Find Similar Materials" to trigger AI analysis',
    targetPage: '/ai-matching',
    hint: 'Watch the AI processing animation as it analyzes the material',
  },
  {
    step: 6,
    title: 'Review Match Results',
    description: 'Review the 96% match result for CPSE-B material 45678',
    targetPage: '/ai-matching',
    hint: 'Review the similarity scores in the match result card',
  },
  {
    step: 7,
    title: 'Compare Materials',
    description: 'Click "View Comparison" to see side-by-side technical comparison',
    targetPage: '/ai-matching',
    hint: 'Compare material attributes and view the match score breakdown',
  },
  {
    step: 8,
    title: 'Generate Standardization',
    description: 'Click "Generate Standardization Recommendation" to create CNMC',
    targetPage: '/ai-matching',
    hint: 'The AI will propose CNMC-FST-M10-050 for the standardized bolt',
  },
  {
    step: 9,
    title: 'Send for Validation',
    description: 'Click "Send for Expert Validation" to queue the recommendation',
    targetPage: '/ai-matching',
    hint: 'The recommendation will be sent to the Validation Queue',
  },
  {
    step: 10,
    title: 'Approve Recommendation',
    description: 'Go to Validation Queue, review and click "Approve"',
    targetPage: '/validation',
    hint: 'Click Review, then Confirm Approval to create the CNMC',
  },
  {
    step: 11,
    title: 'View National Code',
    description: 'Navigate to National Code page to see the mapping',
    targetPage: '/national-code',
    hint: 'Search for CNMC-FST-M10-050 to see all mapped CPSE codes',
  },
  {
    step: 12,
    title: 'View Audit Trail',
    description: 'Check the Audit Trail for the complete approval record',
    targetPage: '/audit-trail',
    hint: 'View the timeline of events from analysis to approval',
  },
]
