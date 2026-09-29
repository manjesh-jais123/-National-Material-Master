import { cn } from '../utils/cn'

interface StepIndicatorProps {
  steps: Array<{
    label: string
    description?: string
  }>
  currentStep: number
  completedSteps?: number
}

export function StepIndicator({ steps, currentStep, completedSteps = 0 }: StepIndicatorProps) {
  const totalSteps = steps.length

  return (
    <div className="mb-8">
      <nav aria-label="Progress" className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isComplete = stepNumber <= completedSteps
          const isCurrent = stepNumber === currentStep

          let statusNode: React.ReactNode
          let ringColor = 'ring-grey-300'

          if (isComplete) {
            ringColor = 'ring-success-500'
            statusNode = (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success-500 text-white">
                <CheckIcon className="h-3.5 w-3.5" />
              </span>
            )
          } else if (isCurrent) {
            ringColor = 'ring-primary-500'
            statusNode = (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-white">
                <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-white" />
              </span>
            )
          } else {
            statusNode = (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-grey-100 text-grey-500">
                <span className="text-xs font-medium">{stepNumber}</span>
              </span>
            )
          }

          const isLast = index === totalSteps - 1

          return (
            <div key={step.label} className="relative flex flex-col items-center">
              <div className="flex items-center">
                <div className={cn('ring-2', ringColor, 'rounded-full bg-white')}>
                  {statusNode}
                </div>
                {!isLast && (
                  <div
                    className="absolute top-3 left-6 h-0.5 w-8 -z-0"
                    style={{
                      backgroundColor: isComplete ? '#10b981' : '#e5e7eb',
                    }}
                  />
                )}
                {!isLast && (
                  <div
                    className="absolute top-3 left-6 h-0.5 flex-1 -z-10"
                    style={{
                      backgroundColor: isComplete ? '#10b981' : '#e5e7eb',
                      width: '48px',
                    }}
                  />
                )}
              </div>
              <div className="mt-2 text-center">
                <p
                  className={cn(
                    'text-xs font-medium',
                    isComplete || isCurrent ? 'text-grey-800' : 'text-grey-500',
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-grey-500">{step.description}</p>
                )}
              </div>
            </div>
          )
        })}
      </nav>
    </div>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}
