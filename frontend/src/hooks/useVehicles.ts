import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'
import type { Vehicle, ApiResponse } from '@/types'

interface UseVehiclesOptions {
  warehouseId?: string
  status?: string
  autoFetch?: boolean
}

interface UseVehiclesReturn {
  vehicles: Vehicle[]
  loading: boolean
  error: string | null
  fetchVehicles: () => Promise<void>
  getVehicle: (id: string) => Promise<Vehicle | null>
  createVehicle: (data: Partial<Vehicle>) => Promise<Vehicle | null>
  updateVehicle: (id: string, data: Partial<Vehicle>) => Promise<Vehicle | null>
  deleteVehicle: (id: string) => Promise<boolean>
  getAvailableVehicles: (warehouseId: string, capacity?: number) => Promise<Vehicle[]>
  assignDriver: (vehicleId: string, driverId: string) => Promise<Vehicle | null>
  updateLocation: (vehicleId: string, latitude: number, longitude: number, address?: string) => Promise<Vehicle | null>
  assignLoad: (vehicleId: string, loadWeight: number) => Promise<Vehicle | null>
  clearLoad: (vehicleId: string) => Promise<Vehicle | null>
  addMaintenance: (vehicleId: string, data: any) => Promise<Vehicle | null>
  getMaintenanceHistory: (vehicleId: string) => Promise<any[]>
}

export function useVehicles(options: UseVehiclesOptions = {}): UseVehiclesReturn {
  const { warehouseId, status, autoFetch = true } = options
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchVehicles = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params: any = {}
      if (warehouseId) params.warehouseId = warehouseId
      if (status) params.status = status
      
      const response: ApiResponse<Vehicle[]> = await api.getVehicles(params)
      
      if (response.success && response.data) {
        setVehicles(response.data)
      } else {
        throw new Error(response.message || 'Failed to fetch vehicles')
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch vehicles'
      setError(message)
      setVehicles([])
    } finally {
      setLoading(false)
    }
  }, [warehouseId, status])

  const getVehicle = useCallback(async (id: string): Promise<Vehicle | null> => {
    try {
      const response: ApiResponse<Vehicle> = await api.getVehicle(id)
      if (response.success && response.data) {
        return response.data
      }
      throw new Error(response.message || 'Failed to fetch vehicle')
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch vehicle'
      setError(message)
      return null
    }
  }, [])

  const createVehicle = useCallback(async (data: Partial<Vehicle>): Promise<Vehicle | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const response: ApiResponse<Vehicle> = await api.createVehicle(data)
      
      if (response.success && response.data) {
        setVehicles(prev => [...prev, response.data!])
        return response.data
      }
      throw new Error(response.message || 'Failed to create vehicle')
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to create vehicle'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateVehicle = useCallback(async (id: string, data: Partial<Vehicle>): Promise<Vehicle | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const response: ApiResponse<Vehicle> = await api.updateVehicle(id, data)
      
      if (response.success && response.data) {
        setVehicles(prev => prev.map(v => v._id === id ? response.data! : v))
        return response.data
      }
      throw new Error(response.message || 'Failed to update vehicle')
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to update vehicle'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteVehicle = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      const response: ApiResponse = await api.deleteVehicle(id)
      
      if (response.success) {
        setVehicles(prev => prev.filter(v => v._id !== id))
        return true
      }
      throw new Error(response.message || 'Failed to delete vehicle')
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to delete vehicle'
      setError(message)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const getAvailableVehicles = useCallback(async (warehouseId: string, capacity?: number): Promise<Vehicle[]> => {
    try {
      const response: ApiResponse<Vehicle[]> = await api.getAvailableVehicles(warehouseId, capacity)
      if (response.success && response.data) {
        return response.data
      }
      throw new Error(response.message || 'Failed to fetch available vehicles')
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch available vehicles'
      setError(message)
      return []
    }
  }, [])

  const assignDriver = useCallback(async (vehicleId: string, driverId: string): Promise<Vehicle | null> => {
    try {
      const response: ApiResponse<Vehicle> = await api.assignDriver(vehicleId, driverId)
      
      if (response.success && response.data) {
        setVehicles(prev => prev.map(v => v._id === vehicleId ? response.data! : v))
        return response.data
      }
      throw new Error(response.message || 'Failed to assign driver')
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to assign driver'
      setError(message)
      return null
    }
  }, [])

  const updateLocation = useCallback(async (
    vehicleId: string, 
    latitude: number, 
    longitude: number, 
    address?: string
  ): Promise<Vehicle | null> => {
    try {
      const response: ApiResponse<Vehicle> = await api.updateVehicleLocation(vehicleId, latitude, longitude, address)
      
      if (response.success && response.data) {
        setVehicles(prev => prev.map(v => v._id === vehicleId ? response.data! : v))
        return response.data
      }
      throw new Error(response.message || 'Failed to update location')
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to update location'
      setError(message)
      return null
    }
  }, [])

  const assignLoad = useCallback(async (vehicleId: string, loadWeight: number): Promise<Vehicle | null> => {
    try {
      const response: ApiResponse<Vehicle> = await api.assignLoad(vehicleId, loadWeight)
      
      if (response.success && response.data) {
        setVehicles(prev => prev.map(v => v._id === vehicleId ? response.data! : v))
        return response.data
      }
      throw new Error(response.message || 'Failed to assign load')
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to assign load'
      setError(message)
      return null
    }
  }, [])

  const clearLoad = useCallback(async (vehicleId: string): Promise<Vehicle | null> => {
    try {
      const response: ApiResponse<Vehicle> = await api.clearLoad(vehicleId)
      
      if (response.success && response.data) {
        setVehicles(prev => prev.map(v => v._id === vehicleId ? response.data! : v))
        return response.data
      }
      throw new Error(response.message || 'Failed to clear load')
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to clear load'
      setError(message)
      return null
    }
  }, [])

  const addMaintenance = useCallback(async (vehicleId: string, data: any): Promise<Vehicle | null> => {
    try {
      const response: ApiResponse<Vehicle> = await api.addMaintenance(vehicleId, data)
      
      if (response.success && response.data) {
        setVehicles(prev => prev.map(v => v._id === vehicleId ? response.data! : v))
        return response.data
      }
      throw new Error(response.message || 'Failed to add maintenance record')
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to add maintenance record'
      setError(message)
      return null
    }
  }, [])

  const getMaintenanceHistory = useCallback(async (vehicleId: string): Promise<any[]> => {
    try {
      const response: ApiResponse<any[]> = await api.getMaintenanceHistory(vehicleId)
      if (response.success && response.data) {
        return response.data
      }
      throw new Error(response.message || 'Failed to fetch maintenance history')
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch maintenance history'
      setError(message)
      return []
    }
  }, [])

  useEffect(() => {
    if (autoFetch) {
      fetchVehicles()
    }
  }, [autoFetch, fetchVehicles])

  return {
    vehicles,
    loading,
    error,
    fetchVehicles,
    getVehicle,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    getAvailableVehicles,
    assignDriver,
    updateLocation,
    assignLoad,
    clearLoad,
    addMaintenance,
    getMaintenanceHistory,
  }
}
