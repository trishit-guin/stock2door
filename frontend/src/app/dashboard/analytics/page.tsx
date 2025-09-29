'use client'

import { useState } from 'react'
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import KPICard from '@/components/KPICard'
import { formatEmissions, formatCurrency, formatDistance } from '@/lib/utils'

const emissionData = [
  { month: 'Jan', emissions: 1200, target: 1000 },
  { month: 'Feb', emissions: 1100, target: 1000 },
  { month: 'Mar', emissions: 950, target: 1000 },
  { month: 'Apr', emissions: 900, target: 1000 },
  { month: 'May', emissions: 850, target: 1000 },
  { month: 'Jun', emissions: 800, target: 1000 },
]

const vehicleData = [
  { type: 'Diesel', count: 45, percentage: 45 },
  { type: 'Petrol', count: 30, percentage: 30 },
  { type: 'Electric', count: 25, percentage: 25 },
]

const routeEfficiencyData = [
  { route: 'Route A', distance: 45, emissions: 85, efficiency: 87 },
  { route: 'Route B', distance: 32, emissions: 62, efficiency: 92 },
  { route: 'Route C', distance: 58, emissions: 110, efficiency: 78 },
  { route: 'Route D', distance: 28, emissions: 48, efficiency: 95 },
  { route: 'Route E', distance: 41, emissions: 78, efficiency: 84 },
]

const COLORS = ['#E74C3C', '#F39C12', '#27AE60']

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6m')
  const [selectedMetric, setSelectedMetric] = useState('emissions')

  const kpiData = [
    {
      title: 'Total CO₂ Saved',
      value: formatEmissions(2500),
      subtitle: 'This year',
      icon: <ArrowTrendingDownIcon className="h-8 w-8 text-accent" />,
      trend: { value: 25, isPositive: true },
      variant: 'success' as const
    },
    {
      title: 'Fleet Efficiency',
      value: '87%',
      subtitle: 'Average utilization',
      icon: <ChartBarIcon className="h-8 w-8 text-primary" />,
      trend: { value: 8, isPositive: true },
      variant: 'default' as const
    },
    {
      title: 'Cost Savings',
      value: formatCurrency(45000),
      subtitle: 'This year',
      icon: <ArrowTrendingUpIcon className="h-8 w-8 text-accent" />,
      trend: { value: 18, isPositive: true },
      variant: 'success' as const
    },
    {
      title: 'EV Adoption',
      value: '25%',
      subtitle: 'Of total fleet',
      icon: <ChartBarIcon className="h-8 w-8 text-primary" />,
      trend: { value: 12, isPositive: true },
      variant: 'default' as const
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Analytics & Insights
          </h1>
          <p className="text-text-secondary mt-2">
            Track your sustainability metrics and fleet performance.
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-text-secondary" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:border-accent"
            >
              <option value="1m">Last Month</option>
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Emissions Trend */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-primary">
              Emissions Trend
            </h2>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <span className="text-sm text-text-secondary">Actual</span>
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <span className="text-sm text-text-secondary">Target</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={emissionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: any) => [`${value} kg CO₂`, 'Emissions']}
                labelFormatter={(label) => `Month: ${label}`}
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
          </ResponsiveContainer>
        </div>

        {/* Fleet Composition */}
        <div className="card">
          <h2 className="text-xl font-semibold text-text-primary mb-6">
            Fleet Composition
          </h2>
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
                {vehicleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [`${value} vehicles`, 'Count']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-6 mt-4">
            {vehicleData.map((vehicle, index) => (
              <div key={vehicle.type} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index] }}
                ></div>
                <span className="text-sm text-text-secondary">{vehicle.type}</span>
              </div>
            ))}
          </div>
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
              {routeEfficiencyData.map((route, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-text-primary">{route.route}</td>
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
                      ${route.efficiency >= 90 
                        ? 'bg-green-100 text-green-800' 
                        : route.efficiency >= 80 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                      }
                    `}>
                      {route.efficiency >= 90 ? 'Excellent' : route.efficiency >= 80 ? 'Good' : 'Needs Improvement'}
                    </span>
                  </td>
                </tr>
              ))}
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
                <div className="bg-accent h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <p className="text-xs text-text-secondary mt-1">60% achieved</p>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-text-primary">EV Fleet Target</span>
                <span className="text-sm text-text-secondary">50%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-accent h-2 rounded-full" style={{ width: '50%' }}></div>
              </div>
              <p className="text-xs text-text-secondary mt-1">25% achieved</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Recent Achievements
          </h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Reduced emissions by 25% this quarter
                </p>
                <p className="text-xs text-text-secondary">Achieved through route optimization</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Added 5 new electric vehicles
                </p>
                <p className="text-xs text-text-secondary">Expanding sustainable fleet</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Improved route efficiency by 15%
                </p>
                <p className="text-xs text-text-secondary">Using AI optimization</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 