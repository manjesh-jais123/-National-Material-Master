import { useState, useMemo } from 'react'
import { Download } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import { CPS_ES } from '../data/materials'
import { StatusBadge } from '../components/StatusBadge'
import { EmptyState } from '../components/EmptyState'
import type { ValidationStatus } from '../types'

type AuditFilters = {
  search: string
  cpse: string
  dateFrom: string
  dateTo: string
  status: string
}

export function AuditTrail() {
  const { auditTrail } = useAppContext()
  const [filters, setFilters] = useState<AuditFilters>({
    search: '',
    cpse: '',
    dateFrom: '',
    dateTo: '',
    status: '',
  })

  const statusOptions = [
    { value: 'approved', label: 'Approved' },
    { value: 'modified', label: 'Modified' },
    { value: 'rejected', label: 'Rejected' },
  ]

  const filteredAudit = useMemo(() => {
    return auditTrail.filter((entry) => {
      const matchesSearch =
        !filters.search ||
        entry.materialCode.toLowerCase().includes(filters.search.toLowerCase()) ||
        entry.action.toLowerCase().includes(filters.search.toLowerCase()) ||
        entry.user.toLowerCase().includes(filters.search.toLowerCase())

      const matchesCpse = !filters.cpse || entry.cpse === filters.cpse
      const matchesStatus = !filters.status || entry.status === filters.status

      return matchesSearch && matchesCpse && matchesStatus
    })
  }, [auditTrail, filters])

  const recentActivity = useMemo(() => {
    return filteredAudit.slice(0, 8)
  }, [filteredAudit])

  const handleExport = () => {
    const csv = [
      ['Date & Time', 'User', 'CPSE', 'Material Code', 'Action', 'Previous Value', 'New Value', 'Status'],
      ...filteredAudit.map((entry) => [
        entry.dateTime,
        entry.user,
        entry.cpse,
        entry.materialCode,
        entry.action,
        entry.previousValue,
        entry.newValue,
        entry.status,
      ]),
    ]
    const csvContent = csv
      .map((row) => row.map((v) => `"${v}"`).join(','))
      .join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'audit-trail.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const statusBadgeConfig: Record<string, string> = {
    approved: 'status-badge-approved',
    modified: 'status-badge-modified',
    rejected: 'status-badge-rejected',
  }

  const getActionIcon = (action: string) => {
    if (action.toLowerCase().includes('approved')) return '✓'
    if (action.toLowerCase().includes('modified')) return '✎'
    if (action.toLowerCase().includes('rejected')) return '✕'
    return '•'
  }

  const getUserIcon = (user: string) => {
    if (user === 'AI Engine') {
      return <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-100">🤖</span>
    }
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-100 text-xs text-primary-700">
        AU
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-grey-800">Audit Trail</h1>
          <p className="mt-1 text-sm text-grey-500">
            Comprehensive record of all standardization actions and material changes.
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 rounded-md border border-grey-300 bg-white px-3 py-1 text-sm font-medium text-grey-700 hover:bg-grey-50"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search by action, code, or user..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="w-full rounded-md border border-grey-300 px-3 py-1 text-sm text-grey-800 placeholder-grey-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:max-w-xs"
        />
        <select
          value={filters.cpse || ''}
          onChange={(e) => setFilters({ ...filters, cpse: e.target.value || '' })}
          className="rounded-md border border-grey-300 bg-white px-2 py-1 text-sm text-grey-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="">All CPSEs</option>
          {CPS_ES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code}
            </option>
          ))}
        </select>
        <select
          value={filters.status || ''}
          onChange={(e) => setFilters({ ...filters, status: e.target.value || '' })}
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

      {recentActivity.length > 0 && (
        <div className="rounded-lg border border-grey-200 bg-white p-5 shadow-card">
          <h3 className="mb-4 text-sm font-semibold text-grey-800">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((entry, index) => (
              <div key={entry.id} className="relative pl-6">
                {index < recentActivity.length - 1 && (
                  <div className="absolute bottom-0 left-[9px] top-4 w-px bg-grey-200" />
                )}
                <div className="relative flex gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-50">
                    {getActionIcon(entry.action)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-grey-800">{entry.action}</span>
                      <StatusBadge status={entry.status as ValidationStatus} dot />
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-xs text-grey-500">
                      <div className="flex items-center gap-1">
                        {getUserIcon(entry.user)}
                        <span>{entry.user}</span>
                      </div>
                      <span>{entry.cpse}</span>
                      <span className="font-mono">{entry.materialCode}</span>
                      <span>•</span>
                      <span>{entry.dateTime}</span>
                    </div>
                    {entry.previousValue && entry.previousValue !== '-' && (
                      <div className="mt-1 text-xs text-grey-600">
                        <span className="font-medium">Previous:</span> {entry.previousValue}
                      </div>
                    )}
                    {entry.newValue && entry.newValue !== '-' && (
                      <div className="text-xs text-grey-700">
                        <span className="font-medium">New:</span> {entry.newValue}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-grey-200 bg-white">
        <table className="w-full table-fixed border-collapse text-sm">
          <thead>
            <tr className="border-b border-grey-200 bg-grey-50">
              <th className="table-header-cell">Date &amp; Time</th>
              <th className="table-header-cell">User</th>
              <th className="table-header-cell">CPSE</th>
              <th className="table-header-cell">Material Code</th>
              <th className="table-header-cell">Action</th>
              <th className="table-header-cell">Previous Value</th>
              <th className="table-header-cell">New Value</th>
              <th className="table-header-cell">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAudit.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8">
                  <EmptyState
                    title="No audit entries found"
                    description="Try adjusting your search or filter criteria."
                    fullHeight={false}
                  />
                </td>
              </tr>
            ) : (
              filteredAudit.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b border-grey-100 last:border-0 transition-colors hover:bg-grey-25"
                >
                  <td className="table-cell whitespace-nowrap text-xs text-grey-600">
                    {entry.dateTime}
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      {getUserIcon(entry.user)}
                      <span className="text-sm text-grey-800">{entry.user}</span>
                    </div>
                  </td>
                  <td className="table-cell">{entry.cpse}</td>
                  <td className="table-cell">
                    <span className="font-medium text-grey-800">{entry.materialCode}</span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`flex h-5 w-5 items-center justify-center text-xs ${
                          entry.status === 'approved'
                            ? 'text-success-600'
                            : entry.status === 'modified'
                            ? 'text-primary-600'
                            : 'text-danger-600'
                        }`}
                      >
                        {getActionIcon(entry.action)}
                      </span>
                      <span className="font-medium text-grey-800">{entry.action}</span>
                    </div>
                  </td>
                  <td className="table-cell max-w-xs truncate text-xs text-grey-600">
                    {entry.previousValue || '-'}
                  </td>
                  <td className="table-cell max-w-xs truncate text-xs text-grey-700">
                    {entry.newValue || '-'}
                  </td>
                  <td className="table-cell">
                    <span
                      className={`status-badge ${statusBadgeConfig[entry.status] || 'status-badge-pending'}`}
                    >
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between text-sm text-grey-500">
        <span>Total entries: {filteredAudit.length}</span>
        <span>Showing all results</span>
      </div>
    </div>
  )
}
