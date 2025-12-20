'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  TruckIcon, 
  MapPinIcon, 
  ClockIcon, 
  FireIcon,
  CloudIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface RouteOptimizerProps {
  sourceWarehouseId: string
  destinationWarehouseId: string
  productId?: string
  quantity?: number
  onRouteSelected?: (route: any) => void
}

export function RouteOptimizer({
  sourceWarehouseId,
  destinationWarehouseId,
  productId,
  quantity,
  onRouteSelected
}: RouteOptimizerProps) {
  const [transportMode, setTransportMode] = useState('TRUCK')
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [routeAnalysis, setRouteAnalysis] = useState<any>(null)
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const transportModes = [
    { value: 'TRUCK', label: 'Truck', icon: '🚚' },
    { value: 'VAN', label: 'Van', icon: '🚐' },
    { value: 'RAIL', label: 'Rail', icon: '🚂' },
    { value: 'SHIP', label: 'Ship', icon: '🚢' },
    { value: 'AIR', label: 'Air', icon: '✈️' }
  ]

  const handleOptimize = async () => {
    setIsOptimizing(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:5000/api/v1/routes/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          sourceWarehouseId,
          destinationWarehouseId,
          transportMode,
          productId,
          quantity
        })
      })

      if (!response.ok) {
        throw new Error('Failed to optimize route')
      }

      const data = await response.json()
      setRouteAnalysis(data.data)
      setSelectedRouteIndex(0)
      
      if (onRouteSelected && data.data.bestRoute) {
        onRouteSelected(data.data.bestRoute)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to optimize route')
      console.error('Route optimization error:', err)
    } finally {
      setIsOptimizing(false)
    }
  }

  const selectedRoute = routeAnalysis?.routes?.[selectedRouteIndex]

  return (
    <div className="space-y-6">
      {/* Transport Mode Selection */}
      <div className="space-y-2">
        <Label>Transport Mode</Label>
        <Select value={transportMode} onValueChange={setTransportMode}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {transportModes.map((mode) => (
              <SelectItem key={mode.value} value={mode.value}>
                <span className="flex items-center gap-2">
                  <span>{mode.icon}</span>
                  <span>{mode.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Optimize Button */}
      <Button 
        onClick={handleOptimize} 
        disabled={isOptimizing || !sourceWarehouseId || !destinationWarehouseId}
        className="w-full"
      >
        {isOptimizing ? (
          <>
            <span className="animate-spin mr-2">⚙️</span>
            Optimizing Route...
          </>
        ) : (
          <>
            <MapPinIcon className="w-5 h-5 mr-2" />
            Optimize Route
          </>
        )}
      </Button>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Optimization Failed</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Route Analysis Results */}
      {routeAnalysis && (
        <div className="space-y-6 border-t pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Route Analysis</h3>
            <span className="text-sm text-gray-500">
              {routeAnalysis.routeCount} route{routeAnalysis.routeCount !== 1 ? 's' : ''} found
            </span>
          </div>

          {/* Route Tabs */}
          {routeAnalysis.routes.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {routeAnalysis.routes.map((route: any, index: number) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedRouteIndex(index)
                    if (onRouteSelected) onRouteSelected(route)
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedRouteIndex === index
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {route.routeName}
                  {route.recommended && (
                    <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                      Best
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Selected Route Details */}
          {selectedRoute && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-900">{selectedRoute.summary}</p>
                {selectedRoute.recommended && (
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-700 font-medium">Recommended Route</span>
                  </div>
                )}
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Distance */}
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <MapPinIcon className="w-4 h-4" />
                    <span className="text-xs font-medium">Distance</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedRoute.distance.value.toFixed(1)} km
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{selectedRoute.distance.text}</p>
                </div>

                {/* Duration */}
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <ClockIcon className="w-4 h-4" />
                    <span className="text-xs font-medium">Duration</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedRoute.duration.adjusted.toFixed(1)} hrs
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedRoute.duration.withTraffic ? 'With traffic' : selectedRoute.duration.text}
                  </p>
                </div>

                {/* Emissions */}
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <FireIcon className="w-4 h-4" />
                    <span className="text-xs font-medium">CO₂ Emissions</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-600">
                    {selectedRoute.emissions.value.toFixed(2)} kg
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{selectedRoute.emissions.text}</p>
                </div>

                {/* Cost */}
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <CurrencyDollarIcon className="w-4 h-4" />
                    <span className="text-xs font-medium">Estimated Cost</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{selectedRoute.cost.value.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{selectedRoute.cost.text}</p>
                </div>
              </div>

              {/* Weather Info */}
              {selectedRoute.weather && (
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CloudIcon className="w-5 h-5 text-gray-600" />
                    <h4 className="text-sm font-semibold">Weather Conditions</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Average Temperature</span>
                      <span className="text-sm font-medium">
                        {selectedRoute.weather.averageTemp?.toFixed(1)}°C
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Conditions</span>
                      <span className="text-sm font-medium">
                        {selectedRoute.weather.conditions?.join(', ')}
                      </span>
                    </div>
                    {selectedRoute.weather.hasAdverseWeather && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mt-2">
                        <p className="text-xs text-yellow-800 font-medium">
                          ⚠️ Adverse weather conditions detected
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {selectedRoute.warnings && selectedRoute.warnings.length > 0 && (
                <div className="space-y-2">
                  {selectedRoute.warnings.map((warning: any, index: number) => (
                    <div
                      key={index}
                      className={`border rounded-lg p-3 ${
                        warning.severity === 'high'
                          ? 'bg-red-50 border-red-200'
                          : 'bg-yellow-50 border-yellow-200'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <ExclamationTriangleIcon
                          className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                            warning.severity === 'high' ? 'text-red-500' : 'text-yellow-500'
                          }`}
                        />
                        <div>
                          <p className={`text-xs font-medium ${
                            warning.severity === 'high' ? 'text-red-800' : 'text-yellow-800'
                          }`}>
                            {warning.type.replace(/_/g, ' ')}
                          </p>
                          <p className={`text-xs mt-1 ${
                            warning.severity === 'high' ? 'text-red-600' : 'text-yellow-600'
                          }`}>
                            {warning.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Composite Score */}
              <div className="bg-gray-50 border rounded-lg p-4">
                <h4 className="text-sm font-semibold mb-3">Route Score Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Time Score</span>
                    <span className="text-xs font-medium">
                      {(selectedRoute.scores.timeScore * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Cost Score</span>
                    <span className="text-xs font-medium">
                      {(selectedRoute.scores.costScore * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Emission Score</span>
                    <span className="text-xs font-medium">
                      {(selectedRoute.scores.emissionScore * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Weather Score</span>
                    <span className="text-xs font-medium">
                      {(selectedRoute.scores.weatherScore * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">Overall Score</span>
                      <span className="text-sm font-bold text-blue-600">
                        {((1 - selectedRoute.compositeScore) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
