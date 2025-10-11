'use client'

import { useState, useEffect } from 'react'
import { 
  TruckIcon, 
  PlusIcon,
  CogIcon,
  Battery100Icon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { useAppStore } from '@/lib/store'
import { apiClient } from '@/lib/api'

interface Vehicle {
  _id: string
  type: string
  make: string
  model: string
  year: number
  fuelType: string
  vehicleNumber: string
  capacity: number
  assignedCluster?: string
  createdAt: string
}

interface VehicleFormData {
  type: string
  make: string
  model: string
  year: number
  fuelType: string
  vehicleNumber: string
}

export default function FleetPage() {
  const { addNotification } = useAppStore()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [showAddVehicle, setShowAddVehicle] = useState(false)
  const [showEditVehicle, setShowEditVehicle] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [formData, setFormData] = useState<VehicleFormData>({
    type: 'LCV',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    fuelType: 'DIESEL',
    vehicleNumber: ''
  })

  // Fetch vehicles from backend
  const fetchVehicles = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getVehicles()
      if (response.success) {
        setVehicles(response.data || [])
      } else {
        addNotification({
          type: 'error',
          message: 'Failed to fetch vehicles'
        })
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error)
      addNotification({
        type: 'error',
        message: 'Error connecting to server. Please check if backend is running.'
      })
      setVehicles([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  const getDisplayName = (vehicle: Vehicle) => 
    `${vehicle.make} ${vehicle.model} (${vehicle.year})`

  const getStatusColor = (fuelType: string) => {
    switch (fuelType) {
      case 'ELECTRIC':
        return 'bg-green-100 text-green-800'
      case 'DIESEL':
        return 'bg-yellow-100 text-yellow-800'
      case 'PETROL':
        return 'bg-blue-100 text-blue-800'
      case 'CNG':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getVehicleIcon = (fuelType: string) => {
    if (fuelType === 'ELECTRIC') {
      return <Battery100Icon className="h-6 w-6 text-green-600" />
    }
    return <TruckIcon className="h-6 w-6 text-blue-600" />
  }

  const handleAddVehicle = async () => {
    try {
      if (!formData.make || !formData.model || !formData.vehicleNumber) {
        addNotification({
          type: 'error',
          message: 'Please fill in all required fields'
        })
        return
      }

      const response = await apiClient.createVehicle(formData)
      if (response.success) {
        addNotification({
          type: 'success',
          message: 'Vehicle added successfully!'
        })
        setShowAddVehicle(false)
        setFormData({
          type: 'LCV',
          make: '',
          model: '',
          year: new Date().getFullYear(),
          fuelType: 'DIESEL',
          vehicleNumber: ''
        })
        fetchVehicles()
      } else {
        addNotification({
          type: 'error',
          message: response.error || 'Failed to add vehicle'
        })
      }
    } catch (error) {
      console.error('Error adding vehicle:', error)
      addNotification({
        type: 'error',
        message: 'Error connecting to server'
      })
    }
  }

  const handleEditVehicle = async () => {
    try {
      if (!formData.make || !formData.model || !formData.vehicleNumber || !selectedVehicle) {
        addNotification({
          type: 'error',
          message: 'Please fill in all required fields'
        })
        return
      }

      const response = await apiClient.updateVehicle(selectedVehicle._id, formData)
      if (response.success) {
        addNotification({
          type: 'success',
          message: 'Vehicle updated successfully!'
        })
        setShowEditVehicle(false)
        setSelectedVehicle(null)
        fetchVehicles()
      } else {
        addNotification({
          type: 'error',
          message: response.error || 'Failed to update vehicle'
        })
      }
    } catch (error) {
      console.error('Error updating vehicle:', error)
      addNotification({
        type: 'error',
        message: 'Error connecting to server'
      })
    }
  }

  const handleDeleteVehicle = async (vehicleId: string) => {
    try {
      const response = await apiClient.deleteVehicle(vehicleId)
      if (response.success) {
        addNotification({
          type: 'success',
          message: 'Vehicle deleted successfully!'
        })
        fetchVehicles()
        setSelectedVehicle(null)
        setShowDeleteConfirm(null)
      } else {
        addNotification({
          type: 'error',
          message: response.error || 'Failed to delete vehicle'
        })
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      addNotification({
        type: 'error',
        message: 'Error connecting to server'
      })
    }
  }

  const openEditModal = (vehicle: Vehicle) => {
    setFormData({
      type: vehicle.type,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      fuelType: vehicle.fuelType,
      vehicleNumber: vehicle.vehicleNumber
    })
    setSelectedVehicle(vehicle)
    setShowEditVehicle(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading vehicles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Fleet Management
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor and manage your delivery fleet in real-time.
          </p>
        </div>
        
        <button
          onClick={() => setShowAddVehicle(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Vehicle
        </button>
      </div>

      {/* Fleet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <TruckIcon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{vehicles.length}</p>
          <p className="text-sm text-gray-600">Total Vehicles</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-green-600 text-sm font-bold">
              {vehicles.filter(v => v.fuelType === 'ELECTRIC').length}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {vehicles.filter(v => v.fuelType === 'ELECTRIC').length}
          </p>
          <p className="text-sm text-gray-600">Electric</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <Battery100Icon className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">
            {vehicles.filter(v => v.fuelType === 'DIESEL').length}
          </p>
          <p className="text-sm text-gray-600">Diesel</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <CogIcon className="h-8 w-8 text-orange-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">
            {Math.round(vehicles.reduce((acc, v) => acc + v.capacity, 0) / vehicles.length) || 0}
          </p>
          <p className="text-sm text-gray-600">Avg Capacity (kg)</p>
        </div>
      </div>

      {/* Vehicle List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Vehicle Fleet
          </h2>
        </div>
        
        <div className="p-6">
          {vehicles.length === 0 ? (
            <div className="text-center py-12">
              <TruckIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">No vehicles in your fleet</p>
              <p className="text-gray-500 mb-6">Add your first vehicle to get started</p>
              <button
                onClick={() => setShowAddVehicle(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Vehicle
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer"
                  onClick={() => setSelectedVehicle(vehicle)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getVehicleIcon(vehicle.fuelType)}
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {getDisplayName(vehicle)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {vehicle.vehicleNumber} • {vehicle.type} • {vehicle.fuelType}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          Capacity: {vehicle.capacity} kg
                        </p>
                        <p className="text-xs text-gray-600">
                          Vehicle: {vehicle.type}
                        </p>
                      </div>
                      
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.fuelType)}`}>
                        {vehicle.fuelType}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Vehicle Type</p>
                        <p className="font-medium text-gray-900">{vehicle.type}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Capacity</p>
                        <p className="font-medium text-gray-900">
                          {vehicle.capacity} kg
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Year</p>
                        <p className="font-medium text-gray-900">{vehicle.year}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Vehicle Details Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {getDisplayName(selectedVehicle)} Details
              </h2>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Make & Model
                  </label>
                  <p className="text-gray-900">{selectedVehicle.make} {selectedVehicle.model}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Vehicle Number
                  </label>
                  <p className="text-gray-900">{selectedVehicle.vehicleNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Year
                  </label>
                  <p className="text-gray-900">{selectedVehicle.year}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Vehicle Type
                  </label>
                  <p className="text-gray-900">{selectedVehicle.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Fuel Type
                  </label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedVehicle.fuelType)}`}>
                    {selectedVehicle.fuelType}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedVehicle.capacity}
                  </p>
                  <p className="text-sm text-gray-600">Capacity (kg)</p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => openEditModal(selectedVehicle)}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Edit Vehicle
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(selectedVehicle._id)}
                  className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Delete Vehicle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAddVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Add New Vehicle
              </h2>
              <button
                onClick={() => setShowAddVehicle(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Make *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Tata"
                    value={formData.make}
                    onChange={(e) => setFormData({...formData, make: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Model *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Ace"
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Vehicle Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g., MH01AB1234"
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Vehicle Type
                  </label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="LCV">LCV (Light Commercial Vehicle)</option>
                    <option value="MCV">MCV (Medium Commercial Vehicle)</option>
                    <option value="HCV">HCV (Heavy Commercial Vehicle)</option>
                    <option value="THREE_WHEELER">Three Wheeler</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Year
                  </label>
                  <input
                    type="number"
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Fuel Type
                </label>
                <select 
                  value={formData.fuelType}
                  onChange={(e) => setFormData({...formData, fuelType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="DIESEL">Diesel</option>
                  <option value="PETROL">Petrol</option>
                  <option value="CNG">CNG (Compressed Natural Gas)</option>
                  <option value="ELECTRIC">Electric</option>
                </select>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Default Values (Auto-assigned)</h4>
                <div className="text-xs text-gray-600">
                  <p><strong>Capacity:</strong> LCV: 1000kg, MCV: 5000kg, HCV: 15000kg, Three Wheeler: 500kg</p>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleAddVehicle}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Add Vehicle
                </button>
                <button
                  onClick={() => setShowAddVehicle(false)}
                  className="flex-1 bg-white text-gray-900 border border-gray-300 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Vehicle Modal */}
      {showEditVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Edit Vehicle
              </h2>
              <button
                onClick={() => {
                  setShowEditVehicle(false)
                  setSelectedVehicle(null)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Make *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Tata"
                    value={formData.make}
                    onChange={(e) => setFormData({...formData, make: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Model *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Ace"
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Vehicle Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g., MH01AB1234"
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Vehicle Type
                  </label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="LCV">LCV (Light Commercial Vehicle)</option>
                    <option value="MCV">MCV (Medium Commercial Vehicle)</option>
                    <option value="HCV">HCV (Heavy Commercial Vehicle)</option>
                    <option value="THREE_WHEELER">Three Wheeler</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Year
                  </label>
                  <input
                    type="number"
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Fuel Type
                </label>
                <select 
                  value={formData.fuelType}
                  onChange={(e) => setFormData({...formData, fuelType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="DIESEL">Diesel</option>
                  <option value="PETROL">Petrol</option>
                  <option value="CNG">CNG (Compressed Natural Gas)</option>
                  <option value="ELECTRIC">Electric</option>
                </select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleEditVehicle}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Update Vehicle
                </button>
                <button
                  onClick={() => {
                    setShowEditVehicle(false)
                    setSelectedVehicle(null)
                  }}
                  className="flex-1 bg-white text-gray-900 border border-gray-300 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Delete Vehicle
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete this vehicle? This action cannot be undone.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => handleDeleteVehicle(showDeleteConfirm)}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 bg-white text-gray-900 border border-gray-300 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
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