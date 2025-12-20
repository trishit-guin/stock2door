import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'

// Types for API responses
export interface ApiResponse<T = any> {
  data?: T
  message?: string
  error?: string
  success?: boolean
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    name?: string
    firstName?: string
    lastName?: string
    role: string
  }
  token: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username?: string
  name?: string
  firstName?: string
  lastName?: string
  email: string
  password: string
  role: string
  phone?: string
}

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response
      },
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Only auto-redirect if we're not on the login/signup page and have an invalid token
          // Don't redirect for failed login/register attempts
          const isAuthPage = typeof window !== 'undefined' && (window.location.pathname === '/login' || window.location.pathname === '/signup')
          const isLoginOrRegister = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register')
          
          if (!isAuthPage && !isLoginOrRegister) {
            // Clear token and redirect to login only for authenticated routes with invalid tokens
            this.removeToken()
            if (typeof window !== 'undefined') {
              window.location.href = '/login'
            }
          }
        }
        return Promise.reject(error)
      }
    )
  }

  // Token management
  private getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('smartroute_token')
  }

  public setToken(token: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('smartroute_token', token)
  }

  public removeToken(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem('smartroute_token')
  }

  // Auth endpoints
  public async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.client.post('/auth/login', credentials)
    const data = response.data
    
    // Save token after successful login
    const token = data.data?.token || data.token;
    if (token) {
      this.setToken(token)
    }
    
    return data
  }

  public async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.client.post('/auth/register', userData)
    const data = response.data
    
    // Save token after successful registration
    const token = data.data?.token || data.token;
    if (token) {
      this.setToken(token)
    }
    
    return data
  }

  public async getMe(): Promise<any> {
    const response = await this.client.get('/auth/me')
    return response.data
  }

  public async getDashboardStats(): Promise<any> {
    const response = await this.client.get('/dashboard/stats')
    return response.data
  }

  // Vehicle Management
  public async getVehicles(params?: {
    page?: number
    limit?: number
    status?: string
    type?: string
    fuelType?: string
    warehouseId?: string
    search?: string
  }): Promise<any> {
    const response = await this.client.get('/vehicles', { params })
    return response.data
  }

  public async getVehicleById(id: string): Promise<any> {
    const response = await this.client.get(`/vehicles/${id}`)
    return response.data
  }

  public async getAvailableVehicles(warehouseId?: string, requiredCapacity?: number): Promise<any> {
    const params: any = {}
    if (warehouseId) params.warehouseId = warehouseId
    if (requiredCapacity) params.requiredCapacity = requiredCapacity
    const response = await this.client.get('/vehicles/available', { params })
    return response.data
  }

  public async createVehicle(vehicleData: any): Promise<any> {
    const response = await this.client.post('/vehicles', vehicleData)
    return response.data
  }

  public async updateVehicle(id: string, vehicleData: any): Promise<any> {
    const response = await this.client.put(`/vehicles/${id}`, vehicleData)
    return response.data
  }

  public async deleteVehicle(id: string): Promise<any> {
    const response = await this.client.delete(`/vehicles/${id}`)
    return response.data
  }

  public async assignDriver(vehicleId: string, driverId: string): Promise<any> {
    const response = await this.client.put(`/vehicles/${vehicleId}/assign-driver`, { driverId })
    return response.data
  }

  public async updateVehicleLocation(vehicleId: string, location: {
    latitude: number
    longitude: number
    address?: string
  }): Promise<any> {
    const response = await this.client.put(`/vehicles/${vehicleId}/location`, location)
    return response.data
  }

  public async getVehicleMaintenanceHistory(vehicleId: string): Promise<any> {
    const response = await this.client.get(`/vehicles/${vehicleId}/maintenance`)
    return response.data
  }

  public async addVehicleMaintenanceRecord(vehicleId: string, record: any): Promise<any> {
    const response = await this.client.post(`/vehicles/${vehicleId}/maintenance`, record)
    return response.data
  }

  // Delivery Management
  public async getDeliveries(params?: {
    page?: number
    limit?: number
    status?: string
    warehouseId?: string
    driverId?: string
    priority?: string
    startDate?: string
    endDate?: string
  }): Promise<any> {
    const response = await this.client.get('/deliveries', { params })
    return response.data
  }

  public async getDeliveryById(id: string): Promise<any> {
    const response = await this.client.get(`/deliveries/${id}`)
    return response.data
  }

  public async getPendingDeliveries(warehouseId?: string): Promise<any> {
    const params = warehouseId ? { warehouseId } : {}
    const response = await this.client.get('/deliveries/pending', { params })
    return response.data
  }

  public async getActiveDeliveries(): Promise<any> {
    const response = await this.client.get('/deliveries/active')
    return response.data
  }

  public async createDelivery(deliveryData: any): Promise<any> {
    const response = await this.client.post('/deliveries', deliveryData)
    return response.data
  }

  public async updateDelivery(id: string, deliveryData: any): Promise<any> {
    const response = await this.client.put(`/deliveries/${id}`, deliveryData)
    return response.data
  }

  public async optimizeDeliveryRoute(deliveryId: string, options?: {
    optimizationObjective?: 'emissions' | 'fuel' | 'time' | 'distance' | 'balanced'
    avoidTolls?: boolean
    avoidHighways?: boolean
  }): Promise<any> {
    const response = await this.client.post(`/deliveries/${deliveryId}/optimize-route`, options || {})
    return response.data
  }

  public async startDelivery(id: string): Promise<any> {
    const response = await this.client.put(`/deliveries/${id}/start`)
    return response.data
  }

  public async completeDelivery(id: string, actualMetrics?: {
    duration?: number
    fuelConsumption?: number
    co2Emission?: number
  }): Promise<any> {
    const response = await this.client.put(`/deliveries/${id}/complete`, { actualMetrics })
    return response.data
  }

  public async addDeliveryTracking(id: string, tracking: {
    latitude: number
    longitude: number
    status: string
    note?: string
  }): Promise<any> {
    const response = await this.client.post(`/deliveries/${id}/tracking`, tracking)
    return response.data
  }

  public async cancelDelivery(id: string, reason: string): Promise<any> {
    const response = await this.client.put(`/deliveries/${id}/cancel`, { reason })
    return response.data
  }

  // Analytics & Sustainability
  public async getSustainabilityMetrics(filters?: {
    startDate?: string
    endDate?: string
    warehouseId?: string
    vehicleType?: string
    fuelType?: string
  }): Promise<any> {
    const response = await this.client.get('/analytics/sustainability', { params: filters })
    return response.data
  }

  public async getRouteAnalytics(startDate?: string, endDate?: string): Promise<any> {
    const params: any = {}
    if (startDate) params.startDate = startDate
    if (endDate) params.endDate = endDate
    const response = await this.client.get('/analytics/routes', { params })
    return response.data
  }

  public async getDeliveryAnalytics(params?: {
    startDate?: string
    endDate?: string
    warehouseId?: string
  }): Promise<any> {
    const response = await this.client.get('/analytics/deliveries', { params })
    return response.data
  }

  public async getVehicleUtilization(vehicleType?: string, fuelType?: string): Promise<any> {
    const params: any = {}
    if (vehicleType) params.vehicleType = vehicleType
    if (fuelType) params.fuelType = fuelType
    const response = await this.client.get('/analytics/vehicles', { params })
    return response.data
  }

  public async getEmissionAnalytics(startDate?: string, endDate?: string): Promise<any> {
    const params: any = {}
    if (startDate) params.startDate = startDate
    if (endDate) params.endDate = endDate
    const response = await this.client.get('/analytics/emissions', { params })
    return response.data
  }

  public async getFleetComparison(warehouseIds: string[]): Promise<any> {
    const response = await this.client.post('/analytics/fleet-comparison', { warehouseIds })
    return response.data
  }

  // Warehouse Management
  public async getWarehouses(params?: {
    page?: number
    limit?: number
    inventoryId?: string
    status?: string
    type?: string
  }): Promise<any> {
    const response = await this.client.get('/warehouses', { params })
    return response.data
  }

  public async getWarehouseById(id: string): Promise<any> {
    const response = await this.client.get(`/warehouses/${id}`)
    return response.data
  }

  public async getWarehouseStock(warehouseId: string): Promise<any> {
    const response = await this.client.get(`/warehouses/${warehouseId}/stock`)
    return response.data
  }

  public async getWarehouseCapacity(warehouseId: string): Promise<any> {
    const response = await this.client.get(`/warehouses/${warehouseId}/capacity`)
    return response.data
  }

  public async getWarehouseMovements(warehouseId: string): Promise<any> {
    const response = await this.client.get(`/warehouses/${warehouseId}/movements`)
    return response.data
  }

  public async getNearbyWarehouses(latitude: number, longitude: number, maxDistance?: number): Promise<any> {
    const params: any = { latitude, longitude }
    if (maxDistance) params.maxDistance = maxDistance
    const response = await this.client.get('/warehouses/nearby', { params })
    return response.data
  }

  public async getWarehousesWithoutCoordinates(): Promise<any> {
    const response = await this.client.get('/warehouses/missing-coordinates')
    return response.data
  }

  public async getWarehouseDistance(warehouseId1: string, warehouseId2: string): Promise<any> {
    const response = await this.client.get(`/warehouses/distance/${warehouseId1}/${warehouseId2}`)
    return response.data
  }

  public async createWarehouse(warehouseData: any): Promise<any> {
    const response = await this.client.post('/warehouses', warehouseData)
    return response.data
  }

  public async updateWarehouse(id: string, warehouseData: any): Promise<any> {
    const response = await this.client.put(`/warehouses/${id}`, warehouseData)
    return response.data
  }

  public async deleteWarehouse(id: string): Promise<any> {
    const response = await this.client.delete(`/warehouses/${id}`)
    return response.data
  }

  public async updateWarehouseCoordinates(id: string, latitude: number, longitude: number): Promise<any> {
    const response = await this.client.put(`/warehouses/${id}/coordinates`, { latitude, longitude })
    return response.data
  }

  public async geocodeWarehouse(id: string): Promise<any> {
    const response = await this.client.post(`/warehouses/${id}/geocode`)
    return response.data
  }

  // Product Management
  public async getProducts(params?: {
    page?: number
    limit?: number
    inventoryId?: string
    status?: string
    category?: string
    search?: string
  }): Promise<any> {
    const response = await this.client.get('/products', { params })
    return response.data
  }

  public async getProductById(id: string): Promise<any> {
    const response = await this.client.get(`/products/${id}`)
    return response.data
  }

  public async getProductBySKU(sku: string): Promise<any> {
    const response = await this.client.get(`/products/sku/${sku}`)
    return response.data
  }

  public async getProductStock(productId: string): Promise<any> {
    const response = await this.client.get(`/products/${productId}/stock`)
    return response.data
  }

  public async createProduct(productData: any): Promise<any> {
    const response = await this.client.post('/products', productData)
    return response.data
  }

  public async updateProduct(id: string, productData: any): Promise<any> {
    const response = await this.client.put(`/products/${id}`, productData)
    return response.data
  }

  public async deleteProduct(id: string): Promise<any> {
    const response = await this.client.delete(`/products/${id}`)
    return response.data
  }

  // Stock Management
  public async getAllStock(params?: {
    page?: number
    limit?: number
    warehouseId?: string
    productId?: string
    inventoryId?: string
  }): Promise<any> {
    const response = await this.client.get('/stock', { params })
    return response.data
  }

  public async getStockById(id: string): Promise<any> {
    const response = await this.client.get(`/stock/${id}`)
    return response.data
  }

  public async getStockByWarehouse(warehouseId: string): Promise<any> {
    const response = await this.client.get(`/stock/warehouse/${warehouseId}`)
    return response.data
  }

  public async getStockByProduct(productId: string): Promise<any> {
    const response = await this.client.get(`/stock/product/${productId}`)
    return response.data
  }

  public async getLowStockAlerts(): Promise<any> {
    const response = await this.client.get('/stock/alerts/low-stock')
    return response.data
  }

  public async getStockByInventory(inventoryId: string): Promise<any> {
    const response = await this.client.get(`/stock/inventory/${inventoryId}`)
    return response.data
  }

  // Stock Movement Management
  public async getAllMovements(params?: {
    page?: number
    limit?: number
    status?: string
    warehouseId?: string
    productId?: string
    type?: string
  }): Promise<any> {
    const response = await this.client.get('/stock-movements', { params })
    return response.data
  }

  public async getMovementById(id: string): Promise<any> {
    const response = await this.client.get(`/stock-movements/${id}`)
    return response.data
  }

  public async getMovementsByStatus(status: string): Promise<any> {
    const response = await this.client.get(`/stock-movements/status/${status}`)
    return response.data
  }

  public async getMovementsByWarehouse(warehouseId: string): Promise<any> {
    const response = await this.client.get(`/stock-movements/warehouse/${warehouseId}`)
    return response.data
  }

  public async getMovementsByProduct(productId: string): Promise<any> {
    const response = await this.client.get(`/stock-movements/product/${productId}`)
    return response.data
  }

  public async createMovement(movementData: any): Promise<any> {
    const response = await this.client.post('/stock-movements', movementData)
    return response.data
  }

  public async approveMovement(id: string): Promise<any> {
    const response = await this.client.put(`/stock-movements/${id}/approve`)
    return response.data
  }

  public async rejectMovement(id: string, reason: string): Promise<any> {
    const response = await this.client.put(`/stock-movements/${id}/reject`, { reason })
    return response.data
  }

  public async startMovement(id: string): Promise<any> {
    const response = await this.client.put(`/stock-movements/${id}/start`)
    return response.data
  }

  public async completeMovement(id: string): Promise<any> {
    const response = await this.client.put(`/stock-movements/${id}/complete`)
    return response.data
  }

  public async cancelMovement(id: string, reason: string): Promise<any> {
    const response = await this.client.put(`/stock-movements/${id}/cancel`, { reason })
    return response.data
  }

  public async getMovementRouteAlternatives(id: string): Promise<any> {
    const response = await this.client.get(`/stock-movements/${id}/route-alternatives`)
    return response.data
  }

  public async getMovementTracking(id: string): Promise<any> {
    const response = await this.client.get(`/stock-movements/${id}/tracking`)
    return response.data
  }

  // Inventory Management
  public async getInventories(params?: {
    page?: number
    limit?: number
    status?: string
  }): Promise<any> {
    const response = await this.client.get('/inventories', { params })
    return response.data
  }

  public async getInventoryById(id: string): Promise<any> {
    const response = await this.client.get(`/inventories/${id}`)
    return response.data
  }

  public async getInventoryStatistics(id: string): Promise<any> {
    const response = await this.client.get(`/inventories/${id}/statistics`)
    return response.data
  }

  public async getInventoryWarehouses(id: string): Promise<any> {
    const response = await this.client.get(`/inventories/${id}/warehouses`)
    return response.data
  }

  public async createInventory(inventoryData: any): Promise<any> {
    const response = await this.client.post('/inventories', inventoryData)
    return response.data
  }

  public async updateInventory(id: string, inventoryData: any): Promise<any> {
    const response = await this.client.put(`/inventories/${id}`, inventoryData)
    return response.data
  }

  public async deleteInventory(id: string): Promise<any> {
    const response = await this.client.delete(`/inventories/${id}`)
    return response.data
  }

  // User Management
  public async getUsers(params?: {
    page?: number
    limit?: number
    role?: string
    isActive?: boolean
  }): Promise<any> {
    const response = await this.client.get('/users', { params })
    return response.data
  }

  public async getUserById(id: string): Promise<any> {
    const response = await this.client.get(`/users/${id}`)
    return response.data
  }

  public async getUsersByRole(role: string): Promise<any> {
    const response = await this.client.get(`/users/role/${role}`)
    return response.data
  }

  public async createUser(userData: any): Promise<any> {
    const response = await this.client.post('/users', userData)
    return response.data
  }

  public async updateUser(id: string, userData: any): Promise<any> {
    const response = await this.client.put(`/users/${id}`, userData)
    return response.data
  }

  public async toggleUserStatus(id: string): Promise<any> {
    const response = await this.client.put(`/users/${id}/toggle-status`)
    return response.data
  }

  public async deleteUser(id: string): Promise<any> {
    const response = await this.client.delete(`/users/${id}`)
    return response.data
  }

  // Alert Management
  public async getAlerts(params?: {
    page?: number
    limit?: number
    severity?: string
    warehouseId?: string
    status?: string
  }): Promise<any> {
    const response = await this.client.get('/alerts', { params })
    return response.data
  }

  public async getAlertById(id: string): Promise<any> {
    const response = await this.client.get(`/alerts/${id}`)
    return response.data
  }

  public async getUnacknowledgedAlerts(): Promise<any> {
    const response = await this.client.get('/alerts/status/unacknowledged')
    return response.data
  }

  public async getUnresolvedAlerts(): Promise<any> {
    const response = await this.client.get('/alerts/status/unresolved')
    return response.data
  }

  public async getAlertsBySeverity(severity: string): Promise<any> {
    const response = await this.client.get(`/alerts/severity/${severity}`)
    return response.data
  }

  public async getAlertsByWarehouse(warehouseId: string): Promise<any> {
    const response = await this.client.get(`/alerts/warehouse/${warehouseId}`)
    return response.data
  }

  public async acknowledgeAlert(id: string, acknowledgedBy?: string): Promise<any> {
    const response = await this.client.put(`/alerts/${id}/acknowledge`, { acknowledgedBy })
    return response.data
  }

  public async resolveAlert(id: string, resolution: string): Promise<any> {
    const response = await this.client.put(`/alerts/${id}/resolve`, { resolution })
    return response.data
  }

  // Audit Log Management
  public async getAuditLogs(params?: {
    page?: number
    limit?: number
    userId?: string
    action?: string
    entityType?: string
    startDate?: string
    endDate?: string
  }): Promise<any> {
    const response = await this.client.get('/audit-logs', { params })
    return response.data
  }

  public async getAuditLogById(id: string): Promise<any> {
    const response = await this.client.get(`/audit-logs/${id}`)
    return response.data
  }

  public async getAuditLogsByUser(userId: string): Promise<any> {
    const response = await this.client.get(`/audit-logs/user/${userId}`)
    return response.data
  }

  public async getAuditLogsByEntity(entityType: string, entityId: string): Promise<any> {
    const response = await this.client.get(`/audit-logs/entity/${entityType}/${entityId}`)
    return response.data
  }

  public async getAuditLogsByAction(action: string): Promise<any> {
    const response = await this.client.get(`/audit-logs/action/${action}`)
    return response.data
  }

  public async getAuditLogsByDateRange(startDate: string, endDate: string): Promise<any> {
    const response = await this.client.get(`/audit-logs/date-range/${startDate}/${endDate}`)
    return response.data
  }

  // Emission Reports
  public async getEmissionReports(params?: {
    startDate?: string
    endDate?: string
    warehouseId?: string
    vehicleId?: string
  }): Promise<any> {
    const response = await this.client.get('/emissions/reports', { params })
    return response.data
  }

  public async getEmissionReportById(id: string): Promise<any> {
    const response = await this.client.get(`/emissions/reports/${id}`)
    return response.data
  }

  public async createEmissionReport(reportData: any): Promise<any> {
    const response = await this.client.post('/emissions/reports', reportData)
    return response.data
  }

  public async getEmissionsByVehicle(vehicleId: string): Promise<any> {
    const response = await this.client.get(`/emissions/vehicle/${vehicleId}`)
    return response.data
  }

  public async getEmissionsByTransportMode(mode: string): Promise<any> {
    const response = await this.client.get(`/emissions/transport-mode/${mode}`)
    return response.data
  }

  public async getEmissionTrends(startDate?: string, endDate?: string): Promise<any> {
    const params: any = {}
    if (startDate) params.startDate = startDate
    if (endDate) params.endDate = endDate
    const response = await this.client.get('/emissions/trends', { params })
    return response.data
  }

  // Route Optimization (Dedicated endpoints)
  public async optimizeRoutes(routeData: {
    origin: { warehouseId: string }
    destination: { warehouseId: string }
    productId: string
    quantity: number
    transportModes?: string[]
    weatherConsideration?: boolean
  }): Promise<any> {
    const response = await this.client.post('/routes/optimize', routeData)
    return response.data
  }

  public async compareTransportModes(routeData: {
    origin: { warehouseId: string }
    destination: { warehouseId: string }
    productId: string
    quantity: number
  }): Promise<any> {
    const response = await this.client.post('/routes/compare-modes', routeData)
    return response.data
  }

  public async getLiveRouteStatus(movementId: string): Promise<any> {
    const response = await this.client.get(`/routes/live-status/${movementId}`)
    return response.data
  }

  public async calculateRouteMetrics(routeData: {
    origin: { warehouseId: string }
    destination: { warehouseId: string }
    transportMode: string
    distance?: number
  }): Promise<any> {
    const response = await this.client.post('/routes/calculate-metrics', routeData)
    return response.data
  }

  // Auth permissions (RBAC)
  public async getUserPermissions(): Promise<any> {
    const response = await this.client.get('/auth/permissions')
    return response.data
  }

  // Legacy endpoints for backward compatibility
  public async getDashboardKPIs(): Promise<any> {
    return this.getSustainabilityMetrics()
  }

  public async getFleetStatus(): Promise<any> {
    return this.getVehicleUtilization()
  }

  public async getRouteEfficiencyAnalysis(): Promise<any> {
    return this.getRouteAnalytics()
  }

  // Route optimization (legacy)
  public async optimizeRoute(routeData: any): Promise<any> {
    // This is now handled by optimizeRoutes
    console.warn('optimizeRoute is deprecated. Use optimizeRoutes instead.')
    return this.optimizeRoutes(routeData)
  }

  // ============= Advanced Features =============

  // Clustering endpoints
  public clusters = {
    create: (data: { warehouseId: string; deliveryIds: string[]; epsilon?: number; minPoints?: number; scheduledDate?: string }) =>
      this.client.post('/clusters/create', data),
    
    getAll: (params?: { status?: string; warehouseId?: string; startDate?: string; endDate?: string }) =>
      this.client.get('/clusters', { params }),
    
    getById: (id: string) =>
      this.client.get(`/clusters/${id}`),
    
    assignVehicle: (id: string, vehicleId: string) =>
      this.client.put(`/clusters/${id}/assign-vehicle`, { vehicleId }),
    
    start: (id: string) =>
      this.client.put(`/clusters/${id}/start`),
    
    complete: (id: string) =>
      this.client.put(`/clusters/${id}/complete`),
    
    getAnalytics: (params?: { warehouseId?: string; startDate?: string; endDate?: string }) =>
      this.client.get('/clusters/analytics', { params })
  }

  // Simulation endpoints
  public simulation = {
    optimizeRoute: (data: {
      warehouseId: string;
      deliveryIds: string[];
      scenario?: 'fastest' | 'shortest' | 'eco' | 'balanced';
      vehicleType?: string;
      departureTime?: string;
    }) =>
      this.client.post('/simulation/route', data),
    
    assignVehicles: (data: {
      warehouseId: string;
      deliveryIds: string[];
      vehicleIds?: string[];
    }) =>
      this.client.post('/simulation/vehicle-assignment', data),
    
    forecastDemand: (data: {
      warehouseId: string;
      productId?: string;
      forecastPeriod?: number;
      growthRate?: number;
      seasonalityFactor?: number;
    }) =>
      this.client.post('/simulation/demand-forecast', data)
  }

  // Bulk operations endpoints
  public bulk = {
    uploadDeliveries: (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      return this.client.post('/bulk/deliveries/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    },
    
    uploadProducts: (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      return this.client.post('/bulk/products/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    },
    
    exportDeliveries: (params?: { status?: string; warehouseId?: string; startDate?: string; endDate?: string }) =>
      this.client.get('/bulk/deliveries/export', { params, responseType: 'blob' }),
    
    exportProducts: (params?: { category?: string; isActive?: boolean }) =>
      this.client.get('/bulk/products/export', { params, responseType: 'blob' }),
    
    exportStock: (params?: { warehouseId?: string; lowStock?: boolean }) =>
      this.client.get('/bulk/stock/export', { params, responseType: 'blob' }),
    
    getTemplate: (type: 'deliveries' | 'products' | 'stock') =>
      this.client.get(`/bulk/template/${type}`, { responseType: 'blob' })
  }

  // Generic request method for future endpoints
  public async request<T = any>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, data?: any): Promise<T> {
    const response = await this.client.request<T>({
      method,
      url,
      data,
    })
    return response.data
  }
}

// Create singleton instance
export const apiClient = new ApiClient()

// Export for convenience
export default apiClient