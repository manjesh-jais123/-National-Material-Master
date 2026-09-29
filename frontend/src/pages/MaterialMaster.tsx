import { useState, useMemo } from 'react'
import { MaterialDrawer } from '../components/MaterialDrawer'
import { MatchBadge, StatusBadge, SimilarityScore } from '../components/StatusBadge'
import { EmptyState } from '../components/EmptyState'
import { useAppContext } from '../context/AppContext'
import { FilterSelect } from '../components/SearchBar'
import { useNavigate, useLocation } from 'react-router-dom'
import { CATEGORIES, CPS_ES } from '../data/materials'
import type { Material } from '../types'

export function MaterialMaster() {
  const { materials } = useAppContext()
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState('')
  const [cpseFilter, setCpseFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [matchTypeFilter, setMatchTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(() => {
    const highlightId = location.state?.highlightId as string | undefined
    if (highlightId) {
      return materials.find((m) => m.id === highlightId) || null
    }
    return null
  })
  const pageSize = 15
  const navigate = useNavigate()

  const filteredData = useMemo(() => {
    return materials.filter((m) => {
      const matchesSearch =
        !searchTerm ||
        m.materialCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.specification.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.cpse.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.commonNationalCode || '').toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCpse = !cpseFilter || m.cpse === cpseFilter
      const matchesCategory = !categoryFilter || m.category === categoryFilter
      const matchesMatchType = !matchTypeFilter || m.matchType === matchTypeFilter
      const matchesStatus = !statusFilter || m.status === statusFilter
      return matchesSearch && matchesCpse && matchesCategory && matchesMatchType && matchesStatus
    })
  }, [materials, searchTerm, cpseFilter, categoryFilter, matchTypeFilter, statusFilter])

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredData.slice(startIndex, startIndex + pageSize)
  }, [filteredData, currentPage, pageSize])

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize))

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('ellipsis')
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i)
      }
      if (currentPage < totalPages - 2) pages.push('ellipsis')
      if (totalPages > 1) pages.push(totalPages)
    }
    return pages
  }

  const matchTypeOptions = [
    { value: 'identical', label: 'Identical' },
    { value: 'near-duplicate', label: 'Near-Duplicate' },
    { value: 'duplicate', label: 'Duplicate' },
    { value: 'potential-duplicate', label: 'Potential Duplicate' },
    { value: 'equivalent', label: 'Equivalent' },
    { value: 'unique', label: 'Unique' },
  ]

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'modified', label: 'Modified' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'standardized', label: 'Standardized' },
  ]

  const handleExport = () => {
    const csv = [
      ['CPSE', 'Material Code', 'Description', 'Category', 'Specification', 'UOM', 'Match Type', 'Similarity', 'CNMC', 'Status'],
      ...filteredData.map((m) => [
        m.cpse,
        m.materialCode,
        m.description,
        m.category,
        m.specification,
        m.uom,
        m.matchType || '',
        m.similarity?.toString() || '',
        m.commonNationalCode || '',
        m.status,
      ]),
    ]
    const csvContent = csv.map((row) => row.map((v) => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'material-master.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleView = (row: Material, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedMaterial(row)
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-grey-800">Material Master</h1>
        <p className="mt-1 text-sm text-grey-500">
          Searchable database of materials across all CPSEs
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 rounded-md border border-grey-300 px-3 py-1 text-sm text-grey-800 placeholder-grey-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <FilterSelect
            label=""
            placeholder="All CPSEs"
            value={cpseFilter}
            options={CPS_ES.map((c) => ({ value: c.code, label: c.code }))}
            onChange={setCpseFilter}
          />
          <FilterSelect
            label=""
            placeholder="All Categories"
            value={categoryFilter}
            options={CATEGORIES.map((c) => ({ value: c.name, label: c.name }))}
            onChange={setCategoryFilter}
          />
          <FilterSelect
            label=""
            placeholder="All Match Types"
            value={matchTypeFilter}
            options={matchTypeOptions}
            onChange={setMatchTypeFilter}
          />
          <FilterSelect
            label=""
            placeholder="All Statuses"
            value={statusFilter}
            options={statusOptions}
            onChange={setStatusFilter}
          />
        </div>
        <button
          onClick={handleExport}
          className="rounded-md border border-grey-300 bg-white px-3 py-1 text-sm font-medium text-grey-700 hover:bg-grey-50"
        >
          Export
        </button>
      </div>

      <div className="overflow-x-auto rounded-md border border-grey-200 bg-white">
        <table className="w-full table-fixed border-collapse text-sm">
          <thead>
            <tr className="border-b border-grey-200 bg-grey-50">
              <th className="table-header-cell">CPSE</th>
              <th className="table-header-cell">Material Code</th>
              <th className="table-header-cell">Description</th>
              <th className="table-header-cell">Category</th>
              <th className="table-header-cell">Specification</th>
              <th className="table-header-cell">UOM</th>
              <th className="table-header-cell">Match Type</th>
              <th className="table-header-cell">Similarity</th>
              <th className="table-header-cell">CNMC</th>
              <th className="table-header-cell">Status</th>
              <th className="table-header-cell text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-8">
                  <EmptyState
                    title="No materials found"
                    description="Try changing your filters or search query."
                    fullHeight={false}
                  />
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-grey-100 last:border-0 transition-colors hover:bg-grey-25"
                >
                  <td className="table-cell">{row.cpse}</td>
                  <td className="table-cell font-medium text-grey-800">{row.materialCode}</td>
                  <td className="table-cell">{row.description}</td>
                  <td className="table-cell">{row.category}</td>
                  <td className="table-cell">{row.specification}</td>
                  <td className="table-cell">{row.uom}</td>
                  <td className="table-cell">
                    <MatchBadge matchType={row.matchType} />
                  </td>
                  <td className="table-cell">
                    {row.similarity !== undefined ? (
                      <SimilarityScore score={row.similarity} showLabel={false} />
                    ) : (
                      <span className="text-xs text-grey-400">-</span>
                    )}
                  </td>
                  <td className="table-cell font-mono text-xs text-primary-600">
                    {row.commonNationalCode || '-'}
                  </td>
                  <td className="table-cell">
                    <StatusBadge status={row.status} dot />
                  </td>
                  <td className="table-cell text-center">
                    <button
                      onClick={(e) => handleView(row, e)}
                      className="rounded-md bg-primary-700 px-3 py-1 text-xs font-medium text-white hover:bg-primary-800"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filteredData.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-grey-500">
            Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-md border border-grey-300 bg-white p-1 text-grey-600 hover:bg-grey-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ←
            </button>
            {getPageNumbers().map((page, idx) =>
              page === 'ellipsis' ? (
                <span key={`ellipsis-${idx}`} className="px-1 text-xs text-grey-400">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page as number)}
                  className={`h-7 w-7 rounded-md text-sm font-medium ${
                    currentPage === page
                      ? 'bg-primary-700 text-white'
                      : 'border border-grey-300 bg-white text-grey-600 hover:bg-grey-50'
                  }`}
                >
                  {page}
                </button>
              ),
            )}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-md border border-grey-300 bg-white p-1 text-grey-600 hover:bg-grey-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              →
            </button>
          </div>
        </div>
      )}

      <MaterialDrawer
        material={selectedMaterial}
        isOpen={!!selectedMaterial}
        onClose={() => setSelectedMaterial(null)}
        onCompare={(m) => {
          setSelectedMaterial(null)
          navigate('/ai-matching', { state: { fromMaterialId: m.id } })
        }}
      />
    </div>
  )
}
