'use client'

import { useState } from 'react'
import { 
  TruckIcon, 
  PlusIcon,
  CogIcon,
  MapPinIcon,
  Battery100Icon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { useAppStore } from '@/lib/store'
import { formatDistance, formatEmissions } from '@/lib/utils'

interface Vehicle {
  id: string
  name: string
  type: 'diesel' | 'petrol' | 'ev'
  status: 'active' | 'maintenance' | 'offline'
  currentLocation: string
  battery?: number
  lastUpdate: string
  totalDistance: number
  totalEmissions: number
  efficiency: number
}

const mockVehicles: Vehicle[] = [
  {
    id: '1',
    name: 'Truck-001',
    type: 'diesel',
    status: 'active',
    currentLocation: 'Downtown Warehouse',
    lastUpdate: '2 min ago',
    totalDistance: 45000,
    totalEmissions: 850,
    efficiency: 87
  },
  {
    id: '2',
    name: 'EV-001',
    type: 'ev',
    status: 'active',
    currentLocation: 'Suburban Route',
    battery: 75,
    lastUpdate: '5 min ago',
    totalDistance: 32000,
    totalEmissions: 0,
    efficiency: 95
  },
  {
    id: '3',
    name: 'Truck-002',
    type: 'petrol',
    status: 'maintenance',
    currentLocation: 'Service Center',
    lastUpdate: '1 hour ago',
    totalDistance: 28000,
    totalEmissions: 520,
    efficiency: 82
  }
]

export default function FleetPage() {
  const { addNotification } = useAppStore()
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [showAddVehicle, setShowAddVehicle] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800'
      case 'offline':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'ev':
        return <Battery100Icon className="h-6 w-6 text-accent" />
      default:
        return <TruckIcon className="h-6 w-6 text-primary" />
    }
  }

  const handleAddVehicle = () => {
    addNotification({
      type: 'success',
      message: 'Vehicle added successfully!'
    })
    setShowAddVehicle(false)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Fleet Management
          </h1>
          <p className="text-text-secondary mt-2">
            Monitor and manage your delivery fleet in real-time.
          </p>
        </div>
        
        <button
          onClick={() => setShowAddVehicle(true)}
          className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Vehicle
        </button>
      </div>

      {/* Fleet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <TruckIcon className="h-8 w-8 text-primary mx-auto mb-3" />
          <p className="text-2xl font-bold text-text-primary">{vehicles.length}</p>
          <p className="text-sm text-text-secondary">Total Vehicles</p>
        </div>
        
        <div className="card text-center">
          <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-green-600 text-sm font-bold">
              {vehicles.filter(v => v.status === 'active').length}
            </span>
          </div>
          <p className="text-2xl font-bold text-text-primary">
            {vehicles.filter(v => v.status === 'active').length}
          </p>
          <p className="text-sm text-text-secondary">Active</p>
        </div>
        
        <div className="card text-center">
          <Battery100Icon className="h-8 w-8 text-accent mx-auto mb-3" />
          <p className="text-2xl font-bold text-text-primary">
            {vehicles.filter(v => v.type === 'ev').length}
          </p>
          <p className="text-sm text-text-secondary">Electric</p>
        </div>
        
        <div className="card text-center">
          <CogIcon className="h-8 w-8 text-warning mx-auto mb-3" />
          <p className="text-2xl font-bold text-text-primary">
            {vehicles.filter(v => v.status === 'maintenance').length}
          </p>
          <p className="text-sm text-text-secondary">In Maintenance</p>
        </div>
      </div>

      {/* Vehicle List */}
      <div className="card">
        <h2 className="text-xl font-semibold text-text-primary mb-6">
          Vehicle Status
        </h2>
        
        <div className="space-y-4">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer"
              onClick={() => setSelectedVehicle(vehicle)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getVehicleIcon(vehicle.type)}
                  <div>
                    <h3 className="font-medium text-text-primary">{vehicle.name}</h3>
                    <p className="text-sm text-text-secondary capitalize">{vehicle.type} Vehicle</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-text-primary">
                      {vehicle.currentLocation}
                    </p>
                    <p className="text-xs text-text-secondary">{vehicle.lastUpdate}</p>
                  </div>
                  
                  {vehicle.type === 'ev' && vehicle.battery && (
                    <div className="flex items-center space-x-2">
                      <Battery100Icon className="h-5 w-5 text-accent" />
                      <span className="text-sm font-medium text-text-primary">
                        {vehicle.battery}%
                      </span>
                    </div>
                  )}
                  
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${getStatusColor(vehicle.status)}
                  `}>
                    {vehicle.status}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-text-secondary">Total Distance</p>
                    <p className="font-medium text-text-primary">
                      {formatDistance(vehicle.totalDistance)}
                    </p>
                  </div>
                  <div>
                    <p className="text-text-secondary">Emissions</p>
                    <p className="font-medium text-text-primary">
                      {formatEmissions(vehicle.totalEmissions)}
                    </p>
                  </div>
                  <div>
                    <p className="text-text-secondary">Efficiency</p>
                    <p className="font-medium text-text-primary">{vehicle.efficiency}%</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vehicle Details Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-text-primary">
                {selectedVehicle.name} Details
              </h2>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="text-text-secondary hover:text-text-primary"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Vehicle Type
                  </label>
                  <p className="text-text-primary capitalize">{selectedVehicle.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Status
                  </label>
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${getStatusColor(selectedVehicle.status)}
                  `}>
                    {selectedVehicle.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Current Location
                  </label>
                  <p className="text-text-primary">{selectedVehicle.currentLocation}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Last Update
                  </label>
                  <p className="text-text-primary">{selectedVehicle.lastUpdate}</p>
                </div>
              </div>
              
              {selectedVehicle.type === 'ev' && selectedVehicle.battery && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Battery Level
                  </label>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-accent h-3 rounded-full transition-all duration-300"
                      style={{ width: `${selectedVehicle.battery}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-text-secondary mt-1">
                    {selectedVehicle.battery}% remaining
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-text-primary">
                    {formatDistance(selectedVehicle.totalDistance)}
                  </p>
                  <p className="text-sm text-text-secondary">Total Distance</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-text-primary">
                    {formatEmissions(selectedVehicle.totalEmissions)}
                  </p>
                  <p className="text-sm text-text-secondary">Total Emissions</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-text-primary">
                    {selectedVehicle.efficiency}%
                  </p>
                  <p className="text-sm text-text-secondary">Efficiency</p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  View Route History
                </button>
                <button className="flex-1 bg-surface text-text-primary border border-gray-300 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Schedule Maintenance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAddVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-text-primary">
                Add New Vehicle
              </h2>
              <button
                onClick={() => setShowAddVehicle(false)}
                className="text-text-secondary hover:text-text-primary"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Vehicle Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Truck-003"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Vehicle Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent">
                  <option value="diesel">Diesel</option>
                  <option value="petrol">Petrol</option>
                  <option value="ev">Electric</option>
                </select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleAddVehicle}
                  className="flex-1 bg-accent text-white py-3 px-6 rounded-lg font-medium hover:bg-accent/90 transition-colors"
                >
                  Add Vehicle
                </button>
                <button
                  onClick={() => setShowAddVehicle(false)}
                  className="flex-1 bg-surface text-text-primary border border-gray-300 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 