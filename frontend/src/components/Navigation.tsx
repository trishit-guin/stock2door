'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  MapIcon, 
  ChartBarIcon, 
  TruckIcon, 
  CogIcon, 
  UserIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/store'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
  { name: 'Route Optimizer', href: '/dashboard/optimizer', icon: MapIcon },
  { name: 'Fleet Management', href: '/dashboard/fleet', icon: TruckIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: CogIcon },
]

const adminNavigation = [
  { name: 'Simulation', href: '/dashboard/simulation', icon: CogIcon },
]

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useAppStore()

  const allNavigation = user?.role === 'admin' 
    ? [...navigation, ...adminNavigation]
    : navigation

  return (
    <nav className="bg-primary shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-accent rounded-lg flex items-center justify-center">
                <MapIcon className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-white font-semibold text-lg">SmartRoute</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {allNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-accent text-white'
                      : 'text-gray-300 hover:text-white hover:bg-primary/80'
                  )}
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.name}
                </Link>
              )
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 text-sm">
                {user?.name || 'Guest'}
              </span>
              <div className="h-8 w-8 bg-accent rounded-full flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="text-gray-300 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-primary/95">
            {allNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors',
                    isActive
                      ? 'bg-accent text-white'
                      : 'text-gray-300 hover:text-white hover:bg-primary/80'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
            <div className="pt-4 border-t border-gray-600">
              <div className="flex items-center px-3 py-2">
                <UserIcon className="h-5 w-5 text-gray-300 mr-3" />
                <span className="text-gray-300 text-sm">
                  {user?.name || 'Guest'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
} 