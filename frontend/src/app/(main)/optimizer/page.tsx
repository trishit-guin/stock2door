'use client'

import { useState } from 'react'
import { 
  MapPinIcon, 
  TruckIcon, 
  SparklesIcon,
  CloudIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  FireIcon,
  XMarkIcon,
  EyeIcon,
  ArrowTopRightOnSquareIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline'
import { useAppStore } from '@/lib/store'
import { formatDistance, formatDuration, formatEmissions } from '@/lib/utils'
import { apiClient } from '@/lib/api'

interface RouteForm {
  source: string
  destination: string
  vehicleType: 'LCV' | 'MCV' | 'HCV' | 'THREE_WHEELER'
  fuelType: 'DIESEL' | 'PETROL' | 'CNG' | 'ELECTRIC'
  includeWeather: boolean
  includeAlternatives: boolean
}

export default function RouteOptimizerPage() {
  const { addNotification, optimizationWeights } = useAppStore()
  const [form, setForm] = useState<RouteForm>({
    source: '',
    destination: '',
    vehicleType: 'LCV',
    fuelType: 'DIESEL',
    includeWeather: false,
    includeAlternatives: false
  })
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizedRoute, setOptimizedRoute] = useState<any>(null)
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number>(0) // 0 for main route, 1+ for alternatives
  const [showStepsModal, setShowStepsModal] = useState(false)
  const [alternativeWeatherData, setAlternativeWeatherData] = useState<{[key: number]: any}>({})
  const [isLoadingWeather, setIsLoadingWeather] = useState(false)

  const handleOptimize = async () => {
    if (!form.source || !form.destination) {
      addNotification({
        type: 'error',
        message: 'Please enter both source and destination'
      })
      return
    }

    setIsOptimizing(true)
    
    // Simulate API call with dummy data
    setTimeout(() => {
      const dummyRouteData = {
        source: form.source,
        destination: form.destination,
        vehicleType: form.vehicleType,
        fuelType: form.fuelType,
        distance: {
          km: 1465,
          meters: 1465000
        },
        duration: {
          normal: {
            value: 82800, // 23 hours
            hours: 23,
            text: "23 hours"
          },
          with_traffic: {
            value: 93600, // 26 hours
            hours: 26,
            text: "26 hours"
          }
        },
        fuel_consumption: {
          fuel_required: 244.2,
          unit: 'liters',
          efficiency: 6.0,
          fuel_cost: 21968
        },
        emissions: {
          co2_emissions: 652.1,
          environmental_score: 68
        },
        traffic: {
          current_conditions: 'MODERATE',
          delay_factor: 1.13,
          alternative_routes_available: 3
        },
        route_analysis: {
          safety_rating: 82
        },
        main_route_summary: 'Via NH48 and NH44 (Fastest Route)',
        route_path: {
          start_address: 'Pune, Maharashtra 411001, India',
          end_address: 'New Delhi, Delhi 110001, India',
          steps: 47,
          detailed_steps: [
            {
              instruction: 'Head north on MG Road toward Mahatma Phule Peth',
              distance: { text: '550 m', value: 550 },
              duration: { text: '2 mins', value: 120 },
              maneuver: 'straight'
            },
            {
              instruction: 'Turn right onto Pune-Nashik Highway/NH48',
              distance: { text: '165 km', value: 165000 },
              duration: { text: '2 hours 45 mins', value: 9900 },
              maneuver: 'turn-right'
            },
            {
              instruction: 'Continue on NH48 through Nashik',
              distance: { text: '89 km', value: 89000 },
              duration: { text: '1 hour 30 mins', value: 5400 },
              maneuver: 'straight'
            },
            {
              instruction: 'Merge onto NH44 toward Dhule',
              distance: { text: '120 km', value: 120000 },
              duration: { text: '2 hours', value: 7200 },
              maneuver: 'merge'
            },
            {
              instruction: 'Continue on NH44 through Madhya Pradesh',
              distance: { text: '485 km', value: 485000 },
              duration: { text: '8 hours', value: 28800 },
              maneuver: 'straight'
            },
            {
              instruction: 'Take NH44 through Agra',
              distance: { text: '312 km', value: 312000 },
              duration: { text: '5 hours 15 mins', value: 18900 },
              maneuver: 'straight'
            },
            {
              instruction: 'Continue on NH44 toward Delhi',
              distance: { text: '205 km', value: 205000 },
              duration: { text: '3 hours 30 mins', value: 12600 },
              maneuver: 'straight'
            },
            {
              instruction: 'Take exit toward Ring Road',
              distance: { text: '12 km', value: 12000 },
              duration: { text: '18 mins', value: 1080 },
              maneuver: 'ramp-right'
            },
            {
              instruction: 'Arrive at New Delhi',
              distance: { text: '2.5 km', value: 2500 },
              duration: { text: '8 mins', value: 480 },
              maneuver: 'straight'
            }
          ]
        },
        weather: {
          overall_safety_score: 85,
          total_waypoints: 5,
          waypoints: [
            {
              sequence: 1,
              location: { name: 'Pune, Maharashtra' },
              estimated_arrival_time: new Date().toISOString(),
              current: {
                temperature: 28,
                feels_like: 30,
                weather_condition: 'Clear',
                weather_description: 'Clear sky',
                visibility: 10000,
                humidity: 45,
                wind_speed: 3.5,
                precipitation: 0
              },
              driving_conditions: {
                safety_score: 95
              }
            },
            {
              sequence: 2,
              location: { name: 'Nashik, Maharashtra' },
              estimated_arrival_time: new Date(Date.now() + 3 * 3600000).toISOString(),
              current: {
                temperature: 26,
                feels_like: 27,
                weather_condition: 'Clouds',
                weather_description: 'Few clouds',
                visibility: 9500,
                humidity: 52,
                wind_speed: 4.2,
                precipitation: 0
              },
              driving_conditions: {
                safety_score: 88
              }
            },
            {
              sequence: 3,
              location: { name: 'Indore, Madhya Pradesh' },
              estimated_arrival_time: new Date(Date.now() + 10 * 3600000).toISOString(),
              current: {
                temperature: 24,
                feels_like: 25,
                weather_condition: 'Mist',
                weather_description: 'Light mist',
                visibility: 6000,
                humidity: 68,
                wind_speed: 2.8,
                precipitation: 0
              },
              driving_conditions: {
                safety_score: 75
              }
            },
            {
              sequence: 4,
              location: { name: 'Agra, Uttar Pradesh' },
              estimated_arrival_time: new Date(Date.now() + 18 * 3600000).toISOString(),
              current: {
                temperature: 22,
                feels_like: 21,
                weather_condition: 'Haze',
                weather_description: 'Moderate haze',
                visibility: 5000,
                humidity: 72,
                wind_speed: 2.1,
                precipitation: 0
              },
              driving_conditions: {
                safety_score: 70
              }
            },
            {
              sequence: 5,
              location: { name: 'Delhi' },
              estimated_arrival_time: new Date(Date.now() + 26 * 3600000).toISOString(),
              current: {
                temperature: 18,
                feels_like: 16,
                weather_condition: 'Fog',
                weather_description: 'Light fog',
                visibility: 4500,
                humidity: 78,
                wind_speed: 1.5,
                precipitation: 0
              },
              driving_conditions: {
                safety_score: 65
              }
            }
          ],
          route_recommendations: [
            'Expect foggy conditions in Delhi - reduce speed and use fog lights',
            'Misty conditions around Indore - maintain safe following distance',
            'Good driving conditions for most of the journey',
            'Consider taking breaks every 3-4 hours for safety'
          ]
        },
        alternatives: [
          {
            route_id: 2,
            summary: 'Via Ahmednagar and NH44 (Shorter Distance)',
            route_type: 'highway_free',
            distance: { km: 1442 },
            duration: {
              normal: { value: 85200, hours: 23.7 },
              with_traffic: { value: 95400, hours: 26.5 }
            },
            fuel_cost: 21486,
            co2_emissions: 638.7,
            route_path: {
              start_address: 'Pune, Maharashtra 411001, India',
              end_address: 'New Delhi, Delhi 110001, India',
              detailed_steps: []
            },
            coordinates: {
              start: { lat: 18.5204, lng: 73.8567 },
              end: { lat: 28.6139, lng: 77.2090 }
            }
          },
          {
            route_id: 3,
            summary: 'Via Aurangabad and NH52 (Scenic Route)',
            route_type: 'scenic',
            distance: { km: 1521 },
            duration: {
              normal: { value: 90000, hours: 25 },
              with_traffic: { value: 99000, hours: 27.5 }
            },
            fuel_cost: 22813,
            co2_emissions: 674.3,
            route_path: {
              start_address: 'Pune, Maharashtra 411001, India',
              end_address: 'New Delhi, Delhi 110001, India',
              detailed_steps: []
            },
            coordinates: {
              start: { lat: 18.5204, lng: 73.8567 },
              end: { lat: 28.6139, lng: 77.2090 }
            }
          }
        ]
      }
      
      setOptimizedRoute(dummyRouteData)
      setIsOptimizing(false)
      addNotification({
        type: 'success',
        message: 'Route optimized successfully!'
      })
    }, 1500) // Simulate network delay
  }

  const fetchAlternativeWeather = async (routeIndex: number) => {
    if (!optimizedRoute?.alternatives || routeIndex === 0) return
    
    const altRoute = optimizedRoute.alternatives[routeIndex - 1]
    if (!altRoute?.coordinates) return

    // Check if we already have weather data for this route
    if (alternativeWeatherData[routeIndex]) return

    setIsLoadingWeather(true)
    try {
      const weatherData = await apiClient.getAlternativeRouteWeather({
        routeIndex,
        startLat: altRoute.coordinates.start.lat,
        startLng: altRoute.coordinates.start.lng,
        endLat: altRoute.coordinates.end.lat,
        endLng: altRoute.coordinates.end.lng,
        duration: altRoute.duration.with_traffic?.value || altRoute.duration.normal.value,
        routeSteps: altRoute.route_path?.detailed_steps?.map((step: any) => ({
          start_location: step.start_location,
          end_location: step.end_location,
          duration: step.duration
        }))
      })

      setAlternativeWeatherData(prev => ({
        ...prev,
        [routeIndex]: weatherData
      }))
    } catch (error) {
      console.error('Error fetching alternative route weather:', error)
      addNotification({
        type: 'error',
        message: 'Failed to load weather data for alternative route'
      })
    } finally {
      setIsLoadingWeather(false)
    }
  }

  const handleSelectRoute = async (routeIndex: number) => {
    setSelectedRouteIndex(routeIndex)
    
    // Fetch weather for alternative routes if needed
    if (routeIndex > 0 && form.includeWeather) {
      await fetchAlternativeWeather(routeIndex)
    }
    
    addNotification({
      type: 'success',
      message: routeIndex === 0 ? 'Main route selected' : `Alternative route ${routeIndex} selected`
    })
  }

  const getCurrentRoute = () => {
    if (!optimizedRoute) return null
    if (selectedRouteIndex === 0) return optimizedRoute
    return optimizedRoute.alternatives?.[selectedRouteIndex - 1] || optimizedRoute
  }

  const getCurrentWeatherData = () => {
    if (!optimizedRoute?.weather || selectedRouteIndex === 0) {
      return optimizedRoute?.weather
    }
    
    // Return alternative route weather data if available
    return alternativeWeatherData[selectedRouteIndex] || null
  }

  const exportRouteDirections = () => {
    if (!optimizedRoute) return

    const currentRoute = getCurrentRoute()
    const routeTitle = selectedRouteIndex === 0 ? 'Main Route' : `Alternative Route ${selectedRouteIndex}`
    
    // Build the directions text
    let directionsText = `SmartRoute - ${routeTitle} Directions\n`
    directionsText += `Generated on: ${new Date().toLocaleString()}\n`
    directionsText += `==========================================\n\n`
    
    // Route summary
    directionsText += `ROUTE SUMMARY:\n`
    directionsText += `From: ${optimizedRoute.source}\n`
    directionsText += `To: ${optimizedRoute.destination}\n`
    directionsText += `Vehicle: ${optimizedRoute.vehicleType} (${optimizedRoute.fuelType})\n`
    directionsText += `Distance: ${currentRoute?.distance?.km || optimizedRoute.distance.km} km\n`
    directionsText += `Duration: ${currentRoute?.duration?.with_traffic ? 
      Math.round(currentRoute.duration.with_traffic.value / 3600 * 10) / 10 : 
      Math.round((currentRoute?.duration?.normal?.value || optimizedRoute.duration.normal.value) / 3600 * 10) / 10
    } hours\n`
    directionsText += `Fuel Cost: ₹${currentRoute?.fuel_cost || optimizedRoute.fuel_consumption?.fuel_cost}\n`
    directionsText += `CO₂ Emissions: ${currentRoute?.co2_emissions || optimizedRoute.emissions?.co2_emissions} kg\n\n`
    
    // Turn-by-turn directions
    directionsText += `TURN-BY-TURN DIRECTIONS:\n`
    directionsText += `==========================================\n\n`
    
    // Start point
    directionsText += `1. Start your journey\n`
    directionsText += `   From: ${optimizedRoute.source}\n`
    directionsText += `   Address: ${currentRoute?.route_path?.start_address || optimizedRoute.route_path?.start_address}\n\n`
    
    // Route steps
    const detailedSteps = currentRoute?.route_path?.detailed_steps || optimizedRoute.route_path?.detailed_steps
    if (detailedSteps && detailedSteps.length > 0) {
      detailedSteps.forEach((step: any, index: number) => {
        directionsText += `${index + 2}. ${step.instruction}\n`
        directionsText += `   Distance: ${step.distance.text}\n`
        directionsText += `   Duration: ${step.duration.text}\n`
        if (step.maneuver && step.maneuver !== 'straight') {
          directionsText += `   Action: ${step.maneuver.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}\n`
        }
        directionsText += `\n`
      })
    }
    
    // End point
    const finalStepNumber = (detailedSteps?.length || 0) + 2
    directionsText += `${finalStepNumber}. Arrive at your destination\n`
    directionsText += `   To: ${optimizedRoute.destination}\n`
    directionsText += `   Address: ${currentRoute?.route_path?.end_address || optimizedRoute.route_path?.end_address}\n\n`
    
    // Traffic and weather info if available
    if (optimizedRoute.traffic) {
      directionsText += `TRAFFIC CONDITIONS:\n`
      directionsText += `Current Status: ${optimizedRoute.traffic.current_conditions}\n`
      directionsText += `Delay Factor: ${optimizedRoute.traffic.delay_factor.toFixed(1)}x\n\n`
    }
    
    const weatherData = getCurrentWeatherData()
    if (weatherData) {
      directionsText += `WEATHER CONDITIONS:\n`
      directionsText += `Overall Safety Score: ${weatherData.overall_safety_score}/100\n`
      directionsText += `Weather Waypoints: ${weatherData.total_waypoints}\n`
      if (weatherData.route_recommendations?.length > 0) {
        directionsText += `Recommendations:\n`
        weatherData.route_recommendations.forEach((rec: string, index: number) => {
          directionsText += `- ${rec}\n`
        })
      }
      directionsText += `\n`
    }
    
    directionsText += `==========================================\n`
    directionsText += `Generated by SmartRoute - Smart Logistics Solution\n`
    
    // Create and download the file
    const blob = new Blob([directionsText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `SmartRoute_${routeTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    addNotification({
      type: 'success',
      message: 'Route directions exported successfully!'
    })
  }

  const navigateToGoogleMaps = () => {
    if (!optimizedRoute) return

    const currentRoute = getCurrentRoute()
    const source = encodeURIComponent(optimizedRoute.source)
    const destination = encodeURIComponent(optimizedRoute.destination)
    
    // Get waypoints from the selected route if available
    let waypointsParam = ''
    if (selectedRouteIndex > 0 && currentRoute?.route_path?.detailed_steps?.length > 0) {
      // For alternative routes, we can't easily extract waypoints from steps
      // So we'll use the basic source to destination navigation
    }
    
    // Build Google Maps navigation URL
    const googleMapsUrl = `https://www.google.com/maps/dir/${source}/${destination}`
    
    // Open in new tab
    window.open(googleMapsUrl, '_blank')
    
    addNotification({
      type: 'success',
      message: 'Opening Google Maps navigation...'
    })
  }

  const exportAsPDF = () => {
    // Hide non-essential elements before printing
    const elementsToHide = [
      'button[onClick*="setOptimizedRoute(null)"]', // Clear button
      '.notifications', // Any notification elements
      'nav', // Navigation elements
      '.sidebar' // Sidebar if any
    ]
    
    // Hide elements
    const hiddenElements: HTMLElement[] = []
    elementsToHide.forEach(selector => {
      const elements = document.querySelectorAll(selector)
      elements.forEach(el => {
        const htmlEl = el as HTMLElement
        if (htmlEl.style.display !== 'none') {
          hiddenElements.push(htmlEl)
          htmlEl.style.display = 'none'
        }
      })
    })
    
    // Add a print-specific title
    const printTitle = document.createElement('div')
    printTitle.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px; page-break-after: avoid;">
        <h1 style="color: #1f2937; margin-bottom: 8px;">SmartRoute - Route Optimization Report</h1>
        <p style="color: #6b7280; margin: 0;">Generated on ${new Date().toLocaleString()}</p>
        <p style="color: #3b82f6; margin: 4px 0 0 0; font-weight: 600;">
          ${selectedRouteIndex === 0 ? 'Main Route' : `Alternative Route ${selectedRouteIndex}`}
        </p>
      </div>
    `
    printTitle.id = 'print-title'
    
    // Add print styles
    const printStyles = document.createElement('style')
    printStyles.id = 'print-styles'
    printStyles.innerHTML = `
      @media print {
        body { margin: 0; padding: 20px; }
        .card { break-inside: avoid; margin-bottom: 15px; }
        .grid { break-inside: avoid; }
        button { display: none !important; }
        .bg-gray-50 { background: white !important; }
        .shadow-sm { box-shadow: none !important; }
        .border { border: 1px solid #e5e7eb !important; }
        h1, h2, h3 { color: #1f2937 !important; }
        .text-text-primary { color: #1f2937 !important; }
        .text-text-secondary { color: #6b7280 !important; }
        .max-h-60 { max-height: none !important; }
        .overflow-y-auto { overflow: visible !important; }
      }
    `
    
    // Insert title and styles
    const mainContent = document.querySelector('.min-h-screen')
    if (mainContent) {
      mainContent.insertBefore(printTitle, mainContent.firstChild)
    }
    document.head.appendChild(printStyles)
    
    // Trigger print dialog
    setTimeout(() => {
      window.print()
      
      // Clean up after printing
      setTimeout(() => {
        // Remove print-specific elements
        const titleEl = document.getElementById('print-title')
        const stylesEl = document.getElementById('print-styles')
        if (titleEl) titleEl.remove()
        if (stylesEl) stylesEl.remove()
        
        // Restore hidden elements
        hiddenElements.forEach(el => {
          el.style.display = ''
        })
      }, 1000)
    }, 100)
    
    addNotification({
      type: 'success',
      message: 'Opening print dialog for PDF export...'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <h1 className="text-3xl font-bold text-text-primary">
          Route Optimizer
        </h1>
        <p className="text-text-secondary mt-2">
          Optimize your delivery routes for maximum efficiency and minimum emissions.
        </p>
      </div>

      {/* TOP SECTION: Input Form */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-text-primary">
                Route Details
              </h2>
              <div className="text-sm text-text-secondary">
                <span className="font-medium">Current Optimization:</span>
                <span className="ml-2 px-2 py-1 rounded bg-blue-50 text-blue-700">
                  Time({optimizationWeights.timeWeight}%) | Cost({optimizationWeights.costWeight}%) | Emissions({optimizationWeights.emissionsWeight}%)
                </span>
                <a 
                  href="/settings" 
                  className="ml-2 text-xs text-accent hover:text-accent/80 underline"
                  title="Change optimization preferences"
                >
                  Adjust in Settings
                </a>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Source */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Starting Point
                  </label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary" />
                    <input
                      type="text"
                      value={form.source}
                      onChange={(e) => setForm(prev => ({ ...prev, source: e.target.value }))}
                      placeholder="Enter starting address"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Destination
                  </label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary" />
                    <input
                      type="text"
                      value={form.destination}
                      onChange={(e) => setForm(prev => ({ ...prev, destination: e.target.value }))}
                      placeholder="Enter destination address"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Vehicle Type */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Vehicle Category
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'LCV', label: 'Light Commercial', icon: TruckIcon },
                      { value: 'MCV', label: 'Medium Commercial', icon: TruckIcon },
                      { value: 'HCV', label: 'Heavy Commercial', icon: TruckIcon },
                      { value: 'THREE_WHEELER', label: 'Three Wheeler', icon: TruckIcon }
                    ].map((vehicle) => (
                      <button
                        key={vehicle.value}
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, vehicleType: vehicle.value as any }))}
                        className={`p-2 border rounded-lg transition-colors text-center ${
                          form.vehicleType === vehicle.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <vehicle.icon className="h-4 w-4 mx-auto mb-1" />
                        <span className="text-xs font-medium">{vehicle.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fuel Type */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Fuel Type
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { value: 'DIESEL', label: 'Diesel', icon: FireIcon },
                      { value: 'PETROL', label: 'Petrol', icon: FireIcon },
                      { value: 'CNG', label: 'CNG', icon: CloudIcon },
                      { value: 'ELECTRIC', label: 'Electric', icon: SparklesIcon }
                    ].map((fuel) => (
                      <button
                        key={fuel.value}
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, fuelType: fuel.value as any }))}
                        className={`p-2 border rounded-lg transition-colors text-center ${
                          form.fuelType === fuel.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <fuel.icon className="h-4 w-4 mx-auto mb-1" />
                        <span className="text-xs font-medium">{fuel.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Options and Button */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Options */}
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={form.includeWeather}
                      onChange={(e) => setForm(prev => ({ ...prev, includeWeather: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                    />
                    <span className="ml-2 text-sm text-text-primary">Include weather conditions</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={form.includeAlternatives}
                      onChange={(e) => setForm(prev => ({ ...prev, includeAlternatives: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                    />
                    <span className="ml-2 text-sm text-text-primary">Show alternative routes</span>
                  </label>
                </div>

                {/* Optimize Button */}
                <button
                  onClick={handleOptimize}
                  disabled={isOptimizing}
                  className="bg-blue-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  {isOptimizing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Optimizing...
                    </div>
                  ) : (
                    'Optimize Route'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: Results */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-6">
          {optimizedRoute ? (
            <>
              {/* Route Summary */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Route Overview
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-text-primary">
                      {optimizedRoute.distance.km} km
                    </p>
                    <p className="text-sm text-text-secondary">Total Distance</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-text-primary">
                      {optimizedRoute.duration.with_traffic?.hours || optimizedRoute.duration.normal.hours}h
                    </p>
                    <p className="text-sm text-text-secondary">Estimated Time</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-accent">
                      {optimizedRoute.emissions.co2_emissions} kg
                    </p>
                    <p className="text-sm text-text-secondary">CO₂ Emissions</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-text-primary">
                      ₹{optimizedRoute.fuel_consumption.fuel_cost}
                    </p>
                    <p className="text-sm text-text-secondary">Fuel Cost</p>
                  </div>
                </div>
                
                {/* Main Route Selection */}
                <div className="mt-4 p-3 border rounded-lg flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-text-primary">
                        {optimizedRoute.main_route_summary || 'Main Route'}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Primary
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary">
                      Optimized based on your current preferences: 
                      Time({optimizationWeights.timeWeight}%), 
                      Cost({optimizationWeights.costWeight}%), 
                      Emissions({optimizationWeights.emissionsWeight}%)
                    </p>
                  </div>
                  <button 
                    onClick={() => handleSelectRoute(0)}
                    className={`px-4 py-2 rounded text-sm transition-colors ${
                      selectedRouteIndex === 0
                        ? 'bg-accent text-white'
                        : 'bg-primary text-white hover:bg-primary/90'
                    }`}
                  >
                    {selectedRouteIndex === 0 ? 'Selected' : 'Select'}
                  </button>
                </div>
              </div>

              {/* Traffic & Weather */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Traffic */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                    <ClockIcon className="h-5 w-5 mr-2" />
                    Traffic Conditions
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Current Status</span>
                      <span className={`font-medium ${
                        optimizedRoute.traffic.current_conditions === 'HEAVY' ? 'text-red-600' :
                        optimizedRoute.traffic.current_conditions === 'MODERATE' ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {optimizedRoute.traffic.current_conditions}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Delay Factor</span>
                      <span className="font-medium">{optimizedRoute.traffic.delay_factor.toFixed(1)}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Alternative Routes</span>
                      <span className="font-medium">{optimizedRoute.traffic.alternative_routes_available}</span>
                    </div>
                  </div>
                </div>

                {/* Weather Forecast Along Route */}
                {(getCurrentWeatherData() || isLoadingWeather) && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-text-primary flex items-center">
                        <CloudIcon className="h-5 w-5 mr-2" />
                        Weather Forecast Along Route 
                        {getCurrentWeatherData() && ` (${getCurrentWeatherData().total_waypoints} points)`}
                      </h3>
                      {selectedRouteIndex > 0 && (
                        <span className="text-sm text-blue-600 font-medium">
                          Alternative Route {selectedRouteIndex}
                        </span>
                      )}
                    </div>
                    
                    {isLoadingWeather ? (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                        <p className="mt-2 text-text-secondary">Loading weather data...</p>
                      </div>
                    ) : getCurrentWeatherData() ? (
                      <>
                        {/* Forecast Info Banner */}
                        <div className="mb-4 p-3 rounded-lg bg-blue-50 border-l-4 border-blue-500">
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 text-blue-600 mr-2" />
                            <span className="text-sm text-blue-800 font-medium">
                              Showing weather forecast at estimated arrival times
                            </span>
                          </div>
                        </div>

                        {/* Overall Safety Score */}
                        <div className="mb-4 p-3 rounded-lg bg-gray-50">
                          <div className="flex justify-between items-center">
                            <span className="text-text-secondary">Overall Safety Score</span>
                            <span className={`font-bold text-lg ${
                              getCurrentWeatherData().overall_safety_score >= 80 ? 'text-green-600' :
                              getCurrentWeatherData().overall_safety_score >= 60 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {getCurrentWeatherData().overall_safety_score}/100
                            </span>
                          </div>
                        </div>
                      </>
                    ) : null}

                    {/* Weather Waypoints */}
                    {getCurrentWeatherData() && (
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {getCurrentWeatherData().waypoints.map((waypoint: any, index: number) => (
                        <div key={index} className="p-3 border rounded-lg bg-white">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="font-medium text-text-primary">
                                {waypoint.location?.name || `Waypoint ${waypoint.sequence}`}
                              </span>
                              <p className="text-sm text-text-secondary">
                                {waypoint.current?.weather_condition} - {waypoint.current?.weather_description}
                              </p>
                              {/* Estimated Arrival Time */}
                              {waypoint.estimated_arrival_time && (
                                <p className="text-xs text-blue-600 font-medium mt-1">
                                  Est. arrival: {new Date(waypoint.estimated_arrival_time).toLocaleString()}
                                </p>
                              )}
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              waypoint.driving_conditions?.safety_score >= 80 ? 'bg-green-100 text-green-800' :
                              waypoint.driving_conditions?.safety_score >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {waypoint.driving_conditions?.safety_score || 'N/A'}/100
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-text-secondary">Temperature: </span>
                              <span className="font-medium">
                                {waypoint.current?.temperature}°C (feels {waypoint.current?.feels_like}°C)
                              </span>
                            </div>
                            <div>
                              <span className="text-text-secondary">Visibility: </span>
                              <span className="font-medium">
                                {((waypoint.current?.visibility || 10000) / 1000).toFixed(1)} km
                              </span>
                            </div>
                            <div>
                              <span className="text-text-secondary">Humidity: </span>
                              <span className="font-medium">{waypoint.current?.humidity}%</span>
                            </div>
                            <div>
                              <span className="text-text-secondary">Wind: </span>
                              <span className="font-medium">{waypoint.current?.wind_speed} m/s</span>
                            </div>
                          </div>
                          
                          {waypoint.current?.precipitation > 0 && (
                            <div className="mt-2 text-sm">
                              <span className="text-text-secondary">Precipitation: </span>
                              <span className="font-medium text-blue-600">{waypoint.current.precipitation} mm</span>
                            </div>
                          )}
                        </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Fuel & Emissions Details */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                  <CurrencyRupeeIcon className="h-5 w-5 mr-2" />
                  Cost & Environmental Impact
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-text-primary">
                      {optimizedRoute.fuel_consumption.fuel_required} {optimizedRoute.fuel_consumption.unit}
                    </p>
                    <p className="text-xs text-text-secondary">Fuel Required</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-text-primary">
                      {optimizedRoute.fuel_consumption.efficiency} km/{optimizedRoute.fuel_consumption.unit}
                    </p>
                    <p className="text-xs text-text-secondary">Efficiency</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-green-600">
                      {optimizedRoute.emissions.environmental_score}/100
                    </p>
                    <p className="text-xs text-text-secondary">Eco Score</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-text-primary">
                      {optimizedRoute.route_analysis.safety_rating}/100
                    </p>
                    <p className="text-xs text-text-secondary">Safety Rating</p>
                  </div>
                </div>
              </div>

              {/* Embedded Map */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">
                    Route Map
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      📍 Showing: {optimizedRoute.source}
                    </span>
                    <span className="text-sm text-blue-600 font-medium">
                      {selectedRouteIndex === 0 ? 'Main Route' : `Alternative Route ${selectedRouteIndex}`}
                    </span>
                  </div>
                </div>
                <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
                  <iframe
                    key={selectedRouteIndex} // Force reload when route changes
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8'}&q=${encodeURIComponent(optimizedRoute.source)}&zoom=12&region=IN`}
                    allowFullScreen
                    title="Route Map - Start Location"
                    className="border-0"
                  ></iframe>
                </div>
              </div>

              {/* Route Path Details */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">
                    Route Details
                  </h3>
                  <span className="text-sm text-blue-600 font-medium">
                    {selectedRouteIndex === 0 ? 'Main Route' : `Alternative Route ${selectedRouteIndex}`}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      A
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-text-primary">Start: {optimizedRoute.source}</p>
                      <p className="text-sm text-text-secondary">
                        {getCurrentRoute()?.route_path?.start_address || optimizedRoute.route_path?.start_address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      B
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-text-primary">End: {optimizedRoute.destination}</p>
                      <p className="text-sm text-text-secondary">
                        {getCurrentRoute()?.route_path?.end_address || optimizedRoute.route_path?.end_address}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg flex justify-between items-center">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">
                      {getCurrentRoute()?.route_path?.steps || optimizedRoute.route_path?.steps} steps
                    </span> • 
                    <span className="ml-2">Vehicle: {optimizedRoute.vehicleType} ({optimizedRoute.fuelType})</span>
                  </p>
                  <button
                    onClick={() => setShowStepsModal(true)}
                    className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    Show Steps
                  </button>
                </div>
              </div>

              {/* Alternative Routes */}
              {optimizedRoute.alternatives && optimizedRoute.alternatives.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">
                    Alternative Routes ({optimizedRoute.alternatives.length})
                  </h3>
                  <div className="space-y-3">
                    {optimizedRoute.alternatives.map((alt: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-text-primary">{alt.summary}</h4>
                              {alt.route_type && (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  alt.route_type === 'highway_toll' ? 'bg-blue-100 text-blue-800' :
                                  alt.route_type === 'highway_free' ? 'bg-green-100 text-green-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {alt.route_type === 'highway_toll' ? 'Fast & Tolls' :
                                   alt.route_type === 'highway_free' ? 'Highway' :
                                   'Scenic Route'}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-text-secondary">Route {alt.route_id} • Optimized for your preferences</p>
                          </div>
                          <button 
                            onClick={() => handleSelectRoute(index + 1)}
                            className={`px-3 py-1 rounded text-sm transition-colors ${
                              selectedRouteIndex === index + 1
                                ? 'bg-accent text-white'
                                : 'bg-primary text-white hover:bg-primary/90'
                            }`}
                          >
                            {selectedRouteIndex === index + 1 ? 'Selected' : 'Select'}
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <p className="text-sm font-medium">{alt.distance.km} km</p>
                            <p className="text-xs text-text-secondary">Distance</p>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <p className="text-sm font-medium">
                              {alt.duration.with_traffic ? 
                                Math.round(alt.duration.with_traffic.value / 3600 * 10) / 10 : 
                                Math.round(alt.duration.normal.value / 3600 * 10) / 10
                              }h
                            </p>
                            <p className="text-xs text-text-secondary">Time</p>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <p className="text-sm font-medium">₹{alt.fuel_cost}</p>
                            <p className="text-xs text-text-secondary">Fuel Cost</p>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <p className="text-sm font-medium">{alt.co2_emissions} kg</p>
                            <p className="text-xs text-text-secondary">CO2</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Weather Recommendations */}
              {optimizedRoute.weather && optimizedRoute.weather.route_recommendations.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">
                    Route Weather Recommendations
                  </h3>
                  <div className="space-y-2">
                    {optimizedRoute.weather.route_recommendations.map((rec: string, index: number) => (
                      <div key={index} className="flex items-start space-x-2 p-2 bg-yellow-50 rounded-lg">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-yellow-800">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3">
                <button 
                  onClick={navigateToGoogleMaps}
                  className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center"
                >
                  <ArrowTopRightOnSquareIcon className="h-5 w-5 mr-2" />
                  Navigate
                </button>
                <button 
                  onClick={exportAsPDF}
                  className="flex-1 bg-surface text-text-primary border border-gray-300 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                  Export PDF
                </button>
                <button 
                  onClick={() => setOptimizedRoute(null)}
                  className="px-6 py-3 text-text-secondary hover:text-text-primary transition-colors"
                >
                  Clear
                </button>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center py-12">
                <MapPinIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  Ready to Optimize
                </h3>
                <p className="text-text-secondary">
                  Enter source and destination to get real-time route optimization with traffic, weather, and cost analysis.
                </p>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Steps Modal */}
      {showStepsModal && optimizedRoute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-text-primary">
                Route Directions
              </h3>
              <button
                onClick={() => setShowStepsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                {/* Current Route Info */}
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-medium text-blue-900 mb-2">
                    {selectedRouteIndex === 0 ? 'Main Route' : `Alternative Route ${selectedRouteIndex}`}
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Distance: </span>
                      <span className="font-medium">{getCurrentRoute()?.distance?.km || optimizedRoute.distance.km} km</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Duration: </span>
                      <span className="font-medium">
                        {getCurrentRoute()?.duration?.with_traffic?.hours || 
                         getCurrentRoute()?.duration?.normal?.hours || 
                         optimizedRoute.duration.with_traffic?.hours || 
                         optimizedRoute.duration.normal.hours}h
                      </span>
                    </div>
                  </div>
                </div>

                {/* Detailed Steps */}
                <div className="space-y-3">
                  <h4 className="font-medium text-text-primary">Turn-by-Turn Directions</h4>
                  
                  {/* Start Point */}
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-green-800">Start your journey</p>
                      <p className="text-sm text-green-700">From: {optimizedRoute.source}</p>
                      <p className="text-xs text-green-600 mt-1">
                        {getCurrentRoute()?.route_path?.start_address || optimizedRoute.route_path?.start_address}
                      </p>
                    </div>
                  </div>

                  {/* Actual Route Steps from Google Directions API */}
                  {(getCurrentRoute()?.route_path?.detailed_steps || optimizedRoute.route_path?.detailed_steps) ? 
                    (getCurrentRoute()?.route_path?.detailed_steps || optimizedRoute.route_path?.detailed_steps).map((step: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border-l-4 border-gray-300">
                      <div className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                        {index + 2}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-text-primary">{step.instruction}</p>
                        <div className="flex space-x-4 mt-1">
                          <span className="text-sm text-text-secondary">{step.distance.text}</span>
                          <span className="text-sm text-text-secondary">{step.duration.text}</span>
                        </div>
                        {step.maneuver && step.maneuver !== 'straight' && (
                          <div className="mt-1">
                            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                              {step.maneuver.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-4 text-text-secondary">
                      <p>Detailed route steps not available</p>
                    </div>
                  )}

                  {/* End Point */}
                  <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                    <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                      {((getCurrentRoute()?.route_path?.detailed_steps || optimizedRoute.route_path?.detailed_steps)?.length || 0) + 2}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-red-800">Arrive at your destination</p>
                      <p className="text-sm text-red-700">To: {optimizedRoute.destination}</p>
                      <p className="text-xs text-red-600 mt-1">
                        {getCurrentRoute()?.route_path?.end_address || optimizedRoute.route_path?.end_address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Route Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-text-primary mb-2">Route Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-text-secondary">Total Steps: </span>
                      <span className="font-medium">{optimizedRoute.route_path?.steps || 7}</span>
                    </div>
                    <div>
                      <span className="text-text-secondary">Fuel Cost: </span>
                      <span className="font-medium">₹{getCurrentRoute()?.fuel_cost || optimizedRoute.fuel_consumption?.fuel_cost}</span>
                    </div>
                    <div>
                      <span className="text-text-secondary">CO₂ Emissions: </span>
                      <span className="font-medium">{getCurrentRoute()?.co2_emissions || optimizedRoute.emissions?.co2_emissions} kg</span>
                    </div>
                    <div>
                      <span className="text-text-secondary">Vehicle: </span>
                      <span className="font-medium">{optimizedRoute.vehicleType} ({optimizedRoute.fuelType})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowStepsModal(false)}
                className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
              >
                Close
              </button>
              <button
                onClick={exportRouteDirections}
                className="px-4 py-2 bg-accent text-white rounded hover:bg-accent/90 transition-colors"
              >
                Export Directions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 