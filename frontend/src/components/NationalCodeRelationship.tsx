import type { CNMCGroup } from '../types'
import { Package, Hash, GitBranch } from 'lucide-react'

interface NationalCodeRelationshipProps {
  cnmcGroup: CNMCGroup
}

export function NationalCodeRelationship({ cnmcGroup }: NationalCodeRelationshipProps) {
  const cpseMaterials = cnmcGroup.mappedMaterials
  const cpseCodes = cnmcGroup.mappedCodes

  return (
    <div className="rounded-lg border border-grey-200 bg-white p-6 shadow-card">
      <div className="mb-6 text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <Hash className="h-4 w-4 text-primary-600" />
          <span className="text-xs font-medium text-grey-500">Common National Material Code</span>
        </div>
        <p className="font-mono text-3xl font-bold text-primary-700">
          {cnmcGroup.commonNationalCode}
        </p>
        <p className="mt-2 text-sm text-grey-600">
          {cnmcGroup.standardizedDescription}
        </p>
      </div>

      <div className="mb-5 flex items-center justify-center">
        <div className="flex items-center gap-1">
          <div className="h-px w-12 bg-grey-300" />
          <GitBranch className="h-4 w-4 text-grey-400" />
          <div className="h-px w-12 bg-grey-300" />
        </div>
        <div className="flex h-px flex-1 bg-grey-200" />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cpseCodes.map((mc) => {
          const mat = cpseMaterials.find((m) => m.materialCode === mc.code)
          return (
            <div
              key={`${mc.cpse}-${mc.code}`}
              className="flex flex-col items-center rounded-lg border border-grey-200 p-4 text-center transition-shadow hover:shadow-panel"
            >
              <div className="mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary-100">
                <Package className="h-4 w-4 text-primary-600" />
              </div>
              <div>
                <span className="text-xs font-medium text-grey-500">{mc.cpse}</span>
                <p className="my-1 font-mono text-lg font-semibold text-grey-800">
                  {mc.code}
                </p>
                {mat && (
                  <p className="text-xs text-grey-600">{mat.description}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="border-t border-grey-200 pt-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-center">
          <div>
            <div className="text-2xl font-bold text-primary-600">{cpseCodes.length}</div>
            <p className="text-xs text-grey-500">CPSEs Mapped</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-success-600">1</div>
            <p className="text-xs text-grey-500">Standardized Material</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-warning-600">{cpseCodes.length}</div>
            <p className="text-xs text-grey-500">Legacy Codes Retained</p>
          </div>
        </div>
      </div>
    </div>
  )
}
