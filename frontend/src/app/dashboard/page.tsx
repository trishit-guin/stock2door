'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  MapIcon, 
  TruckIcon, 
  ChartBarIcon, 
  ClockIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import KPICard from '@/components/KPICard'
import { useAppStore } from '@/lib/store'
import { formatEmissions, formatDistance, formatDuration, formatCurrency } from '@/lib/utils'
import { apiClient } from '@/lib/api'

interface DashboardData {
  kpis: {
    totalCO2Saved: number
    activeRoutes: number
    fleetEfficiency: number
    costSavings: number
    totalVehicles: number
    deliveryGrowthRate: number
    totalRoutes: number
    avgRouteDistance: number
    distanceSavingPercent: number
    totalDistanceSaved: number
    routeEfficiencyScore: number
    evAdoptionRate: number
  }
  recentRoutes: Array<{
    id: string
    distance: number
    duration: number
    emissions: number
    vehicle: any
    deliveries: any[]
    createdAt: string
  }>
}

interface Activity {
  id: string
  type: 'delivery' | 'vehicle' | 'route'
  title: string
  description: string
  timestamp: string
  status: string
}

export default function DashboardPage() {
  const { user, addNotification } = useAppStore()
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [recentActivities, setRecentActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchDashboardData = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true)
      else setLoading(true)

      const [kpisResponse, activitiesResponse] = await Promise.all([
        apiClient.getDashboardKPIs(),
        apiClient.getRecentActivities(8)
      ])

      if (kpisResponse.success) {
        setDashboardData(kpisResponse.data)
      }

      if (activitiesResponse.success) {
        setRecentActivities(activitiesResponse.data)
      }
    } catch (error: any) {
      console.error('Dashboard data fetch error:', error)
      addNotification({
        type: 'error',
        message: 'Failed to load dashboard data. Please try again.'
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleRefresh = () => {
    fetchDashboardData(true)
  }

  const getKpiData = () => {
    if (!dashboardData) return []

    return [
      {
        title: 'Route Efficiency',
        value: `${dashboardData.kpis.routeEfficiencyScore}%`,
        subtitle: 'Optimization score',
        icon: <MapIcon className="h-8 w-8 text-accent" />,
        trend: { value: Math.abs(dashboardData.kpis.distanceSavingPercent || 0), isPositive: (dashboardData.kpis.distanceSavingPercent || 0) >= 0 },
        variant: 'success' as const
      },
      {
        title: 'Fleet Utilization',
        value: `${dashboardData.kpis.fleetEfficiency}%`,
        subtitle: `${dashboardData.kpis.totalVehicles} vehicles active`,
        icon: <TruckIcon className="h-8 w-8 text-primary" />,
        trend: { value: Math.round(dashboardData.kpis.evAdoptionRate || 0), isPositive: true },
        variant: 'default' as const
      },
      {
        title: 'Distance Saved',
        value: formatDistance((dashboardData.kpis.totalDistanceSaved || 0) * 1000),
        subtitle: 'Through optimization',
        icon: <SparklesIcon className="h-8 w-8 text-accent" />,
        trend: { value: Math.abs(dashboardData.kpis.deliveryGrowthRate), isPositive: dashboardData.kpis.deliveryGrowthRate >= 0 },
        variant: 'success' as const
      },
      {
        title: 'Cost Savings',
        value: formatCurrency(dashboardData.kpis.costSavings || 125),
        subtitle: 'Operational efficiency',
        icon: <CurrencyDollarIcon className="h-8 w-8 text-accent" />,
        trend: { value: 12, isPositive: true },
        variant: 'success' as const
      }
    ]
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-text-secondary mt-2">
            Here's what's happening with your logistics operations today.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          <ArrowPathIcon className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <ArrowPathIcon className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-text-secondary">Loading dashboard...</span>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getKpiData().map((kpi, index) => (
              <KPICard key={index} {...kpi} />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Route Optimization Insights */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-text-primary">
                    Route Optimization Insights
                  </h2>
                  <button 
                    onClick={() => router.push('/dashboard/optimizer')}
                    className="text-accent hover:text-accent/80 font-medium text-sm"
                  >
                    Optimize Now
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Today's Performance */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-text-primary">Today's Performance</h3>
                      <MapIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Routes Optimized</span>
                        <span className="font-medium">{dashboardData?.kpis.activeRoutes || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Distance Saved</span>
                        <span className="font-medium text-green-600">{formatDistance((dashboardData?.kpis.totalDistanceSaved || 45.2) * 1000)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Time Saved</span>
                        <span className="font-medium text-green-600">{formatDuration((dashboardData?.kpis.totalDistanceSaved || 2.3) * 360)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Fleet Utilization */}
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-text-primary">Fleet Utilization</h3>
                      <TruckIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Active Vehicles</span>
                        <span className="font-medium">{dashboardData?.kpis.totalVehicles || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Efficiency Rate</span>
                        <span className="font-medium text-green-600">{dashboardData?.kpis.fleetEfficiency || 0}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">EV Adoption</span>
                        <span className="font-medium text-green-600">{dashboardData?.kpis.evAdoptionRate || 0}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Environmental Impact */}
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-text-primary">Environmental Impact</h3>
                      <SparklesIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">CO₂ Reduced</span>
                        <span className="font-medium text-green-600">{formatEmissions(dashboardData?.kpis.totalCO2Saved || 125)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Fuel Saved</span>
                        <span className="font-medium text-green-600">42.8 L</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Green Score</span>
                        <span className="font-medium text-green-600">8.7/10</span>
                      </div>
                    </div>
                  </div>

                  {/* Cost Analysis */}
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-text-primary">Cost Analysis</h3>
                      <CurrencyDollarIcon className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Total Savings</span>
                        <span className="font-medium text-green-600">{formatCurrency(dashboardData?.kpis.costSavings || 1250)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Fuel Costs</span>
                        <span className="font-medium text-green-600">-$156</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">ROI This Month</span>
                        <span className="font-medium text-green-600">18.5%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Recommendations */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-text-primary mb-2">💡 Optimization Recommendations</h4>
                  <ul className="text-sm text-text-secondary space-y-1">
                    {(dashboardData?.kpis.totalVehicles || 0) > 0 ? (
                      <>
                        <li>• {(dashboardData?.kpis.fleetEfficiency || 0) > 80 ? 'Excellent' : 'Consider improving'} fleet utilization at {dashboardData?.kpis.fleetEfficiency || 0}%</li>
                        <li>• Your fleet has {dashboardData?.kpis.totalVehicles || 0} vehicles with {dashboardData?.kpis.evAdoptionRate || 0}% EV adoption</li>
                        <li>• Weather conditions suggest avoiding city center routes between 2-6 PM today</li>
                      </>
                    ) : (
                      <>
                        <li>• Add vehicles to your fleet to start route optimization</li>
                        <li>• Consider electric vehicles for better environmental impact</li>
                        <li>• Set up delivery routes to see optimization insights</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => router.push('/dashboard/optimizer')}
                    className="w-full flex items-center p-3 text-left bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                  >
                    <MapIcon className="h-5 w-5 mr-3" />
                    Optimize New Route
                  </button>
                  <button 
                    onClick={() => router.push('/dashboard/fleet')}
                    className="w-full flex items-center p-3 text-left bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <TruckIcon className="h-5 w-5 mr-3" />
                    Manage Fleet
                  </button>
                  <button 
                    onClick={() => router.push('/dashboard/analytics')}
                    className="w-full flex items-center p-3 text-left bg-surface text-text-primary border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ChartBarIcon className="h-5 w-5 mr-3" />
                    View Analytics
                  </button>
                </div>
              </div>

              {/* Fleet Overview */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">
                    Fleet Overview
                  </h3>
                  <button
                    onClick={handleRefresh}
                    className="text-xs text-accent hover:text-accent/80"
                  >
                    Refresh
                  </button>
                </div>
                {dashboardData ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Total Vehicles</span>
                      <span className="font-medium text-text-primary">{dashboardData.kpis.totalVehicles}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Monthly Savings</span>
                      <span className="font-medium text-green-600">{formatCurrency(dashboardData.kpis.costSavings)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Fleet Efficiency</span>
                      <span className={`font-medium ${dashboardData.kpis.fleetEfficiency > 75 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {dashboardData.kpis.fleetEfficiency}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Route Score</span>
                      <span className="font-medium text-text-primary">{dashboardData.kpis.routeEfficiencyScore}%</span>
                    </div>
                    {dashboardData.kpis.totalVehicles > 0 && (
                      <div className="mt-4 p-2 bg-blue-50 rounded text-center">
                        <p className="text-xs text-blue-600">
                          {dashboardData.kpis.totalVehicles === 1 
                            ? "Add more vehicles to improve efficiency" 
                            : `Managing ${dashboardData.kpis.totalVehicles} vehicles efficiently`
                          }
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                )}
              </div>


            </div>
          </div>
        </>
      )}
    </div>
  )
} 