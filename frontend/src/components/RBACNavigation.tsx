'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  MapIcon, 
  ChartBarIcon, 
  TruckIcon, 
  CogIcon, 
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  GlobeAltIcon,
  ClipboardDocumentCheckIcon,
  BuildingStorefrontIcon,
  CubeIcon,
  DocumentTextIcon,
  ArchiveBoxIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/store'
import { getNavigationForRole, FEATURES } from '@/lib/rbac'

const iconMap: Record<string, any> = {
  audit_reports: ClipboardDocumentCheckIcon,
  company_audit: DocumentTextIcon,
  view_goods: CubeIcon,
  add_goods: ArchiveBoxIcon,
  manage_warehouse: BuildingStorefrontIcon,
  manage_locations: MapIcon,
  view_reports: DocumentTextIcon,
  receipts: DocumentTextIcon,
  invoice_generation: DocumentTextIcon,
  deliveries: TruckIcon,
  smart_route: MapIcon,
  move_history: ClipboardDocumentCheckIcon,
  internal_transfer: ArrowsRightLeftIcon,
  adjustments: CogIcon,
  user_management: UserIcon,
  analytics: ChartBarIcon,
  fleet_management: TruckIcon,
  sustainability: GlobeAltIcon,
  emission_tracking: GlobeAltIcon,
}

export default function RBACNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAppStore()

  const handleLogout = () => {
    logout(true)
    router.push('/')
  }

  if (!user) {
    return null
  }

  const navigation = getNavigationForRole(user.role)

  return (
    <nav className="bg-primary shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-accent rounded-lg flex items-center justify-center">
                <MapIcon className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-white font-semibold text-lg">Stock2Door</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.sections.map((section) => (
              <div key={section.title} className="relative group">
                <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-primary/80 transition-colors">
                  {section.title}
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown */}
                <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    {section.items.map((item) => {
                      const Icon = iconMap[item.feature] || MapIcon
                      const isActive = pathname === item.path
                      
                      return (
                        <Link
                          key={item.path}
                          href={item.path}
                          className={cn(
                            'flex items-center px-4 py-2 text-sm transition-colors',
                            isActive
                              ? 'bg-accent text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          )}
                        >
                          <Icon className="h-5 w-5 mr-3" />
                          {item.name}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white text-sm font-medium">
                  {user.firstName || user.username}
                </p>
                <p className="text-gray-300 text-xs capitalize">
                  {user.role.replace('_', ' ')}
                </p>
              </div>
              <div className="h-10 w-10 bg-accent rounded-full flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-white" />
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white transition-colors p-2 hover:bg-primary/80 rounded-md"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              type="button"
              className="text-gray-300 hover:text-white p-2"
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
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-primary/95 max-h-[80vh] overflow-y-auto">
            {navigation.sections.map((section) => (
              <div key={section.title} className="mb-4">
                <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {section.title}
                </div>
                {section.items.map((item) => {
                  const Icon = iconMap[item.feature] || MapIcon
                  const isActive = pathname === item.path
                  
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={cn(
                        'flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors',
                        isActive
                          ? 'bg-accent text-white'
                          : 'text-gray-300 hover:text-white hover:bg-primary/80'
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            ))}
            
            {/* Mobile User Section */}
            <div className="border-t border-gray-700 pt-4 mt-4">
              <div className="flex items-center px-3 py-2 mb-2">
                <div className="h-10 w-10 bg-accent rounded-full flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-white text-sm font-medium">
                    {user.firstName || user.username}
                  </p>
                  <p className="text-gray-300 text-xs capitalize">
                    {user.role.replace('_', ' ')}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-primary/80 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
