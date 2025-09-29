'use client'

import { useState } from 'react'
import { 
  MapPinIcon, 
  TruckIcon, 
  SparklesIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { useAppStore } from '@/lib/store'
import { formatDistance, formatDuration, formatEmissions } from '@/lib/utils'

interface RouteForm {
  source: string
  destinations: string[]
  vehicleType: 'diesel' | 'petrol' | 'ev'
}

export default function RouteOptimizerPage() {
  const { addNotification } = useAppStore()
  const [form, setForm] = useState<RouteForm>({
    source: '',
    destinations: [''],
    vehicleType: 'diesel'
  })
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizedRoute, setOptimizedRoute] = useState<any>(null)

  const addDestination = () => {
    setForm(prev => ({
      ...prev,
      destinations: [...prev.destinations, '']
    }))
  }

  const removeDestination = (index: number) => {
    if (form.destinations.length > 1) {
      setForm(prev => ({
        ...prev,
        destinations: prev.destinations.filter((_, i) => i !== index)
      }))
    }
  }

  const updateDestination = (index: number, value: string) => {
    setForm(prev => ({
      ...prev,
      destinations: prev.destinations.map((dest, i) => i === index ? value : dest)
    }))
  }

  const handleOptimize = async () => {
    if (!form.source || form.destinations.some(d => !d)) {
      addNotification({
        type: 'error',
        message: 'Please fill in all fields'
      })
      return
    }

    setIsOptimizing(true)
    
    // Simulate API call
    setTimeout(() => {
      const mockRoute = {
        distance: 45000,
        duration: 7200,
        emissions: 85,
        fuelConsumption: 12.5,
        waypoints: [
          { lat: 40.7128, lng: -74.0060, name: form.source },
          ...form.destinations.map((dest, i) => ({
            lat: 40.7128 + (i + 1) * 0.01,
            lng: -74.0060 + (i + 1) * 0.01,
            name: dest
          }))
        ]
      }
      
      setOptimizedRoute(mockRoute)
      setIsOptimizing(false)
      addNotification({
        type: 'success',
        message: 'Route optimized successfully!'
      })
    }, 2000)
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

              {/* Destinations */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Destinations
                </label>
                <div className="space-y-3">
                  {form.destinations.map((destination, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary" />
                        <input
                          type="text"
                          value={destination}
                          onChange={(e) => updateDestination(index, e.target.value)}
                          placeholder={`Destination ${index + 1}`}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                        />
                      </div>
                      {form.destinations.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDestination(index)}
                          className="p-3 text-error hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addDestination}
                    className="flex items-center text-accent hover:text-accent/80 font-medium"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Destination
                  </button>
                </div>
              </div>

              {/* Vehicle Type */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Vehicle Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'diesel', label: 'Diesel', icon: TruckIcon },
                    { value: 'petrol', label: 'Petrol', icon: TruckIcon },
                    { value: 'ev', label: 'Electric', icon: SparklesIcon }
                  ].map((vehicle) => (
                    <button
                      key={vehicle.value}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, vehicleType: vehicle.value as any }))}
                      className={`p-4 border rounded-lg transition-colors ${
                        form.vehicleType === vehicle.value
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <vehicle.icon className="h-6 w-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">{vehicle.label}</span>
                    </button>
                  ))}
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
                  Optimized Route
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-text-primary">
                      {formatDistance(optimizedRoute.distance)}
                    </p>
                    <p className="text-sm text-text-secondary">Total Distance</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-text-primary">
                      {formatDuration(optimizedRoute.duration)}
                    </p>
                    <p className="text-sm text-text-secondary">Estimated Time</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-accent">
                      {formatEmissions(optimizedRoute.emissions)}
                    </p>
                    <p className="text-sm text-text-secondary">CO₂ Emissions</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-text-primary">
                      {optimizedRoute.fuelConsumption}L
                    </p>
                    <p className="text-sm text-text-secondary">Fuel Consumption</p>
                  </div>
                </div>
              </div>

              {/* Waypoints */}
              <div className="card">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Route Waypoints
                </h3>
                <div className="space-y-3">
                  {optimizedRoute.waypoints.map((waypoint: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-text-primary">{waypoint.name}</p>
                        <p className="text-sm text-text-secondary">
                          {waypoint.lat.toFixed(4)}, {waypoint.lng.toFixed(4)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Save Route
                </button>
                <button className="flex-1 bg-surface text-text-primary border border-gray-300 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Export
                </button>
              </div>
            </>
          ) : (
            <div className="card">
              <div className="text-center py-12">
                <MapPinIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  No Route Optimized
                </h3>
                <p className="text-text-secondary">
                  Enter your route details and click "Optimize Route" to get started.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 