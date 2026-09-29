import { useState, useMemo } from 'react'
import { X, Search, FileText, Hash, Database, Zap } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { useDebounce } from '../hooks/useDebounce'

interface GlobalSearchProps {
  isOpen: boolean
  onClose: () => void
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 200)
  const { materials, nationalCodes, cnmcGroups } = useAppContext()
  const navigate = useNavigate()

  const results = useMemo(() => {
    const q = debouncedQuery.toLowerCase().trim()
    if (!q) return { materials: [], codes: [], matchedMaterials: [], cpseCodes: [] }

    const materialResults = materials.filter((m) => {
      return (
        m.materialCode.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.specification.toLowerCase().includes(q) ||
        m.cpse.toLowerCase().includes(q) ||
        (m.commonNationalCode || '').toLowerCase().includes(q)
      )
    })

    const matchedMaterials = materials.filter((m) => {
      if (!m.commonNationalCode) return false
      return m.commonNationalCode.toLowerCase().includes(q)
    })

    const cpseCodes = nationalCodes.filter((nc) => {
      return (
        nc.code.toLowerCase().includes(q) ||
        nc.description.toLowerCase().includes(q) ||
        nc.existingCodes.some((code) => code.toLowerCase().includes(q))
      )
    })

    const codeResults = cnmcGroups ? Object.values(cnmcGroups).filter((g) => {
      return (
        g.commonNationalCode.toLowerCase().includes(q) ||
        g.standardizedDescription.toLowerCase().includes(q) ||
        g.mappedCodes.some((mc) => mc.code.toLowerCase().includes(q))
      )
    }) : []

    return { materials: materialResults, matchedMaterials, cpseCodes, codes: cpseCodes, groups: codeResults }
  }, [debouncedQuery, materials, nationalCodes, cnmcGroups])

  const totalResults = results.materials.length + results.codes.length + results.matchedMaterials.length

  const handleMaterialClick = (materialId: string) => {
    navigate('/material-master', { state: { highlightId: materialId } })
    onClose()
  }

  const handleGroupClick = () => {
    navigate('/national-code')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 pt-16 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-2xl">
        <div className="absolute -top-12 right-0">
          <button
            onClick={onClose}
            className="rounded-md border border-grey-300 bg-white p-1.5 text-grey-600 hover:bg-grey-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="rounded-lg border border-grey-200 bg-white shadow-panel">
          <div className="flex items-center gap-2 p-3">
            <Search className="h-5 w-5 text-grey-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by Material Code, Description, Specification, CPSE, or National Code..."
              className="flex-1 border-none outline-none text-sm text-grey-800 placeholder-grey-400"
              autoFocus
            />
            <Zap className="h-4 w-4 text-primary-400" />
          </div>

          <div className="max-h-[60vh] overflow-y-auto border-t border-grey-200">
            {!debouncedQuery ? (
              <div className="p-4 text-center text-sm text-grey-500">
                Start typing to search across materials, matched materials, and national codes
              </div>
            ) : totalResults === 0 ? (
              <div className="p-4 text-center text-sm text-grey-500">
                No results found for "{debouncedQuery}"
              </div>
            ) : (
              <div className="divide-y divide-grey-100">
                {results.materials.length > 0 && (
                  <div className="p-2">
                    <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-grey-400">
                      Material ({results.materials.length})
                    </div>
                    {results.materials.slice(0, 8).map((m) => (
                      <div
                        key={`mat-${m.id}`}
                        onClick={() => handleMaterialClick(m.id)}
                        className="cursor-pointer px-3 py-2 transition-colors hover:bg-grey-50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-start gap-2">
                            <FileText className="mt-0.5 h-4 w-4 flex-shrink-0 text-grey-400" />
                            <div>
                              <p className="text-sm font-medium text-grey-800">
                                {m.materialCode} — {m.description}
                              </p>
                              <p className="text-xs text-grey-500">
                                {m.cpse} • {m.category} • {m.uom}
                              </p>
                            </div>
                          </div>
                          {m.commonNationalCode && (
                            <span className="font-mono text-xs text-primary-600">
                              {m.commonNationalCode}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {results.matchedMaterials.length > 0 && (
                  <div className="p-2">
                    <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-grey-400">
                      Matched Materials ({results.matchedMaterials.length})
                    </div>
                    {results.matchedMaterials.slice(0, 5).map((m) => (
                      <div
                        key={`matched-${m.id}`}
                        onClick={() => handleMaterialClick(m.id)}
                        className="cursor-pointer px-3 py-2 transition-colors hover:bg-grey-50"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex h-5 w-5 items-center justify-center rounded bg-primary-100">
                            <Database className="h-3 w-3 text-primary-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-grey-800">
                              {m.materialCode} — {m.description}
                            </p>
                            <p className="text-xs text-grey-500">
                              {m.cpse} • CNMC: {m.commonNationalCode}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {results.codes.length > 0 && (
                  <div className="p-2">
                    <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-grey-400">
                      Common National Code ({results.codes.length})
                    </div>
                    {results.codes.slice(0, 5).map((nc) => (
                      <div
                        key={`code-${nc.code}`}
                         onClick={() => handleGroupClick()}
                        className="cursor-pointer px-3 py-2 transition-colors hover:bg-grey-50"
                      >
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4 text-primary-500" />
                          <div>
                            <p className="text-sm font-medium text-grey-800">
                              {nc.code} — {nc.description}
                            </p>
                            <p className="text-xs text-grey-500">
                              {nc.mappedCPSEs} CPSEs mapped • {nc.existingCodes.join(', ')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
