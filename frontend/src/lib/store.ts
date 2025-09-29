import { create } from 'zustand'

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
  currentDeliveryPlan: DeliveryPlan | null
  routes: Route[]
  isLoading: boolean
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning'
    message: string
    timestamp: Date
  }>
  
  // Actions
  setUser: (user: User | null) => void
  setCurrentDeliveryPlan: (plan: DeliveryPlan | null) => void
  addRoute: (route: Route) => void
  setLoading: (loading: boolean) => void
  addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  currentDeliveryPlan: null,
  routes: [],
  isLoading: false,
  notifications: [],
  
  setUser: (user) => set({ user }),
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
})) 