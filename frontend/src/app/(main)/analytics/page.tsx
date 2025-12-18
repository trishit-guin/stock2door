'use client'

import { useState, useEffect } from 'react'
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  CalendarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import KPICard from '@/components/KPICard'
import { formatEmissions, formatCurrency, formatDistance } from '@/lib/utils'
import { apiClient } from '@/lib/api'
import { useAppStore } from '@/lib/store'

interface AnalyticsData {
  kpis: {
    totalCO2Saved: number
    activeRoutes: number
    fleetEfficiency: number
    costSavings: number
    totalVehicles: number
    evAdoptionRate: number
    routeEfficiencyScore: number
    totalDistanceSaved: number
  }
  fleetComposition: {
    byType: Record<string, number>
    byFuelType: Record<string, number>
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

interface TimeSeriesDataPoint {
  period: string
  emissions: number
  efficiency: number
  costs: number
  distance: number
  target: number
}

interface RouteEfficiencyData {
  routeId: string
  routeName: string
  distance: number
  emissions: number
  efficiency: number
  status: string
  vehicleType: string
  fuelType: string
  deliveries: number
}

const COLORS = ['#E74C3C', '#F39C12', '#27AE60', '#3498DB', '#9B59B6']

// Generate mock emission trend data based on current performance
const generateEmissionData = (currentEmissions: number) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  const target = 1000
  const startEmissions = Math.max(currentEmissions * 1.5, target * 1.2)
  
  return months.map((month, index) => ({
    month,
    emissions: Math.round(startEmissions - (index * (startEmissions - currentEmissions) / 5)),
    target
  }))
}

export default function AnalyticsPage() {
  const { addNotification, user } = useAppStore()
  const [timeRange, setTimeRange] = useState('6m')
  const [selectedMetric, setSelectedMetric] = useState('emissions')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesDataPoint[]>([])
  const [routeEfficiencyData, setRouteEfficiencyData] = useState<RouteEfficiencyData[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchAnalyticsData = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true)
      else setLoading(true)

      // Fetch analytics data from API
      const response = await fetch('/api/analytics')
      
      if (response.ok) {
        const data = await response.json()
        setAnalyticsData(data)
        
        // Generate time series and route efficiency data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
        const timeData = months.map((month, index) => ({
          period: month,
          emissions: Math.round(1200 - (index * 100)),
          efficiency: 75 + (index * 2),
          costs: 85000 - (index * 5000),
          distance: 15000 + (index * 500),
          target: 1000
        }))
        setTimeSeriesData(timeData)
        
        const routeData = data.recentRoutes?.map((route: any, index: number) => ({
          routeId: route.id,
          routeName: route.name || `Route ${index + 1}`,
          distance: route.distance,
          emissions: route.emissions,
          efficiency: 75 + (index * 3),
          status: route.status,
          vehicleType: 'Truck',
          fuelType: 'Diesel',
          deliveries: route.deliveries?.length || 0
        })) || []
        setRouteEfficiencyData(routeData)
        
        addNotification({
          type: 'success',
          message: 'Analytics data loaded successfully'
        })
      } else {
        throw new Error('Failed to fetch')
      }
    } catch (error) {
      console.error('Analytics fetch error:', error)
      addNotification({
        type: 'error',
        message: 'Error loading analytics data'
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleTimeRangeChange = async (newTimeRange: string) => {
    setTimeRange(newTimeRange)
    // Regenerate time series data for new range
    const months = newTimeRange === '1m' ? ['This Week'] : 
                   newTimeRange === '3m' ? ['Month 1', 'Month 2', 'Month 3'] :
                   newTimeRange === '6m' ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] :
                   ['Q1', 'Q2', 'Q3', 'Q4']
    const timeData = months.map((month, index) => ({
      period: month,
      emissions: Math.round(1200 - (index * 100)),
      efficiency: 75 + (index * 2),
      costs: 85000 - (index * 5000),
      distance: 15000 + (index * 500),
      target: 1000
    }))
    setTimeSeriesData(timeData)
    addNotification({
      type: 'success',
      message: `Analytics updated for ${newTimeRange === '1m' ? 'last month' : newTimeRange === '3m' ? 'last 3 months' : newTimeRange === '6m' ? 'last 6 months' : 'last year'}`
    })
  }

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const handleRefresh = () => {
    fetchAnalyticsData(true)
  }


  
  const vehicleData = analyticsData ? Object.entries(analyticsData.fleetComposition.byFuelType).map(([type, count]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase(),
    count,
    percentage: Math.round((count / analyticsData.kpis.totalVehicles) * 100)
  })) : []



  const getKpiData = () => {
    if (!analyticsData) return []
    
    return [
      {
        title: 'Total CO₂ Saved',
        value: formatEmissions(analyticsData.kpis.totalCO2Saved),
        subtitle: 'This month',
        icon: <ArrowTrendingDownIcon className="h-8 w-8 text-accent" />,
        trend: { value: 25, isPositive: true },
        variant: 'success' as const
      },
      {
        title: 'Fleet Efficiency',
        value: `${analyticsData.kpis.fleetEfficiency}%`,
        subtitle: 'Average utilization',
        icon: <ChartBarIcon className="h-8 w-8 text-primary" />,
        trend: { value: Math.round(analyticsData.kpis.evAdoptionRate), isPositive: true },
        variant: 'default' as const
      },
      {
        title: 'Cost Savings',
        value: formatCurrency(analyticsData.kpis.costSavings),
        subtitle: 'This month',
        icon: <ArrowTrendingUpIcon className="h-8 w-8 text-accent" />,
        trend: { value: 18, isPositive: true },
        variant: 'success' as const
      },
      {
        title: 'EV Adoption',
        value: `${analyticsData.kpis.evAdoptionRate}%`,
        subtitle: 'Of total fleet',
        icon: <ChartBarIcon className="h-8 w-8 text-primary" />,
        trend: { value: Math.round(analyticsData.kpis.evAdoptionRate), isPositive: true },
        variant: 'default' as const
      }
    ]
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            {user?.role === 'sustainability_manager' ? 'Environmental Analytics' : 'Analytics & Insights'}
          </h1>
          <p className="text-text-secondary mt-2">
            {user?.role === 'sustainability_manager' 
              ? 'Monitor environmental impact, emissions reduction, and sustainability performance.'
              : 'Track your sustainability metrics and fleet performance.'
            }
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            <ArrowPathIcon className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-text-secondary" />
            <select
              value={timeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:border-accent"
            >
              <option value="1m">Last Month</option>
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <ChartBarIcon className="h-5 w-5 text-text-secondary" />
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:border-accent"
            >
              <option value="emissions">CO₂ Emissions</option>
              <option value="efficiency">Fleet Efficiency</option>
              <option value="costs">Cost Analysis</option>
              <option value="distance">Distance Metrics</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <ArrowPathIcon className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-text-secondary">Loading analytics...</span>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getKpiData().map((kpi, index) => (
              <KPICard key={index} {...kpi} />
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dynamic Metrics Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-primary">
              {selectedMetric === 'emissions' ? 'CO₂ Emissions Trend' :
               selectedMetric === 'efficiency' ? 'Fleet Efficiency Trend' :
               selectedMetric === 'costs' ? 'Cost Savings Analysis' :
               'Distance Optimization Trend'}
            </h2>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <span className="text-sm text-text-secondary">
                {selectedMetric === 'emissions' ? 'Actual Emissions' :
                 selectedMetric === 'efficiency' ? 'Fleet Efficiency' :
                 selectedMetric === 'costs' ? 'Cost Savings' :
                 'Distance Saved'}
              </span>
              {selectedMetric === 'emissions' && (
                <>
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <span className="text-sm text-text-secondary">Target</span>
                </>
              )}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            {selectedMetric === 'emissions' ? (
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [`${value} kg CO₂`, 'Emissions']}
                  labelFormatter={(label) => `Period: ${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="emissions" 
                  stroke="#27AE60" 
                  strokeWidth={3}
                  dot={{ fill: '#27AE60', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#BDC3C7" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#BDC3C7', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            ) : selectedMetric === 'efficiency' ? (
              <BarChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, 'Efficiency']}
                  labelFormatter={(label) => `Period: ${label}`}
                />
                <Bar 
                  dataKey="efficiency" 
                  fill="#3498DB"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            ) : selectedMetric === 'costs' ? (
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [`$${value}`, 'Savings']}
                  labelFormatter={(label) => `Period: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="costs" 
                  stroke="#F39C12" 
                  strokeWidth={3}
                  dot={{ fill: '#F39C12', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            ) : (
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [`${Math.round(value / 1000)} km`, 'Distance Saved']}
                  labelFormatter={(label) => `Period: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="distance" 
                  stroke="#9B59B6" 
                  strokeWidth={3}
                  dot={{ fill: '#9B59B6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Fleet Composition */}
        <div className="card">
          <h2 className="text-xl font-semibold text-text-primary mb-6">
            Fleet Composition by Fuel Type
          </h2>
          {vehicleData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={vehicleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, percentage }) => `${type}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {vehicleData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value} vehicles`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center flex-wrap gap-4 mt-4">
                {vehicleData.map((vehicle: any, index: number) => (
                  <div key={vehicle.type} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-sm text-text-secondary">
                      {vehicle.type} ({vehicle.count})
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-text-secondary">Total Vehicles:</span>
                    <span className="font-medium text-text-primary ml-2">
                      {analyticsData?.kpis.totalVehicles || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-secondary">EV Adoption:</span>
                    <span className="font-medium text-accent ml-2">
                      {analyticsData?.kpis.evAdoptionRate || 0}%
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <ChartBarIcon className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-text-secondary">No fleet data available</p>
              <p className="text-sm text-text-secondary mt-2">Add vehicles to see fleet composition</p>
            </div>
          )}
        </div>
      </div>

      {/* Route Efficiency Table */}
      <div className="card">
        <h2 className="text-xl font-semibold text-text-primary mb-6">
          Route Efficiency Analysis
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-text-primary">Route</th>
                <th className="text-left py-3 px-4 font-medium text-text-primary">Distance</th>
                <th className="text-left py-3 px-4 font-medium text-text-primary">Emissions</th>
                <th className="text-left py-3 px-4 font-medium text-text-primary">Efficiency</th>
                <th className="text-left py-3 px-4 font-medium text-text-primary">Status</th>
              </tr>
            </thead>
            <tbody>
              {routeEfficiencyData.length > 0 ? routeEfficiencyData.map((route, index) => (
                <tr key={route.routeId} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-text-primary">{route.routeName}</td>
                  <td className="py-3 px-4 text-text-secondary">{formatDistance(route.distance * 1000)}</td>
                  <td className="py-3 px-4 text-text-secondary">{formatEmissions(route.emissions)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-accent h-2 rounded-full" 
                          style={{ width: `${route.efficiency}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-text-primary">{route.efficiency}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${route.status === 'Excellent'
                        ? 'bg-green-100 text-green-800' 
                        : route.status === 'Good'
                        ? 'bg-yellow-100 text-yellow-800'
                        : route.status === 'Optimized'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                      }
                    `}>
                      {route.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-text-secondary">
                    <div className="flex flex-col items-center">
                      <ChartBarIcon className="h-16 w-16 text-gray-300 mb-4" />
                      <p>No route efficiency data available</p>
                      <p className="text-sm mt-2">Create routes to see efficiency analysis</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

          {/* Sustainability Goals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Sustainability Goals
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-text-primary">CO₂ Reduction Target</span>
                    <span className="text-sm text-text-secondary">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full" style={{ width: `${Math.min(75, (analyticsData?.kpis.totalCO2Saved || 0) / 10)}%` }}></div>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">
                    {Math.min(75, Math.round((analyticsData?.kpis.totalCO2Saved || 0) / 10))}% achieved
                  </p>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-text-primary">EV Fleet Target</span>
                    <span className="text-sm text-text-secondary">50%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full" style={{ width: `${Math.min(50, analyticsData?.kpis.evAdoptionRate || 0)}%` }}></div>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">
                    {analyticsData?.kpis.evAdoptionRate || 0}% achieved
                  </p>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-text-primary">Fleet Efficiency Target</span>
                    <span className="text-sm text-text-secondary">90%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full" style={{ width: `${Math.min(90, analyticsData?.kpis.fleetEfficiency || 0)}%` }}></div>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">
                    {analyticsData?.kpis.fleetEfficiency || 0}% achieved
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Recent Achievements
              </h3>
              <div className="space-y-3">
                {analyticsData && analyticsData.kpis.totalCO2Saved > 0 && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        Reduced emissions by {formatEmissions(analyticsData.kpis.totalCO2Saved)}
                      </p>
                      <p className="text-xs text-text-secondary">Achieved through route optimization</p>
                    </div>
                  </div>
                )}
                
                {analyticsData && analyticsData.kpis.evAdoptionRate > 0 && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {analyticsData.kpis.evAdoptionRate}% EV adoption achieved
                      </p>
                      <p className="text-xs text-text-secondary">Expanding sustainable fleet</p>
                    </div>
                  </div>
                )}
                
                {analyticsData && analyticsData.kpis.fleetEfficiency > 75 && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        Achieved {analyticsData.kpis.fleetEfficiency}% fleet efficiency
                      </p>
                      <p className="text-xs text-text-secondary">Excellent operational performance</p>
                    </div>
                  </div>
                )}
                
                {analyticsData && analyticsData.kpis.costSavings > 0 && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        Saved {formatCurrency(analyticsData.kpis.costSavings)} this month
                      </p>
                      <p className="text-xs text-text-secondary">Through operational optimization</p>
                    </div>
                  </div>
                )}
                
                {(!analyticsData || (analyticsData.kpis.totalVehicles === 0)) && (
                  <div className="text-center py-8">
                    <p className="text-sm text-text-secondary">
                      Add vehicles and routes to see achievements
                    </p>
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