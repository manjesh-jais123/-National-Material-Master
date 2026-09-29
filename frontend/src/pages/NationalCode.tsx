import { useState, useMemo } from 'react'
import { Hash, Search } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import { NationalCodeRelationship } from '../components/NationalCodeRelationship'
import { EmptyState } from '../components/EmptyState'
import { StatusBadge } from '../components/StatusBadge'

import type { NationalCodeEntry } from '../types'

export function NationalCode() {
  const { nationalCodes, approvedMaterials, cnmcGroups } = useAppContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCNMC, setSelectedCNMC] = useState<NationalCodeEntry | null>(null)

  const allNationalCodes = useMemo(() => {
    const combined: NationalCodeEntry[] = [...nationalCodes]

    approvedMaterials
      .filter((m) => m.commonNationalCode)
      .forEach((m) => {
        const existing = combined.find((nc) => nc.code === m.commonNationalCode)
        if (!existing) {
          combined.push({
            code: m.commonNationalCode!,
            description: m.description,
            category: m.category,
            specification: m.specification,
            uom: m.uom,
            mappedCPSEs: 1,
            existingCodes: [m.materialCode],
            approvalStatus: 'Approved',
            materialIds: [m.id],
            groupKey: '',
            createdBy: 'System',
            createdAt: '',
          })
        }
      })

    return combined
  }, [nationalCodes, approvedMaterials])

  const filteredCodes = allNationalCodes.filter(
    (nc) =>
      nc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nc.existingCodes.some((code) => code.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleViewRelationship = (nc: NationalCodeEntry) => {
    setSelectedCNMC(nc)
  }

  const handleCloseRelationship = () => {
    setSelectedCNMC(null)
  }

  if (selectedCNMC) {
    const cnmcGroup = cnmcGroups[selectedCNMC.groupKey]
    if (cnmcGroup) {
      return (
        <div className="space-y-6">
          <div className="mb-2 flex items-center gap-3">
            <button
              onClick={handleCloseRelationship}
              className="rounded-md border border-grey-300 bg-white px-2 py-1 text-sm font-medium text-grey-700 hover:bg-grey-50"
            >
              ← Back to List
            </button>
            <h1 className="text-2xl font-semibold text-grey-800">National Code Details</h1>
          </div>
          <NationalCodeRelationship cnmcGroup={cnmcGroup} />
        </div>
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-semibold text-grey-800">Common National Material Codes</h1>
        <p className="mt-1 text-sm text-grey-500">
          Standardized material codes harmonized across all connected CPSEs.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-grey-400" />
          <input
            type="text"
            placeholder="Search by CNMC, description, or existing codes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-grey-300 pl-9 pr-3 py-1 text-sm text-grey-800 placeholder-grey-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
        <span className="text-sm text-grey-500">{filteredCodes.length} codes found</span>
      </div>

      <div className="overflow-x-auto rounded-md border border-grey-200 bg-white">
        <table className="w-full table-fixed border-collapse text-sm">
          <thead>
            <tr className="border-b border-grey-200 bg-grey-50">
              <th className="table-header-cell">Common National Code</th>
              <th className="table-header-cell">Standard Description</th>
              <th className="table-header-cell">Category</th>
              <th className="table-header-cell">Specification</th>
              <th className="table-header-cell">UOM</th>
              <th className="table-header-cell">Mapped CPSEs</th>
              <th className="table-header-cell">Existing Codes</th>
              <th className="table-header-cell">Approval Status</th>
              <th className="table-header-cell text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCodes.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8">
                  <EmptyState
                    title="No national codes found"
                    description={searchTerm
                      ? 'Try adjusting your search.'
                      : 'Approve recommendations from the AI Matching page to create codes.'}
                    fullHeight={false}
                  />
                </td>
              </tr>
            ) : (
              filteredCodes.map((nc) => (
                <tr
                  key={nc.code}
                  className="border-b border-grey-100 last:border-0 transition-colors hover:bg-grey-25"
                >
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-grey-400" />
                      <span className="font-mono font-medium text-primary-600">{nc.code}</span>
                    </div>
                  </td>
                  <td className="table-cell">{nc.description}</td>
                  <td className="table-cell">{nc.category}</td>
                  <td className="table-cell">{nc.specification}</td>
                  <td className="table-cell">{nc.uom || '-'}</td>
                  <td className="table-cell">
                    <div className="flex flex-wrap gap-1">
                      <span className="inline-flex items-center rounded-md bg-primary-100 px-2 py-[3px] text-xs font-medium text-primary-700">
                        {nc.mappedCPSEs}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex flex-col gap-0.5">
                      {nc.existingCodes.map((code) => (
                        <span key={code} className="font-mono text-xs text-grey-700">
                          {code}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="table-cell">
                    <StatusBadge
                      status={nc.approvalStatus === 'Approved' ? 'approved' : 'pending'}
                      dot
                    />
                  </td>
                  <td className="table-cell text-center">
                    <button
                      onClick={() => handleViewRelationship(nc)}
                      disabled={!cnmcGroups[nc.groupKey]}
                      className="rounded-md bg-primary-700 px-3 py-1 text-xs font-medium text-white hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      View Mapping
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
