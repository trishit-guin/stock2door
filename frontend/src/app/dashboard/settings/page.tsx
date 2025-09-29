'use client'

import { useState } from 'react'
import { 
  UserIcon, 
  CogIcon, 
  BellIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import { useAppStore } from '@/lib/store'

interface Settings {
  notifications: {
    email: boolean
    push: boolean
    weather: boolean
    maintenance: boolean
  }
  preferences: {
    theme: 'light' | 'dark' | 'auto'
    language: string
    timezone: string
    units: 'metric' | 'imperial'
  }
  optimization: {
    emissionsWeight: number
    timeWeight: number
    costWeight: number
    weatherAware: boolean
    evCompatible: boolean
  }
}

export default function SettingsPage() {
  const { user, addNotification } = useAppStore()
  const [settings, setSettings] = useState<Settings>({
    notifications: {
      email: true,
      push: true,
      weather: true,
      maintenance: false
    },
    preferences: {
      theme: 'light',
      language: 'en',
      timezone: 'UTC',
      units: 'metric'
    },
    optimization: {
      emissionsWeight: 40,
      timeWeight: 35,
      costWeight: 25,
      weatherAware: true,
      evCompatible: true
    }
  })

  const handleSave = () => {
    addNotification({
      type: 'success',
      message: 'Settings saved successfully!'
    })
  }

  const updateOptimizationWeight = (type: keyof Settings['optimization'], value: number) => {
    setSettings(prev => ({
      ...prev,
      optimization: {
        ...prev.optimization,
        [type]: value
      }
    }))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">
          Settings
        </h1>
        <p className="text-text-secondary mt-2">
          Manage your account preferences and system configuration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <div className="card">
            <nav className="space-y-2">
              <a href="#profile" className="flex items-center px-3 py-2 text-sm font-medium text-accent bg-accent/10 rounded-lg">
                <UserIcon className="h-5 w-5 mr-3" />
                Profile
              </a>
              <a href="#notifications" className="flex items-center px-3 py-2 text-sm font-medium text-text-primary hover:text-accent hover:bg-accent/5 rounded-lg">
                <BellIcon className="h-5 w-5 mr-3" />
                Notifications
              </a>
              <a href="#preferences" className="flex items-center px-3 py-2 text-sm font-medium text-text-primary hover:text-accent hover:bg-accent/5 rounded-lg">
                <CogIcon className="h-5 w-5 mr-3" />
                Preferences
              </a>
              <a href="#optimization" className="flex items-center px-3 py-2 text-sm font-medium text-text-primary hover:text-accent hover:bg-accent/5 rounded-lg">
                <ChartBarIcon className="h-5 w-5 mr-3" />
                Optimization
              </a>
              <a href="#security" className="flex items-center px-3 py-2 text-sm font-medium text-text-primary hover:text-accent hover:bg-accent/5 rounded-lg">
                <ShieldCheckIcon className="h-5 w-5 mr-3" />
                Security
              </a>
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Settings */}
          <div id="profile" className="card">
            <h2 className="text-xl font-semibold text-text-primary mb-6">
              Profile Information
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-text-primary">{user?.name}</h3>
                  <p className="text-sm text-text-secondary">{user?.email}</p>
                  <p className="text-xs text-text-secondary capitalize">{user?.role?.replace('_', ' ')}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div id="notifications" className="card">
            <h2 className="text-xl font-semibold text-text-primary mb-6">
              Notification Preferences
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text-primary">Email Notifications</h3>
                  <p className="text-sm text-text-secondary">Receive updates via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, email: e.target.checked }
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text-primary">Push Notifications</h3>
                  <p className="text-sm text-text-secondary">Real-time alerts in browser</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.push}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, push: e.target.checked }
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text-primary">Weather Alerts</h3>
                  <p className="text-sm text-text-secondary">Route weather warnings</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.weather}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, weather: e.target.checked }
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div id="preferences" className="card">
            <h2 className="text-xl font-semibold text-text-primary mb-6">
              Display Preferences
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Theme
                </label>
                <select
                  value={settings.preferences.theme}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, theme: e.target.value as any }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Units
                </label>
                <select
                  value={settings.preferences.units}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, units: e.target.value as any }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                >
                  <option value="metric">Metric (km, kg)</option>
                  <option value="imperial">Imperial (mi, lb)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Optimization Settings */}
          <div id="optimization" className="card">
            <h2 className="text-xl font-semibold text-text-primary mb-6">
              Route Optimization Weights
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Emissions Priority: {settings.optimization.emissionsWeight}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.optimization.emissionsWeight}
                  onChange={(e) => updateOptimizationWeight('emissionsWeight', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <p className="text-sm text-text-secondary mt-1">
                  Higher values prioritize lower emissions over time and cost
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Time Priority: {settings.optimization.timeWeight}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.optimization.timeWeight}
                  onChange={(e) => updateOptimizationWeight('timeWeight', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <p className="text-sm text-text-secondary mt-1">
                  Higher values prioritize faster delivery times
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Cost Priority: {settings.optimization.costWeight}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.optimization.costWeight}
                  onChange={(e) => updateOptimizationWeight('costWeight', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <p className="text-sm text-text-secondary mt-1">
                  Higher values prioritize lower fuel and operational costs
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text-primary">Weather-Aware Routing</h3>
                  <p className="text-sm text-text-secondary">Avoid adverse weather conditions</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.optimization.weatherAware}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      optimization: { ...prev.optimization, weatherAware: e.target.checked }
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text-primary">EV Compatibility</h3>
                  <p className="text-sm text-text-secondary">Optimize for electric vehicle charging</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.optimization.evCompatible}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      optimization: { ...prev.optimization, evCompatible: e.target.checked }
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="bg-accent text-white px-8 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 