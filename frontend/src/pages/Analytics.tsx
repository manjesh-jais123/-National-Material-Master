import { ChartCard } from '../components/ChartCard'
import { KPICard } from '../components/KPICard'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts'
import {
  KPI_DATA,
  DUPLICATE_BY_CPSE,
  MATCH_CONFIDENCE_DISTRIBUTION,
  VALIDATION_TREND,
} from '../data/materials'
import { useAppContext } from '../context/AppContext'
import { useMemo } from 'react'

const CATEGORY_STANDARDIZATION = [
  { category: 'Fasteners', standardized: 85, pending: 15 },
  { category: 'Bearings', standardized: 72, pending: 28 },
  { category: 'Valves', standardized: 58, pending: 42 },
  { category: 'Pumps', standardized: 45, pending: 55 },
  { category: 'Cables', standardized: 63, pending: 37 },
  { category: 'Motors', standardized: 51, pending: 49 },
  { category: 'Gaskets', standardized: 39, pending: 61 },
  { category: 'Pipes', standardized: 87, pending: 13 },
]

const PROGRESS_DATA = [
  { month: 'Jan', progress: 12 },
  { month: 'Feb', progress: 18 },
  { month: 'Mar', progress: 25 },
  { month: 'Apr', progress: 35 },
  { month: 'May', progress: 42 },
  { month: 'Jun', progress: 58 },
  { month: 'Jul', progress: 65 },
  { month: 'Aug', progress: 74 },
  { month: 'Sep', progress: 82 },
]

export function Analytics() {
  const { materials, approvedMaterials } = useAppContext()

  const computedMetrics = useMemo(() => {
    const approved = approvedMaterials.length
    const totalInSystem = materials.length
    const pending = materials.filter((m) => m.status === 'pending').length
    const duplicates = materials.filter(
      (m) => m.matchType && ['duplicate', 'near-duplicate', 'potential-duplicate'].includes(m.matchType),
    ).length
    const equivalents = materials.filter((m) => m.matchType === 'equivalent').length
    const standardized = materials.filter((m) => m.status === 'approved' || m.status === 'standardized').length

    return {
      total: totalInSystem,
      approved,
      pending,
      duplicates,
      equivalents,
      standardized,
    }
  }, [materials, approvedMaterials])

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-semibold text-grey-800">Analytics Dashboard</h1>
        <p className="mt-1 text-sm text-grey-500">
          Material harmonization metrics and trends across all CPSEs.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KPICard
          title="Total Materials"
          value={KPI_DATA.totalMaterials.toLocaleString()}
          variant="primary"
        />
        <KPICard
          title="Standardized"
          value={computedMetrics.standardized.toLocaleString()}
          variant="success"
        />
        <KPICard
          title="Duplicate Materials"
          value={computedMetrics.duplicates.toLocaleString()}
          variant="warning"
        />
        <KPICard
          title="Equivalent Materials"
          value={computedMetrics.equivalents.toLocaleString()}
          variant="primary"
        />
        <KPICard
          title="Pending Validation"
          value={computedMetrics.pending.toLocaleString()}
          variant="warning"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard
          title="Duplicate Distribution by CPSE"
          subtitle="Potential duplicates across connected CPSEs"
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

        <ChartCard
          title="Standardization by Category"
          subtitle="Progress by material category"
        >
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={CATEGORY_STANDARDIZATION}
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                   formatter={(value: any, name: any) => [value ?? 0, name]}
                />
                <Legend />
                <Bar dataKey="standardized" name="Standardized (%)" radius={[4, 0, 0, 0]} fill="#10b981" />
                <Bar dataKey="pending" name="Pending (%)" radius={[0, 4, 4, 0]} fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Validation Trend"
          subtitle="Daily approval vs rejection rates"
        >
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={VALIDATION_TREND}
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="approved"
                  name="Approved"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="rejected"
                  name="Rejected"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Match Confidence Distribution"
          subtitle="Distribution of AI match scores"
        >
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <Pie
                  data={MATCH_CONFIDENCE_DISTRIBUTION}
                  dataKey="count"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {MATCH_CONFIDENCE_DISTRIBUTION.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={MATCH_CONFIDENCE_DISTRIBUTION[index].fill}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                   formatter={(value: any) => [value ?? 0, 'Count']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Material Harmonization Progress"
          subtitle="Cumulative progress over time"
        >
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-grey-600">Current Progress</span>
              <span className="text-xl font-bold text-grey-800">82%</span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-grey-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary-600 to-success-600 transition-all"
                style={{ width: '82%' }}
              />
            </div>
            <p className="mt-1 text-xs text-grey-500">103,220 of 125,430 materials standardized</p>
          </div>
          <div className="h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={PROGRESS_DATA}
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#6b7280' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                   formatter={(value: any) => [value ?? 0, 'Progress (%)']}
                />
                <Line
                  type="monotone"
                  dataKey="progress"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#4f46e5' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="CPSE Contribution"
          subtitle="Materials contributed by each CPSE"
        >
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={DUPLICATE_BY_CPSE}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="cpse" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                   formatter={(value: any) => [value ?? 0, 'Materials']}
                />
                <Bar dataKey="count" name="Materials" radius={[4, 4, 0, 0]} fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
