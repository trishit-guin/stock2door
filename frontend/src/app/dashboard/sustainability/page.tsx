'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  SparklesIcon,
  ChartBarIcon,
  GlobeAltIcon,
  TruckIcon,
  DocumentChartBarIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  FireIcon
} from '@heroicons/react/24/outline'
import KPICard from '@/components/KPICard'
import { useAppStore } from '@/lib/store'
import { formatEmissions, formatDistance, formatCurrency } from '@/lib/utils'
import SustainabilityReport from '@/components/SustainabilityReport'
import CarbonCalculator from '@/components/CarbonCalculator'

interface SustainabilityData {
  totalEmissionsReduced: number
  carbonFootprintReduction: number
  evAdoptionRate: number
  fuelSavings: number
  sustainabilityScore: number
  monthlyTrend: number
  complianceScore: number
  renewableEnergyUsage: number
}

interface ComplianceItem {
  id: string
  title: string
  status: 'compliant' | 'warning' | 'non-compliant'
  dueDate: string
  description: string
}

interface EnvironmentalGoal {
  id: string
  title: string
  target: number
  current: number
  unit: string
  deadline: string
  progress: number
}

export default function SustainabilityDashboard() {
  const { user, addNotification } = useAppStore()
  const router = useRouter()
  const [sustainabilityData, setSustainabilityData] = useState<SustainabilityData | null>(null)
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([])
  const [environmentalGoals, setEnvironmentalGoals] = useState<EnvironmentalGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showCalculatorModal, setShowCalculatorModal] = useState(false)

  // Redirect if not sustainability manager
  useEffect(() => {
    if (user && user.role !== 'sustainability_manager' && user.role !== 'admin') {
      addNotification({
        type: 'error',
        message: 'Access denied. This dashboard is for Sustainability Managers only.'
      })
      router.push('/dashboard')
      return
    }
  }, [user, router, addNotification])

  const fetchSustainabilityData = async () => {
    try {
      setLoading(true)
      
      // Mock data for now - replace with actual API calls
      const mockData: SustainabilityData = {
        totalEmissionsReduced: 2847.5,
        carbonFootprintReduction: 18.2,
        evAdoptionRate: 34.5,
        fuelSavings: 1250.75,
        sustainabilityScore: 8.3,
        monthlyTrend: 12.4,
        complianceScore: 94.2,
        renewableEnergyUsage: 67.8
      }

      const mockComplianceItems: ComplianceItem[] = [
        {
          id: '1',
          title: 'ISO 14001 Environmental Certification',
          status: 'compliant',
          dueDate: '2025-12-31',
          description: 'Annual environmental management system review'
        },
        {
          id: '2',
          title: 'Carbon Emissions Reporting',
          status: 'warning',
          dueDate: '2025-10-30',
          description: 'Quarterly emissions report due soon'
        },
        {
          id: '3',
          title: 'Fleet Emission Standards',
          status: 'compliant',
          dueDate: '2025-11-15',
          description: 'Vehicle emission compliance check'
        },
        {
          id: '4',
          title: 'Sustainability Audit',
          status: 'non-compliant',
          dueDate: '2025-10-15',
          description: 'Annual sustainability audit overdue'
        }
      ]

      const mockGoals: EnvironmentalGoal[] = [
        {
          id: '1',
          title: 'Carbon Neutral Fleet',
          target: 100,
          current: 34.5,
          unit: '% EV adoption',
          deadline: '2026-12-31',
          progress: 34.5
        },
        {
          id: '2',
          title: 'Emission Reduction',
          target: 5000,
          current: 2847.5,
          unit: 'kg CO₂',
          deadline: '2025-12-31',
          progress: 56.95
        },
        {
          id: '3',
          title: 'Renewable Energy',
          target: 80,
          current: 67.8,
          unit: '% renewable',
          deadline: '2025-12-31',
          progress: 84.75
        },
        {
          id: '4',
          title: 'Fuel Efficiency',
          target: 2000,
          current: 1250.75,
          unit: 'L saved',
          deadline: '2025-12-31',
          progress: 62.54
        }
      ]

      setSustainabilityData(mockData)
      setComplianceItems(mockComplianceItems)
      setEnvironmentalGoals(mockGoals)
      
    } catch (error) {
      console.error('Failed to fetch sustainability data:', error)
      addNotification({
        type: 'error',
        message: 'Failed to load sustainability data. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.role === 'sustainability_manager' || user?.role === 'admin') {
      fetchSustainabilityData()
    }
  }, [user])

  const getKpiData = () => {
    if (!sustainabilityData) return []

    return [
      {
        title: 'Sustainability Score',
        value: `${sustainabilityData.sustainabilityScore}/10`,
        subtitle: 'Overall performance',
        icon: <SparklesIcon className="h-8 w-8 text-green-600" />,
        trend: { value: sustainabilityData.monthlyTrend, isPositive: true },
        variant: 'success' as const
      },
      {
        title: 'CO₂ Reduced',
        value: formatEmissions(sustainabilityData.totalEmissionsReduced),
        subtitle: 'This year',
        icon: <GlobeAltIcon className="h-8 w-8 text-blue-600" />,
        trend: { value: sustainabilityData.carbonFootprintReduction, isPositive: true },
        variant: 'success' as const
      },
      {
        title: 'EV Adoption',
        value: `${sustainabilityData.evAdoptionRate}%`,
        subtitle: 'Fleet electrification',
        icon: <TruckIcon className="h-8 w-8 text-purple-600" />,
        trend: { value: 8.5, isPositive: true },
        variant: 'default' as const
      },
      {
        title: 'Compliance Score',
        value: `${sustainabilityData.complianceScore}%`,
        subtitle: 'Regulatory compliance',
        icon: <DocumentChartBarIcon className="h-8 w-8 text-accent" />,
        trend: { value: 2.1, isPositive: true },
        variant: sustainabilityData.complianceScore >= 90 ? 'success' as const : 'default' as const
      }
    ]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'non-compliant': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircleIcon className="h-5 w-5 text-green-600" />
      case 'warning': return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
      case 'non-compliant': return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
      default: return <ClockIcon className="h-5 w-5 text-gray-600" />
    }
  }

  if (user?.role !== 'sustainability_manager' && user?.role !== 'admin') {
    return null // Will redirect in useEffect
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Sustainability Dashboard
          </h1>
          <p className="text-text-secondary mt-2">
            Monitor environmental impact, compliance, and sustainability goals.
          </p>
        </div>
        <button
          onClick={fetchSustainabilityData}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          <ArrowPathIcon className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <ArrowPathIcon className="h-8 w-8 animate-spin text-green-600" />
          <span className="ml-2 text-text-secondary">Loading sustainability data...</span>
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
            {/* Environmental Goals */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-text-primary">
                    Environmental Goals
                  </h2>
                  <button className="text-accent hover:text-accent/80 font-medium text-sm">
                    Manage Goals
                  </button>
                </div>
                
                <div className="space-y-4">
                  {environmentalGoals.map((goal) => (
                    <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-text-primary">{goal.title}</h3>
                        <span className="text-sm text-text-secondary">
                          Due: {new Date(goal.deadline).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-text-secondary">
                          {goal.current} / {goal.target} {goal.unit}
                        </span>
                        <span className="font-medium text-text-primary">
                          {goal.progress.toFixed(1)}%
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            goal.progress >= 80 ? 'bg-green-500' : 
                            goal.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(goal.progress, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Compliance & Actions */}
            <div className="space-y-6">
              {/* Compliance Status */}
              <div className="card">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Compliance Status
                </h3>
                <div className="space-y-3">
                  {complianceItems.map((item) => (
                    <div key={item.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                      {getStatusIcon(item.status)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-text-primary text-sm">{item.title}</p>
                        <p className="text-xs text-text-secondary mt-1">{item.description}</p>
                        <p className={`text-xs mt-1 ${getStatusColor(item.status)}`}>
                          Due: {new Date(item.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowReportModal(true)}
                    className="w-full flex items-center p-3 text-left bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <DocumentChartBarIcon className="h-5 w-5 mr-3" />
                    Generate Sustainability Report
                  </button>
                  <button 
                    onClick={() => router.push('/dashboard/analytics')}
                    className="w-full flex items-center p-3 text-left bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ChartBarIcon className="h-5 w-5 mr-3" />
                    View Environmental Analytics
                  </button>
                  <button 
                    onClick={() => setShowCalculatorModal(true)}
                    className="w-full flex items-center p-3 text-left bg-surface text-text-primary border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FireIcon className="h-5 w-5 mr-3" />
                    Carbon Footprint Calculator
                  </button>
                </div>
              </div>

              {/* Environmental Impact Summary */}
              <div className="card">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Impact Summary
                </h3>
                {sustainabilityData && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Fuel Savings</span>
                      <span className="font-medium text-green-600">{formatCurrency(sustainabilityData.fuelSavings)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Renewable Energy</span>
                      <span className="font-medium text-text-primary">{sustainabilityData.renewableEnergyUsage}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Carbon Reduction</span>
                      <span className="font-medium text-green-600">{sustainabilityData.carbonFootprintReduction}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Overall Score</span>
                      <span className={`font-medium ${sustainabilityData.sustainabilityScore >= 8 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {sustainabilityData.sustainabilityScore}/10
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modals */}
      <SustainabilityReport 
        isOpen={showReportModal} 
        onClose={() => setShowReportModal(false)} 
      />
      <CarbonCalculator 
        isOpen={showCalculatorModal} 
        onClose={() => setShowCalculatorModal(false)} 
      />
    </div>
  )
}