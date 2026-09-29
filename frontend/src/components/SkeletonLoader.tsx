import { cn } from '../utils/cn'

interface SkeletonLoaderProps {
  className?: string
  count?: number
  height?: string
}

export function SkeletonLoader({ className, count = 1, height = 'h-4' }: SkeletonLoaderProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'animate-pulse rounded-md bg-grey-200',
            height,
            className,
          )}
        />
      ))}
    </>
  )
}

export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <SkeletonLoader key={i} className="h-4 w-full" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid grid-cols-4 gap-4">
          {Array.from({ length: columns }).map((_, j) => (
            <SkeletonLoader key={`${i}-${j}`} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  )
}
