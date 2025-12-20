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
  name?: string
  firstName?: string
  lastName?: string
  email: string
  password: string
  role: string
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
          // Only auto-redirect if we're not on the auth page and have an invalid token
          // Don't redirect for failed login/register attempts
          const isAuthPage = typeof window !== 'undefined' && window.location.pathname === '/auth'
          const isLoginOrRegister = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register')
          
          if (!isAuthPage && !isLoginOrRegister) {
            // Clear token and redirect to login only for authenticated routes with invalid tokens
            this.removeToken()
            if (typeof window !== 'undefined') {
              window.location.href = '/auth'
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
    return response.data
  }

  public async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.client.post('/auth/register', userData)
    return response.data
  }

  public async getMe(): Promise<any> {
    const response = await this.client.get('/auth/me')
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
    // This is now handled by optimizeDeliveryRoute
    console.warn('optimizeRoute is deprecated. Use optimizeDeliveryRoute instead.')
    return this.optimizeDeliveryRoute(routeData.deliveryId, routeData)
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