import type { ReactNode } from 'react'

interface TooltipProps {
  content: ReactNode
  children: ReactNode
}

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <span
      className="relative z-10 inline-block cursor-pointer"
      title={typeof content === 'string' ? content : undefined}
    >
      {children}
    </span>
  )
}
