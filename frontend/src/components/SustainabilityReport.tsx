'use client'

import { useState } from 'react'
import { 
  DocumentChartBarIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { useAppStore } from '@/lib/store'

interface SustainabilityReportProps {
  isOpen: boolean
  onClose: () => void
}

interface ReportData {
  period: string
  totalEmissionsReduced: number
  carbonFootprintReduction: number
  evAdoptionRate: number
  fuelSavings: number
  sustainabilityScore: number
  complianceScore: number
  renewableEnergyUsage: number
  costsAvings: number
  routesOptimized: number
  distanceSaved: number
}

export default function SustainabilityReport({ isOpen, onClose }: SustainabilityReportProps) {
  const [reportPeriod, setReportPeriod] = useState('monthly')
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportGenerated, setReportGenerated] = useState(false)
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const { addNotification } = useAppStore()

  const generateReport = async () => {
    setIsGenerating(true)
    
    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockReportData: ReportData = {
        period: reportPeriod,
        totalEmissionsReduced: 2847.5,
        carbonFootprintReduction: 18.2,
        evAdoptionRate: 34.5,
        fuelSavings: 1250.75,
        sustainabilityScore: 8.3,
        complianceScore: 94.2,
        renewableEnergyUsage: 67.8,
        costsAvings: 12500,
        routesOptimized: 156,
        distanceSaved: 4250.8
      }
      
      setReportData(mockReportData)
      setReportGenerated(true)
      
      addNotification({
        type: 'success',
        message: 'Sustainability report generated successfully!'
      })
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to generate report. Please try again.'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadReport = () => {
    if (!reportData) return
    
    // Create CSV content
    const csvContent = `Sustainability Report - ${reportData.period}\n\nMetric,Value,Unit\nTotal Emissions Reduced,${reportData.totalEmissionsReduced},kg CO₂\nCarbon Footprint Reduction,${reportData.carbonFootprintReduction},%\nEV Adoption Rate,${reportData.evAdoptionRate},%\nFuel Savings,${reportData.fuelSavings},L\nSustainability Score,${reportData.sustainabilityScore},/10\nCompliance Score,${reportData.complianceScore},%\nRenewable Energy Usage,${reportData.renewableEnergyUsage},%\nCost Savings,$${reportData.costsAvings}\nRoutes Optimized,${reportData.routesOptimized},count\nDistance Saved,${reportData.distanceSaved},km`
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sustainability-report-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    
    addNotification({
      type: 'success',
      message: 'Report downloaded successfully!'
    })
  }

  const resetReport = () => {
    setReportGenerated(false)
    setReportData(null)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <DocumentChartBarIcon className="h-6 w-6 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-text-primary">
                Generate Sustainability Report
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {!reportGenerated ? (
            /* Report Configuration */
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Report Period
                </label>
                <select
                  value={reportPeriod}
                  onChange={(e) => setReportPeriod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="weekly">Weekly Report</option>
                  <option value="monthly">Monthly Report</option>
                  <option value="quarterly">Quarterly Report</option>
                  <option value="yearly">Yearly Report</option>
                  <option value="custom">Custom Date Range</option>
                </select>
              </div>

              {reportPeriod === 'custom' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-text-primary mb-2">Report will include:</h3>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• Carbon emissions reduction metrics</li>
                  <li>• Fleet electrification progress</li>
                  <li>• Fuel savings and cost analysis</li>
                  <li>• Compliance status and scores</li>
                  <li>• Environmental goals progress</li>
                  <li>• Route optimization impact</li>
                </ul>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={generateReport}
                  disabled={isGenerating}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <DocumentChartBarIcon className="h-4 w-4 mr-2" />
                      Generate Report
                    </>
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 text-text-primary rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* Report Results */
            <div className="space-y-4">
              <div className="flex items-center text-green-600 mb-4">
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                <span className="font-medium">Report Generated Successfully</span>
              </div>

              {reportData && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-text-primary mb-4">
                    Sustainability Report Summary - {reportData.period}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">CO₂ Reduced:</span>
                        <span className="font-medium text-green-600">{reportData.totalEmissionsReduced} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">EV Adoption:</span>
                        <span className="font-medium">{reportData.evAdoptionRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Fuel Saved:</span>
                        <span className="font-medium text-green-600">{reportData.fuelSavings} L</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Sustainability Score:</span>
                        <span className="font-medium">{reportData.sustainabilityScore}/10</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Compliance:</span>
                        <span className="font-medium text-green-600">{reportData.complianceScore}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Renewable Energy:</span>
                        <span className="font-medium">{reportData.renewableEnergyUsage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Cost Savings:</span>
                        <span className="font-medium text-green-600">${reportData.costsAvings}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Routes Optimized:</span>
                        <span className="font-medium">{reportData.routesOptimized}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={downloadReport}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Download CSV Report
                </button>
                <button
                  onClick={resetReport}
                  className="px-4 py-2 border border-gray-300 text-text-primary rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Generate New Report
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}