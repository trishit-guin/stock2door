import { useState, useCallback } from 'react'
import api from '@/lib/api'
import type { 
  SustainabilityMetrics, 
  RouteAnalytics, 
  DeliveryAnalytics,
  EmissionAnalytics,
  VehicleUtilization,
  ApiResponse 
} from '@/types'

interface UseAnalyticsReturn {
  loading: boolean
  error: string | null
  getSustainabilityMetrics: (startDate?: string, endDate?: string) => Promise<SustainabilityMetrics | null>
  getRouteAnalytics: (startDate?: string, endDate?: string) => Promise<RouteAnalytics | null>
  getDeliveryAnalytics: (startDate?: string, endDate?: string) => Promise<DeliveryAnalytics | null>
  getEmissionAnalytics: (startDate?: string, endDate?: string) => Promise<EmissionAnalytics | null>
  getVehicleUtilization: (warehouseId?: string) => Promise<VehicleUtilization | null>
  getFleetComparison: (startDate?: string, endDate?: string) => Promise<any | null>
}

export function useAnalytics(): UseAnalyticsReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getSustainabilityMetrics = useCallback(async (
    startDate?: string,
    endDate?: string
  ): Promise<SustainabilityMetrics | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const params: any = {}
      if (startDate) params.startDate = startDate
      if (endDate) params.endDate = endDate
      
      const response: ApiResponse<SustainabilityMetrics> = await api.getSustainabilityMetrics(params)
      
      if (response.success && response.data) {
        return response.data
      }
      throw new Error(response.message || 'Failed to fetch sustainability metrics')
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch sustainability metrics'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getRouteAnalytics = useCallback(async (
    startDate?: string,
    endDate?: string
  ): Promise<RouteAnalytics | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const params: any = {}
      if (startDate) params.startDate = startDate
      if (endDate) params.endDate = endDate
      
      const response: ApiResponse<RouteAnalytics> = await api.getRouteAnalytics(params)
      
      if (response.success && response.data) {
        return response.data
      }
      throw new Error(response.message || 'Failed to fetch route analytics')
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch route analytics'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getDeliveryAnalytics = useCallback(async (
    startDate?: string,
    endDate?: string
  ): Promise<DeliveryAnalytics | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const params: any = {}
      if (startDate) params.startDate = startDate
      if (endDate) params.endDate = endDate
      
      const response: ApiResponse<DeliveryAnalytics> = await api.getDeliveryAnalytics(params)
      
      if (response.success && response.data) {
        return response.data
      }
      throw new Error(response.message || 'Failed to fetch delivery analytics')
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch delivery analytics'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getEmissionAnalytics = useCallback(async (
    startDate?: string,
    endDate?: string
  ): Promise<EmissionAnalytics | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const params: any = {}
      if (startDate) params.startDate = startDate
      if (endDate) params.endDate = endDate
      
      const response: ApiResponse<EmissionAnalytics> = await api.getEmissionAnalytics(params)
      
      if (response.success && response.data) {
        return response.data
      }
      throw new Error(response.message || 'Failed to fetch emission analytics')
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch emission analytics'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getVehicleUtilization = useCallback(async (
    warehouseId?: string
  ): Promise<VehicleUtilization | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const params: any = {}
      if (warehouseId) params.warehouseId = warehouseId
      
      const response: ApiResponse<VehicleUtilization> = await api.getVehicleUtilization(params)
      
      if (response.success && response.data) {
        return response.data
      }
      throw new Error(response.message || 'Failed to fetch vehicle utilization')
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch vehicle utilization'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getFleetComparison = useCallback(async (
    startDate?: string,
    endDate?: string
  ): Promise<any | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const params: any = {}
      if (startDate) params.startDate = startDate
      if (endDate) params.endDate = endDate
      
      const response: ApiResponse<any> = await api.getFleetComparison(params)
      
      if (response.success && response.data) {
        return response.data
      }
      throw new Error(response.message || 'Failed to fetch fleet comparison')
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch fleet comparison'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    getSustainabilityMetrics,
    getRouteAnalytics,
    getDeliveryAnalytics,
    getEmissionAnalytics,
    getVehicleUtilization,
    getFleetComparison,
  }
}
