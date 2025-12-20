'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  TruckIcon,
  ClockIcon,
  FireIcon,
  CurrencyDollarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

interface TransportModeComparisonProps {
  sourceWarehouseId: string
  destinationWarehouseId: string
  productId?: string
  quantity?: number
}

export function TransportModeComparison({
  sourceWarehouseId,
  destinationWarehouseId,
  productId,
  quantity
}: TransportModeComparisonProps) {
  const [isComparing, setIsComparing] = useState(false)
  const [comparison, setComparison] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCompare = async () => {
    setIsComparing(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:5000/api/v1/routes/compare-modes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          sourceWarehouseId,
          destinationWarehouseId,
          productId,
          quantity
        })
      })

      if (!response.ok) {
        throw new Error('Failed to compare transport modes')
      }

      const data = await response.json()
      setComparison(data.data)
    } catch (err: any) {
      setError(err.message || 'Failed to compare transport modes')
      console.error('Transport mode comparison error:', err)
    } finally {
      setIsComparing(false)
    }
  }

  const getMetricColor = (value: number, max: number) => {
    const percentage = (value / max) * 100
    if (percentage < 33) return 'bg-green-500'
    if (percentage < 66) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Transport Mode Comparison</h3>
          <p className="text-sm text-gray-500">
            Compare different transport modes to find the best option
          </p>
        </div>
        <Button onClick={handleCompare} disabled={isComparing}>
          {isComparing ? (
            <>
              <span className="animate-spin mr-2">⚙️</span>
              Comparing...
            </>
          ) : (
            <>
              <ChartBarIcon className="w-5 h-5 mr-2" />
              Compare Modes
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {comparison && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <TruckIcon className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Comparison Results</h4>
            </div>
            <p className="text-sm text-blue-700 mt-2">
              Recommended: <span className="font-bold">{comparison.bestMode?.toUpperCase()}</span>
            </p>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2">
                  <th className="text-left p-3 font-semibold text-gray-700">Mode</th>
                  <th className="text-right p-3 font-semibold text-gray-700">Distance</th>
                  <th className="text-right p-3 font-semibold text-gray-700">Duration</th>
                  <th className="text-right p-3 font-semibold text-gray-700">Cost</th>
                  <th className="text-right p-3 font-semibold text-gray-700">CO₂</th>
                  <th className="text-center p-3 font-semibold text-gray-700">Score</th>
                </tr>
              </thead>
              <tbody>
                {comparison.modes?.map((mode: any) => {
                  const maxCost = Math.max(...comparison.modes.map((m: any) => m.cost?.value || 0))
                  const maxEmissions = Math.max(...comparison.modes.map((m: any) => m.emissions?.value || 0))
                  const maxDuration = Math.max(...comparison.modes.map((m: any) => m.duration?.adjusted || 0))

                  return (
                    <tr 
                      key={mode.transportMode}
                      className={`border-b hover:bg-gray-50 ${
                        mode.transportMode === comparison.bestMode ? 'bg-green-50' : ''
                      }`}
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">
                            {mode.transportMode === 'TRUCK' && '🚚'}
                            {mode.transportMode === 'VAN' && '🚐'}
                            {mode.transportMode === 'RAIL' && '🚂'}
                            {mode.transportMode === 'SHIP' && '🚢'}
                            {mode.transportMode === 'AIR' && '✈️'}
                          </span>
                          <span className="font-medium">{mode.transportMode}</span>
                          {mode.transportMode === comparison.bestMode && (
                            <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                              Best
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="text-right p-3 text-sm">
                        {mode.distance?.value?.toFixed(1)} km
                      </td>
                      <td className="text-right p-3">
                        <div className="flex items-center justify-end gap-2">
                          <div className={`h-2 w-16 rounded ${getMetricColor(mode.duration?.adjusted || 0, maxDuration)}`} />
                          <span className="text-sm">{mode.duration?.adjusted?.toFixed(1)} hrs</span>
                        </div>
                      </td>
                      <td className="text-right p-3">
                        <div className="flex items-center justify-end gap-2">
                          <div className={`h-2 w-16 rounded ${getMetricColor(mode.cost?.value || 0, maxCost)}`} />
                          <span className="text-sm">₹{mode.cost?.value?.toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="text-right p-3">
                        <div className="flex items-center justify-end gap-2">
                          <div className={`h-2 w-16 rounded ${getMetricColor(mode.emissions?.value || 0, maxEmissions)}`} />
                          <span className="text-sm">{mode.emissions?.value?.toFixed(2)} kg</span>
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
                          <span className="text-sm font-bold">
                            {((1 - mode.compositeScore) * 100).toFixed(0)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Metrics Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <ClockIcon className="w-4 h-4" />
                <span className="text-xs font-medium">Fastest</span>
              </div>
              <p className="text-lg font-bold">{comparison.fastest?.toUpperCase()}</p>
              <p className="text-xs text-gray-500 mt-1">
                {comparison.modes?.find((m: any) => m.transportMode === comparison.fastest)?.duration?.adjusted?.toFixed(1)} hrs
              </p>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <CurrencyDollarIcon className="w-4 h-4" />
                <span className="text-xs font-medium">Cheapest</span>
              </div>
              <p className="text-lg font-bold">{comparison.cheapest?.toUpperCase()}</p>
              <p className="text-xs text-gray-500 mt-1">
                ₹{comparison.modes?.find((m: any) => m.transportMode === comparison.cheapest)?.cost?.value?.toFixed(2)}
              </p>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <FireIcon className="w-4 h-4" />
                <span className="text-xs font-medium">Greenest</span>
              </div>
              <p className="text-lg font-bold">{comparison.greenest?.toUpperCase()}</p>
              <p className="text-xs text-gray-500 mt-1">
                {comparison.modes?.find((m: any) => m.transportMode === comparison.greenest)?.emissions?.value?.toFixed(2)} kg CO₂
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
