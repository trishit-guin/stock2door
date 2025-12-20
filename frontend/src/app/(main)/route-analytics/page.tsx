'use client'

import { useState, useEffect } from 'react'
import { 
  MapPinIcon,
  TruckIcon,
  FireIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'
import { TransportModeComparison } from '@/components/TransportModeComparison'

export default function RouteAnalyticsPage() {
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' })
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [selectedSource, setSelectedSource] = useState('')
  const [selectedDestination, setSelectedDestination] = useState('')

  useEffect(() => {
    fetchWarehouses()
    fetchAnalytics()
  }, [])

  const fetchWarehouses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/warehouses', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setWarehouses(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching warehouses:', error)
    }
  }

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (dateRange.startDate) params.append('startDate', dateRange.startDate)
      if (dateRange.endDate) params.append('endDate', dateRange.endDate)

      const response = await fetch(`http://localhost:5000/api/v1/analytics/sustainability?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ icon: Icon, title, value, change, unit }: any) => (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {change >= 0 ? (
              <ArrowTrendingUpIcon className="w-4 h-4" />
            ) : (
              <ArrowTrendingDownIcon className="w-4 h-4" />
            )}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">
        {value} <span className="text-sm font-normal text-gray-500">{unit}</span>
      </p>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Route Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive route optimization and sustainability insights
          </p>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg border shadow-sm p-4">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Apply Filter'}
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      {analytics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={MapPinIcon}
              title="Total Routes"
              value={analytics.routes?.totalRoutes || 0}
              unit="routes"
            />
            <StatCard
              icon={TruckIcon}
              title="Total Distance"
              value={(analytics.routes?.totalDistance || 0).toFixed(1)}
              unit="km"
            />
            <StatCard
              icon={FireIcon}
              title="CO₂ Saved"
              value={(analytics.routes?.totalCO2Saved || 0).toFixed(2)}
              unit="kg"
              change={12.5}
            />
            <StatCard
              icon={ClockIcon}
              title="Time Saved"
              value={(analytics.routes?.totalTimeSaved || 0).toFixed(1)}
              unit="hrs"
              change={8.3}
            />
          </div>

          {/* Route Analytics Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Optimization Objectives */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Routes by Optimization Objective</h3>
              <div className="space-y-3">
                {Object.entries(analytics.routes?.routesByObjective || {}).map(([objective, count]: [string, any]) => (
                  <div key={objective} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{objective}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${(count / analytics.routes.totalRoutes) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Trends */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Monthly Trends</h3>
              <div className="space-y-4">
                {analytics.routes?.monthlyTrends?.slice(-3).map((trend: any) => (
                  <div key={trend.month} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{trend.month}</span>
                      <span className="text-xs text-gray-500">{trend.totalRoutes} routes</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-gray-600">Distance:</span>
                        <span className="ml-2 font-medium">{trend.totalDistance?.toFixed(1)} km</span>
                      </div>
                      <div>
                        <span className="text-gray-600">CO₂ Saved:</span>
                        <span className="ml-2 font-medium text-green-600">{trend.totalCO2Saved?.toFixed(2)} kg</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery Analytics */}
          {analytics.deliveries && (
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Delivery Performance</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
                  <p className="text-2xl font-bold text-green-600">
                    {(analytics.deliveries.completionRate * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">On-Time Rate</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {(analytics.deliveries.onTimeDeliveryRate * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Avg Destinations</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.deliveries.avgDestinationsPerDelivery?.toFixed(1)}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Avg Time</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(analytics.deliveries.avgDeliveryTime / 60).toFixed(1)} hrs
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Vehicle Utilization */}
          {analytics.vehicles && (
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Fleet Utilization</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">{analytics.vehicles.totalVehicles}</p>
                  <p className="text-sm text-gray-600">Total Vehicles</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{analytics.vehicles.availableVehicles}</p>
                  <p className="text-sm text-gray-600">Available</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{analytics.vehicles.inUseVehicles}</p>
                  <p className="text-sm text-gray-600">In Use</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-600">
                    {(analytics.vehicles.utilizationRate * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600">Utilization</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700">Vehicle Types</h4>
                {Object.entries(analytics.vehicles?.vehiclesByType || {}).map(([type, count]: [string, any]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 uppercase">{type}</span>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Transport Mode Comparison Tool */}
      {selectedSource && selectedDestination && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <TransportModeComparison
            sourceWarehouseId={selectedSource}
            destinationWarehouseId={selectedDestination}
          />
        </div>
      )}

      {/* Warehouse Selection for Comparison */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Compare Transport Modes</h3>
        <p className="text-sm text-gray-600 mb-4">
          Select source and destination warehouses to compare different transport modes
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Source Warehouse
            </label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select source...</option>
              {warehouses.map((wh) => (
                <option key={wh._id} value={wh._id}>
                  {wh.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destination Warehouse
            </label>
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select destination...</option>
              {warehouses.map((wh) => (
                <option key={wh._id} value={wh._id}>
                  {wh.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
