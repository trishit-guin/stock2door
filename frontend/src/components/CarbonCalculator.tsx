'use client'

import { useState } from 'react'
import { 
  FireIcon,
  CalculatorIcon,
  TruckIcon,
  XMarkIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import { useAppStore } from '@/lib/store'

interface CarbonCalculatorProps {
  isOpen: boolean
  onClose: () => void
}

interface VehicleData {
  type: 'diesel' | 'petrol' | 'ev' | 'hybrid'
  distance: number
  fuelEfficiency: number
}

interface CalculationResult {
  totalEmissions: number
  breakdown: {
    co2: number
    ch4: number
    n2o: number
  }
  comparison: {
    treesNeeded: number
    equivalentCars: number
  }
  recommendations: string[]
}

export default function CarbonCalculator({ isOpen, onClose }: CarbonCalculatorProps) {
  const [vehicles, setVehicles] = useState<VehicleData[]>([
    { type: 'diesel', distance: 0, fuelEfficiency: 8 }
  ])
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const { addNotification } = useAppStore()

  const emissionFactors = {
    diesel: 2.68, // kg CO2 per liter
    petrol: 2.31, // kg CO2 per liter
    ev: 0.12, // kg CO2 per kWh (considering grid electricity)
    hybrid: 1.89 // kg CO2 per liter equivalent
  }

  const fuelEfficiencyDefaults = {
    diesel: 8, // L/100km
    petrol: 9, // L/100km
    ev: 20, // kWh/100km
    hybrid: 6 // L/100km
  }

  const addVehicle = () => {
    setVehicles([...vehicles, { type: 'diesel', distance: 0, fuelEfficiency: 8 }])
  }

  const removeVehicle = (index: number) => {
    if (vehicles.length > 1) {
      setVehicles(vehicles.filter((_, i) => i !== index))
    }
  }

  const updateVehicle = (index: number, field: keyof VehicleData, value: any) => {
    const updated = vehicles.map((vehicle, i) => {
      if (i === index) {
        const updatedVehicle = { ...vehicle, [field]: value }
        // Update fuel efficiency default when vehicle type changes
        if (field === 'type') {
          updatedVehicle.fuelEfficiency = fuelEfficiencyDefaults[value as keyof typeof fuelEfficiencyDefaults]
        }
        return updatedVehicle
      }
      return vehicle
    })
    setVehicles(updated)
  }

  const calculateEmissions = async () => {
    setIsCalculating(true)
    
    try {
      // Simulate calculation delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      let totalEmissions = 0
      let totalDistance = 0
      
      vehicles.forEach(vehicle => {
        const { type, distance, fuelEfficiency } = vehicle
        const fuelConsumed = (distance * fuelEfficiency) / 100
        const emissions = fuelConsumed * emissionFactors[type]
        totalEmissions += emissions
        totalDistance += distance
      })
      
      const mockResult: CalculationResult = {
        totalEmissions: Math.round(totalEmissions * 100) / 100,
        breakdown: {
          co2: Math.round(totalEmissions * 0.95 * 100) / 100,
          ch4: Math.round(totalEmissions * 0.03 * 100) / 100,
          n2o: Math.round(totalEmissions * 0.02 * 100) / 100
        },
        comparison: {
          treesNeeded: Math.ceil(totalEmissions / 22), // Average tree absorbs 22kg CO2/year
          equivalentCars: Math.round((totalEmissions / 4600) * 100) / 100 // Average car emits 4.6 tons/year
        },
        recommendations: generateRecommendations(vehicles, totalEmissions)
      }
      
      setResult(mockResult)
      
      addNotification({
        type: 'success',
        message: 'Carbon footprint calculated successfully!'
      })
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to calculate carbon footprint. Please try again.'
      })
    } finally {
      setIsCalculating(false)
    }
  }

  const generateRecommendations = (vehicles: VehicleData[], totalEmissions: number): string[] => {
    const recommendations = []
    
    const hasHighEmissionVehicles = vehicles.some(v => v.type === 'diesel' && v.fuelEfficiency > 10)
    const hasNoEV = !vehicles.some(v => v.type === 'ev')
    const avgDistance = vehicles.reduce((sum, v) => sum + v.distance, 0) / vehicles.length
    
    if (hasHighEmissionVehicles) {
      recommendations.push("Consider replacing high fuel consumption diesel vehicles with more efficient alternatives")
    }
    
    if (hasNoEV && avgDistance > 50) {
      recommendations.push("For routes over 50km, electric vehicles could significantly reduce emissions")
    }
    
    if (totalEmissions > 100) {
      recommendations.push("Implement route optimization to reduce total distance and emissions")
    }
    
    recommendations.push("Regular vehicle maintenance can improve fuel efficiency by 10-15%")
    
    if (vehicles.length > 3) {
      recommendations.push("Consider fleet consolidation to optimize vehicle utilization")
    }
    
    return recommendations
  }

  const resetCalculator = () => {
    setVehicles([{ type: 'diesel', distance: 0, fuelEfficiency: 8 }])
    setResult(null)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FireIcon className="h-6 w-6 text-orange-600 mr-2" />
              <h2 className="text-xl font-semibold text-text-primary">
                Carbon Footprint Calculator
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-text-primary">Vehicle Information</h3>
                <button
                  onClick={addVehicle}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  + Add Vehicle
                </button>
              </div>

              {vehicles.map((vehicle, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <TruckIcon className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="font-medium">Vehicle {index + 1}</span>
                    </div>
                    {vehicles.length > 1 && (
                      <button
                        onClick={() => removeVehicle(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Vehicle Type
                      </label>
                      <select
                        value={vehicle.type}
                        onChange={(e) => updateVehicle(index, 'type', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="diesel">Diesel</option>
                        <option value="petrol">Petrol</option>
                        <option value="ev">Electric</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Distance (km)
                      </label>
                      <input
                        type="number"
                        value={vehicle.distance}
                        onChange={(e) => updateVehicle(index, 'distance', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        {vehicle.type === 'ev' ? 'Efficiency (kWh/100km)' : 'Fuel (L/100km)'}
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={vehicle.fuelEfficiency}
                        onChange={(e) => updateVehicle(index, 'fuelEfficiency', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-start">
                  <InformationCircleIcon className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-xs text-blue-800">
                    <p className="font-medium mb-1">Calculation includes:</p>
                    <ul className="space-y-0.5">
                      <li>• Direct fuel combustion emissions</li>
                      <li>• Upstream emissions from fuel production</li>
                      <li>• Electricity grid emissions for EVs</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={calculateEmissions}
                disabled={isCalculating || vehicles.some(v => v.distance === 0)}
                className="w-full flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isCalculating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Calculating...
                  </>
                ) : (
                  <>
                    <CalculatorIcon className="h-4 w-4 mr-2" />
                    Calculate Emissions
                  </>
                )}
              </button>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              {result ? (
                <>
                  <h3 className="text-lg font-medium text-text-primary">Calculation Results</h3>
                  
                  {/* Total Emissions */}
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {result.totalEmissions} kg CO₂
                      </div>
                      <div className="text-sm text-text-secondary">Total Carbon Footprint</div>
                    </div>
                  </div>

                  {/* Emissions Breakdown */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-text-primary mb-3">Emissions Breakdown</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Carbon Dioxide (CO₂):</span>
                        <span className="font-medium">{result.breakdown.co2} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Methane (CH₄):</span>
                        <span className="font-medium">{result.breakdown.ch4} kg CO₂e</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Nitrous Oxide (N₂O):</span>
                        <span className="font-medium">{result.breakdown.n2o} kg CO₂e</span>
                      </div>
                    </div>
                  </div>

                  {/* Environmental Impact */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-text-primary mb-3">Environmental Impact</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Trees needed to offset:</span>
                        <span className="font-medium text-green-600">{result.comparison.treesNeeded} trees/year</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Equivalent to:</span>
                        <span className="font-medium text-orange-600">{result.comparison.equivalentCars} car-years</span>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-text-primary mb-3">Recommendations</h4>
                    <ul className="space-y-1 text-sm text-text-secondary">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={resetCalculator}
                    className="w-full px-4 py-2 border border-gray-300 text-text-primary rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Reset Calculator
                  </button>
                </>
              ) : (
                <div className="flex items-center justify-center h-64 text-text-secondary">
                  <div className="text-center">
                    <CalculatorIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Enter vehicle information and click calculate to see results</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}