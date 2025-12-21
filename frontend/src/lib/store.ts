import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiClient } from './api'

// User type with combined roles from both systems
export interface User {
  id: string
  email: string
  name?: string
  firstName?: string
  lastName?: string
  role: 'admin' | 'inventory_manager' | 'warehouse_staff' | 'environment_manager' | 'auditor'
}

// SmartRoute Types
export interface Route {
  id: string
  source: string
  destinations: string[]
  vehicleType: 'diesel' | 'petrol' | 'ev'
  optimizedRoute: any
  emissions: number
  distance: number
  duration: number
  fuelConsumption: number
  createdAt: Date
}

export interface DeliveryPlan {
  id: string
  name: string
  routes: Route[]
  totalEmissions: number
  totalDistance: number
  totalDuration: number
  status: 'draft' | 'active' | 'completed'
  createdAt: Date
}

// Stock2Door Types
export interface Product {
  _id: string
  name: string
  sku: string
  category?: string
  uom?: string
  price: number
  minStock: number
  totalStock: number
  stockLevels?: Array<{
    warehouseId: string
    quantity: number
  }>
  createdAt: Date
}

export interface Warehouse {
  _id: string
  name: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  createdAt: Date
}

export interface Operation {
  _id: string
  type: 'receipt' | 'delivery' | 'transfer' | 'adjustment'
  productId: string
  quantity: number
  warehouseId: string
  status: 'pending' | 'validated' | 'cancelled'
  createdBy: string
  createdAt: Date
}

interface AppState {
  // Auth & User
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // SmartRoute State
  currentDeliveryPlan: DeliveryPlan | null
  routes: Route[]
  optimizationWeights: {
    emissionsWeight: number
    timeWeight: number
    costWeight: number
  }
  
  // Stock2Door State
  products: Product[]
  warehouses: Warehouse[]
  operations: Operation[]
  lowStockItems: Product[]
  
  // Notifications
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning'
    message: string
    timestamp: Date
  }>
  
  // Auth Actions
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  login: (email: string, password: string) => Promise<void>
  register: (data: { name?: string; firstName?: string; lastName?: string; email: string; password: string; role: string }) => Promise<void>
  logout: (showMessage?: boolean) => void
  checkAuth: () => Promise<void>
  
  // SmartRoute Actions
  setCurrentDeliveryPlan: (plan: DeliveryPlan | null) => void
  addRoute: (route: Route) => void
  updateOptimizationWeights: (weights: { emissionsWeight?: number; timeWeight?: number; costWeight?: number }) => void
  
  // Stock2Door Actions
  setProducts: (products: Product[]) => void
  setWarehouses: (warehouses: Warehouse[]) => void
  setOperations: (operations: Operation[]) => void
  setLowStockItems: (items: Product[]) => void
  addProduct: (product: Product) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  
  // Common Actions
  setLoading: (loading: boolean) => void
  addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      currentDeliveryPlan: null,
      routes: [],
      optimizationWeights: {
        emissionsWeight: 40,
        timeWeight: 35,
        costWeight: 25
      },
      products: [],
      warehouses: [],
      operations: [],
      lowStockItems: [],
      notifications: [],
      
      // Auth Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => {
        if (token) {
          apiClient.setToken(token)
        } else {
          apiClient.removeToken()
        }
        set({ token, isAuthenticated: !!token })
      },
      
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true })
          const response = await apiClient.login({ email, password })
          
          const { user, token } = response
          set({ 
            user: user as User, 
            token, 
            isAuthenticated: true, 
            isLoading: false 
          })
          
          apiClient.setToken(token)
          
          const userName = user.name || user.firstName || 'User'
          get().addNotification({
            type: 'success',
            message: `Welcome back, ${userName}!`
          })
        } catch (error: any) {
          set({ isLoading: false })
          
          let errorMessage = 'Login failed. Please try again.'
          
          if (error.response?.status === 401) {
            errorMessage = 'Invalid email or password. Please check your credentials.'
          } else if (error.response?.status === 404) {
            errorMessage = 'Account not found. Please check your email or register first.'
          } else if (error.response?.status === 429) {
            errorMessage = 'Too many login attempts. Please try again later.'
          } else if (error.response?.data?.error || error.response?.data?.message) {
            errorMessage = error.response.data.error || error.response.data.message
          } else if (error.code === 'NETWORK_ERROR' || !error.response) {
            errorMessage = 'Network error. Please check your connection and try again.'
          }
          
          get().addNotification({
            type: 'error',
            message: errorMessage
          })
          throw error
        }
      },
      
      register: async (data) => {
        try {
          set({ isLoading: true })
          const response = await apiClient.register(data)
          
          const { user, token } = response
          set({ 
            user: user as User, 
            token, 
            isAuthenticated: true, 
            isLoading: false 
          })
          
          apiClient.setToken(token)
          
          const userName = user.name || user.firstName || 'User'
          get().addNotification({
            type: 'success',
            message: `Welcome to Stock2Door, ${userName}!`
          })
        } catch (error: any) {
          set({ isLoading: false })
          
          let errorMessage = 'Registration failed. Please try again.'
          
          if (error.response?.status === 409) {
            errorMessage = 'An account with this email already exists. Please login instead.'
          } else if (error.response?.status === 400) {
            if (error.response.data?.details) {
              const validationErrors = error.response.data.details.map((err: any) => err.msg).join(', ')
              errorMessage = `Please fix the following: ${validationErrors}`
            } else {
              errorMessage = error.response.data?.error || error.response.data?.message || 'Invalid registration data.'
            }
          } else if (error.code === 'NETWORK_ERROR' || !error.response) {
            errorMessage = 'Network error. Please check your connection and try again.'
          }
          
          get().addNotification({
            type: 'error',
            message: errorMessage
          })
          throw error
        }
      },
      
      logout: (showMessage = true) => {
        apiClient.removeToken()
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          currentDeliveryPlan: null,
          routes: [],
          products: [],
          warehouses: [],
          operations: [],
          lowStockItems: []
        })
        if (showMessage) {
          get().addNotification({
            type: 'success',
            message: 'Logged out successfully'
          })
        }
      },
      
      checkAuth: async () => {
        try {
          const token = get().token
          if (!token) return
          
          const response = await apiClient.getMe()
          set({ user: response.user as User, isAuthenticated: true })
        } catch (error) {
          get().logout(false)
        }
      },
      
      // SmartRoute Actions
      setCurrentDeliveryPlan: (plan) => set({ currentDeliveryPlan: plan }),
      addRoute: (route) => set((state) => ({ routes: [...state.routes, route] })),
      updateOptimizationWeights: (weights) => set((state) => ({
        optimizationWeights: { ...state.optimizationWeights, ...weights }
      })),
      
      // Stock2Door Actions
      setProducts: (products) => set({ products }),
      setWarehouses: (warehouses) => set({ warehouses }),
      setOperations: (operations) => set({ operations }),
      setLowStockItems: (items) => set({ lowStockItems: items }),
      addProduct: (product) => set((state) => ({ products: [product, ...state.products] })),
      updateProduct: (id, product) => set((state) => ({
        products: state.products.map(p => p._id === id ? { ...p, ...product } : p)
      })),
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(p => p._id !== id)
      })),
      
      // Common Actions
      setLoading: (loading) => set({ isLoading: loading }),
      addNotification: (notification) => {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
        set((state) => ({
          notifications: [...state.notifications, {
            ...notification,
            id,
            timestamp: new Date()
          }]
        }))
      },
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'stock2door-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated,
        optimizationWeights: state.optimizationWeights
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          apiClient.setToken(state.token)
        }
      },
    }
  )
) 