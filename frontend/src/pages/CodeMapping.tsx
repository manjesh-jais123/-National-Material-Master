import { useState, useMemo } from 'react'
import { GitMerge, Search, ArrowRight } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

export function CodeMapping() {
  const location = useLocation()
  const { nationalCodes: ctxCodes, materials, approvedMaterials } = useAppContext()
  const initialSearch = (location.state as any)?.searchCode || ''
  const [searchTerm, setSearchTerm] = useState(initialSearch)

  const allNationalCodes = useMemo(
    () => [
      ...ctxCodes,
      ...(approvedMaterials
        .filter((m) => m.commonNationalCode)
        .reduce((acc, m) => {
          const existing = acc.find((nc) => nc.code === m.commonNationalCode)
          if (!existing) {
                       acc.push({
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
          return acc
        }, [] as typeof ctxCodes)),
    ],
    [ctxCodes, approvedMaterials],
  )

  const filteredMapping = useMemo(() => {
    if (!searchTerm.trim()) return allNationalCodes

    const q = searchTerm.toLowerCase().trim()
    const byCNMC = allNationalCodes.filter((nc) => nc.code.toLowerCase().includes(q))
    const byCPSECode = allNationalCodes.filter((nc) =>
      nc.existingCodes.some((code) => code.toLowerCase().includes(q))
    )

    return [...new Set([...byCNMC, ...byCPSECode])]
  }, [searchTerm, allNationalCodes])

  const getCPSEFromCode = (code: string) => {
    const mat = materials.find((m) => m.materialCode === code)
    return mat?.cpse || 'Unknown'
  }

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-semibold text-grey-800">Code Mapping</h1>
        <p className="mt-1 text-sm text-grey-500">
          Visual mapping between Common National Codes and existing CPSE material codes.
        </p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-grey-400" />
          </div>
          <input
            type="text"
            placeholder="Search by CPSE Material Code or Common National Code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-grey-300 pl-9 pr-3 py-1 text-sm text-grey-800 placeholder-grey-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="space-y-6">
        {filteredMapping.length === 0 ? (
          <div className="rounded-lg border border-grey-200 bg-white p-8 text-center shadow-card">
            <GitMerge className="mx-auto h-12 w-12 text-grey-300" />
            <p className="mt-2 text-sm text-grey-500">
              {searchTerm ? 'No matching codes found' : 'No code mappings available. Approve recommendations to create mappings.'}
            </p>
          </div>
        ) : (
          filteredMapping.map((nc) => {
            return (
              <div
                key={nc.code}
                className="rounded-lg border border-grey-200 bg-white p-5 shadow-card"
              >
                <div className="flex items-center justify-center py-4">
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-medium text-grey-500">COMMON NATIONAL CODE</span>
                    <div className="my-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <GitMerge className="h-5 w-5 text-primary-600" />
                        <span className="font-mono text-xl font-bold text-primary-700">
                          {nc.code}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-medium text-grey-800">{nc.description}</p>
                    </div>

                    <div className="py-2">
                      <ArrowRight className="h-5 w-5 text-grey-400" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      {nc.existingCodes.map((code) => {
                        const cpse = getCPSEFromCode(code)
                        const mat = materials.find((m) => m.materialCode === code)
                        return (
                          <div
                            key={code}
                            className="flex flex-col items-center rounded-md border border-grey-200 p-4"
                          >
                            <span className="text-xs font-medium text-grey-500">{cpse}</span>
                            <span className="my-1 font-mono text-sm font-semibold text-grey-800">
                              {code}
                            </span>
                            {mat && (
                              <span className="text-xs text-grey-500 text-center">
                                {mat.description}
                              </span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
