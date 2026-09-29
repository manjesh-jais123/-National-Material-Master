import type { ReactNode } from 'react'
import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Search as SearchIcon } from 'lucide-react'
import { cn } from '../utils/cn'

export interface Column<T> {
  key: keyof T | string
  header: string
  className?: string
  sortable?: boolean
  render?: (row: T) => ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  pageSize?: number
  searchable?: boolean
  striped?: boolean
  hover?: boolean
  className?: string
  emptyMessage?: string
  onRowClick?: (row: T) => void
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  pageSize = 10,
  searchable = false,
  striped = false,
  hover = true,
  className,
  emptyMessage = 'No data available',
  onRowClick,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  const searchableColumns = columns.filter((c) => c.key !== 'action' && typeof c.key === 'string')

  const filteredData = useMemo(() => {
    if (!searchTerm) return data
    return data.filter((row) =>
      searchableColumns.some((col) => {
        const val = getNestedValue(row, col.key as string)
        return String(val).toLowerCase().includes(searchTerm.toLowerCase())
      }),
    )
  }, [data, searchTerm, searchableColumns])

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

  return (
    <div className={cn('w-full', className)}>
      {searchable && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-grey-300 pl-8 pr-3 py-1 text-sm text-grey-800 placeholder-grey-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-400" />
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-md border border-grey-200 bg-white">
        <table className="w-full table-fixed border-collapse text-sm">
          <thead>
            <tr className="border-b border-grey-200 bg-grey-50">
              {columns.map((col) => (
                <th
                  key={col.key as string}
                  className={cn(
                    'table-header-cell',
                    col.className,
                    'cursor-default',
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-8 text-center text-sm text-grey-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={cn(
                    striped && rowIndex % 2 === 1 ? 'bg-grey-25' : '',
                    hover ? 'hover:bg-grey-50' : '',
                    onRowClick ? 'cursor-pointer' : '',
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key as string}
                      className={cn('table-cell', col.className, 'truncate')}
                    >
                      {col.render ? col.render(row) : renderCellValue(getNestedValue(row, col.key as string))}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filteredData.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-grey-500">
            Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredData.length)} of{' '}
            {filteredData.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={cn(
                'rounded-md border border-grey-300 bg-white p-1 text-grey-600 hover:bg-grey-50 disabled:cursor-not-allowed disabled:opacity-50',
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-0.5">
              {getPageNumbers().map((page, idx) =>
                page === 'ellipsis' ? (
                  <span key={`ellipsis-${idx}`} className="px-1 text-xs text-grey-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page as number)}
                    className={cn(
                      'h-7 w-7 rounded-md text-sm font-medium',
                      currentPage === page
                        ? 'bg-primary-700 text-white'
                        : 'border border-grey-300 bg-white text-grey-600 hover:bg-grey-50',
                    )}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={cn(
                'rounded-md border border-grey-300 bg-white p-1 text-grey-600 hover:bg-grey-50 disabled:cursor-not-allowed disabled:opacity-50',
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function getNestedValue(obj: Record<string, unknown>, key: string): unknown {
  return key.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[part]
    }
    return undefined
  }, obj)
}

function renderCellValue(value: unknown): ReactNode {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}
