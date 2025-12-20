// User & Authentication Types
export interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  inventoryId?: string
  warehouseId?: string
  phone?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type UserRole = 
  | 'admin'
  | 'inventory_manager'
  | 'warehouse_staff'
  | 'environment_manager'
  | 'auditor'
  | 'logistics_manager'
  | 'fleet_operator'
  | 'sustainability_manager'

// Vehicle Types
export interface Vehicle {
  _id: string
  vehicleNumber: string
  type: VehicleType
  make: string
  model: string
  year: number
  fuelType: FuelType
  capacity: number
  currentLoad: number
  status: VehicleStatus
  assignedDriver?: User
  currentLocation?: {
    address?: string
    latitude?: number
    longitude?: number
  }
  warehouseId: string
  specifications?: {
    mileage?: number
    fuelTankCapacity?: number
    maxSpeed?: number
    emissionStandard?: string
  }
  maintenance?: {
    lastServiceDate?: string
    nextServiceDate?: string
    totalDistance?: number
    maintenanceHistory?: MaintenanceRecord[]
  }
  insurance?: {
    provider?: string
    policyNumber?: string
    expiryDate?: string
    premium?: number
  }
  isActive: boolean
  loadPercentage: number
  availableCapacity: number
  createdAt: string
  updatedAt: string
}

export type VehicleType = 'lcv' | 'mcv' | 'hcv' | 'three_wheeler' | 'two_wheeler'
export type FuelType = 'diesel' | 'petrol' | 'cng' | 'electric' | 'hybrid'
export type VehicleStatus = 'available' | 'in_use' | 'maintenance' | 'retired'

export interface MaintenanceRecord {
  date: string
  description: string
  cost: number
  serviceCenter: string
}

// Delivery Types
export interface Delivery {
  _id: string
  deliveryNumber: string
  source: {
    warehouseId: string
    address: string
    latitude?: number
    longitude?: number
    contactPerson?: string
    contactPhone?: string
  }
  destinations: DeliveryDestination[]
  vehicleId?: Vehicle
  driverId?: User
  status: DeliveryStatus
  priority: DeliveryPriority
  scheduledDate: string
  estimatedDuration?: number
  actualDuration?: number
  totalWeight: number
  totalDistance?: number
  routeId?: string
  clusterId?: string
  emissions?: {
    estimatedCO2?: number
    actualCO2?: number
    fuelConsumed?: number
  }
  weather?: {
    condition?: string
    temperature?: number
    precipitation?: number
    checkedAt?: string
  }
  tracking?: {
    startTime?: string
    endTime?: string
    currentLocation?: {
      latitude: number
      longitude: number
      timestamp: string
    }
    updates?: TrackingUpdate[]
  }
  cost?: {
    fuel?: number
    toll?: number
    other?: number
    total?: number
  }
  createdBy: string
  completedBy?: string
  notes?: string
  cancellationReason?: string
  totalDestinations: number
  completedDestinations: number
  progressPercentage: number
  createdAt: string
  updatedAt: string
}

export interface DeliveryDestination {
  address: string
  latitude?: number
  longitude?: number
  contactPerson?: string
  contactPhone?: string
  items?: DeliveryItem[]
  instructions?: string
  scheduledTime?: string
  deliveredTime?: string
  status: DeliveryStatus
  recipientName?: string
  recipientSignature?: string
  deliveryProof?: string
  notes?: string
}

export interface DeliveryItem {
  productId: string
  stockId?: string
  quantity: number
  weight?: number
}

export interface TrackingUpdate {
  timestamp: string
  location: {
    latitude: number
    longitude: number
  }
  status: string
  note?: string
}

export type DeliveryStatus = 'pending' | 'scheduled' | 'in_transit' | 'delivered' | 'failed' | 'cancelled'
export type DeliveryPriority = 'low' | 'medium' | 'high' | 'urgent'

// Route Types
export interface Route {
  _id: string
  routeNumber: string
  deliveryId: string
  source: {
    address: string
    latitude?: number
    longitude?: number
  }
  waypoints: Waypoint[]
  optimizationObjective: OptimizationObjective
  status: RouteStatus
  metrics: RouteMetrics
  alternativeRoutes?: AlternativeRoute[]
  encodedPolyline?: string
  googleMapsUrl?: string
  trafficConditions?: TrafficConditions
  weatherConditions?: WeatherConditions
  evCompatibility?: EVCompatibility
  optimizationDetails?: {
    algorithm?: string
    processingTime?: number
    iterations?: number
    optimizedAt?: string
    parameters?: {
      emissionsWeight?: number
      fuelWeight?: number
      timeWeight?: number
      distanceWeight?: number
    }
  }
  createdBy: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Waypoint {
  address?: string
  latitude?: number
  longitude?: number
  sequence: number
  estimatedArrivalTime?: string
  actualArrivalTime?: string
  stopDuration?: number
  distanceFromPrevious?: number
}

export interface RouteMetrics {
  totalDistance: number
  estimatedDuration?: number
  actualDuration?: number
  estimatedFuelConsumption?: number
  actualFuelConsumption?: number
  estimatedCO2Emission?: number
  actualCO2Emission?: number
  timeSaved?: number
  distanceSaved?: number
  co2Saved?: number
}

export interface AlternativeRoute {
  name: string
  totalDistance: number
  estimatedDuration: number
  estimatedFuelConsumption: number
  estimatedCO2Emission: number
  waypoints?: Waypoint[]
  encodedPolyline?: string
  score?: number
}

export interface TrafficConditions {
  checkedAt: string
  avgSpeed?: number
  congestionLevel?: string
  incidents?: Array<{
    type: string
    location: string
    severity: string
  }>
}

export interface WeatherConditions {
  checkedAt: string
  condition?: string
  temperature?: number
  precipitation?: number
  windSpeed?: number
  visibility?: number
  isRouteAffected?: boolean
  warnings?: string[]
}

export interface EVCompatibility {
  isCompatible: boolean
  range?: number
  chargingStations?: Array<{
    name: string
    address: string
    latitude: number
    longitude: number
    distanceFromRoute: number
    type: string
    availability: string
  }>
  estimatedCharges?: number
  chargingTime?: number
}

export type OptimizationObjective = 'emissions' | 'fuel' | 'time' | 'distance' | 'balanced'
export type RouteStatus = 'draft' | 'optimized' | 'active' | 'completed' | 'cancelled'

// Analytics Types
export interface SustainabilityMetrics {
  summary: {
    totalCO2Saved: number
    totalFuelSaved: number
    totalDistanceSaved: number
    totalTimeSaved: number
    totalDeliveries: number
    completedDeliveries: number
    avgEmissionsPerDelivery: number
    evAdoptionRate: number
  }
  routes: RouteAnalytics
  deliveries: DeliveryAnalytics
  emissions: EmissionAnalytics
  vehicles: VehicleUtilization
  movements: MovementEmissions
  period: {
    startDate: string
    endDate: string
  }
}

export interface RouteAnalytics {
  totalRoutes: number
  totalDistance: number
  totalCO2Saved: number
  totalFuelSaved: number
  totalTimeSaved: number
  totalDistanceSaved: number
  avgOptimizationTime: number
  routesByObjective: Record<string, number>
  monthlyTrends: Array<{
    month: string
    totalRoutes: number
    totalDistance: number
    totalCO2Saved: number
    totalTimeSaved: number
  }>
}

export interface DeliveryAnalytics {
  totalDeliveries: number
  completedDeliveries: number
  inTransitDeliveries: number
  pendingDeliveries: number
  failedDeliveries: number
  cancelledDeliveries: number
  totalDestinations: number
  avgDestinationsPerDelivery: number
  totalWeight: number
  totalDistance: number
  avgDeliveryTime: number
  onTimeDeliveryRate: number
  completionRate: number
  deliverysByPriority: Record<string, number>
  deliverysByStatus: Record<string, number>
}

export interface EmissionAnalytics {
  totalCO2Emissions: number
  totalCO2Saved: number
  co2FromRoutes: number
  co2FromMovements: number
  avgEmissionsPerRoute: number
  avgEmissionsPerDelivery: number
  emissionsByFuelType: Record<string, number>
  emissionsByVehicleType: Record<string, number>
  emissionTrends: Array<{
    date: string
    co2Emissions: number
    routeCount: number
    movementCount: number
  }>
}

export interface VehicleUtilization {
  totalVehicles: number
  availableVehicles: number
  inUseVehicles: number
  maintenanceVehicles: number
  vehiclesByType: Record<string, number>
  vehiclesByFuelType: Record<string, number>
  avgLoadPercentage: number
  evCount: number
  evPercentage: number
  totalCapacity: number
  usedCapacity: number
  utilizationRate: number
}

export interface MovementEmissions {
  totalMovements: number
  totalCO2: number
  co2Saved: number
  movementsByMode: Record<string, number>
  emissionsByMode: Record<string, number>
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// Inventory Types (existing)
export interface Warehouse {
  _id: string
  warehouseCode: string
  name: string
  location: {
    street?: string
    city: string
    state: string
    country: string
    zipCode?: string
    latitude?: number
    longitude?: number
  }
  capacity: {
    totalArea: number
    usedArea: number
    maxWeight: number
    currentWeight: number
  }
  status: string
  type: string
  inventoryId: string
  createdAt: string
  updatedAt: string
}

export interface Product {
  _id: string
  sku: string
  name: string
  description?: string
  category?: string
  brand?: string
  weight: number
  dimensions: {
    length: number
    width: number
    height: number
  }
  unitOfMeasure: string
  barcode?: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface Stock {
  _id: string
  productId: string
  warehouseId: string
  quantity: number
  reorderPoint: number
  maxQuantity: number
  location?: string
  expiryDate?: string
  batchNumber?: string
  costPrice: number
  sellingPrice: number
  lastRestockDate?: string
  createdAt: string
  updatedAt: string
}
