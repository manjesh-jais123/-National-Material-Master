import {
  Package,
  AlertTriangle,
  Layers,
  ClipboardCheck,
  CheckCircle,
  Building,
} from 'lucide-react'
import { KPICard } from '../components/KPICard'
import { ChartCard } from '../components/ChartCard'
import { StatusBadge, MatchBadge, SimilarityScore } from '../components/StatusBadge'
import { EmptyState } from '../components/EmptyState'
import { SkeletonLoader } from '../components/SkeletonLoader'
import { useAppContext } from '../context/AppContext'
import {
  KPI_DATA,
  DUPLICATE_BY_CPSE,
  CATEGORY_DATA,
  STANDARDIZATION_PROGRESS,
  MATCH_CONFIDENCE_DISTRIBUTION,
} from '../data/materials'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { useState, useMemo } from 'react'
import { MaterialDrawer } from '../components/MaterialDrawer'
import type { Material } from '../types'
import { useNavigate } from 'react-router-dom'

export function Dashboard() {
  const { materials, nationalCodes } = useAppContext()
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const navigate = useNavigate()

  const standardizationProgress = useMemo(() => {
    const standardized = materials.filter((m) => m.status === 'approved' || m.status === 'standardized').length
    const total = materials.length
    return total > 0 ? Math.round((standardized / total) * 100) : 0
  }, [materials])

  const recentRecommendations = useMemo(() => {
    return materials
      .filter((m) => m.matchType && m.matchType !== 'unique' && m.status === 'pending')
      .slice(0, 6)
  }, [materials])

  const handleDrawerClose = () => {
    setSelectedMaterial(null)
  }

  const handleCompare = () => {
    setSelectedMaterial(null)
    navigate('/ai-matching')
  }

  const handleRowClick = (material: Material) => {
    setSelectedMaterial(material)
  }

  const handleCardHover = (id: string) => {
    setLoadingStates((prev) => ({ ...prev, [id]: true }))
    setTimeout(() => {
      setLoadingStates((prev) => ({ ...prev, [id]: false }))
    }, 250)
  }

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-grey-800">National Material Master</h1>
        <p className="mt-1 text-sm text-grey-500">
          AI-Powered Material Standardization &amp; Harmonization Platform
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KPICard
          title="Total Materials"
          value={KPI_DATA.totalMaterials.toLocaleString()}
          icon={<Package className="h-5 w-5" />}
          variant="primary"
        />
        <KPICard
          title="Potential Duplicates"
          value={KPI_DATA.potentialDuplicates.toLocaleString()}
          icon={<AlertTriangle className="h-5 w-5" />}
          variant="warning"
        />
        <KPICard
          title="Near-Duplicates"
          value={KPI_DATA.nearDuplicates.toLocaleString()}
          icon={<Layers className="h-5 w-5" />}
          variant="primary"
        />
        <KPICard
          title="Pending Validation"
          value={KPI_DATA.pendingValidation.toLocaleString()}
          icon={<ClipboardCheck className="h-5 w-5" />}
          variant="warning"
        />
        <KPICard
          title="Standardized Materials"
          value={KPI_DATA.standardizedMaterials.toLocaleString()}
          icon={<CheckCircle className="h-5 w-5" />}
          variant="success"
        />
        <KPICard
          title="Connected CPSEs"
          value={KPI_DATA.connectedCPSEs}
          icon={<Building className="h-5 w-5" />}
          variant="primary"
        />
      </div>

      <div className="rounded-lg border border-grey-200 bg-white p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-grey-800">Material Harmonization Progress</h3>
          <span className="text-xs text-grey-500">{standardizationProgress}% Complete</span>
        </div>
        <div className="relative h-2.5 w-full rounded-full bg-grey-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-600 to-success-600 transition-all duration-500"
            style={{ width: `${standardizationProgress}%` }}
          />
        </div>
        <div className="mt-3 flex justify-between text-xs text-grey-500">
          <span>{materials.filter((m) => m.status === 'approved' || m.status === 'standardized').toLocaleString()} standardized</span>
          <span>{materials.length.toLocaleString()} total materials</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard
          title="Duplicate Materials by CPSE"
          subtitle="Potential duplicates per CPSE"
        >
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={DUPLICATE_BY_CPSE}
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="cpse" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                   formatter={(value: any) => [value ?? 0, 'Duplicates']}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {DUPLICATE_BY_CPSE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Material Categories" subtitle="Distribution by category">
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <Pie
                  data={CATEGORY_DATA}
                  dataKey="count"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {CATEGORY_DATA.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`hsl(${(index * 45) % 360}, 70%, 50%)`}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                   formatter={(value: any) => [(value ?? 0).toLocaleString(), 'Materials']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Match Confidence Distribution"
          subtitle="AI match score distribution"
        >
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={MATCH_CONFIDENCE_DISTRIBUTION}
                margin={{ top: 5, right: 30, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                   formatter={(value: any) => [value ?? 0, 'Count']}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {MATCH_CONFIDENCE_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Standardization Progress" subtitle="Total materials by status">
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={STANDARDIZATION_PROGRESS}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#374151' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                   formatter={(value: any) => [(value ?? 0).toLocaleString(), 'Materials']}
                />
                <Legend />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {STANDARDIZATION_PROGRESS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="rounded-lg border border-grey-200 bg-white p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-grey-800">Recent AI Recommendations</h3>
          <button
            onClick={() => navigate('/ai-matching')}
            className="text-xs font-medium text-primary-600 hover:text-primary-800"
          >
            View all
          </button>
        </div>

        <div className="overflow-x-auto">
          {recentRecommendations.length === 0 ? (
            <EmptyState
              title="No pending recommendations"
              description="All recommendations have been processed or no matches were found"
              fullHeight={false}
            />
          ) : (
            <table className="w-full table-fixed border-collapse text-sm">
              <thead>
                <tr className="border-b border-grey-200 bg-grey-50">
                  <th className="table-header-cell">Material</th>
                  <th className="table-header-cell">CPSE</th>
                  <th className="table-header-cell">Match Type</th>
                  <th className="table-header-cell">Similarity</th>
                  <th className="table-header-cell">Status</th>
                  <th className="table-header-cell">CNMC</th>
                  <th className="table-header-cell text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentRecommendations.map((material) => (
                  <tr
                    key={material.id}
                    className="border-b border-grey-100 last:border-0 transition-colors hover:bg-grey-25"
                    onMouseEnter={() => handleCardHover(material.id)}
                  >
                    <td
                      className="table-cell font-medium text-grey-800 cursor-pointer"
                      onClick={() => handleRowClick(material)}
                    >
                      {material.materialCode}
                      <div className="text-xs text-grey-500">{material.description}</div>
                    </td>
                    <td className="table-cell">{material.cpse}</td>
                    <td className="table-cell">
                      <MatchBadge matchType={material.matchType} />
                    </td>
                    <td className="table-cell">
                      {loadingStates[material.id] ? (
                        <SkeletonLoader className="h-5 w-10" />
                      ) : (
                        <SimilarityScore score={material.similarity} showLabel={false} />
                      )}
                    </td>
                    <td className="table-cell">
                      <StatusBadge status={material.status} />
                    </td>
                    <td className="table-cell font-mono text-xs text-primary-600">
                      {material.commonNationalCode || '-'}
                    </td>
                    <td className="table-cell text-center">
                      <button
                        onClick={() => navigate('/ai-matching')}
                        className="rounded-md bg-primary-700 px-3 py-1 text-xs font-medium text-white hover:bg-primary-800"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {nationalCodes.length > 0 && (
          <div className="mt-4 text-xs text-grey-500">
            {nationalCodes.length} CNMCs approved and active across {nationalCodes.reduce((sum, nc) => sum + nc.mappedCPSEs, 0)} CPSE-material mappings
          </div>
        )}
      </div>

      <MaterialDrawer
        material={selectedMaterial}
        isOpen={!!selectedMaterial}
        onClose={handleDrawerClose}
        onCompare={handleCompare}
      />
    </div>
  )
}
