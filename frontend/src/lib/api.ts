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
    name: string
    role: string
  }
  token: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  role: string
}

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
      timeout: 10000,
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

  // Analytics endpoints
  public async getDashboardKPIs(): Promise<any> {
    const response = await this.client.get('/v1/analytics/dashboard')
    return response.data
  }

  public async getFleetStatus(): Promise<any> {
    const response = await this.client.get('/v1/analytics/fleet-status')
    return response.data
  }

  public async getRecentActivities(limit?: number): Promise<any> {
    const params = limit ? { limit } : {}
    const response = await this.client.get('/v1/analytics/recent-activities', { params })
    return response.data
  }

  public async getTimeSeriesData(timeRange?: string, metric?: string): Promise<any> {
    const params: any = {}
    if (timeRange) params.timeRange = timeRange
    if (metric) params.metric = metric
    const response = await this.client.get('/v1/analytics/time-series', { params })
    return response.data
  }

  public async getRouteEfficiencyAnalysis(): Promise<any> {
    const response = await this.client.get('/v1/analytics/route-efficiency')
    return response.data
  }

  // Vehicle endpoints
  public async getVehicles(): Promise<any> {
    const response = await this.client.get('/v1/vehicles')
    return response.data
  }

  public async createVehicle(vehicleData: any): Promise<any> {
    const response = await this.client.post('/v1/vehicles', vehicleData)
    return response.data
  }

  public async updateVehicle(id: string, vehicleData: any): Promise<any> {
    const response = await this.client.put(`/v1/vehicles/${id}`, vehicleData)
    return response.data
  }

  public async deleteVehicle(id: string): Promise<any> {
    const response = await this.client.delete(`/v1/vehicles/${id}`)
    return response.data
  }

  // Delivery endpoints
  public async getDeliveries(): Promise<any> {
    const response = await this.client.get('/v1/deliveries')
    return response.data
  }

  public async createDelivery(deliveryData: any): Promise<any> {
    const response = await this.client.post('/v1/deliveries', deliveryData)
    return response.data
  }

  // Route optimization endpoints
  public async optimizeRoute(routeData: {
    source: string;
    destination: string;
    vehicleType?: 'LCV' | 'MCV' | 'HCV' | 'THREE_WHEELER';
    fuelType?: 'DIESEL' | 'PETROL' | 'CNG' | 'ELECTRIC';
    includeWeather?: boolean;
    includeAlternatives?: boolean;
  }): Promise<any> {
    const response = await this.client.post('/v1/optimize-route/optimize', routeData)
    return response.data
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