'use client'

import { useEffect } from 'react'
import { 
  MapIcon, 
  TruckIcon, 
  ChartBarIcon, 
  ClockIcon,
  CurrencyDollarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import KPICard from '@/components/KPICard'
import { useAppStore } from '@/lib/store'
import { formatEmissions, formatDistance, formatDuration, formatCurrency } from '@/lib/utils'

export default function DashboardPage() {
  const { user, setUser, addNotification } = useAppStore()

  useEffect(() => {
    // Mock user data for demo
    if (!user) {
      setUser({
        id: '1',
        email: 'admin@smartroute.com',
        name: 'John Doe',
        role: 'admin'
      })
    }
  }, [user, setUser])

  const kpiData = [
    {
      title: 'Total CO₂ Saved',
      value: formatEmissions(1250),
      subtitle: 'This month',
      icon: <SparklesIcon className="h-8 w-8 text-accent" />,
      trend: { value: 15, isPositive: true },
      variant: 'success' as const
    },
    {
      title: 'Active Routes',
      value: '24',
      subtitle: 'Currently optimized',
      icon: <MapIcon className="h-8 w-8 text-primary" />,
      trend: { value: 8, isPositive: true },
      variant: 'default' as const
    },
    {
      title: 'Fleet Efficiency',
      value: '87%',
      subtitle: 'Average utilization',
      icon: <TruckIcon className="h-8 w-8 text-primary" />,
      trend: { value: 5, isPositive: true },
      variant: 'default' as const
    },
    {
      title: 'Cost Savings',
      value: formatCurrency(12500),
      subtitle: 'This month',
      icon: <CurrencyDollarIcon className="h-8 w-8 text-accent" />,
      trend: { value: 12, isPositive: true },
      variant: 'success' as const
    }
  ]

  const recentRoutes = [
    {
      id: '1',
      source: 'Warehouse A',
      destinations: ['Store 1', 'Store 2', 'Store 3'],
      distance: 45000,
      duration: 7200,
      emissions: 85,
      status: 'active'
    },
    {
      id: '2',
      source: 'Distribution Center',
      destinations: ['Customer A', 'Customer B'],
      distance: 32000,
      duration: 5400,
      emissions: 62,
      status: 'completed'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-text-secondary mt-2">
          Here's what's happening with your logistics operations today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Routes */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-text-primary">
                Recent Routes
              </h2>
              <button className="text-accent hover:text-accent/80 font-medium text-sm">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {recentRoutes.map((route) => (
                <div key={route.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-text-primary">
                        {route.source} → {route.destinations.length} stops
                      </h3>
                      <p className="text-sm text-text-secondary mt-1">
                        {route.destinations.join(', ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-text-primary">
                        {formatDistance(route.distance)}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {formatDuration(route.duration)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-text-secondary">
                        {formatEmissions(route.emissions)}
                      </span>
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${route.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                        }
                      `}>
                        {route.status}
                      </span>
                    </div>
                    <button className="text-accent hover:text-accent/80 text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
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
              <button className="w-full flex items-center p-3 text-left bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
                <MapIcon className="h-5 w-5 mr-3" />
                Optimize New Route
              </button>
              <button className="w-full flex items-center p-3 text-left bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                <TruckIcon className="h-5 w-5 mr-3" />
                Manage Fleet
              </button>
              <button className="w-full flex items-center p-3 text-left bg-surface text-text-primary border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <ChartBarIcon className="h-5 w-5 mr-3" />
                View Analytics
              </button>
            </div>
          </div>

          {/* Weather Alert */}
          <div className="card border-l-4 border-l-warning">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-warning rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">!</span>
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-text-primary">
                  Weather Alert
                </h3>
                <p className="text-sm text-text-secondary mt-1">
                  Heavy rain expected in downtown area. Consider route adjustments for deliveries.
                </p>
                <button className="text-accent hover:text-accent/80 text-sm font-medium mt-2">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 