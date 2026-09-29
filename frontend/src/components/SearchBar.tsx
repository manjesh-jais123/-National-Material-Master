import { useState, type KeyboardEvent } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '../utils/cn'

interface SearchBarProps {
  placeholder?: string
  onSearch: (query: string) => void
  initialValue?: string
  debounceMs?: number
}

export function SearchBar({
  placeholder = 'Search materials, codes, descriptions...',
  onSearch,
  initialValue = '',
  debounceMs = 300,
}: SearchBarProps) {
  const [value, setValue] = useState(initialValue)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setValue(val)

    if (debounceMs > 0) {
      clearTimeout((window as any)._searchDebounce)
      ;(window as any)._searchDebounce = setTimeout(() => onSearch(val), debounceMs)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && debounceMs === 0) {
      onSearch(value)
    }
    if (e.key === 'Escape') {
      setValue('')
      onSearch('')
    }
  }

  const clearSearch = () => {
    setValue('')
    onSearch('')
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-4 w-4 text-grey-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full rounded-md border border-grey-300 bg-white pl-9 pr-9 text-sm text-grey-800 placeholder-grey-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
      />
      {value && (
        <button
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 flex items-center pr-2 text-grey-400 hover:text-grey-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

interface FilterSelectProps {
  label: string
  value?: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function FilterSelect({
  label,
  value,
  options,
  onChange,
  placeholder = 'All',
  className,
}: FilterSelectProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      {label && <span className="text-xs font-medium text-grey-500">{label}</span>}
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value || '')}
        className="mt-1 rounded-md border border-grey-300 bg-white px-2 py-1 text-sm text-grey-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
