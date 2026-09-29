interface ApprovalDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
}

export function ApprovalDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
}: ApprovalDialogProps) {
  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
        <div className="w-full max-w-md rounded-lg border border-grey-200 bg-white shadow-xl animate-in zoom-in-95 duration-200">
          <div className="border-b border-grey-200 p-5">
            <h2 className="text-lg font-semibold text-grey-800">{title}</h2>
          </div>
          <div className="p-5">
            <p className="text-sm text-grey-700">{description}</p>
          </div>
          <div className="border-t border-grey-200 p-4">
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="rounded-md border border-grey-300 bg-white px-4 py-2 text-sm font-medium text-grey-700 hover:bg-grey-50"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className="rounded-md bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800"
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
