'use client'

import { useState } from 'react'
import { 
  MapPinIcon, 
  TruckIcon, 
  SparklesIcon,
  CloudIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  FireIcon
} from '@heroicons/react/24/outline'
import { useAppStore } from '@/lib/store'
import { formatDistance, formatDuration, formatEmissions } from '@/lib/utils'
import { apiClient } from '@/lib/api'

interface RouteForm {
  source: string
  destination: string
  vehicleType: 'LCV' | 'MCV' | 'HCV' | 'THREE_WHEELER'
  fuelType: 'DIESEL' | 'PETROL' | 'CNG' | 'ELECTRIC'
  includeWeather: boolean
  includeAlternatives: boolean
}

export default function RouteOptimizerPage() {
  const { addNotification } = useAppStore()
  const [form, setForm] = useState<RouteForm>({
    source: '',
    destination: '',
    vehicleType: 'LCV',
    fuelType: 'DIESEL',
    includeWeather: true,
    includeAlternatives: false
  })
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizedRoute, setOptimizedRoute] = useState<any>(null)

  const handleOptimize = async () => {
    if (!form.source || !form.destination) {
      addNotification({
        type: 'error',
        message: 'Please enter both source and destination'
      })
      return
    }

    setIsOptimizing(true)
    
    try {
      const routeData = await apiClient.optimizeRoute({
        source: form.source,
        destination: form.destination,
        vehicleType: form.vehicleType,
        fuelType: form.fuelType,
        includeWeather: form.includeWeather,
        includeAlternatives: form.includeAlternatives
      })
      
      setOptimizedRoute(routeData)
      addNotification({
        type: 'success',
        message: 'Route optimized successfully!'
      })
    } catch (error) {
      console.error('Route optimization error:', error)
      addNotification({
        type: 'error',
        message: 'Failed to optimize route. Please try again.'
      })
    } finally {
      setIsOptimizing(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">
          Route Optimizer
        </h1>
        <p className="text-text-secondary mt-2">
          Optimize your delivery routes for maximum efficiency and minimum emissions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Route Form */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-text-primary mb-6">
              Route Details
            </h2>
            
            <div className="space-y-4">
              {/* Source */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Starting Point
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary" />
                  <input
                    type="text"
                    value={form.source}
                    onChange={(e) => setForm(prev => ({ ...prev, source: e.target.value }))}
                    placeholder="Enter starting address"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                  />
                </div>
              </div>

              {/* Destination */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Destination
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary" />
                  <input
                    type="text"
                    value={form.destination}
                    onChange={(e) => setForm(prev => ({ ...prev, destination: e.target.value }))}
                    placeholder="Enter destination address"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                  />
                </div>
              </div>

              {/* Vehicle Type */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Vehicle Category
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'LCV', label: 'Light Commercial', icon: TruckIcon },
                    { value: 'MCV', label: 'Medium Commercial', icon: TruckIcon },
                    { value: 'HCV', label: 'Heavy Commercial', icon: TruckIcon },
                    { value: 'THREE_WHEELER', label: 'Three Wheeler', icon: TruckIcon }
                  ].map((vehicle) => (
                    <button
                      key={vehicle.value}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, vehicleType: vehicle.value as any }))}
                      className={`p-3 border rounded-lg transition-colors ${
                        form.vehicleType === vehicle.value
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <vehicle.icon className="h-5 w-5 mx-auto mb-1" />
                      <span className="text-xs font-medium">{vehicle.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fuel Type */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Fuel Type
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { value: 'DIESEL', label: 'Diesel', icon: FireIcon },
                    { value: 'PETROL', label: 'Petrol', icon: FireIcon },
                    { value: 'CNG', label: 'CNG', icon: CloudIcon },
                    { value: 'ELECTRIC', label: 'Electric', icon: SparklesIcon }
                  ].map((fuel) => (
                    <button
                      key={fuel.value}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, fuelType: fuel.value as any }))}
                      className={`p-3 border rounded-lg transition-colors ${
                        form.fuelType === fuel.value
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <fuel.icon className="h-5 w-5 mx-auto mb-1" />
                      <span className="text-xs font-medium">{fuel.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">
                  Optimization Options
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={form.includeWeather}
                      onChange={(e) => setForm(prev => ({ ...prev, includeWeather: e.target.checked }))}
                      className="rounded border-gray-300 text-accent focus:ring-accent"
                    />
                    <span className="ml-2 text-sm text-text-primary">Include weather conditions</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={form.includeAlternatives}
                      onChange={(e) => setForm(prev => ({ ...prev, includeAlternatives: e.target.checked }))}
                      className="rounded border-gray-300 text-accent focus:ring-accent"
                    />
                    <span className="ml-2 text-sm text-text-primary">Show alternative routes</span>
                  </label>
                </div>
              </div>

              {/* Optimize Button */}
              <button
                onClick={handleOptimize}
                disabled={isOptimizing}
                className="w-full bg-accent text-white py-3 px-6 rounded-lg font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isOptimizing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Optimizing Route...
                  </div>
                ) : (
                  'Optimize Route'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {optimizedRoute ? (
            <>
              {/* Route Summary */}
              <div className="card">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Route Overview
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-text-primary">
                      {optimizedRoute.distance.km} km
                    </p>
                    <p className="text-sm text-text-secondary">Total Distance</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-text-primary">
                      {optimizedRoute.duration.with_traffic?.hours || optimizedRoute.duration.normal.hours}h
                    </p>
                    <p className="text-sm text-text-secondary">Estimated Time</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-accent">
                      {optimizedRoute.emissions.co2_emissions} kg
                    </p>
                    <p className="text-sm text-text-secondary">CO₂ Emissions</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-text-primary">
                      ₹{optimizedRoute.fuel_consumption.fuel_cost}
                    </p>
                    <p className="text-sm text-text-secondary">Fuel Cost</p>
                  </div>
                </div>
              </div>

              {/* Traffic & Weather */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Traffic */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                    <ClockIcon className="h-5 w-5 mr-2" />
                    Traffic Conditions
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Current Status</span>
                      <span className={`font-medium ${
                        optimizedRoute.traffic.congestion_level === 'HIGH' ? 'text-red-600' :
                        optimizedRoute.traffic.congestion_level === 'MEDIUM' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {optimizedRoute.traffic.current_conditions}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Delay Factor</span>
                      <span className="font-medium">{optimizedRoute.traffic.delay_factor.toFixed(1)}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Alternative Routes</span>
                      <span className="font-medium">{optimizedRoute.traffic.alternative_routes_available}</span>
                    </div>
                  </div>
                </div>

                {/* Weather */}
                {optimizedRoute.weather && (
                  <div className="card">
                    <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                      <CloudIcon className="h-5 w-5 mr-2" />
                      Weather Conditions
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Start Location</span>
                        <span className="font-medium">
                          {optimizedRoute.weather.start_location.temperature}°C, {optimizedRoute.weather.start_location.condition}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">End Location</span>
                        <span className="font-medium">
                          {optimizedRoute.weather.end_location.temperature}°C, {optimizedRoute.weather.end_location.condition}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Safety Score</span>
                        <span className={`font-medium ${
                          optimizedRoute.weather.overall_safety_score >= 80 ? 'text-green-600' :
                          optimizedRoute.weather.overall_safety_score >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {optimizedRoute.weather.overall_safety_score}/100
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Fuel & Emissions Details */}
              <div className="card">
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                  <CurrencyRupeeIcon className="h-5 w-5 mr-2" />
                  Cost & Environmental Impact
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-text-primary">
                      {optimizedRoute.fuel_consumption.fuel_required} {optimizedRoute.fuel_consumption.unit}
                    </p>
                    <p className="text-xs text-text-secondary">Fuel Required</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-text-primary">
                      {optimizedRoute.fuel_consumption.efficiency} km/{optimizedRoute.fuel_consumption.unit}
                    </p>
                    <p className="text-xs text-text-secondary">Efficiency</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-green-600">
                      {optimizedRoute.emissions.environmental_score}/100
                    </p>
                    <p className="text-xs text-text-secondary">Eco Score</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-text-primary">
                      {optimizedRoute.route_analysis.safety_rating}/100
                    </p>
                    <p className="text-xs text-text-secondary">Safety Rating</p>
                  </div>
                </div>
              </div>

              {/* Route Path */}
              <div className="card">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Route Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      A
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-text-primary">Start: {optimizedRoute.source}</p>
                      <p className="text-sm text-text-secondary">{optimizedRoute.route_path.start_address}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                    <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      B
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-text-primary">End: {optimizedRoute.destination}</p>
                      <p className="text-sm text-text-secondary">{optimizedRoute.route_path.end_address}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">{optimizedRoute.route_path.steps} steps</span> • 
                    <span className="ml-2">Vehicle: {optimizedRoute.vehicleType} ({optimizedRoute.fuelType})</span>
                  </p>
                </div>
              </div>

              {/* Weather Recommendations */}
              {optimizedRoute.weather && optimizedRoute.weather.start_location.recommendations.length > 0 && (
                <div className="card">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">
                    Weather Recommendations
                  </h3>
                  <div className="space-y-2">
                    {optimizedRoute.weather.start_location.recommendations.map((rec: string, index: number) => (
                      <div key={index} className="flex items-start space-x-2 p-2 bg-yellow-50 rounded-lg">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-yellow-800">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3">
                <button className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Save Route
                </button>
                <button className="flex-1 bg-surface text-text-primary border border-gray-300 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Export Data
                </button>
                <button 
                  onClick={() => setOptimizedRoute(null)}
                  className="px-6 py-3 text-text-secondary hover:text-text-primary transition-colors"
                >
                  Clear
                </button>
              </div>
            </>
          ) : (
            <div className="card">
              <div className="text-center py-12">
                <MapPinIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  Ready to Optimize
                </h3>
                <p className="text-text-secondary">
                  Enter source and destination to get real-time route optimization with traffic, weather, and cost analysis.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 