import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'
import type { Delivery, Route, ApiResponse } from '@/types'

interface UseDeliveriesOptions {
  warehouseId?: string
  status?: string
  vehicleId?: string
  autoFetch?: boolean
}

interface UseDeliveriesReturn {
  deliveries: Delivery[]
  loading: boolean
  error: string | null
  fetchDeliveries: () => Promise<void>
  getDelivery: (id: string) => Promise<Delivery | null>
  createDelivery: (data: Partial<Delivery>) => Promise<Delivery | null>
  updateDelivery: (id: string, data: Partial<Delivery>) => Promise<Delivery | null>
  deleteDelivery: (id: string) => Promise<boolean>
  optimizeRoute: (deliveryId: string, objective?: string) => Promise<Route | null>
  startDelivery: (deliveryId: string) => Promise<Delivery | null>
  completeDelivery: (deliveryId: string) => Promise<Delivery | null>
  cancelDelivery: (deliveryId: string, reason: string) => Promise<Delivery | null>
  addTracking: (deliveryId: string, latitude: number, longitude: number, status: string, note?: string) => Promise<Delivery | null>
}

export function useDeliveries(options: UseDeliveriesOptions = {}): UseDeliveriesReturn {
  const { warehouseId, status, vehicleId, autoFetch = true } = options
  
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDeliveries = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params: any = {}
      if (warehouseId) params.warehouseId = warehouseId
      if (status) params.status = status
      if (vehicleId) params.vehicleId = vehicleId
      
      const response: ApiResponse<Delivery[]> = await api.getDeliveries(params)
      
      if (response.success && response.data) {
        setDeliveries(response.data)
      } else {
        throw new Error(response.message || 'Failed to fetch deliveries')
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch deliveries'
      setError(message)
      setDeliveries([])
    } finally {
      setLoading(false)
    }
  }, [warehouseId, status, vehicleId])

  const getDelivery = useCallback(async (id: string): Promise<Delivery | null> => {
    try {
      const response: ApiResponse<Delivery> = await api.getDelivery(id)
      if (response.success && response.data) {
        return response.data
      }
      throw new Error(response.message || 'Failed to fetch delivery')
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch delivery'
      setError(message)
      return null
    }
  }, [])

  const createDelivery = useCallback(async (data: Partial<Delivery>): Promise<Delivery | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const response: ApiResponse<Delivery> = await api.createDelivery(data)
      
      if (response.success && response.data) {
        setDeliveries(prev => [...prev, response.data!])
        return response.data
      }
      throw new Error(response.message || 'Failed to create delivery')
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to create delivery'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateDelivery = useCallback(async (id: string, data: Partial<Delivery>): Promise<Delivery | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const response: ApiResponse<Delivery> = await api.updateDelivery(id, data)
      
      if (response.success && response.data) {
        setDeliveries(prev => prev.map(d => d._id === id ? response.data! : d))
        return response.data
      }
      throw new Error(response.message || 'Failed to update delivery')
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to update delivery'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteDelivery = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      const response: ApiResponse = await api.deleteDelivery(id)
      
      if (response.success) {
        setDeliveries(prev => prev.filter(d => d._id !== id))
        return true
      }
      throw new Error(response.message || 'Failed to delete delivery')
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to delete delivery'
      setError(message)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const optimizeRoute = useCallback(async (deliveryId: string, objective: string = 'balanced'): Promise<Route | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const response: ApiResponse<{ delivery: Delivery; route: Route }> = await api.optimizeDeliveryRoute(
        deliveryId, 
        objective
      )
      
      if (response.success && response.data) {
        // Update the delivery with the new route information
        setDeliveries(prev => prev.map(d => 
          d._id === deliveryId ? response.data!.delivery : d
        ))
        return response.data.route
      }
      throw new Error(response.message || 'Failed to optimize route')
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to optimize route'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const startDelivery = useCallback(async (deliveryId: string): Promise<Delivery | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const response: ApiResponse<Delivery> = await api.startDelivery(deliveryId)
      
      if (response.success && response.data) {
        setDeliveries(prev => prev.map(d => d._id === deliveryId ? response.data! : d))
        return response.data
      }
      throw new Error(response.message || 'Failed to start delivery')
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to start delivery'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const completeDelivery = useCallback(async (deliveryId: string): Promise<Delivery | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const response: ApiResponse<Delivery> = await api.completeDelivery(deliveryId)
      
      if (response.success && response.data) {
        setDeliveries(prev => prev.map(d => d._id === deliveryId ? response.data! : d))
        return response.data
      }
      throw new Error(response.message || 'Failed to complete delivery')
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to complete delivery'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const cancelDelivery = useCallback(async (deliveryId: string, reason: string): Promise<Delivery | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const response: ApiResponse<Delivery> = await api.cancelDelivery(deliveryId, reason)
      
      if (response.success && response.data) {
        setDeliveries(prev => prev.map(d => d._id === deliveryId ? response.data! : d))
        return response.data
      }
      throw new Error(response.message || 'Failed to cancel delivery')
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to cancel delivery'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const addTracking = useCallback(async (
    deliveryId: string,
    latitude: number,
    longitude: number,
    status: string,
    note?: string
  ): Promise<Delivery | null> => {
    try {
      const response: ApiResponse<Delivery> = await api.addDeliveryTracking(
        deliveryId,
        latitude,
        longitude,
        status,
        note
      )
      
      if (response.success && response.data) {
        setDeliveries(prev => prev.map(d => d._id === deliveryId ? response.data! : d))
        return response.data
      }
      throw new Error(response.message || 'Failed to add tracking update')
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to add tracking update'
      setError(message)
      return null
    }
  }, [])

  useEffect(() => {
    if (autoFetch) {
      fetchDeliveries()
    }
  }, [autoFetch, fetchDeliveries])

  return {
    deliveries,
    loading,
    error,
    fetchDeliveries,
    getDelivery,
    createDelivery,
    updateDelivery,
    deleteDelivery,
    optimizeRoute,
    startDelivery,
    completeDelivery,
    cancelDelivery,
    addTracking,
  }
}
