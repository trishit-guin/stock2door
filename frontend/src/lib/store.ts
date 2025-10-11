import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiClient } from './api'

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'logistics_manager' | 'fleet_operator' | 'sustainability_officer'
}

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

interface AppState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  currentDeliveryPlan: DeliveryPlan | null
  routes: Route[]
  isLoading: boolean
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
  register: (name: string, email: string, password: string, role: string) => Promise<void>
  logout: (showMessage?: boolean) => void
  checkAuth: () => Promise<void>
  
  // Other Actions
  setCurrentDeliveryPlan: (plan: DeliveryPlan | null) => void
  addRoute: (route: Route) => void
  setLoading: (loading: boolean) => void
  addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      currentDeliveryPlan: null,
      routes: [],
      isLoading: false,
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
          
          get().addNotification({
            type: 'success',
            message: `Welcome back, ${user.name}!`
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
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error
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
      
      register: async (name: string, email: string, password: string, role: string) => {
        try {
          set({ isLoading: true })
          const response = await apiClient.register({ name, email, password, role })
          
          const { user, token } = response
          set({ 
            user: user as User, 
            token, 
            isAuthenticated: true, 
            isLoading: false 
          })
          
          apiClient.setToken(token)
          
          get().addNotification({
            type: 'success',
            message: `Welcome to SmartRoute, ${user.name}!`
          })
        } catch (error: any) {
          set({ isLoading: false })
          
          let errorMessage = 'Registration failed. Please try again.'
          
          if (error.response?.status === 409) {
            errorMessage = 'An account with this email already exists. Please login instead.'
          } else if (error.response?.status === 400) {
            if (error.response.data?.details) {
              // Validation errors
              const validationErrors = error.response.data.details.map((err: any) => err.msg).join(', ')
              errorMessage = `Please fix the following: ${validationErrors}`
            } else {
              errorMessage = error.response.data?.error || 'Invalid registration data.'
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
          routes: []
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
          // Token is invalid, clear auth state silently (no success message)
          get().logout(false)
        }
      },
      
      // Other Actions
      setCurrentDeliveryPlan: (plan) => set({ currentDeliveryPlan: plan }),
      addRoute: (route) => set((state) => ({ routes: [...state.routes, route] })),
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
      clearNotifications: () => set({ notifications: [] })
    }),
    {
      name: 'smartroute-auth',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
      onRehydrateStorage: () => (state) => {
        // Restore token to API client when store is hydrated
        if (state?.token) {
          apiClient.setToken(state.token)
        }
      },
    }
  )
) 