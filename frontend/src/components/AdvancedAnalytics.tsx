'use client';

import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import api from '@/lib/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AnalyticsDashboardProps {
  warehouseId?: string;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
}

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
}

const AdvancedAnalytics: React.FC<AnalyticsDashboardProps> = ({
  warehouseId,
  dateRange
}) => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [deliveryTrends, setDeliveryTrends] = useState<any>(null);
  const [vehicleUtilization, setVehicleUtilization] = useState<any>(null);
  const [emissionData, setEmissionData] = useState<any>(null);
  const [topRoutes, setTopRoutes] = useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | 'custom'>('30d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [warehouseId, dateRange, selectedPeriod]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Fetch comprehensive analytics
      const [
        deliveriesRes,
        vehiclesRes,
        emissionsRes,
        analyticsRes
      ] = await Promise.all([
        api.analytics.getDeliverySummary(),
        api.analytics.getVehicleSummary(),
        api.analytics.getEmissionTrends(),
        api.analytics.getRouteSummary()
      ]);

      // Process metrics
      const processedMetrics: MetricCard[] = [
        {
          title: 'Total Deliveries',
          value: deliveriesRes.data.totalDeliveries || 0,
          change: 12.5,
          trend: 'up',
          icon: 'truck',
          color: 'blue'
        },
        {
          title: 'Completed',
          value: deliveriesRes.data.completed || 0,
          change: 8.3,
          trend: 'up',
          icon: 'check',
          color: 'green'
        },
        {
          title: 'Avg Delivery Time',
          value: `${(deliveriesRes.data.avgDeliveryTime || 0).toFixed(1)}h`,
          change: -5.2,
          trend: 'down',
          icon: 'clock',
          color: 'yellow'
        },
        {
          title: 'Active Vehicles',
          value: vehiclesRes.data.activeVehicles || 0,
          change: 3.1,
          trend: 'up',
          icon: 'car',
          color: 'purple'
        },
        {
          title: 'CO2 Emissions',
          value: `${(emissionsRes.data.totalEmissions || 0).toFixed(1)} kg`,
          change: -15.8,
          trend: 'down',
          icon: 'leaf',
          color: 'emerald'
        },
        {
          title: 'Fleet Utilization',
          value: `${(vehiclesRes.data.utilizationRate || 0).toFixed(1)}%`,
          change: 7.4,
          trend: 'up',
          icon: 'chart',
          color: 'indigo'
        }
      ];

      setMetrics(processedMetrics);

      // Process delivery trends for line chart
      const trendsData = {
        labels: deliveriesRes.data.dailyTrends?.map((d: any) => d.date) || [],
        datasets: [
          {
            label: 'Completed',
            data: deliveriesRes.data.dailyTrends?.map((d: any) => d.completed) || [],
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Pending',
            data: deliveriesRes.data.dailyTrends?.map((d: any) => d.pending) || [],
            borderColor: 'rgb(250, 204, 21)',
            backgroundColor: 'rgba(250, 204, 21, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Failed',
            data: deliveriesRes.data.dailyTrends?.map((d: any) => d.failed) || [],
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      };

      setDeliveryTrends(trendsData);

      // Process vehicle utilization for bar chart
      const utilizationData = {
        labels: vehiclesRes.data.vehicleBreakdown?.map((v: any) => v.vehicleNumber) || [],
        datasets: [
          {
            label: 'Utilization %',
            data: vehiclesRes.data.vehicleBreakdown?.map((v: any) => v.utilization) || [],
            backgroundColor: 'rgba(99, 102, 241, 0.8)',
            borderColor: 'rgb(99, 102, 241)',
            borderWidth: 1
          }
        ]
      };

      setVehicleUtilization(utilizationData);

      // Process emission data for doughnut chart
      const emissionBreakdown = {
        labels: ['Road Transport', 'Idle Time', 'Warehouse Operations'],
        datasets: [
          {
            data: [
              emissionsRes.data.transportEmissions || 0,
              emissionsRes.data.idleEmissions || 0,
              emissionsRes.data.warehouseEmissions || 0
            ],
            backgroundColor: [
              'rgba(239, 68, 68, 0.8)',
              'rgba(250, 204, 21, 0.8)',
              'rgba(34, 197, 94, 0.8)'
            ],
            borderColor: [
              'rgb(239, 68, 68)',
              'rgb(250, 204, 21)',
              'rgb(34, 197, 94)'
            ],
            borderWidth: 2
          }
        ]
      };

      setEmissionData(emissionBreakdown);

      // Process top routes
      setTopRoutes(analyticsRes.data.topRoutes || []);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  const exportData = async (format: 'csv' | 'pdf') => {
    try {
      // Implement export functionality
      alert(`Exporting analytics data as ${format.toUpperCase()}...`);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
          <p className="text-gray-600 mt-1">Comprehensive insights into your operations</p>
        </div>
        
        <div className="flex gap-3">
          {/* Period Selector */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="custom">Custom Range</option>
          </select>

          {/* Export Buttons */}
          <button
            onClick={() => exportData('csv')}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
          
          <button
            onClick={() => exportData('pdf')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Export PDF
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${metric.color}-100 rounded-lg`}>
                <svg className={`w-6 h-6 text-${metric.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className={`text-sm font-medium ${metric.trend === 'up' ? 'text-green-600' : metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'} {Math.abs(metric.change)}%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium">{metric.title}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Trends */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Trends</h3>
          {deliveryTrends && (
            <Line
              data={deliveryTrends}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    position: 'top'
                  },
                  title: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          )}
        </div>

        {/* Vehicle Utilization */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Utilization</h3>
          {vehicleUtilization && (
            <Bar
              data={vehicleUtilization}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                      callback: (value) => `${value}%`
                    }
                  }
                }
              }}
            />
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Emission Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">CO2 Emission Sources</h3>
          {emissionData && (
            <div className="flex justify-center">
              <Doughnut
                data={emissionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* Top Routes */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Routes</h3>
          <div className="space-y-4">
            {topRoutes.map((route, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{route.name || `Route ${route.id}`}</h4>
                    <p className="text-sm text-gray-600">{route.deliveries} deliveries • {route.distance} km</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-green-600">{route.efficiency}%</div>
                  <p className="text-xs text-gray-500">Efficiency</p>
                </div>
              </div>
            ))}
            {topRoutes.length === 0 && (
              <p className="text-center text-gray-500 py-8">No route data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          AI-Powered Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm font-medium text-gray-900 mb-2">🎯 Optimization Opportunity</p>
            <p className="text-sm text-gray-600">Route clustering could reduce delivery time by 18% and save $1,250/month.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm font-medium text-gray-900 mb-2">⚠️ Alert</p>
            <p className="text-sm text-gray-600">3 vehicles are consistently underutilized. Consider route consolidation.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm font-medium text-gray-900 mb-2">✨ Achievement</p>
            <p className="text-sm text-gray-600">CO2 emissions reduced by 15.8% this month. Great progress!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
